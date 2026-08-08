import type { ComponentPropsWithoutRef, ElementType } from "react";

interface ChipProps extends ComponentPropsWithoutRef<"button"> {
  /** Render as a different element (`li` for tag lists, `button` for switches). */
  as?: ElementType;
  /** Selected state, for chips that act as switches. */
  active?: boolean;
  /** Frosted treatment for chips overlaid on imagery or shaders. */
  onMedia?: boolean;
}

/**
 * The system's pill: capability tags, the lab's shape switches.
 * Styling lives in the `.chip` recipe.
 */
export function Chip({
  as: Tag = "span",
  active,
  onMedia,
  className,
  ...rest
}: ChipProps) {
  return (
    <Tag
      className={["chip", className].filter(Boolean).join(" ")}
      data-active={active || undefined}
      data-on-media={onMedia || undefined}
      {...rest}
    />
  );
}
