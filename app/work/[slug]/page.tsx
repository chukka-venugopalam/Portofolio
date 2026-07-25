import { Fragment, Suspense } from "react";
import { notFound } from "next/navigation";
import Script from "next/script";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import {
  getAllProjects,
  getProjectBySlug,
  parseTradeoffs,
} from "@/lib/content/projects";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildProjectJsonLd } from "@/lib/seo/structured-data";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { ProjectActionButtons } from "@/components/project/ProjectActionButtons";
import { TradeoffsBlock } from "@/components/project/TradeoffsBlock";
import { StatusFooter } from "@/components/project/StatusFooter";
import { BackLink } from "@/components/project/BackLink";
import { ProjectCover } from "@/components/project/ProjectCover";
import { Button } from "@/components/ui/Button";
import { getMDXComponents } from "@/mdx-components";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return getAllProjects().map((project) => ({
    slug: project.frontmatter.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return buildMetadata({
    title: project.frontmatter.name,
    description: project.frontmatter.oneLiner,
    pathname: `/work/${project.frontmatter.slug}`,
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const { frontmatter, sections } = project;
  const decisions = parseTradeoffs(sections.tradeoffs, frontmatter.slug);
  const projectJsonLd = buildProjectJsonLd(project);
  const mdxComponents = getMDXComponents({});
  const isFlagship = frontmatter.category === "flagship";

  return (
    <>
      <Script
        id={`project-jsonld-${frontmatter.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />

      {/* ── Back link + Project Header ── */}
      <Section spacing="tight" className="pt-0">
        <Container className="max-w-[800px]" wide={false}>
          <BackLink className="mb-6" />
          <ProjectHeader project={frontmatter} />
        </Container>
      </Section>

      {/* ── Cover Art Banner (flagship only) ── */}
      {isFlagship && frontmatter.coverArt && (
        <Section spacing="tight">
          <Container wide>
            <div className="relative overflow-hidden rounded-2xl aspect-[21/9] max-h-[420px]">
              <ProjectCover
                variant={frontmatter.coverArt}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/60 via-transparent to-transparent" />
            </div>
          </Container>
        </Section>
      )}

      {/* ── Engineering Case Study Content ── */}
      <div className="relative">
        {/* Side gradient decoration for reading experience */}
        <div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-accent/20 via-accent/5 to-transparent hidden desktop:block" style={{ left: "calc(50% - 400px)" }} />

        <div className="space-y-0">
          {/* ── 2. The Problem ── */}
          {sections.problem && (
            <PremiumSection label="The Problem" accent>
              <div className="prose prose-invert max-w-none text-body-md leading-[1.7] text-text-primary">
                <Suspense fallback={<ProseFallback />}>
                  <MDXRemote source={sections.problem} components={mdxComponents} />
                </Suspense>
              </div>
            </PremiumSection>
          )}

          {/* ── 3. What It Does ── */}
          {sections.whatItDoes && (
            <PremiumSection label="What It Does">
              <div className="prose prose-invert max-w-none text-body-md leading-[1.7] text-text-primary">
                <Suspense fallback={<ProseFallback />}>
                  <MDXRemote source={sections.whatItDoes} components={mdxComponents} />
                </Suspense>
              </div>
            </PremiumSection>
          )}

          {/* ── 4. Architecture / How It's Built ── */}
          {sections.howItsBuilt && (
            <PremiumSection label="Architecture &amp; How It's Built">
              <div className="prose prose-invert max-w-none text-body-md leading-[1.7] text-text-primary">
                <Suspense fallback={<ProseFallback />}>
                  <MDXRemote source={sections.howItsBuilt} components={mdxComponents} />
                </Suspense>
              </div>
            </PremiumSection>
          )}

          {/* ── 5. Decisions & Tradeoffs ── */}
          <Section spacing="tight">
            <Container className="max-w-[800px]" wide={false}>
              <TradeoffsBlock decisions={decisions} headingLevel="h2" />
            </Container>
          </Section>

          {/* ── 6. What's Next / Roadmap ── */}
          {sections.whatsNext && (
            <PremiumSection label="Roadmap &amp; What's Next">
              <div className="prose prose-invert max-w-none text-body-md leading-[1.7] text-text-primary">
                <Suspense fallback={<ProseFallback />}>
                  <MDXRemote source={sections.whatsNext} components={mdxComponents} />
                </Suspense>
              </div>
            </PremiumSection>
          )}
        </div>
      </div>

      {/* ── Tech Stack Summary ── */}
      <Section spacing="tight">
        <Container className="max-w-[800px]" wide={false}>
          <div className="rounded-2xl border border-border-subtle bg-bg-secondary p-6 desktop:p-8">
            <SectionHeader mode="label" level="h2">Technology Stack</SectionHeader>
            <div className="mt-5 grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-4 gap-3">
              {frontmatter.techTags.map((tech) => (
                <div
                  key={tech}
                  className="flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-tertiary/50 px-3 py-2"
                >
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent/60 shrink-0" />
                  <span className="text-mono-sm text-text-primary">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Action Links ── */}
      <Section spacing="tight">
        <Container className="max-w-[800px]" wide={false}>
          <div className="p-6 rounded-2xl glass">
            <span className="text-mono-sm uppercase tracking-[0.08em] text-text-tertiary block mb-4">
              Quick Links
            </span>
            <ProjectActionButtons
              project={frontmatter}
              currentSlug={frontmatter.slug}
              variant="footer"
            />
          </div>
        </Container>
      </Section>

      {/* ── 7. Project Metadata Footer ── */}
      <Section spacing="tight" className="pb-0">
        <Container className="max-w-[800px]" wide={false}>
          <StatusFooter
            startedDate={frontmatter.startedDate}
            lastUpdated={frontmatter.lastUpdated}
          />
        </Container>
      </Section>
    </>
  );
}

/** Premium section with label and optional accent styling */
function PremiumSection({
  label,
  children,
  accent = false,
}: {
  label: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <Section spacing="tight">
      <Container className="max-w-[800px]" wide={false}>
        <div className={cn(
          "relative",
          accent && "pl-5 border-l-2 border-accent/30"
        )}>
          <SectionHeader mode="label" level="h2">
            {label}
          </SectionHeader>
          <div className="mt-5">
            {children}
          </div>
        </div>
      </Container>
    </Section>
  );
}

function ProseFallback() {
  return (
    <div className="space-y-2" aria-hidden="true">
      <div className="h-4 w-full rounded bg-bg-tertiary" />
      <div className="h-4 w-5/6 rounded bg-bg-tertiary" />
      <div className="h-4 w-4/6 rounded bg-bg-tertiary" />
    </div>
  );
}
