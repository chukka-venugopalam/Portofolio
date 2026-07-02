"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Section
 *
 * Wraps each major content block with the correct vertical padding from
 * the Visual Design Spec's section-rhythm rules (Section 0.4 + 1.5):
 *
 *   "home"      — space-9 (128px) vertical padding, for homepage sections
 *   "secondary" — space-8 (96px), for secondary page sections
 *   "tight"     — space-7 (64px), for subsections
 *   "none"      — no padding
 *
 * Scroll reveal: each section animates in when it enters the viewport
 * via motion's whileInView. Duration 500ms (the middle of the 400-700ms
 * spec range). Respects prefers-reduced-motion.
 *
 * Performance:
 * - whileInView uses IntersectionObserver (no scroll event listeners)
 * - Animates opacity + y only — no layout shifts
 * - GPU accelerated via CSS transforms
 */

type SectionSpacing = "home" | "secondary" | "tight" | "none";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: SectionSpacing;
  as?: React.ElementType;
  id?: string;
}

const spacingClasses: Record<SectionSpacing, string> = {
  home: "py-space-9 tablet:py-20 mobile:py-16",
  secondary: "py-space-8 tablet:py-16 mobile:py-12",
  tight: "py-space-7 tablet:py-10 mobile:py-8",
  none: "",
};

export function Section({
  children,
  className,
  spacing = "secondary",
  as: Tag = "section",
  id,
}: SectionProps) {
  const shouldReduce = useReducedMotion();
  const MotionTag = motion.create(Tag);

  return (
    <MotionTag
      id={id}
      initial={shouldReduce ? false : { opacity: 0, y: 24 }}
      whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: shouldReduce ? 0 : 0.5,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={cn(spacingClasses[spacing], className)}
    >
      {children}
    </MotionTag>
  );
}
