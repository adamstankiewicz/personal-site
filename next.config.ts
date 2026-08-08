import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site — pre-rendered HTML served from Netlify's CDN.
  output: "export",
};

export default nextConfig;
