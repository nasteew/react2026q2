import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

interface Props {
  page: number;
  totalPages: number;
  search: string;
}

function queryFor(page: number, search: string): Record<string, string> {
  const query: Record<string, string> = { page: String(page) };
  if (search) query.search = search;
  return query;
}

export default async function Pagination({ page, totalPages, search }: Props) {
  const t = await getTranslations('pagination');
  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  return (
    <div className="flex justify-center gap-4 mt-6 items-center">
      <Link
        href={{ pathname: '/', query: queryFor(Math.max(1, page - 1), search) }}
        aria-label={t('previous')}
        aria-disabled={isFirstPage}
        className={`
          bg-red-700 dark:bg-red-900 text-white px-3 py-2 text-sm
          border-2 border-black shadow-md rounded-lg
          inline-flex items-center justify-center
          hover:scale-105 active:scale-95
          ${isFirstPage ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        {'<'}
      </Link>

      <span
        className="
        px-3 py-1 rounded-lg text-sm
        bg-white dark:bg-gray-800
        text-gray-900 dark:text-gray-100
        border-2 border-black dark:border-gray-600
        shadow-sm
      "
      >
        {page} / {totalPages}
      </span>

      <Link
        href={{ pathname: '/', query: queryFor(page + 1, search) }}
        aria-label={t('next')}
        aria-disabled={isLastPage}
        className={`
          bg-red-700 dark:bg-red-900 text-white px-3 py-2 text-sm
          border-2 border-black shadow-md rounded-lg
          inline-flex items-center justify-center
          hover:scale-105 active:scale-95
          ${isLastPage ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        {'>'}
      </Link>
    </div>
  );
}
