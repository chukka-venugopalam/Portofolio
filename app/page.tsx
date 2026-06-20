import { buildHomeMetadata } from "@/lib/seo/metadata";
import {
  getFlagshipProject,
  getNonFlagshipProjects,
  getStrongestInProgressProject,
} from "@/lib/content/projects";
import { getRecentLearningEntries } from "@/lib/content/learning";
import { getAlsoBuildingEntries } from "@/lib/content/also-building";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Hero } from "@/components/home/Hero";
import { FrameworkStrip } from "@/components/home/FrameworkStrip";
import { ProjectCard } from "@/components/project/ProjectCard";
import { AlsoBuildingEntry } from "@/components/project/AlsoBuildingEntry";
import { LearningEntry } from "@/components/learning/LearningEntry";
import { ConnectStrip } from "@/components/connect/ConnectStrip";
import { SITE_TAGLINE } from "@/lib/constants";

export const metadata = buildHomeMetadata();

/**
 * Home page — Visual Design Spec Section 1, Component Library B1-B3/B6/D1/D8.
 *
 * Five sections, in the order the PRD's user journey (Part 4) specifies
 * visitors actually travel: Hero (the 5-20s make-or-break window) →
 * Builder Snapshot (the Curiosity→Impact narrative spine, quieter than
 * Hero/Flagship by design) → Flagship Project (the single strongest
 * proof point, given the most visual weight on the page) → Learning
 * Pulse (lower-contrast supporting evidence) → Connect Strip (closing
 * conversion surface).
 *
 * Per the PRD Part 1's central scope decision: ONE flagship, not five
 * "featured systems" — every other real-but-thin project renders as an
 * honest one-line AlsoBuildingEntry, never a full card, since a project
 * without enough substance for a full page is a content-honesty risk,
 * not a design opportunity (Component Library D8).
 *
 * Honest empty-flagship state: getFlagshipProject() can legitimately
 * return null — no project has earned featured: true yet. Rather than
 * crashing or silently promoting some other project to flagship-level
 * visual treatment, this page renders a clearly-labeled "no flagship
 * yet" state and shows the strongest in-progress project (per
 * getStrongestInProgressProject()) using ProjectCard's GRID variant —
 * the lighter-weight treatment its real status actually earns — never
 * the flagship variant's border-default/full-padding/top-billing
 * treatment. The visual weight a component receives should always
 * match what the content underneath it can actually support.
 *
 * generateStaticParams elsewhere (app/work/[slug]/page.tsx) is what
 * actually triggers the getAllProjects() validation/build-failure path —
 * this page calling getFlagshipProject() benefits from that validation
 * having already run, but doesn't duplicate it.
 */
export default function HomePage() {
  const flagship = getFlagshipProject();
  const strongestInProgress = flagship ? null : getStrongestInProgressProject();
  const otherProjects = getNonFlagshipProjects().filter(
    (p) => p.frontmatter.slug !== strongestInProgress?.frontmatter.slug
  );
  const alsoBuilding = getAlsoBuildingEntries();
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
              flagship
                ? `building ${flagship.frontmatter.name}`
                : strongestInProgress
                  ? `designing ${strongestInProgress.frontmatter.name}`
                  : undefined
            }
          />
        </Container>
      </Section>

      {/* ── Builder Snapshot (Framework Strip) ──
          Visual Design Spec 1.2: intentionally quieter than Hero and
          Flagship — connective tissue, not a headline claim. */}
      <Section spacing="secondary">
        <Container>
          <FrameworkStrip />
        </Container>
      </Section>

      {/* ── Flagship Project (or honest no-flagship-yet state) ──
          Visual Design Spec 1.2: the heaviest single element on the
          page after the hero headline — border-default, elevated bg,
          full padding — but only when a real flagship exists. The
          fallback state below deliberately uses lighter visual
          treatment, since the content underneath hasn't earned the
          flagship's weight yet. */}
      <Section spacing="secondary">
        <Container>
          {flagship ? (
            <>
              <SectionHeader mode="label" level="h2" id="flagship-work">
                Flagship Work
              </SectionHeader>
              <div className="mt-8">
                <ProjectCard project={flagship.frontmatter} variant="flagship" />
              </div>
            </>
          ) : strongestInProgress ? (
            <>
              <SectionHeader mode="label" level="h2" id="flagship-work">
                No Flagship Yet — Strongest Work In Progress
              </SectionHeader>
              <p className="mt-3 max-w-[600px] text-body-sm text-text-secondary">
                Nothing&rsquo;s shipped enough yet to call a flagship — here&rsquo;s
                the project getting the most real attention right now,
                shown at its actual status.
              </p>
              <div className="mt-8">
                <ProjectCard
                  project={strongestInProgress.frontmatter}
                  variant="grid"
                />
              </div>
            </>
          ) : null}

          {/* "Also building" — honest one-liners only, never full cards.
              Renders nothing if the list is empty (a legitimate V1 state
              per the PRD — content shouldn't be invented to fill space). */}
          {alsoBuilding.length > 0 && (
            <div className="mt-12">
              <span className="text-mono-sm uppercase tracking-[0.08em] text-text-tertiary">
                Also building
              </span>
              <ul className="mt-3 divide-y divide-border-subtle">
                {alsoBuilding.map((entry) => (
                  <AlsoBuildingEntry key={entry.name} entry={entry} />
                ))}
              </ul>
            </div>
          )}

          {/* Other real projects with full pages, beyond the flagship
              (or beyond the strongest-in-progress pick above, with that
              one already filtered out so it's never shown twice). */}
          {otherProjects.length > 0 && (
            <div className="mt-8 grid grid-cols-1 desktop:grid-cols-2 gap-6">
              {otherProjects.map((project) => (
                <ProjectCard
                  key={project.frontmatter.slug}
                  project={project.frontmatter}
                  variant="grid"
                />
              ))}
            </div>
          )}

          <div className="mt-10">
            <Button variant="secondary" href="/work">
              See all work
            </Button>
          </div>
        </Container>
      </Section>

      {/* ── Learning Pulse ──
          Visual Design Spec 1.2: lower-contrast supporting evidence —
          by this scroll depth the visitor has already formed their
          primary impression. Compact preview variant only; full entries
          with expansion text live on /learning. */}
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

      {/* ── Connect Strip ──
          Home variant: compact icon row, not the full labeled-row
          layout used on the standalone Connect page. */}
      <Section spacing="secondary" className="pb-0">
        <Container>
          <ConnectStrip variant="home" />
        </Container>
      </Section>
    </>
  );
}
