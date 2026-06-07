interface GenderFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  error?: string;
}

export function GenderField({ id, error, ...props }: GenderFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium text-white/40 uppercase tracking-widest"
      >
        Gender
      </label>

      <select
        id={id}
        {...props}
        className={`
          w-full rounded-xl px-4 py-3
          bg-white/[0.04] hover:bg-white/[0.06]
          border ${error ? 'border-red-500/60' : 'border-white/[0.08]'}
          text-sm text-white/70
          outline-none focus:ring-2 focus:ring-indigo-500/50
          transition duration-150
        `}
      >
        <option value="" className="bg-[#111]">
          Select...
        </option>
        <option value="male" className="bg-[#111]">
          Male
        </option>
        <option value="female" className="bg-[#111]">
          Female
        </option>
      </select>

      <span className="min-h-[16px] text-xs text-red-400">{error}</span>
    </div>
  );
}
