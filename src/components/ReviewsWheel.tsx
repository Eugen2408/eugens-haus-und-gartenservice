"use client";

import { useEffect, useRef, useState } from "react";
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

// Gleiche Mechanik wie ServiceWheel: scroll-getriebenes 3D-Rad um die X-Achse.
// Das Rad wickelt nie komplett herum (Rotation 0 … n-1 Schritte), daher darf
// der Winkel unabhängig von der Kartenzahl gewählt werden.
const ANGLE = 24;
// Frontebene liegt durch translateZ(-radius) auf z=0, sonst skaliert die
// Perspektive die vorderste Karte über den Container hinaus.
const RADIUS_DESKTOP = 460;
const RADIUS_MOBILE = 300;

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

function ReviewCard({ review, clamp }: { review: WheelReview; clamp?: boolean }) {
  return (
    <article className="w-full max-w-lg rounded-2xl border border-forest-900/10 bg-white p-5 shadow-lg shadow-forest-900/5">
      <div className="flex items-center gap-3">
        {review.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={review.avatarUrl}
            alt=""
            width={40}
            height={40}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="h-10 w-10 rounded-full"
          />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-leaf-200 font-display font-semibold text-forest-900">
            {review.name.charAt(0)}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-forest-950">{review.name}</p>
          <p className="text-xs text-forest-800/60">{review.dateLabel}</p>
        </div>
        <span className="ml-auto flex-none">
          <Stars value={review.rating} />
        </span>
      </div>
      <p
        className={`mt-3 text-sm leading-relaxed text-forest-800/85 ${
          clamp ? "line-clamp-3 sm:line-clamp-4" : "whitespace-pre-line"
        }`}
      >
        {review.text}
      </p>
    </article>
  );
}

export default function ReviewsWheel({ reviews, summary, googleUrl }: Props) {
  const wrapperRef = useRef<HTMLElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [radius, setRadius] = useState(RADIUS_DESKTOP);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setRadius(window.matchMedia("(max-width: 639px)").matches ? RADIUS_MOBILE : RADIUS_DESKTOP);
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const wheel = wheelRef.current;
    if (!wrapper || !wheel || reducedMotion || reviews.length < 2) return;

    const gsapCtx = gsap.context(() => {
      const state = { step: 0 };
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
        step: reviews.length - 1,
        duration: 1,
        onUpdate: () => {
          wheel.style.transform = `translateZ(${-radius}px) rotateX(${state.step * ANGLE}deg)`;
          const next = Math.min(reviews.length - 1, Math.max(0, Math.round(state.step)));
          setActive((prev) => (prev === next ? prev : next));
        },
      }, 0);
    }, wrapper);

    return () => gsapCtx.revert();
  }, [reducedMotion, radius, reviews.length]);

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

  // Reduced Motion: ruhige, vollständig lesbare Liste statt Rad
  if (reducedMotion) {
    return (
      <section id="bewertungen" className="bg-white px-5 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
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
          className="relative h-[340px] w-full max-w-3xl [perspective:1400px] sm:h-[440px]"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-white to-transparent sm:h-16" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-white to-transparent sm:h-16" />

          <div
            ref={wheelRef}
            className="absolute inset-0 [transform-style:preserve-3d]"
            style={{ transform: `translateZ(${-radius}px) rotateX(0deg)` }}
          >
            {reviews.map((review, i) => {
              const dist = Math.abs(i - active);
              const opacity = dist === 0 ? 1 : dist === 1 ? 0.25 : 0;
              return (
                <div
                  key={review.id}
                  className="absolute inset-x-0 top-1/2 -mt-24 flex h-48 items-start justify-center transition-opacity duration-300 sm:-mt-28 sm:h-56"
                  style={{
                    transform: `rotateX(${-i * ANGLE}deg) translateZ(${radius}px)`,
                    opacity,
                  }}
                >
                  <ReviewCard review={review} clamp />
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-10">{googleLink}</div>
      </div>
    </section>
  );
}
