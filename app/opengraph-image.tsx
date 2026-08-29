import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

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
          backgroundColor: "#0c0c0f",
          color: "#ececea",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "24px" }}>
          <svg
            width="72"
            height="72"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: "#6690b3" }}
          >
            <path
              d="M 27 8 A 14.5 14.5 0 1 0 27 32"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              fill="none"
            />
            <ellipse
              cx="20"
              cy="20"
              rx="14.5"
              ry="6"
              transform="rotate(-22 20 20)"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
              opacity="0.45"
            />
            <path
              d="M 14 15 L 21 28 L 28 15"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="21" cy="20" r="2.2" fill="currentColor" />
          </svg>
          <div style={{ fontSize: 56, fontWeight: 600 }}>{SITE_NAME}</div>
        </div>
        <div style={{ fontSize: 28, color: "#97969c" }}>
          {SITE_TAGLINE}
        </div>
      </div>
    ),
    { ...size }
  );
}
