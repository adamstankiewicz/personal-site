import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Adam Stankiewicz — Product Engineering & Design Systems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Rendered once at build time; mirrors the site's hero: paper white,
// a cobalt tick, display-weight name, quiet mono metadata line.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", width: 64, height: 10, background: "#1435e5" }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 700, color: "#111114", letterSpacing: "-0.03em" }}>
            Adam Stankiewicz
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "#5b5c66", marginTop: 18 }}>
            Product Engineering &amp; Design Systems
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#8b8c96",
            borderTop: "1px solid #e7e7e9",
            paddingTop: 28,
          }}
        >
          <span>adamstankiewicz.dev</span>
          <span style={{ color: "#1435e5" }}>The Index</span>
        </div>
      </div>
    ),
    size
  );
}
