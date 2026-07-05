"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { AnimatedBackground } from "@/components/home/AnimatedBackground";
import { cn } from "@/lib/utils";

// Dynamically import the morphing geometry — no SSR since WebGL doesn't exist on the server.
const MorphingGeometry = dynamic(
  () => import("@/components/home/MorphingGeometry"),
  { ssr: false }
);

/**
 * Hero
 *
 * Delivers the entire value proposition within the first 5 seconds —
 * Component Library B1, enhanced with:
 *
 * 1. Identity-first copy: "Hi, I'm" greeting establishes personhood before
 *    listing credentials, making the page feel like a conversation start
 *    rather than a document header.
 *
 * 2. Animated background: subtle grid + gradient orbs + particles at <6%
 *    opacity. Never distracting, but creates the "this site is engineered"
 *    first impression that increases perceived frontend skill.
 *
 * 3. Morphing geometry: single premium 3D object that smoothly
 *    transitions between mathematical shapes. Frosted glass material
 *    with subtle wireframe edges. Reinforces the engineering brand
 *    without dominating.
 *
 * 4. Gradient name: accent-to-primary gradient on the name, drawing the
 *    eye naturally to the most important text on the page.
 *
 * 5. Premium CTAs: subtle lift + glow on hover, communicated via Button
 *    component's updated hover tokens.
 *
 * Performance:
 * - AnimatedBackground: CSS-only, GPU composited (transform/opacity)
 * - MorphingGeometry: dynamic import with ssr:false, DPR limited to 1.5
 * - All motion is transform/opacity based — no layout shifts
 *
 * Accessibility:
 * - prefers-reduced-motion respected throughout
 * - Background and 3D cube are aria-hidden / pointer-events-none
 * - CTA names are destination-specific, not generic
 */

interface HeroProps {
  /** The primary identity line (name) */
  name: string;
  /** The positioning tagline */
  tagline: string;
  /** Role descriptors */
  roles: string;
  /** Current project focus */
  currentFocus?: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function Hero({ name, tagline, roles, currentFocus }: HeroProps) {
  const shouldReduce = useReducedMotion();

  return (
    <div className="relative">
      {/* Subtle animated background — fixed, behind everything */}
      <AnimatedBackground />

      <div className="relative z-10 max-w-[760px]">
        {/* ── Greeting ── */}
        <motion.p
          initial={shouldReduce ? false : "hidden"}
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="text-body-lg text-text-secondary mb-2"
        >
          Hi, I&rsquo;m
        </motion.p>

        {/* ── Name with gradient ──
            Gradient draws the eye to the most important text on the page.
            Uses a subtle accent-to-primary gradient that works in both
            themes without being flashy. */}
        <motion.h1
          initial={shouldReduce ? false : "hidden"}
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.25, delay: shouldReduce ? 0 : 0.05, ease: [0.4, 0, 0.2, 1] }}
          className={cn(
            "text-display-xl tablet:text-display-lg mobile:text-[2.5rem] mobile:leading-[1.15]",
            "bg-gradient-to-r from-text-primary via-accent to-text-primary",
            "bg-clip-text text-transparent",
            "bg-[length:200%_100%]",
          )}
        >
          {name}
        </motion.h1>

        {/* ── Tagline ── */}
        <motion.p
          initial={shouldReduce ? false : "hidden"}
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.25, delay: shouldReduce ? 0 : 0.1, ease: [0.4, 0, 0.2, 1] }}
          className="mt-4 text-body-lg text-text-secondary max-w-[540px]"
        >
          {tagline}
        </motion.p>

        {/* ── Role descriptors ── */}
        <motion.p
          initial={shouldReduce ? false : "hidden"}
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.25, delay: shouldReduce ? 0 : 0.15, ease: [0.4, 0, 0.2, 1] }}
          className="mt-3 text-mono-md text-text-tertiary"
        >
          {roles}
        </motion.p>

        {/* ── Current focus ── */}
        {currentFocus && (
          <motion.p
            initial={shouldReduce ? false : "hidden"}
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.25, delay: shouldReduce ? 0 : 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="mt-4 text-body-md text-text-secondary"
          >
            <span className="text-mono-md text-text-primary">Currently:</span>{" "}
            {currentFocus}
          </motion.p>
        )}

        {/* ── CTAs ── */}
        <motion.div
          initial={shouldReduce ? false : "hidden"}
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.25, delay: shouldReduce ? 0 : 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="mt-8 flex flex-col tablet:flex-row items-start tablet:items-center gap-4"
        >
          <Button href="/work" className="w-full tablet:w-auto">
            View the work
          </Button>

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

      {/* Morphing geometry accent — positioned in hero's negative space, hidden on tablet/mobile */}
      <MorphingGeometry />
    </div>
  );
}