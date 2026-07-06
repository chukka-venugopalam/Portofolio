"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { StatusTag } from "@/components/ui/StatusTag";
import { TechTagList } from "@/components/ui/TechTag";
import { Button } from "@/components/ui/Button";
import { ProjectCover } from "@/components/project/ProjectCover";
import { cn } from "@/lib/utils";
import type { ProjectFrontmatter } from "@/content/projects/_schema";

type ProjectCardVariant = "flagship" | "grid";

interface ProjectCardProps {
  project: ProjectFrontmatter;
  variant?: ProjectCardVariant;
  className?: string;
}

export function ProjectCard({
  project,
  variant = "grid",
  className,
}: ProjectCardProps) {
  const isFlagship = variant === "flagship";
  const detailHref = `/work/${project.slug}`;
  const shouldReduce = useReducedMotion();

  return (
    <motion.article
      initial={shouldReduce ? false : { opacity: 0, y: 30 }}
      whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "group relative rounded-2xl overflow-hidden",
        "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        isFlagship
          ? cn(
              "bg-bg-secondary border border-border-default",
              "hover:border-accent/40",
              "shadow-[0_1px_3px_rgba(0,0,0,0.2)]",
              "hover:shadow-[0_8px_30px_rgba(94,234,212,0.08),0_0_0_1px_rgba(94,234,212,0.15)]",
              "hover:-translate-y-1"
            )
          : cn(
              "bg-bg-secondary border border-border-subtle",
              "hover:border-border-default",
              "shadow-[0_1px_2px_rgba(0,0,0,0.1)]",
              "hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]",
              "hover:-translate-y-0.5"
            ),
        className
      )}
    >
      {/* Featured Ribbon for Flagship */}
      {isFlagship && (
        <div className="absolute top-4 right-4 z-20">
          <span
            className={cn(
              "inline-flex items-center gap-1.5",
              "rounded-full bg-accent/10 border border-accent/25",
              "px-3 py-1.5",
              "text-mono-sm text-accent",
              "backdrop-blur-sm"
            )}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Featured
          </span>
        </div>
      )}

      {/* Cover Art with premium hover zoom */}
      {project.coverArt && (
        <Link
          href={detailHref}
          className="block relative overflow-hidden aspect-[16/9]"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105">
            <ProjectCover
              variant={project.coverArt}
              className="w-full h-full"
            />
          </div>
          {/* Gradient overlay */}
          <div className={cn(
            "absolute inset-0",
            "bg-gradient-to-t from-bg-secondary/80 via-transparent to-transparent"
          )} />
          {/* Hover accent overlay */}
          <div className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-500 ease-standard",
            "group-hover:opacity-100",
            "bg-gradient-to-t from-accent/5 to-transparent"
          )} />
        </Link>
      )}

      {/* Content */}
      <div className={cn(
        isFlagship ? "p-6 desktop:p-8" : "p-6"
      )}>
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <h3
            className={cn(
              isFlagship ? "text-heading-lg" : "text-heading-md",
              "text-text-primary font-semibold tracking-tight",
              "transition-colors duration-fast ease-standard",
              "group-hover:text-accent"
            )}
          >
            <Link
              href={detailHref}
              className={cn(
                "transition-all duration-fast ease-standard",
                "focus-visible:outline-none focus-visible:focus-ring rounded-pill"
              )}
            >
              {project.name}
            </Link>
          </h3>
          <StatusTag status={project.status} className="shrink-0" />
        </div>

        {/* One-liner */}
        <p className="mt-3 text-body-md text-text-secondary leading-relaxed line-clamp-2">
          {project.oneLiner}
        </p>

        {/* Tech tags */}
        <div className="mt-4">
          <TechTagList tags={project.techTags} />
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {/* Read Case Study — primary CTA for flagships */}
          {isFlagship && (
            <Button
              variant="primary"
              href={detailHref}
              className="h-9 desktop:h-9 px-4 text-body-sm"
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              }
            >
              Read Case Study
            </Button>
          )}
          {project.links.live && (
            <Button
              variant="secondary"
              href={project.links.live}
              external
              className="h-9 desktop:h-9 px-4 text-body-sm"
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <path d="M15 3h6v6" />
                  <path d="M10 14L21 3" />
                </svg>
              }
            >
              Live
              <span className="sr-only"> demo of {project.name}</span>
            </Button>
          )}
          {project.links.code && (
            <Button
              variant="secondary"
              href={project.links.code}
              external
              className="h-9 desktop:h-9 px-4 text-body-sm"
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              }
            >
              Code
              <span className="sr-only"> repository for {project.name}</span>
            </Button>
          )}
          {!isFlagship && (
            <Button
              variant="secondary"
              href={detailHref}
              className="h-9 desktop:h-9 px-4 text-body-sm"
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              }
            >
              Writeup
              <span className="sr-only"> for {project.name}</span>
            </Button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
