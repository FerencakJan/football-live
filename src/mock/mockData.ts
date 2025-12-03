// src/mocks/mockData.ts

// --- Konfigurácia Formácií a Pozícií ---
const FORMATION_4_4_2 = [
    { pos: 'G', count: 1 }, // Brankár
    { pos: 'D', count: 4 }, // Obrana (Full-backs, Center-backs)
    { pos: 'M', count: 4 }, // Stred poľa (Wingers, CMs)
    { pos: 'F', count: 2 }, // Útok (Strikers)
];
const NUM_SUBS = 7; // Počet náhradníkov
let playerIdCounter = 2000;

const getRandomName = (suffix: string) => {
    const names = ['Marek', 'Peter', 'Juraj', 'Tomáš', 'Lukáš', 'Martin', 'Michal', 'Ján', 'Ivan', 'Dušan'];
    const surnames = ['Kováč', 'Varga', 'Tóth', 'Nagy', 'Horváth', 'Molnár', 'Novák', 'Baláž', 'Sokol', 'Zelený'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomSurname = surnames[Math.floor(Math.random() * surnames.length)];
    return `${randomName} ${randomSurname}`;
};

// Funkcia na generovanie náhodného čísla dresu (1-99)
const getRandomJerseyNumber = (): number => {
    return Math.floor(Math.random() * 99) + 1;
};

// Funkcia na generovanie realistickej zostavy 
const generateTeamLineup = (teamId: number, teamName: string, logo: string, formation: { pos: string, count: number }[]) => {
    const startXI: any[] = [];
    const substitutes: any[] = [];

    // Základná jedenástka (11 hráčov)
    formation.forEach(({ pos, count }) => {
        for (let i = 0; i < count; i++) {
            startXI.push({
                player: {
                    id: playerIdCounter++,
                    name: getRandomName(''),
                    number: getRandomJerseyNumber(), // Náhodné číslo dresu 1-99
                },
                pos: pos,
            });
        }
    });

    // Náhradníci (7 hráčov)
    for (let i = 0; i < NUM_SUBS; i++) {
        substitutes.push({
            player: {
                id: playerIdCounter++,
                name: getRandomName(''),
                number: getRandomJerseyNumber(), // Náhodné číslo dresu 1-99
            },
            pos: (i % 3 === 0) ? 'D' : (i % 3 === 1) ? 'M' : 'F', // Mix pozícií
        });
    }

    return {
        team: { id: teamId, name: teamName, logo: logo },
        startXI: startXI,
        substitutes: substitutes,
        coach: { name: `Hlavný tréner ${teamName.split(' ').pop()}` },
        // human-friendly formation string (exclude goalkeeper if present)
        formation: formation.filter(f => f.pos !== 'G').map(f => f.count).join('-'),
    };
};

// --- GLOBÁLNE DÁTA PRE useMatches ---

export const MOCK_FIXTURES = [
    // 1. Live zápas (75') - Pre tento ID budeme mať detaily (3:1)
    {
        fixture: { id: 1000001, date: '2025-12-03T20:00:00+00:00', status: { elapsed: 75, long: 'Second Half', short: '2H' } },
        league: { id: 10, name: 'Mock Super Liga', country: 'SVK', logo: 'https://media.api-sports.io/football/leagues/6.png' },
        teams: {
            home: { id: 541, name: 'FC Mock Domov', logo: 'https://media.api-sports.io/football/teams/541.png', winner: true },
            away: { id: 542, name: 'SC Mock Hostia', logo: 'https://media.api-sports.io/football/teams/542.png', winner: false },
        },
        goals: { home: 3, away: 1 },
    },
    // 2. Skončený zápas (FT)
    {
        fixture: { id: 1000002, date: '2025-12-03T20:00:00+00:00', status: { elapsed: null, long: 'Match Finished', short: 'FT' } },
        league: { id: 11, name: 'Mock Pohár', country: 'CZE', logo: 'https://media.api-sports.io/football/leagues/15.png' },
        teams: {
            home: { id: 543, name: 'Test Sparta', logo: 'https://media.api-sports.io/football/teams/543.png', winner: false },
            away: { id: 544, name: 'Test Slavia', logo: 'https://media.api-sports.io/football/teams/544.png', winner: true },
        },
        goals: { home: 0, away: 2 },
    },
    // 3. Ďalší Live zápas (HT)
    { fixture: { id: 1000003, date: '2025-12-04T18:30:00+00:00', status: { elapsed: 45, long: 'Halftime', short: 'HT' } }, league: { id: 39, name: 'Premier League Mock', country: 'ENG', logo: 'https://media.api-sports.io/football/leagues/39.png' }, teams: { home: { id: 33, name: 'Man Utd Mock', logo: 'https://media.api-sports.io/football/teams/33.png' }, away: { id: 40, name: 'Liverpool Mock', logo: 'https://media.api-sports.io/football/teams/40.png' } }, goals: { home: 1, away: 1 } },
    // 4. Zápas, ktorý ešte nezačal (NS)
    { fixture: { id: 1000004, date: '2025-12-04T21:00:00+00:00', status: { elapsed: 0, long: 'Not Started', short: 'NS' } }, league: { id: 78, name: 'Bundesliga Mock', country: 'GER', logo: 'https://media.api-sports.io/football/leagues/78.png' }, teams: { home: { id: 161, name: 'Bayern Mock', logo: 'https://media.api-sports.io/football/teams/161.png' }, away: { id: 165, name: 'Dortmund Mock', logo: 'https://media.api-sports.io/football/teams/165.png' } }, goals: { home: null, away: null } },
    // 5. Zápas v 1. polčase
    { fixture: { id: 1000005, date: '2025-12-05T15:00:00+00:00', status: { elapsed: 5, long: 'First Half', short: '1H' } }, league: { id: 128, name: 'Série A Mock', country: 'BRA', logo: 'https://media.api-sports.io/football/leagues/128.png' }, teams: { home: { id: 131, name: 'Mock A', logo: 'https://media.api-sports.io/football/teams/131.png' }, away: { id: 133, name: 'Mock B', logo: 'https://media.api-sports.io/football/teams/133.png' } }, goals: { home: 0, away: 0 } },
    // 6. Zápas v 2. polčase (ID: 1000006) - Pre tento ID budeme mať detaily (2:2)
    {
        fixture: { id: 1000006, date: '2025-12-05T17:00:00+00:00', status: { elapsed: 60, long: 'Second Half', short: '2H' } },
        league: { id: 140, name: 'La Liga Mock', country: 'ESP', logo: 'https://media.api-sports.io/football/leagues/140.png' },
        teams: { home: { id: 529, name: 'Mock C', logo: 'https://media.api-sports.io/football/teams/529.png' }, away: { id: 530, name: 'Mock D', logo: 'https://media.api-sports.io/football/teams/530.png' } },
        goals: { home: 2, away: 2 },
    },
];

// --- DÁTA PRE DETAIL ZÁPASU (ID: 1000001) ---
export const MOCK_EVENTS_1000001 = [
    { time: { elapsed: 15 }, team: { id: 541, name: 'FC Mock Domov' }, player: { name: 'Peter Golista' }, type: 'Goal', detail: 'Normal Goal' },
    { time: { elapsed: 30 }, team: { id: 542, name: 'SC Mock Hostia' }, player: { name: 'Ján Rýchly' }, type: 'Goal', detail: 'Normal Goal' },
    { time: { elapsed: 40 }, team: { id: 542, name: 'SC Mock Hostia' }, player: { name: 'Karol Agresor' }, type: 'Card', detail: 'Yellow Card' },
    { time: { elapsed: 65 }, team: { id: 541, name: 'FC Mock Domov' }, player: { name: 'Peter Golista' }, type: 'Goal', detail: 'Normal Goal' },
    { time: { elapsed: 75 }, team: { id: 541, name: 'FC Mock Domov' }, player: { name: 'Ivan Striedac' }, type: 'subst', detail: 'Substitution' },
];
export const MOCK_LINEUPS_1000001 = [
    generateTeamLineup(541, 'FC Mock Domov', 'https://media.api-sports.io/football/teams/541.png', FORMATION_4_4_2),
    generateTeamLineup(542, 'SC Mock Hostia', 'https://media.api-sports.io/football/teams/542.png', FORMATION_4_4_2),
];

// --- DÁTA PRE DETAIL ZÁPASU (ID: 1000006) ---
export const MOCK_EVENTS_1000006 = [
    { time: { elapsed: 10 }, team: { id: 529, name: 'Mock C' }, player: { name: 'Rýchly Gól' }, type: 'Goal', detail: 'Normal Goal' },
    { time: { elapsed: 25 }, team: { id: 530, name: 'Mock D' }, player: { name: 'Odpoved' }, type: 'Goal', detail: 'Penalty' },
    { time: { elapsed: 55 }, team: { id: 529, name: 'Mock C' }, player: { name: 'Druhý Strelec' }, type: 'Goal', detail: 'Normal Goal' },
    { time: { elapsed: 60 }, team: { id: 530, name: 'Mock D' }, player: { name: 'Žltý Faul' }, type: 'Card', detail: 'Yellow Card' },
    { time: { elapsed: 70 }, team: { id: 530, name: 'Mock D' }, player: { name: 'Kopáč' }, type: 'Goal', detail: 'Normal Goal' },
];
export const MOCK_LINEUPS_1000006 = [
    generateTeamLineup(529, 'Mock C', 'https://media.api-sports.io/football/teams/529.png', FORMATION_4_4_2),
    generateTeamLineup(530, 'Mock D', 'https://media.api-sports.io/football/teams/530.png', FORMATION_4_4_2),
];

// --- MOCK DÁTA PRE OBĽÚBENÉ ---
export const MOCK_FAVORITES = [
    { id: 1, user_id: 'mock-user-1', match_id: '1000003', league: 'Premier League Mock', teams: MOCK_FIXTURES[2].teams }
];

// --- MOCK STANDINGS (by league id) ---
// Simple league table for `Mock Super Liga` (league id: 10)
export const MOCK_STANDINGS: Record<number, any[]> = {
    10: [
        { rank: 1, team: { id: 541, name: 'FC Mock Domov', logo: 'https://media.api-sports.io/football/teams/541.png' }, points: 45, played: 20, win: 14, draw: 3, loss: 3, goalsFor: 40, goalsAgainst: 18, goalsDiff: 22 },
        { rank: 2, team: { id: 542, name: 'SC Mock Hostia', logo: 'https://media.api-sports.io/football/teams/542.png' }, points: 42, played: 20, win: 13, draw: 3, loss: 4, goalsFor: 36, goalsAgainst: 20, goalsDiff: 16 },
        { rank: 3, team: { id: 600, name: 'Rival FC', logo: '' }, points: 37, played: 20, win: 11, draw: 4, loss: 5, goalsFor: 30, goalsAgainst: 22, goalsDiff: 8 },
        { rank: 4, team: { id: 601, name: 'City Mock', logo: '' }, points: 33, played: 20, win: 10, draw: 3, loss: 7, goalsFor: 28, goalsAgainst: 24, goalsDiff: 4 },
        { rank: 5, team: { id: 602, name: 'United Mock', logo: '' }, points: 30, played: 20, win: 8, draw: 6, loss: 6, goalsFor: 25, goalsAgainst: 23, goalsDiff: 2 },
        { rank: 6, team: { id: 603, name: 'AC Mock', logo: '' }, points: 28, played: 20, win: 8, draw: 4, loss: 8, goalsFor: 22, goalsAgainst: 21, goalsDiff: 1 },
        { rank: 7, team: { id: 604, name: 'Town FC', logo: '' }, points: 26, played: 20, win: 7, draw: 5, loss: 8, goalsFor: 21, goalsAgainst: 24, goalsDiff: -3 },
        { rank: 8, team: { id: 605, name: 'Athletic Mock', logo: '' }, points: 24, played: 20, win: 6, draw: 6, loss: 8, goalsFor: 20, goalsAgainst: 25, goalsDiff: -5 },
        { rank: 9, team: { id: 606, name: 'County Mock', logo: '' }, points: 22, played: 20, win: 6, draw: 4, loss: 10, goalsFor: 18, goalsAgainst: 26, goalsDiff: -8 },
        { rank: 10, team: { id: 607, name: 'Rovers', logo: '' }, points: 20, played: 20, win: 5, draw: 5, loss: 10, goalsFor: 17, goalsAgainst: 29, goalsDiff: -12 },
        { rank: 11, team: { id: 608, name: 'Olympic Mock', logo: '' }, points: 18, played: 20, win: 4, draw: 6, loss: 10, goalsFor: 16, goalsAgainst: 28, goalsDiff: -12 },
        { rank: 12, team: { id: 609, name: 'Harbor FC', logo: '' }, points: 17, played: 20, win: 4, draw: 5, loss: 11, goalsFor: 15, goalsAgainst: 30, goalsDiff: -15 },
        { rank: 13, team: { id: 610, name: 'Valley United', logo: '' }, points: 15, played: 20, win: 3, draw: 6, loss: 11, goalsFor: 14, goalsAgainst: 31, goalsDiff: -17 },
        { rank: 14, team: { id: 611, name: 'Wanderers', logo: '' }, points: 12, played: 20, win: 2, draw: 6, loss: 12, goalsFor: 12, goalsAgainst: 35, goalsDiff: -23 },
        { rank: 15, team: { id: 612, name: 'Bottom FC', logo: '' }, points: 8, played: 20, win: 1, draw: 5, loss: 14, goalsFor: 10, goalsAgainst: 40, goalsDiff: -30 },
    ],
};