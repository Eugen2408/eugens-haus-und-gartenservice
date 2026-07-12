"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Ken-Burns-Slideshow: alle Arbeitsfotos aus Bilder/bei der arbeit,
// vereinheitlicht auf 1920×1080 (siehe public/images/hero/)
const SLIDES = [
  "/images/hero/hero-1.jpg",
  "/images/hero/hero-2.jpg",
  "/images/hero/hero-3.jpg",
  "/images/hero/hero-4.jpg",
  "/images/hero/hero-5.jpg",
  "/images/hero/hero-6.jpg",
  "/images/hero/hero-7.jpg",
];
const SLIDE_MS = 5500;

export default function Hero() {
  const [index, setIndex] = useState(0);
  // Slides erst mounten, wenn sie (bald) gebraucht werden – so lädt der
  // Hero zunächst nur das erste Bild plus den Nachfolger
  const [mounted, setMounted] = useState(2);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, [reducedMotion]);

  useEffect(() => {
    setMounted((m) => Math.max(m, Math.min(SLIDES.length, index + 2)));
  }, [index]);

  return (
    <section
      id="top"
      className="relative flex min-h-[92svh] w-full items-center overflow-hidden bg-forest-950"
    >
      {/* Hintergrund-Slideshow */}
      <div className="absolute inset-0" aria-hidden="true">
        {SLIDES.slice(0, mounted).map((src, i) => {
          const isActive = i === index;
          return (
            <div
              key={src}
              className="absolute inset-0"
              style={{
                opacity: isActive ? 1 : 0,
                transform: reducedMotion ? "none" : isActive ? "scale(1.1)" : "scale(1)",
                transformOrigin: i % 2 === 0 ? "70% 30%" : "30% 70%",
                transition: "opacity 1.5s ease-in-out, transform 7s linear",
              }}
            >
              <Image
                src={src}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          );
        })}
        {/* Scrim für Textkontrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/90 via-forest-950/65 to-forest-950/35" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-forest-950/80 to-transparent" />
      </div>

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
            className="rounded-full bg-terracotta-500 px-7 py-3.5 text-sm font-semibold text-sand-50 shadow-lg shadow-terracotta-500/20 transition-transform hover:scale-[1.03] hover:bg-terracotta-600"
          >
            Kostenloses Angebot einholen
          </a>
          <a
            href="#leistungen"
            className="rounded-full border border-sand-50/40 bg-sand-50/10 px-7 py-3.5 text-sm font-semibold text-sand-50 backdrop-blur transition-colors hover:bg-sand-50/20"
          >
            Leistungen ansehen
          </a>
        </motion.div>
      </div>
    </section>
  );
}
