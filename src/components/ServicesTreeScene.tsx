"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, useTexture, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function useScrollProgress() {
  const progress = useRef(0);

  useEffect(() => {
    const section = document.getElementById("leistungen");

    function onScroll() {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      const scrolled = window.innerHeight - rect.top;
      progress.current = Math.min(1, Math.max(0, scrolled / total));
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}

const PANELS = [
  { src: "/images/rasen.jpg", pos: [-2.6, 1.7, -0.4], rot: [0, 0.35, 0.05], scale: 1 },
  { src: "/images/heckenschnitt.jpg", pos: [2.5, 2.1, -0.8], rot: [0, -0.4, -0.04], scale: 0.95 },
  { src: "/images/fliesen.jpg", pos: [-2.9, -0.6, -1.2], rot: [0, 0.5, -0.03], scale: 0.85 },
  { src: "/images/flaechenreinigung.jpg", pos: [2.9, -0.5, -0.6], rot: [0, -0.5, 0.04], scale: 0.9 },
  { src: "/images/bodenbelag.jpg", pos: [0, 2.9, -2], rot: [0.1, 0, 0], scale: 0.8 },
];

function RotatingTree() {
  const group = useRef<THREE.Group>(null);
  const progress = useScrollProgress();

  useFrame(() => {
    if (!group.current) return;
    const target = progress.current * Math.PI * 2.4;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, target, 0.06);
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.16, 1.4, 8]} />
        <meshStandardMaterial color="#7a5934" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.7, 0]} castShadow>
        <coneGeometry args={[0.95, 1.5, 8]} />
        <meshStandardMaterial color="#5c9a3d" roughness={0.75} />
      </mesh>
      <mesh position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[0.7, 1.25, 8]} />
        <meshStandardMaterial color="#79b558" roughness={0.75} />
      </mesh>
      <mesh position={[0, 3.15, 0]} castShadow>
        <coneGeometry args={[0.45, 0.95, 8]} />
        <meshStandardMaterial color="#9fcf80" roughness={0.75} />
      </mesh>
    </group>
  );
}

function Panel({
  src,
  pos,
  rot,
  scale,
}: {
  src: string;
  pos: [number, number, number];
  rot: [number, number, number];
  scale: number;
}) {
  const texture = useTexture(src);

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
  }, [texture]);

  return (
    <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.6}>
      <mesh position={pos} rotation={rot} scale={scale} castShadow>
        <planeGeometry args={[1.7, 1.15]} />
        <meshStandardMaterial map={texture} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={pos} rotation={rot} scale={scale * 1.04}>
        <planeGeometry args={[1.78, 1.22]} />
        <meshStandardMaterial color="#ffffff" roughness={1} side={THREE.BackSide} transparent opacity={0.9} />
      </mesh>
    </Float>
  );
}

function CameraDrift() {
  const { camera, pointer } = useThree();

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.8, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.4 + pointer.y * 0.3, 0.03);
    camera.lookAt(0, 1.4, 0);
  });

  return null;
}

export default function ServicesTreeScene() {
  return (
    <Canvas shadows camera={{ position: [0, 1.4, 7.5], fov: 42 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
      <color attach="background" args={["#f3eee0"]} />
      <fog attach="fog" args={["#f3eee0", 8, 16]} />

      <hemisphereLight args={["#fffdf6", "#cbe6b8", 0.9]} />
      <directionalLight position={[3, 6, 4]} intensity={1.3} color="#fff8ea" castShadow shadow-mapSize={[1024, 1024]} />
      <ambientLight intensity={0.5} />

      <RotatingTree />

      <Suspense fallback={null}>
        {PANELS.map((p) => (
          <Panel key={p.src} src={p.src} pos={p.pos as [number, number, number]} rot={p.rot as [number, number, number]} scale={p.scale} />
        ))}
      </Suspense>

      <ContactShadows position={[0, -0.02, 0]} opacity={0.3} scale={9} blur={2.6} far={3} />
      <Sparkles count={70} scale={[8, 4, 6]} size={2} speed={0.25} opacity={0.4} color="#5c9a3d" />

      <CameraDrift />
    </Canvas>
  );
}
