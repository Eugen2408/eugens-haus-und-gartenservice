"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

const GRASS_COUNT = 1600;
const LEAF_COUNT = 26;

function GrassField() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const blades = useMemo(() => {
    const arr = [];
    for (let i = 0; i < GRASS_COUNT; i++) {
      const radius = Math.sqrt(Math.random()) * 7;
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
    <instancedMesh ref={meshRef} args={[undefined, undefined, GRASS_COUNT]} castShadow>
      <coneGeometry args={[0.045, 0.6, 3]} />
      <meshStandardMaterial color="#5c9a3d" roughness={0.8} />
    </instancedMesh>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -1.5]} receiveShadow>
      <circleGeometry args={[8, 48]} />
      <meshStandardMaterial color="#3a5a2a" roughness={1} />
    </mesh>
  );
}

function LowPolyTree({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
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

function Bush({
  position,
  scale = 1,
  color = "#497b37",
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
}) {
  const blobs = useMemo(
    () =>
      Array.from({ length: 4 }, () => ({
        x: (Math.random() - 0.5) * 0.5,
        z: (Math.random() - 0.5) * 0.5,
        y: Math.random() * 0.2,
        r: 0.28 + Math.random() * 0.16,
      })),
    []
  );

  return (
    <group position={position} scale={scale}>
      {blobs.map((b, i) => (
        <mesh key={i} position={[b.x, b.y + b.r * 0.7, b.z]} castShadow>
          <icosahedronGeometry args={[b.r, 0]} />
          <meshStandardMaterial color={color} roughness={0.85} flatShading />
        </mesh>
      ))}
    </group>
  );
}

function FloatingLeaves() {
  const leaves = useMemo(() => {
    const colors = ["#79b558", "#c9713f", "#9a7248", "#5c9a3d"];
    return Array.from({ length: LEAF_COUNT }, () => ({
      position: [
        (Math.random() - 0.5) * 9,
        1 + Math.random() * 3.5,
        -3 + Math.random() * 5.5,
      ] as [number, number, number],
      color: colors[Math.floor(Math.random() * colors.length)],
      scale: 0.12 + Math.random() * 0.14,
      speed: 0.5 + Math.random() * 1,
    }));
  }, []);

  return (
    <>
      {leaves.map((leaf, i) => (
        <Float key={i} speed={leaf.speed} rotationIntensity={2.4} floatIntensity={2.6}>
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
  const start = useMemo(() => new THREE.Vector3(0, 4.2, 12), []);

  useFrame((state) => {
    const t = Math.min(state.clock.getElapsedTime() / 2.2, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const introX = THREE.MathUtils.lerp(start.x, base.x, eased);
    const introY = THREE.MathUtils.lerp(start.y, base.y, eased);
    const introZ = THREE.MathUtils.lerp(start.z, base.z, eased);

    const targetX = introX + pointer.x * 0.6 * eased;
    const targetY = introY + pointer.y * 0.3 * eased;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.04);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, introZ, 0.04);
    camera.lookAt(0, 0.8, -1.5);
  });

  return null;
}

export default function GardenScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 4.2, 12], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#eaf0dc"]} />
      <fog attach="fog" args={["#eaf0dc", 8, 19]} />

      <hemisphereLight args={["#fdf6e3", "#2b4a20", 0.7]} />
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.5}
        color="#fff4da"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <ambientLight intensity={0.25} />

      <Ground />
      <GrassField />

      <LowPolyTree position={[-2.2, 0, -2.5]} />
      <LowPolyTree position={[2.6, 0, -3.5]} />
      <LowPolyTree position={[-4.4, 0, -5]} scale={0.75} />
      <LowPolyTree position={[4.6, 0, -6]} scale={0.6} />

      <Bush position={[-1.1, 0, -0.8]} scale={0.9} />
      <Bush position={[1.6, 0, -1.2]} scale={0.7} color="#5c9a3d" />
      <Bush position={[-2.8, 0, -1.6]} scale={0.6} color="#38612a" />

      <ContactShadows
        position={[0, 0.01, -1.5]}
        opacity={0.35}
        scale={12}
        blur={2}
        far={3}
      />

      <FloatingLeaves />
      <Sparkles count={60} scale={[9, 3.5, 7]} size={2.2} speed={0.3} opacity={0.45} color="#fff4da" />

      <CameraRig />
    </Canvas>
  );
}
