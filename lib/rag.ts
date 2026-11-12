import { knowledgeBase } from "@/lib/knowledge";
import type { KnowledgeEntry } from "@/lib/types";

/**
 * A deliberately small, dependency-free retrieval engine.
 *
 * Design goals:
 *  - Answer only from data/knowledge-base (no generation, no hallucination).
 *  - Be predictable and explainable: TF-IDF over curated entries + keyword boosts.
 *  - Fail closed: below the confidence threshold, show the fixed fallback.
 */

export const RAG_FALLBACK =
  "Answer to the asked question is not available. Please chat or send an email to Aditya using the below mentioned Contact option.";

export const RAG_CONFIDENCE_THRESHOLD = 0.62;

const STOPWORDS = new Set(
  `a an the and or but if then than that this these those there here of in on at to for from by with without
   is are was were be been being am do does did done doing have has had having i me my mine we us our you your yours
   he him his she her hers it its they them their what which who whom whose when where why how all any both each
   few more most other some such only own same so too very can could will would shall should may might must
   please tell about into over under again further once just also as up down out off nor not no yes ok okay
   know like want need get got make makes made let lets im ive id youre dont doesnt isnt arent wasnt cant couldnt
   good great best use using used really also many much`
    .split(/\s+/)
    .filter(Boolean),
);

const PHRASE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bwhat do you do\b/g, "current role work"],
  [/\bwhat does (he|aditya) do\b/g, "current role work"],
  [/\btell me about yourself\b/g, "about aditya"],
  [/\bwho are you\b/g, "about aditya"],
  [/\bwhat is your name\b/g, "name aditya"],
  [/\bhow are you\b/g, "greeting hi"],
  [/\bget in touch\b/g, "contact"],
  [/\breach out\b/g, "contact"],
  [/\bhow does (this|it) work\b/g, "how does this assistant work"],
  [/\bhow does the search bar work\b/g, "how does this assistant work"],
  [/\bwhat is this (site|website|portfolio)\b/g, "portfolio os website"],
  [/\bwhy should (we|i) hire (you|aditya|him)\b/g, "why hire strengths"],
  [/\bfirst job\b/g, "vserv"],
  [/\bfirst role\b/g, "vserv"],
];

const TOKEN_ALIASES: Record<string, string[]> = {
  cv: ["resume"],
  genai: ["generative", "ai"],
  llm: ["ai", "generative"],
  llms: ["ai", "generative"],
  chatbot: ["assistant", "rag"],
  bot: ["assistant", "automation"],
  tech: ["skills"],
  stack: ["skills"],
  tool: ["skills"],
  tools: ["skills"],
  toolkit: ["skills"],
  technologies: ["skills"],
  technology: ["skills"],
  built: ["projects"],
  build: ["projects"],
  created: ["projects"],
  create: ["projects"],
  job: ["experience"],
  jobs: ["experience"],
  role: ["experience"],
  career: ["experience"],
  worked: ["experience"],
  working: ["experience", "work"],
  employer: ["company"],
  company: ["company"],
  dashboard: ["dashboard", "reporting"],
  dashboards: ["dashboard", "reporting"],
  report: ["reporting"],
  reports: ["reporting"],
  reportsautomation: ["automation"],
  mttr: ["resolution", "time"],
  tat: ["resolution", "time"],
  nsat: ["satisfaction"],
  kpis: ["kpi"],
  kpi: ["kpi", "reporting"],
  certification: ["certification", "certified"],
  certified: ["certification"],
  education: ["education", "degree"],
  college: ["education", "university"],
  school: ["education"],
  degree: ["education", "bca", "diploma"],
  based: ["location"],
  located: ["location"],
  live: ["location"],
  place: ["location"],
  mail: ["email"],
  mails: ["email"],
  phone: ["phone", "contact"],
  call: ["phone", "contact"],
  linkedin: ["linkedin", "contact"],
  github: ["github", "contact"],
  hobby: ["fun", "facts"],
  hobbies: ["fun", "facts"],
  personal: ["fun", "about"],
  ai: ["ai", "generative"],
  rag: ["rag", "retrieval"],
  sql: ["sql", "query", "database"],
  bi: ["bi", "power", "reporting"],
  powerbi: ["power", "bi"],
  nextjs: ["nextjs", "react", "frontend"],
  react: ["react", "frontend"],
  python: ["python", "pandas"],
  excel: ["excel", "sheets"],
};

interface Doc {
  entry: KnowledgeEntry;
  tf: Map<string, number>;
  tokens: Set<string>;
  strongTokens: Set<string>;
  keywordTokens: string[][];
  titleTokens: string[];
  norm: number;
}

export interface SearchResult {
  entry: KnowledgeEntry;
  score: number;
  coverage: number;
  matchedTerms: string[];
}

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\bc\+\+/g, " cpp ")
    .replace(/\bc#/g, " csharp ")
    .replace(/\bnext\.js\b/g, " nextjs ")
    .replace(/\bnode\.js\b/g, " nodejs ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9'\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stem(token: string): string {
  if (token.length <= 4 || /\d/.test(token)) return token;
  if (/(ss|us|sis)$/.test(token)) return token;
  if (token.endsWith("ies") && token.length > 5) return `${token.slice(0, -3)}y`;
  if (token.endsWith("ing") && token.length > 6) return token.slice(0, -3);
  if (token.endsWith("ed") && token.length > 5) return token.slice(0, -2);
  if (token.endsWith("es") && token.length > 5) return token.slice(0, -2);
  if (token.endsWith("s")) return token.slice(0, -1);
  return token;
}

function tokenize(input: string): string[] {
  const normalized = normalizeText(input);
  if (!normalized) return [];
  const raw = normalized.split(" ").filter(Boolean);
  const tokens: string[] = [];

  for (const token of raw) {
    if (STOPWORDS.has(token)) continue;
    const stemmed = stem(token);
    if (!stemmed || STOPWORDS.has(stemmed)) continue;
    tokens.push(stemmed);
    const aliases = TOKEN_ALIASES[token];
    if (aliases) {
      for (const alias of aliases) {
        const aliasToken = stem(alias);
        if (!STOPWORDS.has(aliasToken)) tokens.push(aliasToken);
      }
    }
  }

  return tokens;
}

function prepareQuery(input: string): string[] {
  let normalized = normalizeText(input);
  for (const [pattern, replacement] of PHRASE_REPLACEMENTS) {
    normalized = normalized.replace(pattern, replacement);
  }
  return Array.from(new Set(tokenize(normalized)));
}

function makeDoc(entry: KnowledgeEntry): Doc {
  const tf = new Map<string, number>();
  const add = (text: string, weight: number) => {
    const tokens = tokenize(text);
    for (const token of tokens) tf.set(token, (tf.get(token) ?? 0) + weight);
  };

  add(entry.title, 3);
  add(entry.keywords.join(" "), 3);
  add(entry.question ?? "", 2);
  add(entry.answer, 1);
  add(entry.category, 1);

  const tokens = new Set(tf.keys());
  const strongTokens = new Set([
    ...tokenize(entry.title),
    ...tokenize(entry.keywords.join(" ")),
    ...tokenize(entry.question ?? ""),
    ...tokenize(entry.category),
  ]);
  const keywordTokens = entry.keywords.map((keyword) => tokenize(keyword)).filter((parts) => parts.length > 0);
  const titleTokens = tokenize(entry.title);

  let squared = 0;
  for (const value of tf.values()) squared += value * value;

  return {
    entry,
    tf,
    tokens,
    strongTokens,
    keywordTokens,
    titleTokens,
    norm: Math.sqrt(squared),
  };
}

let cachedDocs: Doc[] | null = null;
let cachedIdf: Map<string, number> | null = null;

function getIndex(): { docs: Doc[]; idf: Map<string, number> } {
  if (cachedDocs && cachedIdf) return { docs: cachedDocs, idf: cachedIdf };

  const docs = knowledgeBase.map(makeDoc);
  const docFreq = new Map<string, number>();

  for (const doc of docs) {
    for (const token of doc.tokens) {
      docFreq.set(token, (docFreq.get(token) ?? 0) + 1);
    }
  }

  const idf = new Map<string, number>();
  const total = docs.length;
  for (const [token, freq] of docFreq) {
    idf.set(token, Math.log((total + 1) / (freq + 1)) + 1);
  }

  cachedDocs = docs;
  cachedIdf = idf;
  return { docs, idf };
}

function idfFor(token: string, idf: Map<string, number>): number {
  return idf.get(token) ?? Math.log(knowledgeBase.length + 1) + 1;
}

export function rankKnowledgeBase(query: string): SearchResult[] {
  const queryTokens = prepareQuery(query);
  if (queryTokens.length === 0) return [];

  const { docs, idf } = getIndex();
  const querySet = new Set(queryTokens);
  const totalIdf = queryTokens.reduce((sum, token) => sum + idfFor(token, idf), 0);
  const results: SearchResult[] = [];

  for (const doc of docs) {
    let matchedIdf = 0;
    const matchedTerms: string[] = [];

    for (const token of queryTokens) {
      if (doc.tokens.has(token)) {
        // Tokens that appear only in the answer are weaker evidence than tokens the
        // curator put in the title, keywords, or question. This stops long summary
        // answers from matching every possible query.
        matchedIdf += idfFor(token, idf) * (doc.strongTokens.has(token) ? 1 : 0.35);
        matchedTerms.push(token);
      }
    }

    if (matchedTerms.length === 0) continue;

    const coverage = totalIdf > 0 ? matchedIdf / totalIdf : 0;

    let keywordBonus = 0;
    for (const parts of doc.keywordTokens) {
      if (parts.every((token) => querySet.has(token))) {
        keywordBonus = 0.3;
        break;
      }
    }

    const titleMatches = doc.titleTokens.filter((token) => querySet.has(token)).length;
    const titleBonus = doc.titleTokens.length > 0 ? 0.12 * (titleMatches / queryTokens.length) : 0;

    // Scale bonuses by coverage so a single incidental overlap cannot pass the threshold.
    const score = coverage * (0.9 + keywordBonus) + titleBonus;

    results.push({
      entry: doc.entry,
      score,
      coverage,
      matchedTerms,
    });
  }

  return results.sort((a, b) => b.score - a.score);
}

export function searchKnowledgeBase(query: string): SearchResult | null {
  const [best] = rankKnowledgeBase(query);
  if (!best || best.score < RAG_CONFIDENCE_THRESHOLD) return null;
  return best;
}

/** Useful for debugging and the footer "knowledge base" stat. */
export function getKnowledgeStats() {
  return {
    entries: knowledgeBase.length,
    categories: new Set(knowledgeBase.map((entry) => entry.category)).size,
    threshold: RAG_CONFIDENCE_THRESHOLD,
  };
}
