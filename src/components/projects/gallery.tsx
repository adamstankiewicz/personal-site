"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { TextMorph } from "torph/react";
import { closeDialogToOrigin, openDialogFromOrigin } from "@/lib/dialog-zoom";
import { useReducedMotion } from "@/lib/hooks";
import { ProjectImage } from "./types";

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
  images: ProjectImage[];
  title: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState(0);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [overflowing, setOverflowing] = useState(false);
  const reduced = useReducedMotion();

  // Wide viewports can fit a whole strip; then there is nothing to
  // scroll and the counter and arrows would only confuse.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(() => {
      setOverflowing(track.scrollWidth > track.clientWidth + 4);
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, [images]);

  // Video slides play only while on screen, and never under reduced
  // motion; until then they cost viewers one poster frame.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || reduced) return;
    const videos = Array.from(track.querySelectorAll("video"));
    if (!videos.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.4 }
    );
    videos.forEach((video) => observer.observe(video));
    return () => observer.disconnect();
  }, [images, reduced]);

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

  const scrollToSlide = useCallback(
    (index: number) => {
      const track = trackRef.current;
      const slide = track?.children[index] as HTMLElement | undefined;
      if (!track || !slide) return;
      track.scrollTo({
        left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2,
        behavior: reduced ? "auto" : "smooth",
      });
    },
    [reduced]
  );

  const originRef = useRef<Element | null>(null);

  const openModal = (index: number, origin: Element) => {
    originRef.current = origin;
    setModalIndex(index);
  };

  // The dialog opens only after React has committed its content, so
  // the zoom can measure the real resting rect (iOS-style: it grows
  // out of the slide that was clicked, and shrinks back on close).
  const closeLightbox = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const slides = trackRef.current?.querySelectorAll(".gallery-slide");
    const origin =
      (modalIndex !== null ? slides?.[modalIndex] : null) ?? originRef.current;
    void closeDialogToOrigin(dialog, origin ?? null);
  }, [modalIndex]);

  // Native <dialog> makes the page inert but not scroll-locked; hold
  // the lock for exactly as long as the lightbox has an image, and
  // restore on unmount even if it never closed.
  const lightboxOpen = modalIndex !== null;
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!lightboxOpen || !dialog || dialog.open) return;
    openDialogFromOrigin(dialog, originRef.current);
  }, [lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previousOverflow;
    };
  }, [lightboxOpen]);

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
          <div key={image.src} className="gallery-item">
            <button
              type="button"
              className="gallery-slide"
              style={{
                aspectRatio: `${image.width ?? 3024} / ${image.height ?? 1550}`,
              }}
              aria-label={`View larger: ${image.alt}`}
              aria-current={index === current || undefined}
              onClick={(e) => openModal(index, e.currentTarget)}
            >
              {image.videoSrc ? (
                <video
                  src={image.videoSrc}
                  poster={image.src}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  width={image.width ?? 3024}
                  height={image.height ?? 1550}
                />
              ) : (
                <img
                  src={image.src}
                  srcSet={
                    image.src.endsWith(".png")
                      ? `${image.src.replace("/projects/", "/projects/slides/").replace(/\.png$/, ".jpg")} 1280w, ${image.src} ${image.width ?? 3024}w`
                      : undefined
                  }
                  sizes="(min-width: 640px) 34rem, 88vw"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={image.width ?? 3024}
                  height={image.height ?? 1550}
                />
              )}
            </button>
            <p className="gallery-caption mono-label mt-2.5 text-ink-muted">
              {image.alt}
            </p>
          </div>
        ))}
      </div>

      {/* No counter or arrows unless there is actually more to see. */}
      <figcaption
        className={`mt-3 items-baseline justify-end gap-4 ${images.length > 1 && overflowing ? "flex" : "hidden"}`}
      >
        <span className="flex shrink-0 items-baseline gap-2">
          <span
            className="mono-label tabular-nums text-ink-muted"
            aria-live="polite"
          >
            <TextMorph as="span">{`${current + 1} / ${images.length}`}</TextMorph>
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
          if (e.target === dialogRef.current) closeLightbox();
        }}
        onCancel={(e) => {
          // Escape routes through the same zoom-out.
          e.preventDefault();
          closeLightbox();
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
            {active.videoSrc ? (
              <video
                src={active.videoSrc}
                poster={active.src}
                width={active.width ?? 960}
                height={active.height ?? 492}
                controls
                muted
                loop
                playsInline
                autoPlay={!reduced}
              />
            ) : (
              <img
                src={active.src}
                alt={active.alt}
                width={active.width ?? 3024}
                height={active.height ?? 1550}
              />
            )}
            <figcaption className="flex items-baseline justify-between gap-4 border-t border-line px-4 py-3">
              <span className="mono-label min-w-0 flex-1 text-ink-muted">
                {active.alt}
              </span>
              <span className="flex shrink-0 items-baseline gap-2">
                {images.length > 1 ? (
                  <>
                    <span className="mono-label tabular-nums text-ink-muted">
                      <TextMorph as="span">{`${(modalIndex ?? 0) + 1} / ${images.length}`}</TextMorph>
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
                  </>
                ) : null}
                <button
                  type="button"
                  className="gallery-nav"
                  aria-label="Close viewer"
                  onClick={closeLightbox}
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
