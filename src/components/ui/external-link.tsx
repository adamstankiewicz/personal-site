import type { ComponentPropsWithoutRef } from "react";

/**
 * The only way this site opens a new tab. Centralizing the anchor
 * keeps `rel="noopener noreferrer"` an invariant encoded once, not a
 * convention remembered at every call site.
 */
export function ExternalLink(props: ComponentPropsWithoutRef<"a">) {
  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}
