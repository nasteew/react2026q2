import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPokemonList, fetchPokemon } from '@/api/api';

export function usePokemonListQuery(page: number, search: string) {
  const queryClient = useQueryClient();
  const isSearch = Boolean(search);

  const query = useQuery({
    queryKey: isSearch
      ? ['pokemon', 'search', search]
      : ['pokemon', 'list', page],
    queryFn: isSearch
      ? ({ signal }) =>
          fetchPokemon(search, signal).then((p) => ({
            items: [p],
            totalPages: 1,
          }))
      : ({ signal }) => fetchPokemonList(page, signal),
  });

  const invalidate = () =>
    void queryClient.invalidateQueries({
      queryKey: isSearch
        ? ['pokemon', 'search', search]
        : ['pokemon', 'list', page],
    });

  return {
    data: query.data?.items ?? [],
    loading: query.isLoading || query.isFetching,
    error:
      query.error instanceof Error
        ? query.error.message
        : query.isError
          ? 'Unknown error'
          : '',
    totalPages: query.data?.totalPages ?? 1,
    invalidate,
  };
}
