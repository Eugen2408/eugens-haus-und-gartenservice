"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const LINKS = [
  { href: "#vorher-nachher", label: "Vorher/Nachher" },
  { href: "#ueber-uns", label: "Über mich" },
  { href: "#bewertungen", label: "Bewertungen" },
  { href: "#kontakt", label: "Kontakt" },
];

function NavLink({
  href,
  label,
  dark,
}: {
  href: string;
  label: string;
  dark: boolean;
}) {
  return (
    <a
      href={href}
      className={`group relative py-1 text-sm font-medium transition-colors ${
        dark ? "text-forest-800" : "text-sand-50"
      }`}
    >
      {label}
      <span
        className={`absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 ${
          dark ? "bg-forest-800" : "bg-sand-50"
        }`}
      />
    </a>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="absolute inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full bg-transparent px-5 py-3">
        <a href="#top" className="relative z-10 block">
          <Image
            src="/images/logo.webp"
            alt="Eugens Haus- und Gartenservice – in guten Händen"
            width={562}
            height={256}
            priority
            className={`h-20 w-auto transition sm:h-24 ${open ? "brightness-0" : ""}`}
          />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <NavLink key={link.href} {...link} dark={false} />
          ))}
          <a
            href="#kontakt"
            className="rounded-full bg-leaf-500 px-5 py-2.5 text-sm font-semibold text-sand-50 shadow-sm transition-transform duration-300 hover:scale-105 hover:bg-forest-600"
          >
            Kostenlos anfragen
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full md:hidden ${
            open ? "text-forest-900" : "text-sand-50"
          }`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            {open ? (
              <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-0 flex flex-col justify-center bg-sand-50 px-8 md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-4xl font-semibold text-forest-950"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#kontakt"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 * LINKS.length, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 inline-flex w-fit items-center rounded-full bg-leaf-500 px-7 py-3.5 text-sm font-semibold text-sand-50"
              >
                Kostenlos anfragen
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
