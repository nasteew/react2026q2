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

export const passwordHasNumber = (password: string) => /[0-9]/.test(password);

export const passwordHasUppercase = (password: string) =>
  /\p{Lu}/u.test(password);

export const passwordHasLowercase = (password: string) =>
  /\p{Ll}/u.test(password);

export const passwordHasSpecial = (password: string) =>
  /[^\p{L}\p{N}]/u.test(password);

export function getPasswordStrength(password: string): PasswordStrength {
  const checks = {
    hasNumber: passwordHasNumber(password),
    hasUppercase: passwordHasUppercase(password),
    hasLowercase: passwordHasLowercase(password),
    hasSpecial: passwordHasSpecial(password),
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
