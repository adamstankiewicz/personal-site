import type { ComponentPropsWithoutRef, ElementType } from "react";

type ChipOwnProps<T extends ElementType> = {
  /** Render as a different element (`li` for tag lists, `button` for switches). */
  as?: T;
  /** Selected state, for chips that act as switches. */
  active?: boolean;
  /** Frosted treatment for chips overlaid on imagery or shaders. */
  onMedia?: boolean;
};

/** Props follow the rendered element, so `type` only typechecks on buttons. */
type ChipProps<T extends ElementType> = ChipOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof ChipOwnProps<T>>;

/**
 * The system's pill: capability tags, the lab's shape switches.
 * Styling lives in the `.chip` recipe.
 */
export function Chip<T extends ElementType = "span">({
  as,
  active,
  onMedia,
  className,
  ...rest
}: ChipProps<T>) {
  const Tag = as ?? "span";
  return (
    <Tag
      className={["chip", className].filter(Boolean).join(" ")}
      data-active={active || undefined}
      data-on-media={onMedia || undefined}
      {...rest}
    />
  );
}
