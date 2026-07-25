import { StatusTag } from "@/components/ui/StatusTag";
import { TechTagList } from "@/components/ui/TechTag";
import { ProjectActionButtons } from "@/components/project/ProjectActionButtons";
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

      <div className="mt-6 max-w-[480px]">
        <ProjectActionButtons
          project={project}
          currentSlug={project.slug}
          variant="header"
        />
      </div>
    </header>
  );
}
