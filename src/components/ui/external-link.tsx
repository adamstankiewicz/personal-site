import type { ComponentPropsWithoutRef } from "react";

/**
 * The external-link mark: one SVG drawn once, so every arrow on the
 * site is the same weight, size, and distance from its label — no
 * font-dependent ↗ glyphs. Sized in em, so it scales with its text.
 */
export function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={["external-icon", className].filter(Boolean).join(" ")}
    >
      <path d="M9.75 7v3a.75.75 0 0 1-.75.75H2A.75.75 0 0 1 1.25 10V3A.75.75 0 0 1 2 2.25h3" />
      <path d="M7.75 1.25h3v3" />
      <path d="M10.75 1.25 6 6" />
    </svg>
  );
}

interface ExternalLinkProps extends ComponentPropsWithoutRef<"a"> {
  /** Append the external-link mark after the label. */
  icon?: boolean;
}

/**
 * The only way this site opens a new tab. Centralizing the anchor
 * keeps `rel="noopener noreferrer"` an invariant encoded once, not a
 * convention remembered at every call site.
 */
export function ExternalLink({ icon, children, ...rest }: ExternalLinkProps) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
      {icon ? <ExternalIcon /> : null}
    </a>
  );
}
