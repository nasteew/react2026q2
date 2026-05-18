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

        if (page < 1) {
          setState({
            data: [],
            loading: false,
            error: '',
            totalPages: 1,
            page,
          });
          return;
        }

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

        if (!controller.signal.aborted) {
          setState({
            data: items,
            loading: false,
            error: '',
            totalPages,
            page,
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
