import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "M&M Pro Construction — General Contractor in College Station, TX";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  // Read the logo as base64 for embedding
  let logoSrc: string | null = null;
  try {
    const logoData = await readFile(
      join(process.cwd(), "public", "mm-pro-logo.png")
    );
    logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;
  } catch {
    // Logo not found — render without it
  }

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
          background: "linear-gradient(135deg, #0A1628 0%, #132039 50%, #0A1628 100%)",
          padding: "60px",
        }}
      >
        {/* Gold accent line */}
        <div
          style={{
            width: "80px",
            height: "3px",
            background: "#C8963E",
            marginBottom: "32px",
          }}
        />

        {/* Logo */}
        {logoSrc && (
          <img
            src={logoSrc}
            width={80}
            height={80}
            style={{ marginBottom: "24px" }}
          />
        )}

        {/* Company name */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span
            style={{
              fontSize: "56px",
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "-1px",
              lineHeight: 1.1,
            }}
          >
            M&M Pro Construction
          </span>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#C8963E",
              letterSpacing: "4px",
              textTransform: "uppercase" as const,
              marginTop: "8px",
            }}
          >
            General Contractor
          </span>
        </div>

        {/* Tagline */}
        <span
          style={{
            fontSize: "22px",
            color: "#94A3B8",
            marginTop: "24px",
            lineHeight: 1.4,
            textAlign: "center",
          }}
        >
          Commercial & Residential Construction — College Station, TX
        </span>

        {/* Bottom service bar */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            marginTop: "40px",
            alignItems: "center",
          }}
        >
          {["Build-Outs", "Outdoor Living", "Remodeling", "Lighting"].map(
            (service) => (
              <div
                key={service}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#C8963E",
                  }}
                />
                <span
                  style={{
                    fontSize: "16px",
                    color: "#CBD5E1",
                  }}
                >
                  {service}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
