"use client";

import { useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import * as THREE from "three";

type TileData = {
  id: string;
  title: string;
  text: string;
};

const GRID_COLS = 3;
const TILE_WIDTH = 2.6;
const TILE_HEIGHT = 1.6;
const GAP_X = 3.4;
const GAP_Y = 2.2;

function Tile({ data, position }: { data: TileData; position: [number, number, number] }) {
  return (
    <Float speed={1.1} rotationIntensity={0.35} floatIntensity={0.9}>
      <group position={position}>
        <mesh>
          <planeGeometry args={[TILE_WIDTH, TILE_HEIGHT]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.92}
            thickness={0.4}
            roughness={0.15}
            ior={1.4}
            metalness={0}
            transparent
            opacity={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>
        <Html
          transform
          occlude
          distanceFactor={4}
          position={[0, 0, 0.02]}
          className="pointer-events-none select-none"
        >
          <div className="flex h-[160px] w-[260px] flex-col justify-end p-4">
            <h3 className="font-display text-lg font-semibold text-sand-50 drop-shadow-md">
              {data.title}
            </h3>
            <p className="mt-1 text-xs leading-snug text-sand-100/85 drop-shadow-md">
              {data.text}
            </p>
          </div>
        </Html>
      </group>
    </Float>
  );
}

function CameraDrift() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.6, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.35, 0.03);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function TileGrid({ tiles }: { tiles: TileData[] }) {
  const positions = useMemo(() => {
    return tiles.map((_, i) => {
      const col = i % GRID_COLS;
      const row = Math.floor(i / GRID_COLS);
      const cols = Math.min(GRID_COLS, tiles.length);
      const rows = Math.ceil(tiles.length / GRID_COLS);
      const x = (col - (cols - 1) / 2) * GAP_X;
      const y = ((rows - 1) / 2 - row) * GAP_Y;
      const z = (i % 2 === 0 ? -0.3 : 0.3) + Math.sin(i) * 0.2;
      return [x, y, z] as [number, number, number];
    });
  }, [tiles]);

  return (
    <>
      {tiles.map((tile, i) => (
        <Tile key={tile.id} data={tile} position={positions[i]} />
      ))}
    </>
  );
}

export default function VideoTileScene() {
  const [tiles, setTiles] = useState<TileData[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/data/hero-tiles.json")
      .then((res) => res.json())
      .then((data: TileData[]) => {
        if (!cancelled) setTiles(data);
      })
      .catch(() => {
        if (!cancelled) setTiles([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!tiles) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />
      <TileGrid tiles={tiles} />
      <CameraDrift />
    </Canvas>
  );
}
