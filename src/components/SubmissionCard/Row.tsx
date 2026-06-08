export function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-xs text-white/30 uppercase tracking-wider w-16 shrink-0">
        {label}
      </span>
      <span className="text-sm text-white/70">{value}</span>
    </div>
  );
}
