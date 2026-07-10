"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#leistungen", label: "Leistungen" },
  { href: "#vorher-nachher", label: "Vorher/Nachher" },
  { href: "#ueber-uns", label: "Über uns" },
  { href: "#kontakt", label: "Kontakt" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-sand-50/90 shadow-sm backdrop-blur" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a
          href="#top"
          className={`font-display text-lg font-semibold tracking-tight transition-colors ${
            scrolled ? "text-forest-900" : "text-sand-50"
          }`}
        >
          Eugens <span className="text-leaf-500">Haus- &amp; Gartenservice</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-leaf-500 ${
                scrolled ? "text-forest-800" : "text-sand-50"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#kontakt"
            className="rounded-full bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-sand-50 shadow-sm transition-colors hover:bg-terracotta-600"
          >
            Kostenlos anfragen
          </a>
        </div>

        <button
          type="button"
          aria-label="Menü öffnen"
          onClick={() => setOpen((o) => !o)}
          className={`flex h-9 w-9 items-center justify-center rounded-full md:hidden ${
            scrolled ? "text-forest-900" : "text-sand-50"
          }`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            {open ? (
              <path
                d="M6 6L18 18M6 18L18 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7H20M4 12H20M4 17H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="mx-5 mb-4 flex flex-col gap-1 rounded-2xl bg-sand-50 p-4 shadow-lg md:hidden">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-forest-800 hover:bg-sand-100"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#kontakt"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-full bg-terracotta-500 px-5 py-2.5 text-center text-sm font-semibold text-sand-50"
          >
            Kostenlos anfragen
          </a>
        </div>
      )}
    </header>
  );
}
