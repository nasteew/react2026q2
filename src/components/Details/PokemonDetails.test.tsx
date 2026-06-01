import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import * as api from '@/api/api';
import PokemonDetails from './PokemonDetails';
import { mockItem } from '@/test-utils/mocks/mockItem';
import { suppressConsoleError } from '@/test-utils/suppressConsoleError';

suppressConsoleError();

vi.mock('@/api/api');
const mockedApi = vi.mocked(api);

function makeClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

function renderDetails(initialEntries = ['/?details=1']) {
  return render(
    <QueryClientProvider client={makeClient()}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/" element={<PokemonDetails />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

beforeEach(() => {
  mockedApi.fetchPokemon.mockResolvedValue(mockItem);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('PokemonDetails', () => {
  it('renders loader while loading', () => {
    mockedApi.fetchPokemon.mockImplementation(() => new Promise(() => {}));

    renderDetails();

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders error when id is missing', () => {
    renderDetails(['/?details=']);

    expect(screen.getByText('Pokemon not found')).toBeInTheDocument();
  });

  it('renders error message when API fails', async () => {
    mockedApi.fetchPokemon.mockRejectedValue(
      new Error('Server error. Please try again later.')
    );

    renderDetails();

    await waitFor(() => {
      expect(
        screen.getByText('Server error. Please try again later.')
      ).toBeInTheDocument();
    });
  });

  it('renders pokemon name after successful load', async () => {
    renderDetails();

    await waitFor(() => {
      expect(screen.getByText(mockItem.name)).toBeInTheDocument();
    });
  });

  it('renders types', async () => {
    renderDetails();

    await waitFor(() => {
      mockItem.types.forEach((t) => {
        expect(screen.getByText(new RegExp(`^${t}$`, 'i'))).toBeInTheDocument();
      });
    });
  });

  it('renders abilities list', async () => {
    renderDetails();

    await waitFor(() => {
      mockItem.abilities.forEach((a) => {
        expect(screen.getByText(a)).toBeInTheDocument();
      });
    });
  });

  it('renders stats', async () => {
    renderDetails();

    await waitFor(() => {
      mockItem.stats.forEach((s) => {
        const row = screen.getByText(s.name).closest('div');
        expect(row).toHaveTextContent(String(s.value));
      });
    });
  });

  it('renders moves (first 20)', async () => {
    renderDetails();

    await waitFor(() => {
      mockItem.moves.slice(0, 20).forEach((m) => {
        expect(screen.getByText(m)).toBeInTheDocument();
      });
    });
  });
});
