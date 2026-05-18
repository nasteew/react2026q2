export async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    if (response.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }

    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}
