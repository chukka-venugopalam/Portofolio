import { StatusTag } from "@/components/ui/StatusTag";
import { TechTagList } from "@/components/ui/TechTag";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { ProjectFrontmatter } from "@/content/projects/_schema";

/**
 * ProjectHeader
 *
 * The fixed opening block of every Project Detail page — Component
 * Library D2. Name, status, one-liner, tech tags, and live links, all
 * visible before any prose begins. Per the PRD's Part 9, this is what
 * lets a visitor judge in seconds whether a project is real and worth
 * reading further.
 *
 * Single variant (Component Library D2) — every project page uses
 * identical header structure, so a visitor who's read one project page
 * already knows how to scan any other.
 *
 * Handles missing links gracefully: only renders a Live/Code button if
 * that link actually exists on the project (never a placeholder/disabled
 * button — per the PRD's Part 9, "never a placeholder link or a
 * 'coming soon' button, which undercuts trust faster than simply
 * omitting the link").
 *
 * Accessibility (Component Library D2):
 * - Project name is the page's <h1> (rendered here, passed level="h1"
 *   explicitly rather than assumed, since this is the only place on the
 *   site a heading level is this load-bearing).
 * - Status tag follows the name immediately in DOM order, even though
 *   it's visually positioned top-right, so a screen reader user
 *   encounters "Project Name, [status]" as a natural reading sequence.
 * - Link buttons use destination-specific accessible names ("View live
 *   demo of [Project Name]"), not bare "Live"/"Code" — generic link
 *   text is harder to distinguish out of context on a page with
 *   multiple links.
 *
 * Responsive (Component Library D2): desktop allows name + status tag
 * on the same line; tablet/mobile stacks status directly beside/below
 * the name rather than far-right, since a right-aligned tag at narrower
 * widths either crowds the name or forces truncation.
 */

interface ProjectHeaderProps {
  project: ProjectFrontmatter;
  className?: string;
}

export function ProjectHeader({ project, className }: ProjectHeaderProps) {
  return (
    <header className={className}>
      <div className="flex flex-col tablet:flex-row tablet:items-start tablet:justify-between gap-3">
        <h1 className={cn("text-display-lg text-text-primary", "mobile:text-[2.25rem] mobile:leading-[1.15]")}>
          {project.name}
        </h1>
        <StatusTag status={project.status} className="shrink-0 tablet:mt-2" />
      </div>

      <p className="mt-4 max-w-[600px] text-body-lg text-text-secondary">
        {project.oneLiner}
      </p>

      <TechTagList tags={project.techTags} className="mt-5" />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {project.links.live && (
          <Button href={project.links.live} external>
            Live
            <span className="sr-only"> demo of {project.name}</span>
          </Button>
        )}
        {project.links.code && (
          <Button variant="secondary" href={project.links.code} external>
            Code
            <span className="sr-only"> repository for {project.name}</span>
          </Button>
        )}
      </div>
    </header>
  );
}
