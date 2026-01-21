"use client";

import * as THREE from "three";
import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { easing } from "maath";
import { useTheme } from "next-themes";

// Global mouse position hook
function useGlobalMouse() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1 to 1 range based on window size
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return mouse;
}

// Abstract logo representation using 4 rounded boxes (representing the 4 quadrants of the Otherwise logo)
function LogoShape({ isDark, mouse }: { isDark: boolean; mouse: { x: number; y: number } }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    // Subtly track mouse position
    easing.damp3(
      groupRef.current.rotation,
      [-mouse.y * 0.4, mouse.x * 0.4, 0],
      0.25,
      delta
    );
  });

  const color = isDark ? "#ffffff" : "#1a1a1a";
  const gap = 0.12;
  const size = 0.35;

  return (
    <group ref={groupRef} scale={0.9}>
      {/* Top left */}
      <mesh position={[-size / 2 - gap / 2, size / 2 + gap / 2, 0]}>
        <boxGeometry args={[size, size, 0.08]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Top right */}
      <mesh position={[size / 2 + gap / 2, size / 2 + gap / 2, 0]}>
        <boxGeometry args={[size, size, 0.08]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Bottom left */}
      <mesh position={[-size / 2 - gap / 2, -size / 2 - gap / 2, 0]}>
        <boxGeometry args={[size, size, 0.08]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Bottom right */}
      <mesh position={[size / 2 + gap / 2, -size / 2 - gap / 2, 0]}>
        <boxGeometry args={[size, size, 0.08]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

function MorphingBlob({ isDark, mouse }: { isDark: boolean; mouse: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.05;
    meshRef.current.rotation.y += delta * 0.08;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
      <group>
        {/* Transparent blob */}
        <mesh ref={meshRef} scale={1.4}>
          <icosahedronGeometry args={[1, 32]} />
          <MeshDistortMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.1}
            roughness={1}
            metalness={0}
            distort={0.3}
            speed={1.5}
            transparent
            opacity={0.35}
          />
        </mesh>

        {/* Logo inside - tracks mouse */}
        <LogoShape isDark={isDark} mouse={mouse} />
      </group>
    </Float>
  );
}

function SecondaryBlobs() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.02;
  });

  return (
    <group ref={group}>
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.6}>
        <mesh position={[2.5, 0.8, -1]} scale={0.55}>
          <sphereGeometry args={[1, 24, 24]} />
          <MeshDistortMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.15}
            roughness={1}
            metalness={0}
            distort={0.3}
            speed={2}
          />
        </mesh>
      </Float>

      <Float speed={2.2} rotationIntensity={0.25} floatIntensity={0.7}>
        <mesh position={[-2.2, -0.6, 0.5]} scale={0.45}>
          <sphereGeometry args={[1, 24, 24]} />
          <MeshDistortMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.15}
            roughness={1}
            metalness={0}
            distort={0.25}
            speed={2.5}
          />
        </mesh>
      </Float>

      <Float speed={2.5} rotationIntensity={0.15} floatIntensity={0.8}>
        <mesh position={[1.2, -1.6, 1]} scale={0.35}>
          <icosahedronGeometry args={[1, 2]} />
          <MeshDistortMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.15}
            roughness={1}
            metalness={0}
            distort={0.2}
            speed={3}
          />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh position={[-1.8, 1.2, -0.5]} scale={0.4}>
          <sphereGeometry args={[1, 24, 24]} />
          <MeshDistortMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.15}
            roughness={1}
            metalness={0}
            distort={0.28}
            speed={1.8}
          />
        </mesh>
      </Float>

      <Float speed={2.8} rotationIntensity={0.2} floatIntensity={0.9}>
        <mesh position={[3, -0.8, 0.8]} scale={0.3}>
          <icosahedronGeometry args={[1, 2]} />
          <MeshDistortMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.15}
            roughness={1}
            metalness={0}
            distort={0.22}
            speed={2.8}
          />
        </mesh>
      </Float>

      <Float speed={2} rotationIntensity={0.18} floatIntensity={0.65}>
        <mesh position={[-3, 0.2, -0.8]} scale={0.28}>
          <sphereGeometry args={[1, 24, 24]} />
          <MeshDistortMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.15}
            roughness={1}
            metalness={0}
            distort={0.24}
            speed={2.2}
          />
        </mesh>
      </Float>

      <Float speed={3} rotationIntensity={0.12} floatIntensity={1}>
        <mesh position={[0.5, 1.8, 0.5]} scale={0.25}>
          <sphereGeometry args={[1, 24, 24]} />
          <MeshDistortMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.15}
            roughness={1}
            metalness={0}
            distort={0.18}
            speed={3.2}
          />
        </mesh>
      </Float>

      <Float speed={1.6} rotationIntensity={0.22} floatIntensity={0.55}>
        <mesh position={[-0.8, -1.8, -0.3]} scale={0.32}>
          <icosahedronGeometry args={[1, 2]} />
          <MeshDistortMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.15}
            roughness={1}
            metalness={0}
            distort={0.26}
            speed={2}
          />
        </mesh>
      </Float>
    </group>
  );
}

function Rig() {
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [state.pointer.x * 1, state.pointer.y * 0.5, 7],
      0.3,
      delta
    );
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function Scene({ isDark, mouse }: { isDark: boolean; mouse: { x: number; y: number } }) {
  const bgColor = isDark ? "#0a0a0a" : "#fafafa";

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[bgColor, 5, 14]} />

      {/* Very bright lighting */}
      <ambientLight intensity={2} />
      <directionalLight position={[5, 5, 5]} intensity={3} />
      <directionalLight position={[-5, 5, -5]} intensity={2.5} />
      <directionalLight position={[0, -5, 5]} intensity={2} />
      <pointLight position={[0, 3, 3]} intensity={2} />

      <MorphingBlob isDark={isDark} mouse={mouse} />
      <SecondaryBlobs />
      <Rig />
    </>
  );
}

export function HeroScene() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const mouse = useGlobalMouse();

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Scene isDark={isDark} mouse={mouse} />
      </Canvas>
    </div>
  );
}
