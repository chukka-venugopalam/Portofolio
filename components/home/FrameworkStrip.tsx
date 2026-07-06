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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
);

const LearningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const UnderstandingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const BuildingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const ImpactIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
  const [activeId, setActiveId] = useState<string | null>(null);
  const nodeRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleMouseEnter = (id: string) => setActiveId(id);
  const handleMouseLeave = () => setActiveId(null);
  const handleFocus = (id: string) => setActiveId(id);
  const handleClick = (id: string) => setActiveId((current) => (current === id ? null : id));

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
      {/* Timeline line — visible in both modes */}
      <div
        aria-hidden="true"
        className={cn(
          "hidden desktop:block absolute left-[31px] right-[31px] top-[18px] h-[2px]",
          "bg-gradient-to-r from-border-subtle via-accent/30 to-border-subtle"
        )}
      />

      {/* Nodes row */}
      <div
        className={cn(
          "flex items-start gap-0",
          "overflow-x-auto desktop:overflow-visible",
          "scrollbar-none",
          "-mx-5 px-5 tablet:mx-0 tablet:px-0"
        )}
      >
        {NODES.map((node, index) => {
          const isActive = activeId === node.id;
          const isLast = index === NODES.length - 1;
          const panelId = `${idPrefix}-panel-${node.id}`;

          return (
            <div key={node.id} className="flex shrink-0 items-start desktop:flex-1">
              <div className="flex flex-col items-start">
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
                    "group relative flex w-28 tablet:w-auto shrink-0 flex-col items-center gap-3 rounded-card",
                    "px-4 py-4 -mx-2 -my-3",
                    "text-center",
                    "transition-all duration-fast ease-standard",
                    "focus-visible:outline-none focus-visible:focus-ring"
                  )}
                >
                  {/* Icon container with glow */}
                  <motion.div
                    aria-hidden="true"
                    animate={shouldReduce ? {} : {
                      scale: isActive ? 1.1 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className={cn(
                      "relative flex h-10 w-10 items-center justify-center rounded-full",
                      "transition-all duration-fast ease-standard",
                      isActive
                        ? "bg-accent/15 text-accent shadow-[0_0_16px_rgba(94,234,212,0.2)]"
                        : "bg-bg-tertiary text-text-tertiary group-hover:text-accent group-hover:bg-accent/8"
                    )}
                  >
                    {node.icon}
                    {/* Glow ring */}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full animate-ping opacity-20"
                        style={{ backgroundColor: "var(--color-accent)" }}
                      />
                    )}
                  </motion.div>

                  {/* Label */}
                  <span
                    className={cn(
                      "text-body-sm font-medium",
                      "transition-colors duration-fast ease-standard",
                      isActive ? "text-accent" : "text-text-primary"
                    )}
                  >
                    {node.label}
                  </span>

                  {/* Active indicator dot on timeline */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "hidden desktop:block absolute -bottom-2 left-1/2 -translate-x-1/2",
                      "h-2 w-2 rounded-full",
                      "transition-all duration-fast ease-standard",
                      isActive
                        ? "bg-accent shadow-[0_0_6px_rgba(94,234,212,0.5)]"
                        : "bg-border-default group-hover:bg-accent/50"
                    )}
                  />
                </button>
              </div>

              {/* Connecting line between nodes (visible on desktop) */}
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "hidden desktop:block h-[2px] flex-1 self-center mx-1 rounded-full",
                    "transition-all duration-fast ease-standard",
                    isActive
                      ? "bg-accent/40"
                      : "bg-border-subtle"
                  )}
                  style={{ marginTop: "20px" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Quote panel with premium reveal */}
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
              initial={shouldReduce ? false : { opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduce ? undefined : { opacity: 0, y: -6, scale: 0.97 }}
              transition={{
                duration: shouldReduce ? 0 : 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="overflow-hidden"
            >
              <div
                className={cn(
                  "mt-6 rounded-card",
                  "glass",
                  "px-6 py-5 desktop:px-8 desktop:py-6",
                  "transition-shadow duration-fast ease-standard"
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-accent"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z" />
                    </svg>
                  </span>
                  <span className="text-mono-sm tracking-[0.08em] text-text-tertiary uppercase">
                    {node.label}
                  </span>
                </div>
                <p className="text-body-md text-text-secondary leading-relaxed">
                  &ldquo;{node.example}&rdquo;
                </p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Inactive state — subtle hint */}
      {activeId === null && (
        <motion.p
          initial={shouldReduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-6 text-body-sm text-text-tertiary text-center desktop:text-left"
        >
          Hover or tap a step to learn more
        </motion.p>
      )}
    </div>
  );
}
