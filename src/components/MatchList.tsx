// src/components/MatchList.tsx
import React from 'react';
import { FlatList, Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import MatchCard from './MatchCard';

type Props = {
  matches: any[];
  isLoading: boolean;
  isError: boolean;
  onPressMatch: (match: any) => void;
};

export default function MatchList({ matches, isLoading, isError, onPressMatch }: Props) {
  if (isLoading) return <ActivityIndicator size="large" color="#FF0057" style={styles.center} />;
  if (isError) return <Text style={styles.errorText}>Chyba pri načítaní dát. Zobrazujem Mock dáta.</Text>;
  if (!matches || matches.length === 0) return <Text style={styles.noDataText}>Žiadne live zápasy.</Text>;

  return (
    <FlatList
      data={matches}
      keyExtractor={(item) => String(item.fixture.id)}
      renderItem={({ item }) => (
        <MatchCard 
          match={item} 
          onPress={() => onPressMatch(item)} 
        />
      )}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    list: { flex: 1, backgroundColor: '#121212' },
    errorText: { color: '#FF0057', textAlign: 'center', marginTop: 20 },
    noDataText: { color: '#bbb', textAlign: 'center', marginTop: 20 },
});