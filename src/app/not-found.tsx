import Link from "next/link";

export default function NotFound() {
  return (
    <section className="py-32 sm:py-44">
      <p className="mono-label text-accent">Err 404 — Off course</p>
      <h1 className="mt-6 font-serif text-[clamp(2.5rem,7vw,5rem)] font-light leading-none tracking-tight">
        You've drifted off the flight plan.
      </h1>
      <p className="mt-6 max-w-xl text-[1.0625rem] leading-[1.7] text-ink-muted">
        This address doesn't exist on the chart. Turn back toward the field.
      </p>
      <Link href="/" className="mono-link mt-10 inline-block">
        Return to the field ↗
      </Link>
    </section>
  );
}
