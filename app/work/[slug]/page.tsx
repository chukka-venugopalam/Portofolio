import { Suspense } from "react";
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
import { TradeoffsBlock } from "@/components/project/TradeoffsBlock";
import { StatusFooter } from "@/components/project/StatusFooter";
import { BackLink } from "@/components/project/BackLink";
import { getMDXComponents } from "@/mdx-components";

/**
 * Project Detail page — PRD Part 9 (Project Page Blueprint), Visual
 * Design Spec Section 3, Component Library D2-D5.
 *
 * Seven sections, in this exact requested order:
 *   1. Project Header     — ProjectHeader (name, status, one-liner,
 *                            tech tags, live links — Component Library D2)
 *   2. Problem             — plain MDX prose
 *   3. What It Does         — plain MDX prose
 *   4. Architecture          — "How It's Built" content (PRD Part 9 names
 *                              this section "How It's Built"; "Architecture"
 *                              in this task's structure refers to the same
 *                              section — see the note below)
 *   5. Decisions & Tradeoffs  — TradeoffsBlock, the most differentiated
 *                                section on the page (Component Library D3)
 *   6. What's Next             — plain MDX prose
 *   7. Project Metadata Footer  — StatusFooter (Component Library D4)
 *
 * Naming note: this task's requested structure calls section 4
 * "Architecture." The PRD's Project Page Blueprint and every existing
 * content schema (content/projects/_schema.ts's ProjectSections,
 * lib/content/projects.ts's SECTION_HEADINGS) name this same section
 * "How It's Built" — same content slot, two names for it across
 * documents written at different times. Reusing the EXISTING schema
 * field (howItsBuilt) here rather than introducing a parallel
 * "architecture" field avoids a duplicate, divergent content model for
 * what is unambiguously the same section. The page's visible label
 * below renders as "How It's Built" to stay consistent with every
 * project MDX file's actual required heading — renaming the rendered
 * label without renaming the underlying required MDX heading would
 * silently break content validation for the same reason.
 *
 * Static generation (Implementation Blueprint 6.1/6.2): every project
 * page is pre-rendered at build time via generateStaticParams, which
 * also triggers getAllProjects()'s frontmatter validation — an invalid
 * project file fails the build here, not silently at runtime.
 *
 * MDX rendering: each of the four prose sections (problem, whatItDoes,
 * howItsBuilt, whatsNext) is raw markdown text already split out of the
 * project's MDX body by lib/content/projects.ts's splitIntoSections().
 * Rendered here via next-mdx-remote-client's RSC MDXRemote, which is an
 * async Server Component — wrapped in <Suspense> per the package's
 * documented pattern, since MDX compilation is itself async work.
 */

export function generateStaticParams() {
  return getAllProjects().map((project) => ({
    slug: project.frontmatter.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  if (!project) return {};

  return buildMetadata({
    title: project.frontmatter.name,
    description: project.frontmatter.oneLiner,
    pathname: `/work/${project.frontmatter.slug}`,
  });
}

export default function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProjectBySlug(params.slug);

  // ── Missing project ──
  // notFound() triggers app/work/[slug]/not-found.tsx — the
  // project-specific 404, more useful than the site-wide one for a
  // visitor who followed a shared link to a project that's since been
  // renamed or removed (Implementation Blueprint 1.4).
  if (!project) {
    notFound();
  }

  const { frontmatter, sections } = project;

  // Decisions & Tradeoffs is parsed once here, at the page level, since
  // parseTradeoffs() throws on malformed/empty content — letting that
  // throw happen during this page's render (which only happens for
  // slugs that passed generateStaticParams, i.e. at build time for
  // static generation) keeps the same fail-loudly-at-build-time
  // guarantee the rest of the content pipeline already has.
  const decisions = parseTradeoffs(sections.tradeoffs, frontmatter.slug);

  const projectJsonLd = buildProjectJsonLd(project);
  const mdxComponents = getMDXComponents({});

  return (
    <>
      {/* Per-project structured data (Implementation Blueprint 7.5) —
          lower priority than the site-wide Person schema already
          injected in app/layout.tsx, but additive here, not a
          replacement. Unique id (scoped to this project's slug) avoids
          any collision with layout.tsx's "person-jsonld" script and
          with this same script across different project pages, since
          Next.js dedupes <Script> instances by id within a navigation. */}
      <Script
        id={`project-jsonld-${frontmatter.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />

      {/* ── 1. Project Header ── */}
      <Section spacing="tight" className="pt-0">
        <Container className="max-w-[760px]" wide={false}>
          <BackLink className="mb-6" />
          <ProjectHeader project={frontmatter} />
        </Container>
      </Section>

      {/* ── 2. Problem ── */}
      <ProseSection
        label="The Problem"
        content={sections.problem}
        mdxComponents={mdxComponents}
      />

      {/* ── 3. What It Does ── */}
      <ProseSection
        label="What It Does"
        content={sections.whatItDoes}
        mdxComponents={mdxComponents}
      />

      {/* ── 4. Architecture ("How It's Built") ── */}
      <ProseSection
        label="How It's Built"
        content={sections.howItsBuilt}
        mdxComponents={mdxComponents}
      />

      {/* ── 5. Decisions & Tradeoffs ── */}
      <Section spacing="tight">
        <Container className="max-w-[760px]" wide={false}>
          <TradeoffsBlock decisions={decisions} headingLevel="h2" />
        </Container>
      </Section>

      {/* ── 6. What's Next ── */}
      <ProseSection
        label="What's Next"
        content={sections.whatsNext}
        mdxComponents={mdxComponents}
      />

      {/* ── 7. Project Metadata Footer ── */}
      <Section spacing="tight" className="pb-0">
        <Container className="max-w-[760px]" wide={false}>
          <StatusFooter
            startedDate={frontmatter.startedDate}
            lastUpdated={frontmatter.lastUpdated}
          />
        </Container>
      </Section>
    </>
  );
}

/**
 * ProseSection
 *
 * Local to this page — renders one of the four plain-prose project
 * sections (Problem, What It Does, How It's Built, What's Next) with a
 * consistent SectionHeader label + MDX body, per Visual Design Spec
 * Section 3's seven-section structure.
 *
 * Missing optional sections: every field in ProjectSections is actually
 * REQUIRED by lib/content/projects.ts's splitIntoSections() (it throws
 * at build time if any of the five headings is absent — see that
 * file's docstring). So by the time this component renders, `content`
 * is guaranteed non-empty for a successfully-built page. The guard
 * below is kept anyway as defense-in-depth: if a future content-model
 * change ever makes a section genuinely optional, this component
 * already degrades gracefully (omits itself) rather than rendering an
 * empty, oddly-spaced section with a label and nothing under it.
 */
function ProseSection({
  label,
  content,
  mdxComponents,
}: {
  label: string;
  content: string;
  mdxComponents: ReturnType<typeof getMDXComponents>;
}) {
  if (!content || content.trim().length === 0) {
    return null;
  }

  return (
    <Section spacing="tight">
      <Container className="max-w-[760px]" wide={false}>
        <SectionHeader mode="label" level="h2">
          {label}
        </SectionHeader>
        <div className="mt-5 text-body-md leading-[1.7] text-text-primary">
          <Suspense fallback={<ProseFallback />}>
            <MDXRemote source={content} components={mdxComponents} />
          </Suspense>
        </div>
      </Container>
    </Section>
  );
}

/** Lightweight loading state while MDX compiles — this is async Server
 *  Component work, so Suspense needs a fallback even though, for fully
 *  statically-generated pages, this resolves at build time and is
 *  rarely visibly shown in production. */
function ProseFallback() {
  return (
    <div className="space-y-2" aria-hidden="true">
      <div className="h-4 w-full rounded bg-bg-tertiary" />
      <div className="h-4 w-5/6 rounded bg-bg-tertiary" />
      <div className="h-4 w-4/6 rounded bg-bg-tertiary" />
    </div>
  );
}
