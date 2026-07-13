import Reveal from "./Reveal";
import ContactForm from "./ContactForm";

const CONTACT_ITEMS = [
  {
    label: "WhatsApp",
    value: "Direkt chatten",
    href: "https://wa.me/4915560691797?text=" +
      encodeURIComponent("Hallo! Ich interessiere mich für Ihren Haus- und Gartenservice."),
  },
  {
    label: "Telefon",
    value: "0155 60691797",
    href: "tel:+4915560691797",
  },
  {
    label: "Festnetz",
    value: "040 36935718",
    href: "tel:+494036935718",
  },
  {
    label: "Adresse",
    value: "Reembroden 14, 22339 Hamburg",
    href: "https://maps.google.com/?q=Reembroden+14,+22339+Hamburg",
  },
];

export default function ContactSection() {
  return (
    <section id="kontakt" className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <Reveal className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-leaf-500">
          Kontakt
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-forest-950 sm:text-5xl">
          Lassen Sie uns über Ihr Projekt sprechen
        </h2>
        <p className="mx-auto mt-4 max-w-md text-forest-800/70">
          Rufen Sie an oder schreiben Sie mir – ich melde mich in der Regel
          innerhalb eines Werktags mit einem unverbindlichen Angebot.
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="space-y-4">
            {CONTACT_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.label !== "Telefon" && item.label !== "Festnetz" ? "_blank" : undefined}
                rel={item.label !== "Telefon" && item.label !== "Festnetz" ? "noreferrer" : undefined}
                className="flex min-h-[44px] items-center gap-4 rounded-xl border border-forest-900/5 bg-white/60 p-4 transition-colors hover:bg-white"
              >
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-leaf-200 text-forest-700">
                  {item.label === "Adresse" ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 22S4 14.5 4 9a8 8 0 1 1 16 0c0 5.5-8 13-8 13ZM12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : item.label === "WhatsApp" ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.79 14.12c-.24.68-1.4 1.33-1.93 1.4-.49.07-1.11.1-1.79-.11-.41-.13-.94-.3-1.62-.6-2.84-1.23-4.7-4.1-4.84-4.29-.14-.19-1.16-1.54-1.16-2.94s.73-2.09.99-2.37c.26-.29.56-.36.75-.36l.53.01c.17 0 .4-.06.62.48.24.58.81 2 .88 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.3.37-.42.5-.14.15-.29.31-.13.6.17.29.75 1.24 1.62 2.01 1.11.99 2.05 1.3 2.34 1.44.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.63-.14.26.1 1.65.78 1.93.92.29.14.48.21.55.33.07.12.07.68-.17 1.36Z" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span>
                  <span className="block text-xs font-medium uppercase tracking-wide text-forest-800/50">
                    {item.label}
                  </span>
                  <span className="block font-medium text-forest-950">
                    {item.value}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
