"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type WheelReview = {
  id: string;
  name: string;
  avatarUrl: string | null;
  rating: number;
  dateLabel: string;
  text: string;
};

type Props = {
  reviews: WheelReview[];
  summary: { rating: number; count: number } | null;
  googleUrl: string;
};

// Scroll-getriebenes Bewertungs-Rad. Die Karten werden per PIXEL positioniert:
// jede Karte an ihrer gemessenen Hoehe + festem Abstand (GAP) gestapelt, sodass
// zwischen zwei Karten immer derselbe Rand bleibt – kurze Bewertungen stehen eng,
// lange werden komplett gezeigt. Die aktive Karte liegt exakt flach und mittig
// (voller Groesse); Nachbarn kippen leicht und blenden aus (Rad-/Coverflow-Look).
const GAP = 44; // px Abstand zwischen benachbarten Karten
const TILT_REF = 360; // px, ab dem die Neigung ihr Maximum erreicht
const TILT_MAX = 30; // Grad maximale Neigung der Nachbarkarten
const TZ_MAX = 220; // px maximaler Tiefen-Versatz

function Stars({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5 text-terracotta-500" aria-label={`${value} von 5 Sternen`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < value ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

function ReviewCard({ review }: { review: WheelReview }) {
  return (
    <article className="w-full max-w-3xl rounded-2xl border border-forest-900/10 bg-white p-6 shadow-lg shadow-forest-900/5 sm:p-8">
      <div className="flex items-center gap-3 sm:gap-4">
        {review.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={review.avatarUrl}
            alt=""
            width={48}
            height={48}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="h-11 w-11 rounded-full sm:h-12 sm:w-12"
          />
        ) : (
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-leaf-200 font-display font-semibold text-forest-900 sm:h-12 sm:w-12">
            {review.name.charAt(0)}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-forest-950 sm:text-lg">{review.name}</p>
          <p className="text-xs text-forest-800/60 sm:text-sm">{review.dateLabel}</p>
        </div>
        <span className="ml-auto flex-none">
          <Stars value={review.rating} />
        </span>
      </div>
      <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-forest-800/85 sm:text-lg">
        {review.text}
      </p>
    </article>
  );
}

export default function ReviewsWheel({ reviews, summary, googleUrl }: Props) {
  const wrapperRef = useRef<HTMLElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  // Auf Mobile das Rad durch die vollständige Liste ersetzen (bessere Lesbarkeit,
  // kein 3D noetig auf kleinen Screens).
  const [isMobile, setIsMobile] = useState(false);
  // Gemessene Kartenhoehen; leer bis zur ersten Messung.
  const [heights, setHeights] = useState<number[]>([]);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setIsMobile(window.matchMedia("(max-width: 639px)").matches);
  }, []);

  // Kartenhoehen messen (nach Font-Load und bei Resize neu).
  useEffect(() => {
    if (reducedMotion || isMobile) return;
    function measure() {
      const hs = reviews.map((_, i) => slotRefs.current[i]?.querySelector("article")?.offsetHeight ?? 240);
      setHeights((prev) => (prev.length === hs.length && prev.every((v, i) => v === hs[i]) ? prev : hs));
    }
    measure();
    let raf = 0;
    document.fonts?.ready.then(() => { raf = requestAnimationFrame(measure); });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion, isMobile, reviews]);

  // Mitte jeder Karte im gestapelten Fluss (Pixel). Fallback 240px bis gemessen.
  const centers = useMemo(() => {
    const c: number[] = [];
    let top = 0;
    for (let i = 0; i < reviews.length; i++) {
      const h = heights[i] ?? 240;
      c.push(top + h / 2);
      top += h + GAP;
    }
    return c;
  }, [heights, reviews]);

  const maxCardH = useMemo(() => (heights.length ? Math.max(...heights) : 0), [heights]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const wheel = wheelRef.current;
    if (!wrapper || !wheel || reducedMotion || isMobile || reviews.length < 2) return;

    const n = reviews.length;
    // Positioniert alle Karten fuer einen (kontinuierlichen) Schritt:
    // aktive Karte flach/mittig, Nachbarn per Pixel-Abstand versetzt, geneigt, ausgeblendet.
    function layout(step: number) {
      const b = Math.max(0, Math.min(n - 1, Math.floor(step)));
      const b1 = Math.min(n - 1, b + 1);
      const targetCenter = centers[b] + (step - b) * (centers[b1] - centers[b]);
      const activeIdx = Math.max(0, Math.min(n - 1, Math.round(step)));
      for (let i = 0; i < n; i++) {
        const slot = slotRefs.current[i];
        if (!slot) continue;
        const dy = centers[i] - targetCenter; // px Versatz zur Bildmitte
        const t = Math.max(-1, Math.min(1, dy / TILT_REF));
        const tilt = t * TILT_MAX; // obere Karten kippen zurueck, untere nach vorn
        const tz = -Math.min(TZ_MAX, Math.abs(dy) * 0.32);
        // translateY(-50%) zentriert die (unterschiedlich hohe) Karte auf top-1/2
        slot.style.transform = `translateY(-50%) translateY(${dy}px) translateZ(${tz}px) rotateX(${-tilt}deg)`;
        slot.style.opacity = String(i === activeIdx ? 1 : Math.abs(i - activeIdx) === 1 ? 0.28 : 0);
        slot.style.zIndex = String(i === activeIdx ? 2 : 1);
      }
      setActive((prev) => (prev === activeIdx ? prev : activeIdx));
    }

    const gsapCtx = gsap.context(() => {
      const state = { step: 0 };
      layout(0);
      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      }).to(state, {
        step: n - 1,
        duration: 1,
        onUpdate: () => layout(state.step),
      }, 0);
    }, wrapper);

    return () => gsapCtx.revert();
  }, [reducedMotion, isMobile, reviews.length, centers]);

  const header = (
    // z-20 + weißer Grund, damit keine ausgeblendete Karte die Überschrift überlagert
    <div className="relative z-20 w-full bg-white pb-2 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-leaf-500">
        Kundenstimmen
      </p>
      <h2 className="mt-3 font-display text-3xl font-semibold text-forest-950 sm:text-5xl">
        Was meine Kunden sagen
      </h2>
      {summary && (
        <p className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-forest-800">
          <Stars value={Math.round(summary.rating)} />
          {summary.rating.toLocaleString("de-DE")} · {summary.count} Google-Bewertungen
        </p>
      )}
    </div>
  );

  const googleLink = (
    <a
      href={googleUrl}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-forest-900/10 bg-white px-6 py-3 text-sm font-semibold text-forest-900 shadow-sm transition-colors hover:bg-leaf-200"
    >
      Alle Bewertungen auf Google ansehen
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );

  // Reduced Motion ODER Mobile: ruhige, vollständig lesbare Liste statt Rad
  if (reducedMotion || isMobile) {
    return (
      <section id="bewertungen" className="bg-white px-5 py-14 md:py-20">
        <div className="mx-auto max-w-6xl lg:max-w-[80vw]">
          {header}
          <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3">
            {reviews.map((review) => (
              <div key={review.id} className="mb-6 break-inside-avoid">
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">{googleLink}</div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="bewertungen"
      ref={wrapperRef}
      className="relative bg-white"
      style={{ height: `${Math.max(300, reviews.length * 25)}svh` }}
    >
      {/* Volltexte für Screenreader & Suchmaschinen */}
      <div className="sr-only">
        {reviews.map((review) => (
          <p key={review.id}>
            {review.name} ({review.rating}/5): {review.text}
          </p>
        ))}
      </div>

      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden px-5">
        {header}

        <div
          aria-hidden="true"
          className="relative h-[440px] w-full max-w-5xl [perspective:1600px] sm:h-[620px]"
          // Buehne so hoch wie die groesste Karte + Rand, gedeckelt, damit sie mit
          // Ueberschrift/Link in den Viewport passt und nichts oben abschneidet.
          style={maxCardH ? { height: `${Math.min(820, Math.max(460, maxCardH + 120))}px` } : undefined}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-white to-transparent sm:h-14" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-t from-white to-transparent sm:h-14" />

          <div ref={wheelRef} className="absolute inset-0 [transform-style:preserve-3d]">
            {reviews.map((review, i) => (
              <div
                key={review.id}
                ref={(el) => {
                  slotRefs.current[i] = el;
                }}
                className="absolute inset-x-0 top-1/2 flex justify-center transition-opacity duration-300"
                style={{ transform: "translateY(-50%)", opacity: i === 0 ? 1 : 0 }}
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">{googleLink}</div>
      </div>
    </section>
  );
}
