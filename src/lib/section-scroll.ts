// Shared section navigation. While a programmatic smooth scroll is in
// flight, `data-nav-scrolling` is set on <html> so scroll-driven
// behaviors (the experience timeline's auto-open, notably) hold fire:
// their scroll compensation would otherwise cancel the browser's
// smooth scroll mid-journey.

// One journey at a time: a second call cancels the first call's
// listeners so a stale timeout can't drop the flag mid-flight.
let cancelPending: (() => void) | null = null;

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  cancelPending?.();
  const root = document.documentElement;
  root.dataset.navScrolling = "true";
  let timer: ReturnType<typeof setTimeout> | null = null;
  const finish = (cancelled: boolean) => {
    delete root.dataset.navScrolling;
    window.removeEventListener("scrollend", onScrollEnd);
    if (timer) clearTimeout(timer);
    if (cancelPending === cancel) cancelPending = null;
    // Scroll-driven behaviors can react to where the journey ended —
    // but a journey superseded by a newer one never "ended" anywhere,
    // so it stays silent.
    if (!cancelled) {
      window.dispatchEvent(new CustomEvent("nav-scroll-end", { detail: id }));
    }
  };
  const onScrollEnd = () => finish(false);
  const cancel = () => finish(true);
  cancelPending = cancel;
  // scrollend covers browsers that ship it; the timeout covers the rest.
  window.addEventListener("scrollend", onScrollEnd, { once: true });
  timer = setTimeout(onScrollEnd, 1600);
  el.scrollIntoView({ behavior: "smooth" });
}
