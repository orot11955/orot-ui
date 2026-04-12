import type { HTMLAttributes, ReactNode } from 'react';

export type ResultStatus = 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500';

export interface ResultProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  status?: ResultStatus;
  title?: ReactNode;
  subTitle?: ReactNode;
  extra?: ReactNode;
  icon?: ReactNode;
}
