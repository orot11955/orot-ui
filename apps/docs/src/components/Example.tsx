import type { ReactNode } from 'react';
import { useState } from 'react';
import './Example.css';

interface ExampleProps {
  title?: string;
  description?: ReactNode;
  code: string;
  children: ReactNode;
}

export function Example({ title, description, code, children }: ExampleProps) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="example">
      {(title || description) && (
        <div className="example__meta">
          {title && <div className="example__title">{title}</div>}
          {description && <div className="example__description">{description}</div>}
        </div>
      )}
      <div className="example__preview">{children}</div>
      <div className="example__footer">
        <button
          className="example__code-toggle"
          onClick={() => setShowCode((v) => !v)}
        >
          {showCode ? '코드 숨기기' : '코드 보기'}
        </button>
      </div>
      {showCode && (
        <pre className="example__code">{code.trim()}</pre>
      )}
    </div>
  );
}
