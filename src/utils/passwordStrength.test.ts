import { describe, expect, it } from 'vitest';
import { getPasswordStrength } from './passwordStrength';

describe('getPasswordStrength', () => {
  it('returns weak score for empty password', () => {
    const result = getPasswordStrength('');
    expect(result.score).toBe(0);
    expect(result.label).toBe('weak');
    expect(result.checks).toEqual({
      hasNumber: false,
      hasUppercase: false,
      hasLowercase: false,
      hasSpecial: false,
    });
  });

  it('detects all strength checks', () => {
    const result = getPasswordStrength('Aa1!bbbb');
    expect(result.checks).toEqual({
      hasNumber: true,
      hasUppercase: true,
      hasLowercase: true,
      hasSpecial: true,
    });
    expect(result.score).toBe(4);
    expect(result.label).toBe('strong');
  });

  it('returns fair for two satisfied checks', () => {
    const result = getPasswordStrength('Abcdefgh');
    expect(result.score).toBe(2);
    expect(result.label).toBe('fair');
  });

  it('counts cyrillic uppercase and lowercase letters', () => {
    const result = getPasswordStrength('Пароль1!');
    expect(result.checks).toEqual({
      hasNumber: true,
      hasUppercase: true,
      hasLowercase: true,
      hasSpecial: true,
    });
    expect(result.score).toBe(4);
    expect(result.label).toBe('strong');
  });
});
