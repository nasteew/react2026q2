import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={id}
          {...props}
          className={`rounded-xl border px-3 py-2 text-sm shadow-sm bg-white/60 backdrop-blur-sm transition focus:ring-2 focus:ring-indigo-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
        />

        <span className="block min-h-[18px] text-sm text-red-500">{error}</span>
      </div>
    );
  }
);

Input.displayName = 'Input';
