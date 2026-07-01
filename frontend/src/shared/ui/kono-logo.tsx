import { type ComponentPropsWithoutRef } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { cn } from "@/shared/lib/utils";

const ICON_SIZE = {
  sm: 28,
  md: 32,
  lg: 40,
} as const;

type KonoIconProps = {
  size?: keyof typeof ICON_SIZE | number;
  inverted?: boolean;
  className?: string;
};

export function KonoIcon({
  size = "md",
  inverted = false,
  className,
}: KonoIconProps) {
  const px = typeof size === "number" ? size : ICON_SIZE[size];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={px}
      height={px}
      role="img"
      aria-hidden
      className={cn(
        "shrink-0",
        inverted ? "text-background" : "text-foreground",
        className,
      )}
    >
      <rect
        x="4"
        y="4"
        width="56"
        height="56"
        rx="14"
        className="fill-current"
      />
      <path
        className={inverted ? "fill-foreground" : "fill-background"}
        d="M20 18v28h7.5V38.5L40.5 46h9L35.5 36 49.5 18H40.5L27.5 32.5V18H20z"
      />
    </svg>
  );
}

type KonoLogoProps = {
  size?: keyof typeof ICON_SIZE;
  showWordmark?: boolean;
  inverted?: boolean;
  className?: string;
  iconClassName?: string;
  wordmarkClassName?: string;
} & (
  | ({ as?: "div" } & ComponentPropsWithoutRef<"div">)
  | ({ as: "link"; to: LinkProps["to"] } & Omit<LinkProps, "to"> & {
        to: LinkProps["to"];
      })
);

export function KonoLogo({
  size = "md",
  showWordmark = true,
  inverted = false,
  className,
  iconClassName,
  wordmarkClassName,
  as = "div",
  ...props
}: KonoLogoProps) {
  const content = (
    <>
      <KonoIcon size={size} inverted={inverted} className={iconClassName} />
      {showWordmark ? (
        <span
          className={cn(
            "truncate text-[15px] font-semibold tracking-tight",
            wordmarkClassName,
          )}
        >
        </span>
      ) : null}
    </>
  );

  const rootClass = cn(
    "inline-flex min-w-0 items-center gap-2",
    as === "link" && "transition-opacity hover:opacity-80",
    className,
  );

  if (as === "link") {
    const { to, ...linkProps } = props as Extract<
      KonoLogoProps,
      { as: "link" }
    >;
    return (
      <Link to={to} className={rootClass} aria-label="Kono" {...linkProps}>
        {content}
      </Link>
    );
  }

  const divProps = props as ComponentPropsWithoutRef<"div">;
  return (
    <div className={rootClass} {...divProps}>
      {content}
    </div>
  );
}
