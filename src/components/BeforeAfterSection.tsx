"use client";

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
  {
    label: "Badsanierung",
    beforeSrc: "/images/vorher-bad.jpg",
    afterSrc: "/images/nachher-bad.jpg",
    alt: "Badezimmer entkernt und neu aufgebaut",
  },
  {
    label: "Bodenverlegung",
    beforeSrc: "/images/vorher-boden.jpg",
    afterSrc: "/images/nachher-boden.jpg",
    alt: "Neuer Bodenbelag verlegt",
  },
  {
    label: "Wandfliesen",
    beforeSrc: "/images/vorher-fliesen.jpg",
    afterSrc: "/images/nachher-fliesen.jpg",
    alt: "Wand neu gefliest",
  },
  {
    label: "Heckenschnitt",
    beforeSrc: "/images/vorher-hecke.jpg",
    afterSrc: "/images/nachher-hecke.jpg",
    alt: "Hecke in Form geschnitten",
  },
];

export default function BeforeAfterSection() {
  return (
    <section
      id="vorher-nachher"
      className="bg-white px-5 py-14 text-forest-950 md:py-20"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-leaf-500">
            Ergebnisse, die überzeugen
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            Vorher &amp; Nachher
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-forest-800/70">
            Ziehen Sie den Regler nach rechts und sehen Sie selbst, was ein
            bisschen Pflege bewirken kann.
          </p>
        </Reveal>

        <div className="mt-10 space-y-12">
          {PAIRS.map((pair, i) => (
            <Reveal key={pair.label} delay={i * 0.1}>
              <p className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.15em] text-forest-800/60">
                {pair.label}
              </p>
              <BeforeAfterSlider
                beforeSrc={pair.beforeSrc}
                afterSrc={pair.afterSrc}
                alt={pair.alt}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
