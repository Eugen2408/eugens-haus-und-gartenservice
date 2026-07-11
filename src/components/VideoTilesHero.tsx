"use client";

import { useEffect, useRef, useState } from "react";
import tilesData from "@/data/hero-tiles.json";

type TileData = {
  id: string;
  title: string;
  text: string;
};

type PanelKeyframe = { t: number; left: number; top: number };

// Prozent-Positionen (links/oben, Mittelpunkt) der 5 verfolgten Glaskacheln,
// per Raster-Overlay direkt aus dem Rohvideo abgelesen (nicht per einzelnem
// Zoom-Skalar hochgerechnet). Jede Kachel hat ihre eigene Bahnkurve, weil
// die Kacheln je nach Abstand zum Zoom-Fluchtpunkt unterschiedlich schnell
// wandern. Nur bis t=0.63s vermessen — das ist das Fenster, in dem alle 5
// Kacheln eindeutig identifizierbar sind, bevor sie im weiteren Zoomverlauf
// zu weit auseinanderlaufen bzw. den Bildrand verlassen. Für die restliche
// Loop-Dauer blendet der Text aus (siehe FADE_* unten), statt mit unsicheren
// Positionen weiterzuraten.
const PANEL_TRACKS: PanelKeyframe[][] = [
  [
    { t: 0, left: 15.9, top: 58.4 },
    { t: 0.63, left: 19.5, top: 57.6 },
  ],
  [
    { t: 0, left: 27.4, top: 56.3 },
    { t: 0.63, left: 34.5, top: 57.85 },
  ],
  [
    { t: 0, left: 41.75, top: 54.15 },
    { t: 0.63, left: 52.5, top: 58.1 },
  ],
  [
    { t: 0, left: 59.4, top: 56.3 },
    { t: 0.63, left: 69.5, top: 59.5 },
  ],
  [
    { t: 0, left: 74, top: 57.5 },
    { t: 0.63, left: 84, top: 63 },
  ],
];

const TILES: TileData[] = (tilesData as TileData[]).slice(0, PANEL_TRACKS.length);

const TRACK_END = 0.63; // letzter vermessener Zeitpunkt
const FADE_IN_END = 0.15; // Sekunden ab Loop-Start, in denen der Text einblendet
const FADE_OUT_START = 0.63; // ab hier verlässt die Position den vermessenen Bereich
const FADE_OUT_END = 0.95; // ab hier komplett unsichtbar, bis der Loop neu startet

function panelPosAt(track: PanelKeyframe[], t: number): { left: number; top: number } {
  const clamped = Math.min(t, TRACK_END);
  if (clamped <= track[0].t) return { left: track[0].left, top: track[0].top };
  for (let i = 1; i < track.length; i++) {
    if (clamped <= track[i].t) {
      const a = track[i - 1];
      const b = track[i];
      const f = (clamped - a.t) / (b.t - a.t);
      return { left: a.left + (b.left - a.left) * f, top: a.top + (b.top - a.top) * f };
    }
  }
  const last = track[track.length - 1];
  return { left: last.left, top: last.top };
}

function opacityAt(t: number): number {
  if (t < FADE_IN_END) return t / FADE_IN_END;
  if (t < FADE_OUT_START) return 1;
  if (t < FADE_OUT_END) return 1 - (t - FADE_OUT_START) / (FADE_OUT_END - FADE_OUT_START);
  return 0;
}

export default function VideoTilesHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tilesRef = useRef<HTMLDivElement[]>([]);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.45;
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Video und rAF-Sync laufen nur, solange der Hero im Viewport ist.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!inView) {
      video.pause();
      return;
    }
    video.play().catch(() => {});

    let rafId: number;

    const tick = () => {
      if (video.duration) {
        const t = video.currentTime;
        const opacity = Math.max(0, Math.min(1, opacityAt(t)));

        tilesRef.current.forEach((el, i) => {
          const track = PANEL_TRACKS[i];
          if (!el || !track) return;
          const pos = panelPosAt(track, t);
          el.style.left = `${pos.left}%`;
          el.style.top = `${pos.top}%`;
          el.style.opacity = String(opacity);
        });
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [inView]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-3xl bg-black"
      style={{ aspectRatio: "1280 / 720" }}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/hero-bg.mp4"
        poster="/images/hero-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />

      <div className="absolute inset-0 hidden sm:block">
        {TILES.map((tile, i) => {
          if (!PANEL_TRACKS[i]) return null;
          return (
            <div
              key={tile.id}
              ref={(el) => {
                if (el) tilesRef.current[i] = el;
              }}
              className="absolute flex w-[7%] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
              style={{ opacity: 0 }}
            >
              <h3
                className="tile-pop break-words font-display text-[clamp(0.5rem,0.9vw,0.85rem)] font-semibold leading-[1.15] text-sand-50 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]"
                style={{ animationDelay: `${0.2 + i * 0.12}s` }}
              >
                {tile.title}
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}
