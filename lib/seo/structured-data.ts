import { SITE_URL, SITE_NAME, SOCIAL_LINKS } from "@/lib/constants";
import type { Project } from "@/content/projects/_schema";

/**
 * Person schema — per Implementation Blueprint Section 7.5, this is the
 * highest-priority structured data on the site (more important than any
 * per-project schema) since it's the most direct signal for "recruiter
 * searches the owner's name" discovery. Injected once in the root
 * layout, not per-page.
 */
export function buildPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    url: SITE_URL,
    sameAs: [SOCIAL_LINKS.github, SOCIAL_LINKS.linkedin],
  };
}

/**
 * SoftwareSourceCode schema for an individual project page — lower
 * priority than Person per the Implementation Blueprint; include this
 * once Person is confirmed working, not before.
 */
export function buildProjectJsonLd(project: Project) {
  const { frontmatter } = project;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: frontmatter.name,
    description: frontmatter.oneLiner,
    codeRepository: frontmatter.links.code,
    programmingLanguage: frontmatter.techTags,
    dateCreated: frontmatter.startedDate,
    dateModified: frontmatter.lastUpdated,
  };
}
