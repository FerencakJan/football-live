// src/screens/ProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSession } from '../hooks/useSession';
import { signOut } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { useFavorites } from '../hooks/useFavourites';
import MatchCard from '../components/MatchCard';
import { useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons'; // ⬅️ NOVÝ IMPORT PRE IKONY

// pomocná komponenta pre vlastnú hlavičku

const CustomHeader = ({ title }: { title: string }) => (
    <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>{title}</Text>
    </View>
);

const CustomButton = ({ title, onPress, mode = 'contained', color, style }: any) => (
    <TouchableOpacity 
        onPress={onPress} 
        style={[
            styles.buttonBase, 
            mode === 'contained' ? { backgroundColor: color || '#FF0057' } : styles.outlinedButton,
            style
        ]}
    >
        <Text style={[
            styles.buttonText, 
            mode === 'outlined' && { color: color || '#bbb' }
        ]}>{title}</Text>
    </TouchableOpacity>
);

// hlavný komponent obrazovky profilu

export default function ProfileScreen() {
    const { session, loading: sessionLoading } = useSession();
    const navigation = useNavigation<any>();
    const queryClient = useQueryClient();

    const { data: favorites, isLoading: isFavLoading, isError: isFavError } = useFavorites();

    const handleSignOut = async () => {
        const { error } = await signOut();
        if (error) {
            Alert.alert('Chyba pri odhlásení', error.message);
        } else {
            queryClient.clear();
            navigation.replace('Auth');
        }
    };

    const renderFavoriteMatch = ({ item }: { item: any }) => {
        const matchData = {
            fixture: { id: parseInt(item.match_id), status: { short: 'FT', elapsed: null } },
            league: { name: item.league, country: item.teams?.home?.country || '' },
            teams: item.teams,
            goals: { home: 0, away: 0 },
        };

        return (
            <MatchCard
                match={matchData}
                onPress={() => Alert.alert('Detail', `Obľúbený zápas ID ${item.match_id}`)}
            />
        );
    };

    const renderContent = () => {
        if (sessionLoading || isFavLoading) {
            return <ActivityIndicator size="large" color="#FF0057" style={styles.loader} />;
        }

        if (!session) {
            return (
                <View style={styles.authContainer}>
                    <Text style={styles.titleStyle}>Obľúbené zápasy</Text>
                    <Text style={styles.infoText}>Pre zobrazenie obľúbených sa prihláste.</Text>
                    <CustomButton
                        title="Prihlásiť sa / Registrovať"
                        onPress={() => navigation.navigate('Auth')}
                        style={styles.authButton}
                        color="#FF0057"
                    />
                </View>
            );
        }

        return (
            <View style={styles.contentContainer}>
                <View style={styles.profileHeader}>
                    <Text style={styles.profileTitle}>Profil</Text>
                    <Text style={styles.emailText}>Prihlásený ako: {session.user.email}</Text>
                </View>

                <View style={styles.divider} /> 

                <Text style={styles.favoritesTitle}>
                    <Ionicons name="star" size={18} color="#FF0057" /> Moje Obľúbené Zápasy ({favorites?.length || 0})
                </Text>

                {isFavError && <Text style={styles.errorText}>Chyba pri načítaní.</Text>}

                {!isFavLoading && (!favorites || favorites.length === 0) && (
                    <Text style={styles.infoText}>Zatiaľ žiadne obľúbené zápasy.</Text>
                )}

                <FlatList
                    data={favorites}
                    renderItem={renderFavoriteMatch}
                    keyExtractor={(item) => String(item.id)}
                    ListFooterComponent={<View style={{ height: 20 }} />}
                    style={styles.flatList}
                />

                <View style={styles.logoutContainer}>
                    <CustomButton 
                        title="Odhlásiť sa"
                        mode="outlined"
                        onPress={handleSignOut} 
                        color="#bbb" 
                        style={styles.logoutButton}
                    />
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <CustomHeader title="Profil / Obľúbené" /> 
            {renderContent()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#121212' },
    
    // Custom Header styles
    appBar: { 
        backgroundColor: '#1f1f1f', 
        height: 56, 
        justifyContent: 'center', 
        paddingHorizontal: 15 
    },
    appBarTitle: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#FF0057' 
    },

    loader: { flex: 1, justifyContent: 'center' },

    // Custom Button styles
    buttonBase: {
        height: 40,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    outlinedButton: {
        borderWidth: 1,
        borderColor: '#555',
        backgroundColor: 'transparent',
    },

    authContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    authButton: { width: '80%', marginTop: 20 },

    contentContainer: { flex: 1, paddingHorizontal: 10 },
    profileHeader: { paddingHorizontal: 10, paddingVertical: 15, alignItems: 'center' },
    profileTitle: { color: '#fff', fontSize: 24, marginBottom: 5, fontWeight: 'bold' }, // Z title
    emailText: { color: '#bbb', fontSize: 14, marginBottom: 10 },
    divider: { backgroundColor: '#333', marginHorizontal: 10, marginBottom: 20, height: 1 }, // Z Divider

    favoritesTitle: { color: '#FF0057', fontSize: 18, marginHorizontal: 10, marginBottom: 15, fontWeight: 'bold' }, // Z Title

    infoText: { color: '#888', textAlign: 'center', paddingHorizontal: 20, marginTop: 10 },
    errorText: { color: '#ff4444', textAlign: 'center', marginTop: 10 },

    flatList: { flex: 1 },

    logoutContainer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#333',
        backgroundColor: '#1f1f1f',
    },
    logoutButton: { borderColor: '#555' },
    titleStyle: { // Pre Title v Auth Containeri
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10
    }
});