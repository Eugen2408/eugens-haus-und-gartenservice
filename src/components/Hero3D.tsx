"use client";

import dynamic from "next/dynamic";

const GardenScene = dynamic(() => import("./GardenScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#eaf0dc] to-[#dce8c8]">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-forest-700/30 border-t-forest-700" />
    </div>
  ),
});

export default function Hero3D() {
  return (
    <div className="absolute inset-0">
      <GardenScene />
    </div>
  );
}
