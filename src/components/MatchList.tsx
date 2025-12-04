// src/components/MatchList.tsx
import React from 'react';
import { FlatList, Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import MatchCard from './MatchCard';

type Props = {
  matches?: any[];
  isLoading: boolean;
  isError: boolean;
  onPressMatch: (match: any) => void;
};

export default function MatchList({ matches, isLoading, isError, onPressMatch }: Props) {
  if (isLoading) return <ActivityIndicator size="large" color="#FF0057" style={styles.center} />;

  if (isError) return (
    <View style={styles.center}>
      <Text style={styles.errorText}>Chyba pri načítaní dát. Zobrazujem debug info:</Text>
      <Text style={styles.debugText}>{JSON.stringify(matches, null, 2)}</Text>
    </View>
  );

  if (!matches || matches.length === 0) return <Text style={styles.noDataText}>Žiadne live zápasy.</Text>;

  return (
    <FlatList
      data={matches}
      keyExtractor={(item, index) => {
        // bezpečný keyExtractor
        return String(item?.fixture?.id ?? index);
      }}
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  list: { flex: 1, backgroundColor: '#121212' },
  errorText: { color: '#FF0057', textAlign: 'center', marginBottom: 10 },
  debugText: { color: '#bbb', fontSize: 12 },
  noDataText: { color: '#bbb', textAlign: 'center', marginTop: 20 },
});
