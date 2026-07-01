/** LLMs often emit LaTeX arrows; keep assistant UI plain text. */
export function normalizeAssistantText(text: string): string {
  return text
    .replace(/\$\\rightarrow\$/g, "->")
    .replace(/\$\\leftarrow\$/g, "<-")
    .replace(/\$\\Rightarrow\$/g, "=>")
    .replace(/\$\\Leftarrow\$/g, "<=")
    .replace(/→/g, "->")
    .replace(/←/g, "<-")
    .replace(/⇒/g, "=>");
}