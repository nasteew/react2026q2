import { ERROR_CODES } from '@/constants/errors';

const TTL = Number(process.env.NEXT_PUBLIC_CACHE_TTL) || 120;

export async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    next: { revalidate: TTL },
  } as RequestInit);

  if (!response.ok) {
    if (response.status >= 500) {
      throw new Error(ERROR_CODES.SERVER_ERROR);
    }
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}
