// Shared section navigation. While a programmatic smooth scroll is in
// flight, `data-nav-scrolling` is set on <html> so scroll-driven
// behaviors (the experience timeline's auto-open, notably) hold fire:
// their scroll compensation would otherwise cancel the browser's
// smooth scroll mid-journey.
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const root = document.documentElement;
  root.dataset.navScrolling = "true";
  let timer: ReturnType<typeof setTimeout> | null = null;
  const clear = () => {
    delete root.dataset.navScrolling;
    window.removeEventListener("scrollend", clear);
    if (timer) clearTimeout(timer);
  };
  // scrollend covers browsers that ship it; the timeout covers the rest.
  window.addEventListener("scrollend", clear, { once: true });
  timer = setTimeout(clear, 1600);
  el.scrollIntoView({ behavior: "smooth" });
}
