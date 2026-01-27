"use client";

import * as THREE from "three";
import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Billboard, useGLTF } from "@react-three/drei";
import { easing } from "maath";
import { useTheme } from "next-themes";
import { useControls, Leva } from "leva";

// Global mouse position hook - offset for 3D scene being on right side
function useGlobalMouse() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1 to 1 range, centered on the right half of the screen
      // The 3D scene is roughly on the right 50% of the viewport
      const sceneCenter = window.innerWidth * 0.75; // Center of the right half
      setMouse({
        x: ((e.clientX - sceneCenter) / (window.innerWidth * 0.5)) * 2,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return mouse;
}

// 3D Logo model loaded from GLTF
function LogoShape({ isDark, mouse }: { isDark: boolean; mouse: { x: number; y: number } }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/logo.gltf");
  
  const { logoScale, baseRotX, baseRotY, baseRotZ, lightX, lightY, lightZ, edgeThreshold } = useControls("Logo", {
    logoScale: { value: 0.02, min: 0.001, max: 1, step: 0.001, label: "Logo Scale" },
    baseRotX: { value: -0.3, min: -Math.PI, max: Math.PI, step: 0.1, label: "Base Rot X" },
    baseRotY: { value: 2.15, min: -Math.PI, max: Math.PI, step: 0.1, label: "Base Rot Y" },
    baseRotZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.1, label: "Base Rot Z" },
    lightX: { value: 1.0, min: -2, max: 2, step: 0.1, label: "Light X" },
    lightY: { value: 2, min: -2, max: 2, step: 0.1, label: "Light Y" },
    lightZ: { value: 1.0, min: -2, max: 2, step: 0.1, label: "Light Z" },
    edgeThreshold: { value: 0.6, min: 0.1, max: 1.0, step: 0.05, label: "Edge Width" },
  });
  
  // Create dithering shader material
  const ditheringMaterial = useMemo(() => {
    const color = isDark ? new THREE.Color("#3dbfaf") : new THREE.Color("#2aa090");
    const edgeColor = isDark ? new THREE.Color("#0a4a40") : new THREE.Color("#064030");
    
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: color },
        uLightDir: { value: new THREE.Vector3(lightX, lightY, lightZ) },
        uEdgeColor: { value: edgeColor },
        uEdgeThreshold: { value: edgeThreshold },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec3 vViewDir;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          // View direction for Fresnel edge detection
          vViewDir = normalize(cameraPosition - worldPos.xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uLightDir;
        uniform vec3 uEdgeColor;
        uniform float uEdgeThreshold;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec3 vViewDir;
        
        // 8x8 Bayer dither pattern
        float dither8x8(vec2 position, float brightness) {
          const float dither[64] = float[64](
            0.0/64.0, 32.0/64.0, 8.0/64.0, 40.0/64.0, 2.0/64.0, 34.0/64.0, 10.0/64.0, 42.0/64.0,
            48.0/64.0, 16.0/64.0, 56.0/64.0, 24.0/64.0, 50.0/64.0, 18.0/64.0, 58.0/64.0, 26.0/64.0,
            12.0/64.0, 44.0/64.0, 4.0/64.0, 36.0/64.0, 14.0/64.0, 46.0/64.0, 6.0/64.0, 38.0/64.0,
            60.0/64.0, 28.0/64.0, 52.0/64.0, 20.0/64.0, 62.0/64.0, 30.0/64.0, 54.0/64.0, 22.0/64.0,
            3.0/64.0, 35.0/64.0, 11.0/64.0, 43.0/64.0, 1.0/64.0, 33.0/64.0, 9.0/64.0, 41.0/64.0,
            51.0/64.0, 19.0/64.0, 59.0/64.0, 27.0/64.0, 49.0/64.0, 17.0/64.0, 57.0/64.0, 25.0/64.0,
            15.0/64.0, 47.0/64.0, 7.0/64.0, 39.0/64.0, 13.0/64.0, 45.0/64.0, 5.0/64.0, 37.0/64.0,
            63.0/64.0, 31.0/64.0, 55.0/64.0, 23.0/64.0, 61.0/64.0, 29.0/64.0, 53.0/64.0, 21.0/64.0
          );
          int x = int(mod(position.x, 8.0));
          int y = int(mod(position.y, 8.0));
          float threshold = dither[x + y * 8];
          return step(threshold, brightness);
        }
        
        void main() {
          // Fresnel-based edge detection - edges where surface faces away from camera
          float fresnel = 1.0 - abs(dot(normalize(vNormal), normalize(vViewDir)));
          float edgeFactor = smoothstep(1.0 - uEdgeThreshold, 1.0, fresnel);
          
          // Main light from controls
          vec3 lightDir1 = normalize(uLightDir);
          // Secondary fill light
          vec3 lightDir2 = normalize(vec3(-uLightDir.x, uLightDir.y * 0.5, uLightDir.z * 0.5));
          
          float diff1 = max(dot(vNormal, lightDir1), 0.0);
          float diff2 = max(dot(vNormal, lightDir2), 0.0) * 0.5;
          float ambient = 0.3;
          
          float brightness = ambient + diff1 * 0.5 + diff2 * 0.3;
          brightness = clamp(brightness, 0.0, 1.0);
          
          // Apply dithering at larger scale
          vec2 screenPos = gl_FragCoord.xy / 2.0;
          float dithered = dither8x8(screenPos, brightness);
          
          // Mix between green and white based on dither
          vec3 darkColor = uColor;
          vec3 lightColor = vec3(1.0, 1.0, 1.0);
          vec3 finalColor = mix(darkColor, lightColor, dithered);
          
          // Apply edge outline on silhouette
          finalColor = mix(finalColor, uEdgeColor, edgeFactor);
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
  }, [isDark, lightX, lightY, lightZ, edgeThreshold]);
  
  // Clone the scene so we can modify materials
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = ditheringMaterial;
      }
    });
    
    return clone;
  }, [scene, ditheringMaterial]);

  // Track intro animation progress
  const introProgress = useRef(0);
  const introSpinAmount = Math.PI * 1.5; // 0.75 full rotations on entry (more subtle)
  const introDuration = 1.5; // seconds
  const introScale = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Intro animation
    if (introProgress.current < 1) {
      introProgress.current = Math.min(1, introProgress.current + delta / introDuration);
    }
    // Ease out cubic for smooth deceleration
    const easeOut = 1 - Math.pow(1 - introProgress.current, 3);
    const introSpin = introSpinAmount * (1 - easeOut);
    
    // Scale animation (0 -> 1)
    introScale.current = easeOut;
    groupRef.current.scale.setScalar(logoScale * introScale.current);
    
    // Autonomous floating motion
    const floatX = Math.sin(time * 0.6) * 0.08;
    const floatY = Math.cos(time * 0.5) * 0.06;
    const floatZ = Math.sin(time * 0.4) * 0.04;
    
    // Combine mouse tracking with float and intro spin
    // Cast rotation as any to work with damp3 (Euler is compatible at runtime)
    easing.damp3(
      groupRef.current.rotation as unknown as THREE.Vector3,
      [
        -mouse.y * 0.3 + floatX,
        mouse.x * 0.3 + floatY + introSpin,
        floatZ
      ],
      0.2,
      delta
    );
  });

  return (
    <group ref={groupRef} scale={logoScale}>
      {/* Base rotation to correct model orientation */}
      <group rotation={[baseRotX, baseRotY, baseRotZ]}>
        <primitive object={clonedScene} />
      </group>
    </group>
  );
}

// Preload the model
useGLTF.preload("/models/logo.gltf");

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
      <group scale={blobScale} position={[0, 0.3, 0]}>
        {/* Logo - tracks mouse */}
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
  cardSize,
  texture,
}: {
  angle: number;
  radius: number;
  isDark: boolean;
  cardSize: number;
  texture?: THREE.Texture;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const outlineMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  const worldPos = useRef(new THREE.Vector3());
  const bgColor = isDark ? "#1a1a1a" : "#ffffff";

  // Position on the ring (in local ring space, Y is up)
  const x = Math.sin(angle) * radius;
  const y = Math.cos(angle) * radius;

  // Create rounded rectangle geometry - size based on cardSize prop
  const { roundedRectGeometry, outlineGeometry } = useMemo(() => {
    const width = 1.8 * cardSize;
    const height = 1.2 * cardSize;
    const cornerRadius = 0.12 * cardSize;
    const shape = createRoundedRectShape(width, height, cornerRadius);
    const geometry = new THREE.ShapeGeometry(shape);

    // Fix UV mapping to fill the entire shape
    const uvAttribute = geometry.attributes.uv;
    const positions = geometry.attributes.position;

    // Calculate bounds
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }

    // Remap UVs to 0-1 range based on position bounds
    for (let i = 0; i < uvAttribute.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      uvAttribute.setX(i, (x - minX) / (maxX - minX));
      uvAttribute.setY(i, (y - minY) / (maxY - minY));
    }

    uvAttribute.needsUpdate = true;
    
    // Create outline geometry from shape points
    const points = shape.getPoints(50);
    const outlineGeo = new THREE.BufferGeometry().setFromPoints(points);
    
    return { roundedRectGeometry: geometry, outlineGeometry: outlineGeo };
  }, [cardSize]);

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
    const normalizedZ = Math.max(0, Math.min(1, (z + radius) / (radius * 2)));

    // Apply ease-in curve (power of 3) so planes stay small longer and scale up quickly at the end
    const easedZ = Math.pow(normalizedZ, 3);

    const scale = minScale + (maxScale - minScale) * easedZ;
    const opacity = minOpacity + (maxOpacity - minOpacity) * easedZ;

    groupRef.current.scale.setScalar(scale);

    if (materialRef.current) {
      materialRef.current.opacity = opacity;
    }
    if (outlineMaterialRef.current) {
      outlineMaterialRef.current.opacity = opacity;
    }
  });

  // Frosted glass background color
  const frostedColor = isDark ? "#2a2a2a" : "#f5f5f5";
  
  return (
    <group ref={groupRef} position={[x, y, 0]}>
      {/* Billboard ensures the card always faces the camera/screen */}
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        {/* Frosted glass background layer */}
        <mesh geometry={roundedRectGeometry} position={[0, 0, -0.01]}>
          <meshBasicMaterial
            color={frostedColor}
            side={THREE.DoubleSide}
            transparent
            opacity={0.7}
          />
        </mesh>
        {/* Main card with texture */}
        <mesh geometry={roundedRectGeometry}>
          <meshBasicMaterial
            ref={materialRef}
            map={texture}
            color={texture ? "#ffffff" : bgColor}
            side={THREE.DoubleSide}
            transparent
            opacity={0.95}
          />
        </mesh>
        {/* Outline border */}
        <line geometry={outlineGeometry}>
          <lineBasicMaterial
            ref={outlineMaterialRef}
            color="#000000"
            transparent
            opacity={0.3}
            linewidth={1}
          />
        </line>
      </Billboard>
    </group>
  );
}

// Card images - add your project images here
const CARD_IMAGES = [
  "/images/carousel/project-1.png",
  "/images/carousel/project-2.png",
  "/images/carousel/project-3.png",
  "/images/carousel/project-4.png",
  "/images/carousel/project-5.png",
  "/images/carousel/project-6.png",
  "/images/carousel/project-7.png",
  "/images/carousel/project-8.png",
];

// 3D Ring carousel of cards around the blob - tilted to pass bottom-right
function CarouselRing({ isDark }: { isDark: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);
  const [textures, setTextures] = useState<(THREE.Texture | null)[]>([]);

  // Load textures manually to handle errors gracefully
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const loadedTextures: (THREE.Texture | null)[] = [];

    Promise.all(
      CARD_IMAGES.map((path, index) =>
        new Promise<void>((resolve) => {
          loader.load(
            path,
            (texture) => {
              // Improve texture quality
              texture.minFilter = THREE.LinearMipmapLinearFilter;
              texture.magFilter = THREE.LinearFilter;
              texture.anisotropy = 16;
              texture.generateMipmaps = true;
              texture.colorSpace = THREE.SRGBColorSpace;
              loadedTextures[index] = texture;
              resolve();
            },
            undefined,
            () => {
              // On error, set null for this texture
              loadedTextures[index] = null;
              resolve();
            }
          );
        })
      )
    ).then(() => {
      setTextures(loadedTextures);
    });
  }, []);

  // Leva controls for tweaking rotation
  const { rotX, rotY, rotZ, posX, posY, posZ, radius, spinSpeed, cardSize } = useControls("Ring", {
    rotX: { value: -0.41, min: -1, max: 1, step: 0.01, label: "Rotation X (×π)" },
    rotY: { value: -0.09, min: -1, max: 1, step: 0.01, label: "Rotation Y (×π)" },
    rotZ: { value: 0.12, min: -1, max: 1, step: 0.01, label: "Rotation Z (×π)" },
    posX: { value: 0.2, min: -5, max: 5, step: 0.1, label: "Position X" },
    posY: { value: -0.1, min: -5, max: 5, step: 0.1, label: "Position Y" },
    posZ: { value: 0.8, min: -5, max: 5, step: 0.1, label: "Position Z" },
    radius: { value: 3.4, min: 2, max: 8, step: 0.1, label: "Radius" },
    spinSpeed: { value: 0.08, min: 0, max: 0.5, step: 0.01, label: "Spin Speed" },
    cardSize: { value: 1.0, min: 0.3, max: 2.0, step: 0.1, label: "Card Size" },
  });

  const numCards = CARD_IMAGES.length;

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
            cardSize={cardSize}
            texture={textures[card.index] || undefined}
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
  const fogColor = isDark ? "#0a0a0a" : "#fafafa";

  return (
    <>
      {/* Background is transparent - gradient shows from HTML layer */}
      <fog attach="fog" args={[fogColor, 8, 20]} />

      {/* Very bright lighting */}
      <ambientLight intensity={2} />
      <directionalLight position={[5, 5, 5]} intensity={3} />
      <directionalLight position={[-5, 5, -5]} intensity={2.5} />
      <directionalLight position={[0, -5, 5]} intensity={2} />
      <pointLight position={[0, 3, 3]} intensity={2} />

      <group position={[0, 0.6, 0]}>
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
    <>
      <Leva hidden />
      <div className="absolute inset-0 w-full h-full">
      <Canvas
          camera={{ position: [0, 0, 9], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Scene isDark={isDark} mouse={mouse} />
      </Canvas>
    </div>
    </>
  );
}
