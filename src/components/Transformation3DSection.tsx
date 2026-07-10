import Reveal from "./Reveal";
import Transformation3D from "./Transformation3D";

export default function Transformation3DSection() {
  return (
    <section className="bg-forest-950 px-5 py-24 text-sand-50 md:py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-leaf-300">
            In 3D erleben
          </p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold sm:text-4xl">
            Die Verwandlung – einmal ganz plastisch
          </h2>
          <p className="mt-4 max-w-xl text-sand-100/70">
            Ein Foto dreht sich vor Ihren Augen von Vorher zu Nachher – live
            animiert in 3D, ganz von allein.
          </p>
        </Reveal>

        <Reveal
          delay={0.15}
          className="relative mt-10 h-[420px] w-full overflow-hidden rounded-2xl shadow-xl md:h-[520px]"
        >
          <Transformation3D />
        </Reveal>
      </div>
    </section>
  );
}
