// src/hooks/useMatches.ts

import { useQuery } from '@tanstack/react-query';
import { fetchLiveMatches } from '../api/footballApi';
import { MOCK_FIXTURES } from '../mock/mockData'; // ✅ Import mock dát
export const USE_REAL_API = process.env.EXPO_PUBLIC_USE_REAL_API === 'true';
export function useMatches() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['liveMatches'],
    queryFn: fetchLiveMatches,
    refetchInterval: 120_000,
    refetchOnWindowFocus: true,
    retry: 0,
    staleTime: 60_000,
  });

  if (!USE_REAL_API || isError) {
    console.warn('MOCK MODE active (USE_REAL_API=false) or query error — returning MOCK_FIXTURES.');
    return {
      data: MOCK_FIXTURES,
      isLoading: false,
      isError: false,
      error: null,
    };
  }
  // Predpokladá sa, že fetchLiveMatches vracia 'res.data.response'
  return { data: data?.response, isLoading, isError, error }; 
}