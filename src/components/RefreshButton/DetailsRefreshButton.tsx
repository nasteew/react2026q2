'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { refreshDetails } from '@/actions/refresh';
import Button from '../ui/Button/Button';

interface Props {
  pokemonId: string;
}

export function DetailsRefreshButton({ pokemonId }: Props) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('refresh');

  const handleRefresh = () => {
    startTransition(() => refreshDetails(pokemonId));
  };

  return (
    <Button
      label={isPending ? t('refreshing') : t('refresh')}
      onClick={handleRefresh}
      className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition"
    />
  );
}
