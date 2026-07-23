"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// pos = object-position des Foto-Thumbs (z. B. Kopf/Oberkörper sichtbar halten)
const ITEMS: { label: string; image: string; pos?: string }[] = [
  { label: "Gartenpflege", image: "/images/gartenpflege.jpg" },
  { label: "Rückschnitt", image: "/images/heckenschnitt.jpg", pos: "50% 22%" },
  { label: "Malerarbeiten", image: "/frames/farbe/farbe-159.webp" },
  { label: "Flächenreinigung", image: "/images/flaechenreinigung.jpg" },
  { label: "Montage", image: "/images/montage.jpg" },
  { label: "Wandverschönerung", image: "/images/wandverschoenerung.jpg" },
  { label: "Bodenbeläge", image: "/images/bodenbelag.jpg" },
  { label: "Reparaturen", image: "/images/reparatur-siphon.jpg" },
  { label: "Aufbau-Service", image: "/frames/kueche/kueche-109.webp" },
  { label: "Technik-Tausch", image: "/frames/licht/licht-000.webp" },
  { label: "Ausbesserung", image: "/images/fliesen.jpg" },
  { label: "Funktions-Service", image: "/frames/licht/licht-115.webp" },
  { label: "Objektbetreuung", image: "/images/objektbetreuung.jpg" },
];

const ANGLE = 360 / ITEMS.length;
// Frontebene liegt durch translateZ(-radius) auf z=0, sonst skaliert die
// Perspektive die vorderste Zeile über den Container hinaus.
const RADIUS_DESKTOP = 540;
const RADIUS_MOBILE = 270;

export default function ServiceWheel() {
  const wrapperRef = useRef<HTMLElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [radius, setRadius] = useState(RADIUS_DESKTOP);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    // Bis 1023px (Handy UND Tablet) die kompakte Variante mit kleinem Radius:
    // Tablets hatten sonst den grossen Desktop-Radius + 400px-Thumbs und zu wenig
    // Breite -> Text links und Bild rechts wurden am Rand abgeschnitten.
    setRadius(window.matchMedia("(max-width: 1023px)").matches ? RADIUS_MOBILE : RADIUS_DESKTOP);
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
          // Rad genau bei Sektionsende durch; die kompakte Bühne (top-[18svh]
          // + 64svh) bleibt kurz gepinnt, während Vorher/Nachher schon eng
          // von unten einläuft – kein großer weißer Zwischenraum.
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      }).to(state, {
        step: ITEMS.length - 1,
        duration: 1,
        onUpdate: () => {
          wheel.style.transform = `translateZ(${-radius}px) rotateX(${state.step * ANGLE}deg)`;
          const next = Math.min(ITEMS.length - 1, Math.max(0, Math.round(state.step)));
          setActive((prev) => (prev === next ? prev : next));
        },
      }, 0);
    }, wrapper);

    return () => gsapCtx.revert();
  }, [reducedMotion, radius]);

  // Reduced Motion: alle Leistungen als ruhige, vollständig sichtbare Liste
  if (reducedMotion) {
    return (
      <section id="beste-wahl" className="bg-white px-5 py-14 md:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-display text-3xl font-semibold text-forest-950 sm:text-5xl">
            Die beste Wahl für:
          </h2>
          <ul className="mt-12 space-y-6">
            {ITEMS.map((item) => (
              <li key={item.label} className="flex items-center justify-between gap-4">
                <span className="font-display text-2xl font-semibold text-forest-950 sm:text-4xl">
                  {item.label}
                </span>
                <span className="relative block h-24 w-40 flex-none overflow-hidden rounded-xl shadow-md ring-1 ring-forest-900/10">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="160px"
                    className="object-cover"
                    style={{ objectPosition: item.pos ?? "50% 50%" }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section id="beste-wahl" ref={wrapperRef} className="relative h-[220svh] bg-white">
      <p className="sr-only">
        Die beste Wahl für: {ITEMS.map((item) => item.label).join(", ")}.
      </p>

      {/* Kompakte, mittig platzierte Bühne (64svh): kurze Ränder oben (kleiner
          Abstand zur Überschrift) UND unten (enger Sprung zu Vorher/Nachher). */}
      <div className="sticky top-[18svh] mx-auto flex h-[64svh] w-full max-w-6xl flex-col overflow-hidden px-5 lg:max-w-[86vw]">
        {/* Fester Kopf oben: weißes Band mit hohem z-Index maskiert alles
            dahinter, damit kein Rad-Element in die Überschrift hineinragt */}
        <div className="z-30 shrink-0 bg-white pb-2 text-center">
          <h2 className="font-display text-3xl font-semibold text-forest-950 sm:text-5xl">
            Die beste Wahl für:
          </h2>
        </div>

        {/* Rad füllt den Rest der Bühne, overflow-hidden verhindert Ausbrechen */}
        <div
          aria-hidden="true"
          className="relative mt-2 flex-1 overflow-hidden [perspective:1300px]"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-white to-transparent sm:h-24" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-white to-transparent sm:h-24" />

          <div
            ref={wheelRef}
            className="absolute inset-0 [transform-style:preserve-3d]"
            style={{ transform: `translateZ(${-radius}px) rotateX(0deg)` }}
          >
            {ITEMS.map((item, i) => {
              const dist = Math.abs(i - active);
              const opacity = dist === 0 ? 1 : dist === 1 ? 0.3 : 0;
              const isActive = dist === 0;
              return (
                <div
                  key={item.label}
                  className="absolute inset-x-0 top-1/2 -mt-16 flex h-32 items-center justify-center gap-2 transition-opacity duration-300 lg:-mt-32 lg:h-64 lg:gap-8"
                  style={{
                    transform: `rotateX(${-i * ANGLE}deg) translateZ(${radius}px)`,
                    opacity,
                  }}
                >
                  <span
                    className={`whitespace-nowrap font-display text-lg font-semibold leading-none transition-colors duration-300 lg:text-6xl xl:text-7xl ${
                      isActive ? "text-terracotta-600" : "text-forest-900"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`relative block h-28 w-40 flex-none overflow-hidden rounded-2xl shadow-lg ring-1 ring-forest-900/10 transition-transform duration-300 lg:h-64 lg:w-[25rem] ${
                      isActive ? "scale-105" : "scale-90"
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 160px, 400px"
                      className="object-cover"
                      style={{ objectPosition: item.pos ?? "50% 50%" }}
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
