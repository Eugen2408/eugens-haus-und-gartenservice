"use client";

import { useCallback, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";

type Props = {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  alt: string;
};

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "Vorher",
  afterLabel = "Nachher",
  alt,
}: Props) {
  // Startposition: Regler weit rechts, sodass ca. ein Viertel des
  // Nachher-Bildes (rechts) sichtbar ist (User-Wunsch 2026-07-13).
  const [position, setPosition] = useState(75);
  const draggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  // Ziehen ausschließlich über den Griff (Maus wie Touch). Pointer-Capture
  // hält das Dragging, auch wenn der Zeiger den Griff verlässt. Das Bild
  // selbst reagiert nicht auf Tippen – nur der Griff bewegt den Regler.
  function onPointerDown(e: ReactPointerEvent<HTMLButtonElement>) {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  }
  function onPointerMove(e: ReactPointerEvent<HTMLButtonElement>) {
    if (draggingRef.current) updateFromClientX(e.clientX);
  }
  function onPointerUp(e: ReactPointerEvent<HTMLButtonElement>) {
    draggingRef.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-2xl shadow-xl md:aspect-[16/10]"
    >
      <div className="absolute inset-0">
        <Image
          src={afterSrc}
          alt={`${alt} – ${afterLabel}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <span className="absolute right-4 top-4 rounded-full bg-forest-900/80 px-3 py-1 text-xs font-medium tracking-wide text-sand-50">
          {afterLabel}
        </span>
      </div>

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={beforeSrc}
          alt={`${alt} – ${beforeLabel}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <span className="absolute left-4 top-4 rounded-full bg-sand-50/90 px-3 py-1 text-xs font-medium tracking-wide text-forest-900">
          {beforeLabel}
        </span>
      </div>

      {/* Trennlinie + Griff – der Griff ist die einzige Zieh-Fläche */}
      <div
        className="absolute inset-y-0 z-10 -translate-x-1/2"
        style={{ left: `${position}%` }}
      >
        <div className="pointer-events-none absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-sand-50 shadow-md" />
        <button
          type="button"
          aria-label="Vorher/Nachher-Regler ziehen"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{ touchAction: "none" }}
          className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize touch-none items-center justify-center rounded-full bg-sand-50 text-forest-800 shadow-lg ring-2 ring-forest-800/10 transition-transform active:scale-95"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M8 6L2 12L8 18M16 6L22 12L16 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Tastatur-Zugänglichkeit */}
      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label="Vorher/Nachher Vergleich"
        className="sr-only"
      />
    </div>
  );
}
