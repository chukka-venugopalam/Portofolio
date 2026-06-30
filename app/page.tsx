import { buildHomeMetadata } from "@/lib/seo/metadata";
import { getProjectsByCategory } from "@/lib/content/projects";
import { getRecentLearningEntries } from "@/lib/content/learning";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Hero } from "@/components/home/Hero";
import { FrameworkStrip } from "@/components/home/FrameworkStrip";
import { ProjectCard } from "@/components/project/ProjectCard";
import { LearningEntry } from "@/components/learning/LearningEntry";
import { ConnectStrip } from "@/components/connect/ConnectStrip";
import { SITE_TAGLINE } from "@/lib/constants";

export const metadata = buildHomeMetadata();

/**
 * Home page — showcases the flagship projects prominently, then surfaces
 * learning pulse and connect strip.
 *
 * Sections:
 *   1. Hero — the 5-20s make-or-break positioning
 *   2. Engineering Philosophy — FrameworkStrip narrative spine
 *   3. Flagship Projects — all three long-term products, flagship card variant
 *   4. Learning Pulse — compact preview
 *   5. Connect Strip — closing conversion surface
 */
export default function HomePage() {
  const flagshipProjects = getProjectsByCategory("flagship");
  const recentLearning = getRecentLearningEntries(4);

  return (
    <>
      {/* ── Hero ── */}
      <Section spacing="home" className="pt-0">
        <Container>
          <Hero
            headline={SITE_TAGLINE}
            subline="Student & builder — AI/ML, full-stack, cloud."
            currentFocus={
              flagshipProjects.length > 0
                ? `building ${flagshipProjects[0]!.frontmatter.name}`
                : undefined
            }
          />
        </Container>
      </Section>

      {/* ── Engineering Philosophy (Framework Strip) ── */}
      <Section spacing="secondary">
        <Container>
          <SectionHeader mode="label" level="h2" id="engineering-philosophy">
            Engineering Philosophy
          </SectionHeader>
          <p className="mt-3 max-w-[480px] text-body-sm text-text-secondary">
            The mindset that guides how I learn, think, build, and create impact.
          </p>
          <div className="mt-8">
            <FrameworkStrip />
          </div>
        </Container>
      </Section>

      {/* ── Flagship Projects ──
          All three long-term products displayed with the flagship card variant.
          This is the heaviest section on the page after the hero. */}
      {flagshipProjects.length > 0 && (
        <Section spacing="secondary">
          <Container>
            <SectionHeader mode="label" level="h2" id="flagship-work">
              Flagship Projects
            </SectionHeader>
            <p className="mt-3 max-w-[600px] text-body-sm text-text-secondary">
              Long-term products I&rsquo;m building — each one a startup case study in the making.
            </p>
            <div className="mt-8 flex flex-col gap-8">
              {flagshipProjects.map((project) => (
                <ProjectCard
                  key={project.frontmatter.slug}
                  project={project.frontmatter}
                  variant="flagship"
                />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* ── Learning Pulse ── */}
      {recentLearning.length > 0 && (
        <Section spacing="secondary">
          <Container>
            <div className="flex items-baseline justify-between gap-4">
              <SectionHeader mode="label" level="h2" id="learning-pulse">
                Learning Pulse
              </SectionHeader>
              <a
                href="/learning"
                className="shrink-0 text-body-sm text-text-secondary hover:text-text-primary transition-colors duration-fast ease-standard focus-visible:outline-none focus-visible:focus-ring rounded-pill"
              >
                Full log →
              </a>
            </div>

            <div className="mt-6 divide-y divide-border-subtle">
              {recentLearning.map((entry) => (
                <LearningEntry
                  key={entry.slug}
                  date={entry.frontmatter.date}
                  headline={entry.frontmatter.headline}
                  link={entry.frontmatter.link}
                  variant="preview"
                />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* ── Connect Strip ── */}
      <Section spacing="secondary" className="pb-0">
        <Container>
          <ConnectStrip variant="home" />
        </Container>
      </Section>
    </>
  );
}
