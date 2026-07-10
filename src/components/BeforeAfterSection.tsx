"use client";

import { useState } from "react";
import BeforeAfterSlider from "./BeforeAfterSlider";
import Reveal from "./Reveal";

const PAIRS = [
  {
    label: "Gartenschuppen",
    beforeSrc: "/images/vorher-schuppen.jpg",
    afterSrc: "/images/nachher-schuppen.jpg",
    alt: "Gartenschuppen freigeschnitten",
  },
  {
    label: "Gehweg-Reinigung",
    beforeSrc: "/images/vorher-platten.jpg",
    afterSrc: "/images/nachher-platten.jpg",
    alt: "Gehwegplatten gereinigt",
  },
];

export default function BeforeAfterSection() {
  const [active, setActive] = useState(0);
  const pair = PAIRS[active];

  return (
    <section
      id="vorher-nachher"
      className="bg-forest-950 px-5 py-24 text-sand-50 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-leaf-300">
            Ergebnisse, die überzeugen
          </p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold sm:text-4xl">
            Vorher &amp; Nachher
          </h2>
          <p className="mt-4 max-w-xl text-sand-100/70">
            Ziehen Sie den Regler und sehen Sie selbst, was ein bisschen
            Pflege bewirken kann.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
          {PAIRS.map((p, i) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                active === i
                  ? "bg-terracotta-500 text-sand-50"
                  : "bg-sand-50/10 text-sand-100/80 hover:bg-sand-50/20"
              }`}
            >
              {p.label}
            </button>
          ))}
        </Reveal>

        <Reveal delay={0.15} className="mt-8">
          <BeforeAfterSlider
            key={pair.label}
            beforeSrc={pair.beforeSrc}
            afterSrc={pair.afterSrc}
            alt={pair.alt}
          />
        </Reveal>
      </div>
    </section>
  );
}
