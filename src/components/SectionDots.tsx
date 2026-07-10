"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const SECTIONS = [
  { id: "top", label: "Start" },
  { id: "leistungen", label: "Leistungen" },
  { id: "vorher-nachher", label: "Vorher / Nachher" },
  { id: "ueber-uns", label: "Über uns" },
  { id: "kontakt", label: "Kontakt" },
];

export default function SectionDots() {
  const [active, setActive] = useState("top");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    els.forEach((el) => observer.observe(el));

    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          aria-label={s.label}
          className="group flex items-center gap-2.5"
        >
          <span className="whitespace-nowrap rounded-full bg-forest-950/80 px-2.5 py-1 text-[11px] font-medium text-sand-50 opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
            {s.label}
          </span>
          <span
            className={`block rounded-full transition-all duration-300 ${
              active === s.id
                ? "h-2.5 w-2.5 bg-terracotta-500"
                : "h-1.5 w-1.5 bg-forest-900/25 group-hover:bg-forest-900/50"
            }`}
          />
        </a>
      ))}
    </motion.div>
  );
}
