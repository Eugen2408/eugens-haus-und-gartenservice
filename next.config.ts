import type { NextConfig } from "next";

// Content-Security-Policy: 'unsafe-inline' ist für Next-Bootstrap-Skripte und
// die Inline-Styles von Framer Motion/Tailwind nötig; img-src erlaubt zusätzlich
// die Google-Profilbilder in den Bewertungen. connect-/form-action lassen den
// FormSubmit-Versand des Kontaktformulars zu. Kein 'unsafe-eval' im Prod-Build.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://formsubmit.co",
  "form-action 'self' https://formsubmit.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Auf diesem Windows/exFAT-Setup sperrt der Virenscanner den frisch
  // erzeugten types-Ordner und lässt Folge-Builds mit EPERM scheitern.
  // Lokal deshalb pro Build ein frisches Verzeichnis über NEXT_DIST_DIR;
  // ohne die Variable (z. B. auf Vercel) bleibt es beim Standard .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
