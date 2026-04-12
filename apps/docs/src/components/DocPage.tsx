import type { ReactNode } from 'react';
import './DocPage.css';

interface DocPageProps {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}

export function DocPage({ title, description, children }: DocPageProps) {
  return (
    <div className="doc-page">
      <div className="doc-page__header">
        <h1 className="doc-page__title">{title}</h1>
        {description && (
          <p className="doc-page__description">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
