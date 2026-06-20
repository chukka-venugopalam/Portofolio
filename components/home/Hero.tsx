"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { SITE_TAGLINE } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Hero
 *
 * Delivers the entire value proposition within the 5-20 second window
 * the PRD identifies as make-or-break for a time-pressured recruiter —
 * Component Library B1. Single instance, Home page only — there is
 * deliberately no secondary-page "mini-hero" variant in this system.
 *
 * Accessibility (Component Library B1):
 * - The headline is the page's ONE true <h1>.
 * - The "Currently:" focus line is supplementary, not grammatically
 *   load-bearing — the sub-line stands on its own if currentFocus is
 *   ever omitted in a content update.
 * - Both CTAs use destination-describing accessible names ("View the
 *   work", "Get the resume"), not generic "click here" text.
 *
 * Responsive (Component Library B1 — a structural change, not just
 * resizing): on mobile, only the primary CTA renders as a full-width
 * filled button. The secondary CTA loses its button chrome entirely and
 * renders as a plain text link beneath it — implemented here by
 * literally not rendering <Button variant="secondary"> on mobile, per
 * Button.tsx's own documented stance that it has no "looks like a link"
 * mode, so this exception can't accidentally leak into other secondary
 * buttons across the site.
 *
 * Motion (Component Library B1 / Visual Design Spec 1.6): headline →
 * sub-line → CTAs fade up 16px over motion-base (250ms), staggered 80ms
 * apart, completing in well under 500ms total — fast enough that a
 * returning visitor never feels like they're waiting through a "show."
 */

interface HeroProps {
  headline: string;
  /** e.g. "Student & builder — AI/ML, full-stack, cloud." */
  subline: string;
  /** e.g. "building a real-time data pipeline observatory" — supplementary only. */
  currentFocus?: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function Hero({ headline, subline, currentFocus }: HeroProps) {
  const shouldReduce = useReducedMotion();

  return (
    <div className="max-w-[760px]">
      <motion.h1
        initial={shouldReduce ? false : "hidden"}
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "text-display-xl text-text-primary",
          // Responsive scale per Visual Design Spec 1.7: 72px desktop →
          // ~56px tablet → ~40px mobile
          "tablet:text-display-lg",
          "mobile:text-[2.5rem] mobile:leading-[1.15]"
        )}
      >
        {headline}
      </motion.h1>

      <motion.div
        initial={shouldReduce ? false : "hidden"}
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.25, delay: shouldReduce ? 0 : 0.08, ease: [0.4, 0, 0.2, 1] }}
        className="mt-3 max-w-[540px]"
      >
        <p className="text-body-lg text-text-secondary">{subline}</p>
        {currentFocus && (
          <p className="mt-2 text-body-md text-text-secondary">
            <span className="text-mono-md text-text-primary">Currently:</span>{" "}
            {currentFocus}
          </p>
        )}
      </motion.div>

      <motion.div
        initial={shouldReduce ? false : "hidden"}
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.25, delay: shouldReduce ? 0 : 0.16, ease: [0.4, 0, 0.2, 1] }}
        className="mt-8 flex flex-col tablet:flex-row items-start tablet:items-center gap-4"
      >
        <Button href="/work" className="w-full tablet:w-auto">
          View the work
        </Button>

        {/* Desktop/tablet: full secondary button. Mobile: text link only —
            structural change per Component Library B1, not handled by a
            Button prop, since Button has no "looks like a link" mode. */}
        <Button
          variant="secondary"
          href="/resume"
          className="hidden tablet:inline-flex"
        >
          Get the resume
        </Button>
        <Link
          href="/resume"
          className={cn(
            "tablet:hidden",
            "text-body-md text-text-secondary underline underline-offset-4",
            "hover:text-text-primary transition-colors duration-fast ease-standard",
            "focus-visible:outline-none focus-visible:focus-ring rounded-pill"
          )}
        >
          Get the resume
        </Link>
      </motion.div>
    </div>
  );
}
