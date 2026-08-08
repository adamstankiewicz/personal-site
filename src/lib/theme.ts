"use client";

import { useSyncExternalStore } from "react";

// Three theme modes: explicit light, explicit dark, or system — which
// follows the OS live. Stored as localStorage.theme = "light" |
// "dark"; absence means system, so first-time visitors get their OS
// preference (the before-paint script in layout.tsx applies the same
// resolution).

export type ThemeMode = "system" | "light" | "dark";

const CYCLE: ThemeMode[] = ["system", "light", "dark"];

const listeners = new Set<() => void>();

export function themeMode(): ThemeMode {
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {}
  return "system";
}

function systemPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyResolved() {
  const mode = themeMode();
  const dark = mode === "dark" || (mode === "system" && systemPrefersDark());
  document.documentElement.classList.toggle("dark", dark);
}

/** Advance system → light → dark → system and apply the result. */
export function cycleTheme() {
  const next = CYCLE[(CYCLE.indexOf(themeMode()) + 1) % CYCLE.length];
  try {
    if (next === "system") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", next);
    }
  } catch {}
  applyResolved();
  listeners.forEach((notify) => notify());
}

/** The current mode, live — including OS changes while in system. */
export function useThemeMode(): ThemeMode {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const onMedia = () => {
        // In system mode the page follows the OS as it changes.
        if (themeMode() === "system") applyResolved();
        onChange();
      };
      // Another tab changing the stored theme syncs this one too.
      const onStorage = (e: StorageEvent) => {
        if (e.key !== "theme") return;
        applyResolved();
        onChange();
      };
      media.addEventListener("change", onMedia);
      window.addEventListener("storage", onStorage);
      listeners.add(onChange);
      return () => {
        media.removeEventListener("change", onMedia);
        window.removeEventListener("storage", onStorage);
        listeners.delete(onChange);
      };
    },
    themeMode,
    () => "system" as ThemeMode
  );
}
