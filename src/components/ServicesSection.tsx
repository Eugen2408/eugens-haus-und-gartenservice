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
    <section id="leistungen" className="mx-auto max-w-6xl px-5 py-24 md:py-32">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-leaf-500">
          Meine Leistungen
        </p>
        <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold text-forest-950 sm:text-4xl">
          Alles aus einer Hand für Haus und Garten
        </h2>
        <p className="mt-4 max-w-xl text-forest-800/70">
          Gartenpflege, Rückschnitt, Malerarbeiten, Flächenreinigung, Montage,
          Bodenbeläge, Reparaturen, Aufbau-Service, Technik-Tausch,
          Objektbetreuung – und vieles mehr!
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {SERVICES.map((service, i) => (
          <Reveal key={service.title} delay={i * 0.07}>
            <TiltCard className="group h-full overflow-hidden rounded-2xl border border-forest-900/5 bg-white/70 shadow-sm transition-shadow hover:shadow-2xl">
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-forest-950/0 to-transparent" />
                <h3 className="absolute bottom-4 left-5 font-display text-2xl font-semibold text-sand-50">
                  {service.title}
                </h3>
              </div>
              <div className="p-6">
                <p className="text-sm leading-relaxed text-forest-800/70">
                  {service.desc}
                </p>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
