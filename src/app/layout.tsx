import type { Metadata, Viewport } from "next";
import { Archivo, Bricolage_Grotesque, IBM_Plex_Mono } from "next/font/google";
import { SiteChrome } from "@/components/site-chrome";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/site";

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

const description = SITE_DESCRIPTION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    card: "summary_large_image",
    title: "Adam Stankiewicz",
    description,
  },
};

// Applies the persisted (or system) theme and contrast before first
// paint to avoid a flash.
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var dark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (dark) document.documentElement.classList.add("dark");
    if (localStorage.getItem("contrast") === "high") document.documentElement.classList.add("hc");
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
        {/* Cloudflare Web Analytics: free, cookieless, no consent
            banner needed. Baked in only when the token is present at
            build time; absent, the site ships no analytics at all. */}
        {process.env.NEXT_PUBLIC_CF_BEACON_TOKEN ? (
          <script
            type="module"
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({
              token: process.env.NEXT_PUBLIC_CF_BEACON_TOKEN,
            })}
          />
        ) : null}
      </body>
    </html>
  );
}
