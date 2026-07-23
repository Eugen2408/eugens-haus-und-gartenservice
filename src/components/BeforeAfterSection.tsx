"use client";

import BeforeAfterSlider from "./BeforeAfterSlider";
import Reveal from "./Reveal";

const PAIRS = [
  {
    label: "Gartenpflege",
    beforeSrc: "/images/vorher-schuppen.jpg",
    afterSrc: "/images/nachher-schuppen.jpg",
    alt: "Verwilderter Garten freigeschnitten und aufgeräumt",
  },
  {
    label: "Heckenschnitt",
    beforeSrc: "/images/vorher-hecke-strasse.jpg",
    afterSrc: "/images/nachher-hecke-strasse.jpg",
    alt: "Überwachsene Hecke in Form geschnitten",
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
];

export default function BeforeAfterSection() {
  return (
    <section
      id="vorher-nachher"
      className="bg-white px-5 pb-14 pt-4 text-forest-950 md:pb-20 md:pt-8"
    >
      <div className="mx-auto max-w-6xl lg:max-w-[86vw]">
        <Reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-leaf-500">
            Ergebnisse, die überzeugen
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl lg:text-6xl">
            Vorher &amp; Nachher
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-forest-800/70 lg:text-lg">
            Ziehen Sie den Regler nach rechts und sehen Sie selbst, was ein
            bisschen Pflege bewirken kann.
          </p>
        </Reveal>

        <div className="mt-10 space-y-12">
          {PAIRS.map((pair, i) => (
            <Reveal key={pair.label} delay={i * 0.1}>
              <p className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.15em] text-forest-800/75">
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
