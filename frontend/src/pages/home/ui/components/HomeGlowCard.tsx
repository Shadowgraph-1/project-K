type HomeGlowCardProps = {
  title: string;
  subtitle: string;
  featured?: boolean;
  slotIndex?: number;
};

export function HomeGlowCard({
  title,
  subtitle,
  featured = false,
  slotIndex,
}: HomeGlowCardProps) {
  return (
    <div
      className="home-glow-card"
      data-featured={featured ? "true" : undefined}
      style={
        slotIndex === undefined
          ? undefined
          : ({ "--glow-slot-delay": `${slotIndex * 4}s` } as React.CSSProperties)
      }
    >
      <span className="home-card-ring" aria-hidden />
      <div className="home-glow-card__content">
        <p className="home-glow-card__title">{title}</p>
        <p className="home-glow-card__subtitle">{subtitle}</p>
      </div>
    </div>
  );
}
