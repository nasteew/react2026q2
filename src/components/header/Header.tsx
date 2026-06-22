import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import SearchForm from './SearchForm';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from '@/components/header/ThemeToggle';

interface Props {
  search: string;
}

export default async function Header({ search }: Props) {
  const t = await getTranslations('nav');

  return (
    <header
      className="
      px-2 py-3 flex flex-col sm:flex-row sm:items-center gap-2
      bg-red-500 dark:bg-red-950
      shadow-lg transition-colors duration-300
    "
    >
      <nav className="flex-shrink-0">
        <Link
          href="/about"
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
          <span className="text-sm">{t('about')} →</span>
        </Link>
      </nav>

      <div className="flex-1 w-full">
        <SearchForm defaultValue={search} />
      </div>

      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}
