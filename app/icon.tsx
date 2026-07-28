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
          background: "#090d16",
          borderRadius: "8px",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="icon-g1" x1="4" y1="4" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <linearGradient id="icon-g2" x1="40" y1="4" x2="4" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>
          <circle cx="22" cy="22" r="19" stroke="url(#icon-g1)" strokeWidth="1.5" opacity="0.4" />
          <path
            d="M 22 7 C 32 7, 37 14, 37 22 C 37 30, 28 37, 18 35 C 10 33, 7 25, 11 17 C 14 11, 20 7, 22 7 Z"
            stroke="url(#icon-g1)"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M 12 12 L 22 35 L 32 12"
            stroke="url(#icon-g2)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="22" cy="22" r="4" fill="#ffffff" />
          <circle cx="22" cy="22" r="7" fill="#14b8a6" opacity="0.4" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
