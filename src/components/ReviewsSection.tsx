"use client";

import { useEffect } from "react";
import Script from "next/script";
import Reveal from "./Reveal";

const GOOGLE_PROFILE_URL =
  "https://www.google.com/search?q=Eugens+Haus-+und+Gartenservice+Hamburg";

// Google Place ID: ChIJ-zWuHHua_6sR6OOZXKBzgX0 ("Eugens Haus- und Gartenservice")
const FEATURABLE_WIDGET_ID = "4232857a-9a67-4d53-89a8-89313d81dc99";
const FEATURABLE_CONTAINER_ID = `featurable-${FEATURABLE_WIDGET_ID}`;

// Featurable uebersetzt nur die Bewertungstexte, nicht die eigene Widget-Ueberschrift.
// Da die Sektion bereits eine deutsche Ueberschrift hat, blenden wir das doppelte
// englische Widget-Title-Element (im Shadow DOM) per DOM-Patch aus.
function useHideFeaturableTitle() {
  useEffect(() => {
    const container = document.getElementById(FEATURABLE_CONTAINER_ID);
    if (!container) return;

    function hideTitle(root: ParentNode) {
      const title = root.querySelector<HTMLElement>(".title");
      if (title) title.style.display = "none";
    }

    let shadowObserver: MutationObserver | null = null;

    const outerObserver = new MutationObserver(() => {
      const wrapper = container.querySelector(".shadow-wrapper");
      if (wrapper?.shadowRoot && !shadowObserver) {
        hideTitle(wrapper.shadowRoot);
        shadowObserver = new MutationObserver(() => hideTitle(wrapper.shadowRoot!));
        shadowObserver.observe(wrapper.shadowRoot, { childList: true, subtree: true });
      }
    });
    outerObserver.observe(container, { childList: true, subtree: true });

    return () => {
      outerObserver.disconnect();
      shadowObserver?.disconnect();
    };
  }, []);
}

export default function ReviewsSection() {
  useHideFeaturableTitle();

  return (
    <section id="bewertungen" className="bg-sand-100 px-5 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-leaf-500">
            Kundenstimmen
          </p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold text-forest-950 sm:text-4xl">
            Was meine Kunden sagen
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div
            id={`featurable-${FEATURABLE_WIDGET_ID}`}
            data-featurable-async
            data-location-code="de"
          />
          <Script src="https://cdn.featurable.com/widget/v2/embed.js" strategy="afterInteractive" />
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
