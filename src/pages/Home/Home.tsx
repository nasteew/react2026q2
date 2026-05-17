import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import useLocalStorage from '@/hooks/useLocalStorage';
import { useQuery } from '@/hooks/useQuery';

import { fetchPokemon, fetchPokemonList } from '@/api/api';

import { Search } from '@/components/Search/Search';
import Loader from '@/components/Loader/Loader';
import CardList from '@/components/CardList/CardList';
import ErrorButton from '@/components/ErrorButton/ErrorButton';
import type { Item } from '@/types/item';

export function Home() {
  const [searchTerm, setSearchTerm] = useLocalStorage();

  const [params, setParams] = useSearchParams();
  const search = params.get('search') || '';
  const page = Number(params.get('page') || '1');

  const [query, setQuery] = useState(searchTerm);

  const queryFn = useCallback(
    (): Promise<Item[]> =>
      search
        ? fetchPokemon(search).then((item) => [item])
        : fetchPokemonList(page),
    [search, page]
  );

  const { data, loading, error } = useQuery(queryFn);

  const handleSubmit = () => {
    const trimmed = query.trim();

    if (trimmed === search.trim()) return;

    setSearchTerm(trimmed);

    if (trimmed) {
      setParams({ search: trimmed, page: '1' });
    } else {
      setParams({ page: '1' });
    }
  };

  const handlePageChange = (newPage: number) => {
    setParams({ search, page: String(newPage) });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-red-500 shadow-lg">
        <Search value={query} onChange={setQuery} onSubmit={handleSubmit} />
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {loading && <Loader />}

        {error && (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl border-3 border-red-500 text-center">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && data && <CardList items={data} />}

        {!search && !loading && !error && (
          <div className="flex justify-center gap-4 mt-6">
            <button
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="px-4 py-2 bg-white rounded border">
              Page {page}
            </span>

            <button
              onClick={() => handlePageChange(page + 1)}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Next
            </button>
          </div>
        )}
      </main>

      <div className="max-w-4xl mx-auto flex justify-end p-4">
        <ErrorButton />
      </div>
    </div>
  );
}
