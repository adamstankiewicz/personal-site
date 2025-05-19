import type { ExperienceItemProps } from './types';
import { CompanyHeader } from './CompanyHeader';
import { PositionList } from './PositionList';
import { TechnologyTags } from './TechnologyTags';

export function ExperienceItem({
  company,
  companyUrl,
  period,
  positions,
  description,
  technologies,
}: ExperienceItemProps) {
  return (
    <li className="mb-24">
      <div className="grid pb-1 sm:grid-cols-8 sm:gap-8">
        <div className="mb-2 mt-1 sm:col-span-2">
          <header className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {period}
          </header>
        </div>
        <div className="sm:col-span-6">
          <CompanyHeader company={company} companyUrl={companyUrl} />
          <PositionList positions={positions} />
          <p className={`${company ? 'mt-4' : ''} text-sm leading-normal text-slate-700`}>
            {description}
          </p>
          <TechnologyTags technologies={technologies} />
        </div>
      </div>
    </li>
  );
}
