type HomeGlowCardProps = {
  title: string;
  subtitle: string;
  accent?: boolean;
};

export function HomeGlowCard({ title, subtitle, accent = false }: HomeGlowCardProps) {
  return (
    <div className="home-glow-card" data-accent={accent ? "true" : undefined}>
      {accent ? <span className="home-glow-card__ring" aria-hidden /> : null}
      <div className="home-glow-card__content">
        <p className="text-sm font-medium tabular-nums text-white/80">{title}</p>
        <p className="mt-0.5 text-xs text-white/40">{subtitle}</p>
      </div>
    </div>
  );
}
