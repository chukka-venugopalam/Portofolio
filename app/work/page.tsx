import { buildMetadata } from "@/lib/seo/metadata";
import { getProjectsByCategory } from "@/lib/content/projects";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/project/ProjectCard";

export const metadata = buildMetadata({
  title: "Work",
  description:
    "Flagship products I'm building — AI-assisted learning, real-time decision-making, and civic technology.",
  pathname: "/work",
});

/**
 * Work page — focused exclusively on flagship products that represent
 * the portfolio's long-term engineering vision.
 *
 * Sections:
 *   1. Hero — page title and positioning
 *   2. Flagship Projects — long-term products, startup case study style
 */
export default function WorkPage() {
  const flagshipProjects = getProjectsByCategory("flagship");

  return (
    <>
      {/* ── 1. Work Hero ── */}
      <Section spacing="secondary" className="pt-0">
        <Container>
          <SectionHeader
            mode="page"
            level="h1"
            subline="These are the long-term products I&rsquo;m building to solve meaningful problems in learning, decision-making, and civic technology. Rather than building many disconnected projects, I focus on a small number of ambitious systems and iterate on them over time."
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
            Ambitious systems I&rsquo;m building from the ground up — each one a
            startup case study in engineering vision, product thinking, and
            long-term execution.
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
              No flagship projects to showcase yet — check back soon.
            </p>
          )}
        </Container>
      </Section>
    </>
  );
}
