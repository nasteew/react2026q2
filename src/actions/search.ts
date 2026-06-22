'use server';

import { getLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';

export async function searchAction(formData: FormData): Promise<void> {
  const term = String(formData.get('search') ?? '').trim();

  const params = new URLSearchParams({ page: '1' });
  if (term) params.set('search', term);

  const locale = await getLocale();
  redirect({ href: `/?${params.toString()}`, locale });
}
