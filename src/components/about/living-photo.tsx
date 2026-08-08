"use client";

import { useEffect, useRef, useState } from "react";
import { PaperTexture } from "@paper-design/shaders-react";

/**
 * An honest photo with a print-texture spotlight: the paper grain
 * only exists in a soft radius that trails the cursor, easing after
 * it and fading out on leave. The image itself never distorts.
 * Plain image on the server, on touch screens, and under reduced
 * motion.
 */
export function PrintPhoto({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const pos = useRef({ x: 50, y: 50, tx: 50, ty: 50 });
  const hovering = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setActive(
      window.matchMedia("(hover: hover)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const tick = () => {
    const p = pos.current;
    p.x += (p.tx - p.x) * 0.14;
    p.y += (p.ty - p.y) * 0.14;
    const el = wrapRef.current;
    if (el) {
      el.style.setProperty("--mx", `${p.x}%`);
      el.style.setProperty("--my", `${p.y}%`);
    }
    const settled = Math.hypot(p.tx - p.x, p.ty - p.y) < 0.15;
    rafRef.current =
      hovering.current || !settled ? requestAnimationFrame(tick) : null;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    pos.current.tx = ((e.clientX - rect.left) / rect.width) * 100;
    pos.current.ty = ((e.clientY - rect.top) / rect.height) * 100;
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(tick);
  };

  return (
    <div
      ref={wrapRef}
      className="photo print-photo"
      style={{ aspectRatio: `${width} / ${height}` }}
      onPointerEnter={active ? () => (hovering.current = true) : undefined}
      onPointerMove={active ? onPointerMove : undefined}
      onPointerLeave={active ? () => (hovering.current = false) : undefined}
    >
      <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
      {active ? (
        <div className="print-texture" aria-hidden="true">
          <PaperTexture
            style={{ width: "100%", height: "100%" }}
            image={src}
            fit="cover"
            scale={1}
            colorFront="#ffffff"
            colorBack="#ffffff"
            contrast={0.15}
            roughness={0.5}
            fiber={0.32}
            fiberSize={0.25}
            crumples={0}
            crumpleSize={0.3}
            folds={0}
            foldCount={1}
            fade={0}
            drops={0.15}
            speed={0}
          />
        </div>
      ) : null}
    </div>
  );
}
