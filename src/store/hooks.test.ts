import { describe, expect, it } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import submissionsReducer, { addSubmission } from './submissionsSlice';
import countriesReducer, { COUNTRIES_LIST } from './countriesSlice';
import { selectCountries, selectSubmissions } from './hooks';

describe('store selectors', () => {
  const store = configureStore({
    reducer: {
      submissions: submissionsReducer,
      countries: countriesReducer,
    },
  });

  it('selectCountries returns countries from store', () => {
    expect(selectCountries(store.getState())).toEqual([...COUNTRIES_LIST]);
  });

  it('selectSubmissions returns submission items', () => {
    expect(selectSubmissions(store.getState())).toEqual([]);

    store.dispatch(
      addSubmission({
        name: 'Ada',
        age: 25,
        email: 'ada@example.com',
        gender: 'female',
        password: 'Aa1!bbbb',
        confirmPassword: 'Aa1!bbbb',
        country: 'United States',
        terms: true,
        image: '',
      })
    );

    expect(selectSubmissions(store.getState())).toHaveLength(1);
  });
});
