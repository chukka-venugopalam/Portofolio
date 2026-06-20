"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * FrameworkStrip
 *
 * Visualizes the Curiosity → Learning → Understanding → Building →
 * Impact narrative spine as a literal, explorable sequence — Component
 * Library B2. The component doing the most work to make the site's core
 * positioning legible at a glance.
 *
 * States: only one node expanded at a time; expanding a new node
 * collapses whichever was previously open (Component Library B2).
 *
 * Accessibility (Component Library B2):
 * - Each node is a real <button>, aria-expanded reflects panel state,
 *   aria-controls points at the panel's id.
 * - Arrow-key navigation between nodes, in addition to tab order.
 * - Connecting lines are aria-hidden — purely decorative.
 *
 * Responsive (Component Library B2):
 * - Desktop: five nodes, static row, connecting lines between them.
 * - Tablet: same row, horizontally scrollable, soft right-edge fade
 *   hints more content off-screen.
 * - Mobile: nodes shrink to ~96px swipeable pills, same scroll affordance,
 *   tap (not hover) triggers expansion — hover doesn't exist meaningfully
 *   on touch.
 *
 * Motion (Component Library B2 / Visual Design Spec 1.6): panel height
 * animates 0 → auto (capped 80px) over motion-slow (400ms) — the one
 * component on Home given a slower duration than the rest of the page,
 * since it's the component most directly tied to "explore." No motion
 * happens automatically — every transition is the direct result of a
 * hover or tap, never ambient/auto-advancing.
 */

interface FrameworkNode {
  /** e.g. "curiosity" */
  id: string;
  label: string;
  /** One real, specific example line shown when expanded. */
  example: string;
}

const NODES: FrameworkNode[] = [
  {
    id: "curiosity",
    label: "Curiosity",
    example: "Noticed most dashboards explain what happened, never why.",
  },
  {
    id: "learning",
    label: "Learning",
    example: "Spent two weeks deep in time-series anomaly detection papers.",
  },
  {
    id: "understanding",
    label: "Understanding",
    example: "Realized the real bottleneck was data freshness, not the model.",
  },
  {
    id: "building",
    label: "Building",
    example: "Shipped a pipeline observatory that flags drift in real time.",
  },
  {
    id: "impact",
    label: "Impact",
    example: "Three people on the team now catch issues before users do.",
  },
];

export function FrameworkStrip() {
  const shouldReduce = useReducedMotion();
  const idPrefix = useId();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const nodeRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const toggleNode = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

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
    <div>
      {/* ── Scrollable row container ──
          Desktop: static (no overflow needed, but scroll classes are
          harmless no-ops when content fits). Tablet/mobile: horizontally
          scrollable with a soft right-edge fade hinting more content. */}
      <div className="relative">
        <div
          className={cn(
            "flex items-start gap-0",
            "overflow-x-auto desktop:overflow-visible",
            "scrollbar-none", // relies on global scrollbar-hiding utility if added; harmless if not
            "-mx-5 px-5 tablet:mx-0 tablet:px-0" // bleed to viewport edge on mobile for natural swipe feel
          )}
        >
          {NODES.map((node, index) => {
            const isExpanded = expandedId === node.id;
            const isLast = index === NODES.length - 1;
            const panelId = `${idPrefix}-panel-${node.id}`;

            return (
              <div
                key={node.id}
                className="flex shrink-0 items-start desktop:flex-1"
              >
                <div className="flex flex-col items-start">
                  <button
                    ref={(el) => {
                      nodeRefs.current[index] = el;
                    }}
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    onClick={() => toggleNode(node.id)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={cn(
                      "group flex w-24 tablet:w-auto shrink-0 flex-col items-start gap-2 rounded-card",
                      "px-3 py-2.5 -mx-3 -my-2.5", // expand hit area without affecting layout spacing
                      "text-left",
                      "transition-colors duration-fast ease-standard",
                      "hover:bg-accent/8",
                      isExpanded && "bg-accent/8",
                      "focus-visible:outline-none focus-visible:focus-ring"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-2 w-2 rounded-full border-2",
                        isExpanded
                          ? "border-accent bg-accent"
                          : "border-border-default bg-bg-tertiary group-hover:border-accent"
                      )}
                    />
                    <span
                      className={cn(
                        "text-body-md font-medium",
                        isExpanded ? "text-accent" : "text-text-primary"
                      )}
                    >
                      {node.label}
                    </span>
                  </button>
                </div>

                {/* Connecting line — purely decorative, hidden from a11y tree */}
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="hidden desktop:block h-px flex-1 self-center bg-border-subtle mx-2"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Soft right-edge fade — tablet/mobile scroll affordance */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute right-0 top-0 h-full w-12",
            "bg-gradient-to-r from-transparent to-bg-primary",
            "desktop:hidden"
          )}
        />
      </div>

      {/* ── Expansion panels ──
          Rendered once per node, height-animated open/closed. Capped at
          80px per spec. AnimatePresence handles the collapse-then-expand
          sequence when switching between nodes. */}
      <AnimatePresence initial={false}>
        {NODES.map((node) => {
          if (expandedId !== node.id) return null;
          const panelId = `${idPrefix}-panel-${node.id}`;

          return (
            <motion.div
              key={node.id}
              id={panelId}
              role="region"
              aria-label={`${node.label} example`}
              initial={shouldReduce ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={shouldReduce ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-4 max-h-20 rounded-card border border-border-subtle bg-bg-secondary px-4 py-3">
                <p className="text-body-sm text-text-secondary">
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
