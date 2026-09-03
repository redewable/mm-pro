import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getSiteContent } from "@/lib/content/server";

// Default social share image (Facebook, iMessage, X, LinkedIn). Applies to
// every page unless a page or project sets its own share image. Reads the
// business details from the dashboard so it never goes stale.
export const alt = "M&M Pro Construction — General Contractor, College Station TX";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const c = await getSiteContent();
  const b = c.business;

  let logoSrc: string | null = null;
  try {
    const logo = await readFile(join(process.cwd(), "public", "mm-pro-logo.png"));
    logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  } catch {
    // render without the mark
  }

  const [first, ...rest] = b.name.split(" ");
  const brandTop = rest.length ? `${first} ${rest[0]}` : first; // "M&M Pro"
  const brandBottom = rest.slice(1).join(" ") || "Construction";
  const area = b.serviceAreaSummary.replace(/^Serving\s+/i, "");
  const domain = c.seo.siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0A1628",
          position: "relative",
          fontFamily: "sans-serif",
          color: "#FFFFFF",
        }}
      >
        {/* diagonal gold sweep echoing the lightning bolt */}
        <div
          style={{
            position: "absolute",
            left: -140,
            top: -120,
            width: 620,
            height: 900,
            background: "linear-gradient(160deg, #132039 0%, #0A1628 100%)",
            transform: "skewX(-12deg)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 452,
            top: -60,
            width: 10,
            height: 760,
            background: "#C8963E",
            transform: "skewX(-12deg)",
            display: "flex",
          }}
        />

        {/* left: mark */}
        <div
          style={{
            width: 470,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {logoSrc && (
            <img src={logoSrc} alt="" width={330} height={330} />
          )}
        </div>

        {/* right: words */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 72px 0 64px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 76, fontWeight: 800, letterSpacing: -2, lineHeight: 1 }}>{brandTop}</span>
            <span
              style={{
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: 9,
                color: "#C8963E",
                textTransform: "uppercase",
                marginTop: 12,
              }}
            >
              {brandBottom}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", marginTop: 40, marginBottom: 40 }}>
            <div style={{ width: 48, height: 3, background: "#C8963E", display: "flex" }} />
            <span style={{ fontSize: 30, color: "#F1F5F9", marginLeft: 18, fontWeight: 600 }}>{b.tagline}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", fontSize: 24, color: "#94A3B8", lineHeight: 1.5 }}>
            <span style={{ display: "flex" }}>
              General Contractor · {b.city}, {b.region}
            </span>
            <span style={{ display: "flex" }}>{area}</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 44,
              paddingTop: 24,
              borderTop: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <span style={{ fontSize: 30, fontWeight: 700, color: "#FFFFFF" }}>{b.phone}</span>
            <span style={{ fontSize: 22, color: "#C8963E", fontWeight: 600 }}>{domain}</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
