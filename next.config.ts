import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Auf diesem Windows/exFAT-Setup sperrt der Virenscanner den frisch
  // erzeugten types-Ordner und lässt Folge-Builds mit EPERM scheitern.
  // Lokal deshalb pro Build ein frisches Verzeichnis über NEXT_DIST_DIR;
  // ohne die Variable (z. B. auf Vercel) bleibt es beim Standard .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
