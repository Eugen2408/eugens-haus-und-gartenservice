import Reveal from "./Reveal";

const CONTACT_ITEMS = [
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
    <section id="kontakt" className="mx-auto max-w-6xl px-5 py-24 md:py-32">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-leaf-500">
            Kontakt
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-forest-950 sm:text-4xl">
            Lassen Sie uns über Ihr Projekt sprechen
          </h2>
          <p className="mt-4 max-w-md text-forest-800/70">
            Rufen Sie an oder schreiben Sie mir – ich melde mich in der Regel
            innerhalb eines Werktags mit einem unverbindlichen Angebot.
          </p>

          <div className="mt-8 space-y-4">
            {CONTACT_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.label === "Adresse" ? "_blank" : undefined}
                rel={item.label === "Adresse" ? "noreferrer" : undefined}
                className="flex items-center gap-4 rounded-xl border border-forest-900/5 bg-white/60 p-4 transition-colors hover:bg-white"
              >
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-leaf-200 text-forest-700">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    {item.label === "Adresse" ? (
                      <path
                        d="M12 22S4 14.5 4 9a8 8 0 1 1 16 0c0 5.5-8 13-8 13ZM12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                    ) : (
                      <path
                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                    )}
                  </svg>
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
          <form className="rounded-2xl border border-forest-900/5 bg-white/70 p-6 shadow-sm sm:p-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label className="mb-1.5 block text-sm font-medium text-forest-900">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full rounded-lg border border-forest-900/10 bg-sand-50 px-4 py-2.5 text-sm text-forest-950 outline-none transition-colors focus:border-leaf-500"
                  placeholder="Ihr Name"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="mb-1.5 block text-sm font-medium text-forest-900">
                  Telefon
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full rounded-lg border border-forest-900/10 bg-sand-50 px-4 py-2.5 text-sm text-forest-950 outline-none transition-colors focus:border-leaf-500"
                  placeholder="Ihre Telefonnummer"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-forest-900">
                  E-Mail
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full rounded-lg border border-forest-900/10 bg-sand-50 px-4 py-2.5 text-sm text-forest-950 outline-none transition-colors focus:border-leaf-500"
                  placeholder="ihre@email.de"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-forest-900">
                  Nachricht
                </label>
                <textarea
                  name="message"
                  rows={4}
                  className="w-full resize-none rounded-lg border border-forest-900/10 bg-sand-50 px-4 py-2.5 text-sm text-forest-950 outline-none transition-colors focus:border-leaf-500"
                  placeholder="Beschreiben Sie kurz Ihr Anliegen…"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-terracotta-500 px-6 py-3.5 text-sm font-semibold text-sand-50 transition-colors hover:bg-terracotta-600"
            >
              Nachricht senden
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
