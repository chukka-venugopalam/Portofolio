"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";

/**
 * FloatingSphere — lightweight wireframe sphere accent
 * Used as a subtle decorative element, e.g. in the footer or work page.
 * Minimal polygon count, DPR limited, offscreen pausing.
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

function SphereMesh({ isVisible }: { isVisible: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.LineSegments>(null);
  const shouldReduce = useReducedMotion();

  useFrame((state) => {
    if (!meshRef.current || !wireRef.current) return;
    if (!isVisible || shouldReduce) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    meshRef.current.rotation.y += 0.003;
    wireRef.current.rotation.copy(meshRef.current.rotation);
    wireRef.current.position.copy(meshRef.current.position);
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.8, 16, 12]} />
        <meshPhysicalMaterial
          color="#a78bfa"
          transparent
          opacity={0.05}
          roughness={0.3}
          metalness={0.1}
          depthWrite={false}
        />
      </mesh>
      <lineSegments ref={wireRef}>
        <edgesGeometry args={[new THREE.SphereGeometry(0.8, 16, 12)]} />
        <lineBasicMaterial color="#a78bfa" transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}

function Scene({ isVisible }: { isVisible: boolean }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <SphereMesh isVisible={isVisible} />
    </>
  );
}

export default function FloatingSphere({ className }: { className?: string }) {
  const { ref, isVisible } = useIsVisible();

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute ${className || ""}`}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 40 }}
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
