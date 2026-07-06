"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";

// ──────────────────────────────────────────────
// Shape vertex generators
// ──────────────────────────────────────────────

function computeCubePositions(src: Float32Array): Float32Array {
  const dst = new Float32Array(src.length);
  for (let i = 0; i < src.length; i += 3) {
    const x = src[i]!;
    const y = src[i + 1]!;
    const z = src[i + 2]!;
    const max = Math.max(Math.abs(x), Math.abs(y), Math.abs(z));
    const s = 1 / Math.max(max, 1e-6);
    dst[i] = x * s;
    dst[i + 1] = y * s;
    dst[i + 2] = z * s;
  }
  return dst;
}

function computeOctahedronPositions(src: Float32Array): Float32Array {
  const dst = new Float32Array(src.length);
  for (let i = 0; i < src.length; i += 3) {
    const x = src[i]!;
    const y = src[i + 1]!;
    const z = src[i + 2]!;
    const sum = Math.abs(x) + Math.abs(y) + Math.abs(z);
    const s = 1 / Math.max(sum, 1e-6);
    dst[i] = x * s;
    dst[i + 1] = y * s;
    dst[i + 2] = z * s;
  }
  return dst;
}

function computeSpherePositions(src: Float32Array): Float32Array {
  const dst = new Float32Array(src.length);
  for (let i = 0; i < src.length; i += 3) {
    const x = src[i]!;
    const y = src[i + 1]!;
    const z = src[i + 2]!;
    const len = Math.sqrt(x * x + y * y + z * z);
    const s = 1 / Math.max(len, 1e-6);
    dst[i] = x * s;
    dst[i + 1] = y * s;
    dst[i + 2] = z * s;
  }
  return dst;
}

function computeRoundedCubePositions(src: Float32Array, roundness = 0.4): Float32Array {
  const dst = new Float32Array(src.length);
  for (let i = 0; i < src.length; i += 3) {
    const x = src[i]!;
    const y = src[i + 1]!;
    const z = src[i + 2]!;
    const max = Math.max(Math.abs(x), Math.abs(y), Math.abs(z));
    const len = Math.sqrt(x * x + y * y + z * z);
    const cubeS = 1 / Math.max(max, 1e-6);
    const sphereS = 1 / Math.max(len, 1e-6);
    const s = cubeS * (1 - roundness) + sphereS * roundness;
    dst[i] = x * s;
    dst[i + 1] = y * s;
    dst[i + 2] = z * s;
  }
  return dst;
}

function computeTorusPositions(src: Float32Array, R = 1.0, r = 0.35): Float32Array {
  const dst = new Float32Array(src.length);
  for (let i = 0; i < src.length; i += 3) {
    const x = src[i]!;
    const y = src[i + 1]!;
    const z = src[i + 2]!;
    const len = Math.sqrt(x * x + y * y + z * z);
    const nx = x / len;
    const ny = y / len;
    const nz = z / len;
    const theta = Math.acos(Math.max(-1, Math.min(1, nz)));
    const phi = Math.atan2(ny, nx);
    dst[i] = (R + r * Math.cos(theta)) * Math.cos(phi);
    dst[i + 1] = (R + r * Math.cos(theta)) * Math.sin(phi);
    dst[i + 2] = r * Math.sin(theta);
  }
  return dst;
}

// ─── Shape configuration ───

interface ShapeConfig {
  name: string;
  compute: (src: Float32Array) => Float32Array;
}

const SHAPES: ShapeConfig[] = [
  { name: "cube", compute: computeCubePositions },
  { name: "octahedron", compute: computeOctahedronPositions },
  { name: "icosahedron", compute: (src) => new Float32Array(src) },
  { name: "sphere", compute: computeSpherePositions },
  { name: "roundedCube", compute: (src) => computeRoundedCubePositions(src, 0.4) },
  { name: "torus", compute: (src) => computeTorusPositions(src, 1.0, 0.35) },
];

// ─── Timing constants ───
const MORPH_DURATION = 7;
const HOLD_DURATION = 3;
const TOTAL_SHAPE_DURATION = MORPH_DURATION + HOLD_DURATION;

// ─── Mouse position hook ───

function useMousePosition() {
  const mouseRef = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * -2,
      };
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return mouseRef;
}

// ─── Visibility hook ───

function useIsVisible() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry?.isIntersecting ?? true),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, isVisible };
}

// ─── Easing ───

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ─── Particles ───

function Particles({ count = 60 }) {
  const meshRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.015;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.05;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#5eead4"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─── Orbiting Ring ───

function OrbitingRing({ radius = 2.2, color = "#5eead4", speed = 0.3, tilt = 0 }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = tilt;
    ref.current.rotation.z = state.clock.elapsedTime * speed;
  });

  return (
    <mesh ref={ref}>
      <ringGeometry args={[radius - 0.015, radius + 0.015, 64]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.12}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Floating Plane ───

function FloatingPlane({ position, rotation, color = "#5eead4", opacity = 0.04 }: {
  position: [number, number, number];
  rotation: [number, number, number];
  color?: string;
  opacity?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const startY = useRef(Math.random() * 10);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3 + startY.current) * 0.15;
    ref.current.rotation.z += 0.002;
  });

  const pos = new THREE.Vector3(position[0], position[1], position[2]);
  const rot = new THREE.Euler(rotation[0], rotation[1], rotation[2]);

  return (
    <mesh ref={ref} position={pos} rotation={rot}>
      <planeGeometry args={[1.2, 0.8]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        wireframe
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── 3D Scene ───

function MorphingMesh({ isVisible }: { isVisible: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.LineSegments>(null);
  const shouldReduce = useReducedMotion();
  const mouseRef = useMousePosition();
  const initTime = useRef(Math.random() * 100);

  const stateRef = useRef({
    currentIndex: 0,
    nextIndex: 1,
    elapsed: 0,
  });

  const baseGeo = useMemo(() => new THREE.IcosahedronGeometry(1, 3), []);
  const basePositions = useMemo(
    () => new Float32Array(baseGeo.attributes.position!.array as Float32Array),
    [baseGeo],
  );

  const targets = useMemo(
    () => SHAPES.map((s) => s.compute(new Float32Array(basePositions))),
    [basePositions],
  );

  const working = useMemo(() => new Float32Array(basePositions.length), [basePositions]);
  const edgeGeo = useMemo(() => new THREE.EdgesGeometry(baseGeo), [baseGeo]);

  const edgeVertexToBase = useMemo(() => {
    const edgePos = edgeGeo.attributes.position!.array as Float32Array;
    const basePos = basePositions;
    const mapping: number[] = [];

    for (let ei = 0; ei < edgePos.length; ei += 3) {
      const ex = edgePos[ei]!;
      const ey = edgePos[ei + 1]!;
      const ez = edgePos[ei + 2]!;

      let bestDist = Infinity;
      let bestIdx = 0;
      for (let bi = 0; bi < basePos.length; bi += 3) {
        const dx = basePos[bi]! - ex;
        const dy = basePos[bi + 1]! - ey;
        const dz = basePos[bi + 2]! - ez;
        const d = dx * dx + dy * dy + dz * dz;
        if (d < bestDist) {
          bestDist = d;
          bestIdx = bi;
        }
      }
      mapping.push(bestIdx);
    }
    return mapping;
  }, [basePositions, edgeGeo]);

  useFrame((state) => {
    if (!meshRef.current || !wireRef.current || !innerRef.current || !lineRef.current) return;

    const posAttr = (meshRef.current.geometry as THREE.BufferGeometry).attributes.position;
    if (!posAttr) return;

    const dt = Math.min(state.clock.getDelta(), 0.05);

    if (!isVisible || shouldReduce) {
      const cubePos = targets[0]!;
      for (let i = 0; i < cubePos.length; i++) {
        posAttr.array[i] = cubePos[i]!;
      }
      posAttr.needsUpdate = true;

      const linePositions = lineRef.current.geometry.attributes.position;
      if (linePositions) {
        const linePos = linePositions.array as Float32Array;
        for (let i = 0; i < linePos.length; i++) {
          linePos[i] = posAttr.array[edgeVertexToBase[i]!]!;
        }
        linePositions.needsUpdate = true;
      }

      meshRef.current.rotation.x = 0.2;
      meshRef.current.rotation.y = 0.4;
      wireRef.current.rotation.x = 0.2;
      wireRef.current.rotation.y = 0.4;
      innerRef.current.rotation.x = 0.2;
      innerRef.current.rotation.y = 0.4;
      return;
    }

    // ── Update morph state ──
    const st = stateRef.current;
    st.elapsed += dt;

    let progress = 0;
    let currentIdx = st.currentIndex;
    let nextIdx = st.nextIndex;

    if (st.elapsed >= TOTAL_SHAPE_DURATION) {
      st.currentIndex = st.nextIndex;
      st.nextIndex = (st.nextIndex + 1) % SHAPES.length;
      st.elapsed = 0;
      currentIdx = st.currentIndex;
      nextIdx = st.nextIndex;
    } else if (st.elapsed >= MORPH_DURATION) {
      progress = 1;
    } else {
      progress = easeInOutCubic(st.elapsed / MORPH_DURATION);
    }

    const src = targets[currentIdx]!;
    const dst = targets[nextIdx]!;
    for (let i = 0; i < working.length; i++) {
      working[i] = src[i]! + (dst[i]! - src[i]!) * progress;
    }

    for (let i = 0; i < working.length; i++) {
      posAttr.array[i] = working[i]!;
    }
    posAttr.needsUpdate = true;

    const wireAttr = (wireRef.current.geometry as THREE.BufferGeometry).attributes.position;
    if (wireAttr) {
      for (let i = 0; i < working.length; i++) wireAttr.array[i] = working[i]!;
      wireAttr.needsUpdate = true;
    }

    const innerAttr = (innerRef.current.geometry as THREE.BufferGeometry).attributes.position;
    if (innerAttr) {
      for (let i = 0; i < working.length; i++) innerAttr.array[i] = working[i]!;
      innerAttr.needsUpdate = true;
    }

    const linePositions = lineRef.current.geometry.attributes.position;
    if (linePositions) {
      const linePos = linePositions.array as Float32Array;
      for (let i = 0; i < linePos.length; i++) {
        linePos[i] = working[edgeVertexToBase[i]!]!;
      }
      linePositions.needsUpdate = true;
    }

    const t = state.clock.elapsedTime + initTime.current;
    const targetRX = 0.2 + mouseRef.current.y * 0.06;
    const targetRY = 0.4 + mouseRef.current.x * 0.08;
    meshRef.current.rotation.x += (targetRX - meshRef.current.rotation.x) * 0.03;
    meshRef.current.rotation.y += (targetRY - meshRef.current.rotation.y) * 0.03;
    meshRef.current.rotation.z = Math.sin(t * 0.1) * 0.03;
    meshRef.current.position.y = Math.sin(t * 0.2) * 0.15;
    const breath = 1 + Math.sin(t * 0.35) * 0.01;
    meshRef.current.scale.setScalar(breath);

    wireRef.current.position.copy(meshRef.current.position);
    wireRef.current.rotation.copy(meshRef.current.rotation);
    wireRef.current.scale.copy(meshRef.current.scale);

    innerRef.current.position.copy(meshRef.current.position);
    innerRef.current.rotation.copy(meshRef.current.rotation);
    innerRef.current.scale.copy(meshRef.current.scale);

    lineRef.current.position.copy(meshRef.current.position);
    lineRef.current.rotation.copy(meshRef.current.rotation);
    lineRef.current.scale.copy(meshRef.current.scale);
  });

  return (
    <group>
      {/* Ambient glow shell */}
      <mesh ref={wireRef} geometry={baseGeo} scale={1.06}>
        <meshPhysicalMaterial
          color="#5eead4"
          transparent
          opacity={0.03}
          roughness={0.3}
          metalness={0.05}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Main morphing mesh — frosted glass */}
      <mesh ref={meshRef} geometry={baseGeo}>
        <meshPhysicalMaterial
          color="#5eead4"
          transparent
          opacity={0.12}
          roughness={0.04}
          metalness={0.08}
          clearcoat={1.0}
          clearcoatRoughness={0.12}
          envMapIntensity={1.0}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner core */}
      <mesh ref={innerRef} geometry={baseGeo} scale={0.45}>
        <meshPhysicalMaterial
          color="#5eead4"
          transparent
          opacity={0.05}
          roughness={0.5}
          metalness={0.3}
          depthWrite={false}
        />
      </mesh>

      {/* Edge lines */}
      <lineSegments ref={lineRef} geometry={edgeGeo}>
        <lineBasicMaterial color="#5eead4" transparent opacity={0.12} />
      </lineSegments>
    </group>
  );
}

function Scene({ isVisible }: { isVisible: boolean }) {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 3, 5]} intensity={0.5} />
      <directionalLight position={[-3, 1, -2]} intensity={0.2} />
      <pointLight position={[-2, 1, 3]} intensity={0.15} color="#5eead4" />

      {/* Main morphing mesh */}
      <MorphingMesh isVisible={isVisible} />

      {/* Orbiting rings */}
      <OrbitingRing radius={2.0} speed={0.25} tilt={0.3} />
      <OrbitingRing radius={2.4} color="#a78bfa" speed={-0.2} tilt={-0.5} />
      <OrbitingRing radius={1.7} speed={0.35} tilt={1.0} />

      {/* Floating planes */}
      <FloatingPlane position={[-2.5, 1.5, -1]} rotation={[0.3, 0.5, 0.2]} />
      <FloatingPlane position={[2.8, -0.5, -1.5]} rotation={[0.8, 0.2, 0.6]} color="#a78bfa" />
      <FloatingPlane position={[0, -2.0, -1]} rotation={[1.2, 0, 0.4]} opacity={0.025} />

      {/* Subtle particles */}
      <Particles count={40} />
    </>
  );
}

function GeometryLoader() {
  const { progress } = useProgress();
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="w-40 h-40 rounded-3xl bg-gradient-to-br from-accent/5 to-accent/10"
        style={{ opacity: 0.1 + progress / 100 }}
      />
    </div>
  );
}

/** Premium morphing geometry scene — multiple shapes, rings, particles, wireframes */
export default function MorphingGeometry() {
  const { ref, isVisible } = useIsVisible();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute hidden desktop:block right-0 top-1/2 -translate-y-1/2 w-[700px] h-[700px] -mr-12"
      aria-hidden="true"
    >
      {mounted ? (
        <Suspense fallback={<GeometryLoader />}>
          <Canvas
            camera={{ position: [0, 0, 4.2], fov: 28 }}
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
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-accent/5 to-accent/10 animate-pulse" />
        </div>
      )}
    </div>
  );
}
