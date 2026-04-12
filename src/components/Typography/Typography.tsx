import './Typography.css';
import type { TitleProps, TextProps, ParagraphProps, LinkProps } from './Typography.types';

function buildCls(base: string, extra: string[], className?: string) {
  return [base, ...extra.filter(Boolean), className].filter(Boolean).join(' ');
}

/* ── Title ───────────────────────────────────────────── */
function Title({
  level = 1,
  type,
  disabled,
  ellipsis,
  className,
  children,
  ...rest
}: TitleProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  const cls = buildCls(
    `orot-typography orot-title orot-title--${level}`,
    [
      type ? `orot-typography--${type}` : '',
      disabled ? 'orot-typography--disabled' : '',
      ellipsis ? 'orot-typography--ellipsis' : '',
    ],
    className,
  );
  return <Tag className={cls} {...rest}>{children}</Tag>;
}

/* ── Text ────────────────────────────────────────────── */
function Text({
  type,
  disabled,
  ellipsis,
  code,
  mark,
  strong,
  italic,
  underline,
  delete: del,
  className,
  children,
  ...rest
}: TextProps) {
  const cls = buildCls(
    'orot-typography orot-text',
    [
      type ? `orot-typography--${type}` : '',
      disabled ? 'orot-typography--disabled' : '',
      ellipsis ? 'orot-typography--ellipsis' : '',
      code ? 'orot-text--code' : '',
      mark ? 'orot-text--mark' : '',
    ],
    className,
  );

  let content = <>{children}</>;
  if (strong) content = <strong>{content}</strong>;
  if (italic) content = <em>{content}</em>;
  if (underline) content = <u>{content}</u>;
  if (del) content = <del>{content}</del>;

  return <span className={cls} {...rest}>{content}</span>;
}

/* ── Paragraph ───────────────────────────────────────── */
function Paragraph({
  type,
  disabled,
  ellipsis,
  className,
  children,
  ...rest
}: ParagraphProps) {
  const cls = buildCls(
    'orot-typography orot-paragraph',
    [
      type ? `orot-typography--${type}` : '',
      disabled ? 'orot-typography--disabled' : '',
      ellipsis ? 'orot-typography--ellipsis' : '',
    ],
    className,
  );
  return <p className={cls} {...rest}>{children}</p>;
}

/* ── Link ────────────────────────────────────────────── */
function Link({
  type,
  disabled,
  ellipsis,
  external,
  className,
  children,
  ...rest
}: LinkProps) {
  const cls = buildCls(
    'orot-typography orot-link',
    [
      type ? `orot-typography--${type}` : '',
      disabled ? 'orot-typography--disabled' : '',
      ellipsis ? 'orot-typography--ellipsis' : '',
    ],
    className,
  );
  return (
    <a
      className={cls}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      {...rest}
    >
      {children}
    </a>
  );
}

/* ── Compound export ─────────────────────────────────── */
export const Typography = { Title, Text, Paragraph, Link };
