"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { StatusTag } from "@/components/ui/StatusTag";
import { TechTagList } from "@/components/ui/TechTag";
import { ProjectActionButtons } from "@/components/project/ProjectActionButtons";
import { ProjectCover } from "@/components/project/ProjectCover";
import { cn } from "@/lib/utils";
import type { ProjectFrontmatter } from "@/content/projects/_schema";

interface ProjectCardProps {
  project: ProjectFrontmatter;
  variant?: string;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const detailHref = `/work/${project.slug}`;
  const shouldReduce = useReducedMotion();

  const hasCodeLink = Boolean(project.links?.code);
  const hasLiveLink = Boolean(project.links?.live);
  const codeUrl = project.links?.code;
  const liveUrl = project.links?.live;

  return (
    <motion.article
      initial={shouldReduce ? false : { opacity: 0, y: 20 }}
      whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative overflow-hidden flex flex-col justify-between h-full",
        "rounded-2xl border border-border-subtle bg-bg-card/90 glass",
        "transition-all duration-medium ease-standard",
        "hover:border-accent/30 hover:shadow-[0_8px_32px_rgba(20,184,166,0.12)]",
        className
      )}
    >
      <div>
        {/* 1. Thumbnail image frame (16:9 fixed aspect ratio) */}
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-bg-tertiary border-b border-border-subtle">
          {project.thumbnail ? (
            <Image
              src={project.thumbnail}
              alt={project.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : project.coverArt ? (
            <div className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-105">
              <ProjectCover variant={project.coverArt} className="w-full h-full" />
            </div>
          ) : (
            // Stylized procedural fallback thumbnail frame
            <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-bg-tertiary via-bg-secondary to-bg-tertiary p-6 overflow-hidden">
              <div className="absolute inset-0 bg-accent/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="text-center z-10">
                <span className="text-mono-xs uppercase tracking-widest text-accent/70 font-semibold block mb-1">
                  {project.category}
                </span>
                <span className="text-heading-md font-bold text-text-primary group-hover:text-accent transition-colors">
                  {project.name}
                </span>
              </div>
            </div>
          )}

          <div className="absolute top-3 right-3 z-10">
            <StatusTag status={project.status} />
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 desktop:p-6 flex flex-col flex-1">
          {/* 2. Project Title */}
          <h3 className="text-heading-md desktop:text-heading-lg font-bold text-text-primary tracking-tight group-hover:text-accent transition-colors">
            <Link
              href={detailHref}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
            >
              {project.name}
            </Link>
          </h3>

          {/* 3. One-line description (truncated with ellipsis) */}
          <p className="mt-2 text-body-sm text-text-secondary line-clamp-1 truncate" title={project.oneLiner}>
            {project.oneLiner}
          </p>

          {/* Tech tags */}
          <div className="mt-4">
            <TechTagList tags={project.techTags.slice(0, 4)} />
          </div>
        </div>
      </div>

      {/* 4. Action buttons row */}
      <div className="p-5 desktop:p-6 pt-0 mt-auto">
        <div className="pt-4 border-t border-border-subtle/60">
          <ProjectActionButtons project={project} variant="card" />
        </div>
      </div>
    </motion.article>
  );
}
