import { describe, expect, it } from 'vitest';
import { validateCountry } from './validateCountry';

const countries = ['United States', 'Germany', 'France'];

describe('validateCountry', () => {
  it('returns null for a country in the list', () => {
    expect(validateCountry('Germany', countries)).toBeNull();
  });

  it('returns error for unknown country', () => {
    expect(validateCountry('Atlantis', countries)).toBe(
      'Country must be selected from the list'
    );
  });

  it('returns error for empty string', () => {
    expect(validateCountry('', countries)).toBe(
      'Country must be selected from the list'
    );
  });
});
