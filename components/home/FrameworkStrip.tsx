"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface FrameworkNode {
  id: string;
  label: string;
  icon: React.ReactNode;
  example: string;
}

const CuriosityIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
);

const LearningIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const UnderstandingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const BuildingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const ImpactIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const NODES: FrameworkNode[] = [
  {
    id: "curiosity",
    label: "Curiosity",
    icon: <CuriosityIcon />,
    example: "Every flagship project started with one question I couldn't stop thinking about.",
  },
  {
    id: "learning",
    label: "Learning",
    icon: <LearningIcon />,
    example: "Learning isn't collecting tutorials—it's turning ideas into working systems.",
  },
  {
    id: "understanding",
    label: "Understanding",
    icon: <UnderstandingIcon />,
    example: "I optimize for deep understanding because durable knowledge compounds faster than memorized solutions.",
  },
  {
    id: "building",
    label: "Building",
    icon: <BuildingIcon />,
    example: "Every concept becomes a prototype. Every prototype becomes a product.",
  },
  {
    id: "impact",
    label: "Impact",
    icon: <ImpactIcon />,
    example: "Building AI systems that help people learn, think, and make better decisions.",
  },
];

export function FrameworkStrip() {
  const shouldReduce = useReducedMotion();
  const idPrefix = useId();
  const [activeId, setActiveId] = useState<string>(NODES[0]!.id);
  const nodeRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleMouseEnter = (id: string) => setActiveId(id);
  const handleMouseLeave = () => setActiveId(NODES[0]!.id);
  const handleFocus = (id: string) => setActiveId(id);
  const handleClick = (id: string) => setActiveId(id);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (index + 1) % NODES.length;
      nodeRefs.current[next]?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (index - 1 + NODES.length) % NODES.length;
      nodeRefs.current[prev]?.focus();
    }
  };

  return (
    <div onMouseLeave={handleMouseLeave} className="relative">
      {/* Thin connecting lines between milestones */}
      <div className="relative flex items-start justify-between">
        {NODES.map((node, index) => {
          const isActive = activeId === node.id;
          const isLast = index === NODES.length - 1;
          const panelId = `${idPrefix}-panel-${node.id}`;

          return (
            <div key={node.id} className="flex-1 flex flex-col items-center relative">
              {/* Connecting line (except after last node) */}
              {!isLast && (
                <div
                  aria-hidden="true"
                  className={cn(
                    "absolute top-[28px] left-[60%] right-0 h-px",
                    "transition-colors duration-slow ease-standard",
                    isActive
                      ? "bg-gradient-to-r from-accent/60 to-border-subtle"
                      : activeId
                        ? "bg-border-subtle/30"
                        : "bg-border-subtle"
                  )}
                />
              )}

              <button
                ref={(el) => { nodeRefs.current[index] = el; }}
                type="button"
                aria-expanded={isActive}
                aria-controls={panelId}
                aria-label={`${node.label}${isActive ? " — currently selected" : ""}`}
                onClick={() => handleClick(node.id)}
                onMouseEnter={() => handleMouseEnter(node.id)}
                onFocus={() => handleFocus(node.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={cn(
                  "group relative flex flex-col items-center gap-3",
                  "px-3 py-2",
                  "transition-all duration-fast ease-standard",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-xl"
                )}
              >
                {/* Icon container with glass effect */}
                <motion.div
                  aria-hidden="true"
                  animate={shouldReduce ? {} : {
                    scale: isActive ? 1.15 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={cn(
                    "relative flex h-14 w-14 items-center justify-center rounded-xl",
                    "transition-all duration-slow ease-standard",
                    isActive
                      ? "glass shadow-[0_0_24px_rgba(20,184,166,0.15)] border-accent/30 text-accent"
                      : "bg-bg-tertiary/50 border border-border-subtle text-text-tertiary group-hover:border-accent/20 group-hover:text-accent"
                  )}
                >
                  {node.icon}
                  {/* Active glow ring */}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-xl animate-ping opacity-20"
                      style={{ backgroundColor: "var(--color-accent)" }}
                    />
                  )}
                </motion.div>

                {/* Label */}
                <span
                  className={cn(
                    "text-body-sm font-medium whitespace-nowrap",
                    "transition-colors duration-fast ease-standard",
                    isActive ? "text-accent" : "text-text-secondary group-hover:text-text-primary"
                  )}
                >
                  {node.label}
                </span>

                {/* Active dot indicator */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    "transition-all duration-fast ease-standard",
                    isActive
                      ? "bg-accent shadow-[0_0_8px_rgba(20,184,166,0.5)]"
                      : "bg-border-default group-hover:bg-accent/40"
                  )}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* Quote panel with premium fade-in reveal */}
      <AnimatePresence mode="wait">
        {NODES.map((node) => {
          if (activeId !== node.id) return null;
          const panelId = `${idPrefix}-panel-${node.id}`;

          return (
            <motion.div
              key={node.id}
              id={panelId}
              role="region"
              aria-label={`${node.label}: ${node.example}`}
              initial={shouldReduce ? false : { opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduce ? undefined : { opacity: 0, y: -6, scale: 0.98 }}
              transition={{
                duration: shouldReduce ? 0 : 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="overflow-hidden"
            >
              <div
                className={cn(
                  "mt-8 rounded-xl",
                  "glass",
                  "px-6 py-5 desktop:px-8 desktop:py-6",
                  "border border-accent/10"
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/10 text-accent"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z" />
                    </svg>
                  </span>
                  <span className="text-mono-sm tracking-[0.08em] text-text-tertiary uppercase">
                    {node.label}
                  </span>
                </div>
                <motion.p
                  initial={shouldReduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: shouldReduce ? 0 : 0.3, delay: shouldReduce ? 0 : 0.08 }}
                  className="text-body-md text-text-secondary leading-relaxed"
                >
                  &ldquo;{node.example}&rdquo;
                </motion.p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>


    </div>
  );
}
