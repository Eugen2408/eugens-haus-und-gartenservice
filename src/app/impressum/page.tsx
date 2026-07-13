import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Impressum | Eugens Haus- und Gartenservice",
  description: "Impressum von Eugens Haus- und Gartenservice, Hamburg.",
  robots: { index: false },
};

export default function ImpressumPage() {
  return (
    <>
      <main className="mx-auto w-full max-w-3xl px-5 pb-24 pt-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-leaf-500 transition-colors hover:text-forest-600"
        >
          ← Zurück zur Startseite
        </Link>

        <h1 className="mt-8 font-display text-4xl font-semibold text-forest-950">
          Impressum
        </h1>

        <div className="mt-8 space-y-6 leading-relaxed text-forest-800">
          <section>
            <h2 className="font-display text-xl font-semibold text-forest-950">
              Angaben gemäß § 5 DDG
            </h2>
            <p className="mt-2">
              Eugens Haus- und Gartenservice
              <br />
              Inhaber: Eugen Wermter
              <br />
              Reembroden 14
              <br />
              22339 Hamburg
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-forest-950">
              Kontakt
            </h2>
            <p className="mt-2">
              Mobil: <a className="underline hover:text-leaf-500" href="tel:+4915560691797">0155 60691797</a>
              <br />
              Festnetz: <a className="underline hover:text-leaf-500" href="tel:+494036935718">040 36935718</a>
              <br />
              E-Mail:{" "}
              <a className="underline hover:text-leaf-500" href="mailto:kontakt@eugens-hausundgartenservice.de">
                kontakt@eugens-hausundgartenservice.de
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-forest-950">
              Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
            </h2>
            <p className="mt-2">
              Eugen Wermter
              <br />
              Reembroden 14
              <br />
              22339 Hamburg
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-forest-950">
              EU-Streitschlichtung
            </h2>
            <p className="mt-2">
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit:{" "}
              <a
                className="underline hover:text-leaf-500"
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noreferrer"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
              . Meine E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-forest-950">
              Verbraucherstreitbeilegung / Universalschlichtungsstelle
            </h2>
            <p className="mt-2">
              Ich bin nicht bereit oder verpflichtet, an
              Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
