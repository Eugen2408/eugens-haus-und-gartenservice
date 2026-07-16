"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Scroll-gescrubbte Bildsequenz (Malerarbeiten: Farbeimer → Farb-Durchbruch
// durch die Wand → frisch gestrichenes Treppenhaus).
// Desktop: 160 Frames à 1280px, Mobile: 80 Frames à 768px.
export const DESKTOP = { count: 160, src: (i: number) => `/frames/farbe/farbe-${String(i).padStart(3, "0")}.webp` };
export const MOBILE = { count: 80, src: (i: number) => `/frames/farbe/m/farbe-${String(i).padStart(3, "0")}.webp` };

type Chapter = {
  title: string;
  text: string;
};

// EIN zusammengefasster Ergebnis-Text (statt 3 Kapiteln waehrend des Scrollens)
// - der Effekt laeuft ungestoert durch, der Text erscheint erst, wenn das
// Ergebnis steht (siehe FRAME_END/CAPTION_AT weiter unten).
const RESULT: Chapter = {
  title: "Wände wie neu.",
  text: "Erst abkleben und grundieren, dann streichen. Am Ende sehen die Wände aus wie neu – ohne Flecken, ohne Ränder.",
};

export default function PaintScrollScene() {
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
      // Mobile: volle Breite, ganzes Bild (kein Beschnitt), oben ausgerichtet.
      // Desktop: formatfuellend (cover).
      const scale = isMobile
        ? cw / imgA.naturalWidth
        : Math.max(cw / imgA.naturalWidth, ch / imgA.naturalHeight);
      const dw = imgA.naturalWidth * scale;
      const dh = imgA.naturalHeight * scale;
      const dx = (cw - dw) / 2;
      const dy = isMobile ? 0 : (ch - dh) / 2;
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

    // Feste Wiedergabegeschwindigkeit: der Scroll setzt nur das Ziel (targetFrame),
    // eine eigene rAF-Schleife bewegt den sichtbaren Frame mit KONSTANTEM Tempo
    // dorthin (kein Exponential-Nachziehen) – die Animation läuft immer gleich
    // schnell durch, egal wie schnell gescrollt wird. Bleibt der Scroll stehen,
    // bleibt auch das Bild stehen; rückwärts scrollen läuft symmetrisch zurück.
    const MIN_PLAY_SECONDS = 1.3; // Mindestdauer fuer einen kompletten Durchlauf
    const maxFramesPerSecond = SET.count / MIN_PLAY_SECONDS;
    let targetFrame = 0;
    let rafId = 0;
    let lastT = 0;
    function tick(t: number) {
      rafId = requestAnimationFrame(tick);
      const dt = lastT ? Math.min((t - lastT) / 1000, 0.1) : 0.016;
      lastT = t;
      const diff = targetFrame - currentFrame;
      if (Math.abs(diff) < 0.002) return;
      const maxStep = maxFramesPerSecond * dt;
      currentFrame += Math.abs(diff) <= maxStep ? diff : Math.sign(diff) * maxStep;
      drawFrame(currentFrame);
    }
    rafId = requestAnimationFrame(tick);

    const gsapCtx = gsap.context(() => {
      const state = { frame: 0 };
      // Frame-Fortschritt laeuft nur bis FRAME_END der Scroll-Strecke, der Rest
      // bleibt Lese-Pause auf dem stehenden Ergebnis-Frame (Pin haelt weiter).
      const FRAME_END = 0.78;
      const CAPTION_AT = 0.82;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: wrapper,
          start: isMobile ? "top bottom" : "top top",
          end: isMobile ? "bottom top" : "bottom bottom",
          scrub: true, // sofort, keine GSAP-Traegheit - die Tick-Schleife regelt das Tempo
          invalidateOnRefresh: true,
        },
      });

      tl.to(state, {
        frame: SET.count - 1,
        duration: FRAME_END,
        onUpdate: () => {
          targetFrame = state.frame;
        },
      }, 0);

      // Leichter Kamera-Push + 3D-Kippeffekt beim Einstieg
      tl.fromTo(stage, { scale: 1.06 }, { scale: 1, duration: FRAME_END }, 0);
      tl.fromTo(
        stage,
        { rotateX: 5, transformPerspective: 1200 },
        { rotateX: 0, duration: 0.38, ease: "power1.out" },
        0
      );

      if (barRef.current) {
        tl.fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
      }

      // Licht-Sweep zieht einmal diagonal ueber die Buehne, kurz bevor das
      // Ergebnis steht - Uebergang zum Text.
      if (sweepRef.current) {
        tl.fromTo(sweepRef.current, { xPercent: -60 }, { xPercent: 520, duration: 0.3 }, FRAME_END - 0.14);
      }

      // EIN Ergebnis-Text erscheint erst, wenn der Effekt fertig durchgelaufen ist
      // (siehe FRAME_END) - Titel-Woerter schieben sich einmal aus einer Maske
      // hoch und bleiben stehen (kein Ausblenden mehr, das ist der Schlusspunkt).
      const captionEl = captionRefs.current[0];
      if (captionEl && !isMobile) {
        tl.fromTo(captionEl, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.07 }, CAPTION_AT);
        const words = captionEl.querySelectorAll<HTMLElement>(".paint-word");
        if (words.length) {
          tl.fromTo(
            words,
            { yPercent: 115 },
            { yPercent: 0, duration: 0.07, stagger: 0.012, ease: "power2.out" },
            CAPTION_AT
          );
        }
      }
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
      id="farbe"
      ref={wrapperRef}
      className={`relative bg-white ${reducedMotion ? "" : "md:h-[240svh]"}`}
    >
      <div
        className={`${reducedMotion ? "relative py-16" : "relative md:sticky md:top-0 md:h-[100svh]"} flex flex-col items-center justify-center overflow-hidden px-0 md:px-5`}
      >
        <div className="relative w-full max-w-6xl md:max-w-[86vw]">
        <div
          ref={stageRef}
          className="relative w-full aspect-video overflow-hidden md:rounded-3xl bg-forest-900 shadow-2xl shadow-black/40"
        >
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Malerarbeiten im Zeitraffer – vom Farbeimer über den Farb-Durchbruch bis zum frisch gestrichenen Treppenhaus"
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
              Malerarbeiten
            </span>
          </div>


          {/* Scroll-Fortschritt */}
          {!reducedMotion && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-sand-50/10">
              <div ref={barRef} className="h-full origin-left bg-leaf-500" style={{ transform: "scaleX(0)" }} />
            </div>
          )}
        </div>
          {/* Ergebnis-Text: erscheint erst, wenn der Effekt durchgelaufen ist und
              das Ergebnisbild steht (FRAME_END/CAPTION_AT oben) */}
          <div
            ref={(el) => {
              captionRefs.current[0] = el;
            }}
            className={`mt-5 px-6 md:mt-0 md:absolute md:inset-x-10 md:bottom-12 md:max-w-xl md:px-0 ${reducedMotion ? "opacity-100" : "opacity-100 md:opacity-0"}`}
          >
            <h3 className="font-display text-2xl font-semibold leading-[1.1] text-forest-950 sm:text-3xl md:text-5xl md:text-sand-50 md:drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]">
              {RESULT.title.split(" ").map((word, wi) => (
                <span key={wi} className="mr-[0.26em] inline-block overflow-hidden pb-1 align-top">
                  <span className="paint-word inline-block">{word}</span>
                </span>
              ))}
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-forest-700 sm:text-base md:mt-3 md:text-sand-100/85">
              {RESULT.text}
            </p>
            <a
              href="#kontakt"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-leaf-500 px-6 py-3 text-sm font-semibold text-sand-50 shadow-lg shadow-leaf-500/25 transition-colors duration-200 hover:bg-forest-600"
            >
              Malerarbeiten anfragen
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
