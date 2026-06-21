import { ImageResponse } from "next/og";

// Code-generated social card (1200x630), themed to match the dark terminal
// site. No static asset to maintain; Next wires it into og:image automatically.
export const alt = "Muhammad Marzouk Baig, ML Engineer and Applied Researcher";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#0d0d12",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", color: "#22c55e", fontSize: 30, marginBottom: 28 }}>
          ~/marzouk $
        </div>
        <div style={{ display: "flex", color: "#f0f0f0", fontSize: 66, fontWeight: 700, lineHeight: 1.1 }}>
          Muhammad Marzouk Baig
        </div>
        <div style={{ display: "flex", color: "#16c5e8", fontSize: 38, marginTop: 24 }}>
          ML Engineer & Applied Researcher
        </div>
        <div style={{ display: "flex", color: "#888899", fontSize: 26, marginTop: 44 }}>
          MS AI @ Northeastern
        </div>
      </div>
    ),
    { ...size }
  );
}
