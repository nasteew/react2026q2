export interface PasswordStrength {
  score: number;
  label: 'weak' | 'fair' | 'good' | 'strong';
  checks: {
    hasNumber: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasSpecial: boolean;
  };
}

export function getPasswordStrength(password: string): PasswordStrength {
  const checks = {
    hasNumber: /[0-9]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  const label =
    score <= 1
      ? 'weak'
      : score === 2
        ? 'fair'
        : score === 3
          ? 'good'
          : 'strong';

  return { score, label, checks };
}
