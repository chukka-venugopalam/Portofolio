"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";

/**
 * Custom hook — detects whether the element is in the viewport.
 * Avoids depending on motion's useInView which has unclear typing in v12.
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

function CubeMesh({ isVisible }: { isVisible: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const shouldReduce = useReducedMotion();

  useFrame((state) => {
    if (!meshRef.current || !edgesRef.current) return;
    if (!isVisible || shouldReduce) return;

    meshRef.current.rotation.x += 0.003;
    meshRef.current.rotation.y += 0.005;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.12;

    edgesRef.current.rotation.copy(meshRef.current.rotation);
    edgesRef.current.position.copy(meshRef.current.position);
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshPhysicalMaterial
          color="#5eead4"
          transparent
          opacity={0.06}
          roughness={0.4}
          metalness={0.1}
          depthWrite={false}
        />
      </mesh>
      <lineSegments ref={edgesRef}>
        <edgesGeometry args={[new THREE.BoxGeometry(1.2, 1.2, 1.2)]} />
        <lineBasicMaterial color="#5eead4" transparent opacity={0.5} />
      </lineSegments>
    </group>
  );
}

function Scene({ isVisible }: { isVisible: boolean }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} />
      <CubeMesh isVisible={isVisible} />
    </>
  );
}

export default function FloatingCube() {
  const { ref, isVisible } = useIsVisible();

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute hidden desktop:block right-0 top-1/2 -translate-y-1/2 w-[180px] h-[180px]"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <Scene isVisible={isVisible} />
        </Suspense>
      </Canvas>
    </div>
  );
}
