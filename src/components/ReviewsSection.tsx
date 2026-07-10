"use client";

import { useRef } from "react";
import Reveal from "./Reveal";

const GOOGLE_PROFILE_URL =
  "https://www.google.com/search?q=Eugens+Haus-+und+Gartenservice+Hamburg";

const PLACEHOLDER_REVIEWS = [
  {
    name: "Beispiel-Kunde",
    text: "Hier erscheint bald eine echte Google-Bewertung. Sobald der Profil-Link vorliegt, werden diese Karten automatisch durch eure echten Bewertungen ersetzt.",
    rating: 5,
  },
  {
    name: "Beispiel-Kunde",
    text: "Platzhaltertext für eine weitere Kundenstimme – Sterne-Bewertung und Zitat werden 1:1 von Google übernommen.",
    rating: 5,
  },
  {
    name: "Beispiel-Kunde",
    text: "Dieses Karussell ist technisch fertig und wartet nur noch auf die echten Inhalte von eurem Google-Unternehmensprofil.",
    rating: 4,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 text-terracotta-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < count ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M12 2.5l2.9 6.16 6.6.63-5 4.5 1.5 6.6L12 16.9l-5.9 3.5 1.5-6.6-5-4.5 6.6-.63L12 2.5Z"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  }

  return (
    <section className="bg-sand-100 px-5 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-leaf-500">
              Kundenstimmen
            </p>
            <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold text-forest-950 sm:text-4xl">
              Was unsere Kunden sagen
            </h2>
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

        <Reveal delay={0.1}>
          <div
            ref={scrollerRef}
            className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {PLACEHOLDER_REVIEWS.map((review, i) => (
              <div
                key={i}
                className="w-[320px] flex-none snap-start rounded-2xl border border-forest-900/5 bg-white p-6 shadow-sm sm:w-[360px]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-leaf-200 font-display font-semibold text-forest-700">
                    G
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-forest-950">
                      {review.name}
                    </p>
                    <Stars count={review.rating} />
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-forest-800/70">
                  {review.text}
                </p>
                <span className="mt-4 inline-block rounded-full bg-sand-100 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-forest-800/50">
                  Beispiel
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-8 flex justify-center">
          <a
            href={GOOGLE_PROFILE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-forest-900/10 bg-white px-6 py-3 text-sm font-semibold text-forest-900 shadow-sm transition-colors hover:bg-leaf-200"
          >
            Alle Bewertungen auf Google ansehen
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
