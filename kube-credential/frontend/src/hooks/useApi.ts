import React from 'react';

export function useApi<TParams extends unknown[], TResult>(fn: (...args: TParams) => Promise<TResult>) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<TResult | null>(null);

  const call = React.useCallback(async (...args: TParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fn(...args);
      setData(res);
      return res;
    } catch (e: any) {
      setError(e?.message || 'Unknown error');
      throw e;
    } finally {
      setLoading(false);
    }
  }, [fn]);

  return { loading, error, data, call };
}
