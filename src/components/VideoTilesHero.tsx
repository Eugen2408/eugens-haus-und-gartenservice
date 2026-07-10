"use client";

import dynamic from "next/dynamic";

const VideoTileScene = dynamic(() => import("./VideoTileScene"), {
  ssr: false,
});

export default function VideoTilesHero() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-forest-950">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/hero-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div className="absolute inset-0 bg-forest-950/35" />
      <div className="absolute inset-0">
        <VideoTileScene />
      </div>
    </div>
  );
}
