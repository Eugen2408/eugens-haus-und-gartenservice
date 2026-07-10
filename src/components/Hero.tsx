"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VideoTilesHero from "./VideoTilesHero";

gsap.registerPlugin(ScrollTrigger);

const TILE_COUNT = 5;
const VH_PER_TILE = 60;

export default function Hero() {
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const wrapper = scrollWrapperRef.current;
    const pin = pinRef.current;
    if (!wrapper || !pin) return;

    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      pin,
      scrub: true,
      onUpdate: (self) => {
        setActiveIndex(Math.min(TILE_COUNT - 1, Math.floor(self.progress * TILE_COUNT)));
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section id="top" className="relative w-full bg-forest-950 pt-28 pb-14 md:pt-36 md:pb-20">
      <div className="mx-auto w-full max-w-6xl px-5">
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
          Ihr Garten. Gepflegt, wie Sie ihn wünschen.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 max-w-lg text-lg text-sand-100/90"
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

      <div ref={scrollWrapperRef} className="relative mt-14" style={{ height: `${TILE_COUNT * VH_PER_TILE}vh` }}>
        <div ref={pinRef} className="flex h-screen w-full items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mx-auto w-full max-w-6xl px-5"
          >
            <VideoTilesHero activeIndex={activeIndex} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
