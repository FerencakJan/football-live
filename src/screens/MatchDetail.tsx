// src/screens/MatchDetail.tsx

import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, Image, ActivityIndicator, Pressable, ImageBackground } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { addFavorite, getFavoritesByUser, removeFavorite } from '../api/favourite'; 
import { MOCK_STANDINGS } from '../mock/mockData';
import { useSession } from '../hooks/useSession';
import { useMatchDetails } from '../hooks/useMatchDetails'; 
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import Svg, { Rect, Circle, Text as SvgText } from 'react-native-svg';

const ACCENT = '#00D4FF';
const REALISTIC_PITCH = require('../../assets/realistic-football-field-with-official-markings-on-the-field-vector.jpg');

const JerseySVG = ({ number, color, size = 44 }: { number: string | number; color?: string; size?: number }) => {
    const width = size;
    const height = Math.round(size * 1.06);
    const radius = Math.max(4, Math.floor(size * 0.12));
    const fill = (color ? color : '#111') + 'ee';
    const border = color || ACCENT;
    const shadowFill = '#00000022';
    const shoulderR = Math.max(3, Math.floor(size * 0.12));
    return (
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <Rect x={2} y={4} rx={radius} width={width - 4} height={height - 6} fill={shadowFill} />
            <Rect x={0} y={0} rx={radius} width={width} height={height - 2} fill={fill} stroke={border} strokeWidth={1.4} />
            <Circle cx={Math.round(width * 0.18)} cy={Math.round(shoulderR + 2)} r={shoulderR} fill={fill} />
            <Circle cx={Math.round(width * 0.82)} cy={Math.round(shoulderR + 2)} r={shoulderR} fill={fill} />
            <SvgText x={width / 2} y={Math.round(height * 0.62)} fontSize={Math.max(10, Math.floor(size * 0.36))} fontWeight="900" fill="#ffffff" textAnchor="middle">{String(number)}</SvgText>
        </Svg>
    );
};

// Load shirt/jersey PNG 
let ASSET_SHIRT_BLUE: any = null;
let ASSET_SHIRT_RED: any = null;
let ASSET_SHIRT_GREEN: any = null;
let ASSET_SHIRT_YELLOW: any = null;
try { ASSET_SHIRT_BLUE = require('../../assets/shirt_blue.png'); } catch (e) { ASSET_SHIRT_BLUE = null; }
try { ASSET_SHIRT_RED = require('../../assets/shirt_red.png'); } catch (e) { ASSET_SHIRT_RED = null; }
try { ASSET_SHIRT_GREEN = require('../../assets/shirt_green.png'); } catch (e) { ASSET_SHIRT_GREEN = null; }
try { ASSET_SHIRT_YELLOW = require('../../assets/shirt_yellow.png'); } catch (e) { ASSET_SHIRT_YELLOW = null; }

const JerseyImage = ({ number, colorKey, size = 44 }: { number: string | number; colorKey?: 'blue'|'red'|'green'|'yellow'; size?: number }) => {
    const assetMap: Record<string, any> = {
        blue: ASSET_SHIRT_BLUE,
        red: ASSET_SHIRT_RED,
        green: ASSET_SHIRT_GREEN,
        yellow: ASSET_SHIRT_YELLOW,
    };
    const asset = colorKey ? assetMap[colorKey] : null;
    const height = Math.round(size * 1.06);
    if (asset) {
        return (
            <View style={{ width: size, height, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <Image source={asset} style={{ width: size, height, resizeMode: 'contain' }} />
                <View style={styles.jerseyNumberOverlay} pointerEvents="none">
                    <Text style={styles.jerseyNumberOverlayText}>{String(number)}</Text>
                </View>
            </View>
        );
    }
    // fallback pre SVG
    const color = colorKey === 'red' ? '#ff6b6b' : colorKey === 'green' ? '#4ECDC4' : colorKey === 'yellow' ? '#FFE66D' : '#95E1D3';
    return <JerseySVG number={number} color={color} size={size} />;
};

// Typová definícia pre favorit
type Favorite = { id: number; match_id: string; user_id: string; [key: string]: any };

// --- POMOCNÉ KOMPONENTY ---

// Zobrazenie udalostí
const EventTimeline = ({ events }: { events: any[] }) => {
    if (!events || events.length === 0) return <Text style={styles.eventText}>Žiadne udalosti zápasu.</Text>;

    const displayEvents = events.filter(e => e.type === 'Goal' || e.type === 'Card');

    if (displayEvents.length === 0) return <Text style={styles.infoTextCenter}>Žiadne góly alebo karty zaznamenané.</Text>;

    return (
        <View style={[styles.section, styles.elevatedSection]}>
            <Text style={styles.sectionTitle}>Góly & Udalosti</Text>
            {displayEvents.map((event, index) => {
                const isGoal = event.type === 'Goal';
                const isCard = event.type === 'Card';
                const cardColor = event.detail === 'Yellow Card' ? '#ffcc00' : '#ff4d4d';
                return (
                    <View key={index} style={styles.eventRowAlt}>
                        <View style={styles.eventSide}>
                            <Text style={styles.eventTimeAlt}>{event.time?.elapsed ?? ''}'</Text>
                        </View>

                        <View style={styles.eventMain}>
                            <View style={styles.eventHeaderRow}>
                                <Text style={[styles.eventTitle, isGoal ? { color: '#6ee7b7' } : isCard ? { color: cardColor } : {}]}>
                                    {isGoal ? '⚽ Goal' : isCard ? (event.detail === 'Yellow Card' ? '🟨 Card' : '🟥 Card') : event.type}
                                </Text>
                                <Text style={styles.eventTeam}>{event.team?.name}</Text>
                            </View>
                            <Text style={styles.eventTextAlt}>{event.player?.name} {event.detail ? `(${event.detail})` : ''}</Text>
                            {event.assist && <Text style={styles.eventAssistAlt}>Assist: {event.assist?.name}</Text>}
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

// Zobrazenie zostáv
const LineupsSection = ({ lineups }: { lineups: any[] }) => {
    if (!lineups || lineups.length < 2) return <Text style={styles.infoTextCenter}>Zostavy zatiaľ nie sú k dispozícii.</Text>;

    const homeLineup = lineups[0];
    const awayLineup = lineups[1];
    const [selected, setSelected] = useState<'home' | 'away'>('home');

    const selectedLineup = selected === 'home' ? homeLineup : awayLineup;

 
    const computePositions = (formationLabel?: string, startersCount = 11) => {
        const defaultCounts = [4, 4, 2];
        let counts = defaultCounts;
        if (formationLabel) {
            const parsed = formationLabel.split('-').map(s => parseInt(s, 10)).filter(n => !isNaN(n) && n > 0);
            if (parsed.length > 0) counts = parsed;
        }

        const positions: Array<{ x: number; y: number }> = [];
   
        positions.push({ x: 50, y: 85 });

        const lines = counts.length;
        const yStartVis = 65; 
        const yEndVis = 18;  
        const yStep = lines > 1 ? (yStartVis - yEndVis) / (lines - 1) : 0;

        for (let line = 0; line < lines; line++) {
            const n = counts[line];
            const y = Math.round(yStartVis - line * yStep);
            if (n === 1) {
                positions.push({ x: 50, y });
            } else {
                const left = 15; 
                const span = 70; 
                const step = n > 1 ? span / (n - 1) : 0;
                for (let i = 0; i < n; i++) {
                    const x = Math.round(left + i * step);
                    positions.push({ x, y });
                }
            }
        }

   
        while (positions.length < startersCount) positions.push({ x: 50, y: 50 });
        return positions.slice(0, startersCount);
    };

  
    const getPlayerColor = (player: any, idx: number) => {
        const positionColors: Record<string, string> = {
            'G': '#FF6B6B', // Goalkeeper - Red
            'D': '#4ECDC4', // Defender - Teal
            'M': '#FFE66D', // Midfielder - Yellow
            'F': '#95E1D3', // Forward - Mint
        };
        const pos = player.pos || 'M';
        return positionColors[pos] || '#00D4FF'; 
    };

    const renderStarterOnPitch = (player: any, idx: number, positions: any[]) => {
        const pos = positions[idx] ?? { x: 50, y: 50 };
    
        const visibleY = Math.max(6, Math.min(90, pos.y));
        const markerColor = getPlayerColor(player, idx);
            const nameParts = player.player.name?.split(' ') || ['?'];
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
        const colorKey = player.pos === 'G' ? 'red' : player.pos === 'D' ? 'green' : player.pos === 'M' ? 'yellow' : 'blue';
        return (
            <View key={player.player.id ?? idx} style={[styles.pitchPlayer, { left: `${pos.x}%`, top: `${visibleY}%` }]}>
                <Text style={[styles.pitchPlayerName]} numberOfLines={2} ellipsizeMode="tail">{firstName}{lastName ? '\n' + lastName : ''}</Text>
                <JerseyImage number={player.player.number ?? '-'} colorKey={colorKey} size={44} />
            </View>
        );
    };

    const renderSubs = (subs: any[]) => (
        <View style={styles.subsGrid}>
            {subs.map((s: any, i: number) => (
                <View key={s.player.id ?? i} style={styles.subGridItem}>
                    <JerseyImage number={s.player.number ?? '-'} colorKey={s.pos === 'G' ? 'red' : s.pos === 'D' ? 'green' : s.pos === 'M' ? 'yellow' : 'blue'} size={34} />
                    <Text style={styles.subName} numberOfLines={2} ellipsizeMode="tail">{s.player.name}</Text>
                </View>
            ))}
        </View>
    );

    return (
        <View style={[styles.section, styles.elevatedSection] }>
            <Text style={styles.sectionTitle}>Zostavy</Text>

            <View style={styles.lineupToggleRow}>
                <Pressable onPress={() => setSelected('home')} style={[styles.toggleBtn, selected === 'home' ? styles.toggleActive : undefined]}>
                    <Text style={[styles.toggleText, selected === 'home' ? styles.toggleTextActive : undefined]}>{homeLineup.team.name}</Text>
                </Pressable>
                <Pressable onPress={() => setSelected('away')} style={[styles.toggleBtn, selected === 'away' ? styles.toggleActive : undefined]}>
                    <Text style={[styles.toggleText, selected === 'away' ? styles.toggleTextActive : undefined]}>{awayLineup.team.name}</Text>
                </Pressable>
            </View>

            <View style={styles.pitchContainer}>
             
                <Image source={REALISTIC_PITCH} style={styles.pitchFullImage} />
                <View style={styles.pitchArea} pointerEvents="box-none">
                    {(() => {
                        const formationLabel = selectedLineup.formation;
                        const positions = computePositions(formationLabel, selectedLineup.startXI.length);
                        return selectedLineup.startXI.map((p: any, i: number) => renderStarterOnPitch(p, i, positions));
                    })()}
                </View>
            </View>

            <Text style={styles.subHeader}>Náhradníci</Text>
            {renderSubs(selectedLineup.substitutes)}
        </View>
    );
};

// league table component
const LeagueTable = ({ leagueId, leagueName, highlightIds }: { leagueId: number; leagueName?: string; highlightIds: number[] }) => {
    const standings = MOCK_STANDINGS[leagueId] ?? [];
    if (!standings || standings.length === 0) return null;

    const displayRows = useMemo(() => {
        const rows = [...standings];
        const homeId = highlightIds?.[0];
        const awayId = highlightIds?.[1];

  
        const homeIdx = rows.findIndex((r: any) => r.team?.id === homeId);
        const awayIdx = rows.findIndex((r: any) => r.team?.id === awayId);
        const homeRow = homeIdx >= 0 ? rows.splice(homeIdx, 1)[0] : { team: { id: homeId, name: 'Home' }, points: 0 };
  
        const awayIdxAfter = rows.findIndex((r: any) => r.team?.id === awayId);
        const awayRow = awayIdxAfter >= 0 ? rows.splice(awayIdxAfter, 1)[0] : { team: { id: awayId, name: 'Away' }, points: 0 };

       
        rows.splice(0, 0, { ...homeRow, rank: 1 });
        const insertIndex = Math.min(3, rows.length);
        rows.splice(insertIndex, 0, { ...awayRow, rank: insertIndex + 1 });

        // recalculate ranks
        return rows.map((r: any, i: number) => ({ ...r, rank: i + 1 }));
    }, [standings, highlightIds]);

    return (
        <View style={[styles.section, styles.elevatedSection]}>
            <Text style={styles.sectionTitle}>Tabuľka - {leagueName ?? ''}</Text>
            <View style={styles.tableHeader}>
                <Text style={[styles.tableCellRank, styles.tableHeaderText]}>#</Text>
                <Text style={[styles.tableCellTeam, styles.tableHeaderText]}>Tím</Text>
                <Text style={[styles.tableCellPoints, styles.tableHeaderText]}>Body</Text>
            </View>
            {displayRows.map((row: any) => {
                const isPlaying = highlightIds.includes(row.team.id);
                return (
                    <View key={row.team.id} style={[styles.tableRow, isPlaying ? styles.highlightRow : undefined] }>
                        <Text style={styles.tableCellRank}>{row.rank}</Text>
                        <Text style={styles.tableCellTeam}>{row.team.name}</Text>
                        <Text style={styles.tableCellPoints}>{row.points}</Text>
                    </View>
                );
            })}
        </View>
    );
};

// main component

export default function MatchDetail() {
    const route = useRoute<any>();
    const { match } = route.params; 
    const { session } = useSession(); 
    const queryClient = useQueryClient();
    const fixtureId = String(match.fixture.id);


    const { events, lineups, isLoading: isDetailsLoading, isError: isDetailsError } = useMatchDetails(fixtureId);

    const { data: favorites, isLoading: isFavLoading } = useQuery({
        queryKey: ['favorites', session?.user.id],
        queryFn: () => getFavoritesByUser(session?.user.id!),
        enabled: !!session, 
    });

    const favoriteItem: Favorite | undefined = useMemo(() => 
        favorites?.find((fav: Favorite) => String(fav.match_id) === fixtureId), 
        [favorites, fixtureId]
    );
    const isFavorite = !!favoriteItem;

    // toggle favorite status
    const toggleFavorite = async () => {
        if (!session) {
            Alert.alert('Prihláste sa', 'Pre uloženie obľúbených zápasov sa musíte prihlásiť.');
            return;
        }
        
        queryClient.invalidateQueries({ queryKey: ['favorites'] });
        
        let message = '';
        try {
            if (isFavorite) {
                await removeFavorite(favoriteItem!.id);
                message = 'Zápas bol odstránený z obľúbených.'; 
            } else {
                await addFavorite(session.user.id, match);
                message = 'Zápas bol pridaný do obľúbených.'; 
            }
            
            queryClient.refetchQueries({ queryKey: ['favorites'] });
            
            // alert namiesto Snackbar
            Alert.alert('Úspech', message); 
        } catch (error: any) {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
            Alert.alert('Chyba pri ukladaní', error.message);
        }
    };

    const { home, away } = match.teams;
    const { home: scoreHome, away: scoreAway } = match.goals;
    const statusText = match.fixture.status.long;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
         
                <View style={styles.headerSection}>
             
                    <View style={styles.leagueHeader}>
                        <View>
                            <Text style={styles.leagueName}>{match.league.name}</Text>
                            <Text style={styles.leagueCountry}>{match.league.country}</Text>
                        </View>
                        <Pressable
                            onPress={toggleFavorite}
                            disabled={isFavLoading}
                            style={({ pressed }) => [styles.favoriteButton, { opacity: pressed || isFavLoading ? 0.6 : 1 }]}
                        >
                            {isFavLoading ? (
                                <ActivityIndicator size="small" color="#00D4FF" />
                            ) : (
                                <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} color={isFavorite ? '#FF0057' : '#888'} size={28} />
                            )}
                        </Pressable>
                    </View>

          
                    <View style={styles.scoreSection}>
                        <View style={styles.teamBlock}>
                            <Image source={{ uri: home.logo }} style={styles.teamLogo} />
                            <Text style={styles.teamName}>{home.name}</Text>
                        </View>

                        <View style={styles.scorePillMain}>
                            <Text style={styles.scoreNumber}>{scoreHome ?? '-'}</Text>
                            <Text style={styles.scoreSeparator}>·</Text>
                            <Text style={styles.scoreNumber}>{scoreAway ?? '-'}</Text>
                        </View>

                        <View style={styles.teamBlock}>
                            <Image source={{ uri: away.logo }} style={styles.teamLogo} />
                            <Text style={styles.teamName}>{away.name}</Text>
                        </View>
                    </View>

                  
                    <View style={styles.statusBar}>
                        <Text style={styles.statusText}>
                            {statusText} {match.fixture.status.elapsed ? `· ${match.fixture.status.elapsed}'` : ''}
                        </Text>
                    </View>
                </View>

                {isDetailsError && <Text style={styles.infoTextCenter}>Chyba pri načítaní detailných dát. (API Error)</Text>}
                {isDetailsLoading && <ActivityIndicator size="large" color="#00D4FF" style={{ marginTop: 40 }} />}

                {!isDetailsLoading && !isDetailsError && (
                    <View style={styles.contentSection}>
                        <EventTimeline events={events} />
                        <LineupsSection lineups={lineups} />
                        <LeagueTable leagueId={match.league.id} leagueName={match.league.name} highlightIds={[home.id, away.id]} />
                    </View>
                )}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },

    // header section
    headerSection: {
        backgroundColor: '#0f0f11',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1e',
    },

    leagueHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },

    leagueName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#00D4FF',
        letterSpacing: 0.5,
    },

    leagueCountry: {
        fontSize: 12,
        color: '#888',
        marginTop: 3,
        fontWeight: '500',
    },

    favoriteButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    scoreSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },

    teamBlock: {
        alignItems: 'center',
        flex: 1,
    },

    teamLogo: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#1a1a1e',
        marginBottom: 8,
    },

    teamName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#e0e0e0',
        textAlign: 'center',
    },

    scorePillMain: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(0, 212, 255, 0.2)',
    },

    scoreNumber: {
        fontSize: 32,
        fontWeight: '900',
        color: '#fff',
    },

    scoreSeparator: {
        marginHorizontal: 12,
        fontSize: 24,
        color: '#00D4FF',
        fontWeight: '300',
    },

    statusBar: {
        backgroundColor: 'rgba(255, 0, 87, 0.08)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 0, 87, 0.15)',
    },

    statusText: {
        fontSize: 12,
        color: '#FFB6C1',
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 0.3,
    },

    // content section
    contentSection: {
        paddingBottom: 40,
    },

    // section styles
    section: {
        marginHorizontal: 12,
        marginTop: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#0f0f11',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#1a1a1e',
    },

    elevatedSection: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#00D4FF',
        marginBottom: 12,
        letterSpacing: 0.5,
    },

    // event timeline 
    eventRowAlt: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#151515',
        alignItems: 'flex-start',
    },

    eventSide: {
        width: 50,
        alignItems: 'center',
    },

    eventTimeAlt: {
        color: '#00D4FF',
        fontWeight: '700',
        fontSize: 13,
    },

    eventMain: {
        flex: 1,
        paddingLeft: 12,
    },

    eventHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    eventTitle: {
        fontWeight: '700',
        color: '#fff',
        fontSize: 13,
    },

    eventTeam: {
        color: '#888',
        fontSize: 11,
    },

    eventTextAlt: {
        color: '#ccc',
        marginTop: 4,
        fontSize: 12,
    },

    eventAssistAlt: {
        color: '#888',
        marginTop: 3,
        fontSize: 11,
    },

    eventText: {
        color: '#ccc',
    },

    // lineups section
    lineupToggleRow: {
        flexDirection: 'row',
        marginBottom: 16,
        justifyContent: 'center',
        gap: 8,
    },

    toggleBtn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#151515',
        borderWidth: 1,
        borderColor: '#2a2a2e',
    },

    toggleActive: {
        backgroundColor: 'rgba(0,212,255,0.2)',
        borderColor: '#00D4FF',
    },

    toggleText: {
        color: '#888',
        fontWeight: '600',
        fontSize: 12,
    },

    toggleTextActive: {
        color: '#00D4FF',
    },

    pitchContainer: {
        width: '100%',
        height: 420,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#071018',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#1a1a1e',
    },

    pitchFullImage: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '200%',
        resizeMode: 'cover',
    },

    pitchArea: {
        flex: 1,
        position: 'relative',
    },

    pitchPlayer: {
        position: 'absolute',
        alignItems: 'center',
        width: 80,
        marginLeft: -40,
    },

    pitchPlayerName: {
        color: '#fff',
        marginBottom: 6,
        fontSize: 9,
        width: 78,
        textAlign: 'center',
        fontWeight: '600',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 2,
        paddingHorizontal: 4,
        borderRadius: 3,
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        lineHeight: 11,
    },

    jerseyNumberOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },

    jerseyNumberOverlayText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 13,
        textShadowColor: '#000',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },

    subHeader: {
        color: '#00D4FF',
        marginTop: 14,
        fontWeight: '700',
        marginBottom: 10,
        fontSize: 13,
        letterSpacing: 0.3,
    },

    subsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: 10,
        paddingHorizontal: 2,
    },

    subGridItem: {
        width: '31%',
        paddingVertical: 8,
        paddingHorizontal: 6,
        backgroundColor: '#0b0b0c',
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1a1a1e',
    },

    subName: {
        color: '#aaa',
        fontSize: 9,
        textAlign: 'center',
        lineHeight: 12,
        marginTop: 6,
    },

    // league table
    tableHeader: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1.5,
        borderBottomColor: '#1a1a1e',
        marginBottom: 8,
        alignItems: 'center',
    },

    tableHeaderText: {
        color: '#00D4FF',
        fontWeight: '700',
        fontSize: 11,
        letterSpacing: 0.5,
    },

    tableRow: {
        flexDirection: 'row',
        paddingVertical: 11,
        borderBottomWidth: 1,
        borderBottomColor: '#0f0f11',
        alignItems: 'center',
    },

    tableCellRank: {
        width: 36,
        color: '#888',
        fontWeight: '700',
        fontSize: 12,
    },

    tableCellTeam: {
        flex: 1,
        color: '#ddd',
        fontSize: 12,
        fontWeight: '500',
    },

    tableCellPoints: {
        width: 60,
        textAlign: 'right',
        color: '#00D4FF',
        fontWeight: '800',
        fontSize: 13,
    },

    highlightRow: {
        backgroundColor: 'rgba(0,212,255,0.08)',
        borderRadius: 6,
        paddingHorizontal: 6,
        marginVertical: 2,
    },

    infoTextCenter: {
        color: '#888',
        textAlign: 'center',
        marginTop: 24,
        fontSize: 13,
    },
});