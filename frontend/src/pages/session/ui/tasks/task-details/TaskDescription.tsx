function InlineText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);

  return parts.flatMap((part, index) => {
    if (!part) return [];

    if (part.startsWith("`") && part.endsWith("`")) {
      return [
        <code
          key={`code-${index}-${part}`}
          className="rounded bg-muted/50 px-1 py-0.5 font-mono text-[13px] text-foreground/85"
        >
          {part.slice(1, -1)}
        </code>,
      ];
    }

    return [
      <span key={`text-${index}-${part.slice(0, 12)}`}>{part}</span>,
    ];
  });
}

export function TaskDescription({ text }: { text: string }) {
  const lines = text.split(/\n/).flatMap((line) => {
    const trimmed = line.trim();
    return trimmed ? [trimmed] : [];
  });
  const looksLikeList =
    lines.length > 1 || /^[-•*]\s/.test(text) || /^\d+\.\s/.test(text);

  if (!looksLikeList) {
    return (
      <p className="text-[15px] leading-[1.65] text-muted-foreground">
        <InlineText text={text} />
      </p>
    );
  }

  return (
    <ul className="list-disc space-y-1.5 pl-4 text-[15px] leading-[1.65] text-muted-foreground marker:text-muted-foreground/35">
      {lines.map((line) => {
        const normalizedLine = line
          .replace(/^[-•*]\s*/, "")
          .replace(/^\d+\.\s*/, "");

        return (
          <li key={normalizedLine}>
            <InlineText text={normalizedLine} />
          </li>
        );
      })}
    </ul>
  );
}
