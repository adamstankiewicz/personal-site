import { Link } from "react-router";

export default function NotFound() {
  return (
    <section className="py-32 sm:py-44">
      <p className="mono-label text-accent">Err 404</p>
      <h1 className="mt-6 font-serif text-[clamp(2.5rem,7vw,5rem)] font-light leading-none tracking-tight">
        Nothing lives at this address.
      </h1>
      <Link to="/" className="mono-link mt-10 inline-block">
        Return to the index ↗
      </Link>
    </section>
  );
}
