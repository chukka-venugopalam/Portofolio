"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type DemoVariant = "scheduling" | "graph" | "page-replacement";

interface MiniDemoProps {
  variant: DemoVariant;
  className?: string;
}

/**
 * MiniDemo — lightweight CSS-only animated mini demos for the
 * engineering project cards. Each variant is a simplified, looping
 * animation that gives a glimpse of the project's core visualization
 * without needing the full interactive app.
 */
export function MiniDemo({ variant, className }: MiniDemoProps) {
  return (
    <div
      className={cn(
        "w-full h-full flex items-center justify-center",
        "bg-bg-tertiary/30",
        className
      )}
      aria-hidden="true"
    >
      {variant === "scheduling" && <SchedulingDemo />}
      {variant === "graph" && <GraphDemo />}
      {variant === "page-replacement" && <PageReplacementDemo />}
    </div>
  );
}

/* ─── OS Scheduler Mini Demo — Animated Gantt Chart ─── */

const SCHEDULING_PROCESSES = [
  { id: "P1", color: "#14b8a6", duration: 40 },
  { id: "P2", color: "#8b5cf6", duration: 55 },
  { id: "P3", color: "#f59e0b", duration: 30 },
  { id: "P4", color: "#3b82f6", duration: 45 },
];

function SchedulingDemo() {
  return (
    <div className="w-full px-4 py-2">
      <div className="relative h-16">
        <div className="absolute inset-0 flex">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 border-l border-border-subtle/20 last:border-r"
            />
          ))}
        </div>

        {SCHEDULING_PROCESSES.map((proc, i) => (
          <div
            key={proc.id}
            className="absolute h-3 rounded-sm opacity-80"
            style={{
              left: `${5 + i * 8}%`,
              width: `${proc.duration / 2}%`,
              top: `${4 + i * 14}px`,
              backgroundColor: proc.color,
              animation: `scheduling-bar-${i} 3s ease-in-out infinite`,
            }}
          >
            <span className="block text-[8px] font-mono text-white/80 pl-1 leading-none mt-0.5">
              {proc.id}
            </span>
          </div>
        ))}

        <div
          className="absolute top-0 bottom-0 w-0.5 bg-accent/40"
          style={{
            left: "0%",
            animation: "scheduling-cursor 3s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes scheduling-cursor {
          0%, 100% { left: 0%; opacity: 0.3; }
          50% { left: 90%; opacity: 0.8; }
        }
        ${SCHEDULING_PROCESSES.map(
          (_, i) => `
          @keyframes scheduling-bar-${i} {
            0%, 100% { opacity: 0.3; transform: scaleX(0.8); }
            25% { opacity: 0.9; transform: scaleX(1); }
            75% { opacity: 0.9; transform: scaleX(1); }
          }
        `
        ).join("")}
      `}</style>
    </div>
  );
}

/* ─── Graph Algorithm Mini Demo — BFS/DFS Node Animation ─── */

function GraphDemo() {
  const [activeNodes, setActiveNodes] = useState<number[]>([]);

  const nodes = [
    { id: 0, x: 50, y: 20 },
    { id: 1, x: 80, y: 40 },
    { id: 2, x: 72, y: 70 },
    { id: 3, x: 28, y: 70 },
    { id: 4, x: 20, y: 40 },
    { id: 5, x: 50, y: 50 },
  ];

  const edges: [number, number][] = [
    [0, 1], [0, 4], [1, 2], [2, 3], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5],
  ];

  const traversalOrder = [0, 1, 4, 2, 5, 3];

  useEffect(() => {
    let frame: number;
    let step = 0;

    const animate = () => {
      step = (step + 1) % (traversalOrder.length * 20);
      const currentIndex = Math.floor(step / 20);
      setActiveNodes(traversalOrder.slice(0, currentIndex + 1));
      frame = requestAnimationFrame(animate);
    };

    const timeout = setTimeout(() => {
      frame = requestAnimationFrame(animate);
    }, 500);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <svg
        viewBox="0 0 100 90"
        className="w-full h-full max-w-[120px]"
        aria-hidden="true"
      >
        {edges.map((edge) => { const s = edge[0]; const t = edge[1];
          const src = nodes[s]!;
          const dst = nodes[t]!;
          const isActive =
            activeNodes.includes(s) && activeNodes.includes(t);
          return (
            <line
              key={`${s}-${t}`}
              x1={src.x}
              y1={src.y}
              x2={dst.x}
              y2={dst.y}
              stroke={isActive ? "#14b8a6" : "#2a2a30"}
              strokeWidth={isActive ? 1.5 : 0.8}
              opacity={isActive ? 0.7 : 0.3}
              className="transition-all duration-300"
            />
          );
        })}

        {nodes.map((node, i) => {
          const isActive = activeNodes.includes(i);
          return (
            <g key={node.id}>
              {isActive && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={7}
                  fill="#14b8a6"
                  opacity={0.15}
                  className="animate-ping"
                />
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r={4}
                fill={isActive ? "#14b8a6" : "#3a3a42"}
                stroke={isActive ? "#5eead4" : "none"}
                strokeWidth={1}
                className="transition-all duration-300"
              />
              <text
                x={node.x}
                y={node.y + 1.5}
                textAnchor="middle"
                fill={isActive ? "#fff" : "#6b6b76"}
                fontSize="5"
                fontWeight="500"
                fontFamily="monospace"
                className="transition-colors duration-300"
              >
                {i}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ─── Page Replacement Mini Demo — Frame Animation ─── */

function PageReplacementDemo() {
  const frames = [3, 1, 4, 2, 0];
  const [activeFrame, setActiveFrame] = useState(0);
  const [pageFault, setPageFault] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFrame((prev) => {
        const next = (prev + 1) % frames.length;
        setPageFault(next === 0);
        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-3">
      <div className="flex gap-1">
        {frames.map((page, i) => (
          <div
            key={i}
            className={cn(
              "w-6 h-7 rounded-sm border flex items-center justify-center transition-all duration-300",
              i === activeFrame
                ? "border-accent bg-accent/10 scale-110"
                : "border-border-subtle bg-bg-tertiary/50"
            )}
          >
            <span
              className={cn(
                "text-[10px] font-mono font-medium transition-colors duration-300",
                i === activeFrame ? "text-accent-light" : "text-text-tertiary"
              )}
            >
              {page}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-1">
        {frames.map((_, i) => (
          <span
            key={i}
            className={cn(
              "text-[7px] font-mono text-text-quaternary w-6 text-center",
              i === activeFrame && "text-accent"
            )}
          >
            F{i + 1}
          </span>
        ))}
      </div>

      <div
        className={cn(
          "h-1.5 w-full rounded-full transition-all duration-300",
          pageFault ? "bg-warning/40" : "bg-transparent"
        )}
      />
    </div>
  );
}
