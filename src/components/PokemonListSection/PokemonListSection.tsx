import CardList from '@/components/CardList/CardList';
import Pagination from '@/components/Pagination/Pagination';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import { fetchPokemon, fetchPokemonList } from '@/api/api';
import { getTranslations } from 'next-intl/server';
import { getErrorMessage } from '@/utils/getErrorMessage';

interface Props {
  page: string;
  search: string;
  isDetailOpen: boolean;
}

export default async function PokemonListSection({
  page,
  search,
  isDetailOpen,
}: Props) {
  const t = await getTranslations('errors');
  let items = [];
  let totalPages = 1;

  try {
    if (search.trim()) {
      const pokemon = await fetchPokemon(search.trim());

      items = [pokemon];
      totalPages = 1;
    } else {
      const result = await fetchPokemonList(Number(page));

      items = result.items;
      totalPages = result.totalPages;
    }
  } catch (error) {
    return <ErrorMessage message={getErrorMessage(error, t)} />;
  }

  const showPagination = !search && items.length > 0;

  return (
    <>
      <CardList
        items={items}
        search={search}
        page={page}
        isDetailOpen={isDetailOpen}
      />

      {showPagination && (
        <Pagination
          page={Number(page)}
          totalPages={totalPages}
          search={search}
        />
      )}
    </>
  );
}
