import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';
import { pokemonService } from './api/pokemonService';
import { storage } from './utils/storage';
import { mockItem } from '@/test-utils/mocks/mockItem';
import { suppressConsoleError } from '@/test-utils/suppressConsoleError';

suppressConsoleError();

vi.mock('./api/pokemonService');
vi.mock('./utils/storage');

const mockedPokemonService = vi.mocked(pokemonService);
const mockedStorage = vi.mocked(storage);

beforeEach(() => {
  mockedStorage.getSearch.mockReturnValue('');
  mockedPokemonService.getPage.mockResolvedValue([mockItem]);
  mockedPokemonService.getByName.mockResolvedValue(mockItem);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('App', () => {
  describe('Initial load', () => {
    it('loads page on mount when no saved search', async () => {
      render(<App />);

      await waitFor(() => {
        expect(mockedPokemonService.getPage).toHaveBeenCalledWith(1);
      });
    });

    it('loads saved search term from localStorage on mount', async () => {
      mockedStorage.getSearch.mockReturnValue('pikachu');

      render(<App />);

      await waitFor(() => {
        expect(mockedPokemonService.getByName).toHaveBeenCalledWith('pikachu');
      });
    });

    it('displays search input with saved term', async () => {
      mockedStorage.getSearch.mockReturnValue('pikachu');

      render(<App />);

      await waitFor(() => {
        expect(screen.getByLabelText('Enter Pokémon name')).toHaveValue(
          'pikachu'
        );
      });
    });

    it('shows loading state during initial fetch', async () => {
      mockedPokemonService.getPage.mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve([mockItem]), 100))
      );

      render(<App />);

      expect(screen.getByRole('status')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      });
    });

    it('displays results after successful load', async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('bulbasaur')).toBeInTheDocument();
      });
    });

    it('displays error message when API fails', async () => {
      mockedPokemonService.getPage.mockRejectedValue(
        new Error('Server error. Please try again later.')
      );

      render(<App />);

      await waitFor(() => {
        expect(
          screen.getByText('Server error. Please try again later.')
        ).toBeInTheDocument();
      });
    });

    it('handles unknown error type', async () => {
      mockedPokemonService.getPage.mockRejectedValue('string error');

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Unknown error')).toBeInTheDocument();
      });
    });
  });
});
