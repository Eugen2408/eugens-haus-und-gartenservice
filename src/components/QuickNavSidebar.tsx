"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ITEMS = [
  { href: "#leistungen", label: "Leistungen" },
  { href: "#vorher-nachher", label: "Vorher / Nachher" },
  { href: "#ueber-uns", label: "Über mich" },
  { href: "#bewertungen", label: "Bewertungen" },
  { href: "#kontakt", label: "Kontakt" },
];

export default function QuickNavSidebar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById("leistungen");

    const onScroll = () => {
      const threshold = target
        ? target.offsetTop + target.offsetHeight
        : window.innerHeight * 1.4;
      // Über den gepinnten Szenen (Hecke, Farbe, Fliesen, Boden, Schuppen,
      // Platten, Bad) ausblenden, damit die Sidebar nicht mit der Bühne kollidiert
      const overScene = ["einsatz", "farbe", "fliesen", "boden", "schuppen", "platten", "bad"].some((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      });
      setVisible(window.scrollY > threshold && !overScene);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -16 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      <div className="rounded-2xl border border-forest-900/10 bg-white/70 p-4 shadow-lg shadow-forest-900/5 backdrop-blur-md">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-forest-800/50">
          Wonach suchen Sie?
        </p>
        <ul className="space-y-2">
          {ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="group flex items-center gap-2 text-sm font-medium text-forest-800 transition-colors hover:text-leaf-600"
              >
                <span className="text-leaf-500 transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
