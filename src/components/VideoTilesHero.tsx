"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type TileData = {
  id: string;
  title: string;
  text: string;
};

// Prozent-Positionen (links/oben, Mittelpunkt) der leeren Glaskacheln,
// die bereits fest im Video gerendert sind (gemessen am 1280x720-Frame).
const PANEL_SPOTS = [
  { left: 18, top: 64 },
  { left: 32.8, top: 61 },
  { left: 50, top: 58 },
  { left: 67.6, top: 61 },
  { left: 82, top: 64 },
];

export default function VideoTilesHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const tilesRef = useRef<HTMLDivElement[]>([]);
  const [tiles, setTiles] = useState<TileData[] | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.45;
    }
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

      {tiles?.map((tile, i) => {
        const spot = PANEL_SPOTS[i];
        if (!spot) return null;
        return (
          <div
            key={tile.id}
            ref={(el) => {
              if (el) tilesRef.current[i] = el;
            }}
            className="absolute flex w-[13%] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
            style={{ left: `${spot.left}%`, top: `${spot.top}%` }}
          >
            <h3 className="font-display text-[clamp(0.5rem,1.4vw,1.05rem)] font-semibold leading-[1.1] text-sand-50 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              {tile.title}
            </h3>
            <p className="mt-1 hidden text-[clamp(0.55rem,0.9vw,0.7rem)] leading-snug text-sand-100/85 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] sm:block">
              {tile.text}
            </p>
          </div>
        );
      })}
    </div>
  );
}
