import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Home } from './Home';
import * as api from '@/api/api';
import { mockItem } from '@/test-utils/mocks/mockItem';
import { suppressConsoleError } from '@/test-utils/suppressConsoleError';
import useLocalStorage from '@/hooks/useLocalStorage';

suppressConsoleError();

vi.mock('@/api/api');
vi.mock('@/hooks/useLocalStorage');

const mockedApi = vi.mocked(api);
const mockedUseLocalStorage = vi.mocked(useLocalStorage);

function renderHome(initialEntries = ['/?page=1']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  mockedUseLocalStorage.mockReturnValue(['', vi.fn(), vi.fn()]);
  mockedApi.fetchPokemonList.mockResolvedValue([mockItem]);
  mockedApi.fetchPokemon.mockResolvedValue(mockItem);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('Home', () => {
  describe('Initial load', () => {
    it('loads page on mount when no saved search', async () => {
      renderHome();

      await waitFor(() => {
        expect(mockedApi.fetchPokemonList).toHaveBeenCalledWith(1);
      });
    });

    it('loads saved search term from localStorage on mount', async () => {
      mockedUseLocalStorage.mockReturnValue(['pikachu', vi.fn(), vi.fn()]);
      renderHome(['/?search=pikachu&page=1']);

      await waitFor(() => {
        expect(mockedApi.fetchPokemon).toHaveBeenCalledWith('pikachu');
      });
    });

    it('displays search input with saved term', async () => {
      mockedUseLocalStorage.mockReturnValue(['pikachu', vi.fn(), vi.fn()]);
      renderHome(['/?search=pikachu&page=1']);

      await waitFor(() => {
        expect(screen.getByLabelText('Enter Pokémon name')).toHaveValue(
          'pikachu'
        );
      });
    });

    it('shows loading state during initial fetch', async () => {
      mockedApi.fetchPokemonList.mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve([mockItem]), 100))
      );

      renderHome();

      expect(screen.getByRole('status')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      });
    });

    it('displays results after successful load', async () => {
      renderHome();

      await waitFor(() => {
        expect(screen.getByText('bulbasaur')).toBeInTheDocument();
      });
    });

    it('displays error message when API fails', async () => {
      mockedApi.fetchPokemonList.mockRejectedValue(
        new Error('Server error. Please try again later.')
      );

      renderHome();

      await waitFor(() => {
        expect(
          screen.getByText('Server error. Please try again later.')
        ).toBeInTheDocument();
      });
    });

    it('handles unknown error type', async () => {
      mockedApi.fetchPokemonList.mockRejectedValue('string error');

      renderHome();

      await waitFor(() => {
        expect(screen.getByText('Unknown error')).toBeInTheDocument();
      });
    });
  });

  describe('Search interactions', () => {
    it('saves search term to localStorage on search', async () => {
      const setSearchTerm = vi.fn();
      mockedUseLocalStorage.mockReturnValue(['', setSearchTerm, vi.fn()]);
      const user = userEvent.setup();
      renderHome();

      await waitFor(() => screen.getByLabelText('Enter Pokémon name'));

      await user.type(
        screen.getByLabelText('Enter Pokémon name'),
        'charmander'
      );
      await user.click(screen.getByRole('button', { name: 'Search' }));

      expect(setSearchTerm).toHaveBeenCalledWith('charmander');
    });

    it('calls fetchPokemon with search term', async () => {
      const user = userEvent.setup();
      renderHome();

      await waitFor(() => screen.getByLabelText('Enter Pokémon name'));

      await user.type(
        screen.getByLabelText('Enter Pokémon name'),
        'charmander'
      );
      await user.click(screen.getByRole('button', { name: 'Search' }));

      await waitFor(() => {
        expect(mockedApi.fetchPokemon).toHaveBeenCalledWith('charmander');
      });
    });

    it('loads page when search is cleared', async () => {
      mockedUseLocalStorage.mockReturnValue(['pikachu', vi.fn(), vi.fn()]);
      const user = userEvent.setup();
      renderHome(['/?search=pikachu&page=1']);

      await waitFor(() => screen.getByLabelText('Enter Pokémon name'));

      await user.clear(screen.getByLabelText('Enter Pokémon name'));
      await user.click(screen.getByRole('button', { name: 'Search' }));

      await waitFor(() => {
        expect(mockedApi.fetchPokemonList).toHaveBeenCalled();
      });
    });

    it('does not search again with same term', async () => {
      mockedUseLocalStorage.mockReturnValue(['pikachu', vi.fn(), vi.fn()]);
      const user = userEvent.setup();
      renderHome(['/?search=pikachu&page=1']);

      await waitFor(() => screen.getByLabelText('Enter Pokémon name'));
      await user.click(screen.getByRole('button', { name: 'Search' }));

      expect(mockedApi.fetchPokemon).toHaveBeenCalledTimes(1);
    });

    it('trims whitespace from search term', async () => {
      const setSearchTerm = vi.fn();
      mockedUseLocalStorage.mockReturnValue(['', setSearchTerm, vi.fn()]);
      const user = userEvent.setup();
      renderHome();

      await waitFor(() => screen.getByLabelText('Enter Pokémon name'));

      await user.type(
        screen.getByLabelText('Enter Pokémon name'),
        '  pikachu  '
      );
      await user.click(screen.getByRole('button', { name: 'Search' }));

      expect(setSearchTerm).toHaveBeenCalledWith('pikachu');
    });

    it('handles 404 error response', async () => {
      mockedApi.fetchPokemon.mockRejectedValue(
        new Error('Pokémon "unknown" not found. Try a different name!')
      );
      const user = userEvent.setup();
      renderHome();

      await waitFor(() => screen.getByLabelText('Enter Pokémon name'));

      await user.type(screen.getByLabelText('Enter Pokémon name'), 'unknown');
      await user.click(screen.getByRole('button', { name: 'Search' }));

      await waitFor(() => {
        expect(
          screen.getByText('Pokémon "unknown" not found. Try a different name!')
        ).toBeInTheDocument();
      });
    });

    it('handles 500 error response', async () => {
      mockedApi.fetchPokemon.mockRejectedValue(
        new Error('Server error. Please try again later.')
      );
      const user = userEvent.setup();
      renderHome();

      await waitFor(() => screen.getByLabelText('Enter Pokémon name'));

      await user.type(screen.getByLabelText('Enter Pokémon name'), 'pikachu');
      await user.click(screen.getByRole('button', { name: 'Search' }));

      await waitFor(() => {
        expect(
          screen.getByText('Server error. Please try again later.')
        ).toBeInTheDocument();
      });
    });
  });

  describe('localStorage', () => {
    it('reads search term from localStorage on mount', () => {
      mockedUseLocalStorage.mockReturnValue(['bulbasaur', vi.fn(), vi.fn()]);
      renderHome(['/?search=bulbasaur&page=1']);
      expect(mockedUseLocalStorage).toHaveBeenCalled();
    });

    it('writes to localStorage when new search performed', async () => {
      const setSearchTerm = vi.fn();
      mockedUseLocalStorage.mockReturnValue(['', setSearchTerm, vi.fn()]);
      const user = userEvent.setup();
      renderHome();

      await waitFor(() => screen.getByLabelText('Enter Pokémon name'));

      await user.type(screen.getByLabelText('Enter Pokémon name'), 'squirtle');
      await user.click(screen.getByRole('button', { name: 'Search' }));

      expect(setSearchTerm).toHaveBeenCalledWith('squirtle');
    });

    it('shows empty input when localStorage is empty', async () => {
      mockedUseLocalStorage.mockReturnValue(['', vi.fn(), vi.fn()]);
      renderHome();

      await waitFor(() => {
        expect(screen.getByLabelText('Enter Pokémon name')).toHaveValue('');
      });
    });
  });

  describe('Pagination', () => {
    it('shows pagination when no search', async () => {
      renderHome();

      await waitFor(() => {
        expect(screen.getByText('Page 1')).toBeInTheDocument();
      });
    });

    it('hides pagination when search is active', async () => {
      mockedUseLocalStorage.mockReturnValue(['pikachu', vi.fn(), vi.fn()]);
      renderHome(['/?search=pikachu&page=1']);

      await waitFor(() => {
        expect(screen.queryByText('Page 1')).not.toBeInTheDocument();
      });
    });
  });
});
