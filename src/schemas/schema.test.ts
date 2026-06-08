import { describe, expect, it } from 'vitest';
import { createFormSchema } from './schema';
import { COUNTRIES_LIST } from '@/store/countriesSlice';
import { createImageFile } from '@/test-utils/renderWithProviders';

const schema = createFormSchema([...COUNTRIES_LIST]);

const validData = {
  name: 'Ada',
  age: 25,
  email: 'ada@example.com',
  gender: 'female' as const,
  password: 'Aa1!bbbb',
  confirmPassword: 'Aa1!bbbb',
  country: 'United States',
  terms: true,
  image: createImageFile(),
};

describe('createFormSchema', () => {
  it('accepts valid form data', () => {
    const result = schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects name without uppercase first letter', () => {
    const result = schema.safeParse({ ...validData, name: 'ada' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === 'name')).toBe(true);
    }
  });

  it('rejects negative age', () => {
    const result = schema.safeParse({ ...validData, age: -1 });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email without domain dot', () => {
    const result = schema.safeParse({ ...validData, email: 'ada@localhost' });
    expect(result.success).toBe(false);
  });

  it('rejects mismatched passwords', () => {
    const result = schema.safeParse({
      ...validData,
      confirmPassword: 'Different1!',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.path[0] === 'confirmPassword')
      ).toBe(true);
    }
  });

  it('rejects country not in list', () => {
    const result = schema.safeParse({ ...validData, country: 'Atlantis' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === 'country')).toBe(
        true
      );
    }
  });

  it('rejects unsupported image type', () => {
    const file = new File(['x'], 'doc.pdf', { type: 'application/pdf' });
    const result = schema.safeParse({ ...validData, image: file });
    expect(result.success).toBe(false);
  });

  it('rejects image larger than 5MB', () => {
    const file = createImageFile('big.png', 5 * 1024 * 1024 + 1);
    const result = schema.safeParse({ ...validData, image: file });
    expect(result.success).toBe(false);
  });

  it('rejects email with multiple @ symbols', () => {
    const result = schema.safeParse({
      ...validData,
      email: 'ada@@example.com',
    });
    expect(result.success).toBe(false);
  });

  it('rejects unchecked terms', () => {
    const result = schema.safeParse({ ...validData, terms: false });
    expect(result.success).toBe(false);
  });

  it('rejects missing image', () => {
    const result = schema.safeParse({ ...validData, image: null });
    expect(result.success).toBe(false);
  });

  it('rejects NaN age', () => {
    const result = schema.safeParse({ ...validData, age: Number.NaN });
    expect(result.success).toBe(false);
  });

  it('accepts password with cyrillic letters', () => {
    const result = schema.safeParse({
      ...validData,
      password: 'Пароль1!',
      confirmPassword: 'Пароль1!',
    });
    expect(result.success).toBe(true);
  });

  it('rejects mismatched cyrillic passwords on confirmPassword field', () => {
    const result = schema.safeParse({
      ...validData,
      password: 'Пароль1!',
      confirmPassword: 'Пароль2!',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const mismatch = result.error.issues.find(
        (issue) => issue.message === 'Passwords do not match'
      );
      expect(mismatch?.path).toEqual(['confirmPassword']);
    }
  });
});
