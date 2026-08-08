"use client";

import { useEffect, useState } from "react";
import { PaperTexture } from "@paper-design/shaders-react";

/**
 * A photo finished like a fine matte print: a whisper of paper fiber,
 * roughness, and speckle over the image, with zero geometric
 * distortion. Static by nature. Renders as a plain image on the
 * server; the shader takes over after mount.
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

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="photo"
      style={{ aspectRatio: `${width} / ${height}` }}
      role="img"
      aria-label={alt}
    >
      {mounted ? (
        <PaperTexture
          style={{ width: "100%", height: "100%" }}
          image={src}
          fit="cover"
          scale={1}
          colorFront="#ffffff"
          colorBack="#ffffff"
          contrast={0.08}
          roughness={0.25}
          fiber={0.14}
          fiberSize={0.25}
          crumples={0}
          crumpleSize={0.3}
          folds={0}
          foldCount={1}
          fade={0}
          drops={0.08}
          speed={0}
        />
      ) : (
        <img src={src} alt="" width={width} height={height} loading="lazy" decoding="async" />
      )}
    </div>
  );
}
