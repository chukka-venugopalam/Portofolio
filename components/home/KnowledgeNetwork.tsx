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
  label: string;
}

interface Edge {
  s: number; t: number;
  active: boolean;
  next: number;
  opacity: number;
}

const GROUP_LABELS = ["Curiosity", "Learning", "Understanding", "Building", "Impact"];
const GROUP_COLORS = ["#f59e0b", "#14b8a6", "#8b5cf6", "#3b82f6", "#34d399"];

const GROUP_POSITIONS: [number, number, number][] = [
  [-5, 1.2, 0],
  [-2.5, 1.5, -1.2],
  [0, 1.8, 0],
  [2.5, 1.5, 1.2],
  [5, 1.0, 0],
];

const NODES_PER_GROUP = [5, 5, 5, 5, 5];

function generateNodes(): Node[] {
  const nodes: Node[] = [];
  let id = 0;
  for (let g = 0; g < 5; g++) {
    const center = GROUP_POSITIONS[g]!;
    const count = NODES_PER_GROUP[g]!;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 0.5 + (i % 3) * 0.25;
      nodes.push({
        id: String(id),
        x: center[0] + Math.cos(angle) * r,
        y: center[1] + Math.sin(angle) * r * 0.6,
        z: center[2] + Math.sin(angle * 0.5) * 0.4,
        vx: (Math.random() - 0.5) * 0.001,
        vy: (Math.random() - 0.5) * 0.001,
        vz: (Math.random() - 0.5) * 0.001,
        radius: 0.15 + (i % 3) * 0.05,
        group: g,
        phase: (i / count) * Math.PI * 2,
        label: GROUP_LABELS[g]!,
      });
      id++;
    }
  }
  return nodes;
}

function generateEdges(nodes: Node[]): Edge[] {
  const edges: Edge[] = [];
  const edgeSet = new Set<string>();
  // Intra-group edges
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
            edges.push({ s: i, t: j, active: true, next: 5 + Math.random() * 5, opacity: 0.2 + Math.random() * 0.2 });
          }
        }
      }
    }
  }
  // Inter-group edges (sequential flow)
  for (let g = 0; g < 4; g++) {
    const ga = nodes.map((n,i)=>({n,i})).filter(x=>x.n.group===g);
    const gb = nodes.map((n,i)=>({n,i})).filter(x=>x.n.group===g+1);
    for (const a of ga) {
      for (const b of gb) {
        const dx = a.n.x - b.n.x;
        const dy = a.n.y - b.n.y;
        const dz = a.n.z - b.n.z;
        if (Math.sqrt(dx*dx+dy*dy+dz*dz) < 5.0) {
          const key = Math.min(a.i,b.i)+"-"+Math.max(a.i,b.i);
          if (!edgeSet.has(key)) {
            edgeSet.add(key);
            edges.push({ s: a.i, t: b.i, active: true, next: 4 + Math.random() * 4, opacity: 0.1 + Math.random() * 0.15 });
          }
        }
      }
    }
    // One strong connection per sequential pair
    if (ga.length > 0 && gb.length > 0) {
      const centerA = Math.floor(ga.length / 2);
      const centerB = Math.floor(gb.length / 2);
      const key = Math.min(ga[centerA]!.i, gb[centerB]!.i) + "-" + Math.max(ga[centerA]!.i, gb[centerB]!.i);
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push({ s: ga[centerA]!.i, t: gb[centerB]!.i, active: true, next: 2, opacity: 0.5 });
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
  useEffect(() => {
    camera.position.set(0, 0.5, 6);
    camera.lookAt(0, 0.5, 0);
  }, [camera]);
  useFrame((state) => {
    if (!isVisible) return;
    const t = state.clock.elapsedTime;
    camera.position.x += (Math.sin(t * 0.03) * 0.2 - camera.position.x) * 0.005;
    camera.position.y += (0.5 + Math.sin(t * 0.02 + 1) * 0.1 - camera.position.y) * 0.005;
    camera.position.z += (6 + Math.cos(t * 0.02) * 0.15 - camera.position.z) * 0.005;
    camera.lookAt(0, 0.5, 0);
  });
  return null;
}

function NodesMesh({ nodes, isVisible, shouldReduce }: { nodes: Node[]; isVisible: boolean; shouldReduce: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const glowRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // One color attribute per instance
  const colors = useMemo(() => {
    const c = new Float32Array(nodes.length * 3);
    nodes.forEach((node, i) => {
      const col = new THREE.Color(GROUP_COLORS[node.group]!);
      c[i*3] = col.r;
      c[i*3+1] = col.g;
      c[i*3+2] = col.b;
    });
    return c;
  }, [nodes]);

  useEffect(() => {
    if (!meshRef.current || !glowRef.current) return;
    const m = meshRef.current;
    const g = glowRef.current;
    // Add color attribute
    const geo = m.geometry;
    if (!geo.hasAttribute("instanceColor")) {
      geo.setAttribute("instanceColor", new THREE.InstancedBufferAttribute(colors, 3));
    }
    const geoG = g.geometry;
    if (!geoG.hasAttribute("instanceColor")) {
      geoG.setAttribute("instanceColor", new THREE.InstancedBufferAttribute(colors, 3));
    }

    nodes.forEach((node, i) => {
      dummy.position.set(node.x, node.y, node.z);
      dummy.scale.setScalar(node.radius);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      dummy.scale.setScalar(node.radius * 2.5);
      dummy.updateMatrix();
      g.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
    g.instanceMatrix.needsUpdate = true;
  }, [nodes, dummy, colors]);

  useFrame((state) => {
    if (!meshRef.current || !glowRef.current || !isVisible || shouldReduce) return;
    const t = state.clock.elapsedTime;
    const m = meshRef.current;
    const g = glowRef.current;

    nodes.forEach((node, i) => {
      node.vx += (Math.sin(t * 0.08 + node.phase) - Math.sin(t * 0.04 + node.phase * 1.3)) * 0.00003;
      node.vy += (Math.cos(t * 0.06 + node.phase * 1.7) - Math.cos(t * 0.03 + node.phase)) * 0.00003;
      node.vz += (Math.sin(t * 0.05 + node.phase * 0.9) - Math.sin(t * 0.02 + node.phase * 2.1)) * 0.00002;
      node.vx *= 0.995;
      node.vy *= 0.995;
      node.vz *= 0.995;
      node.x += node.vx;
      node.y += node.vy;
      node.z += node.vz;
      if (Math.abs(node.x) > 6.0) node.vx -= 0.001 * Math.sign(node.x);
      if (Math.abs(node.y) > 3.0) node.vy -= 0.001 * Math.sign(node.y);
      if (Math.abs(node.z) > 3.0) node.vz -= 0.001 * Math.sign(node.z);
      const pulse = 1 + Math.sin(t * 0.3 + node.phase) * 0.1;
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
        <sphereGeometry args={[1, 16, 16]}>
          <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
        </sphereGeometry>
        <meshBasicMaterial transparent opacity={0.12} depthWrite={false} blending={THREE.AdditiveBlending} vertexColors />
      </instancedMesh>
      <instancedMesh ref={meshRef} args={[undefined, undefined, nodes.length]}>
        <sphereGeometry args={[1, 20, 20]}>
          <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
        </sphereGeometry>
        <meshPhysicalMaterial transparent opacity={0.5} roughness={0.1} metalness={0.1} clearcoat={0.5} clearcoatRoughness={0.3} envMapIntensity={0.5} depthWrite={false} vertexColors />
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
      const src = nodes[edge.s];
      const dst = nodes[edge.t];
      if (!src || !dst) return;
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
      const srcColor = new THREE.Color(GROUP_COLORS[src.group]!);
      const dstColor = new THREE.Color(GROUP_COLORS[dst.group]!);
      const midColor = srcColor.clone().lerp(dstColor, 0.5);
      const material = new THREE.LineBasicMaterial({ color: midColor, transparent: true, opacity: edge.opacity * 0.4, depthWrite: false, blending: THREE.AdditiveBlending });
      const line = new THREE.Line(geometry, material);
      line.frustumCulled = false;
      g.add(line);
      edgeRefs.current.push({ line, nextToggle: edge.next, opacity: edge.opacity });
    });
  }, [edges, nodes]);

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
        ref.nextToggle = t + 2 + Math.random() * 4;
      }
      const mat = ref.line.material;
      const opacity = Array.isArray(mat) ? mat[0]?.opacity ?? 0 : mat.opacity;
      const target = edge.active ? edge.opacity * 0.4 : 0.02;
      const newOpacity = opacity + (target - opacity) * 0.05;
      if (Array.isArray(mat)) {
        if (mat[0]) mat[0].opacity = newOpacity;
      } else {
        mat.opacity = newOpacity;
      }
    });
  });

  return <group ref={lineRef} />;
}

function Scene({ isVisible, shouldReduce }: { isVisible: boolean; shouldReduce: boolean }) {
  const nodes = useMemo(() => generateNodes(), []);
  const edges = useMemo(() => generateEdges(nodes), [nodes]);
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={0.3} />
      <directionalLight position={[-3, 1, -2]} intensity={0.1} />
      <CameraController isVisible={isVisible} />
      <NodesMesh nodes={nodes} isVisible={isVisible} shouldReduce={shouldReduce} />
      <EdgesLines edges={edges} nodes={nodes} isVisible={isVisible} shouldReduce={shouldReduce} />
    </>
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
      className="relative w-full h-[500px] desktop:h-[600px]"
      aria-hidden="true"
    >
      {mounted ? (
        <Suspense fallback={<NetworkLoader />}>
          <Canvas
            camera={{ position: [0, 0.5, 6], fov: 40 }}
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
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent/5 to-accent/10 animate-pulse" />
        </div>
      )}

      {/* Stage labels overlay */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 pb-2 pointer-events-none">
        {["Curiosity", "Learning", "Understanding", "Building", "Impact"].map((label, i) => (
          <span
            key={label}
            className="text-[10px] font-mono font-medium tracking-wider uppercase"
            style={{ color: GROUP_COLORS[i], opacity: 0.5 }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function NetworkLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="h-16 w-16 rounded-full border-2 border-accent/20 animate-pulse" />
    </div>
  );
}
