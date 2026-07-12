"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  { label: "Gartenpflege", image: "/images/gartenpflege.jpg" },
  { label: "Rückschnitt", image: "/images/heckenschnitt.jpg" },
  { label: "Malerarbeiten", image: "/frames/farbe/farbe-159.webp" },
  { label: "Intensiv-Flächenreinigung", image: "/images/flaechenreinigung.jpg" },
  { label: "Montage", image: "/images/montage.jpg" },
  { label: "Wandverschönerung", image: "/images/wandverschoenerung.jpg" },
  { label: "Bodenbeläge", image: "/images/bodenbelag.jpg" },
  { label: "Reparaturen", image: "/images/reparaturen.jpg" },
  { label: "Aufbau-Service", image: "/frames/kueche/kueche-109.webp" },
  { label: "Technik-Tausch", image: "/frames/licht/licht-000.webp" },
  { label: "Ausbesserung", image: "/images/fliesen.jpg" },
  { label: "Funktions-Service", image: "/frames/licht/licht-115.webp" },
  { label: "Objektbetreuung", image: "/images/objektbetreuung.jpg" },
];

const ANGLE = 360 / ITEMS.length;
// Frontebene liegt durch translateZ(-RADIUS) auf z=0, sonst skaliert die
// Perspektive die vorderste Zeile über den Container hinaus.
const RADIUS = 240;

export default function ServiceWheel() {
  const wrapperRef = useRef<HTMLElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const wheel = wheelRef.current;
    if (!wrapper || !wheel || reducedMotion) return;

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
        step: ITEMS.length - 1,
        duration: 1,
        onUpdate: () => {
          wheel.style.transform = `translateZ(${-RADIUS}px) rotateX(${state.step * ANGLE}deg)`;
          const next = Math.min(ITEMS.length - 1, Math.max(0, Math.round(state.step)));
          setActive((prev) => (prev === next ? prev : next));
        },
      }, 0);
    }, wrapper);

    return () => gsapCtx.revert();
  }, [reducedMotion]);

  // Reduced Motion: alle Leistungen als ruhige, vollständig sichtbare Liste
  if (reducedMotion) {
    return (
      <section className="bg-white px-5 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-3xl font-semibold text-forest-950 sm:text-5xl">
            Die beste Wahl für:
          </h2>
          <ul className="mt-12 space-y-6">
            {ITEMS.map((item) => (
              <li key={item.label} className="flex items-center justify-between gap-4">
                <span className="font-display text-2xl font-semibold text-forest-950 sm:text-3xl">
                  {item.label}
                </span>
                <span className="relative block h-16 w-28 flex-none overflow-hidden rounded-xl shadow-md ring-1 ring-forest-900/10">
                  <Image src={item.image} alt="" fill sizes="112px" className="object-cover" />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section id="beste-wahl" ref={wrapperRef} className="relative h-[350svh] bg-white">
      <p className="sr-only">
        Die beste Wahl für: {ITEMS.map((item) => item.label).join(", ")}.
      </p>

      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden px-5">
        <h2 className="text-center font-display text-3xl font-semibold text-forest-950 sm:text-5xl">
          Die beste Wahl für:
        </h2>

        <div
          aria-hidden="true"
          className="relative mt-6 h-[420px] w-full max-w-4xl [perspective:1200px] sm:h-[540px]"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-white to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-white to-transparent" />

          <div
            ref={wheelRef}
            className="absolute inset-0 [transform-style:preserve-3d]"
            style={{ transform: `translateZ(${-RADIUS}px) rotateX(0deg)` }}
          >
            {ITEMS.map((item, i) => {
              const dist = Math.abs(i - active);
              const opacity = dist === 0 ? 1 : dist === 1 ? 0.3 : dist === 2 ? 0.1 : 0;
              const isActive = dist === 0;
              return (
                <div
                  key={item.label}
                  className="absolute inset-x-0 top-1/2 -mt-8 flex h-16 items-center justify-center gap-3 transition-opacity duration-300 sm:-mt-14 sm:h-28 sm:gap-6"
                  style={{
                    transform: `rotateX(${-i * ANGLE}deg) translateZ(${RADIUS}px)`,
                    opacity,
                  }}
                >
                  <span
                    className={`whitespace-nowrap font-display text-xl font-semibold leading-none transition-colors duration-300 sm:text-4xl md:text-5xl ${
                      isActive ? "text-terracotta-600" : "text-forest-900"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`relative block h-16 w-28 flex-none overflow-hidden rounded-2xl shadow-lg ring-1 ring-forest-900/10 transition-transform duration-300 sm:h-28 sm:w-44 ${
                      isActive ? "scale-105" : "scale-90"
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 128px, 176px"
                      className="object-cover"
                    />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
