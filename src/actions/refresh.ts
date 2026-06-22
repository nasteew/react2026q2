'use server';

import { revalidateTag } from 'next/cache';

export async function refreshDetails(name: string) {
  revalidateTag(`pokemon-${name.toLowerCase()}`, 'max');
}

export async function refreshList(page: number) {
  revalidateTag(`pokemon-list-${page}`, 'max');
}
