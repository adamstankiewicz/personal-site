"use client";

import { useEffect, useRef, useState } from "react";
import { PaperTexture } from "@paper-design/shaders-react";

/**
 * A photo finished like a fine matte print: a whisper of paper fiber,
 * roughness, and speckle over the image, with zero geometric
 * distortion. The grain leans in slightly under the cursor and
 * settles back when it leaves. Renders as a plain image on the
 * server and stays static under reduced motion.
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
  const [mounted, setMounted] = useState(false);
  const [reactive, setReactive] = useState(false);
  const [boost, setBoost] = useState(0);
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    setReactive(
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        window.matchMedia("(hover: hover)").matches
    );
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const easeToward = (target: number) => {
    targetRef.current = target;
    if (rafRef.current !== null) return;
    const tick = () => {
      rafRef.current = null;
      setBoost((prev) => {
        const next = prev + (targetRef.current - prev) * 0.1;
        if (Math.abs(next - targetRef.current) < 0.01) return targetRef.current;
        rafRef.current = requestAnimationFrame(tick);
        return next;
      });
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  return (
    <div
      className="photo"
      style={{ aspectRatio: `${width} / ${height}` }}
      role="img"
      aria-label={alt}
      onPointerEnter={reactive ? () => easeToward(1) : undefined}
      onPointerLeave={reactive ? () => easeToward(0) : undefined}
    >
      {mounted ? (
        <PaperTexture
          style={{ width: "100%", height: "100%" }}
          image={src}
          fit="cover"
          scale={1}
          colorFront="#ffffff"
          colorBack="#ffffff"
          contrast={0.08 + boost * 0.04}
          roughness={0.22 + boost * 0.18}
          fiber={0.12 + boost * 0.12}
          fiberSize={0.25}
          crumples={0}
          crumpleSize={0.3}
          folds={0}
          foldCount={1}
          fade={0}
          drops={0.06 + boost * 0.08}
          speed={0}
        />
      ) : (
        <img src={src} alt="" width={width} height={height} loading="lazy" decoding="async" />
      )}
    </div>
  );
}
