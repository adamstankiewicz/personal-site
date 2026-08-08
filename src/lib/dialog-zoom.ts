// iOS-style zoom for native <dialog>: the dialog grows out of the
// element that opened it and shrinks back into it on close, the way
// an app opens from its icon. FLIP over the Web Animations API, on
// the motion tokens (spring out, ease back), with the backdrop fading
// alongside. Under reduced motion both helpers degrade to plain
// showModal()/close().

import { prefersReducedMotion } from "@/lib/hooks";

const FALLBACK = {
  spring: "cubic-bezier(0.22, 1, 0.36, 1)",
  out: "cubic-bezier(0.22, 1, 0.36, 1)",
  slow: 560,
  open: 320,
};

function token(name: string, fallback: string) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

function durationToken(name: string, fallback: number) {
  const raw = token(name, `${fallback}ms`);
  const value = parseFloat(raw);
  if (!Number.isFinite(value)) return fallback;
  // Computed <time> values may come back in seconds (".56s") or ms.
  return raw.trim().endsWith("ms") ? value : value * 1000;
}

/** The transform that maps the dialog's resting rect onto `origin`. */
function transformToOrigin(dialog: HTMLDialogElement, origin: Element) {
  const from = origin.getBoundingClientRect();
  const to = dialog.getBoundingClientRect();
  if (!to.width || !to.height || !from.width || !from.height) return null;
  const dx = from.left + from.width / 2 - (to.left + to.width / 2);
  const dy = from.top + from.height / 2 - (to.top + to.height / 2);
  return `translate(${dx}px, ${dy}px) scale(${from.width / to.width}, ${from.height / to.height})`;
}

/** Open `dialog` zooming out of `origin` (usually the clicked element). */
export function openDialogFromOrigin(
  dialog: HTMLDialogElement,
  origin: Element | null
) {
  dialog.showModal();
  if (!origin || prefersReducedMotion()) return;
  const transform = transformToOrigin(dialog, origin);
  if (!transform) return;
  const duration = durationToken("--dur-slow", FALLBACK.slow);
  // --ease-spring is a linear() easing; browsers without linear()
  // support throw on it, and this runs inside a layout effect, so
  // degrade to no zoom rather than let the exception unmount the tree.
  try {
    dialog.animate(
      [
        { transform, opacity: 0.4 },
        { transform: "none", opacity: 1 },
      ],
      { duration, easing: token("--ease-spring", FALLBACK.spring) }
    );
  } catch {}
  try {
    dialog.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: duration / 2,
      pseudoElement: "::backdrop",
    });
  } catch {}
}

/** Close `dialog`, zooming back into `origin`. Safe to call twice. */
export async function closeDialogToOrigin(
  dialog: HTMLDialogElement,
  origin: Element | null
) {
  if (!dialog.open || dialog.dataset.zoomClosing) return;
  const transform =
    origin && !prefersReducedMotion()
      ? transformToOrigin(dialog, origin)
      : null;
  if (!transform) {
    dialog.close();
    return;
  }
  dialog.dataset.zoomClosing = "true";
  const duration = durationToken("--dur-open", FALLBACK.open);
  const easing = token("--ease-out", FALLBACK.out);
  const zoom = dialog.animate(
    [
      { transform: "none", opacity: 1 },
      { transform, opacity: 0.3 },
    ],
    { duration, easing, fill: "forwards" }
  );
  try {
    dialog.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration,
      easing,
      fill: "forwards",
      pseudoElement: "::backdrop",
    });
  } catch {}
  try {
    await zoom.finished;
  } catch {}
  dialog.close();
  // Lift the forwards fills so the next open starts from a clean slate.
  // subtree: true is load-bearing: without it getAnimations() omits the
  // ::backdrop animation, whose forwards fill would keep the backdrop
  // invisible on every later open.
  dialog.getAnimations({ subtree: true }).forEach((a) => a.cancel());
  delete dialog.dataset.zoomClosing;
}
