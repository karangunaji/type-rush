export const WORDS = [
  "the", "quick", "brown", "fox", "jumps",
  "over", "lazy", "dog", "keyboard", "speed",
  "typing", "practice", "future", "success", "coding",
  "react", "nextjs", "performance", "developer", "challenge",
  "focus", "learn", "improve", "create", "build"
];

export function generateText(wordCount = 40): string {
  return Array.from({ length: wordCount }, () =>
    WORDS[Math.floor(Math.random() * WORDS.length)]
  ).join(" ");
}