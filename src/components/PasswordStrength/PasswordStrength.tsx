import { STRENGTH_COLOR } from '@/constants/strengthColors';
import { type PasswordStrength } from '@/utils/passwordStrength';

export function PasswordStrength({
  strength,
}: {
  strength: PasswordStrength | null;
}) {
  const safe = strength ?? {
    score: 0,
    label: 'weak',
    checks: {
      hasNumber: false,
      hasUppercase: false,
      hasLowercase: false,
      hasSpecial: false,
    },
  };

  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 flex flex-col gap-2">
      <div className="flex gap-1.5">
        {(['weak', 'fair', 'good', 'strong'] as const).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < safe.score ? STRENGTH_COLOR[safe.label] : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
        <span
          className={
            safe.checks.hasNumber ? 'text-emerald-400' : 'text-white/30'
          }
        >
          1 number
        </span>
        <span
          className={
            safe.checks.hasUppercase ? 'text-emerald-400' : 'text-white/30'
          }
        >
          1 uppercase
        </span>
        <span
          className={
            safe.checks.hasLowercase ? 'text-emerald-400' : 'text-white/30'
          }
        >
          1 lowercase
        </span>
        <span
          className={
            safe.checks.hasSpecial ? 'text-emerald-400' : 'text-white/30'
          }
        >
          1 special character
        </span>
      </div>
    </div>
  );
}
