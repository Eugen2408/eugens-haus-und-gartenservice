import Image from "next/image";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";

export default function AboutSection() {
  return (
    <section id="ueber-uns" className="mx-auto max-w-6xl px-5 py-14 md:py-20 lg:max-w-[80vw]">
      <Reveal className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-leaf-500">
          Über mich
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-forest-950 sm:text-5xl">
          Der Profi aus der Nachbarschaft
        </h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-20">
        <Reveal>
          <TiltCard className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-2xl lg:mx-auto lg:max-w-2xl">
            <Image
              src="/images/heckenschnitt.jpg"
              alt="Eugen bei der Heckenpflege"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </TiltCard>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="text-forest-800/80 leading-relaxed lg:text-lg">
            Mein Name ist Eugen Wermter – und Eugens Haus- und Gartenservice
            ist für mich mehr als nur ein Job. Ob verwilderter Garten, ein in
            die Jahre gekommenes Bad oder die Kleinigkeit, für die sonst
            niemand kommt: Ich packe selbst mit an, arbeite sauber und
            behandle jedes Grundstück, als wäre es mein eigenes.
          </p>
          <p className="mt-4 text-forest-800/80 leading-relaxed lg:text-lg">
            Vom ersten Anruf bis zum letzten Handgriff haben Sie einen festen
            Ansprechpartner, klare Absprachen und einen Preis, auf den Sie
            sich verlassen können – hier in Hamburg und Umgebung.
          </p>

          {/* Persönlicher, handschriftlicher Namenszug */}
          <p
            aria-hidden="true"
            className="mt-6 text-5xl leading-none text-leaf-500 sm:text-6xl"
            style={{ fontFamily: "var(--font-signature)" }}
          >
            Eugen
          </p>

          <ul className="mt-8 space-y-3">
            {[
              "Zuverlässig & termintreu",
              "Kompetent und persönlich",
              "Faire, transparente Preise",
              "Aus Hamburg – für Hamburg",
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

          <a
            href="#kontakt"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-leaf-500 px-6 py-3 text-sm font-semibold text-sand-50 shadow-sm transition-colors duration-200 hover:bg-forest-600"
          >
            Lernen wir uns kennen
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
