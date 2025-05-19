import React from 'react';

interface CompanyHeaderProps {
  company?: string;
  companyUrl?: string;
  isProject?: boolean;
}

export function CompanyHeader({ company, companyUrl }: CompanyHeaderProps) {
  if (!company) return null;
  return (
    <h3 className="mb-4">
      <a 
        href={companyUrl || '#'}
        target="_blank"
        rel="noreferrer noopener"
        className={`inline-flex items-baseline font-semibold leading-tight text-base transition-colors ${companyUrl ? 'text-sky-600 hover:text-sky-800 focus-visible:text-sky-800' : 'text-slate-900 dark:text-white'}`}
      >
        <span className="inline-flex items-center">
          {company}
          {companyUrl && (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              className="ml-1 inline-block h-4 w-4 shrink-0 transition-transform" 
              aria-hidden="true"
            >
              <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
            </svg>
          )}
        </span>
      </a>
    </h3>
  );
}
