"use client";

import { useRef } from "react";
import Image from "next/image";
import Reveal from "./Reveal";

const SERVICES = [
  {
    title: "Gartenpflege",
    desc: "Rasenpflege, Beetpflege und regelmäßige Gartenarbeiten – Ihr Garten in guten Händen.",
    image: "/images/rasen.jpg",
  },
  {
    title: "Hecken- & Rückschnitt",
    desc: "Fachgerechter Form- und Rückschnitt von Hecken, Sträuchern und Bäumen.",
    image: "/images/heckenschnitt.jpg",
  },
  {
    title: "Maler- & Wandarbeiten",
    desc: "Malerarbeiten und Wandverschönerung für Innen- und Außenbereiche.",
    image: "/images/fliesen.jpg",
  },
  {
    title: "Intensiv-Flächenreinigung",
    desc: "Hochdruckreinigung von Wegen, Terrassen und Einfahrten – wie neu.",
    image: "/images/flaechenreinigung.jpg",
  },
  {
    title: "Bodenbeläge & Fliesen",
    desc: "Verlegung von Bodenbelägen und Fliesen, sauber und passgenau.",
    image: "/images/bodenbelag.jpg",
  },
  {
    title: "Reparatur- & Handwerkerservice",
    desc: "Montage, Aufbau-Service, Technik-Tausch, Ausbesserungen und Objektbetreuung.",
    image: "/images/nachher-schuppen.jpg",
  },
];

export default function ServicesSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: dir * 380, behavior: "smooth" });
  }

  return (
    <section id="leistungen" className="overflow-hidden bg-sand-50 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-leaf-500">
              Meine Leistungen
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-[1.05] text-forest-950 sm:text-5xl md:text-6xl">
              Wonach suchst du?
            </h2>
            <p className="mt-4 max-w-xl text-forest-800/70">
              Gartenpflege, Rückschnitt, Malerarbeiten, Flächenreinigung,
              Montage, Bodenbeläge, Reparaturen, Aufbau-Service,
              Technik-Tausch, Objektbetreuung – und vieles mehr!
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Zurück"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-forest-900/10 bg-white text-forest-800 transition-colors hover:bg-leaf-200"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Weiter"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-forest-900/10 bg-white text-forest-800 transition-colors hover:bg-leaf-200"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mt-14">
        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 pl-5 pr-5 [scrollbar-width:none] [-ms-overflow-style:none] sm:pl-[max(1.25rem,calc((100vw-72rem)/2+1.25rem))] [&::-webkit-scrollbar]:hidden"
        >
          {SERVICES.map((service, i) => (
            <a
              key={service.title}
              href="#kontakt"
              className="group relative w-[280px] flex-none snap-start overflow-hidden rounded-2xl bg-forest-950 shadow-sm transition-shadow hover:shadow-2xl sm:w-[340px]"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 640px) 80vw, 340px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/30 to-forest-950/10" />

                <span className="absolute left-5 top-5 font-display text-6xl font-semibold text-sand-50/20">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="absolute inset-x-5 bottom-5">
                  <h3 className="font-display text-2xl font-semibold text-sand-50">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-sand-100/80">
                    {service.desc}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-terracotta-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Anfragen
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
