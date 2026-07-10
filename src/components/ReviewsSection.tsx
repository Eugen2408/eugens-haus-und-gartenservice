"use client";

import Script from "next/script";
import Reveal from "./Reveal";

const GOOGLE_PROFILE_URL =
  "https://www.google.com/search?q=Eugens+Haus-+und+Gartenservice+Hamburg";

// Google Place ID: ChIJ-zWuHHua_6sR6OOZXKBzgX0 ("Eugens Haus- und Gartenservice")
// Widget-ID im Featurable-Dashboard (featurable.com) mit dieser Place ID
// verbinden, anlegen und die ID hier eintragen.
const FEATURABLE_WIDGET_ID = "F18C1786";

export default function ReviewsSection() {
  return (
    <section className="bg-sand-100 px-5 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-leaf-500">
            Kundenstimmen
          </p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold text-forest-950 sm:text-4xl">
            Was unsere Kunden sagen
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div className="featurable-widget" data-widget-id={FEATURABLE_WIDGET_ID} />
          <Script src="https://featurable.com/assets/bundle.js" strategy="afterInteractive" />
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
