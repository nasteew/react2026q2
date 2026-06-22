'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { startTransition } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale as 'en' | 'ru' });
    });
  };

  return (
    <select
      value={locale}
      onChange={(e) => handleChange(e.target.value)}
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
