"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type TileData = {
  id: string;
  title: string;
  text: string;
};

// Prozent-Positionen (links/oben, Mittelpunkt) der leeren Glaskacheln bei
// Video-Start (t=0), gemessen am 1280x720-Frame. Der Baum-Ring im Video
// zoomt über die gesamte Loop-Dauer kontinuierlich auf (kein Rotieren),
// darum reicht ein einziger Referenzpunkt pro Kachel plus ein synchron
// mitlaufender Scale-Transform (siehe unten).
const PANEL_SPOTS = [
  { left: 32.0, top: 58.1 },
  { left: 41.3, top: 56.2 },
  { left: 52.2, top: 54.3 },
  { left: 63.3, top: 56.2 },
  { left: 72.4, top: 58.1 },
];

// Zoom-Fahrkurve des Videos: Skalierung relativ zu t=0, per Pixel-Analyse
// des Glas-Rings an mehreren Zeitpunkten über die Loop-Dauer ermittelt.
const ZOOM_KEYFRAMES: { t: number; s: number }[] = [
  { t: 0, s: 1 },
  { t: 0.21, s: 1.035 },
  { t: 0.42, s: 1.068 },
  { t: 0.63, s: 1.098 },
  { t: 0.84, s: 1.124 },
  { t: 1.05, s: 1.148 },
  { t: 1.26, s: 1.169 },
  { t: 1.8, s: 1.28 },
  { t: 2.6, s: 1.557 },
  { t: 3.4, s: 1.67 },
  { t: 4.2, s: 1.83 },
  { t: 5.04, s: 1.85 },
];

// Fluchtpunkt des Zooms (Prozent-Koordinaten), ebenfalls per Pixel-Analyse
// bestimmt (Baumkrone/Stamm-Ansatz, nicht der Bildmittelpunkt).
const ZOOM_ORIGIN = { x: 56, y: 48 };

const FADE_WINDOW = 0.06; // Sekunden Ein-/Ausblenden am Loop-Schnitt

function scaleAt(t: number): number {
  const kf = ZOOM_KEYFRAMES;
  if (t <= kf[0].t) return kf[0].s;
  for (let i = 1; i < kf.length; i++) {
    if (t <= kf[i].t) {
      const a = kf[i - 1];
      const b = kf[i];
      const f = (t - a.t) / (b.t - a.t);
      return a.s + (b.s - a.s) * f;
    }
  }
  return kf[kf.length - 1].s;
}

export default function VideoTilesHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<HTMLDivElement[]>([]);
  const [tiles, setTiles] = useState<TileData[] | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.45;
    }
  }, []);

  useEffect(() => {
    let rafId: number;

    const tick = () => {
      const video = videoRef.current;
      const overlay = overlayRef.current;
      if (video && overlay && video.duration) {
        const t = video.currentTime;
        const duration = video.duration;
        const scale = scaleAt(t);

        let opacity = 1;
        if (t < FADE_WINDOW) {
          opacity = t / FADE_WINDOW;
        } else if (t > duration - FADE_WINDOW) {
          opacity = (duration - t) / FADE_WINDOW;
        }

        overlay.style.transform = `scale(${scale})`;
        overlay.style.opacity = String(Math.max(0, Math.min(1, opacity)));
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/data/hero-tiles.json")
      .then((res) => res.json())
      .then((data: TileData[]) => {
        if (!cancelled) setTiles(data.slice(0, PANEL_SPOTS.length));
      })
      .catch(() => {
        if (!cancelled) setTiles([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!tiles) return;
    gsap.fromTo(
      tilesRef.current.filter(Boolean),
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 0.8, stagger: 0.12, delay: 0.2, ease: "power3.out" }
    );
  }, [tiles]);

  return (
    <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-3xl bg-black" style={{ aspectRatio: "1280 / 720" }}>
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/hero-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />

      <div
        ref={overlayRef}
        className="absolute inset-0 hidden sm:block"
        style={{ transformOrigin: `${ZOOM_ORIGIN.x}% ${ZOOM_ORIGIN.y}%`, willChange: "transform" }}
      >
        {tiles?.map((tile, i) => {
          const spot = PANEL_SPOTS[i];
          if (!spot) return null;
          return (
            <div
              key={tile.id}
              ref={(el) => {
                if (el) tilesRef.current[i] = el;
              }}
              className="absolute flex w-[8.5%] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
              style={{ left: `${spot.left}%`, top: `${spot.top}%` }}
            >
              <h3 className="break-words font-display text-[clamp(0.5rem,0.9vw,0.85rem)] font-semibold leading-[1.15] text-sand-50 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
                {tile.title}
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}
