import Image from "next/image";
import Reveal from "./Reveal";

export default function AboutSection() {
  return (
    <section id="ueber-uns" className="mx-auto max-w-6xl px-5 py-24 md:py-32">
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
        <Reveal>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-xl">
            <Image
              src="/images/heckenschnitt.jpg"
              alt="Eugen bei der Heckenpflege"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-leaf-500">
            Über uns
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-forest-950 sm:text-4xl">
            Der Profi aus der Nachbarschaft
          </h2>
          <p className="mt-5 text-forest-800/80 leading-relaxed">
            Mein Name ist Eugen Wermter. Mit Eugens Haus- und Gartenservice
            stehe ich in Hamburg für zuverlässige, saubere Arbeit – vom
            gepflegten Rasen bis zur fertig verlegten Bodenfliese. Ich packe
            selbst mit an, halte Termine ein und erkläre offen, was wie
            gemacht wird.
          </p>

          <ul className="mt-8 space-y-3">
            {[
              "Zuverlässig & termintreu",
              "Persönlicher Ansprechpartner vor Ort",
              "Faire, transparente Preise",
              "Aus Hamburg, für Hamburg",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-forest-900">
                <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-leaf-200 text-forest-700">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 13L9 17L19 7"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-sm font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
