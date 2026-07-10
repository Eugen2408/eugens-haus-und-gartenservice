"use client";

import dynamic from "next/dynamic";

const TransformationScene = dynamic(() => import("./TransformationScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-forest-950">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-sand-50/30 border-t-sand-50" />
    </div>
  ),
});

export default function Transformation3D() {
  return (
    <div className="absolute inset-0">
      <TransformationScene />
    </div>
  );
}
