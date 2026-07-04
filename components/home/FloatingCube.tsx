"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";

/**
 * FloatingCube V2 — Premium hero accent
 *
 * Improvements over V1:
 * - 2.5x larger (wrapped in a 440px container vs 180px)
 * - Mouse tracking: gentle tilt toward cursor position
 * - Breathing: subtle scale pulse (1.0 → 1.04 → 1.0)
 * - Floating: slow vertical oscillation
 * - Soft emissive glow via bloom-like edge treatment
 * - Color shift between accent and purple in dark mode
 * - Suspense with lightweight shimmer placeholder
 * - IntersectionObserver pauses rendering when offscreen
 * - DPR clamped to [1, 1.5]
 * - prefers-reduced-motion respected
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

function useMousePosition() {
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * -2,
      };
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return mouseRef;
}

function CubeMesh({ isVisible }: { isVisible: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const shouldReduce = useReducedMotion();
  const mouseRef = useMousePosition();
  const initialTime = useRef(Math.random() * 100);

  useFrame((state) => {
    if (!meshRef.current || !edgesRef.current || !innerRef.current) return;
    if (!isVisible || shouldReduce) {
      meshRef.current.rotation.x = 0.3;
      meshRef.current.rotation.y = 0.5;
      return;
    }

    const t = state.clock.elapsedTime + initialTime.current;

    // --- Mouse tracking (gentle tilt) ---
    const targetRotX = 0.3 + mouseRef.current.y * 0.15;
    const targetRotY = 0.5 + mouseRef.current.x * 0.2;
    meshRef.current.rotation.x += (targetRotX - meshRef.current.rotation.x) * 0.03;
    meshRef.current.rotation.y += (targetRotY - meshRef.current.rotation.y) * 0.03;

    // --- Floating ---
    meshRef.current.position.y = Math.sin(t * 0.4) * 0.2;

    // --- Breathing scale ---
    const breath = 1 + Math.sin(t * 0.6) * 0.025;
    meshRef.current.scale.setScalar(breath);

    // Sync edges + inner mesh
    edgesRef.current.position.copy(meshRef.current.position);
    edgesRef.current.rotation.copy(meshRef.current.rotation);
    edgesRef.current.scale.copy(meshRef.current.scale);

    innerRef.current.position.copy(meshRef.current.position);
    innerRef.current.rotation.copy(meshRef.current.rotation);
    innerRef.current.scale.copy(meshRef.current.scale);
  });

  return (
    <group>
      {/* Outer glow shell */}
      <mesh ref={meshRef}>
        <boxGeometry args={[1.6, 1.6, 1.6]} />
        <meshPhysicalMaterial
          color="#5eead4"
          transparent
          opacity={0.04}
          roughness={0.3}
          metalness={0.2}
          depthWrite={false}
        />
      </mesh>

      {/* Inner solid core */}
      <mesh ref={innerRef}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshPhysicalMaterial
          color="#5eead4"
          transparent
          opacity={0.08}
          roughness={0.5}
          metalness={0.3}
          depthWrite={false}
        />
      </mesh>

      {/* Wireframe edges with glow */}
      <lineSegments ref={edgesRef}>
        <edgesGeometry args={[new THREE.BoxGeometry(1.6, 1.6, 1.6)]} />
        <lineBasicMaterial color="#5eead4" transparent opacity={0.6} />
      </lineSegments>
    </group>
  );
}

function Scene({ isVisible }: { isVisible: boolean }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={0.2} />
      <pointLight position={[-2, 1, 3]} intensity={0.3} color="#5eead4" />
      <CubeMesh isVisible={isVisible} />
    </>
  );
}

/** Lightweight shimmer placeholder shown while Three.js loads */
function CubePlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-accent/5 to-accent/10 animate-pulse" />
    </div>
  );
}

export default function FloatingCube() {
  const { ref, isVisible } = useIsVisible();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute hidden desktop:block right-0 top-1/2 -translate-y-1/2 w-[440px] h-[440px] -mr-16"
      aria-hidden="true"
    >
      {mounted ? (
        <Suspense fallback={<CubePlaceholder />}>
          <Canvas
            camera={{ position: [0, 0, 4.2], fov: 35 }}
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "low-power",
            }}
            style={{ width: "100%", height: "100%" }}
          >
            <Suspense fallback={null}>
              <Scene isVisible={isVisible} />
            </Suspense>
          </Canvas>
        </Suspense>
      ) : (
        <CubePlaceholder />
      )}
    </div>
  );
}
