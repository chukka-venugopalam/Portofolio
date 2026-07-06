import { StatusTag } from "@/components/ui/StatusTag";
import { TechTagList } from "@/components/ui/TechTag";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { ProjectFrontmatter } from "@/content/projects/_schema";

interface ProjectHeaderProps {
  project: ProjectFrontmatter;
  className?: string;
}

export function ProjectHeader({ project, className }: ProjectHeaderProps) {
  return (
    <header className={className}>
      <div className="flex flex-col tablet:flex-row tablet:items-start tablet:justify-between gap-3">
        <h1 className={cn(
          "text-display-lg text-text-primary font-semibold tracking-tight",
          "mobile:text-[2.25rem] mobile:leading-[1.15]"
        )}>
          {project.name}
        </h1>
        <StatusTag status={project.status} className="shrink-0 tablet:mt-2" />
      </div>

      <p className="mt-4 max-w-[640px] text-body-lg text-text-secondary leading-relaxed">
        {project.oneLiner}
      </p>

      <TechTagList tags={project.techTags} className="mt-5" />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {project.links.live && (
          <Button href={project.links.live} external>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <path d="M15 3h6v6" />
              <path d="M10 14L21 3" />
            </svg>
            Live Demo
            <span className="sr-only"> of {project.name}</span>
          </Button>
        )}
        {project.links.code && (
          <Button variant="secondary" href={project.links.code} external>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            View Code
          </Button>
        )}
      </div>
    </header>
  );
}
