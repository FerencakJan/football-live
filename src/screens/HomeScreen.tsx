// src/screens/HomeScreen.tsx 

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useMatches } from '../hooks/useMatches';
import MatchList from '../components/MatchList';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';


const CustomAppHeader = ({ title }: { title: string }) => (
    <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>{title}</Text>
    </View>
);

// filter button komponent
const FilterButton = ({ 
    label, 
    isActive, 
    onPress 
}: { 
    label: string; 
    isActive: boolean; 
    onPress: () => void;
}) => (
    <Pressable 
        onPress={onPress}
        style={[
            styles.filterButton,
            isActive && styles.filterButtonActive
        ]}
    >
        <Text style={[
            styles.filterButtonText,
            isActive && styles.filterButtonTextActive
        ]}>
            {label}
        </Text>
    </Pressable>
);

export default function HomeScreen() {
    const { data, isLoading, isError } = useMatches(); 
    const navigation = useNavigation<any>();

    const matches = data?.response || data || []; 

    // filter states
    const [selectedLeague, setSelectedLeague] = useState<number | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    // get unique leagues from matches
    const uniqueLeagues = useMemo(() => {
        const leagues = new Map<number, string>();
        matches.forEach((m: any) => {
            if (m.league?.id && m.league?.name) {
                leagues.set(m.league.id, m.league.name);
            }
        });
        return Array.from(leagues.entries()).map(([id, name]) => ({ id, name }));
    }, [matches]);

    const statuses = ['1H', '2H', 'HT', 'FT', 'NS'];

    // filtered matches
    const filteredMatches = useMemo(() => {
        let filtered = matches;

        if (selectedLeague !== null) {
            filtered = filtered.filter((m: any) => m.league?.id === selectedLeague);
        }

        if (selectedStatus !== null) {
            filtered = filtered.filter((m: any) => m.fixture?.status?.short === selectedStatus);
        }

        return filtered;
    }, [matches, selectedLeague, selectedStatus]);

    const hasActiveFilters = selectedLeague !== null || selectedStatus !== null;

    return (
        <SafeAreaView style={styles.safeArea}>
            <CustomAppHeader title="LIVE FOOTBALL" />

            
            <View style={styles.filterHeaderBar}>
                <View style={styles.filterHeaderContent}>
                    <Text style={styles.matchCount}>
                        {filteredMatches.length} zápas{filteredMatches.length === 1 ? '' : 'ov'}
                    </Text>
                    {hasActiveFilters && (
                        <Pressable 
                            onPress={() => {
                                setSelectedLeague(null);
                                setSelectedStatus(null);
                            }}
                            style={styles.resetButtonSmall}
                        >
                            <Ionicons name="close-circle" size={14} color="#FF0057" />
                            <Text style={styles.resetButtonTextSmall}>Reset</Text>
                        </Pressable>
                    )}
                </View>
                
                {/* toggle filtre */}
                <Pressable 
                    onPress={() => setShowFilters(!showFilters)}
                    style={styles.toggleFiltersButton}
                >
                    <Ionicons 
                        name={showFilters ? "chevron-up" : "chevron-down"} 
                        size={18} 
                        color="#00D4FF" 
                    />
                    <Text style={styles.toggleFiltersText}>
                        {showFilters ? 'Skryť' : 'Filtry'}
                    </Text>
                </Pressable>
            </View>

            {/* filter - expand */}
            {showFilters && (
                <View style={styles.filtersPanel}>
                    {/* LIGY */}
                    <View style={styles.filterGroup}>
                        <Text style={styles.filterGroupTitle}>Ligy</Text>
                        <View style={styles.filterButtonsGrid}>
                            {uniqueLeagues.map((league) => (
                                <FilterButton
                                    key={league.id}
                                    label={league.name.length > 12 ? league.name.substring(0, 12) + '.' : league.name}
                                    isActive={selectedLeague === league.id}
                                    onPress={() => setSelectedLeague(
                                        selectedLeague === league.id ? null : league.id
                                    )}
                                />
                            ))}
                        </View>
                    </View>

                    {/* status */}
                    <View style={styles.filterGroup}>
                        <Text style={styles.filterGroupTitle}>Status zápasu</Text>
                        <View style={styles.filterButtonsGrid}>
                            {statuses.map((status) => (
                                <FilterButton
                                    key={status}
                                    label={status}
                                    isActive={selectedStatus === status}
                                    onPress={() => setSelectedStatus(
                                        selectedStatus === status ? null : status
                                    )}
                                />
                            ))}
                        </View>
                    </View>
                </View>
            )}

            {/* zoznam */}
            <MatchList 
                matches={filteredMatches} 
                isLoading={isLoading} 
                isError={isError}
                onPressMatch={(match) => navigation.navigate('MatchDetail', { match })}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: '#0a0a0a' 
    },
    appBar: {
        backgroundColor: '#0f0f11',
        height: 56, 
        justifyContent: 'center',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1e',
    },
    appBarTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF0057',
        letterSpacing: 1,
    },

    // filter header bar
    filterHeaderBar: {
        backgroundColor: '#0f0f11',
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1e',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },

    filterHeaderContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },

    matchCount: {
        fontSize: 12,
        color: '#888',
        fontWeight: '600',
    },

    resetButtonSmall: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 0, 87, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 0, 87, 0.3)',
    },

    resetButtonTextSmall: {
        fontSize: 10,
        fontWeight: '600',
        color: '#FF0057',
    },

    toggleFiltersButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(0, 212, 255, 0.2)',
    },

    toggleFiltersText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#00D4FF',
    },

    // filters panel
    filtersPanel: {
        backgroundColor: '#0f0f11',
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1e',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },

    filterGroup: {
        gap: 8,
    },

    filterGroupTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: '#00D4FF',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },

    filterButtonsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },

    filterButton: {
        paddingVertical: 6,
        paddingHorizontal: 11,
        borderRadius: 6,
        backgroundColor: '#151515',
        borderWidth: 1,
        borderColor: '#2a2a2e',
    },

    filterButtonActive: {
        backgroundColor: 'rgba(0, 212, 255, 0.2)',
        borderColor: '#00D4FF',
    },

    filterButtonText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#888',
    },

    filterButtonTextActive: {
        color: '#00D4FF',
        fontWeight: '700',
    },
});