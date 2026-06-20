import Link from "next/link";
import { StatusTag } from "@/components/ui/StatusTag";
import { TechTagList } from "@/components/ui/TechTag";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { ProjectFrontmatter } from "@/content/projects/_schema";

/**
 * ProjectCard
 *
 * The core proof unit of the entire site — Component Library B3. Two
 * sizes sharing one structure: visitors should recognize them as the
 * same kind of thing at different emphasis levels, never as two
 * different card designs.
 *
 * Variants (Component Library B3):
 * - "flagship": border-default, used exactly once per page (Home, Work),
 *   padding 48px desktop / 16px tablet / 24px mobile
 * - "grid": border-subtle, used for every other real project,
 *   padding 24px at every breakpoint (no special mobile bump — already
 *   the secondary-emphasis size)
 *
 * Accessibility (Component Library B3 — important, easy to get wrong):
 * NOT one giant clickable <div> with multiple overlapping links inside
 * it. The project name is a heading wrapped in a link to the detail
 * page; Live/Code/Writeup buttons are separate, individually-focusable
 * links with destination-specific accessible names. Status tags are
 * non-interactive and never wrapped in a link.
 *
 * Hover (Component Library B3 / Visual Design Spec 1.9 / 2.9):
 * - flagship border: border-default → accent
 * - grid border: border-subtle → border-default (one step only — the
 *   accent-bordered hover state is reserved exclusively for flagship)
 * No transform/scale on hover for either variant.
 */

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
        "rounded-card bg-bg-secondary",
        "transition-colors duration-fast ease-standard",
        isFlagship
          ? cn(
              "border border-border-default",
              "p-6 tablet:p-4 mobile:p-6", // 48px desktop / 16px tablet / 24px mobile
              "hover:border-accent"
            )
          : cn(
              "border border-border-subtle",
              "p-6", // 24px at every breakpoint
              "hover:border-border-default"
            ),
        className
      )}
    >
      {/* ── Header row: name (linked) + status tag ── */}
      <div className="flex items-start justify-between gap-4">
        <h3
          className={cn(
            isFlagship ? "text-heading-lg" : "text-heading-md",
            "text-text-primary"
          )}
        >
          <Link
            href={detailHref}
            className={cn(
              "transition-colors duration-fast ease-standard",
              "hover:text-accent",
              "focus-visible:outline-none focus-visible:focus-ring rounded-pill"
            )}
          >
            {project.name}
          </Link>
        </h3>
        <StatusTag status={project.status} className="shrink-0" />
      </div>

      {/* ── One-liner ── */}
      <p className="mt-3 text-body-md text-text-secondary">
        {project.oneLiner}
      </p>

      {/* ── Tech tags ── */}
      <TechTagList tags={project.techTags} className="mt-4" />

      {/* ── Link row: only real, working links — never a placeholder ── */}
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
