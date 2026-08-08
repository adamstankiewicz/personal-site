"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const HOVER_QUERY = "(hover: hover)";

/** One-shot check for imperative code paths (effects, handlers). */
export const prefersReducedMotion = () =>
  window.matchMedia(REDUCED_MOTION_QUERY).matches;

/** True on devices with a real pointer; false on touch screens. */
export const hoverCapable = () => window.matchMedia(HOVER_QUERY).matches;

function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query]
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

/** Tracks the visitor's reduced-motion preference, live. */
export function useReducedMotion() {
  return useMediaQuery(REDUCED_MOTION_QUERY);
}

/** Tracks hover capability, live (false during prerender and on touch). */
export function useHoverCapable() {
  return useMediaQuery(HOVER_QUERY);
}

/** Tracks the `.dark` class on <html>, kept in sync by the theme toggle. */
export function useDarkTheme() {
  const subscribe = useCallback((onChange: () => void) => {
    const observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => false
  );
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
