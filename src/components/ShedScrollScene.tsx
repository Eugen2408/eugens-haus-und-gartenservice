"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Scroll-gescrubbte Bildsequenz (Gartenpflege: zugewachsener Schuppen →
// Feuer-Verwandlung sprengt das Dickicht weg → freigelegter Schuppen im
// aufgeräumten Garten). Desktop: 98 Frames à 1280px, Mobile: 49 Frames à 768px.
export const DESKTOP = { count: 98, src: (i: number) => `/frames/schuppen/schuppen-${String(i).padStart(3, "0")}.webp` };
export const MOBILE = { count: 49, src: (i: number) => `/frames/schuppen/m/schuppen-${String(i).padStart(3, "0")}.webp` };

type Chapter = {
  kicker: string;
  title: string;
  text: string;
};

const CHAPTERS: Chapter[] = [
  {
    kicker: "So arbeite ich",
    title: "Vom Grün verschluckt.",
    text: "Jahrelang zugewuchert – unter dem Dickicht steckt mehr, als man denkt.",
  },
  {
    kicker: "Die Verwandlung",
    title: "Platz geschaffen.",
    text: "Roden, schneiden, abtransportieren – Stück für Stück zurück ans Licht.",
  },
  {
    kicker: "Das Ergebnis",
    title: "Ihr Garten, wieder sichtbar.",
    text: "Freigelegt und aufgeräumt – bereit für alles, was Sie vorhaben.",
  },
];

export default function ShedScrollScene() {
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
    function nearestLoaded(index: number): HTMLImageElement | null {
      for (let d = 0; d < SET.count; d++) {
        const before = index - d;
        const after = index + d;
        if (before >= 0 && loaded[before]) return images[before];
        if (after < SET.count && loaded[after]) return images[after];
      }
      return null;
    }

    // Frame-Überblendung: zeichnet einen Zwischenwert, indem die beiden
    // Nachbar-Frames alpha-gemischt werden (12,7 → 30 % #12 + 70 % #13).
    function drawFrame(frame: number) {
      const base = Math.max(0, Math.min(SET.count - 1, Math.floor(frame)));
      const upper = Math.min(SET.count - 1, base + 1);
      const mix = Math.min(1, Math.max(0, frame - base));
      const imgA = nearestLoaded(base);
      if (!imgA) return;
      resizeCanvas();
      const cw = canvas!.width;
      const ch = canvas!.height;
      // Mobile (Hochformat): formatfuellend (cover) - Szene fuellt den Schirm,
      // Desktop: Buehne ebenso formatfuellend (cover).
      const scale = isMobile
        ? Math.max(cw / imgA.naturalWidth, ch / imgA.naturalHeight)
        : Math.max(cw / imgA.naturalWidth, ch / imgA.naturalHeight);
      const dw = imgA.naturalWidth * scale;
      const dh = imgA.naturalHeight * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;
      ctx2d!.globalAlpha = 1;
      ctx2d!.drawImage(imgA, dx, dy, dw, dh);
      const imgB = upper !== base && mix > 0.01 ? nearestLoaded(upper) : null;
      if (imgB && imgB !== imgA) {
        ctx2d!.globalAlpha = mix;
        ctx2d!.drawImage(imgB, dx, dy, dw, dh);
        ctx2d!.globalAlpha = 1;
      }
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
          if (i === Math.round(currentFrame) || (i === 0 && !loaded[Math.round(currentFrame)])) drawFrame(currentFrame);
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

    // Geglätteter Frame-Verlauf: der Scroll setzt nur das Ziel (targetFrame),
    // eine eigene rAF-Schleife zieht den sichtbaren Frame exponentiell nach –
    // gleichmäßige Bewegung unabhängig von der Scroll-Geschwindigkeit.
    let targetFrame = 0;
    let rafId = 0;
    let lastT = 0;
    function tick(t: number) {
      rafId = requestAnimationFrame(tick);
      const dt = lastT ? Math.min((t - lastT) / 1000, 0.1) : 0.016;
      lastT = t;
      const diff = targetFrame - currentFrame;
      if (Math.abs(diff) < 0.002) return;
      currentFrame += Math.abs(diff) < 0.02 ? diff : diff * (1 - Math.exp(-dt * 9));
      drawFrame(currentFrame);
    }
    rafId = requestAnimationFrame(tick);

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
          targetFrame = state.frame;
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
      // Moment, in dem der Schuppen freigelegt wird
      if (sweepRef.current) {
        tl.fromTo(sweepRef.current, { xPercent: -60 }, { xPercent: 520, duration: 0.34 }, 0.5);
      }

      // Drei Text-Kapitel, an den Scrub gekoppelt; Titel-Wörter
      // schieben sich einzeln aus einer Maske hoch
      // Kapitel 3 erst ab 78 %: der harte Schnitt zur Garten-Umgebung
      // liegt bei ~81 %, vorher fliegen noch Trümmer durchs Bild
      const spans: [number, number][] = [
        [0.02, 0.3],
        [0.34, 0.74],
        [0.78, 1.0],
      ];
      captionRefs.current.forEach((el, i) => {
        if (!el) return;
        const [inAt, outAt] = spans[i];
        tl.fromTo(el, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.05 }, inAt);
        const words = el.querySelectorAll<HTMLElement>(".shed-word");
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
      cancelAnimationFrame(rafId);
      gsapCtx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      id="schuppen"
      ref={wrapperRef}
      className={`relative bg-white ${reducedMotion ? "" : "h-[240svh]"}`}
    >
      <div
        className={`${reducedMotion ? "relative py-24" : "sticky top-0 h-[100svh]"} flex items-center justify-center overflow-hidden px-0 md:px-5`}
      >
        <div
          ref={stageRef}
          className="relative h-[100svh] w-full max-w-6xl md:max-w-[86vw] overflow-hidden md:rounded-3xl bg-forest-900 shadow-2xl shadow-black/40 md:h-auto md:aspect-video"
        >
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Gartenrodung im Zeitraffer – vom komplett zugewachsenen Schuppen bis zum freigelegten Schuppen im aufgeräumten Garten"
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
            <span className="h-2 w-2 rounded-full bg-leaf-500" />
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-sand-50">
              Gartenpflege
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
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-100 sm:text-sm">
                  {chapter.kicker}
                </p>
                <h3 className="mt-2 font-display text-3xl font-semibold leading-[1.05] text-sand-50 drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] sm:text-5xl">
                  {chapter.title.split(" ").map((word, wi) => (
                    <span key={wi} className="mr-[0.26em] inline-block overflow-hidden pb-1 align-top">
                      <span className="shed-word inline-block">{word}</span>
                    </span>
                  ))}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-sand-100/85 sm:text-base">
                  {chapter.text}
                </p>
                {isLast && (
                  <a
                    href="#kontakt"
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-leaf-500 px-6 py-3 text-sm font-semibold text-sand-50 shadow-lg shadow-leaf-500/25 transition-colors duration-200 hover:bg-forest-600"
                  >
                    Gartenpflege anfragen
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
              <div ref={barRef} className="h-full origin-left bg-leaf-500" style={{ transform: "scaleX(0)" }} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
