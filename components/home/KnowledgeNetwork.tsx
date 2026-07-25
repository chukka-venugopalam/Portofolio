"use client";

import { Suspense, useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import PhilosophyOrbitFallback from "./PhilosophyOrbitFallback";

interface PhilosophyStage {
  id: string;
  label: string;
  color: string;
  description: string;
  rotationZ: number; // Rotational angle around shared Z-axis
  speed: number;
  initialPhase: number;
}

const SEMI_MAJOR_A = 2.4;
const SEMI_MINOR_B = 1.05;
const INCLINATION_X = 0.38; // 3D spatial tilt angle

const PHILOSOPHY_STAGES: PhilosophyStage[] = [
  {
    id: "curiosity",
    label: "Curiosity",
    color: "#F5A623",
    description: "Every project starts with a question I can't stop thinking about.",
    rotationZ: 0,
    speed: 0.42,
    initialPhase: 0,
  },
  {
    id: "learning",
    label: "Learning",
    color: "#4A90D9",
    description: "Learning isn't collecting tutorials—it's turning ideas into working systems.",
    rotationZ: (Math.PI / 5) * 1, // 36°
    speed: 0.34,
    initialPhase: (Math.PI * 2) / 5,
  },
  {
    id: "understanding",
    label: "Understanding",
    color: "#2CB1BC",
    description: "Optimizing for deep mental models so durable knowledge compounds.",
    rotationZ: (Math.PI / 5) * 2, // 72°
    speed: 0.28,
    initialPhase: ((Math.PI * 2) / 5) * 2,
  },
  {
    id: "building",
    label: "Building",
    color: "#8B5CF6",
    description: "Every concept becomes a prototype. Every prototype becomes a product.",
    rotationZ: (Math.PI / 5) * 3, // 108°
    speed: 0.23,
    initialPhase: ((Math.PI * 2) / 5) * 3,
  },
  {
    id: "impact",
    label: "Impact",
    color: "#F0654D",
    description: "Building AI systems that help people learn, think, and make better decisions.",
    rotationZ: (Math.PI / 5) * 4, // 144°
    speed: 0.18,
    initialPhase: ((Math.PI * 2) / 5) * 4,
  },
];

/** Computes a 3D point along a rotated ellipse given angle theta and rotation Z */
function getEllipsePoint3D(theta: number, rotationZ: number): THREE.Vector3 {
  // 1. 2D Ellipse in XY plane
  const x0 = SEMI_MAJOR_A * Math.cos(theta);
  const y0 = SEMI_MINOR_B * Math.sin(theta);

  // 2. Rotate around Z axis (React logo angle offset)
  const x1 = x0 * Math.cos(rotationZ) - y0 * Math.sin(rotationZ);
  const y1 = x0 * Math.sin(rotationZ) + y0 * Math.cos(rotationZ);
  const z1 = 0;

  // 3. Tilt slightly around X axis for 3D spatial depth
  const x = x1;
  const y = y1 * Math.cos(INCLINATION_X) - z1 * Math.sin(INCLINATION_X);
  const z = y1 * Math.sin(INCLINATION_X) + z1 * Math.cos(INCLINATION_X);

  return new THREE.Vector3(x, y, z);
}

function NucleusCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current || !glowRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.y = t * 0.2;
    const scale = 1 + Math.sin(t * 1.5) * 0.03;
    meshRef.current.scale.setScalar(scale);
    glowRef.current.scale.setScalar(scale * 1.4);
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Outer Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Nucleus Core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#14b8a6"
          emissiveIntensity={0.4}
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>
      <pointLight color="#ffffff" intensity={1.8} distance={6} />
    </group>
  );
}

function VisibleEllipseTracer({ stage }: { stage: PhilosophyStage }) {
  const lineObject = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 120;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      pts.push(getEllipsePoint3D(theta, stage.rotationZ));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(pts);
    const material = new THREE.LineBasicMaterial({
      color: stage.color,
      transparent: true,
      opacity: 0.32,
    });
    return new THREE.Line(geometry, material);
  }, [stage]);

  return <primitive object={lineObject} />;
}

function ElectronSphere({
  stage,
  index,
  isPaused,
  onHover,
  onUnhover,
}: {
  stage: PhilosophyStage;
  index: number;
  isPaused: boolean;
  onHover: (idx: number) => void;
  onUnhover: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowMeshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const angleRef = useRef<number>(stage.initialPhase);

  useFrame((_, delta) => {
    if (!groupRef.current || !meshRef.current || !materialRef.current) return;
    const clampedDelta = Math.min(delta, 0.05);

    if (!isPaused) {
      angleRef.current += clampedDelta * stage.speed;
    }

    const pos = getEllipsePoint3D(angleRef.current, stage.rotationZ);
    groupRef.current.position.copy(pos);

    // Dynamic 3D Depth Cueing: Scale & Opacity based on Z position
    // Max Z range is approx -0.95 to +0.95
    const normZ = (pos.z + 1.0) / 2.0; // 0 (far) to 1 (near)
    const clampedZ = Math.max(0, Math.min(1, normZ));

    const depthScale = 0.65 + clampedZ * 0.35; // 0.65x far to 1.0x near
    const depthOpacity = 0.6 + clampedZ * 0.4;  // 0.6 far to 1.0 near

    meshRef.current.scale.setScalar(depthScale);
    if (glowMeshRef.current) {
      glowMeshRef.current.scale.setScalar(depthScale * 1.5);
    }

    materialRef.current.opacity = depthOpacity;
    groupRef.current.renderOrder = Math.floor((pos.z + 10) * 100);

    meshRef.current.rotation.y += clampedDelta * 0.5;
  });

  return (
    <group ref={groupRef}>
      {/* Interactive Electron Mesh */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
          onHover(index);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "auto";
          onUnhover();
        }}
        onClick={(e) => {
          e.stopPropagation();
          onHover(index);
        }}
      >
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshStandardMaterial
          ref={materialRef}
          color={stage.color}
          emissive={stage.color}
          emissiveIntensity={isPaused ? 0.95 : 0.45}
          roughness={0.25}
          metalness={0.7}
          transparent
          depthTest={true}
        />
      </mesh>

      {/* Halo glow when hovered/active */}
      {isPaused && (
        <mesh ref={glowMeshRef}>
          <sphereGeometry args={[0.42, 24, 24]} />
          <meshBasicMaterial
            color={stage.color}
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      <pointLight color={stage.color} intensity={0.9} distance={2.5} />
    </group>
  );
}

function ResponsiveCameraController() {
  useFrame((state) => {
    const { width, height } = state.viewport;
    const aspect = width / height;

    // Dynamically adjust camera Z distance to enforce strict 85% container bounds margin at any screen width/aspect ratio
    const requiredDist = Math.max(7.2, 5.2 / Math.min(aspect, 1.2));
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, requiredDist, 0.1);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function Scene({
  activeStageIndex,
  onHover,
  onUnhover,
}: {
  activeStageIndex: number | null;
  onHover: (idx: number) => void;
  onUnhover: () => void;
}) {
  return (
    <>
      <ResponsiveCameraController />
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 5, 5]} intensity={0.85} />
      <directionalLight position={[-5, -5, -2]} intensity={0.25} />

      {/* Nucleus Core */}
      <NucleusCore />

      {/* 5 Visible Rotated Ellipse Tracers & Orbiting Electrons */}
      {PHILOSOPHY_STAGES.map((stage, idx) => (
        <group key={stage.id}>
          <VisibleEllipseTracer stage={stage} />
          <ElectronSphere
            stage={stage}
            index={idx}
            isPaused={activeStageIndex === idx}
            onHover={onHover}
            onUnhover={onUnhover}
          />
        </group>
      ))}
    </>
  );
}

export default function KnowledgeNetwork() {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  const [activeStageIndex, setActiveStageIndex] = useState<number | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setShouldReduceMotion(e.matches);
    mq.addEventListener("change", handler);

    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleHover = (idx: number) => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
    setActiveStageIndex(idx);
  };

  const handleUnhover = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setActiveStageIndex(null);
    }, 1000);
  };

  if (!mounted) {
    return (
      <div className="w-full h-[450px] desktop:h-[550px] flex items-center justify-center">
        <div className="w-20 h-20 rounded-full border-2 border-accent/20 animate-pulse" />
      </div>
    );
  }

  if (shouldReduceMotion || !hasWebGL) {
    return <PhilosophyOrbitFallback />;
  }

  const activeStage = activeStageIndex !== null ? PHILOSOPHY_STAGES[activeStageIndex] : null;

  return (
    <div
      className="relative w-full h-[450px] desktop:h-[550px] flex items-center justify-center overflow-visible"
      aria-label="3D React-Logo Engineering Philosophy Orbit Diagram"
    >
      <Suspense fallback={<PhilosophyOrbitFallback />}>
        <Canvas
          camera={{ position: [0, 0, 7.5], fov: 40 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
          style={{ width: "100%", height: "100%" }}
        >
          <Scene
            activeStageIndex={activeStageIndex}
            onHover={handleHover}
            onUnhover={handleUnhover}
          />
        </Canvas>
      </Suspense>

      {/* Label hint */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none">
        <span className="text-[10px] font-mono tracking-widest text-text-tertiary uppercase opacity-60">
          Atomic Orbit — Curiosity &rarr; Impact
        </span>
      </div>

      {/* Hover / Tap Tooltip Card */}
      {activeStage && (
        <div
          className={cn(
            "absolute bottom-4 left-1/2 -translate-x-1/2 max-w-[360px] w-[90%]",
            "rounded-xl glass p-4 border border-accent/20 shadow-2xl z-20",
            "animate-in fade-in slide-in-from-bottom-2 duration-200"
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            <span
              className="h-3 w-3 rounded-full shrink-0"
              style={{ backgroundColor: activeStage.color }}
            />
            <span
              className="text-mono-sm font-semibold uppercase tracking-wider"
              style={{ color: activeStage.color }}
            >
              {activeStage.label}
            </span>
          </div>
          <p className="text-body-sm text-text-secondary leading-relaxed">
            &ldquo;{activeStage.description}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
