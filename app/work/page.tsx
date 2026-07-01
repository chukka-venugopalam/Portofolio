import { buildMetadata } from "@/lib/seo/metadata";
import { getProjectsByCategory } from "@/lib/content/projects";
import { getEngineeringProjects } from "@/lib/content/engineering-projects";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/project/ProjectCard";
import { EngineeringProjectsSection } from "@/components/project/EngineeringProjectsSection";

export const metadata = buildMetadata({
  title: "Work",
  description:
    "Flagship products and engineering explorations I'm building.",
  pathname: "/work",
});

/**
 * Work page
 *
 * Sections:
 *   1. Hero, page title and positioning
 *   2. Flagship Projects, long-term products, startup case study style
 *   3. Engineering Projects, explorations built to understand systems
 */
export default function WorkPage() {
  const flagshipProjects = getProjectsByCategory("flagship");
  const engineeringProjects = getEngineeringProjects();
  const hasEngineeringProjects = engineeringProjects.length > 0;

  return (
    <>
      {/* ── 1. Work Hero ── */}
      <Section spacing="secondary" className="pt-0">
        <Container>
          <SectionHeader
            mode="page"
            level="h1"
            subline="These are the systems I have built and am building. Some are long-term products I design from the ground up. Others are focused engineering explorations built to answer a specific question I was curious about."
          >
            Work
          </SectionHeader>
        </Container>
      </Section>

      {/* ── 2. Flagship Projects ── */}
      <Section spacing="secondary">
        <Container>
          <SectionHeader mode="label" level="h2" id="flagship">
            Flagship Projects
          </SectionHeader>
          <p className="mt-3 max-w-[600px] text-body-sm text-text-secondary">
            Long-term products I am building from the ground up, each one an engineering case study in systems thinking and product design.
          </p>

          {flagshipProjects.length > 0 ? (
            <div className="mt-8 flex flex-col gap-8">
              {flagshipProjects.map((project) => (
                <ProjectCard
                  key={project.frontmatter.slug}
                  project={project.frontmatter}
                  variant="flagship"
                />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-body-md text-text-secondary">
              No flagship projects to showcase yet, check back soon.
            </p>
          )}
        </Container>
      </Section>

      {/* ── 3. Engineering Projects ── */}
      {hasEngineeringProjects && (
        <Section spacing="secondary">
          <Container>
            <EngineeringProjectsSection />
          </Container>
        </Section>
      )}
    </>
  );
}
