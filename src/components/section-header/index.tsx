interface SectionHeaderProps {
  number: string;
  title: string;
  annotation?: string;
}

export function SectionHeader({ number, title, annotation }: SectionHeaderProps) {
  return (
    <div className="relative flex items-baseline justify-between border-t-2 border-line-strong pt-4">
      <span className="ghost-numeral" aria-hidden="true">
        {number}
      </span>
      <h2 className="flex items-baseline gap-3">
        <span className="mono-label text-accent">Panel {number}</span>
        <span className="condensed-caps text-[0.8125rem]">{title}</span>
        <span className="panel-stamp" aria-hidden="true">
          ✓
        </span>
      </h2>
      {annotation ? (
        <p className="mono-label hidden text-ink-muted sm:block">{annotation}</p>
      ) : null}
    </div>
  );
}
