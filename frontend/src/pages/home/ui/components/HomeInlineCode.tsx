import type { ReactNode } from "react";

type HomeInlineCodeProps = {
  children: ReactNode;
};

/** Amber monospace chip — как DocsInlineCode, для тёмного лендинга. */
export function HomeInlineCode({ children }: HomeInlineCodeProps) {
  return (
    <code className="rounded bg-amber-500/10 px-1.5 py-0.5 font-mono text-[0.85em] text-amber-300">
      {children}
    </code>
  );
}
