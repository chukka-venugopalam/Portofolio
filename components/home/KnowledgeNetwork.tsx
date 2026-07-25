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
  orbitRadius: number;
  speed: number;
  inclinationX: number;
  inclinationZ: number;
  initialPhase: number;
}

const PHILOSOPHY_STAGES: PhilosophyStage[] = [
  {
    id: "curiosity",
    label: "Curiosity",
    color: "#F5A623",
    description: "Every project starts with a question I can't stop thinking about.",
    orbitRadius: 2.2,
    speed: 0.35,
    inclinationX: 0.2,
    inclinationZ: 0.1,
    initialPhase: 0,
  },
  {
    id: "learning",
    label: "Learning",
    color: "#4A90D9",
    description: "Learning isn't collecting tutorials—it's turning ideas into working systems.",
    orbitRadius: 2.9,
    speed: 0.28,
    inclinationX: -0.3,
    inclinationZ: -0.15,
    initialPhase: (Math.PI * 2) / 5,
  },
  {
    id: "understanding",
    label: "Understanding",
    color: "#2CB1BC",
    description: "Optimizing for deep mental models so durable knowledge compounds.",
    orbitRadius: 3.6,
    speed: 0.23,
    inclinationX: 0.35,
    inclinationZ: 0.25,
    initialPhase: ((Math.PI * 2) / 5) * 2,
  },
  {
    id: "building",
    label: "Building",
    color: "#8B5CF6",
    description: "Every concept becomes a prototype. Every prototype becomes a product.",
    orbitRadius: 4.3,
    speed: 0.19,
    inclinationX: -0.2,
    inclinationZ: 0.3,
    initialPhase: ((Math.PI * 2) / 5) * 3,
  },
  {
    id: "impact",
    label: "Impact",
    color: "#F0654D",
    description: "Building AI systems that help people learn, think, and make better decisions.",
    orbitRadius: 5.0,
    speed: 0.15,
    inclinationX: 0.15,
    inclinationZ: -0.2,
    initialPhase: ((Math.PI * 2) / 5) * 4,
  },
];

function CentralSphere() {
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
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Central "Self" Core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#14b8a6"
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      <pointLight color="#ffffff" intensity={1.5} distance={5} />
    </group>
  );
}

function OrbitalTrack({ stage }: { stage: PhilosophyStage }) {
  const lineObject = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 90;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * stage.orbitRadius;
      const z = Math.sin(theta) * stage.orbitRadius;

      // Apply orbital inclination matrix
      const vec = new THREE.Vector3(x, 0, z);
      vec.applyAxisAngle(new THREE.Vector3(1, 0, 0), stage.inclinationX);
      vec.applyAxisAngle(new THREE.Vector3(0, 0, 1), stage.inclinationZ);
      pts.push(vec);
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(pts);
    const material = new THREE.LineBasicMaterial({
      color: stage.color,
      transparent: true,
      opacity: 0.2,
    });
    return new THREE.Line(geometry, material);
  }, [stage]);

  return <primitive object={lineObject} />;
}

function OrbitingSphere({
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
  const angleRef = useRef<number>(stage.initialPhase);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (!isPaused) {
      angleRef.current += delta * stage.speed;
    }

    const theta = angleRef.current;
    const x = Math.cos(theta) * stage.orbitRadius;
    const z = Math.sin(theta) * stage.orbitRadius;

    const vec = new THREE.Vector3(x, 0, z);
    vec.applyAxisAngle(new THREE.Vector3(1, 0, 0), stage.inclinationX);
    vec.applyAxisAngle(new THREE.Vector3(0, 0, 1), stage.inclinationZ);

    groupRef.current.position.copy(vec);

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Interactive Mesh */}
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
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial
          color={stage.color}
          emissive={stage.color}
          emissiveIntensity={isPaused ? 0.8 : 0.4}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>

      {/* Halo glow when hovered/active */}
      {isPaused && (
        <mesh>
          <sphereGeometry args={[0.48, 24, 24]} />
          <meshBasicMaterial
            color={stage.color}
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Point Light from sphere */}
      <pointLight color={stage.color} intensity={0.8} distance={2} />
    </group>
  );
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
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, -5, -2]} intensity={0.3} />

      {/* Central "Self" Sphere */}
      <CentralSphere />

      {/* Orbital tracks & spheres */}
      {PHILOSOPHY_STAGES.map((stage, idx) => (
        <group key={stage.id}>
          <OrbitalTrack stage={stage} />
          <OrbitingSphere
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
    // Check prefers-reduced-motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setShouldReduceMotion(e.matches);
    mq.addEventListener("change", handler);

    // Test WebGL availability
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
    // 1 second delay before resuming orbit
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
      aria-label="3D Engineering Philosophy Orbit Diagram"
    >
      <Suspense fallback={<PhilosophyOrbitFallback />}>
        <Canvas
          camera={{ position: [0, 0, 8.5], fov: 42 }}
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

      {/* Central label hint */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none">
        <span className="text-[10px] font-mono tracking-widest text-text-tertiary uppercase opacity-60">
          Philosophy Orbit — Curiosity &rarr; Impact
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
