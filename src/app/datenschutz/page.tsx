import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | Eugens Haus- und Gartenservice",
  description: "Datenschutzerklärung von Eugens Haus- und Gartenservice, Hamburg.",
  robots: { index: false },
};

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-10 font-display text-xl font-semibold text-forest-950">
      {children}
    </h2>
  );
}

export default function DatenschutzPage() {
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
          Datenschutzerklärung
        </h1>

        <div className="leading-relaxed text-forest-800">
          <H2>1. Verantwortlicher</H2>
          <p className="mt-2">
            Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO):
            <br />
            Eugen Wermter · Eugens Haus- und Gartenservice
            <br />
            Reembroden 14, 22339 Hamburg
            <br />
            Telefon: 0155 60691797 · E-Mail: kontakt@eugens-hausundgartenservice.de
          </p>

          <H2>2. Allgemeines zur Datenverarbeitung</H2>
          <p className="mt-2">
            Diese Website dient der Vorstellung meines Betriebs. Es werden
            keine Tracking- oder Werbe-Cookies gesetzt und keine
            Analyse-Dienste eingesetzt. Personenbezogene Daten werden nur
            verarbeitet, soweit dies für die Bereitstellung der Website oder
            die Bearbeitung Ihrer Anfragen erforderlich ist.
          </p>

          <H2>3. Hosting und Server-Logfiles</H2>
          <p className="mt-2">
            Diese Website wird bei Vercel Inc., 440 N Barranca Ave #4133,
            Covina, CA 91723, USA gehostet. Beim Aufruf der Website verarbeitet
            Vercel technisch notwendige Daten (u. a. IP-Adresse, Datum und
            Uhrzeit des Zugriffs, aufgerufene Seite, Browsertyp), um die Seite
            auszuliefern und die Sicherheit des Betriebs zu gewährleisten
            (Art. 6 Abs. 1 lit. f DSGVO). Mit Vercel besteht ein Vertrag zur
            Auftragsverarbeitung; soweit Daten in die USA übertragen werden,
            erfolgt dies auf Grundlage der EU-Standardvertragsklauseln.
            Weitere Informationen:{" "}
            <a
              className="underline hover:text-leaf-500"
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noreferrer"
            >
              vercel.com/legal/privacy-policy
            </a>
            .
          </p>

          <H2>4. Kontaktformular</H2>
          <p className="mt-2">
            Wenn Sie das Kontaktformular nutzen, werden die von Ihnen
            eingegebenen Daten (Name, Kontaktdaten, Nachricht) über den
            Dienst FormSubmit an meine E-Mail-Adresse übermittelt, um Ihre
            Anfrage zu beantworten (Art. 6 Abs. 1 lit. b DSGVO). Die Daten
            werden nur so lange gespeichert, wie es für die Bearbeitung Ihrer
            Anfrage erforderlich ist.
          </p>

          <H2>5. Kontakt per Telefon, E-Mail oder WhatsApp</H2>
          <p className="mt-2">
            Wenn Sie mich per Telefon, E-Mail oder über den WhatsApp-Button
            kontaktieren, werden Ihre Angaben zur Bearbeitung der Anfrage
            verarbeitet (Art. 6 Abs. 1 lit. b DSGVO). Für WhatsApp gelten
            ergänzend die Datenschutzhinweise von WhatsApp Ireland Ltd.
          </p>

          <H2>6. Google-Bewertungen</H2>
          <p className="mt-2">
            Auf der Website werden öffentlich einsehbare Google-Bewertungen
            meines Betriebs angezeigt. Die Bewertungsdaten werden serverseitig
            über den Dienst Featurable abgerufen. Beim Anzeigen der
            Profilbilder der Bewertenden kann Ihr Browser eine Verbindung zu
            Servern von Google (Google Ireland Ltd.) aufbauen, wobei Ihre
            IP-Adresse übertragen wird (Art. 6 Abs. 1 lit. f DSGVO –
            berechtigtes Interesse an der Darstellung von Kundenstimmen).
          </p>

          <H2>7. Cookies und lokale Speicherung</H2>
          <p className="mt-2">
            Diese Website setzt keine Cookies zu Tracking- oder Werbezwecken.
            Lediglich Ihre Entscheidung im Datenschutz-Hinweisbanner wird
            lokal in Ihrem Browser gespeichert (localStorage), damit der
            Hinweis nicht bei jedem Besuch erneut erscheint (Art. 6 Abs. 1
            lit. f DSGVO).
          </p>

          <H2>8. Ihre Rechte</H2>
          <p className="mt-2">
            Sie haben gegenüber mir das Recht auf Auskunft (Art. 15 DSGVO),
            Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO),
            Einschränkung der Verarbeitung (Art. 18 DSGVO),
            Datenübertragbarkeit (Art. 20 DSGVO) sowie Widerspruch gegen die
            Verarbeitung (Art. 21 DSGVO). Außerdem haben Sie das Recht, sich
            bei einer Datenschutz-Aufsichtsbehörde zu beschweren, z. B. beim
            Hamburgischen Beauftragten für Datenschutz und
            Informationsfreiheit.
          </p>

          <H2>9. Stand</H2>
          <p className="mt-2">
            Diese Datenschutzerklärung hat den Stand Juli 2026. Sie wird bei
            Bedarf angepasst.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
