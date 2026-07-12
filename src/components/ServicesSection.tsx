import Image from "next/image";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";

const SERVICES = [
  {
    title: "Gartenpflege",
    desc: "Rasenpflege, Beetpflege und regelmäßige Gartenarbeiten – Ihr Garten in guten Händen.",
    image: "/images/rasen.jpg",
  },
  {
    title: "Hecken- & Rückschnitt",
    desc: "Fachgerechter Form- und Rückschnitt von Hecken, Sträuchern und Bäumen.",
    image: "/images/heckenschnitt.jpg",
  },
  {
    title: "Maler- & Wandarbeiten",
    desc: "Malerarbeiten und Wandverschönerung für Innen- und Außenbereiche.",
    image: "/images/fliesen.jpg",
  },
  {
    title: "Intensiv-Flächenreinigung",
    desc: "Hochdruckreinigung von Wegen, Terrassen und Einfahrten – wie neu.",
    image: "/images/flaechenreinigung.jpg",
  },
  {
    title: "Bodenbeläge & Fliesen",
    desc: "Verlegung von Bodenbelägen und Fliesen, sauber und passgenau.",
    image: "/images/bodenbelag.jpg",
  },
  {
    title: "Reparatur- & Handwerkerservice",
    desc: "Montage, Aufbau-Service, Technik-Tausch, Ausbesserungen und Objektbetreuung.",
    image: "/images/nachher-schuppen.jpg",
  },
];

export default function ServicesSection() {
  return (
    <section id="leistungen" className="overflow-hidden bg-sand-50 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-leaf-500">
            Meine Leistungen
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-[1.05] text-forest-950 sm:text-5xl md:text-6xl">
            Wonach suchen Sie?
          </h2>
          <p className="mt-4 max-w-xl text-forest-800/70">
            Gartenpflege, Rückschnitt, Malerarbeiten, Flächenreinigung,
            Montage, Bodenbeläge, Reparaturen, Aufbau-Service,
            Technik-Tausch, Objektbetreuung – und vieles mehr!
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-14">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, i) => (
              <TiltCard key={service.title} className="group">
                <a
                  href="#kontakt"
                  className="relative block overflow-hidden rounded-2xl border border-white/60 bg-white/70 shadow-lg shadow-forest-900/10 backdrop-blur-sm transition-shadow duration-300 hover:shadow-2xl"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 360px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/10 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent" />

                    <span className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 font-display text-sm font-semibold text-forest-900 shadow-sm backdrop-blur-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="absolute inset-x-5 bottom-5">
                      <h3 className="font-display text-2xl font-semibold text-sand-50">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-sand-100/80">
                        {service.desc}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-terracotta-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        Anfragen
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </a>
              </TiltCard>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
