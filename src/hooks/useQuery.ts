import { useEffect, useState } from 'react';

export function useQuery<T>(asyncFn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await asyncFn();

        if (alive) setData(result);
      } catch (e) {
        if (alive) {
          setError(e instanceof Error ? e.message : 'Unknown error');
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [asyncFn]);

  return { data, loading, error };
}
