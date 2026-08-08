import type { Metadata } from "next";
import { Newsreader, Geist_Mono } from "next/font/google";
import { SiteChrome } from "@/components/site-chrome";

import "@/styles/index.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-newsreader",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adam Stankiewicz — Senior Design Systems Engineer",
  description:
    "Engineer working the seam between design and engineering — design systems and the platforms around them, frontend architecture, REST APIs, accessibility, and AI tooling measured before rollout.",
};

// Applies the persisted (or system) theme before first paint to avoid a flash.
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var dark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (dark) document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-paper text-ink font-serif antialiased min-h-screen">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
