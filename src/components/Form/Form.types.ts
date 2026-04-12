import type { FormHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export type FormLayout = 'horizontal' | 'vertical' | 'inline';
export type FormValidateTrigger = 'onChange' | 'onBlur' | Array<'onChange' | 'onBlur'>;

export interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  layout?: FormLayout;
  labelWidth?: string | number;
  initialValues?: Record<string, unknown>;
  validateTrigger?: FormValidateTrigger;
  onFinish?: (values: Record<string, unknown>) => void;
  onFinishFailed?: (info: {
    values: Record<string, unknown>;
    errorFields: Array<{ name: string; errors: string[] }>;
  }) => void;
  onValuesChange?: (
    changedValues: Record<string, unknown>,
    allValues: Record<string, unknown>,
  ) => void;
}

export interface FormRule {
  required?: boolean;
  message?: string;
  validator?: (value: unknown, values: Record<string, unknown>) => string | boolean | void;
}

export interface FormItemProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  name?: string;
  required?: boolean;
  rules?: FormRule[];
  validateStatus?: 'success' | 'warning' | 'error' | 'validating';
  help?: ReactNode;
  extra?: ReactNode;
  colon?: boolean;
  valuePropName?: string;
  validateTrigger?: FormValidateTrigger;
  initialValue?: unknown;
  children?: ReactNode;
}
