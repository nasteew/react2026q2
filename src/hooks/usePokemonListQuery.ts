import { useEffect, useState } from 'react';
import { fetchPokemonList, fetchPokemon } from '@/api/api';
import type { Item } from '@/types/item';

type PokemonListState = {
  data: Item[];
  loading: boolean;
  error: string;
  totalPages: number;
  page: number;
};

const initialState: PokemonListState = {
  data: [],
  loading: false,
  error: '',
  totalPages: 1,
  page: 1,
};

export function usePokemonListQuery(page: number, search: string) {
  const [state, setState] = useState<PokemonListState>(initialState);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setState((prev) => ({ ...prev, loading: true, error: '' }));

        if (search) {
          const pokemon = await fetchPokemon(search);

          if (!controller.signal.aborted) {
            setState({
              data: [pokemon],
              loading: false,
              error: '',
              totalPages: 1,
              page: 1,
            });
          }
          return;
        }

        const { items, count } = await fetchPokemonList(page);
        const limit = 12;
        const totalPages = Math.ceil(count / limit);

        const safePage = Math.max(1, Math.min(page, totalPages));

        if (safePage === page) {
          if (!controller.signal.aborted) {
            setState({
              data: items,
              loading: false,
              error: '',
              totalPages,
              page: safePage,
            });
          }
          return;
        }

        const { items: correctedItems } = await fetchPokemonList(safePage);

        if (!controller.signal.aborted) {
          setState({
            data: correctedItems,
            loading: false,
            error: '',
            totalPages,
            page: safePage,
          });
        }
      } catch (err) {
        if (!controller.signal.aborted && err instanceof Error) {
          setState({
            data: [],
            loading: false,
            error: err.message,
            totalPages: 1,
            page: 1,
          });
        }
      }
    }

    load();
    return () => controller.abort();
  }, [page, search]);

  return state;
}
