import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { LinksFunction } from "react-router";

import "./styles/index.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Geist+Mono:wght@400;500&display=swap",
  },
];

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

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-paper text-ink font-serif antialiased min-h-screen">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: { error: any }) {
  let heading = "Something went wrong.";
  let detail: string | undefined;

  if (isRouteErrorResponse(error)) {
    heading = `${error.status} ${error.statusText}`;
    detail = error.data;
  } else if (error instanceof Error) {
    detail = error.message;
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-32">
      <p className="mono-label text-accent">Error</p>
      <h1 className="mt-4 font-serif text-4xl font-light tracking-tight">
        {heading}
      </h1>
      {detail ? <p className="mt-4 text-ink-muted">{detail}</p> : null}
      <a href="/" className="link mt-8 inline-block">
        Return home
      </a>
    </main>
  );
}
