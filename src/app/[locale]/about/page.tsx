import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Pokeball from '@/components/ui/icons/Pokeball';
import { routing } from '@/i18n/routing';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;

  return {
    title: 'About | Pokémon Explorer',
    description:
      'About Pokémon Explorer - a React and Next.js application for searching Pokémon',
    openGraph: {
      title: 'About Pokémon Explorer',
      description:
        'Learn about this Pokémon search application built with Next.js',
    },
    alternates: {
      canonical: locale === 'en' ? '/about' : `/${locale}/about`,
      languages: {
        en: '/en/about',
        ru: '/ru/about',
      },
    },
  };
}

export const dynamic = 'force-static';

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  return (
    <div className="min-h-screen flex items-center justify-center p-6 transition-colors duration-300 bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-lg w-full overflow-hidden">
        <div className="bg-red-500 dark:bg-red-950 p-8 flex flex-col items-center gap-3 transition-colors duration-300">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md">
            <Pokeball className="h-20" />
          </div>
          <h1 className="text-2xl font-bold text-white">{t('title')}</h1>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              {t('authorLabel')}
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {t('authorName')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('authorRole')}
            </p>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700" />

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              {t('appLabel')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('appDescription')}
            </p>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700" />

          <div className="flex flex-col gap-3">
            <a
              href="https://rs.school/courses/reactjs"
              target="_blank"
              rel="noreferrer"
              className="
                flex items-center justify-between px-4 py-3 rounded-xl
                bg-red-50 dark:bg-red-950
                border border-red-100 dark:border-red-800
                hover:bg-red-100 dark:hover:bg-red-900
                transition-colors duration-200
              "
            >
              <span className="text-sm font-semibold text-red-700 dark:text-red-400">
                {t('courseLink')}
              </span>
              <span className="text-red-400 dark:text-red-500">→</span>
            </a>

            <Link
              href={{ pathname: '/', query: { page: '1' } }}
              locale={locale}
              className="
                flex items-center justify-between px-4 py-3 rounded-xl
                bg-gray-50 dark:bg-gray-700
                border border-gray-100 dark:border-gray-600
                hover:bg-gray-100 dark:hover:bg-gray-600
                transition-colors duration-200
              "
            >
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {tNav('backToApp')}
              </span>
              <span className="text-gray-400">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
