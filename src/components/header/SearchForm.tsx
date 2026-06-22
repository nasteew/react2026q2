'use client';

import { useTranslations } from 'next-intl';
import Pokeball from '@/components/ui/icons/Pokeball';
import Button from '@/components/ui/Button/Button';
import useLocalStorage from '@/hooks/useLocalStorage';
import { searchAction } from '@/actions/search';

interface Props {
  defaultValue: string;
}

export default function SearchForm({ defaultValue }: Props) {
  const t = useTranslations('search');
  const [storedSearch, setStoredSearch] = useLocalStorage(
    'searchTerm',
    defaultValue
  );

  return (
    <form
      action={searchAction}
      onSubmit={(e) => {
        const input = e.currentTarget.elements.namedItem(
          'search'
        ) as HTMLInputElement | null;
        setStoredSearch(input?.value.trim() ?? '');
      }}
      className="flex gap-4 items-center max-w-4xl mx-auto p-4"
      role="search"
      aria-label="Search Pokémon"
    >
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Pokeball className="w-5 h-5" />
        </span>

        <input
          type="text"
          name="search"
          defaultValue={storedSearch}
          className="
            w-full border-2 border-black rounded-md px-3 py-2 pl-12
            bg-white dark:bg-gray-800
            text-sm text-gray-900 dark:text-gray-100
            placeholder-gray-600 dark:placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-gray-600
            transition-colors duration-200
          "
          placeholder={t('placeholder')}
          aria-label={t('placeholder')}
        />
      </div>

      <Button
        type="submit"
        label={t('submit')}
        className="text-white bg-red-700 dark:bg-red-900 focus:ring-white px-5 py-2"
      />
    </form>
  );
}
