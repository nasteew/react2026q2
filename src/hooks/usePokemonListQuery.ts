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
      ? () =>
          fetchPokemon(search).then((p) => ({ items: [p], count: 1, limit: 1 }))
      : () => fetchPokemonList(page),
  });

  const invalidate = () =>
    void queryClient.invalidateQueries({
      queryKey: isSearch
        ? ['pokemon', 'search', search]
        : ['pokemon', 'list', page],
    });

  const limit = query.data?.limit ?? 1;

  return {
    data: query.data?.items ?? [],
    loading: query.isLoading || query.isFetching,
    error:
      query.error instanceof Error
        ? query.error.message
        : query.isError
          ? 'Unknown error'
          : '',
    totalPages: isSearch
      ? 1
      : query.data
        ? Math.ceil(query.data.count / limit)
        : 1,
    invalidate,
  };
}
