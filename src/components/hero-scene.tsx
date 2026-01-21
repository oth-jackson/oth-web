"use client";

import * as THREE from "three";
import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Billboard } from "@react-three/drei";
import { easing } from "maath";
import { useTheme } from "next-themes";
import { useControls } from "leva";

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
    <group ref={groupRef} scale={1.3}>
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
  
  const { blobScale } = useControls("Blob", {
    blobScale: { value: 2.5, min: 0.5, max: 5, step: 0.1, label: "Blob Scale" },
  });

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.05;
    meshRef.current.rotation.y += delta * 0.08;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
      <group scale={blobScale}>
        {/* Transparent blob */}
        <mesh ref={meshRef} scale={1.0}>
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

// Create a rounded rectangle shape
function createRoundedRectShape(width: number, height: number, radius: number) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  
  return shape;
}

// Individual carousel card - always faces the screen via Billboard
function CarouselCard({ 
  angle,
  radius,
  isDark,
  children
}: { 
  angle: number;
  radius: number;
  isDark: boolean;
  children?: React.ReactNode;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const bgColor = isDark ? "#1a1a1a" : "#ffffff";
  const worldPos = useRef(new THREE.Vector3());

  // Position on the ring (in local ring space, Y is up)
  const x = Math.sin(angle) * radius;
  const y = Math.cos(angle) * radius;

  // Create rounded rectangle geometry
  const roundedRectGeometry = useMemo(() => {
    const shape = createRoundedRectShape(1.8, 1.2, 0.12);
    return new THREE.ShapeGeometry(shape);
  }, []);

  // Scale and fade based on depth - smaller/faded when behind, larger/opaque when in front
  useFrame(() => {
    if (!groupRef.current) return;
    
    // Get world position
    groupRef.current.getWorldPosition(worldPos.current);
    
    // Map Z position to scale: further back (negative Z) = smaller, closer (positive Z) = larger
    const z = worldPos.current.z;
    const minScale = 0.4;
    const maxScale = 1.0;
    const minOpacity = 0.15;
    const maxOpacity = 0.95;
    
    // Normalize z from [-radius, +radius] to [0, 1]
    const normalizedZ = (z + radius) / (radius * 2);
    const scale = minScale + (maxScale - minScale) * normalizedZ;
    const opacity = minOpacity + (maxOpacity - minOpacity) * normalizedZ;
    
    groupRef.current.scale.setScalar(scale);
    
    if (materialRef.current) {
      materialRef.current.opacity = opacity;
    }
  });

  return (
    <group ref={groupRef} position={[x, y, 0]}>
      {/* Billboard ensures the card always faces the camera/screen */}
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        {/* Rounded card plane */}
        <mesh geometry={roundedRectGeometry}>
          <meshBasicMaterial 
            ref={materialRef}
            color={bgColor} 
            side={THREE.DoubleSide}
            transparent
            opacity={0.95}
          />
        </mesh>
        {children}
      </Billboard>
    </group>
  );
}

// 3D Ring carousel of cards around the blob - tilted to pass bottom-right
function CarouselRing({ isDark }: { isDark: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);
  
  // Leva controls for tweaking rotation
  const { rotX, rotY, rotZ, posX, posY, posZ, radius, spinSpeed } = useControls("Ring", {
    rotX: { value: -0.41, min: -1, max: 1, step: 0.01, label: "Rotation X (×π)" },
    rotY: { value: -0.09, min: -1, max: 1, step: 0.01, label: "Rotation Y (×π)" },
    rotZ: { value: 0.12, min: -1, max: 1, step: 0.01, label: "Rotation Z (×π)" },
    posX: { value: 0.2, min: -5, max: 5, step: 0.1, label: "Position X" },
    posY: { value: -0.1, min: -5, max: 5, step: 0.1, label: "Position Y" },
    posZ: { value: 0.8, min: -5, max: 5, step: 0.1, label: "Position Z" },
    radius: { value: 3.4, min: 2, max: 8, step: 0.1, label: "Radius" },
    spinSpeed: { value: 0.08, min: 0, max: 0.5, step: 0.01, label: "Spin Speed" },
  });
  
  const numCards = 8;

  // Slow rotation animation around the ring's local axis
  useFrame((_, delta) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z += delta * spinSpeed; // Spin around tilted axis
  });

  // Generate card angles evenly distributed around the ring
  const cards = useMemo(() => {
    return Array.from({ length: numCards }, (_, i) => ({
      angle: (i / numCards) * Math.PI * 2,
      index: i,
    }));
  }, [numCards]);

  return (
    // Outer group tilts the ring: rotated so it goes top-left to bottom-right
    <group 
      ref={groupRef} 
      rotation={[Math.PI * rotX, Math.PI * rotY, Math.PI * rotZ]}
      position={[posX, posY, posZ]}
    >
      {/* Inner group spins the ring */}
      <group ref={ringRef}>
        {cards.map((card) => (
          <CarouselCard
            key={card.index}
            angle={card.angle}
            radius={radius}
            isDark={isDark}
          />
        ))}
      </group>
    </group>
  );
}

function Rig() {
  // Camera stays fixed - only logo tracks mouse
  return null;
}

function Scene({ isDark, mouse }: { isDark: boolean; mouse: { x: number; y: number } }) {
  const bgColor = isDark ? "#0a0a0a" : "#fafafa";

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[bgColor, 6, 18]} />

      {/* Very bright lighting */}
      <ambientLight intensity={2} />
      <directionalLight position={[5, 5, 5]} intensity={3} />
      <directionalLight position={[-5, 5, -5]} intensity={2.5} />
      <directionalLight position={[0, -5, 5]} intensity={2} />
      <pointLight position={[0, 3, 3]} intensity={2} />

      <group position={[0, 0.4, 0]}>
        <MorphingBlob isDark={isDark} mouse={mouse} />
        <CarouselRing isDark={isDark} />
      </group>
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
        camera={{ position: [0, 0, 9], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Scene isDark={isDark} mouse={mouse} />
      </Canvas>
    </div>
  );
}
