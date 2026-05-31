import { useCallback, useState } from 'react';
import { Link, Outlet, useSearchParams } from 'react-router-dom';
import useLocalStorage from '@/hooks/useLocalStorage';
import Search from '@/components/Search/Search';
import Loader from '@/components/Loader/Loader';
import CardList from '@/components/CardList/CardList';
import ErrorButton from '@/components/ErrorButton/ErrorButton';
import Pagination from '@/components/Pagination/Pagination';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Button from '@/components/ui/Button/Button';
import { usePokemonListQuery } from '@/hooks/usePokemonListQuery';
import Flyout from '@/components/Flyout/Flyout';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';

export function Home() {
  const [searchTerm, setSearchTerm] = useLocalStorage('searchTerm', '');
  const [params, setParams] = useSearchParams();

  const search = params.get('search') || '';
  const page = params.get('page') || '1';
  const details = params.get('details');
  const isDetailOpen = Boolean(details);

  const [inputValue, setInputValue] = useState(searchTerm);

  const { data, loading, error, totalPages } = usePokemonListQuery(
    Number(page),
    search
  );

  const handleSubmit = useCallback(() => {
    const trimmed = inputValue.trim();
    if (trimmed === search.trim()) return;
    setSearchTerm(trimmed);
    if (trimmed) {
      setParams({ search: trimmed, page: '1' });
    } else {
      setParams({ page: '1' });
    }
  }, [inputValue, search, setSearchTerm, setParams]);

  const handleCardClick = useCallback(
    (id: number) => {
      const next: Record<string, string> = {
        page: String(page),
        details: String(id),
      };
      if (search) next.search = search;
      setParams(next);
    },
    [page, search, setParams]
  );

  const handleCloseDetails = useCallback(() => {
    const next: Record<string, string> = { page: String(page) };
    if (search) next.search = search;
    setParams(next);
  }, [page, search, setParams]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      const next: Record<string, string> = { page: String(newPage) };
      if (search) next.search = search;
      if (details) next.details = details;
      setParams(next);
    },
    [search, details, setParams]
  );

  const showPagination =
    !search && !loading && !error && data && data.length > 0;

  return (
    <div className="min-h-screen transition-colors duration-300">
      <header
        className="
        px-2 py-3 flex flex-col sm:flex-row sm:items-center gap-2
        bg-red-500 dark:bg-red-950
        shadow-lg transition-colors duration-300
      "
      >
        <nav className="flex-shrink-0">
          <Link
            to="/about"
            aria-label="About page"
            className="
              inline-flex items-center px-5 py-2 rounded-xl
              border-2 border-black shadow-lg font-semibold text-white
              bg-red-700 dark:bg-red-900
              active:scale-95 transform transition-all duration-150 ease-out
              hover:scale-105 hover:shadow-xl
              focus:outline-none focus:ring-2
            "
          >
            <span className="text-sm">About →</span>
          </Link>
        </nav>

        <div className="flex-1 w-full">
          <Search
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
          />
        </div>

        <ThemeToggle />
      </header>

      <main
        className={`p-3 transition-all duration-300 ${
          isDetailOpen ? '' : 'max-w-5xl mx-auto'
        }`}
      >
        <div className="flex gap-4 items-start">
          <div
            data-testid="left-column"
            className={`min-w-0 transition-all duration-300 ${
              isDetailOpen ? 'w-1/2 cursor-pointer' : 'w-full'
            }`}
            onClick={isDetailOpen ? handleCloseDetails : undefined}
          >
            {loading && <Loader />}
            {error && <ErrorMessage message={error || 'Unknown error'} />}

            {!loading && !error && data && (
              <CardList
                items={data}
                onCardClick={handleCardClick}
                isDetailOpen={isDetailOpen}
              />
            )}
          </div>

          {isDetailOpen && (
            <div
              className="
              w-1/2 sticky top-4
              max-h-[calc(100vh-6rem)] overflow-y-auto
              bg-white dark:bg-gray-800
              shadow-2xl rounded-2xl
              transition-colors duration-300
            "
            >
              <Button
                onClick={handleCloseDetails}
                className="
                  absolute top-3 right-3 z-10
                  px-3 py-2 rounded-lg
                  border border-black
                  bg-red-700 dark:bg-red-900
                  text-white
                "
                label="✕"
              />
              <Outlet />
            </div>
          )}
        </div>
      </main>

      {showPagination && (
        <Pagination
          page={Number(page)}
          onChange={handlePageChange}
          totalPages={totalPages}
        />
      )}

      <Flyout />

      <div className="flex justify-end p-4">
        <ErrorButton />
      </div>
    </div>
  );
}
