import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';

type Team = { id?: number; name?: string; logo?: string };
type League = { id?: number; name?: string; country?: string };
type Fixture = { id: number; date?: string; status?: { short?: string; elapsed?: number | null } };
type Goals = { home?: number | null; away?: number | null };

type Match = {
  fixture: Fixture;
  league?: League;
  teams?: { home?: Team; away?: Team };
  goals?: Goals;
};

type Props = {
  match: Match;
  onPress?: () => void;
};

const background = require('../../assets/football-pitch-backgound.jpg');

function initials(name?: string) {
  if (!name) return '';
  return name
    .split(' ')
    .map(s => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function MatchCard({ match, onPress }: Props) {
  const leagueName = match.league?.name || '';
  const home = match.teams?.home?.name || '';
  const away = match.teams?.away?.name || '';
  const homeGoals = match.goals?.home ?? null;
  const awayGoals = match.goals?.away ?? null;
  const status = match.fixture?.status?.short || '';

  const homeLogo = match.teams?.home?.logo;
  const awayLogo = match.teams?.away?.logo;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.container}>
      <ImageBackground source={background} style={styles.bg} imageStyle={styles.bgImage}>
        <View style={styles.header}>
          <View style={styles.leaguePill}>
            <Text style={styles.leagueText}>{leagueName}</Text>
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>

        <View style={styles.contentRow}>
          <View style={styles.teamColumn}>
            {homeLogo ? (
              <Image source={{ uri: homeLogo }} style={styles.logo} />
            ) : (
              <View style={styles.initialsCircle}>
                <Text style={styles.initialsText}>{initials(home)}</Text>
              </View>
            )}
            <Text numberOfLines={1} style={styles.teamName}>{home}</Text>
          </View>

          <View style={styles.scoreBox}>
            <Text style={styles.scoreText}>{homeGoals ?? '-'}  •  {awayGoals ?? '-'}</Text>
          </View>

          <View style={styles.teamColumn}>
            {awayLogo ? (
              <Image source={{ uri: awayLogo }} style={styles.logo} />
            ) : (
              <View style={styles.initialsCircle}>
                <Text style={styles.initialsText}>{initials(away)}</Text>
              </View>
            )}
            <Text numberOfLines={1} style={[styles.teamName, { textAlign: 'right' }]}>{away}</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    // elevation/shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  bg: {
    padding: 14,
    backgroundColor: '#161616',
  },
  bgImage: {
    opacity: 0.12,
    resizeMode: 'cover',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  leaguePill: { backgroundColor: 'rgba(255,0,87,0.12)', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 20 },
  leagueText: { color: '#FF0057', fontWeight: '700', fontSize: 12 },
  statusPill: { backgroundColor: 'rgba(0,0,0,0.35)', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 14 },
  statusText: { color: '#ddd', fontSize: 12, fontWeight: '600' },
  contentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  teamColumn: { flex: 4, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 44, height: 44, borderRadius: 22, marginBottom: 6, resizeMode: 'cover' },
  initialsCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#222', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  initialsText: { color: '#fff', fontWeight: '700' },
  teamName: { color: '#fff', fontSize: 13, maxWidth: 120 },
  scoreBox: { flex: 2, alignItems: 'center', justifyContent: 'center' },
  scoreText: { color: '#fff', fontSize: 18, fontWeight: '800', backgroundColor: 'rgba(0,0,0,0.25)', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20 },
});
