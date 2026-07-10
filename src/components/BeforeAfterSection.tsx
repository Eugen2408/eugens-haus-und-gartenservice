import BeforeAfterSlider from "./BeforeAfterSlider";
import Reveal from "./Reveal";

export default function BeforeAfterSection() {
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

        <Reveal delay={0.15} className="mt-12">
          <BeforeAfterSlider
            beforeSrc="/images/vorher-schuppen.jpg"
            afterSrc="/images/nachher-schuppen.jpg"
            alt="Gartenschuppen freigeschnitten"
          />
        </Reveal>
      </div>
    </section>
  );
}
