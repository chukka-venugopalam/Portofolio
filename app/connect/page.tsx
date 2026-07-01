import { buildMetadata } from "@/lib/seo/metadata";
import { getFlagshipProject, getStrongestInProgressProject } from "@/lib/content/projects";
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
 * Connect page
 *
 * Sections:
 *   1. Connect Hero
 *   2. Opportunity Areas + Contact Methods (ConnectStrip)
 *   3. Direct Contact Links (Email, GitHub, LeetCode)
 *   4. Current Focus
 *   5. Collaboration CTA
 */
export default function ConnectPage() {
  const flagship = getFlagshipProject();
  const currentFocusProject = flagship ?? getStrongestInProgressProject();
  const pdfStatus = getResumePdfStatus();

  return (
    <>
      {/* ── 1. Connect Hero ── */}
      <Section spacing="secondary" className="pt-0">
        <Container className="max-w-[600px]" wide={false}>
          <SectionHeader
            mode="page"
            level="h1"
            subline="Open to internship and full-time conversations, hackathon teams, and collaborations on something real."
          >
            Lets talk.
          </SectionHeader>
        </Container>
      </Section>

      {/* ── 2. Opportunity Areas + 3. Contact Methods ── */}
      <Section spacing="tight">
        <Container className="max-w-[600px]" wide={false}>
          <ConnectStrip variant="page" resumePdfExists={pdfStatus.exists} />
        </Container>
      </Section>

      {/* ── Direct Contact Links ── */}
      <Section spacing="tight">
        <Container className="max-w-[600px]" wide={false}>
          <SectionHeader mode="label" level="h2">
            Direct Links
          </SectionHeader>
          <div className="mt-5 flex flex-col gap-3">
            <ContactLinkRow
              label="Email"
              value={SOCIAL_LINKS.email}
              href={`mailto:${SOCIAL_LINKS.email}`}
            />
            <ContactLinkRow
              label="GitHub"
              value="github.com/chukka-venugopalam"
              href={SOCIAL_LINKS.github}
              external
            />
            <ContactLinkRow
              label="LinkedIn"
              value="linkedin.com/in/chukka-venugopalam"
              href={SOCIAL_LINKS.linkedin}
              external
            />
            <ContactLinkRow
              label="LeetCode"
              value="leetcode.com/u/xifpLOmHqY"
              href={SOCIAL_LINKS.leetcode}
              external
            />
          </div>
        </Container>
      </Section>

      {/* ── 4. Current Focus ── */}
      <Section spacing="tight">
        <Container className="max-w-[600px]" wide={false}>
          <SectionHeader mode="label" level="h2">
            Current Focus
          </SectionHeader>
          {currentFocusProject ? (
            <>
              <p className="mt-4 text-body-md leading-[1.7] text-text-primary">
                Right now I am{" "}
                {currentFocusProject.frontmatter.status === "exploring"
                  ? "designing"
                  : "building"}{" "}
                <span className="text-text-primary font-medium">
                  {currentFocusProject.frontmatter.name}
                </span>
                {" "}—{" "}
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
              Between projects right now, see the Learning page for what is actively being worked through.
            </p>
          )}
        </Container>
      </Section>

      {/* ── 5. Collaboration CTA ── */}
      <Section spacing="tight" className="pb-0">
        <Container className="max-w-[600px]" wide={false}>
          <div className="rounded-card border border-border-subtle p-6 desktop:p-8">
            <h2 className="text-heading-md text-text-primary">
              Building something? Hiring for something?
            </h2>
            <p className="mt-3 text-body-md text-text-secondary">
              Either way, the fastest path is a direct message. I read everything that comes through email.
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

function ContactLinkRow({
  label,
  value,
  href,
  external = false,
}: {
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="flex items-center justify-between rounded-card border border-border-subtle p-4 transition-colors duration-fast ease-standard hover:border-border-default hover:bg-bg-secondary focus-visible:outline-none focus-visible:focus-ring"
    >
      <div>
        <span className="block text-mono-sm uppercase tracking-[0.08em] text-text-tertiary">
          {label}
        </span>
        <span className="mt-0.5 block text-body-md text-text-primary">{value}</span>
      </div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="text-text-tertiary shrink-0"
      >
        <path d="M7 17L17 7M7 7h10v10" />
      </svg>
    </a>
  );
}
