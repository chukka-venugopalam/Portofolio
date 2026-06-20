import { buildMetadata } from "@/lib/seo/metadata";
import {
  getFlagshipProject,
  getStrongestInProgressProject,
} from "@/lib/content/projects";
import { getResumePdfStatus } from "@/lib/resume";
import { SOCIAL_LINKS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { ConnectStrip } from "@/components/connect/ConnectStrip";

export const metadata = buildMetadata({
  title: "Connect",
  description: "Open to internships, hackathons, and collaboration.",
  pathname: "/connect",
});

/**
 * Connect page — PRD Part 6/Opportunity Hub framing, Visual Design Spec
 * Section 6, Component Library D1.
 *
 * Five sections, matching this task's requested structure:
 *   1. Connect Hero          — SectionHeader page mode, "Let's talk."
 *                              per Visual Design Spec 6.2's framing
 *   2. Opportunity Areas       — ConnectStrip's availability tags
 *                                (Internships / Hackathons /
 *                                Collaboration) — REUSED, not rebuilt
 *   3. Contact Methods           — ConnectStrip's page-variant contact
 *                                  rows (Email/GitHub/LinkedIn/Resume)
 *                                  — REUSED, not rebuilt
 *   4. Current Focus               — new content, sourced from the same
 *                                     flagship project Home's Hero
 *                                     already uses, so there's one
 *                                     source of truth for "what's
 *                                     currently being worked on" across
 *                                     the whole site, not two
 *                                     independently-maintained copies
 *   5. Collaboration CTA              — closing section distinguishing
 *                                        recruiter-style outreach
 *                                        (resume/email) from founder/
 *                                        collaborator-style outreach
 *                                        (a more direct "let's build
 *                                        something" prompt), since this
 *                                        task explicitly asks for both
 *                                        recruiter-friendly AND
 *                                        collaboration-friendly framing
 *
 * Sections 2 and 3 — per this task's explicit "Reuse: ConnectStrip"
 * requirement — are a SINGLE <ConnectStrip variant="page"> call. That
 * component already renders availability tags (Opportunity Areas)
 * immediately followed by contact rows (Contact Methods) as one
 * connected unit, per Component Library D1 and Visual Design Spec
 * 6.1's stated order ("availability tags, then a vertical stack of
 * contact-method rows"). Splitting these into two separately-rendered
 * components here would duplicate ConnectStrip's existing internal
 * layout/motion-stagger logic for no benefit — exactly what "do not
 * create duplicate components" exists to prevent.
 *
 * Bug fix while building this page: ConnectStrip's resume contact row
 * previously hardcoded a link straight to /resume.pdf, which would
 * silently 404 if the file doesn't exist — it currently doesn't exist
 * in this codebase. ConnectStrip now accepts a resumePdfExists prop
 * (passed below from the same getResumePdfStatus() check the Resume
 * page already uses) so this page's Download button degrades exactly
 * the same honest way the Resume page's already does. See
 * components/connect/ConnectStrip.tsx's updated doc comment.
 *
 * Layout (Visual Design Spec 6.1): 600px max-width — the narrowest
 * reading column on the site, intentional for this page's content
 * volume even with the two added sections.
 */
export default function ConnectPage() {
  const flagship = getFlagshipProject();
  const currentFocusProject = flagship ?? getStrongestInProgressProject();
  const pdfStatus = getResumePdfStatus();

  return (
    <>
      {/* ── 1. Connect Hero ──
          "Let's talk." framing per Visual Design Spec 6.2 — a friendly,
          direct hook doing double duty as the page's only large display
          type. Recruiter- and collaboration-friendly by design: the
          sub-line names both audiences without picking one. */}
      <Section spacing="secondary" className="pt-0">
        <Container className="max-w-[600px]" wide={false}>
          <SectionHeader
            mode="page"
            level="h1"
            subline="Open to internship and full-time conversations, hackathon teams, and collaborations on something real."
          >
            Let&rsquo;s talk.
          </SectionHeader>
        </Container>
      </Section>

      {/* ── 2. Opportunity Areas + 3. Contact Methods ──
          One ConnectStrip call, page variant — see the doc comment
          above for why these two requested sections map to a single
          reused component rather than two separately-built ones. */}
      <Section spacing="tight">
        <Container className="max-w-[600px]" wide={false}>
          <ConnectStrip variant="page" resumePdfExists={pdfStatus.exists} />
        </Container>
      </Section>

      {/* ── 4. Current Focus ──
          Same source of truth as Home's Hero "Currently:" line —
          getFlagshipProject() if one exists, otherwise the same
          getStrongestInProgressProject() fallback Home and Work use —
          so a collaborator reading Connect sees the same honest,
          current answer a recruiter sees elsewhere on the site, not a
          second, independently-maintained version of the same claim. */}
      <Section spacing="tight">
        <Container className="max-w-[600px]" wide={false}>
          <SectionHeader mode="label" level="h2">
            Current Focus
          </SectionHeader>
          {currentFocusProject ? (
            <>
              <p className="mt-4 text-body-md leading-[1.7] text-text-primary">
                Right now I&rsquo;m{" "}
                {currentFocusProject.frontmatter.status === "exploring"
                  ? "designing"
                  : "building"}{" "}
                <span className="text-text-primary font-medium">
                  {currentFocusProject.frontmatter.name}
                </span>
                {" — "}
                {currentFocusProject.frontmatter.oneLiner}
              </p>
              <Button
                variant="secondary"
                href={`/work/${currentFocusProject.frontmatter.slug}`}
                className="mt-5"
              >
                Read the full writeup
              </Button>
            </>
          ) : (
            <p className="mt-4 text-body-md text-text-secondary">
              Between projects right now — see the Learning Log for
              what&rsquo;s actively being worked through.
            </p>
          )}
        </Container>
      </Section>

      {/* ── 5. Collaboration CTA ──
          Closing section distinguishing the two audiences this task
          asks for explicitly: recruiter-style outreach (resume, formal
          email) and founder/collaborator-style outreach (a more direct
          prompt to reach out about building something together). Two
          buttons, neither more visually dominant than the other —
          consistent with Button's two-variant system and this page's
          stated "no single channel should be implied as more
          important" principle (Visual Design Spec 6.2), applied here
          to audiences rather than contact channels. */}
      <Section spacing="tight" className="pb-0">
        <Container className="max-w-[600px]" wide={false}>
          <div className="rounded-card border border-border-subtle p-6 desktop:p-8">
            {/* Raw heading, not SectionHeader — this is a card-internal
                headline (the CTA card's own title), the same pattern
                ResumeSummaryBlock uses for "Quick Snapshot"'s h2, not a
                page-level section label. SectionHeader's "label" mode
                is reserved for top-level section openers like "Current
                Focus" above; using it here for a conversational,
                larger statement would force a mismatched typographic
                treatment onto content that isn't a section label. */}
            <h2 className="text-heading-md text-text-primary">
              Building something? Hiring for something?
            </h2>
            <p className="mt-3 text-body-md text-text-secondary">
              Either way, the fastest path is a direct message — I read
              everything that comes in through email.
            </p>
            <div className="mt-6 flex flex-col tablet:flex-row gap-3">
              <Button href={`mailto:${SOCIAL_LINKS.email}`}>
                Email me directly
              </Button>
              <Button variant="secondary" href={SOCIAL_LINKS.linkedin} external>
                Connect on LinkedIn
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
