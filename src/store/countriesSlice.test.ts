import { describe, expect, it } from 'vitest';
import countriesReducer, { COUNTRIES_LIST } from './countriesSlice';

describe('countriesSlice', () => {
  it('stores countries list in initial state', () => {
    const state = countriesReducer(undefined, { type: 'init' });

    expect(state.list).toEqual([...COUNTRIES_LIST]);
    expect(state.list).toContain('United States');
    expect(state.list).toContain('Germany');
  });

  it('exports a non-empty countries list', () => {
    expect(COUNTRIES_LIST.length).toBeGreaterThan(20);
  });
});
