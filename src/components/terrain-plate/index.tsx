"use client";

import { useRef, useState } from "react";

// Rough bounds of the photographed area over Lake Winnipesaukee.
const LAT_RANGE = { top: 43.66, bottom: 43.54 };
const LON_RANGE = { left: 71.48, right: 71.28 };

/**
 * Adam's aerial photograph treated as part of the chart: graticule
 * overlay, a plotted course, and on hover a surveyor's crosshair with
 * an approximate coordinate readout that follows the pointer.
 */
export function TerrainPlate() {
  const plateRef = useRef<HTMLElement>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const rect = plateRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPointer({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const rect = plateRef.current?.getBoundingClientRect();
  const lat = rect && pointer
    ? LAT_RANGE.top - (pointer.y / rect.height) * (LAT_RANGE.top - LAT_RANGE.bottom)
    : null;
  const lon = rect && pointer
    ? LON_RANGE.left - (pointer.x / rect.width) * (LON_RANGE.left - LON_RANGE.right)
    : null;

  // Keep the chip inside the plate near the edges.
  const chipStyle =
    rect && pointer
      ? {
          left: Math.min(pointer.x + 14, rect.width - 150),
          top: Math.max(pointer.y - 34, 10),
        }
      : undefined;

  return (
    <figure
      ref={plateRef}
      className="terrain-plate rise rise-4 mt-6"
      onPointerMove={onPointerMove}
      onPointerLeave={() => setPointer(null)}
    >
      <img
        src="/images/flying/winnipesaukee.jpg"
        alt="Aerial view from a small plane over Lake Winnipesaukee, New Hampshire, in fall — the wing strut in frame, foliage and a runway below"
        width={2400}
        height={1800}
        decoding="async"
      />
      <svg
        className="terrain-plate-course"
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M8 33 L38 21 L72 24 L94 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.45"
          strokeDasharray="2 1.2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <svg className="terrain-plate-course" viewBox="0 0 100 40" aria-hidden="true">
        <g fill="var(--paper)" stroke="currentColor" strokeWidth="0.5">
          <path d="M8 31.6 L9.4 34 L6.6 34 Z" />
          <path d="M94 6.6 L95.4 9 L92.6 9 Z" />
        </g>
      </svg>

      {/* Surveyor's crosshair, driven by the pointer */}
      <div
        className="crosshair-h"
        style={pointer ? { top: pointer.y } : { top: -10 }}
        aria-hidden="true"
      />
      <div
        className="crosshair-v"
        style={pointer ? { left: pointer.x } : { left: -10 }}
        aria-hidden="true"
      />
      {lat !== null && lon !== null ? (
        <div className="crosshair-chip" style={chipStyle} aria-hidden="true">
          {lat.toFixed(3)}° N {lon.toFixed(3)}° W
        </div>
      ) : null}

      <figcaption className="terrain-plate-caption mono-label text-ink-muted">
        Over Lake Winnipesaukee, NH — from the left seat of my Cessna 172
      </figcaption>
    </figure>
  );
}
