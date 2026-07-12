"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Scroll-gescrubbte Bildsequenz (Badsanierung: Rohbau → Verwandlung →
// fertig geflieste Dusche). Bewusst ohne Partikel-Effekte — die Sequenz
// bringt ihre eigene Feuer-Verwandlung mit.
// Desktop: 41 Frames à 1280px, Mobile: 21 Frames à 768px.
export const DESKTOP = { count: 41, src: (i: number) => `/frames/fliesen/fliesen-${String(i).padStart(2, "0")}.webp` };
export const MOBILE = { count: 21, src: (i: number) => `/frames/fliesen/m/fliesen-${String(i).padStart(2, "0")}.webp` };

type Chapter = {
  kicker: string;
  title: string;
  text: string;
};

const CHAPTERS: Chapter[] = [
  {
    kicker: "So arbeite ich",
    title: "Vom Rohbau zur Form.",
    text: "Alte Wand, neue Leitungen – hier beginnen Ihre neuen Fliesen.",
  },
  {
    kicker: "Die Verwandlung",
    title: "Präzision in jedem Detail.",
    text: "Abdichtung, Ausrichtung, Fugenbild – alles greift ineinander.",
  },
  {
    kicker: "Das Ergebnis",
    title: "Fliese für Fliese perfekt.",
    text: "Eine saubere Kante, ein ruhiges Fugenbild – fertig zum Einziehen.",
  },
];

export default function TilesScrollScene() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !stage || !canvas) return;

    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const SET = isMobile ? MOBILE : DESKTOP;

    const images: (HTMLImageElement | null)[] = new Array(SET.count).fill(null);
    const loaded: boolean[] = new Array(SET.count).fill(false);
    let currentFrame = 0;
    let started = false;

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = stage!.clientWidth;
      const h = stage!.clientHeight;
      if (canvas!.width !== Math.round(w * dpr) || canvas!.height !== Math.round(h * dpr)) {
        canvas!.width = Math.round(w * dpr);
        canvas!.height = Math.round(h * dpr);
      }
    }

    // Nächstliegenden bereits geladenen Frame zeichnen, damit beim
    // progressiven Laden nie ein schwarzes Bild aufblitzt.
    function drawFrame(index: number) {
      let img: HTMLImageElement | null = null;
      for (let d = 0; d < SET.count; d++) {
        const before = index - d;
        const after = index + d;
        if (before >= 0 && loaded[before]) { img = images[before]; break; }
        if (after < SET.count && loaded[after]) { img = images[after]; break; }
      }
      if (!img) return;
      resizeCanvas();
      const cw = canvas!.width;
      const ch = canvas!.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx2d!.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    }

    function loadFrames() {
      if (started) return;
      started = true;
      for (let i = 0; i < SET.count; i++) {
        const img = new Image();
        img.src = SET.src(i);
        img.onload = () => {
          images[i] = img;
          loaded[i] = true;
          if (i === currentFrame || (i === 0 && !loaded[currentFrame])) drawFrame(currentFrame);
        };
      }
    }

    // Frames erst laden, wenn die Sektion in die Nähe des Viewports kommt
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          loadFrames();
          io.disconnect();
        }
      },
      { rootMargin: "150% 0%" }
    );
    io.observe(wrapper);

    const ro = new ResizeObserver(() => drawFrame(currentFrame));
    ro.observe(stage);

    if (reducedMotion) {
      // Ohne Animation: letztes Frame (Ergebnis) statisch zeigen
      currentFrame = SET.count - 1;
      loadFrames();
      return () => {
        io.disconnect();
        ro.disconnect();
      };
    }

    const gsapCtx = gsap.context(() => {
      const state = { frame: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(state, {
        frame: SET.count - 1,
        duration: 1,
        onUpdate: () => {
          const next = Math.round(state.frame);
          if (next !== currentFrame) {
            currentFrame = next;
            drawFrame(next);
          }
        },
      }, 0);

      // Leichter Kamera-Push + 3D-Kippeffekt beim Einstieg
      tl.fromTo(stage, { scale: 1.06 }, { scale: 1, duration: 1 }, 0);
      tl.fromTo(
        stage,
        { rotateX: 5, transformPerspective: 1200 },
        { rotateX: 0, duration: 0.38, ease: "power1.out" },
        0
      );

      if (barRef.current) {
        tl.fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
      }

      // Licht-Sweep zieht einmal diagonal über die Bühne – passend zum
      // Moment, in dem die Fliesen sichtbar werden
      if (sweepRef.current) {
        tl.fromTo(sweepRef.current, { xPercent: -60 }, { xPercent: 520, duration: 0.34 }, 0.5);
      }

      // Drei Text-Kapitel, an den Scrub gekoppelt; Titel-Wörter
      // schieben sich einzeln aus einer Maske hoch
      const spans: [number, number][] = [
        [0.02, 0.3],
        [0.34, 0.66],
        [0.7, 1.0],
      ];
      captionRefs.current.forEach((el, i) => {
        if (!el) return;
        const [inAt, outAt] = spans[i];
        tl.fromTo(el, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.05 }, inAt);
        const words = el.querySelectorAll<HTMLElement>(".tile-word");
        if (words.length) {
          tl.fromTo(
            words,
            { yPercent: 115 },
            { yPercent: 0, duration: 0.05, stagger: 0.01, ease: "power2.out" },
            inAt
          );
        }
        if (i < 2) {
          tl.to(el, { autoAlpha: 0, y: -28, duration: 0.05 }, outAt);
        }
      });
    }, wrapper);

    return () => {
      io.disconnect();
      ro.disconnect();
      gsapCtx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      id="fliesen"
      ref={wrapperRef}
      className={`relative bg-forest-950 ${reducedMotion ? "" : "h-[240svh]"}`}
    >
      <div
        className={`${reducedMotion ? "relative py-24" : "sticky top-0 h-[100svh]"} flex items-center justify-center overflow-hidden px-5`}
      >
        <div
          ref={stageRef}
          className="relative h-[68svh] w-full max-w-6xl overflow-hidden rounded-3xl bg-forest-900 shadow-2xl shadow-black/40 md:h-auto md:aspect-video"
        >
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Fliesenarbeiten im Zeitraffer – von der rohen Wand mit neuen Leitungen bis zur fertig gefliesten Dusche"
            className="absolute inset-0 h-full w-full"
          />

          {/* Scrim für Textkontrast + Vignette */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-forest-950/25" />

          {/* Licht-Sweep */}
          {!reducedMotion && (
            <div
              ref={sweepRef}
              className="pointer-events-none absolute inset-y-[-25%] left-[-45%] w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              style={{ opacity: 0.9 }}
            />
          )}

          {/* Glas-Badge oben links */}
          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-sand-50/25 bg-forest-950/35 px-4 py-2 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-terracotta-500" />
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-sand-50">
              Fliesenarbeiten
            </span>
          </div>

          {/* Text-Kapitel */}
          {CHAPTERS.map((chapter, i) => {
            const isLast = i === CHAPTERS.length - 1;
            const visibleStatic = reducedMotion ? (isLast ? "opacity-100" : "hidden") : "opacity-0";
            return (
              <div
                key={chapter.title}
                ref={(el) => {
                  captionRefs.current[i] = el;
                }}
                className={`absolute inset-x-5 bottom-8 max-w-xl sm:inset-x-10 sm:bottom-12 ${visibleStatic}`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-leaf-300 sm:text-sm">
                  {chapter.kicker}
                </p>
                <h3 className="mt-2 font-display text-3xl font-semibold leading-[1.05] text-sand-50 drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] sm:text-5xl">
                  {chapter.title.split(" ").map((word, wi) => (
                    <span key={wi} className="mr-[0.26em] inline-block overflow-hidden pb-1 align-top">
                      <span className="tile-word inline-block">{word}</span>
                    </span>
                  ))}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-sand-100/85 sm:text-base">
                  {chapter.text}
                </p>
                {isLast && (
                  <a
                    href="#kontakt"
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-terracotta-500 px-6 py-3 text-sm font-semibold text-sand-50 shadow-lg shadow-terracotta-500/25 transition-colors duration-200 hover:bg-terracotta-600"
                  >
                    Fliesenarbeiten anfragen
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                )}
              </div>
            );
          })}

          {/* Scroll-Fortschritt */}
          {!reducedMotion && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-sand-50/10">
              <div ref={barRef} className="h-full origin-left bg-terracotta-500" style={{ transform: "scaleX(0)" }} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
