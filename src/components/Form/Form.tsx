import {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import './Form.css';
import type { FormItemProps, FormProps, FormRule, FormValidateTrigger } from './Form.types';

interface RegisteredItem {
  label?: FormItemProps['label'];
  required?: boolean;
  rules?: FormRule[];
  valuePropName: string;
  validateTrigger?: FormValidateTrigger;
}

interface FormContextValue {
  values: Record<string, unknown>;
  errors: Record<string, string[]>;
  validateTrigger?: FormValidateTrigger;
  setFieldValue: (name: string, value: unknown, trigger?: 'onChange' | 'onBlur') => void;
  validateField: (name: string, trigger?: 'onChange' | 'onBlur') => void;
  registerItem: (name: string, config: RegisteredItem, initialValue?: unknown) => () => void;
}

const FormContext = createContext<FormContextValue | null>(null);

function isEmptyValue(value: unknown, valuePropName: string) {
  if (valuePropName === 'checked') return value !== true;
  if (Array.isArray(value)) return value.length === 0;
  return value === undefined || value === null || value === '';
}

function validateRules(
  name: string,
  value: unknown,
  values: Record<string, unknown>,
  config?: RegisteredItem,
) {
  if (!config) return [];

  const rules = [...(config.rules ?? [])];
  if (config.required && !rules.some((rule) => rule.required)) {
    rules.unshift({ required: true });
  }

  const fieldLabel = typeof config.label === 'string' ? config.label : name;
  const errors: string[] = [];

  for (const rule of rules) {
    if (rule.required && isEmptyValue(value, config.valuePropName)) {
      errors.push(rule.message ?? `${fieldLabel} is required.`);
      continue;
    }

    if (!rule.validator) continue;
    const result = rule.validator(value, values);
    if (typeof result === 'string' && result) {
      errors.push(result);
    } else if (result === false) {
      errors.push(rule.message ?? `${fieldLabel} is invalid.`);
    }
  }

  return errors;
}

function normalizeChangedValue(nextValue: unknown, valuePropName: string) {
  if (
    nextValue &&
    typeof nextValue === 'object' &&
    'target' in nextValue
  ) {
    const target = nextValue.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    if (valuePropName === 'checked') return Boolean((target as HTMLInputElement).checked);
    return target.value;
  }

  return nextValue;
}

function resolveValidateTriggers(validateTrigger?: FormValidateTrigger) {
  if (!validateTrigger) return ['onChange'];
  return Array.isArray(validateTrigger) ? validateTrigger : [validateTrigger];
}

function FormRoot({
  layout = 'vertical',
  labelWidth,
  initialValues = {},
  validateTrigger = 'onChange',
  onFinish,
  onFinishFailed,
  onValuesChange,
  children,
  className = '',
  style,
  ...rest
}: FormProps) {
  const [values, setValues] = useState<Record<string, unknown>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const valuesRef = useRef(values);
  const itemsRef = useRef<Map<string, RegisteredItem>>(new Map());

  valuesRef.current = values;

  const applyFieldErrors = (name: string, nextValue: unknown, nextValues: Record<string, unknown>) => {
    const config = itemsRef.current.get(name);
    const nextErrors = validateRules(name, nextValue, nextValues, config);

    setErrors((prev) => {
      if (nextErrors.length === 0) {
        if (!prev[name]) return prev;
        const updated = { ...prev };
        delete updated[name];
        return updated;
      }

      return { ...prev, [name]: nextErrors };
    });
  };

  const registerItem = (name: string, config: RegisteredItem, initialValue?: unknown) => {
    itemsRef.current.set(name, config);

    if (initialValue !== undefined && valuesRef.current[name] === undefined) {
      setValues((prev) => ({ ...prev, [name]: initialValue }));
    }

    return () => {
      itemsRef.current.delete(name);
    };
  };

  const setFieldValue = (name: string, nextValue: unknown, trigger: 'onChange' | 'onBlur' = 'onChange') => {
    const nextValues = { ...valuesRef.current, [name]: nextValue };
    const config = itemsRef.current.get(name);
    const itemTriggers = resolveValidateTriggers(config?.validateTrigger ?? validateTrigger);

    valuesRef.current = nextValues;
    setValues((prev) => {
      onValuesChange?.({ [name]: nextValue }, nextValues);
      return prev[name] === nextValue ? prev : nextValues;
    });

    if (itemTriggers.includes(trigger)) {
      applyFieldErrors(name, nextValue, nextValues);
    }
  };

  const validateField = (name: string, trigger: 'onChange' | 'onBlur' = 'onChange') => {
    const config = itemsRef.current.get(name);
    const itemTriggers = resolveValidateTriggers(config?.validateTrigger ?? validateTrigger);
    if (!itemTriggers.includes(trigger)) {
      return;
    }

    applyFieldErrors(name, valuesRef.current[name], valuesRef.current);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string[]> = {};

    for (const [name, config] of itemsRef.current.entries()) {
      const fieldErrors = validateRules(name, valuesRef.current[name], valuesRef.current, config);
      if (fieldErrors.length > 0) {
        nextErrors[name] = fieldErrors;
      }
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      onFinishFailed?.({
        values: valuesRef.current,
        errorFields: Object.entries(nextErrors).map(([name, fieldErrors]) => ({
          name,
          errors: fieldErrors,
        })),
      });
      return;
    }

    onFinish?.(valuesRef.current);
  };

  const cls = [
    'orot-form',
    `orot-form--${layout}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <FormContext.Provider
      value={{
        values,
        errors,
        validateTrigger,
        setFieldValue,
        validateField,
        registerItem,
      }}
    >
      <form
        className={cls}
        style={{ '--orot-form-label-width': typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth, ...style } as React.CSSProperties}
        onSubmit={handleSubmit}
        {...rest}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}

function FormItem({
  label,
  name,
  required = false,
  rules,
  validateStatus,
  help,
  extra,
  colon = false,
  valuePropName = 'value',
  validateTrigger,
  initialValue,
  children,
  className = '',
  style,
  ...rest
}: FormItemProps) {
  const form = useContext(FormContext);

  useEffect(() => {
    if (!form || !name) return undefined;
    return form.registerItem(
      name,
      {
        label,
        required,
        rules,
        valuePropName,
        validateTrigger,
      },
      initialValue,
    );
  }, [form, initialValue, label, name, required, rules, validateTrigger, valuePropName]);

  const fieldErrors = name && form ? form.errors[name] ?? [] : [];
  const mergedStatus = validateStatus ?? (fieldErrors.length > 0 ? 'error' : undefined);
  const mergedHelp = help ?? fieldErrors[0];

  const cls = [
    'orot-form-item',
    mergedStatus && `orot-form-item--${mergedStatus}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const childProps =
    isValidElement(children)
      ? (children.props as Record<string, unknown>)
      : null;

  let control = children;

  if (isValidElement(children) && name && form) {
    const fieldValue = form.values[name];
    const currentHandler = childProps?.onChange as ((...args: unknown[]) => void) | undefined;
    const currentBlurHandler = childProps?.onBlur as ((...args: unknown[]) => void) | undefined;
    const nextProps: Record<string, unknown> = {
      ...(childProps?.id === undefined ? { id: name } : {}),
      onChange: (...args: unknown[]) => {
        currentHandler?.(...args);
        form.setFieldValue(name, normalizeChangedValue(args[0], valuePropName), 'onChange');
      },
      onBlur: (...args: unknown[]) => {
        currentBlurHandler?.(...args);
        form.validateField(name, 'onBlur');
      },
    };

    if (valuePropName === 'checked') {
      nextProps.checked = Boolean(fieldValue);
    } else if (fieldValue !== undefined) {
      nextProps[valuePropName] = fieldValue;
    }

    control = cloneElement(children, nextProps);
  } else if (isValidElement(children) && name) {
    control = cloneElement(children, {
      ...(childProps?.name === undefined ? { name } : {}),
      ...(childProps?.id === undefined ? { id: name } : {}),
    });
  }

  return (
    <div className={cls} style={style} {...rest}>
      {label !== undefined && (
        <label
          className={['orot-form-item__label', required && 'orot-form-item__required'].filter(Boolean).join(' ')}
          htmlFor={name}
        >
          {label}{colon && ':'}
        </label>
      )}
      <div className="orot-form-item__control">
        {control}
        {mergedHelp && <div className="orot-form-item__help">{mergedHelp}</div>}
        {extra && <div className="orot-form-item__extra">{extra}</div>}
      </div>
    </div>
  );
}

export const Form = Object.assign(FormRoot, { Item: FormItem });
