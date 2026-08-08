import type { ComponentPropsWithoutRef, ElementType } from "react";

interface CardProps extends ComponentPropsWithoutRef<"div"> {
  /** Render as a different element (`article`, `dl`, …). */
  as?: ElementType;
  /** Opt into the hover rise, for cards sitting in a grid. */
  lift?: boolean;
}

/**
 * The system's one surface: hairline border, one radius, clipped
 * corners, paper background. Styling lives in the `.card` recipe.
 */
export function Card({ as: Tag = "div", lift, className, ...rest }: CardProps) {
  return (
    <Tag
      className={["card", className].filter(Boolean).join(" ")}
      data-lift={lift || undefined}
      {...rest}
    />
  );
}
