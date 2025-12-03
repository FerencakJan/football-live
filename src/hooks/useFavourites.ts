// src/hooks/useFavorites.ts (OPRAVENÁ VERZIA)
import { useQuery } from '@tanstack/react-query';
import { getFavoritesByUser } from '../api/favourite';
import { useSession } from './useSession'; // ⬅️ NOVÝ IMPORT

export function useFavorites() {
  const { session, loading: sessionLoading } = useSession(); // Získanie session stavu
  const userId = session?.user.id;

  return useQuery({ 
    queryKey: ['favorites', userId],
    // queryFn sa spustí, len ak existuje userId
    queryFn: () => getFavoritesByUser(userId!), 
    // Dopyt sa spustí, len ak máme session dáta A nie sme v stave načítavania session
    enabled: !!userId && !sessionLoading, 
  });
}