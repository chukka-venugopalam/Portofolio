"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Stage {
  id: string;
  label: string;
  color: string;
  description: string;
  rotation: number; // degrees
}

const STAGES: Stage[] = [
  {
    id: "curiosity",
    label: "Curiosity",
    color: "#F5A623",
    description: "Every project starts with a question I can't stop thinking about.",
    rotation: 0,
  },
  {
    id: "learning",
    label: "Learning",
    color: "#4A90D9",
    description: "Learning isn't collecting tutorials—it's turning ideas into working systems.",
    rotation: 36,
  },
  {
    id: "understanding",
    label: "Understanding",
    color: "#2CB1BC",
    description: "Optimizing for deep mental models so durable knowledge compounds.",
    rotation: 72,
  },
  {
    id: "building",
    label: "Building",
    color: "#8B5CF6",
    description: "Every concept becomes a prototype. Every prototype becomes a product.",
    rotation: 108,
  },
  {
    id: "impact",
    label: "Impact",
    color: "#F0654D",
    description: "Building AI systems that help people learn, think, and make better decisions.",
    rotation: 144,
  },
];

export default function PhilosophyOrbitFallback() {
  const [activeStage, setActiveStage] = useState<Stage | null>(null);

  const cx = 200;
  const cy = 200;
  const rx = 130;
  const ry = 52;

  return (
    <div className="relative w-full h-[450px] desktop:h-[550px] flex items-center justify-center p-4">
      <svg
        viewBox="0 0 400 400"
        className="w-full max-w-[460px] h-auto overflow-visible"
        role="img"
        aria-label="Engineering Philosophy Atomic Orbit Diagram"
      >
        <defs>
          <radialGradient id="fallback-center-glow-atomic" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 5 Rotated Ellipse Tracer Rings (React-logo atomic style) */}
        {STAGES.map((stage) => (
          <ellipse
            key={`ring-${stage.id}`}
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            fill="none"
            stroke={stage.color}
            strokeWidth="1.2"
            opacity="0.35"
            transform={`rotate(${stage.rotation}, ${cx}, ${cy})`}
          />
        ))}

        {/* Nucleus Core — "Self" */}
        <g transform={`translate(${cx}, ${cy})`}>
          <circle cx="0" cy="0" r="28" fill="url(#fallback-center-glow-atomic)" />
          <circle cx="0" cy="0" r="16" fill="#ffffff" />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="#0f172a"
            fontSize="9"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            SELF
          </text>
        </g>

        {/* 5 Electron Spheres along rotated ellipses */}
        {STAGES.map((stage, i) => {
          const theta = ((i * 1.25) % (Math.PI * 2)) + Math.PI / 4;
          const x0 = rx * Math.cos(theta);
          const y0 = ry * Math.sin(theta);
          const rotRad = (stage.rotation * Math.PI) / 180;

          const sx = cx + x0 * Math.cos(rotRad) - y0 * Math.sin(rotRad);
          const sy = cy + x0 * Math.sin(rotRad) + y0 * Math.cos(rotRad);
          const isActive = activeStage?.id === stage.id;

          return (
            <g
              key={stage.id}
              className="cursor-pointer transition-transform duration-300"
              onMouseEnter={() => setActiveStage(stage)}
              onMouseLeave={() => setActiveStage(null)}
              onClick={() => setActiveStage(stage)}
              style={{
                transform: isActive ? `translate(${sx}px, ${sy}px) scale(1.25)` : `translate(${sx}px, ${sy}px)`,
                transformOrigin: "center",
              }}
            >
              {isActive && (
                <circle
                  cx="0"
                  cy="0"
                  r="20"
                  fill={stage.color}
                  opacity="0.3"
                />
              )}
              <circle
                cx="0"
                cy="0"
                r="13"
                fill={stage.color}
                stroke="#ffffff"
                strokeWidth={isActive ? "2" : "1"}
              />
              <text
                x="0"
                y="24"
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
            "absolute bottom-4 left-1/2 -translate-x-1/2 max-w-[340px] w-[90%]",
            "rounded-xl glass p-4 border border-accent/20 shadow-xl z-20",
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
