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
import { NOW_STATUS, SOCIAL_LINKS, SITE_TAGLINE } from "@/lib/constants";

export const metadata = buildHomeMetadata();

export default function HomePage() {
  const flagshipProjects = getProjectsByCategory("flagship");
  const recentLearning = getRecentLearningEntries(4);

  return (
    <>
      {/* ── Hero ── */}
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

      {/* ── Engineering Philosophy ── */}
      <Section spacing="secondary" id="engineering-philosophy">
        <Container>
          <div className="max-w-[960px] mx-auto">
            <SectionHeader mode="label" level="h2">
              Engineering Philosophy
            </SectionHeader>
            <p className="mt-4 max-w-[520px] text-body-lg text-text-secondary">
              The mindset that guides how I learn, think, build, and create impact.
            </p>
            <div className="mt-12 desktop:mt-16">
              <FrameworkStrip />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Flagship Projects ── */}
      {flagshipProjects.length > 0 && (
        <Section spacing="secondary">
          <Container>
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <SectionHeader mode="label" level="h2" id="flagship-work">
                  Flagship Projects
                </SectionHeader>
                <p className="mt-4 max-w-[600px] text-body-lg text-text-secondary">
                  Long-term products I&rsquo;m building &mdash; each one a startup case study in the making.
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

      {/* ── Learning Roadmap ── */}
      {recentLearning.length > 0 && (
        <Section spacing="secondary">
          <Container>
            <div className="max-w-[960px] mx-auto">
              <div className="flex items-baseline justify-between gap-4">
                <SectionHeader mode="label" level="h2" id="learning-pulse">
                  Learning Roadmap
                </SectionHeader>
                <a
                  href="/learning"
                  className="shrink-0 text-body-sm text-text-secondary hover:text-text-primary transition-colors duration-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
                >
                  Full log &rarr;
                </a>
              </div>

              {/* Learning journey visualization */}
              <div className="mt-10 grid grid-cols-1 tablet:grid-cols-3 gap-6">
                {/* Completed */}
                <div className="rounded-xl border border-border-subtle bg-bg-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-status-shipped/10 text-status-shipped">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span className="text-mono-sm tracking-[0.08em] text-status-shipped uppercase font-medium">Completed</span>
                  </div>
                  <div className="space-y-3">
                    {recentLearning.slice(0, 2).map((entry) => (
                      <LearningEntry
                        key={entry.slug}
                        date={entry.frontmatter.date}
                        headline={entry.frontmatter.headline}
                        link={entry.frontmatter.link}
                        variant="preview"
                      />
                    ))}
                  </div>
                </div>

                {/* Currently Learning */}
                <div className="rounded-xl border border-accent/20 bg-bg-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="relative flex h-6 w-6 items-center justify-center">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-md bg-accent opacity-30" />
                      <span className="relative flex h-6 w-6 items-center justify-center rounded-md bg-accent/10 text-accent">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </span>
                    </span>
                    <span className="text-mono-sm tracking-[0.08em] text-accent uppercase font-medium">Currently Learning</span>
                  </div>
                  <div className="space-y-3">
                    {recentLearning.length > 2 ? (
                      <LearningEntry
                        date={recentLearning[2]!.frontmatter.date}
                        headline={recentLearning[2]!.frontmatter.headline}
                        link={recentLearning[2]!.frontmatter.link}
                        variant="preview"
                      />
                    ) : (
                      <LearningEntry
                        date={recentLearning[0]!.frontmatter.date}
                        headline={recentLearning[0]!.frontmatter.headline}
                        link={recentLearning[0]!.frontmatter.link}
                        variant="preview"
                      />
                    )}
                  </div>
                </div>

                {/* Next Focus */}
                <div className="rounded-xl border border-border-subtle bg-bg-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-status-building/10 text-status-building">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                    </span>
                    <span className="text-mono-sm tracking-[0.08em] text-status-building uppercase font-medium">Next Focus</span>
                  </div>
                  <div className="space-y-3">
                    <LearningEntry
                      date={recentLearning[recentLearning.length - 1]!.frontmatter.date}
                      headline={recentLearning[recentLearning.length - 1]!.frontmatter.headline}
                      link={recentLearning[recentLearning.length - 1]!.frontmatter.link}
                      variant="preview"
                    />
                  </div>
                </div>
              </div>

              {/* Divider between sections */}
              <div className="mt-6 flex items-center gap-3 text-mono-sm text-text-quaternary">
                <span>{recentLearning.length} recent entries</span>
                <span aria-hidden="true">&middot;</span>
                <a href="/learning" className="hover:text-text-primary transition-colors">
                  View all &rarr;
                </a>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* ── About ── */}
      <Section spacing="secondary">
        <Container>
          <div className="max-w-[720px] mx-auto">
            <SectionHeader mode="label" level="h2">
              About
            </SectionHeader>

            <div className="mt-8 space-y-6 text-body-lg text-text-secondary leading-relaxed">
              <p>
                I&rsquo;m an engineer who builds AI systems with strong product thinking
                and engineering depth. My work sits at the intersection of artificial
                intelligence, systems design, and human learning &mdash; creating tools
                that don&rsquo;t just function, but fundamentally change how people learn,
                decide, and build.
              </p>
              <p>
                Every project starts with a question I can&rsquo;t stop thinking about.
                I follow the curiosity through learning, turn understanding into working
                systems, and measure success by the depth of insight created &mdash; not
                by lines of code or GitHub stars.
              </p>
            </div>

            {/* Now status */}
            <div className="mt-8 flex items-center gap-2 rounded-card border border-border-subtle bg-bg-secondary px-5 py-3">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-40" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
              </span>
              <span className="text-mono-sm text-text-tertiary uppercase tracking-[0.08em]">Now &mdash;</span>
              <span className="text-body-sm text-text-secondary">{NOW_STATUS.line}</span>
              <span className="text-mono-sm text-text-quaternary shrink-0 ml-auto">{NOW_STATUS.date}</span>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Connect / Contact ── */}
      <Section spacing="secondary" className="pb-0">
        <Container>
          <div className="max-w-[720px] mx-auto">
            <div className="relative">
              <div aria-hidden="true" className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-[200px] h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
              <div className="rounded-xl border border-border-subtle bg-bg-card p-8 desktop:p-10">
                <SectionHeader mode="label" level="h2">
                  Let&rsquo;s Connect
                </SectionHeader>
                <p className="mt-4 max-w-[480px] text-body-lg text-text-secondary">
                  Open to internships, hackathons, and collaborations on something real.
                </p>
                <div className="mt-8">
                  <ConnectStrip variant="home" />
                </div>

                {/* Direct email link */}
                <div className="mt-8 pt-6 border-t border-border-subtle">
                  <a
                    href={`mailto:${SOCIAL_LINKS.email}`}
                    className="inline-flex items-center gap-2 text-body-md text-accent hover:text-accent-light transition-colors duration-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
                  >
                    {SOCIAL_LINKS.email}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M7 17l9.2-9.2M17 17V7H7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
