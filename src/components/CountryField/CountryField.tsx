interface CountryFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  error?: string;
  countries: string[];
}

export function CountryField({
  id,
  error,
  countries,
  ...props
}: CountryFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium text-white/40 uppercase tracking-widest"
      >
        Country
      </label>

      <input
        id={id}
        list={`${id}-list`}
        {...props}
        className={`
          w-full rounded-xl px-4 py-3
          bg-white/[0.04] hover:bg-white/[0.06]
          border ${error ? 'border-red-500/60' : 'border-white/[0.08]'}
          text-sm text-white placeholder:text-white/20
          outline-none focus:ring-2 focus:ring-indigo-500/50
          transition duration-150
        `}
      />

      <datalist id={`${id}-list`}>
        {countries.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>

      <span className="min-h-[16px] text-xs text-red-400">{error}</span>
    </div>
  );
}
