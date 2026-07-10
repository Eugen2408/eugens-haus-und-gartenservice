"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, ContactShadows, RoundedBox, Sparkles } from "@react-three/drei";
import * as THREE from "three";

const HOLD = 2.6;
const FLIP = 1.1;
const CYCLE = (HOLD + FLIP) * 2;

function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function phaseRotationY(t: number) {
  const local = t % CYCLE;
  if (local < HOLD) return 0;
  if (local < HOLD + FLIP) {
    const p = (local - HOLD) / FLIP;
    return easeInOutCubic(p) * Math.PI;
  }
  if (local < HOLD + FLIP + HOLD) return Math.PI;
  const p = (local - (HOLD + FLIP + HOLD)) / FLIP;
  return Math.PI + easeInOutCubic(p) * Math.PI;
}

function PhotoCard() {
  const [beforeMap, afterMap] = useTexture([
    "/images/vorher-schuppen.jpg",
    "/images/nachher-schuppen.jpg",
  ]);

  useMemo(() => {
    [beforeMap, afterMap].forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
    });
  }, [beforeMap, afterMap]);

  const groupRef = useRef<THREE.Group>(null);
  const W = 2.5;
  const H = 1.9;

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    const t = state.clock.getElapsedTime();
    g.rotation.y = phaseRotationY(t);
    g.position.y = 1.35 + Math.sin(t * 0.6) * 0.06;
    g.rotation.z = Math.sin(t * 0.5) * 0.015;
  });

  return (
    <group ref={groupRef} position={[0, 1.35, 0]}>
      <RoundedBox args={[W + 0.16, H + 0.16, 0.1]} radius={0.06} smoothness={4} castShadow>
        <meshStandardMaterial color="#faf3e6" roughness={0.7} />
      </RoundedBox>

      <mesh position={[0, 0, 0.053]} castShadow>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial map={beforeMap} roughness={0.55} />
      </mesh>

      <mesh position={[0, 0, -0.053]} rotation={[0, Math.PI, 0]} castShadow>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial map={afterMap} roughness={0.55} />
      </mesh>
    </group>
  );
}

function CameraDrift() {
  const { camera, pointer } = useThree();

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.5, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.5 + pointer.y * 0.2, 0.03);
    camera.lookAt(0, 1.35, 0);
  });

  return null;
}

export default function TransformationScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 1.5, 5.2], fov: 40 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#16241a"]} />
      <fog attach="fog" args={["#16241a", 6, 13]} />

      <hemisphereLight args={["#fdf6e3", "#16241a", 0.6]} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.4}
        color="#fff4da"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <ambientLight intensity={0.35} />

      <PhotoCard />

      <ContactShadows position={[0, -0.05, 0]} opacity={0.5} scale={6} blur={2.4} far={2} />
      <Sparkles count={40} scale={[5, 3, 4]} size={2} speed={0.25} opacity={0.35} color="#fff4da" />

      <CameraDrift />
    </Canvas>
  );
}
