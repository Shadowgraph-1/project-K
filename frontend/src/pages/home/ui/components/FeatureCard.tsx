type FeatureCardProps = {
  title: string;
  description: string;
};

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <article className="home-feature-card">
      <h3 className="home-feature-card__title">{title}</h3>
      <p className="home-feature-card__description">{description}</p>
    </article>
  );
}
