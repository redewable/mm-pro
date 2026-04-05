import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A1628",
          borderRadius: "36px",
        }}
      >
        <span
          style={{
            fontSize: "72px",
            fontWeight: 800,
            color: "#C8963E",
            letterSpacing: "-2px",
            lineHeight: 1,
          }}
        >
          M&M
        </span>
        <span
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "#94A3B8",
            letterSpacing: "6px",
            marginTop: "4px",
            textTransform: "uppercase" as const,
          }}
        >
          PRO
        </span>
      </div>
    ),
    { ...size }
  );
}
