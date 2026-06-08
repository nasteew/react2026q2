import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-medium text-white/40 uppercase tracking-widest"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={id}
          {...props}
          className={`
            w-full rounded-xl px-4 py-3
            bg-white/[0.04] hover:bg-white/[0.06]
            border ${error ? 'border-red-500/60' : 'border-white/[0.08]'}
            text-sm text-white placeholder:text-white/20
            outline-none focus:ring-2 focus:ring-indigo-500/50
            transition duration-150
            ${className}
          `}
        />

        <span className="min-h-[16px] text-xs text-red-400">{error}</span>
      </div>
    );
  }
);

Input.displayName = 'Input';
