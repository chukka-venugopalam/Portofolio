"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";

/**
 * GeometricPrism — lightweight triangular prism accent
 * Subtle floating geometric shape for page decoration.
 * Very low polygon count (CylinderGeometry with 3 radial segments).
 */

function useIsVisible() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry?.isIntersecting ?? true),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, isVisible };
}

function PrismMesh({ isVisible }: { isVisible: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.LineSegments>(null);
  const shouldReduce = useReducedMotion();

  useFrame((state) => {
    if (!meshRef.current || !wireRef.current) return;
    if (!isVisible || shouldReduce) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = Math.sin(t * 0.15) * 0.1;
    meshRef.current.rotation.y += 0.004;
    meshRef.current.position.y = Math.sin(t * 0.3) * 0.1;
    wireRef.current.rotation.copy(meshRef.current.rotation);
    wireRef.current.position.copy(meshRef.current.position);
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <cylinderGeometry args={[0.6, 0.6, 0.9, 3]} />
        <meshPhysicalMaterial
          color="#818cf8"
          transparent
          opacity={0.06}
          roughness={0.4}
          metalness={0.1}
          depthWrite={false}
        />
      </mesh>
      <lineSegments ref={wireRef}>
        <edgesGeometry args={[new THREE.CylinderGeometry(0.6, 0.6, 0.9, 3)]} />
        <lineBasicMaterial color="#818cf8" transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}

function Scene({ isVisible }: { isVisible: boolean }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <PrismMesh isVisible={isVisible} />
    </>
  );
}

export default function GeometricPrism({ className }: { className?: string }) {
  const { ref, isVisible } = useIsVisible();

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute ${className || ""}`}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 40 }}
        dpr={[1, 1.2]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <Scene isVisible={isVisible} />
        </Suspense>
      </Canvas>
    </div>
  );
}
