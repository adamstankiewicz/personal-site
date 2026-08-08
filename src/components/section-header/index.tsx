interface SectionHeaderProps {
  number: string;
  title: string;
  annotation?: string;
}

export function SectionHeader({ number, title, annotation }: SectionHeaderProps) {
  return (
    <div className="relative flex items-baseline justify-between border-t border-line pt-5">
      <span className="ghost-numeral" aria-hidden="true">
        {number}
      </span>
      <h2 className="flex items-baseline gap-3">
        <span className="mono-label text-accent">{number}</span>
        <span className="title-md text-[1.125rem]">{title}</span>
      </h2>
      {annotation ? (
        <p className="mono-label hidden text-ink-muted sm:block">{annotation}</p>
      ) : null}
    </div>
  );
}
