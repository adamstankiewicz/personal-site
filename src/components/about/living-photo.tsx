"use client";

import { useEffect, useState } from "react";
import { Water } from "@paper-design/shaders-react";

/**
 * The Winnipesaukee photo with a whisper of water movement over it —
 * dialed low enough that you notice the lake before you notice the
 * effect. Renders as a plain image on the server and under reduced
 * motion; the shader only takes over after mount.
 */
export function LivingPhoto({
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
  const [shader, setShader] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShader(true);
    }
  }, []);

  return (
    <div
      className="photo"
      style={{ aspectRatio: `${width} / ${height}` }}
      role="img"
      aria-label={alt}
    >
      {shader ? (
        <Water
          style={{ width: "100%", height: "100%" }}
          image={src}
          fit="cover"
          scale={1}
          colorBack="#00000000"
          caustic={0.04}
          highlights={0.04}
          layering={0.05}
          edges={0.015}
          waves={0.015}
          size={4}
          speed={0.18}
        />
      ) : (
        <img src={src} alt="" width={width} height={height} loading="lazy" decoding="async" />
      )}
    </div>
  );
}
