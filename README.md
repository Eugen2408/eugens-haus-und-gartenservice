# Eugens Haus- und Gartenservice

Website für Eugens Haus- und Gartenservice (Hamburg), gebaut mit Next.js,
Tailwind CSS, React Three Fiber (3D-Hero-Szene) und Framer Motion.

## Entwicklung

```bash
npm install
npm run dev
```

Seite läuft dann unter [http://localhost:3000](http://localhost:3000).

## Struktur

- `src/app/page.tsx` – Startseite, setzt alle Sektionen zusammen
- `src/components/` – einzelne Sektionen (Hero, Leistungen, Vorher/Nachher, Über uns, Kontakt, Footer)
- `public/images/` – Bilder für die Website

## Bilder austauschen

Neue Fotos einfach in `public/images/` legen und den Dateipfad in der
jeweiligen Komponente anpassen (z. B. `src/components/ServicesSection.tsx`).

## Deployment

Automatisches Deployment über Vercel bei jedem Push auf `main`.
