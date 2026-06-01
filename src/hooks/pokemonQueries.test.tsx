import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { usePokemonListQuery } from '@/hooks/usePokemonListQuery';
import { usePokemonDetailsQuery } from '@/hooks/usePokemonDetailsQuery';
import * as api from '@/api/api';
import { mockItem } from '@/test-utils/mocks/mockItem';

function makeWrapper(client: QueryClient) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
  };
}

function freshClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
}

describe('usePokemonListQuery — list mode', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('shows loading=true initially', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue({
      items: [mockItem],
      totalPages: 5,
    });

    const { result } = renderHook(() => usePokemonListQuery(1, ''), {
      wrapper: makeWrapper(freshClient()),
    });

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('returns data and totalPages on success', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue({
      items: [mockItem],
      totalPages: 5,
    });

    const { result } = renderHook(() => usePokemonListQuery(1, ''), {
      wrapper: makeWrapper(freshClient()),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual([mockItem]);
    expect(result.current.totalPages).toBe(5);
    expect(result.current.error).toBe('');
  });

  it('returns error message on failure', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockRejectedValue(
      new Error('Server error. Please try again later.')
    );

    const { result } = renderHook(() => usePokemonListQuery(1, ''), {
      wrapper: makeWrapper(freshClient()),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Server error. Please try again later.');
    expect(result.current.data).toEqual([]);
  });

  it('uses cache — does not re-fetch on second mount', async () => {
    const spy = vi.spyOn(api, 'fetchPokemonList').mockResolvedValue({
      items: [mockItem],
      totalPages: 5,
    });

    const client = freshClient();
    const wrapper = makeWrapper(client);

    const first = renderHook(() => usePokemonListQuery(1, ''), { wrapper });
    await waitFor(() => expect(first.result.current.loading).toBe(false));

    const second = renderHook(() => usePokemonListQuery(1, ''), { wrapper });
    await waitFor(() => expect(second.result.current.loading).toBe(false));

    expect(spy).toHaveBeenCalledTimes(1);
    expect(second.result.current.data).toEqual([mockItem]);
  });

  it('invalidate triggers a new fetch', async () => {
    const spy = vi.spyOn(api, 'fetchPokemonList').mockResolvedValue({
      items: [mockItem],
      totalPages: 5,
    });

    const { result } = renderHook(() => usePokemonListQuery(1, ''), {
      wrapper: makeWrapper(freshClient()),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(spy).toHaveBeenCalledTimes(1);

    act(() => result.current.invalidate());

    await waitFor(() => expect(spy).toHaveBeenCalledTimes(2));
  });

  it('re-fetches when page changes', async () => {
    const spy = vi.spyOn(api, 'fetchPokemonList').mockResolvedValue({
      items: [mockItem],
      totalPages: 5,
    });
    const { result, rerender } = renderHook(
      ({ page }: { page: number }) => usePokemonListQuery(page, ''),
      { wrapper: makeWrapper(freshClient()), initialProps: { page: 1 } }
    );
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(spy).toHaveBeenCalledWith(1, expect.anything());

    rerender({ page: 2 });
    await waitFor(() => expect(spy).toHaveBeenCalledWith(2, expect.anything()));
    expect(spy).toHaveBeenCalledTimes(2);
  });
});

describe('usePokemonListQuery — search mode', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('shows loading=true initially', async () => {
    vi.spyOn(api, 'fetchPokemon').mockResolvedValue(mockItem);

    const { result } = renderHook(() => usePokemonListQuery(1, 'bulbasaur'), {
      wrapper: makeWrapper(freshClient()),
    });

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('returns single item wrapped in array', async () => {
    vi.spyOn(api, 'fetchPokemon').mockResolvedValue(mockItem);

    const { result } = renderHook(() => usePokemonListQuery(1, 'bulbasaur'), {
      wrapper: makeWrapper(freshClient()),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual([mockItem]);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.error).toBe('');
  });

  it('returns error message on 404', async () => {
    vi.spyOn(api, 'fetchPokemon').mockRejectedValue(
      new Error('Pokémon "unknown" not found. Try a different name!')
    );

    const { result } = renderHook(() => usePokemonListQuery(1, 'unknown'), {
      wrapper: makeWrapper(freshClient()),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe(
      'Pokémon "unknown" not found. Try a different name!'
    );
    expect(result.current.data).toEqual([]);
  });

  it('uses cache — does not re-fetch same search', async () => {
    const spy = vi.spyOn(api, 'fetchPokemon').mockResolvedValue(mockItem);

    const client = freshClient();
    const wrapper = makeWrapper(client);

    const first = renderHook(() => usePokemonListQuery(1, 'bulbasaur'), {
      wrapper,
    });
    await waitFor(() => expect(first.result.current.loading).toBe(false));

    const second = renderHook(() => usePokemonListQuery(1, 'bulbasaur'), {
      wrapper,
    });
    await waitFor(() => expect(second.result.current.loading).toBe(false));

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('invalidate triggers a new search fetch', async () => {
    const spy = vi.spyOn(api, 'fetchPokemon').mockResolvedValue(mockItem);

    const { result } = renderHook(() => usePokemonListQuery(1, 'bulbasaur'), {
      wrapper: makeWrapper(freshClient()),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(spy).toHaveBeenCalledTimes(1);

    await act(() => result.current.invalidate());

    await waitFor(() => expect(spy).toHaveBeenCalledTimes(2));
  });
});

describe('usePokemonDetailsQuery', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('returns null data when id is null', () => {
    const { result } = renderHook(() => usePokemonDetailsQuery(null), {
      wrapper: makeWrapper(freshClient()),
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('shows loading=true initially', async () => {
    vi.spyOn(api, 'fetchPokemon').mockResolvedValue(mockItem);

    const { result } = renderHook(() => usePokemonDetailsQuery('1'), {
      wrapper: makeWrapper(freshClient()),
    });

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('returns pokemon data on success', async () => {
    vi.spyOn(api, 'fetchPokemon').mockResolvedValue(mockItem);

    const { result } = renderHook(() => usePokemonDetailsQuery('1'), {
      wrapper: makeWrapper(freshClient()),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(mockItem);
    expect(result.current.error).toBeNull();
  });

  it('returns error message on failure', async () => {
    vi.spyOn(api, 'fetchPokemon').mockRejectedValue(
      new Error('Pokémon "999" not found. Try a different name!')
    );

    const { result } = renderHook(() => usePokemonDetailsQuery('999'), {
      wrapper: makeWrapper(freshClient()),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe(
      'Pokémon "999" not found. Try a different name!'
    );
    expect(result.current.data).toBeNull();
  });

  it('uses cache — does not re-fetch on second mount', async () => {
    const spy = vi.spyOn(api, 'fetchPokemon').mockResolvedValue(mockItem);

    const client = freshClient();
    const wrapper = makeWrapper(client);

    const first = renderHook(() => usePokemonDetailsQuery('1'), { wrapper });
    await waitFor(() => expect(first.result.current.loading).toBe(false));

    const second = renderHook(() => usePokemonDetailsQuery('1'), { wrapper });
    await waitFor(() => expect(second.result.current.loading).toBe(false));

    expect(spy).toHaveBeenCalledTimes(1);
    expect(second.result.current.data).toEqual(mockItem);
  });

  it('invalidate triggers a new fetch', async () => {
    const spy = vi.spyOn(api, 'fetchPokemon').mockResolvedValue(mockItem);

    const { result } = renderHook(() => usePokemonDetailsQuery('1'), {
      wrapper: makeWrapper(freshClient()),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(spy).toHaveBeenCalledTimes(1);

    await act(() => result.current.invalidate());

    await waitFor(() => expect(spy).toHaveBeenCalledTimes(2));
  });
});
