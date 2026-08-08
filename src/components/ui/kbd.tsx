import type { ReactNode } from "react";

/** A keycap, as rendered in the header and the command menu's hints. */
export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="key-hint">{children}</kbd>;
}
