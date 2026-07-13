"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import WaveDivider from "./WaveDivider";

// Statisches Headerbild: Eugen beim Flexen (rote Jacke), 4×-KI-hochskaliert.
// Das Foto wird komplett gezeigt (object-contain), die Ränder füllt dasselbe
// Motiv stark weichgezeichnet.
const HERO_IMAGE = "/images/hero/hero-1.jpg";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[92svh] w-full items-center overflow-hidden bg-forest-950"
    >
      {/* Hintergrundbild */}
      <div className="absolute inset-0" aria-hidden="true">
        {/* Weichgezeichnete Füllfläche hinter dem eigentlichen Foto */}
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="60vw"
          className="scale-110 object-cover blur-2xl brightness-[0.55]"
        />
        {/* Das Foto selbst – vollständig sichtbar, rechtsbündig, mit sanftem Dauer-Zoom */}
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-contain object-right motion-safe:animate-[hero-zoom_22s_ease-out_forwards]"
        />
        {/* Scrim für Textkontrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/90 via-forest-950/65 to-forest-950/35" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-forest-950/80 to-transparent" />
      </div>

      {/* Weicher, organischer Übergang in die weißen Inhalts-Sektionen */}
      <WaveDivider fill="text-white" className="absolute inset-x-0 bottom-0 z-10" />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-32 md:pt-36">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-leaf-300"
        >
          Haus- &amp; Gartenservice in Hamburg
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight text-sand-50 sm:text-6xl md:text-7xl"
        >
          Haus und Garten. In guten Händen.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 max-w-lg text-lg text-sand-100/90"
        >
          Von der Gartenpflege über Malerarbeiten bis zur Badsanierung – ein
          Ansprechpartner für alles rund um Haus und Garten. Zuverlässig,
          termintreu und mit Blick fürs Detail.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <a
            href="#kontakt"
            className="rounded-full bg-leaf-500 px-7 py-3.5 text-sm font-semibold text-sand-50 shadow-lg shadow-leaf-500/20 transition-transform hover:scale-[1.03] hover:bg-forest-600"
          >
            Kostenloses Angebot einholen
          </a>
          <a
            href="#beste-wahl"
            className="rounded-full border border-sand-50/40 bg-sand-50/10 px-7 py-3.5 text-sm font-semibold text-sand-50 backdrop-blur transition-colors hover:bg-sand-50/20"
          >
            Leistungen ansehen
          </a>
        </motion.div>
      </div>
    </section>
  );
}
