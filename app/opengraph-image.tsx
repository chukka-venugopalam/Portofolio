import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

/**
 * Default OG image — Implementation Blueprint Section 7.4. Generated
 * from the same design tokens as the rest of the site (dark background,
 * accent teal, the same type system) via Next's built-in ImageResponse,
 * rather than a static designed PNG — this guarantees visual consistency
 * between the site and how it appears when shared, with no separate
 * design-tool pass required.
 *
 * Per-project OG images (app/work/[slug]/opengraph-image.tsx) follow
 * this same pattern but substitute project name/status/oneLiner for the
 * site-wide tagline — see that file's own implementation when page code
 * is in scope.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#0a0a0b",
          color: "#f2f2f0",
          padding: "80px",
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 600 }}>{SITE_NAME}</div>
        <div style={{ fontSize: 28, color: "#a3a3aa", marginTop: 24 }}>
          {SITE_TAGLINE}
        </div>
      </div>
    ),
    { ...size }
  );
}
