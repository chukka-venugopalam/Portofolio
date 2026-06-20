"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * TradeoffsBlock
 *
 * Per the PRD's Part 9: "the single most differentiating section" on any
 * project page — Component Library D3. A distinctly-styled container for
 * "I chose X over Y because Z" decisions, built to be findable by a
 * skimming technical reader without reading the whole page top to bottom.
 *
 * Visual treatment (Visual Design Spec 3.4/3.8 — the one deliberate
 * exception to the site's single-radius rule):
 * - bg-tertiary fill (the ONLY prose section with a background fill;
 *   every other Project Detail section sits directly on bg-primary)
 * - 4px solid accent left border
 * - Rounded only on the two RIGHT corners — the left edge stays sharp
 *   where the accent border meets it, since rounding a corner a solid
 *   border passes through looks visually awkward
 *
 * Motion (Visual Design Spec 3.6 — the one component-specific entrance
 * animation in the entire system beyond the universal section-reveal):
 * the left accent border animates from 0 to full 4px width over
 * motion-slow (400ms) as the block enters the viewport, layered ON TOP
 * OF (not replacing) the standard fade-up. This exception exists
 * because the PRD identifies this as the one section carrying the most
 * weight for the most skeptical audience — it should not be extended to
 * any other component without equally strong justification.
 *
 * Accessibility (Component Library D3):
 * - Decisions render as a real <ol>, not visually-numbered paragraphs,
 *   so screen reader users get an accurate count ("item 2 of 4") and
 *   can navigate item by item.
 * - The block's heading is a genuine heading element at the appropriate
 *   level for its position in the page outline (h2, parallel to "THE
 *   PROBLEM," "WHAT IT DOES," etc. — passed via `headingLevel` so the
 *   calling page controls this rather than this component assuming).
 */

interface Decision {
  /** A short id for the React key — not rendered. */
  id: string;
  text: string;
}

interface TradeoffsBlockProps {
  decisions: Decision[];
  headingLevel?: "h2" | "h3";
  className?: string;
}

export function TradeoffsBlock({
  decisions,
  headingLevel = "h2",
  className,
}: TradeoffsBlockProps) {
  const shouldReduce = useReducedMotion();
  const Heading = headingLevel;

  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, y: 24 }}
      whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "relative overflow-hidden bg-bg-tertiary",
        // Rounded only on the two right corners — left edge stays sharp
        // where the solid accent border meets it.
        "rounded-r-card",
        "p-6 desktop:p-8",
        className
      )}
    >
      {/* Left accent border — animates 0 → 4px width independently from
          the block's own fade-up, per Visual Design Spec 3.6. A separate
          absolutely-positioned element rather than a CSS border so its
          width can be the thing that animates without affecting layout. */}
      <motion.span
        aria-hidden="true"
        initial={shouldReduce ? false : { width: 0 }}
        whileInView={shouldReduce ? undefined : { width: 4 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-0 top-0 h-full bg-accent"
        style={shouldReduce ? { width: 4 } : undefined}
      />

      <Heading className="text-heading-lg text-text-primary">
        Decisions &amp; Tradeoffs
      </Heading>

      <ol className="mt-5 flex flex-col gap-4">
        {decisions.map((decision, index) => (
          <li key={decision.id} className="flex gap-3">
            <span
              aria-hidden="true"
              className="shrink-0 text-mono-md font-medium text-accent"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-body-md text-text-primary">
              {decision.text}
            </span>
          </li>
        ))}
      </ol>
    </motion.div>
  );
}
