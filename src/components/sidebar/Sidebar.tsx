import { Link } from "react-router";
import { Navigation } from "./Navigation";

export function Sidebar() {
  return (
    <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-[48%] lg:flex-col lg:justify-between lg:py-24">
      <div>
        <h1 className="text-5xl font-bold tracking-tight sm:text-5xl text-sky-700">
          <Link to="/" className="hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded">
            Adam Stankiewicz
          </Link>
        </h1>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-2xl">
          Principal Software Engineer
        </h2>
        <p className="mt-1 text-xl font-light tracking-tight">
          Design Systems &bull; Frontend &bull; Backend
        </p>
        <p className="mt-4 max-w-xs leading-normal tracking-tight">
          I build intuitive web solutions that transform complex ideas into user-friendly and accessible products.
        </p>

        {/* Navigation */}
        <Navigation />

        {/* Download Resume Button */}
        <div className="mt-12">
          <Link
            to="/public/pdfs/Adam_Stankiewicz_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center rounded-md border border-sky-700 bg-sky-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-sky-800 hover:border-sky-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1"
            reloadDocument
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download résumé
          </Link>
        </div>

        {/* Social Links */}
        <div className="mt-8 pt-6 flex space-x-4">
          <a
            href="https://github.com/adamstankiewicz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-sky-700 transition-colors"
            aria-label="GitHub profile"
            title="GitHub"
          >
            <span className="sr-only">GitHub</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/stankiewiczadam"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-sky-700 transition-colors"
            aria-label="LinkedIn profile"
            title="LinkedIn"
          >
            <span className="sr-only">LinkedIn</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a
            href="https://scholar.google.com/citations?user=lJSHz8QAAAAJ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-sky-700 transition-colors"
            aria-label="Google Scholar profile"
            title="Google Scholar"
          >
            <span className="sr-only">Google Scholar</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
