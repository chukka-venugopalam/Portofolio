"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface FrameworkNode {
  id: string;
  label: string;
  example: string;
}

const NODES: FrameworkNode[] = [
  {
    id: "curiosity",
    label: "Curiosity",
    example: "Every flagship project started with one question I couldn't stop thinking about.",
  },
  {
    id: "learning",
    label: "Learning",
    example: "Learning isn't collecting tutorials—it's turning ideas into working systems.",
  },
  {
    id: "understanding",
    label: "Understanding",
    example: "I optimize for deep understanding because durable knowledge compounds faster than memorized solutions.",
  },
  {
    id: "building",
    label: "Building",
    example: "Every concept becomes a prototype. Every prototype becomes a product.",
  },
  {
    id: "impact",
    label: "Impact",
    example: "Building AI systems that help people learn, think, and make better decisions.",
  },
];

export function FrameworkStrip() {
  const shouldReduce = useReducedMotion();
  const idPrefix = useId();
  const [activeId, setActiveId] = useState<string | null>(null);
  const nodeRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const stripRef = useRef<HTMLDivElement | null>(null);

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
    <div ref={stripRef} onMouseLeave={handleMouseLeave}>
      <div className="relative">
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
            const prevActive = index > 0 && activeId === NODES[index - 1]?.id;

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
                      "group flex w-24 tablet:w-auto shrink-0 flex-col items-start gap-2 rounded-card",
                      "px-3 py-3 -mx-3 -my-3",
                      "text-left",
                      "transition-all duration-fast ease-standard",
                      "hover:bg-accent/8",
                      isActive && "bg-accent/8",
                      "focus-visible:outline-none focus-visible:focus-ring"
                    )}
                  >
                    <motion.span
                      aria-hidden="true"
                      animate={shouldReduce ? {} : { scale: isActive ? 1.35 : 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20, duration: 0.2 }}
                      className={cn(
                        "h-2.5 w-2.5 rounded-full border-2",
                        "transition-colors duration-fast ease-standard",
                        isActive
                          ? "border-accent bg-accent shadow-[0_0_8px_rgba(94,234,212,0.35)]"
                          : "border-border-default bg-bg-tertiary group-hover:border-accent group-hover:bg-accent/20"
                      )}
                    />
                    <span
                      className={cn(
                        "text-body-md font-medium",
                        "transition-colors duration-fast ease-standard",
                        isActive ? "text-accent" : "text-text-primary"
                      )}
                    >
                      {node.label}
                    </span>
                  </button>
                </div>

                {!isLast && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "hidden desktop:block h-[2px] flex-1 self-center mx-2 rounded-full",
                      "transition-all duration-fast ease-standard",
                      isActive || prevActive
                        ? "bg-accent opacity-50"
                        : "bg-border-default dark:opacity-60 opacity-40"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute right-0 top-0 h-full w-12",
            "bg-gradient-to-r from-transparent to-bg-primary",
            "desktop:hidden"
          )}
        />
      </div>

      {/* Quote panel with enhanced reveal: fade + upward motion + subtle glow */}
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
              initial={shouldReduce ? false : { opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduce ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
              transition={{
                duration: shouldReduce ? 0 : 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="overflow-hidden"
            >
              <div
                className={cn(
                  "mt-4 rounded-card",
                  "border border-border-subtle",
                  "bg-bg-secondary",
                  "px-5 py-4",
                  "transition-shadow duration-fast ease-standard",
                  "shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.08)]"
                )}
              >
                <span className="text-mono-sm tracking-[0.08em] text-text-tertiary uppercase">
                  {node.label}
                </span>
                <p className="mt-1.5 text-body-md text-text-secondary leading-relaxed">
                  {node.example}
                </p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
