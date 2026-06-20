import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllProjects } from "@/lib/content/projects";

/**
 * Dynamic sitemap — Implementation Blueprint Section 7.6. Derived from
 * the same getAllProjects() helper every page uses, so this never needs
 * manual updates when a project is added; it regenerates correctly on
 * every build.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1.0 },
    { url: `${SITE_URL}/work`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/learning`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/resume`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/connect`, changeFrequency: "yearly", priority: 0.7 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = getAllProjects().map(
    (project) => ({
      url: `${SITE_URL}/work/${project.frontmatter.slug}`,
      lastModified: project.frontmatter.lastUpdated,
      changeFrequency: "weekly",
      priority: project.frontmatter.featured ? 0.9 : 0.7,
    })
  );

  return [...staticRoutes, ...projectRoutes];
}
