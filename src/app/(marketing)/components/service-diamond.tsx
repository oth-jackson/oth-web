"use client";

import * as THREE from "three";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes";

// Same dithering shader used by the hero logo
function createDitheringMaterial(isDark: boolean) {
  const color = isDark ? new THREE.Color("#3dbfaf") : new THREE.Color("#2aa090");
  const edgeColor = isDark ? new THREE.Color("#0a4a40") : new THREE.Color("#064030");

  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: color },
      uLightDir: { value: new THREE.Vector3(1.0, 2.0, 1.0) },
      uEdgeColor: { value: edgeColor },
      uEdgeThreshold: { value: 0.6 },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      varying vec3 vViewDir;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
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
        float fresnel = 1.0 - abs(dot(normalize(vNormal), normalize(vViewDir)));
        float edgeFactor = smoothstep(1.0 - uEdgeThreshold, 1.0, fresnel);

        vec3 lightDir1 = normalize(uLightDir);
        vec3 lightDir2 = normalize(vec3(-uLightDir.x, uLightDir.y * 0.5, uLightDir.z * 0.5));

        float diff1 = max(dot(vNormal, lightDir1), 0.0);
        float diff2 = max(dot(vNormal, lightDir2), 0.0) * 0.5;
        float ambient = 0.3;

        float brightness = ambient + diff1 * 0.5 + diff2 * 0.3;
        brightness = clamp(brightness, 0.0, 1.0);

        vec2 screenPos = gl_FragCoord.xy / 2.0;
        float dithered = dither8x8(screenPos, brightness);

        vec3 darkColor = uColor;
        vec3 lightColor = vec3(1.0, 1.0, 1.0);
        vec3 finalColor = mix(darkColor, lightColor, dithered);

        finalColor = mix(finalColor, uEdgeColor, edgeFactor);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
  });
}

function Diamond({ spinOffset = 0, scaleProgress = 1 }: { spinOffset?: number; scaleProgress?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const material = useMemo(() => createDitheringMaterial(isDark), [isDark]);

  // Ease-out cubic for a snappy expand
  const eased = 1 - Math.pow(1 - scaleProgress, 3);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.4;
    meshRef.current.scale.setScalar(eased);
  });

  return (
    <mesh
      ref={meshRef}
      material={material}
      rotation={[0.3, spinOffset, 0.2]}
      scale={0}
    >
      <dodecahedronGeometry args={[0.5, 0]} />
    </mesh>
  );
}

export function DiamondCanvas({ spinOffset = 0, scaleProgress = 1 }: { spinOffset?: number; scaleProgress?: number }) {
  return (
    <Canvas
      className="!w-full !h-full"
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 2], fov: 40 }}
      style={{ pointerEvents: "none" }}
      dpr={[1, 2]}
    >
      <Diamond spinOffset={spinOffset} scaleProgress={scaleProgress} />
    </Canvas>
  );
}
