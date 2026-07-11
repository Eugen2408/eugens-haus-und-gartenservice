"use client";

import { useEffect } from "react";
import { DESKTOP as HEDGE_D, MOBILE as HEDGE_M } from "./HedgeScrollScene";
import { DESKTOP as PAINT_D, MOBILE as PAINT_M } from "./PaintScrollScene";
import { DESKTOP as TILES_D, MOBILE as TILES_M } from "./TilesScrollScene";
import { DESKTOP as FLOOR_D, MOBILE as FLOOR_M } from "./FloorScrollScene";
import { DESKTOP as SHED_D, MOBILE as SHED_M } from "./ShedScrollScene";
import { DESKTOP as PATH_D, MOBILE as PATH_M } from "./PathScrollScene";
import { DESKTOP as BATH_D, MOBILE as BATH_M } from "./BathScrollScene";
import { DESKTOP as KITCHEN_D, MOBILE as KITCHEN_M } from "./KitchenScrollScene";
import { DESKTOP as LIGHT_D, MOBILE as LIGHT_M } from "./LightScrollScene";

type FrameSet = { count: number; src: (i: number) => string };

// Seitenreihenfolge der Szenen – so werden die Frames auch vorgeladen,
// damit die nächste sichtbare Szene immer zuerst fertig ist.
const DESKTOP_SETS: FrameSet[] = [HEDGE_D, PAINT_D, TILES_D, FLOOR_D, SHED_D, PATH_D, BATH_D, KITCHEN_D, LIGHT_D];
const MOBILE_SETS: FrameSet[] = [HEDGE_M, PAINT_M, TILES_M, FLOOR_M, SHED_M, PATH_M, BATH_M, KITCHEN_M, LIGHT_M];

// Lädt alle Szenen-Frames im Hintergrund in den Browser-Cache, damit das
// Scrubben beim Scrollen flüssig bleibt. Bewusst zurückhaltend:
// - startet erst nach dem load-Event + Idle-Pause (stört den Seitenstart nicht)
// - lädt sequenziell mit kleiner Parallelität statt alles auf einmal
// - respektiert Datensparmodus und sehr langsame Verbindungen
export default function FramePreloader() {
  useEffect(() => {
    type ConnectionInfo = { saveData?: boolean; effectiveType?: string };
    const conn = (navigator as { connection?: ConnectionInfo }).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /2g/.test(conn.effectiveType)) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const sets = isMobile ? MOBILE_SETS : DESKTOP_SETS;

    // URL-Liste in Szenen-Reihenfolge, Duplikate (gehaltene Frames) raus
    const urls: string[] = [];
    const seen = new Set<string>();
    for (const set of sets) {
      for (let i = 0; i < set.count; i++) {
        const u = set.src(i);
        if (!seen.has(u)) {
          seen.add(u);
          urls.push(u);
        }
      }
    }

    let cancelled = false;
    let idx = 0;
    const CONCURRENCY = 4;

    function next() {
      if (cancelled || idx >= urls.length) return;
      const img = new Image();
      img.onload = next;
      img.onerror = next;
      img.src = urls[idx++];
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    function start() {
      timer = setTimeout(() => {
        if (cancelled) return;
        for (let k = 0; k < CONCURRENCY; k++) next();
      }, 2500);
    }

    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      window.removeEventListener("load", start);
    };
  }, []);

  return null;
}
