"use client";

import { useEffect, useState } from "react";

/** Tracks the `.dark` class on <html>, kept in sync by the theme toggle. */
export function useDarkTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setDark(root.classList.contains("dark"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

/** True once mounted when the visitor prefers reduced motion. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return reduced;
}

/**
 * True once the browser goes idle after hydration. Gates work that
 * should never compete with the page's own load, like WebGL mounts.
 */
export function useIdleMounted(timeout = 2000) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(() => setMounted(true), { timeout });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(() => setMounted(true), 350);
    return () => clearTimeout(id);
  }, [timeout]);
  return mounted;
}
