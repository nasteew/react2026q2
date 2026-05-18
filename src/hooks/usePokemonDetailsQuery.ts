import { useEffect, useState } from 'react';
import { fetchPokemon } from '@/api/api';
import type { Item } from '@/types/item';

type PokemonDetailsState = {
  data: Item | null;
  loading: boolean;
  error: string | null;
};

const initialState: PokemonDetailsState = {
  data: null,
  loading: false,
  error: null,
};

export function usePokemonDetailsQuery(id: string | null) {
  const [state, setState] = useState<PokemonDetailsState>(initialState);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    const fetchData = async () => {
      setState({ data: null, loading: true, error: null });

      try {
        const data = await fetchPokemon(id);

        if (!controller.signal.aborted) {
          setState({ data, loading: false, error: null });
        }
      } catch (error) {
        if (!controller.signal.aborted && error instanceof Error) {
          setState({ data: null, loading: false, error: error.message });
        }
      }
    };

    fetchData();

    return () => controller.abort();
  }, [id]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
  };
}
