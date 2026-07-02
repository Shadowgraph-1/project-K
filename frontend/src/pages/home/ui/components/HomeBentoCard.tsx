type HomeBentoCardProps = {
  title: string;
  description: string;
};

export function HomeBentoCard({ title, description }: HomeBentoCardProps) {
  return (
    <article className="home-bento-card">
      <div className="home-bento-card__head">
        <h3 className="home-bento-card__title">{title}</h3>
        <p className="home-bento-card__description">{description}</p>
      </div>
    </article>
  );
}
