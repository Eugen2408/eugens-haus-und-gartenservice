"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const ITEMS = [
  { label: "Gartenpflege", image: "/images/rasen.jpg" },
  { label: "Rückschnitt", image: "/images/heckenschnitt.jpg" },
  { label: "Malerarbeiten", image: "/frames/farbe/farbe-159.webp" },
  { label: "Intensiv-Flächenreinigung", image: "/images/flaechenreinigung.jpg" },
  { label: "Montage", image: "/frames/licht/licht-000.webp" },
  { label: "Wandverschönerung", image: "/frames/fliesen/fliesen-40.webp" },
  { label: "Bodenbeläge", image: "/images/bodenbelag.jpg" },
  { label: "Reparaturen", image: "/images/reparaturen.jpg" },
  { label: "Aufbau-Service", image: "/frames/kueche/kueche-109.webp" },
  { label: "Technik-Tausch", image: "/images/technik-tausch.jpg" },
  { label: "Ausbesserung", image: "/images/fliesen.jpg" },
  { label: "Funktions-Service", image: "/frames/licht/licht-115.webp" },
  { label: "Objektbetreuung", image: "/images/objektbetreuung.jpg" },
];

const ANGLE = 360 / ITEMS.length;
const RADIUS = 112;
const TICK_MS = 2400;

export default function ServiceWheel() {
  const sectionRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [inView, setInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const id = setInterval(() => setStep((s) => s + 1), TICK_MS);
    return () => clearInterval(id);
  }, [inView, reducedMotion]);

  const activeIndex = step % ITEMS.length;

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-white py-16 md:py-24"
    >
      <p className="sr-only">
        Die beste Wahl für: {ITEMS.map((item) => item.label).join(", ")}.
      </p>

      <div
        aria-hidden="true"
        className="mx-auto flex max-w-6xl flex-col items-center px-5 md:flex-row md:justify-center md:gap-6"
      >
        <h2 className="text-center font-display text-2xl font-semibold text-forest-950 sm:text-3xl md:flex-none md:text-right md:text-4xl">
          Die beste Wahl für:
        </h2>

        <div className="relative h-[300px] w-full max-w-[640px] [perspective:1000px] md:h-[340px]">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-white to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-white to-transparent" />

          <div
            className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d]"
            style={{ transform: `translateZ(${-RADIUS}px) rotateX(${step * ANGLE}deg)` }}
          >
            {ITEMS.map((item, i) => {
              const raw = Math.abs(i - activeIndex);
              const dist = Math.min(raw, ITEMS.length - raw);
              const opacity =
                dist === 0 ? 1 : dist === 1 ? 0.32 : dist === 2 ? 0.14 : dist === 3 ? 0.05 : 0;
              const isActive = dist === 0;
              return (
                <div
                  key={item.label}
                  className="absolute inset-x-0 top-1/2 -mt-7 flex h-14 items-center justify-center gap-3 transition-opacity duration-500 sm:gap-4 md:justify-start"
                  style={{
                    transform: `rotateX(${-i * ANGLE}deg) translateZ(${RADIUS}px)`,
                    opacity,
                  }}
                >
                  <span
                    className={`whitespace-nowrap font-display text-xl font-semibold leading-none transition-colors duration-500 sm:text-3xl md:text-4xl ${
                      isActive ? "text-terracotta-600" : "text-forest-900"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`relative block h-12 w-16 flex-none overflow-hidden rounded-xl shadow-md ring-1 ring-forest-900/10 transition-transform duration-500 sm:h-14 sm:w-20 ${
                      isActive ? "scale-105" : "scale-90"
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="80px"
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
