import { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import submissionsReducer from '@/store/submissionsSlice';
import countriesReducer from '@/store/countriesSlice';

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const store = configureStore({
    reducer: {
      submissions: submissionsReducer,
      countries: countriesReducer,
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...options }) };
}

export function createImageFile(name = 'photo.png', size = 64) {
  return new File([new Uint8Array(size)], name, { type: 'image/png' });
}

export const VALID_PASSWORD = 'Aa1!bbbb';
