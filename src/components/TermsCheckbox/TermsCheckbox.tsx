interface TermsCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  error?: string;
}

export function TermsCheckbox({ id, error, ...props }: TermsCheckboxProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <input
          id={id}
          type="checkbox"
          className="h-4 w-4 rounded accent-indigo-500 cursor-pointer"
          {...props}
        />

        <span className="text-sm text-white/40 group-hover:text-white/60 transition">
          I accept the{' '}
          <span className="text-indigo-400 underline underline-offset-2">
            Terms &amp; Conditions
          </span>
        </span>
      </label>

      <span className="min-h-[16px] text-xs text-red-400 pl-7">{error}</span>
    </div>
  );
}
