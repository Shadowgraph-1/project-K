type FeaturesCompanionFigureProps = {
  side: "left" | "right";
  image: string;
  alt: string;
  aos: "fade-right" | "fade-left";
};

export function FeaturesCompanionFigure({
  side,
  image,
  alt,
  aos,
}: FeaturesCompanionFigureProps) {
  return (
    <div
      className={`features-companion features-companion--${side}`}
      data-aos={aos}
      data-aos-duration="850"
    >
      <div className="features-companion__frame">
        <img
          src={image}
          alt={alt}
          width={1328}
          height={1488}
          className="features-companion__image"
          loading="lazy"
          decoding="async"
        />
        <div className={`features-companion__fade features-companion__fade--${side}`} />
      </div>
    </div>
  );
}