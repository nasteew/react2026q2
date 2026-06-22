import Header from '@/components/header/Header';
import PokemonDetails from '@/components/Details/PokemonDetails';
import Flyout from '@/components/Flyout/Flyout';
import ErrorButton from '@/components/ErrorButton/ErrorButton';
import { Suspense } from 'react';
import Loader from '@/components/Loader/Loader';
import PokemonListSection from '@/components/PokemonListSection/PokemonListSection';
import CloseDetailOnClick from '@/components/CloseDetailOnClick/CloseDetailOnClick';
import { RefreshButton } from '@/components/RefreshButton/RefreshButton';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    search?: string;
    page?: string;
    details?: string;
  }>;
}

export default async function HomePage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { search = '', page = '1', details } = await searchParams;

  const isDetailOpen = Boolean(details);

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-100 dark:bg-gray-900">
      <Header search={search} />

      <main
        className={`p-3 transition-all duration-300 ${
          isDetailOpen ? '' : 'max-w-5xl mx-auto'
        }`}
      >
        <RefreshButton page={Number(page)} />
        <div className="flex gap-4 items-start">
          <CloseDetailOnClick
            isDetailOpen={isDetailOpen}
            className={`min-w-0 transition-all duration-300 ${
              isDetailOpen ? 'w-1/2' : 'w-full'
            }`}
          >
            <Suspense key={`list-${page}-${search}`} fallback={<Loader />}>
              <PokemonListSection
                page={page}
                search={search}
                isDetailOpen={isDetailOpen}
              />
            </Suspense>
          </CloseDetailOnClick>

          {isDetailOpen && details && (
            <div
              className="
                w-1/2 sticky top-4
                max-h-[calc(100vh-6rem)] overflow-y-auto
                shadow-2xl rounded-2xl
              "
            >
              <Suspense
                key={`details-${locale}-${details}`}
                fallback={<Loader />}
              >
                <PokemonDetails id={details} search={search} page={page} />
              </Suspense>
            </div>
          )}
        </div>
      </main>

      <Flyout />

      <div className="flex justify-end p-4">
        <ErrorButton />
      </div>
    </div>
  );
}
