import type { Metadata, Viewport } from "next";
import { Archivo, Bricolage_Grotesque, IBM_Plex_Mono } from "next/font/google";
import { SiteChrome } from "@/components/site-chrome";

import "@/styles/index.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-bricolage",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0e11" },
  ],
};

const description =
  "Product engineer on the surface, design systems engineer underneath: features, components, design tokens, and tooling. Currently at MagicSchool AI.";

export const metadata: Metadata = {
  metadataBase: new URL("https://adamstankiewicz.dev"),
  title: "Adam Stankiewicz · Product Engineering & Design Systems",
  description,
  openGraph: {
    title: "Adam Stankiewicz",
    description,
    url: "/",
    siteName: "adamstankiewicz.dev",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Adam Stankiewicz",
    description,
  },
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
      className={`${bricolage.variable} ${archivo.variable} ${plexMono.variable}`}
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
