"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

// Fängt Klicks auf Seiten-interne Anker (#kontakt, #beste-wahl …) ab und
// scrollt per GSAP dorthin. Das läuft synchron mit den ScrollTrigger-Scrubs
// der gepinnten Szenen – deutlich flüssiger als das CSS-eigene Smooth-Scroll,
// das durch die langen 240svh-Sektionen ruckelt.
export default function SmoothAnchors() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const raw = anchor.getAttribute("href");
      if (!raw || raw === "#") return;
      const id = decodeURIComponent(raw.slice(1));
      const target = id === "top" ? null : document.getElementById(id);
      if (id !== "top" && !target) return;

      e.preventDefault();
      const y = id === "top" ? 0 : (target as HTMLElement).getBoundingClientRect().top + window.scrollY;

      if (reduce) {
        window.scrollTo(0, y);
        history.replaceState(null, "", raw);
        return;
      }

      const dist = Math.abs(y - window.scrollY);
      const duration = Math.min(1.5, Math.max(0.6, dist / 11000));
      gsap.to(window, {
        duration,
        ease: "power2.inOut",
        scrollTo: { y, autoKill: true },
        onComplete: () => history.replaceState(null, "", raw),
      });
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
