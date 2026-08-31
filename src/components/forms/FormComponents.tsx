import React from 'react';
import { cn } from '../../utils/cn';

// --- FormField Wrapper ---
export interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  required,
  children,
  className,
}) => {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="block text-xs font-semibold text-gray-300">
          {label}
          {required && <span className="text-rose-400 ml-1">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-[11px] font-medium text-rose-400 animate-fadeIn">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
};

// --- Input Component ---
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: React.ElementType;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, icon: Icon, type = 'text', ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {Icon && <Icon className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none" />}
        <input
          type={type}
          ref={ref}
          className={cn(
            'w-full bg-gray-950/60 border text-white text-xs rounded-xl py-2 px-3 focus:outline-none transition-all placeholder:text-gray-500',
            Icon ? 'pl-9' : 'pl-3',
            error
              ? 'border-rose-500/60 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30'
              : 'border-gray-800 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';

// --- Select Component ---
export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, error, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'w-full bg-gray-950/60 border text-white text-xs rounded-xl py-2 px-3 focus:outline-none transition-all',
          error
            ? 'border-rose-500/60 focus:border-rose-500'
            : 'border-gray-800 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-gray-900 text-white">
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
);
Select.displayName = 'Select';

// --- Textarea Component ---
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full bg-gray-950/60 border text-white text-xs rounded-xl py-2 px-3 focus:outline-none transition-all placeholder:text-gray-500 custom-scrollbar',
          error
            ? 'border-rose-500/60 focus:border-rose-500'
            : 'border-gray-800 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30',
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

// --- Checkbox Component ---
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          ref={ref}
          className={cn(
            'h-4 w-4 rounded border-gray-700 bg-gray-950 text-purple-600 focus:ring-purple-500/40 focus:ring-offset-gray-900 transition-all cursor-pointer',
            className
          )}
          {...props}
        />
        {label && <span className="text-xs text-gray-300 font-medium">{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

// --- DatePicker Component ---
export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        type="date"
        ref={ref}
        className={cn(
          'w-full bg-gray-950/60 border text-white text-xs rounded-xl py-2 px-3 focus:outline-none transition-all cursor-pointer',
          error
            ? 'border-rose-500/60 focus:border-rose-500'
            : 'border-gray-800 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30',
          className
        )}
        {...props}
      />
    );
  }
);
DatePicker.displayName = 'DatePicker';
