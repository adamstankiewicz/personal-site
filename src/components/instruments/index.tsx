"use client";

import { useEffect, useRef, useState } from "react";

const CRUISE_ALTITUDE = 8500;

function formatAltitude(feet: number) {
  return String(Math.max(0, Math.round(feet / 10) * 10)).padStart(5, "0");
}

/**
 * Scroll telemetry, styled as a flight instrument readout. Altitude
 * descends from cruise to the ground as you scroll; heading sweeps a
 * full circle over the page; groundspeed is real scroll velocity.
 * Decorative and aria-hidden — the page never depends on it.
 */
export function Instruments() {
  const [reading, setReading] = useState({ alt: CRUISE_ALTITUDE, hdg: 360, gs: 0 });
  const last = useRef({ y: 0, t: 0 });
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    last.current = { y: window.scrollY, t: performance.now() };

    const measure = () => {
      raf.current = null;
      const now = performance.now();
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;

      const dt = now - last.current.t;
      const dy = Math.abs(y - last.current.y);
      const speed = dt > 0 ? Math.min(180, Math.round((dy / dt) * 45)) : 0;
      last.current = { y, t: now };

      setReading({
        alt: Math.round(CRUISE_ALTITUDE * (1 - progress)),
        hdg: Math.max(1, Math.round(progress * 360)),
        gs: speed,
      });

      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        setReading((r) => ({ ...r, gs: 0 }));
      }, 250);
    };

    const onScroll = () => {
      if (raf.current === null) {
        raf.current = requestAnimationFrame(measure);
      }
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  const landed = reading.alt <= 0;

  return (
    <div className="instruments" aria-hidden="true">
      <span>
        Alt <b>{formatAltitude(reading.alt)} ft</b>
      </span>
      <span>
        Hdg <b>{String(reading.hdg).padStart(3, "0")}°</b>
      </span>
      <span>
        {landed ? (
          <b>Landed</b>
        ) : (
          <>
            GS <b>{String(reading.gs).padStart(3, "0")} kt</b>
          </>
        )}
      </span>
    </div>
  );
}
