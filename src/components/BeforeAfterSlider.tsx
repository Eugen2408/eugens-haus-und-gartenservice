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
  const containerRef = useRef<HTMLDivElement>(null);

  // Gesten-Status: erst wenn horizontale Absicht erkannt ist (|dx|>|dy|),
  // wird gezogen. So bleibt vertikales Scrollen ueber dem Bild moeglich
  // (touch-action: pan-y uebergibt vertikale Gesten an den Browser -> der
  // schickt pointercancel und wir brechen ab).
  const draggingRef = useRef(false);
  const decidedRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0 });

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  // Ziehen/Tippen auf der GESAMTEN Bildflaeche (Maus wie Touch) - der kleine
  // Griff allein war auf dem Handy kaum treffbar (User: "teilweise nicht
  // moeglich"). Maus zieht sofort; Touch entscheidet erst nach kurzer
  // Bewegung zwischen Ziehen (horizontal) und Scrollen (vertikal).
  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    startRef.current = { x: e.clientX, y: e.clientY };
    decidedRef.current = false;
    if (e.pointerType === "mouse") {
      draggingRef.current = true;
      decidedRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      updateFromClientX(e.clientX);
    }
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (draggingRef.current) {
      updateFromClientX(e.clientX);
      return;
    }
    if (decidedRef.current) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return; // Schwelle: echtes Wackeln ignorieren
    decidedRef.current = true;
    if (Math.abs(dx) > Math.abs(dy)) {
      // horizontale Absicht -> ziehen
      draggingRef.current = true;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // iOS kann setPointerCapture verweigern - ohne Capture ziehen wir trotzdem
      }
      updateFromClientX(e.clientX);
    }
    // vertikale Absicht -> nichts tun, Browser scrollt (pan-y)
  }

  function endDrag(e: ReactPointerEvent<HTMLDivElement>) {
    // Tap (kein Ziehen, kaum Bewegung) setzt den Regler an die getippte Stelle
    if (!draggingRef.current && !decidedRef.current) {
      updateFromClientX(e.clientX);
    }
    draggingRef.current = false;
    decidedRef.current = false;
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {
      /* egal */
    }
  }

  function onPointerCancel() {
    // Browser hat die Geste uebernommen (vertikales Scrollen)
    draggingRef.current = false;
    decidedRef.current = false;
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={onPointerCancel}
      style={{ touchAction: "pan-y" }}
      className="relative aspect-[4/3] w-full cursor-ew-resize select-none overflow-hidden rounded-2xl shadow-xl md:aspect-video"
    >
      <div className="pointer-events-none absolute inset-0">
        <Image
          src={afterSrc}
          alt={`${alt} – ${afterLabel}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 86vw"
        />
        <span className="absolute right-4 top-4 rounded-full bg-forest-900/80 px-3 py-1 text-xs font-medium tracking-wide text-sand-50">
          {afterLabel}
        </span>
      </div>

      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={beforeSrc}
          alt={`${alt} – ${beforeLabel}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 86vw"
        />
        <span className="absolute left-4 top-4 rounded-full bg-sand-50/90 px-3 py-1 text-xs font-medium tracking-wide text-forest-900">
          {beforeLabel}
        </span>
      </div>

      {/* Trennlinie + Griff - rein visuell (pointer-events-none); gezogen wird
          die ganze Flaeche darueber. */}
      <div
        className="pointer-events-none absolute inset-y-0 z-10 -translate-x-1/2"
        style={{ left: `${position}%` }}
      >
        <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-sand-50 shadow-md" />
        <div className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-sand-50 text-forest-800 shadow-lg ring-2 ring-forest-800/10">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M8 6L2 12L8 18M16 6L22 12L16 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
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
