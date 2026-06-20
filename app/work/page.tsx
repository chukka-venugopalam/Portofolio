import { buildMetadata } from "@/lib/seo/metadata";
import {
  getFlagshipProject,
  getNonFlagshipProjects,
  getStrongestInProgressProject,
} from "@/lib/content/projects";
import { getAlsoBuildingEntries } from "@/lib/content/also-building";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusTag } from "@/components/ui/StatusTag";
import { ProjectCard } from "@/components/project/ProjectCard";
import { AlsoBuildingEntry } from "@/components/project/AlsoBuildingEntry";

export const metadata = buildMetadata({
  title: "Work",
  description: "Everything I'm building, tagged by status.",
  pathname: "/work",
});

/**
 * Work page — Visual Design Spec Section 2, Component Library B3/B4/B8/D8.
 *
 * Five sections, matching this task's requested structure exactly:
 *   1. Work Hero       — SectionHeader in "page" mode (H1 + sub-line)
 *   2. Flagship Project — ProjectCard, flagship variant, full weight
 *   3. Projects Grid    — ProjectCard, grid variant, 2-col desktop
 *   4. Also Building    — AlsoBuildingEntry one-liners
 *   5. Empty States      — handled per-section, not as a separate block
 *
 * Component reuse, per this task's explicit requirement:
 *   Container, Section, SectionHeader, ProjectCard, StatusTag — every
 *   one is an EXISTING component from prior turns. No new card
 *   component is introduced; the flagship/grid distinction is handled
 *   entirely by ProjectCard's existing `variant` prop (Component
 *   Library B3), exactly as it already is on Home.
 *
 * "Work Hero" is deliberately NOT the Home page's <Hero> component.
 * Component Library B1 states this explicitly: Hero is a single
 * variant, Home-only — there is no secondary-page "mini-hero." Every
 * other page uses SectionHeader's "page" mode (H1 + sub-line) instead,
 * which is exactly what's used here. Reusing <Hero> on this page would
 * violate that rule and exists as a clear example of why "reuse
 * existing components" sometimes means picking the RIGHT existing
 * component, not the most superficially similar-sounding one.
 *
 * Filtering (FilterChip) was part of the original Visual Design Spec's
 * Work page wireframe but is deliberately NOT included here: this
 * task's component list and five-section structure don't call for it,
 * and FilterChip doesn't exist yet in the codebase. Building it now
 * would mean inventing a component outside this task's explicit scope.
 * Filtering is a clean, additive change to layer in later once
 * FilterChip exists — see the Implementation Blueprint's component
 * dependency notes for why it's safe to defer.
 *
 * Empty states (Component Library, content-honesty model): with a
 * single flagship and no other real or in-progress projects yet, both
 * the Projects Grid and Also Building sections render an honest empty
 * state rather than being silently omitted or padded with invented
 * content. Each empty state uses StatusTag (status="exploring") as a
 * small, real visual anchor — not decoration, but an accurate signal
 * that more work is in an earlier stage, which is the only state a
 * brand-new portfolio can honestly claim.
 */
export default function WorkPage() {
  const flagship = getFlagshipProject();
  const strongestInProgress = flagship ? null : getStrongestInProgressProject();
  const otherProjects = getNonFlagshipProjects().filter(
    (p) => p.frontmatter.slug !== strongestInProgress?.frontmatter.slug
  );
  const alsoBuilding = getAlsoBuildingEntries();

  return (
    <>
      {/* ── 1. Work Hero ──
          SectionHeader page-header mode: display-lg H1 + body-lg
          sub-line, max-width 480px — Visual Design Spec 2.1/2.3. */}
      <Section spacing="secondary" className="pt-0">
        <Container>
          <SectionHeader
            mode="page"
            level="h1"
            subline="Everything I'm building, tagged by status."
          >
            Work
          </SectionHeader>
        </Container>
      </Section>

      {/* ── 2. Flagship Project (or honest no-flagship-yet state) ──
          Same component, same visual weight as Home's flagship when one
          exists — Visual Design Spec 2.1: "consistency here is what
          makes the flagship feel like a genuine anchor rather than a
          homepage-only marketing moment." When no project has earned
          featured: true yet, this renders the strongest in-progress
          project at its real status using the GRID variant, never
          flagship — see getStrongestInProgressProject()'s doc comment
          in lib/content/projects.ts. */}
      <Section spacing="secondary">
        <Container>
          {flagship ? (
            <>
              <SectionHeader mode="label" level="h2" id="flagship">
                Flagship
              </SectionHeader>
              <div className="mt-8">
                <ProjectCard project={flagship.frontmatter} variant="flagship" />
              </div>
            </>
          ) : strongestInProgress ? (
            <>
              <SectionHeader mode="label" level="h2" id="flagship">
                No Flagship Yet
              </SectionHeader>
              <p className="mt-3 max-w-[600px] text-body-sm text-text-secondary">
                Nothing&rsquo;s shipped enough to call a flagship yet.
                Here&rsquo;s the project getting the most real attention
                right now, shown at its actual status — not promoted to
                a weight it hasn&rsquo;t earned.
              </p>
              <div className="mt-8">
                <ProjectCard
                  project={strongestInProgress.frontmatter}
                  variant="grid"
                />
              </div>
            </>
          ) : (
            <>
              <SectionHeader mode="label" level="h2" id="flagship">
                Flagship
              </SectionHeader>
              <EmptyState
                status="exploring"
                message="No projects yet — check back soon."
              />
            </>
          )}
        </Container>
      </Section>

      {/* ── 3. Projects Grid ──
          Grid variant per Component Library B3: border-subtle (not
          border-default — reserved for the flagship only), 2-column on
          desktop, single column tablet/mobile (Visual Design Spec 2.7:
          two cards side by side at 768px would be too narrow to read
          tech tags and link rows comfortably). */}
      <Section spacing="secondary">
        <Container>
          <SectionHeader mode="label" level="h2" id="all-work">
            All Work
          </SectionHeader>

          {otherProjects.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 desktop:grid-cols-2 gap-x-6 gap-y-8">
              {otherProjects.map((project) => (
                <ProjectCard
                  key={project.frontmatter.slug}
                  project={project.frontmatter}
                  variant="grid"
                />
              ))}
            </div>
          ) : (
            <EmptyState
              status="exploring"
              message="No additional projects with full writeups yet — the flagship above is the current focus. More are on the way."
            />
          )}
        </Container>
      </Section>

      {/* ── 4. Also Building ──
          Honest one-liners only, per Component Library D8 — a project
          without enough substance for a full page stays a single
          sentence, never a card, regardless of how this section's
          emptiness might look. */}
      <Section spacing="secondary" className="pb-0">
        <Container>
          <SectionHeader mode="label" level="h2" id="also-building">
            Also Building
          </SectionHeader>

          {alsoBuilding.length > 0 ? (
            <ul className="mt-6 divide-y divide-border-subtle">
              {alsoBuilding.map((entry) => (
                <AlsoBuildingEntry key={entry.name} entry={entry} />
              ))}
            </ul>
          ) : (
            <EmptyState
              status="exploring"
              message="Nothing in early exploration to share publicly yet — check back soon, or see the Learning Log for what's currently being worked through."
            />
          )}
        </Container>
      </Section>
    </>
  );
}

/**
 * EmptyState
 *
 * Local to this page rather than a new shared component — per this
 * task's "do not create duplicate card components" instruction, this is
 * deliberately NOT a card: no border, no background fill, no shadow.
 * It's plain text with a StatusTag anchor, consistent with how thin
 * content is treated everywhere else on the site (AlsoBuildingEntry's
 * own minimalism, Learning Entry's plainness) — an empty state should
 * look like "nothing here yet," not like a styled placeholder card
 * pretending to be content.
 */
function EmptyState({
  status,
  message,
}: {
  status: "shipped" | "building" | "exploring";
  message: string;
}) {
  return (
    <div className="mt-6 flex items-start gap-3">
      <StatusTag status={status} className="mt-0.5 shrink-0" />
      <p className="text-body-md text-text-secondary">{message}</p>
    </div>
  );
}
