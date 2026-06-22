'use server';

import { revalidatePath } from 'next/cache';

export async function refreshList(locale: string) {
  revalidatePath(`/${locale}`);
}
