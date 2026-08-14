import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchMulti } from '@/services/tmdb';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchMulti(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
  });

  return { query, setQuery, results: data, isLoading, isError };
}
