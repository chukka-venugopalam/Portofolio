import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c0c0f",
          borderRadius: "6px",
          color: "#6690b3",
        }}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 27 8 A 14.5 14.5 0 1 0 27 32"
            stroke="currentColor"
            strokeWidth="2.8"
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
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="21" cy="20" r="2.2" fill="currentColor" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
