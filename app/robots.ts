import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

/**
 * Implementation Blueprint Section 7.7 — allows all crawling, since
 * nothing on this site should be hidden from search engines. Points to
 * the SITE_URL-based sitemap, never a hardcoded domain.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
