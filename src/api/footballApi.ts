// src/api/footballApi.ts
import { api } from './apiClient';
import { 
    // ✅ AKTUALIZOVANÉ IMPORTY pre špecifické ID (podľa dohody v mockData.ts)
    MOCK_EVENTS_1000001, 
    MOCK_LINEUPS_1000001,
    MOCK_EVENTS_1000006, 
    MOCK_LINEUPS_1000006 
} from '../mock/mockData'; 
import { USE_REAL_API } from '../config';

// Central toggle is `USE_REAL_API`: set `EXPO_PUBLIC_USE_REAL_API=true` to enable real API.

// --- FUNKCIE PRE API / MOCK ---

export const fetchLiveMatches = async () => {
  
    if (!USE_REAL_API) {
       
        throw new Error('API is disabled (mock mode). useMatches will return mock fixtures.');
    }
    console.log('USE_REAL_API:', USE_REAL_API);
    const res = await api.get('/fixtures', { params: { live: 'all' } });
    console.log('API response:', res.data.response);
    return res.data.response;
    
};

export const fetchMatchById = async (id: string) => {
    const res = await api.get('/fixtures', { params: { id } });
    return res.data;
};

export const fetchMatchEvents = async (fixtureId: string) => {
    if (!USE_REAL_API) {
        //Dynamická kontrola ID v Mock móde
        switch (fixtureId) {
            case '1000001':
                return MOCK_EVENTS_1000001; //premenované konštanty
            case '1000006':
                return MOCK_EVENTS_1000006;
            default:
                // Pre ostatné zápasy vráti prázdne pole
                return []; 
        }
    }
    
    // Volanie reálneho API
    const res = await api.get('/fixtures/events', { params: { fixture: fixtureId } });
    return res.data.response;
};

export const fetchMatchLineups = async (fixtureId: string) => {
    if (!USE_REAL_API) {
        //Dynamická kontrola ID v Mock móde
        switch (fixtureId) {
            case '1000001':
                return MOCK_LINEUPS_1000001; //premenované konštanty
            case '1000006':
                return MOCK_LINEUPS_1000006;
            default:
                // Pre ostatné zápasy vráti prázdne pole
                return []; 
        }
    }

    // Volanie reálneho API
    const res = await api.get('/fixtures/lineups', { params: { fixture: fixtureId } });
    return res.data.response;
};
