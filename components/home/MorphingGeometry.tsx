"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";

// ──────────────────────────────────────────────
// Shape vertex generators
// Each function projects the base icosahedron
// vertices onto a different mathematical surface.
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

// ─── Visibility hook (IntersectionObserver) ───

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

// ─── 3D Scene ───

function MorphingMesh({ isVisible }: { isVisible: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.LineSegments>(null);
  const shouldReduce = useReducedMotion();
  const mouseRef = useMousePosition();
  const initTime = useRef(Math.random() * 100);

  // Track morph state (persists across renders)
  const stateRef = useRef({
    currentIndex: 0,
    nextIndex: 1,
    elapsed: 0,
  });

  // Build base geometry once (Icosahedron, detail 3 = 642 vertices)
  const baseGeo = useMemo(() => new THREE.IcosahedronGeometry(1, 3), []);
  const basePositions = useMemo(
    () => new Float32Array(baseGeo.attributes.position!.array as Float32Array),
    [baseGeo],
  );

  // Pre-compute target positions for every shape
  const targets = useMemo(
    () => SHAPES.map((s) => s.compute(new Float32Array(basePositions))),
    [basePositions],
  );

  // Working buffer (reused each frame to avoid GC)
  const working = useMemo(() => new Float32Array(basePositions.length), [basePositions]);

  // Compute edges geometry from the base once
  const edgeGeo = useMemo(() => new THREE.EdgesGeometry(baseGeo), [baseGeo]);

  // Edge vertex mapping: for each edge vertex, find the corresponding base vertex index
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

    const t = state.clock.elapsedTime + initTime.current;
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

      meshRef.current.rotation.x = 0.3;
      meshRef.current.rotation.y = 0.5;
      wireRef.current.rotation.x = 0.3;
      wireRef.current.rotation.y = 0.5;
      innerRef.current.rotation.x = 0.3;
      innerRef.current.rotation.y = 0.5;
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

    // Interpolate positions
    const src = targets[currentIdx]!;
    const dst = targets[nextIdx]!;
    for (let i = 0; i < working.length; i++) {
      working[i] = src[i]! + (dst[i]! - src[i]!) * progress;
    }

    // Update main mesh
    for (let i = 0; i < working.length; i++) {
      posAttr.array[i] = working[i]!;
    }
    posAttr.needsUpdate = true;

    // Update wireframe mesh
    const wireAttr = (wireRef.current.geometry as THREE.BufferGeometry).attributes.position;
    if (wireAttr) {
      for (let i = 0; i < working.length; i++) wireAttr.array[i] = working[i]!;
      wireAttr.needsUpdate = true;
    }

    // Update inner mesh
    const innerAttr = (innerRef.current.geometry as THREE.BufferGeometry).attributes.position;
    if (innerAttr) {
      for (let i = 0; i < working.length; i++) innerAttr.array[i] = working[i]!;
      innerAttr.needsUpdate = true;
    }

    // Update edge lines
    const linePositions = lineRef.current.geometry.attributes.position;
    if (linePositions) {
      const linePos = linePositions.array as Float32Array;
      for (let i = 0; i < linePos.length; i++) {
        linePos[i] = working[edgeVertexToBase[i]!]!;
      }
      linePositions.needsUpdate = true;
    }

    // ── Rotation & motion ──
    const targetRX = 0.3 + mouseRef.current.y * 0.08;
    const targetRY = 0.5 + mouseRef.current.x * 0.1;
    meshRef.current.rotation.x += (targetRX - meshRef.current.rotation.x) * 0.03;
    meshRef.current.rotation.y += (targetRY - meshRef.current.rotation.y) * 0.03;
    meshRef.current.rotation.z = Math.sin(t * 0.12) * 0.04;

    meshRef.current.position.y = Math.sin(t * 0.25) * 0.18;

    const breath = 1 + Math.sin(t * 0.4) * 0.012;
    meshRef.current.scale.setScalar(breath);

    // Sync wire, inner, and line elements
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
      <mesh ref={wireRef} geometry={baseGeo} scale={1.05}>
        <meshPhysicalMaterial
          color="#5eead4"
          transparent
          opacity={0.04}
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
          opacity={0.14}
          roughness={0.06}
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.15}
          envMapIntensity={1.0}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner core */}
      <mesh ref={innerRef} geometry={baseGeo} scale={0.5}>
        <meshPhysicalMaterial
          color="#5eead4"
          transparent
          opacity={0.06}
          roughness={0.5}
          metalness={0.3}
          depthWrite={false}
        />
      </mesh>

      {/* Edge lines */}
      <lineSegments ref={lineRef} geometry={edgeGeo}>
        <lineBasicMaterial color="#5eead4" transparent opacity={0.15} />
      </lineSegments>
    </group>
  );
}

function Scene({ isVisible }: { isVisible: boolean }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 3, 5]} intensity={0.6} />
      <directionalLight position={[-3, 1, -2]} intensity={0.25} />
      <pointLight position={[-2, 1, 3]} intensity={0.2} color="#5eead4" />
      <MorphingMesh isVisible={isVisible} />
    </>
  );
}

function GeometryLoader() {
  const { progress } = useProgress();
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="w-32 h-32 rounded-2xl bg-gradient-to-br from-accent/5 to-accent/10"
        style={{ opacity: 0.1 + progress / 100 }}
      />
    </div>
  );
}

/** Premium morphing geometry — the sole 3D anchor in the hero */
export default function MorphingGeometry() {
  const { ref, isVisible } = useIsVisible();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute hidden desktop:block right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] -mr-8"
      aria-hidden="true"
    >
      {mounted ? (
        <Suspense fallback={<GeometryLoader />}>
          <Canvas
            camera={{ position: [0, 0, 3.5], fov: 30 }}
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
          <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-accent/5 to-accent/10 animate-pulse" />
        </div>
      )}
    </div>
  );
}
