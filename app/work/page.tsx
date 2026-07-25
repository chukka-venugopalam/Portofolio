import { buildMetadata } from "@/lib/seo/metadata";
import { getAllProjects, getProjectsByCategory } from "@/lib/content/projects";
import { NOW_STATUS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { WorkSection } from "@/components/work/WorkSection";
import { ProjectSlider } from "@/components/work/ProjectSlider";

export const metadata = buildMetadata({
  title: "Work",
  description:
    "Flagship products, frontend experiments, and systems engineering explorations.",
  pathname: "/work",
});

export default function WorkPage() {
  const allProjects = getAllProjects();

  const flagshipProjects = getProjectsByCategory("flagship");
  const frontendProjects = getProjectsByCategory("frontend");
  const otherProjects = getProjectsByCategory("other");

  const shippedCount = allProjects.filter(
    (p) => p.frontmatter.status === "shipped" || p.frontmatter.status === "production-ready"
  ).length;

  const inProgressCount = allProjects.filter(
    (p) => p.frontmatter.status !== "shipped" && p.frontmatter.status !== "production-ready"
  ).length;

  return (
    <>
      {/* Work Hero */}
      <Section spacing="secondary" className="pt-0">
        <Container>
          <SectionHeader
            mode="page"
            level="h1"
            subline="These are the systems I have built and am building. Flagship products designed from the ground up, interactive frontend experiments, and focused engineering explorations."
          >
            Work
          </SectionHeader>
          <p className="mt-4 flex items-center gap-3 text-mono-sm text-text-tertiary">
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-status-shipped" />
              {shippedCount} shipped
            </span>
            <span aria-hidden="true" className="text-border-subtle">·</span>
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-status-building" />
              {inProgressCount} in progress
            </span>
          </p>
        </Container>
      </Section>

      {/* Three Vertical Sections with Horizontal Project Sliders */}
      <Section spacing="tight" className="pt-0">
        <Container>
          {/* Section 1: Flagship Projects */}
          <WorkSection
            id="flagship-projects"
            title="Flagship Projects"
            description="Long-term products designed from the ground up — engineering case studies in systems thinking and product design."
            count={flagshipProjects.length}
          >
            <ProjectSlider
              projects={flagshipProjects.map((p) => p.frontmatter)}
            />
          </WorkSection>

          {/* Section 2: Frontend Experiments */}
          <WorkSection
            id="frontend-experiments"
            title="Frontend Experiments"
            description="Interactive design & WebGL/GLSL shader explorations pushing the boundaries of web UI and spatial presentation."
            count={frontendProjects.length}
          >
            <ProjectSlider
              projects={frontendProjects.map((p) => p.frontmatter)}
            />
          </WorkSection>

          {/* Section 3: Other / Engineering Projects */}
          <WorkSection
            id="engineering-projects"
            title="Other / Engineering Projects"
            description="Focused systems investigations answering specific computer science questions through hands-on interactive simulators."
            count={otherProjects.length}
          >
            <ProjectSlider
              projects={otherProjects.map((p) => p.frontmatter)}
            />
          </WorkSection>
        </Container>
      </Section>

      {/* Now status */}
      <Section spacing="tight" className="pb-0">
        <Container>
          <div className="flex items-center gap-2 rounded-card border border-border-subtle bg-bg-secondary px-5 py-3">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-40" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            <span className="text-mono-sm text-text-tertiary uppercase tracking-[0.08em]">Now &mdash;</span>
            <span className="text-body-sm text-text-secondary">{NOW_STATUS.line}</span>
            <span className="text-mono-sm text-text-quaternary shrink-0 ml-auto">{NOW_STATUS.date}</span>
          </div>
        </Container>
      </Section>
    </>
  );
}
