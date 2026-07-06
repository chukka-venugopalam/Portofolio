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

interface HeroProps {
  name: string;
  tagline: string;
  roles: string;
  currentFocus?: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export function Hero({ name, tagline, roles, currentFocus }: HeroProps) {
  const shouldReduce = useReducedMotion();

  return (
    <div className="relative min-h-[80vh] desktop:min-h-[85vh] flex items-center">
      {/* Subtle animated background */}
      <AnimatedBackground />

      {/* Floating gradient orbs for depth */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] opacity-[0.04] dark:opacity-[0.03]">
          <div className="h-full w-full rounded-full bg-accent blur-[120px] animate-float-slow" />
        </div>
        <div className="absolute -bottom-60 -left-40 h-[500px] w-[500px] opacity-[0.03] dark:opacity-[0.02]">
          <div className="h-full w-full rounded-full bg-status-building blur-[120px] animate-float-slow" style={{ animationDelay: "-4s" }} />
        </div>
      </div>

      <div className="relative z-10 max-w-[800px]">
        {/* ── Greeting ── */}
        <motion.p
          initial={shouldReduce ? false : "hidden"}
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-body-lg text-text-secondary mb-3 tracking-wide"
        >
          Hi, I&rsquo;m
        </motion.p>

        {/* ── Name with enhanced gradient ── */}
        <motion.h1
          initial={shouldReduce ? false : "hidden"}
          animate="visible"
          variants={scaleIn}
          transition={{ duration: 0.5, delay: shouldReduce ? 0 : 0.08, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "text-display-xl tablet:text-display-lg mobile:text-[2.75rem] mobile:leading-[1.1]",
            "font-semibold tracking-tight",
            "gradient-text"
          )}
        >
          {name}
        </motion.h1>

        {/* ── Tagline ── */}
        <motion.p
          initial={shouldReduce ? false : "hidden"}
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.4, delay: shouldReduce ? 0 : 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 text-body-lg text-text-secondary max-w-[600px] leading-relaxed"
        >
          {tagline}
        </motion.p>

        {/* ── Role descriptors with premium styling ── */}
        <motion.div
          initial={shouldReduce ? false : "hidden"}
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.4, delay: shouldReduce ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 flex flex-wrap items-center gap-2"
        >
          {roles.split(" • ").map((role) => (
            <span
              key={role}
              className={cn(
                "inline-flex items-center rounded-pill",
                "border border-border-subtle bg-bg-tertiary/50",
                "px-3 py-1.5",
                "text-mono-md text-text-tertiary",
                "transition-colors duration-fast",
                "hover:border-accent/30 hover:text-accent"
              )}
            >
              {role}
            </span>
          ))}
        </motion.div>

        {/* ── Current focus ── */}
        {currentFocus && (
          <motion.div
            initial={shouldReduce ? false : "hidden"}
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.4, delay: shouldReduce ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 flex items-center gap-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-mono-md text-text-primary">Currently:</span>
            <span className="text-body-md text-text-secondary">{currentFocus}</span>
          </motion.div>
        )}

        {/* ── CTAs ── */}
        <motion.div
          initial={shouldReduce ? false : "hidden"}
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.4, delay: shouldReduce ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col tablet:flex-row items-start tablet:items-center gap-4"
        >
          <Button href="/work" className="w-full tablet:w-auto shadow-[0_0_20px_rgba(94,234,212,0.15)]">
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

      {/* Premium morphing geometry */}
      <MorphingGeometry />
    </div>
  );
}