import { projectStatusSchema, type ProjectStatus } from "@/content/projects/_schema";
import { StatusTag } from "@/components/ui/StatusTag";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { EngineeringProject } from "@/lib/content/engineering-projects";

interface EngineeringProjectCardProps {
  project: EngineeringProject;
  className?: string;
}

export function EngineeringProjectCard({
  project,
  className,
}: EngineeringProjectCardProps) {
  const parsed = projectStatusSchema.safeParse(project.status);
  const status: ProjectStatus = parsed.success ? parsed.data : "building";

  return (
    <article
      className={cn(
        "rounded-card bg-bg-secondary border border-border-subtle p-6",
        "transition-colors duration-fast ease-standard",
        "hover:border-border-default",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-heading-md text-text-primary">
          {project.name}
        </h3>
        <StatusTag status={status} className="shrink-0" />
      </div>

      <p className="mt-3 text-body-md text-text-secondary leading-relaxed">
        {project.motivation}
      </p>

      <div className="mt-4">
        <span className="text-mono-sm uppercase tracking-[0.08em] text-text-tertiary">
          What I wanted to understand
        </span>
        <p className="mt-1.5 text-body-sm text-text-primary leading-relaxed">
          {project.whatIUnderstood}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 tablet:grid-cols-2 gap-4">
        <div>
          <span className="text-mono-sm uppercase tracking-[0.08em] text-text-tertiary">
            Core Features
          </span>
          <ul className="mt-1.5 flex flex-col gap-1.5">
            {project.coreFeatures.map((feature) => (
              <li key={feature} className="flex gap-2 text-body-sm text-text-primary">
                <span aria-hidden="true" className="text-accent shrink-0 mt-0.5">→</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span className="text-mono-sm uppercase tracking-[0.08em] text-text-tertiary">
            Engineering Concepts
          </span>
          <ul className="mt-1.5 flex flex-col gap-1.5">
            {project.engineeringConcepts.map((concept) => (
              <li key={concept} className="flex gap-2 text-body-sm text-text-primary">
                <span aria-hidden="true" className="text-accent shrink-0 mt-0.5">→</span>
                {concept}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <span className="text-mono-sm uppercase tracking-[0.08em] text-text-tertiary">
          What I Learned
        </span>
        <p className="mt-1.5 text-body-sm text-text-secondary leading-relaxed">
          {project.whatILearned}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center rounded-pill bg-bg-tertiary px-2 py-0.75 text-mono-sm text-text-tertiary"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button
          variant="secondary"
          href={project.github}
          external
          className="h-9 desktop:h-9 px-4 text-body-sm"
        >
          Code
          <ArrowIcon />
        </Button>
        <Button
          variant="primary"
          href={project.liveDemo}
          external
          className="h-9 desktop:h-9 px-4 text-body-sm"
        >
          Live Demo
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
