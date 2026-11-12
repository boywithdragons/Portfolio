import { searchKnowledgeBase, RAG_FALLBACK } from "../lib/rag";

const questions: Array<{ q: string; expect: string | null }> = [
  { q: "Who is Aditya?", expect: "profile-about" },
  { q: "Tell me about yourself", expect: "profile-about" },
  { q: "What does Aditya do right now?", expect: "profile-role" },
  { q: "What do you do for work?", expect: "profile-role" },
  { q: "What projects has Aditya built?", expect: "projects-overview" },
  { q: "Tell me about OpsPulse", expect: "projects-ops-pulse" },
  { q: "Tell me about TicketTriage AI", expect: "projects-ticket-triage" },
  { q: "What is this website built with?", expect: "projects-portfolio" },
  { q: "What are Aditya's technical skills?", expect: "skills-overview" },
  { q: "Does he know Python?", expect: "skills-python" },
  { q: "Is Aditya good at SQL?", expect: "skills-sql" },
  { q: "What BI tools does he use?", expect: "skills-bi" },
  { q: "What AI experience do you have?", expect: "skills-ai" },
  { q: "How can I contact Aditya?", expect: "profile-contact" },
  { q: "Is Aditya available for new opportunities?", expect: "profile-availability" },
  { q: "What is Aditya's education?", expect: "profile-education" },
  { q: "What certifications does he have?", expect: "profile-certifications" },
  { q: "Tell me about his Wipro role", expect: "exp-wipro" },
  { q: "How many years of experience does he have?", expect: "exp-experience-total" },
  { q: "What was his first job?", expect: "exp-vserv" },
  { q: "What is his salary expectation?", expect: "faq-salary" },
  { q: "Where is Aditya based?", expect: "faq-location" },
  { q: "Tell me something fun", expect: "faq-fun-facts" },
  { q: "What languages does he speak?", expect: "profile-languages" },
  { q: "How does this search work?", expect: "faq-how-this-works" },
  { q: "hello", expect: "faq-greeting" },
  { q: "Can I download the resume?", expect: "profile-resume" },
  { q: "What is the capital of France?", expect: null },
  { q: "Do you like pizza?", expect: null },
  { q: "What is the weather in Hyderabad?", expect: null },
  { q: "Tell me a joke", expect: null },
  { q: "asdfghjkl", expect: null },
];

let failures = 0;

for (const test of questions) {
  const result = searchKnowledgeBase(test.q);
  const actual = result?.entry.id ?? null;
  const ok = actual === test.expect;
  if (!ok) failures += 1;
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${JSON.stringify(test.q).padEnd(44)} -> ${actual ?? "FALLBACK"}${result ? `  (${result.score.toFixed(2)})` : ""}`,
  );
}

console.log(`\n${questions.length - failures}/${questions.length} passed.`);
if (failures > 0) {
  console.log(`\nFallback text:\n${RAG_FALLBACK}`);
  process.exitCode = 1;
}
