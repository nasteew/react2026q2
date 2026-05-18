import { useEffect, useState } from 'react';
import { fetchPokemonList, fetchPokemon } from '@/api/api';
import type { Item } from '@/types/item';

type PokemonListState = {
  data: Item[];
  loading: boolean;
  error: string;
};

const initialState: PokemonListState = {
  data: [],
  loading: false,
  error: '',
};

export function usePokemonListQuery(page: number, search: string) {
  const [state, setState] = useState<PokemonListState>(initialState);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setState((prev) => ({ ...prev, loading: true, error: '' }));

        let data: Item[];

        if (search) {
          const pokemon = await fetchPokemon(search);
          data = [pokemon];
        } else {
          data = await fetchPokemonList(page);
        }

        if (!controller.signal.aborted) {
          setState({
            data,
            loading: false,
            error: '',
          });
        }
      } catch (err) {
        if (!controller.signal.aborted && err instanceof Error) {
          setState({
            data: [],
            loading: false,
            error: err.message,
          });
        }
      }
    }

    load();

    return () => controller.abort();
  }, [page, search]);

  return state;
}
