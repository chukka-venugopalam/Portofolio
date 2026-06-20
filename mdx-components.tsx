import type { MDXComponents } from "mdx/types";
import Image, { type ImageProps } from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";

/**
 * Custom MDX component mapping — Implementation Blueprint Section 3.3.
 * Required even though this project's primary MDX rendering path is
 * next-mdx-remote-client (not @next/mdx's page.mdx convention): this
 * file is still the conventional place to define the components object
 * passed into <MDXRemote components={...} />, keeping that mapping in
 * one canonical location rather than redefined per call site.
 *
 * Per the spec: images render through next/image automatically
 * (Implementation Blueprint 8.3's performance requirement, satisfied
 * here without depending on whoever writes a project's MDX content to
 * remember to do this by hand each time).
 *
 * Heading note: each ProjectSections field (problem, whatItDoes, etc.)
 * has ALREADY had its own top-level section heading stripped out by
 * lib/content/projects.ts's splitIntoSections() — the page component
 * renders that section's title itself via SectionHeader in "label"
 * mode. Any h2/h3 that appears WITHIN a section's MDX body is therefore
 * a sub-heading inside that section's prose (e.g. "## Data Flow" inside
 * "How It's Built"), not the section title — it should render smaller
 * and more contained than a page-level section label. Mapped to
 * SectionHeader's "label" mode at h3, which is visually compact enough
 * not to be mistaken for a top-level section opener while still
 * producing a real heading element for the page's outline.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        {...(props as ImageProps)}
      />
    ),
    h2: ({ children }) => (
      <SectionHeader mode="label" level="h3" className="mt-8 mb-3">
        {children}
      </SectionHeader>
    ),
    h3: ({ children }) => (
      <SectionHeader mode="label" level="h3" className="mt-6 mb-2">
        {children}
      </SectionHeader>
    ),
    ...components,
  };
}

/**
 * Plain-function alias of useMDXComponents, for use at direct call sites
 * like app/work/[slug]/page.tsx. The `useMDXComponents` name and export
 * shape is the required @next/mdx App Router file convention (auto-
 * discovered by Next's tooling if that integration path is ever
 * adopted) — but this project renders MDX via next-mdx-remote-client
 * instead, calling this function directly inside a Server Component
 * body. It contains no hooks (no useState/useContext/etc.), so direct
 * calls are functionally safe; this alias just avoids the `use`-prefix
 * naming implying hook semantics it doesn't actually have here.
 */
export const getMDXComponents = useMDXComponents;
