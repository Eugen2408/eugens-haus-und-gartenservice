"use client";

import dynamic from "next/dynamic";

const ServicesTreeScene = dynamic(() => import("./ServicesTreeScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-sand-100">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-forest-700/30 border-t-forest-700" />
    </div>
  ),
});

export default function ServicesTree3D() {
  return (
    <div className="absolute inset-0">
      <ServicesTreeScene />
    </div>
  );
}
