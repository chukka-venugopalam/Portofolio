"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Stage {
  id: string;
  label: string;
  color: string;
  description: string;
}

const STAGES: Stage[] = [
  {
    id: "curiosity",
    label: "Curiosity",
    color: "#F5A623",
    description: "Every project starts with a question I can't stop thinking about.",
  },
  {
    id: "learning",
    label: "Learning",
    color: "#4A90D9",
    description: "Learning isn't collecting tutorials—it's turning ideas into working systems.",
  },
  {
    id: "understanding",
    label: "Understanding",
    color: "#2CB1BC",
    description: "Optimizing for deep mental models so durable knowledge compounds.",
  },
  {
    id: "building",
    label: "Building",
    color: "#8B5CF6",
    description: "Every concept becomes a prototype. Every prototype becomes a product.",
  },
  {
    id: "impact",
    label: "Impact",
    color: "#F0654D",
    description: "Building AI systems that help people learn, think, and make better decisions.",
  },
];

export default function PhilosophyOrbitFallback() {
  const [activeStage, setActiveStage] = useState<Stage | null>(null);

  // Position 5 spheres around center at radius ~130px in a static SVG
  const cx = 200;
  const cy = 200;
  const r = 130;

  return (
    <div className="relative w-full h-[450px] desktop:h-[550px] flex items-center justify-center">
      <svg
        viewBox="0 0 400 400"
        className="w-full max-w-[500px] h-auto overflow-visible"
        role="img"
        aria-label="Engineering Philosophy Orbit Diagram"
      >
        <defs>
          <radialGradient id="fallback-center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#14b8a6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Orbit Ring */}
        <ellipse
          cx={cx}
          cy={cy}
          rx={r}
          ry={r * 0.55}
          fill="none"
          stroke="var(--color-border-subtle)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          opacity="0.5"
        />

        {/* Center Sphere — "Self" */}
        <g transform={`translate(${cx}, ${cy})`}>
          <circle cx="0" cy="0" r="32" fill="url(#fallback-center-glow)" />
          <circle cx="0" cy="0" r="18" fill="#ffffff" />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="#0f172a"
            fontSize="10"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            SELF
          </text>
        </g>

        {/* 5 Orbiting Spheres */}
        {STAGES.map((stage, i) => {
          const angle = (i / STAGES.length) * Math.PI * 2 - Math.PI / 2;
          const sx = cx + Math.cos(angle) * r;
          const sy = cy + Math.sin(angle) * r * 0.55;
          const isActive = activeStage?.id === stage.id;

          return (
            <g
              key={stage.id}
              className="cursor-pointer transition-transform duration-300"
              onMouseEnter={() => setActiveStage(stage)}
              onMouseLeave={() => setActiveStage(null)}
              onClick={() => setActiveStage(stage)}
              style={{
                transform: isActive ? `translate(${sx}px, ${sy}px) scale(1.2)` : `translate(${sx}px, ${sy}px)`,
                transformOrigin: "center",
              }}
            >
              {/* Outer glow ring when active */}
              {isActive && (
                <circle
                  cx="0"
                  cy="0"
                  r="22"
                  fill={stage.color}
                  opacity="0.25"
                />
              )}
              {/* Main Sphere */}
              <circle
                cx="0"
                cy="0"
                r="14"
                fill={stage.color}
                stroke="#ffffff"
                strokeWidth={isActive ? "2" : "1"}
              />
              {/* Label */}
              <text
                x="0"
                y="26"
                textAnchor="middle"
                fill={stage.color}
                fontSize="11"
                fontWeight="600"
                fontFamily="sans-serif"
              >
                {stage.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Description Card Overlay */}
      {activeStage && (
        <div
          className={cn(
            "absolute bottom-6 left-1/2 -translate-x-1/2 max-w-[340px] w-[90%]",
            "rounded-xl glass p-4 border border-accent/20 shadow-xl",
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
