'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <select
      value={locale}
      onChange={(e) =>
        router.replace(pathname, { locale: e.target.value as 'en' | 'ru' })
      }
      aria-label="Language"
      className="
        rounded-lg border-2 border-black px-2 py-1 text-sm
        bg-white dark:bg-gray-800 dark:text-gray-100
      "
    >
      {routing.locales.map((l) => (
        <option key={l} value={l}>
          {l.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
