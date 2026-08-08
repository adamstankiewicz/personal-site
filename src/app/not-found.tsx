import Link from "next/link";

export default function NotFound() {
  return (
    <section className="py-32 sm:py-44">
      <p className="mono-label text-accent">Error 404</p>
      <h1 className="display-title mt-6 text-[clamp(2.25rem,6vw,4rem)]">
        This page doesn’t exist.
      </h1>
      <p className="mt-6 max-w-xl text-[1.0625rem] leading-[1.7] text-ink-muted">
        The address may have moved or never existed. Everything worth seeing is
        on the home page.
      </p>
      <Link href="/" className="mono-link mt-10 inline-block">
        ← Back to home
      </Link>
    </section>
  );
}
