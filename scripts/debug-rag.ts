import { rankKnowledgeBase } from "../lib/rag";

for (const query of ["What AI experience do you have?", "Tell me about his Wipro role"]) {
  console.log(`\n${query}`);
  for (const result of rankKnowledgeBase(query).slice(0, 6)) {
    console.log(
      `  ${result.entry.id.padEnd(28)} score=${result.score.toFixed(3)} coverage=${result.coverage.toFixed(3)} terms=${result.matchedTerms.join(",")}`,
    );
  }
}
