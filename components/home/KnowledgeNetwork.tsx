"use client";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface Node {
  id: string;
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  radius: number;
  group: number;
  phase: number;
}

interface Edge {
  s: number; t: number;
  active: boolean;
  next: number;
  opacity: number;
}

const GROUP_POSITIONS: [number, number, number][] = [
  [-4.5, 1.5, 0],
  [-2.0, 1.8, -1.5],
  [0, 2.0, 0],
  [2.0, 1.5, 1.5],
  [4.5, 1.0, 0],
];

const NODES_PER_GROUP = [7, 7, 6, 7, 5];

function generateNodes(): Node[] {
  const nodes: Node[] = [];
  let id = 0;
  for (let g = 0; g < 5; g++) {
    const center = GROUP_POSITIONS[g]!;
    const count = NODES_PER_GROUP[g]!;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const r = 0.6 + Math.random() * 1.0;
      nodes.push({
        id: String(id),
        x: center[0] + Math.cos(angle) * r,
        y: center[1] + (Math.random() - 0.5) * 0.8,
        z: center[2] + Math.sin(angle) * 0.6 + (Math.random() - 0.5) * 0.3,
        vx: (Math.random() - 0.5) * 0.003,
        vy: (Math.random() - 0.5) * 0.003,
        vz: (Math.random() - 0.5) * 0.003,
        radius: 0.12 + Math.random() * 0.16,
        group: g,
        phase: Math.random() * Math.PI * 2,
      });
      id++;
    }
  }
  return nodes;
}

function generateEdges(nodes: Node[]): Edge[] {
  const edges: Edge[] = [];
  const edgeSet = new Set<string>();
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i]!.group === nodes[j]!.group) {
        const dx = nodes[i]!.x - nodes[j]!.x;
        const dy = nodes[i]!.y - nodes[j]!.y;
        const dz = nodes[i]!.z - nodes[j]!.z;
        if (Math.sqrt(dx*dx + dy*dy + dz*dz) < 2.0) {
          const key = Math.min(i,j) + "-" + Math.max(i,j);
          if (!edgeSet.has(key)) {
            edgeSet.add(key);
            edges.push({ s: i, t: j, active: Math.random() > 0.3, next: 3 + Math.random() * 6, opacity: 0.15 + Math.random() * 0.25 });
          }
        }
      }
    }
  }
  for (let g = 0; g < 4; g++) {
    const ga = nodes.map((n,i)=>({n,i})).filter(x=>x.n.group===g);
    const gb = nodes.map((n,i)=>({n,i})).filter(x=>x.n.group===g+1);
    for (const a of ga) for (const b of gb) {
      const dx = a.n.x - b.n.x;
      const dy = a.n.y - b.n.y;
      const dz = a.n.z - b.n.z;
      if (Math.sqrt(dx*dx+dy*dy+dz*dz) < 4.0 && Math.random() > 0.4) {
        const key = Math.min(a.i,b.i)+"-"+Math.max(a.i,b.i);
        if (!edgeSet.has(key)) { edgeSet.add(key); edges.push({ s:a.i, t:b.i, active:Math.random()>0.2, next:4+Math.random()*8, opacity:0.08+Math.random()*0.12 }); }
      }
    }
  }
  return edges;
}

function useIsVisible() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry?.isIntersecting ?? true), { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, isVisible };
}

function CameraController({ isVisible }: { isVisible: boolean }) {
  const { camera } = useThree();
  useFrame((state) => {
    if (!isVisible) return;
    const t = state.clock.elapsedTime;
    camera.position.x += (Math.sin(t * 0.04) * 0.3 - camera.position.x) * 0.008;
    camera.position.y += (0.3 + Math.sin(t * 0.03 + 1) * 0.15 - camera.position.y) * 0.008;
    camera.position.z += (4.5 + Math.cos(t * 0.025) * 0.2 - camera.position.z) * 0.008;
    camera.lookAt(0, 0.5, 0);
  });
  return null;
}

function NodesMesh({ nodes, isVisible, shouldReduce }: { nodes: Node[]; isVisible: boolean; shouldReduce: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const glowRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!meshRef.current) return;
    const m = meshRef.current;
    nodes.forEach((node, i) => {
      dummy.position.set(node.x, node.y, node.z);
      dummy.scale.setScalar(node.radius);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [nodes, dummy]);

  useFrame((state) => {
    if (!meshRef.current || !glowRef.current || !isVisible || shouldReduce) return;
    const t = state.clock.elapsedTime;
    const m = meshRef.current;
    const g = glowRef.current;

    nodes.forEach((node, i) => {
      node.vx += (Math.sin(t * 0.1 + node.phase) - Math.sin(t * 0.05 + node.phase * 1.3)) * 0.00004;
      node.vy += (Math.cos(t * 0.08 + node.phase * 1.7) - Math.cos(t * 0.04 + node.phase)) * 0.00004;
      node.vz += (Math.sin(t * 0.06 + node.phase * 0.9) - Math.sin(t * 0.03 + node.phase * 2.1)) * 0.00002;
      node.vx *= 0.995;
      node.vy *= 0.995;
      node.vz *= 0.995;
      node.x += node.vx;
      node.y += node.vy;
      node.z += node.vz;
      if (Math.abs(node.x) > 5.0) node.vx -= 0.001 * Math.sign(node.x);
      if (Math.abs(node.y) > 3.0) node.vy -= 0.001 * Math.sign(node.y);
      if (Math.abs(node.z) > 3.0) node.vz -= 0.001 * Math.sign(node.z);
      const pulse = 1 + Math.sin(t * 0.4 + node.phase) * 0.08;
      dummy.position.set(node.x, node.y, node.z);
      dummy.scale.setScalar(node.radius * pulse);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      dummy.scale.setScalar(node.radius * pulse * 2.5);
      dummy.updateMatrix();
      g.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
    g.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={glowRef} args={[undefined, undefined, nodes.length]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial transparent opacity={0.08} color="#5eead4" depthWrite={false} blending={THREE.AdditiveBlending} />
      </instancedMesh>
      <instancedMesh ref={meshRef} args={[undefined, undefined, nodes.length]}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshPhysicalMaterial color="#5eead4" transparent opacity={0.35} roughness={0.1} metalness={0.1} clearcoat={0.6} clearcoatRoughness={0.3} envMapIntensity={0.5} depthWrite={false} />
      </instancedMesh>
    </>
  );
}

function EdgesLines({ edges, nodes, isVisible, shouldReduce }: { edges: Edge[]; nodes: Node[]; isVisible: boolean; shouldReduce: boolean }) {
  const lineRef = useRef<THREE.Group>(null);
  const edgeRefs = useRef<{ line: THREE.Line | null; nextToggle: number; opacity: number }[]>([]);

  useEffect(() => {
    if (!lineRef.current) return;
    const g = lineRef.current;
    while (g.children.length > 0) {
      const child = g.children[0];
      if (!child) break;
      if (child instanceof THREE.Line) child.geometry.dispose();
      g.remove(child);
    }
    edgeRefs.current = [];
    edges.forEach((edge) => {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
      const material = new THREE.LineBasicMaterial({ color: "#5eead4", transparent: true, opacity: edge.opacity * 0.6, depthWrite: false, blending: THREE.AdditiveBlending });
      const line = new THREE.Line(geometry, material);
      line.frustumCulled = false;
      g.add(line);
      edgeRefs.current.push({ line, nextToggle: edge.next, opacity: edge.opacity });
    });
  }, [edges]);

  useFrame((state) => {
    if (!isVisible || shouldReduce) return;
    const t = state.clock.elapsedTime;
    edges.forEach((edge, i) => {
      const ref = edgeRefs.current[i];
      if (!ref || !ref.line) return;
      const src = nodes[edge.s];
      const dst = nodes[edge.t];
      if (!src || !dst) return;
      const posAttr = ref.line.geometry.attributes.position;
      if (!posAttr) return;
      const pos = posAttr.array;
      pos[0] = src.x; pos[1] = src.y; pos[2] = src.z;
      pos[3] = dst.x; pos[4] = dst.y; pos[5] = dst.z;
      posAttr.needsUpdate = true;
      if (t > ref.nextToggle) {
        edge.active = !edge.active;
        ref.nextToggle = t + 3 + Math.random() * 6;
      }
      const mat = ref.line.material;
      const opacity = Array.isArray(mat) ? mat[0]?.opacity ?? 0 : mat.opacity;
      const newOpacity = opacity + ((edge.active ? edge.opacity * 0.6 : 0) - opacity) * 0.03;
      if (Array.isArray(mat)) {
        if (mat[0]) mat[0].opacity = newOpacity;
      } else {
        mat.opacity = newOpacity;
      }
    });
  });

  return <group ref={lineRef} />;
}

function BackgroundParticles({ count = 50, isVisible }: { count: number; isVisible: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 14;
    return pos;
  }, [count]);
  useFrame((state) => {
    if (!pointsRef.current || !isVisible) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.005;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.003) * 0.02;
  });
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#5eead4" transparent opacity={0.25} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Scene({ isVisible, shouldReduce }: { isVisible: boolean; shouldReduce: boolean }) {
  const nodes = useMemo(() => generateNodes(), []);
  const edges = useMemo(() => generateEdges(nodes), [nodes]);
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 4, 5]} intensity={0.4} />
      <directionalLight position={[-3, 1, -2]} intensity={0.15} />
      <pointLight position={[0, 3, 0]} intensity={0.1} color="#5eead4" />
      <CameraController isVisible={isVisible} />
      <NodesMesh nodes={nodes} isVisible={isVisible} shouldReduce={shouldReduce} />
      <EdgesLines edges={edges} nodes={nodes} isVisible={isVisible} shouldReduce={shouldReduce} />
      <BackgroundParticles count={50} isVisible={isVisible} />
    </>
  );
}

function NetworkLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="h-20 w-20 rounded-full border-2 border-accent/20 animate-pulse" />
    </div>
  );
}

export default function KnowledgeNetwork() {
  const { ref, isVisible } = useIsVisible();
  const [mounted, setMounted] = useState(false);
  const [shouldReduce, setShouldReduce] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldReduce(mq.matches);
    const handler = (e: MediaQueryListEvent) => setShouldReduce(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute hidden desktop:block right-0 top-1/2 -translate-y-1/2 w-[580px] h-[580px] -mr-4"
      aria-hidden="true"
    >
      {mounted ? (
        <Suspense fallback={<NetworkLoader />}>
          <Canvas
            camera={{ position: [0, 0.3, 4.5], fov: 30 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
            style={{ width: "100%", height: "100%" }}
          >
            <Suspense fallback={null}>
              <Scene isVisible={isVisible && !shouldReduce} shouldReduce={shouldReduce} />
            </Suspense>
          </Canvas>
        </Suspense>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-accent/5 to-accent/10 animate-pulse" />
        </div>
      )}
    </div>
  );
}
