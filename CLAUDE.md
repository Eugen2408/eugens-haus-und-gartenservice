# Eugens Haus- und Gartenservice – Projektleitfaden

Marketing-Website für einen Haus- und Gartenservice in Hamburg. Single-Page mit
scroll-getriebenen 3D-/Frame-Szenen. Deploy: GitHub → Vercel (auto).

## Tech-Stack

- Next.js 16 (App Router, Turbopack), React, TypeScript
- Tailwind CSS v4 – Theme über `@theme` in `src/app/globals.css` (KEINE tailwind.config)
- GSAP ScrollTrigger (scrub/pin), Framer Motion, next/font (Outfit), next/image
- Kontaktformular: FormSubmit (kein Backend, keine API-Routes)

## Arbeitsweise (wichtig)

- **Antworten immer auf Deutsch.**
- **Nach JEDER Änderung ungefragt committen und pushen** (`master`). Commit-Messages
  auf Deutsch, ohne Emojis.
- Vor dem Commit: temporäre Dateien löschen (`smoke.tmp.mjs`), `git checkout -- tsconfig.json`
  (Build fügt dort Build-Dir-Pfade ein).

## Konventionen (Frontend)

- Komponenten in `src/components/`, eine Verantwortung pro Datei, ~200–400 Zeilen.
- Komposition statt Vererbung; `"use client"` nur wo nötig (Interaktivität/Hooks).
- Keine Emojis in Code/Kommentaren. Kommentare erklären das *Warum*, kurz und auf Deutsch.
- Immer `prefers-reduced-motion` mit ruhigem, vollständig sichtbarem Fallback bedienen
  (siehe Scroll-Szenen und `ServiceWheel`).
- Bilder über `next/image` mit `sizes`; Alt-Texte für inhaltliche Bilder, `alt=""` für dekorative.
- Anker-IDs müssen in ALLEN Render-Zweigen einer Komponente gesetzt sein (auch reduced-motion),
  damit Navbar-Links funktionieren. Aktuelle IDs: `#beste-wahl`, `#vorher-nachher`,
  `#ueber-uns`, `#bewertungen`, `#kontakt`.

### Scroll-Szenen-Muster

- Wrapper `h-[…svh]`, darin `sticky top-0 h-[100svh]` Bühne, Canvas-Framesequenz.
- IntersectionObserver zum Lazy-Load der Frames; Cleanup mit `cancelAnimationFrame`.
- Weiche Frames: `drawFrame` blendet zwei Nachbar-Frames per Alpha; rAF-`tick` lerpt
  `currentFrame` Richtung `targetFrame`; GSAP `onUpdate` setzt nur `targetFrame`.
- 3D-Rad: `translateZ(-radius)` auf den rotierenden Container ist Pflicht, sonst
  skaliert die Perspektive die Frontebene über den Container hinaus.

## Sicherheit

- Kontaktformular ist rein clientseitig → keine Secrets im Bundle, keine API-Route.
- Nie Secrets committen; `.env*` ist ge-gitignored.
- Nutzereingaben begrenzen (`maxLength`) und Honeypot beibehalten; `_captcha:false` ist ok,
  Spam wird über Honeypot + Längenlimits abgefangen.
- `window.open(...)` immer mit `"noopener"`; dynamische Werte mit `encodeURIComponent`.

## Verifikation vor dem Commit

Es gibt kein Test-Framework; verifiziert wird mit einem Playwright-Smoke-Test.

1. Build (exFAT-/Windows-Workaround, da `.next` auf exFAT Symlinks nicht kann):
   ```bash
   git checkout -- tsconfig.json
   DIST=".next-build-$(date +%s)"; echo "$DIST" > /e/claude-tmp/dist-name.txt
   NEXT_DIST_DIR="$DIST" npx next build
   ```
2. Port 3111 freimachen (PowerShell), dann starten:
   ```bash
   NEXT_DIST_DIR="$(cat /e/claude-tmp/dist-name.txt)" npx next start --port 3111 &
   ```
   (meldet gelegentlich fälschlich Exit 127 – Server läuft trotzdem, `server.log` prüfen)
3. `smoke.tmp.mjs` (Playwright) schreiben: zur Szene scrollen, ~6 s auf Lazy-Load warten,
   Screenshots in den Scratchpad, per `Read` visuell prüfen. Danach löschen.

## Build-Notizen

- Nicht direkt `next build` ohne `NEXT_DIST_DIR` – der Default-`.next` scheitert auf exFAT.
- Frames werden NICHT hochskaliert (Real-ESRGAN pro Bild ~7 min → für Framesequenzen unpraktikabel);
  nur Foto-Assets in `public/images/` sind 4×-upscaled.
