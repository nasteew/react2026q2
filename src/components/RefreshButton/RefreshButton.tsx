'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { refreshList } from '@/actions/refresh';
import Button from '../ui/Button/Button';

export function RefreshButton({ locale }: { locale: string }) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('refresh');

  return (
    <Button
      label={isPending ? t('refreshing') : t('refresh')}
      onClick={() => startTransition(() => refreshList(locale))}
      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition mb-3"
    />
  );
}
