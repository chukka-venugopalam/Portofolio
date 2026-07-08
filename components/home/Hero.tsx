"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const KnowledgeNetwork = dynamic(
  () => import("@/components/home/KnowledgeNetwork"),
  { ssr: false }
);

interface HeroProps {
  name: string;
  tagline: string;
  roles: string;
  currentFocus?: string;
}

export function Hero({ name, tagline, roles, currentFocus }: HeroProps) {
  const shouldReduce = useReducedMotion();

  return (
    <div className="relative min-h-[85vh] desktop:min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient orbs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[800px] w-[800px] opacity-[0.03] dark:opacity-[0.02]">
          <div className="h-full w-full rounded-full bg-accent blur-[120px] animate-float-slow" />
        </div>
        <div className="absolute -bottom-60 -left-40 h-[600px] w-[600px] opacity-[0.02] dark:opacity-[0.015]">
          <div className="h-full w-full rounded-full bg-emerald blur-[120px] animate-float-slow" style={{ animationDelay: "-4s" }} />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] opacity-[0.015] dark:opacity-[0.01]">
          <div className="h-full w-full rounded-full bg-status-building blur-[100px]" />
        </div>
      </div>

      {/* Subtle grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: [
            "linear-gradient(var(--color-border-subtle) 1px, transparent 1px)",
            "linear-gradient(90deg, var(--color-border-subtle) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at 50% 50%, black 30%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 30%, transparent 70%)",
        }}
      />

      <div className="relative w-full flex flex-col desktop:flex-row items-center gap-12 desktop:gap-0">
        {/* ── Left: Typography ── */}
        <div className="relative z-10 w-full desktop:w-[55%] max-w-[640px] desktop:pr-8">
          {/* Greeting */}
          <motion.p
            initial={shouldReduce ? false : { opacity: 0, y: 20 }}
            animate="visible"
            whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-body-lg text-text-secondary mb-4 tracking-wide"
          >
            Hi, I&rsquo;m
          </motion.p>

          {/* Name — large dominant typography */}
          <motion.h1
            initial={shouldReduce ? false : { opacity: 0, y: 30 }}
            whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: shouldReduce ? 0 : 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "text-display-xl desktop:text-display-2xl",
              "font-semibold tracking-tight leading-[1]",
              "gradient-text"
            )}
          >
            {name}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={shouldReduce ? false : { opacity: 0, y: 20 }}
            whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: shouldReduce ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-body-xl text-text-secondary max-w-[520px] leading-relaxed"
          >
            {tagline}
          </motion.p>

          {/* Role tags */}
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, y: 20 }}
            whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: shouldReduce ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 flex flex-wrap items-center gap-2"
          >
            {roles.split(" • ").map((role) => (
              <span
                key={role}
                className={cn(
                  "inline-flex items-center rounded-md",
                  "border border-border-subtle bg-bg-tertiary/50",
                  "px-3 py-1.5",
                  "text-mono-sm text-text-tertiary",
                  "transition-colors duration-fast",
                  "hover:border-accent/30 hover:text-accent"
                )}
              >
                {role}
              </span>
            ))}
          </motion.div>

          {/* Current focus */}
          {currentFocus && (
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, y: 20 }}
              whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: shouldReduce ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 flex items-center gap-2"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-40" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
              </span>
              <span className="text-mono-sm text-text-primary font-medium">Currently:</span>
              <span className="text-body-md text-text-secondary">{currentFocus}</span>
            </motion.div>
          )}

          {/* CTAs */}
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, y: 20 }}
            whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: shouldReduce ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-col tablet:flex-row items-start tablet:items-center gap-4"
          >
            <Button
              href="/work"
              className="w-full tablet:w-auto shadow-[0_0_20px_rgba(20,184,166,0.15)]"
            >
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
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
              )}
            >
              Get the resume
            </Link>
          </motion.div>
        </div>

        {/* ── Right: Knowledge Network ── */}
        <div className="relative w-full desktop:w-[45%] desktop:absolute desktop:right-0 desktop:top-1/2 desktop:-translate-y-1/2">
          <KnowledgeNetwork />
        </div>
      </div>
    </div>
  );
}
