import { getEngineeringProjects } from "@/lib/content/engineering-projects";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EngineeringProjectCard } from "@/components/project/EngineeringProjectCard";

/**
 * EngineeringProjectsSection
 *
 * Renders the Engineering Projects section for the Work page.
 * These are non-flagship projects that demonstrate engineering exploration
 * and systems thinking, presented as case studies rather than products.
 */
export function EngineeringProjectsSection() {
  const projects = getEngineeringProjects();

  if (projects.length === 0) {
    return null;
  }

  return (
    <div>
      <SectionHeader mode="label" level="h2" id="engineering-projects">
        Engineering Projects
      </SectionHeader>
      <p className="mt-3 max-w-[600px] text-body-sm text-text-secondary">
        These arent products. They are engineering explorations I built to answer questions I was curious about, each one focused on understanding a specific systems concept deeply enough to implement it from scratch.
      </p>

      <div className="mt-8 flex flex-col gap-8">
        {projects.map((project) => (
          <EngineeringProjectCard
            key={project.name}
            project={project}
          />
        ))}
      </div>
    </div>
  );
}
