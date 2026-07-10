"use client";

import { motion } from "framer-motion";
import Hero3D from "./Hero3D";

export default function Hero() {
  return (
    <section id="top" className="relative flex h-[100svh] min-h-[640px] w-full items-center overflow-hidden">
      <Hero3D />

      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-forest-950/20 to-forest-950/40" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-leaf-300"
        >
          Haus- &amp; Gartenservice in Hamburg
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-2xl font-display text-4xl font-semibold leading-[1.1] text-sand-50 sm:text-5xl md:text-6xl"
        >
          Ihr Garten. Gepflegt, wie Sie ihn sich wünschen.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-5 max-w-lg text-lg text-sand-100/90"
        >
          Von der Rasenpflege bis zur kompletten Gartengestaltung – zuverlässig,
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-9 w-6 justify-center rounded-full border-2 border-sand-50/50 p-1">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-sand-50"
          />
        </div>
      </motion.div>
    </section>
  );
}
