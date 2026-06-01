import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

function makeClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

function renderHome(initialEntries = ['/?page=1']) {
  return render(
    <QueryClientProvider client={makeClient()}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

beforeEach(() => {
  mockedUseLocalStorage.mockReturnValue(['', vi.fn(), vi.fn()]);
  mockedApi.fetchPokemonList.mockResolvedValue({
    items: [mockItem],
    totalPages: 109,
  });
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
        expect(mockedApi.fetchPokemonList).toHaveBeenCalledWith(
          1,
          expect.anything()
        );
      });
    });

    it('loads saved search term from localStorage on mount', async () => {
      mockedUseLocalStorage.mockReturnValue(['pikachu', vi.fn(), vi.fn()]);
      renderHome(['/?search=pikachu&page=1']);
      await waitFor(() => {
        expect(mockedApi.fetchPokemon).toHaveBeenCalledWith(
          'pikachu',
          expect.anything()
        );
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
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ items: [mockItem], totalPages: 109 }),
              100
            )
          )
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
        expect(mockedApi.fetchPokemon).toHaveBeenCalledWith(
          'charmander',
          expect.anything()
        );
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
      mockedApi.fetchPokemon.mockClear();
      await user.click(screen.getByRole('button', { name: 'Search' }));
      expect(mockedApi.fetchPokemon).toHaveBeenCalledTimes(0);
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
        expect(screen.getByText(/1\s*\/\s*\d+/)).toBeInTheDocument();
      });
    });

    it('hides pagination when search is active', async () => {
      mockedUseLocalStorage.mockReturnValue(['pikachu', vi.fn(), vi.fn()]);
      renderHome(['/?search=pikachu&page=1']);
      await waitFor(() => {
        expect(screen.queryByText('1')).not.toBeInTheDocument();
      });
    });
  });

  describe('Details interactions', () => {
    it('keeps search param when closing details', async () => {
      renderHome(['/?search=pika&page=1&details=1']);
      await waitFor(() => screen.getByText('bulbasaur'));
      const leftColumn = screen.getByTestId('left-column');
      await userEvent.click(leftColumn);
      expect(mockedApi.fetchPokemon).toHaveBeenCalledWith(
        'pika',
        expect.anything()
      );
    });

    it('removes details when closing details without search', async () => {
      renderHome(['/?page=1&details=1']);
      await waitFor(() => screen.getByText('bulbasaur'));
      const leftColumn = screen.getByTestId('left-column');
      await userEvent.click(leftColumn);
      expect(mockedApi.fetchPokemonList).toHaveBeenCalledWith(
        1,
        expect.anything()
      );
    });
  });

  describe('Pagination visibility', () => {
    it('hides pagination when loading', async () => {
      mockedApi.fetchPokemonList.mockImplementation(
        () => new Promise(() => {})
      );
      renderHome();
      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });

    it('hides pagination when error occurs', async () => {
      mockedApi.fetchPokemonList.mockRejectedValue(new Error('fail'));
      renderHome();
      await waitFor(() => {
        expect(screen.getByText('fail')).toBeInTheDocument();
      });
      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });

    it('shows pagination when data loaded and no search', async () => {
      renderHome(['/?page=1']);
      await waitFor(() => {
        expect(screen.getByText(/1\s*\/\s*\d+/)).toBeInTheDocument();
      });
    });
  });

  describe('Details panel rendering', () => {
    it('renders details panel when details param exists', async () => {
      renderHome(['/?page=1&details=1']);
      await waitFor(() => screen.getByText('bulbasaur'));
      expect(screen.getByRole('button', { name: '✕' })).toBeInTheDocument();
    });

    it('does not render details panel when details param missing', async () => {
      renderHome(['/?page=1']);
      await waitFor(() => screen.getByText('bulbasaur'));
      expect(
        screen.queryByRole('button', { name: '✕' })
      ).not.toBeInTheDocument();
    });
  });

  it('Refresh button triggers new list fetch', async () => {
    const spy = vi.spyOn(api, 'fetchPokemonList').mockResolvedValue({
      items: [mockItem],
      totalPages: 5,
    });
    const user = userEvent.setup();
    renderHome();
    await waitFor(() => screen.getByText('bulbasaur'));
    const callsBefore = spy.mock.calls.length;

    await user.click(screen.getByRole('button', { name: 'Refresh' }));
    await waitFor(() =>
      expect(spy.mock.calls.length).toBeGreaterThan(callsBefore)
    );
  });
});
