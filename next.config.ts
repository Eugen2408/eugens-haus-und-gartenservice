import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // .next liegt auf einem exFAT-Laufwerk und hat dort einen korrupten,
  // unlöschbaren Unterordner hinterlassen – Build-Ausgabe deshalb umgeleitet
  distDir: ".next-build",
};

export default nextConfig;
