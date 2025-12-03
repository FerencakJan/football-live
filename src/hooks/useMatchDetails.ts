// src/hooks/useMatchDetails.ts
import { useQueries } from '@tanstack/react-query';
import { fetchMatchEvents, fetchMatchLineups } from '../api/footballApi';

export function useMatchDetails(fixtureId: string) {
    const isEnabled = !!fixtureId; // Spustíme len, ak máme ID

    const results = useQueries({
        queries: [
            {
                queryKey: ['matchEvents', fixtureId],
                queryFn: () => fetchMatchEvents(fixtureId),
                enabled: isEnabled,
                staleTime: 60_000, // Dáta sa menia pomaly
                refetchInterval: 30_000 // Obnovíme každých 30s
            },
            {
                queryKey: ['matchLineups', fixtureId],
                queryFn: () => fetchMatchLineups(fixtureId),
                enabled: isEnabled,
                staleTime: Infinity, // Zostavy sa po štarte zápasu nemenia
            },
        ],
    });

    return {
        events: results[0].data,
        lineups: results[1].data,
        isLoading: results.some(r => r.isLoading),
        isError: results.some(r => r.isError),
    };
}