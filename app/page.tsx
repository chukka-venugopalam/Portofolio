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
import { Button } from "@/components/ui/Button";
import { SITE_TAGLINE } from "@/lib/constants";

export const metadata = buildHomeMetadata();

export default function HomePage() {
  const flagshipProjects = getProjectsByCategory("flagship");
  const recentLearning = getRecentLearningEntries(4);

  return (
    <>
      {/* Hero */}
      <Section spacing="home" className="pt-0 relative overflow-hidden">
        <Container>
          <Hero
            name="Venugopalam Chukka"
            tagline={SITE_TAGLINE}
            roles="Student &amp; Builder • AI/ML • Full Stack • Cloud"
            currentFocus={
              flagshipProjects.length > 0
                ? `building ${flagshipProjects[0]!.frontmatter.name}`
                : undefined
            }
          />
        </Container>
      </Section>

      {/* Engineering Philosophy — Curiosity → Impact Timeline */}
      <Section spacing="secondary" id="engineering-philosophy">
        <Container>
          <SectionHeader mode="label" level="h2">
            Engineering Philosophy
          </SectionHeader>
          <p className="mt-3 max-w-[520px] text-body-sm text-text-secondary">
            The mindset that guides how I learn, think, build, and create impact.
          </p>
          <div className="mt-10 desktop:mt-12">
            <FrameworkStrip />
          </div>
        </Container>
      </Section>

      {/* Flagship Projects */}
      {flagshipProjects.length > 0 && (
        <Section spacing="secondary">
          <Container>
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <SectionHeader mode="label" level="h2" id="flagship-work">
                  Flagship Projects
                </SectionHeader>
                <p className="mt-3 max-w-[600px] text-body-sm text-text-secondary">
                  Long-term products I&rsquo;m building — each one a startup case study in the making.
                </p>
              </div>
              <Button
                variant="secondary"
                href="/work"
                className="hidden tablet:inline-flex shrink-0"
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                }
              >
                All Projects
              </Button>
            </div>

            <div className="mt-10 flex flex-col gap-8 desktop:gap-10">
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

      {/* Learning Pulse */}
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

      {/* Connect Strip */}
      <Section spacing="secondary" className="pb-0">
        <Container>
          <div className="relative">
            {/* Subtle decoration */}
            <div aria-hidden="true" className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-[200px] h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
            <div className="rounded-2xl border border-border-subtle bg-bg-secondary/50 p-6 desktop:p-8">
              <SectionHeader mode="label" level="h2">
                Let&rsquo;s Connect
              </SectionHeader>
              <p className="mt-3 max-w-[480px] text-body-md text-text-secondary">
                Open to internships, hackathons, and collaborations on something real.
              </p>
              <div className="mt-6">
                <ConnectStrip variant="home" />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
