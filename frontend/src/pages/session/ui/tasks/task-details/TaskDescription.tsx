function renderInlineText(text: string) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-muted/50 px-1 py-0.5 font-mono text-[13px] text-foreground/85"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function TaskDescription({ text }: { text: string }) {
  const lines = text
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const looksLikeList =
    lines.length > 1 || /^[-•*]\s/.test(text) || /^\d+\.\s/.test(text);

  if (!looksLikeList) {
    return (
      <p className="text-[15px] leading-[1.65] text-muted-foreground">
        {renderInlineText(text)}
      </p>
    );
  }

  return (
    <ul className="list-disc space-y-1.5 pl-4 text-[15px] leading-[1.65] text-muted-foreground marker:text-muted-foreground/35">
      {lines.map((line, i) => (
        <li key={i}>
          {renderInlineText(
            line.replace(/^[-•*]\s*/, "").replace(/^\d+\.\s*/, ""),
          )}
        </li>
      ))}
    </ul>
  );
}
