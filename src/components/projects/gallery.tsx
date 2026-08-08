"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { TextMorph } from "torph/react";
import { closeDialogToOrigin, openDialogFromOrigin } from "@/lib/dialog-zoom";
import { useReducedMotion } from "@/lib/hooks";
import { ProjectImage } from "./types";

// Most screenshots share one crop size; slides that differ override it.
const dims = (image: ProjectImage) => ({
  width: image.width ?? 3024,
  height: image.height ?? 1550,
});

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
    return () => {
      observer.disconnect();
      // If reduced motion flips on mid-session, the effect re-runs and
      // bails early — don't leave a video looping behind it.
      videos.forEach((video) => video.pause());
    };
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
        // Center-nearest breaks at the ends of the strip: when several
        // slides fit at once, the first slide's center can never reach
        // the track's center, so scroll position 0 would read as
        // "slide 2" and ← would have nowhere to go. The ends clamp to
        // the first and last slide instead.
        const maxScroll = track.scrollWidth - track.clientWidth;
        let best = 0;
        if (maxScroll > 4 && track.scrollLeft >= maxScroll - 4) {
          best = track.children.length - 1;
        } else if (track.scrollLeft > 4) {
          const center = track.scrollLeft + track.clientWidth / 2;
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
        }
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
        {images.map((image, index) => {
          const { width, height } = dims(image);
          return (
            <div key={image.src} className="gallery-item">
              <button
                type="button"
                className="gallery-slide"
                // Width is written out rather than derived via
                // aspect-ratio: WebKit 26.0 resolves aspect-ratio-derived
                // widths to zero inside the strip's intrinsic flex sizing
                // (fixed upstream by 26.5), collapsing every slide to its
                // borders on affected iOS versions.
                style={{
                  width: `calc(var(--slide-h) * ${(width / height).toFixed(4)})`,
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
                    width={width}
                    height={height}
                  />
                ) : (
                  <img
                    src={image.src}
                    srcSet={
                      image.src.endsWith(".png")
                        ? `${image.src.replace("/projects/", "/projects/slides/").replace(/\.png$/, ".jpg")} 1280w, ${image.src} ${width}w`
                        : undefined
                    }
                    sizes="(min-width: 640px) 34rem, 88vw"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={width}
                    height={height}
                  />
                )}
              </button>
              <p className="gallery-caption mono-label mt-2.5 text-ink-muted">
                {image.alt}
              </p>
            </div>
          );
        })}
      </div>

      {/* No counter or arrows unless there is actually more to see. */}
      <figcaption
        className={`mt-3 items-baseline justify-end gap-4 ${images.length > 1 && overflowing ? "flex" : "hidden"}`}
      >
        <span className="flex shrink-0 items-baseline gap-2">
          {/* The morphing counter mutates character-by-character, which
              garbles live announcements; screen readers get the plain
              string, the morph is presentation only. */}
          <span className="sr-only" aria-live="polite">
            {`Screenshot ${current + 1} of ${images.length}`}
          </span>
          <span
            className="mono-label tabular-nums text-ink-muted"
            aria-hidden="true"
          >
            <TextMorph as="span">{`${current + 1} / ${images.length}`}</TextMorph>
          </span>
          <button
            type="button"
            className="gallery-nav"
            aria-label="Previous screenshot"
            aria-disabled={current === 0 || undefined}
            onClick={() => current > 0 && scrollToSlide(current - 1)}
          >
            ←
          </button>
          <button
            type="button"
            className="gallery-nav"
            aria-label="Next screenshot"
            aria-disabled={current === images.length - 1 || undefined}
            onClick={() =>
              current < images.length - 1 && scrollToSlide(current + 1)
            }
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
                width={dims(active).width}
                height={dims(active).height}
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
                width={dims(active).width}
                height={dims(active).height}
              />
            )}
            <figcaption className="flex items-baseline justify-between gap-4 border-t border-line px-4 py-3">
              <span className="mono-label min-w-0 flex-1 text-ink-muted">
                {active.alt}
              </span>
              <span className="flex shrink-0 items-baseline gap-2">
                {images.length > 1 ? (
                  <>
                    {/* Same split as the strip counter: arrow-key moves
                        announce the plain string; the morph stays
                        presentation only. */}
                    <span className="sr-only" aria-live="polite">
                      {`Screenshot ${(modalIndex ?? 0) + 1} of ${images.length}`}
                    </span>
                    <span
                      className="mono-label tabular-nums text-ink-muted"
                      aria-hidden="true"
                    >
                      <TextMorph as="span">{`${(modalIndex ?? 0) + 1} / ${images.length}`}</TextMorph>
                    </span>
                    <button
                      type="button"
                      className="gallery-nav"
                      aria-label="Previous screenshot"
                      aria-disabled={modalIndex === 0 || undefined}
                      onClick={() =>
                        (modalIndex ?? 0) > 0 &&
                        setModalIndex((modalIndex ?? 0) - 1)
                      }
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      className="gallery-nav"
                      aria-label="Next screenshot"
                      aria-disabled={modalIndex === images.length - 1 || undefined}
                      onClick={() =>
                        (modalIndex ?? 0) < images.length - 1 &&
                        setModalIndex((modalIndex ?? 0) + 1)
                      }
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
