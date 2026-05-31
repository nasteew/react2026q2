import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPokemon } from '@/api/api';

export function usePokemonDetailsQuery(id: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['pokemon', 'detail', id],
    queryFn: ({ signal }) => fetchPokemon(id!, signal),
    enabled: Boolean(id),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['pokemon', 'detail', id] });

  return {
    data: query.data ?? null,
    loading: query.isLoading || query.isFetching,
    error:
      query.error instanceof Error
        ? query.error.message
        : query.isError
          ? 'Unknown error'
          : null,
    invalidate,
  };
}
