"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface GalleryImage {
  src: string;
  alt: string;
}

/**
 * A horizontal, scroll-snapped strip of same-size screenshots. Every
 * slide opens a native <dialog> lightbox (Escape closes, backdrop
 * clicks close, arrow keys move between images, and focus returns to
 * the slide that opened it, courtesy of the platform). The caption
 * below always describes the slide closest to center.
 */
export function Gallery({
  images,
  title,
}: {
  images: GalleryImage[];
  title: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState(0);
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  // The caption follows whichever slide is nearest the track's center.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf: number | null = null;
    const onScroll = () => {
      if (raf !== null) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const center = track.scrollLeft + track.clientWidth / 2;
        let best = 0;
        let bestDistance = Infinity;
        Array.from(track.children).forEach((child, index) => {
          const slide = child as HTMLElement;
          const mid = slide.offsetLeft + slide.offsetWidth / 2;
          const distance = Math.abs(mid - center);
          if (distance < bestDistance) {
            bestDistance = distance;
            best = index;
          }
        });
        setCurrent(best);
      });
    };
    onScroll();
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  const scrollToSlide = useCallback((index: number) => {
    const track = trackRef.current;
    const slide = track?.children[index] as HTMLElement | undefined;
    if (!track || !slide) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({
      left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2,
      behavior: reduced ? "auto" : "smooth",
    });
  }, []);

  const openModal = (index: number) => {
    setModalIndex(index);
    dialogRef.current?.showModal();
  };

  const active = modalIndex !== null ? images[modalIndex] : null;

  return (
    <figure>
      <div
        ref={trackRef}
        className="gallery-track"
        role="group"
        aria-label={`${title} screenshots`}
        tabIndex={0}
      >
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            className="gallery-slide"
            aria-label={`View larger: ${image.alt}`}
            aria-current={index === current || undefined}
            onClick={() => openModal(index)}
          >
            <img
              src={image.src}
              alt=""
              loading="lazy"
              decoding="async"
              width={3024}
              height={1550}
            />
          </button>
        ))}
      </div>

      <figcaption className="mt-3 flex items-baseline justify-between gap-4">
        <span className="mono-label text-ink-muted">{images[current]?.alt}</span>
        <span className="flex shrink-0 items-baseline gap-2">
          <span
            className="mono-label tabular-nums text-ink-muted"
            aria-live="polite"
          >
            {current + 1} / {images.length}
          </span>
          <button
            type="button"
            className="gallery-nav"
            aria-label="Previous screenshot"
            disabled={current === 0}
            onClick={() => scrollToSlide(current - 1)}
          >
            ←
          </button>
          <button
            type="button"
            className="gallery-nav"
            aria-label="Next screenshot"
            disabled={current === images.length - 1}
            onClick={() => scrollToSlide(current + 1)}
          >
            →
          </button>
        </span>
      </figcaption>

      <dialog
        ref={dialogRef}
        className="gallery-dialog"
        aria-label={`${title} screenshot viewer`}
        onClose={() => {
          // The close event can be delivered after a quick re-open;
          // only clear the image if the dialog is actually closed.
          if (!dialogRef.current?.open) setModalIndex(null);
        }}
        onClick={(e) => {
          // Backdrop clicks land on the dialog element itself.
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        onKeyDown={(e) => {
          if (modalIndex === null) return;
          if (e.key === "ArrowRight" && modalIndex < images.length - 1) {
            setModalIndex(modalIndex + 1);
          } else if (e.key === "ArrowLeft" && modalIndex > 0) {
            setModalIndex(modalIndex - 1);
          }
        }}
      >
        {active ? (
          <figure className="gallery-dialog-body">
            <img src={active.src} alt={active.alt} />
            <figcaption className="flex items-baseline justify-between gap-4 border-t border-line px-4 py-3">
              <span className="mono-label text-ink-muted">{active.alt}</span>
              <span className="flex shrink-0 items-baseline gap-2">
                <span className="mono-label tabular-nums text-ink-muted">
                  {(modalIndex ?? 0) + 1} / {images.length}
                </span>
                <button
                  type="button"
                  className="gallery-nav"
                  aria-label="Previous screenshot"
                  disabled={modalIndex === 0}
                  onClick={() => setModalIndex((modalIndex ?? 0) - 1)}
                >
                  ←
                </button>
                <button
                  type="button"
                  className="gallery-nav"
                  aria-label="Next screenshot"
                  disabled={modalIndex === images.length - 1}
                  onClick={() => setModalIndex((modalIndex ?? 0) + 1)}
                >
                  →
                </button>
                <button
                  type="button"
                  className="gallery-nav"
                  aria-label="Close viewer"
                  onClick={() => dialogRef.current?.close()}
                >
                  Esc
                </button>
              </span>
            </figcaption>
          </figure>
        ) : null}
      </dialog>
    </figure>
  );
}
