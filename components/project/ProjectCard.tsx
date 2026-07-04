import Link from "next/link";
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

  return (
    <article
      className={cn(
        "group relative rounded-card bg-bg-secondary overflow-hidden",
        "transition-all duration-base ease-standard",
        "hover:-translate-y-1",
        isFlagship
          ? cn(
              "border border-border-default",
              "hover:border-accent",
              "hover:shadow-[0_12px_32px_rgba(94,234,212,0.1)]"
            )
          : cn(
              "border border-border-subtle",
              "hover:border-border-default",
              "hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
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
              "rounded-pill bg-accent/10 border border-accent/30",
              "px-2.5 py-1",
              "text-mono-sm text-accent"
            )}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Featured
          </span>
        </div>
      )}

      {/* Cover Art */}
      {project.coverArt && (
        <Link
          href={detailHref}
          className="block relative overflow-hidden aspect-[16/10]"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="absolute inset-0 transition-transform duration-700 ease-standard group-hover:scale-105">
            <ProjectCover
              variant={project.coverArt}
              className="w-full h-full"
            />
          </div>
          {/* Hover gradient overlay */}
          <div className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-base ease-standard",
            "group-hover:opacity-100",
            "bg-gradient-to-t from-accent/5 to-transparent"
          )} />
        </Link>
      )}

      {/* Content */}
      <div className={cn(
        isFlagship ? "p-6 tablet:p-4 mobile:p-6" : "p-6",
        project.coverArt ? "" : ""
      )}>
        {/* Header row: name (linked) + status tag */}
        <div className="flex items-start justify-between gap-4">
          <h3
            className={cn(
              isFlagship ? "text-heading-lg" : "text-heading-md",
              "text-text-primary",
              "transition-colors duration-fast ease-standard",
              "group-hover:text-accent"
            )}
          >
            <Link
              href={detailHref}
              className={cn(
                "transition-all duration-fast ease-standard",
                "group-hover:translate-x-0.5",
                "focus-visible:outline-none focus-visible:focus-ring rounded-pill"
              )}
            >
              {project.name}
            </Link>
          </h3>
          <StatusTag status={project.status} className="shrink-0" />
        </div>

        {/* One-liner */}
        <p className="mt-3 text-body-md text-text-secondary">
          {project.oneLiner}
        </p>

        {/* Tech tags */}
        <div className="transition-all duration-base ease-standard opacity-100 group-hover:opacity-100">
          <TechTagList tags={project.techTags} className="mt-4" />
        </div>

        {/* Link row */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {project.links.live && (
            <Button
              variant="primary"
              href={project.links.live}
              external
              className="h-9 desktop:h-9 px-4 text-body-sm"
            >
              Live
              <span className="sr-only"> demo of {project.name}</span>
              <ArrowIcon />
            </Button>
          )}
          {project.links.code && (
            <Button
              variant="secondary"
              href={project.links.code}
              external
              className="h-9 desktop:h-9 px-4 text-body-sm"
            >
              Code
              <span className="sr-only"> repository for {project.name}</span>
              <ArrowIcon />
            </Button>
          )}
          <Button
            variant="secondary"
            href={detailHref}
            className="h-9 desktop:h-9 px-4 text-body-sm"
          >
            Writeup
            <span className="sr-only"> for {project.name}</span>
            <ArrowIcon />
          </Button>
        </div>
      </div>
    </article>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
