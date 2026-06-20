import type { Metadata } from "next";
import { SITE_URL, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

/**
 * Shared metadata builder — per Implementation Blueprint Section 7.2,
 * every page extends this rather than constructing a Metadata object
 * from scratch, which is what guarantees no page can accidentally ship
 * without a canonical tag or with an inconsistent site name.
 */
interface BuildMetadataOptions {
  title: string;
  description: string;
  pathname: string; // e.g. "/work" or "/work/concept-intelligence-platform"
  /** Defaults to the site-wide OG image (app/opengraph-image.tsx) if omitted. */
  ogImagePath?: string;
}

export function buildMetadata({
  title,
  description,
  pathname,
  ogImagePath,
}: BuildMetadataOptions): Metadata {
  const url = `${SITE_URL}${pathname}`;

  return {
    title: `${title} — ${SITE_NAME}`,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: ogImagePath ? [{ url: `${SITE_URL}${ogImagePath}` }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/**
 * Home's metadata is a special case (Implementation Blueprint 7.2): its
 * title is the positioning line itself, not a "[Page] — [Name]" pattern,
 * since this is frequently what shows as the clickable headline in a
 * search result or link preview.
 */
export function buildHomeMetadata(): Metadata {
  const url = SITE_URL;

  return {
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_TAGLINE,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      title: SITE_NAME,
      description: SITE_TAGLINE,
      url,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description: SITE_TAGLINE,
    },
  };
}
