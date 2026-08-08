interface SectionHeaderProps {
  number: string;
  title: string;
  annotation?: string;
}

export function SectionHeader({ number, title, annotation }: SectionHeaderProps) {
  return (
    <div className="relative flex items-baseline justify-between border-t border-line-strong pt-4">
      <span className="ghost-numeral" aria-hidden="true">
        {number}
      </span>
      <h2 className="mono-label">
        <span className="text-accent">§ {number}</span>
        <span className="ml-3">{title}</span>
      </h2>
      {annotation ? (
        <p className="mono-label hidden text-ink-muted sm:block">{annotation}</p>
      ) : null}
    </div>
  );
}
