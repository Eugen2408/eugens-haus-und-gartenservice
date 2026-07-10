"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

const GRASS_COUNT = 900;
const LEAF_COUNT = 14;

function GrassField() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const blades = useMemo(() => {
    const arr = [];
    for (let i = 0; i < GRASS_COUNT; i++) {
      const radius = Math.sqrt(Math.random()) * 6.5;
      const angle = Math.random() * Math.PI * 2;
      arr.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius - 1.5,
        scale: 0.5 + Math.random() * 0.9,
        rotation: Math.random() * Math.PI,
        speed: 0.6 + Math.random() * 0.8,
        offset: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.getElapsedTime();
    blades.forEach((b, i) => {
      const sway = Math.sin(t * b.speed + b.offset) * 0.18;
      dummy.position.set(b.x, 0, b.z);
      dummy.rotation.set(0, b.rotation, sway);
      dummy.scale.set(b.scale, b.scale, b.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, GRASS_COUNT]}>
      <coneGeometry args={[0.045, 0.6, 3]} />
      <meshStandardMaterial color="#5c9a3d" roughness={0.8} />
    </instancedMesh>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -1.5]} receiveShadow>
      <circleGeometry args={[7, 48]} />
      <meshStandardMaterial color="#3a5a2a" roughness={1} />
    </mesh>
  );
}

function LowPolyTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.13, 1, 6]} />
        <meshStandardMaterial color="#5a4227" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.25, 0]} castShadow>
        <coneGeometry args={[0.65, 1.1, 7]} />
        <meshStandardMaterial color="#38612a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.75, 0]} castShadow>
        <coneGeometry args={[0.48, 0.9, 7]} />
        <meshStandardMaterial color="#497b37" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.15, 0]} castShadow>
        <coneGeometry args={[0.3, 0.65, 7]} />
        <meshStandardMaterial color="#5c9a3d" roughness={0.8} />
      </mesh>
    </group>
  );
}

function FloatingLeaves() {
  const leaves = useMemo(() => {
    const colors = ["#79b558", "#c9713f", "#9a7248", "#5c9a3d"];
    return Array.from({ length: LEAF_COUNT }, () => ({
      position: [
        (Math.random() - 0.5) * 8,
        1 + Math.random() * 3,
        -3 + Math.random() * 5,
      ] as [number, number, number],
      color: colors[Math.floor(Math.random() * colors.length)],
      scale: 0.12 + Math.random() * 0.14,
      speed: 0.5 + Math.random() * 1,
    }));
  }, []);

  return (
    <>
      {leaves.map((leaf, i) => (
        <Float key={i} speed={leaf.speed} rotationIntensity={2} floatIntensity={2}>
          <mesh position={leaf.position}>
            <planeGeometry args={[leaf.scale, leaf.scale * 1.4]} />
            <meshStandardMaterial
              color={leaf.color}
              side={THREE.DoubleSide}
              roughness={0.6}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function CameraRig() {
  const { camera, pointer } = useThree();
  const base = useMemo(() => new THREE.Vector3(0, 2.4, 7.5), []);

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, base.x + pointer.x * 0.6, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, base.y + pointer.y * 0.3, 0.03);
    camera.lookAt(0, 0.8, -1.5);
  });

  return null;
}

export default function GardenScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 2.4, 7.5], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#eaf0dc"]} />
      <fog attach="fog" args={["#eaf0dc", 8, 18]} />

      <hemisphereLight args={["#fdf6e3", "#2b4a20", 0.7]} />
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.4}
        color="#fff4da"
        castShadow
      />
      <ambientLight intensity={0.25} />

      <Ground />
      <GrassField />
      <LowPolyTree position={[-2.2, 0, -2.5]} />
      <LowPolyTree position={[2.6, 0, -3.5]} />
      <FloatingLeaves />
      <Sparkles count={40} scale={[8, 3, 6]} size={2} speed={0.3} opacity={0.4} color="#fff4da" />

      <CameraRig />
    </Canvas>
  );
}
