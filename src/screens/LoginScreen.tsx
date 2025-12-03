// src/screens/LoginScreen.tsx 

import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity, TextInput } from 'react-native';
import { signIn, signUp } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

// pomocné komponenty pre tlačidlo
const CustomButton = ({ title, onPress, mode = 'contained', color, disabled }: any) => (
    <TouchableOpacity 
        onPress={onPress} 
        disabled={disabled}
        style={[
            styles.buttonBase, 
            mode === 'contained' ? { backgroundColor: color || '#FF0057' } : styles.outlinedButton,
            disabled && styles.buttonDisabled
        ]}
    >
        <Text style={[
            styles.buttonText, 
            mode === 'outlined' && { color: color || '#bbb' }
        ]}>{title}</Text>
    </TouchableOpacity>
);

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<any>();

    const handleLogin = async () => {
        setLoading(true);
        const { error } = await signIn(email, password);
        setLoading(false);
        
        if (error) {
            Alert.alert('Chyba pri prihlásení', error.message);
        } else {
            navigation.replace('MainTabs'); 
        }
    };

    const handleSignUp = async () => {
        setLoading(true);
        const { error } = await signUp(email, password);
        setLoading(false);

        if (error) {
            Alert.alert('Chyba pri registrácii', error.message);
        } else {
            Alert.alert(
                'Registrácia Úspešná', 
                'Teraz sa môžete prihlásiť (alebo potvrďte email, ak je nutné).'
            );
        }
    };

    const handleGuestMode = () => {
        navigation.replace('MainTabs'); 
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>⚽ FOOTBALL APP</Text> 
                <Text style={styles.subtitle}>Prihláste sa alebo pokračujte</Text> 

            
                <TextInput 
                    placeholder="Email" 
                    placeholderTextColor="#888"
                    value={email} 
                    onChangeText={setEmail} 
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.input} 
                />
                <TextInput 
                    placeholder="Heslo" 
                    placeholderTextColor="#888"
                    value={password} 
                    onChangeText={setPassword} 
                    secureTextEntry 
                    autoCapitalize="none"
                    style={styles.input} 
                />

            
                <CustomButton 
                    title={loading ? "Prebieha..." : "Prihlásiť sa"} 
                    onPress={handleLogin} 
                    disabled={loading}
                    style={styles.button}
                    color="#FF0057" 
                />

                <CustomButton 
                    title="Registrovať sa" 
                    mode="outlined"
                    onPress={handleSignUp} 
                    disabled={loading}
                    style={styles.button}
                    color="#bbb" 
                />
                
                
                <View style={styles.separatorContainer}>
                    <Text style={styles.separatorText}>--- ALEBO ---</Text>
                </View>

                <TouchableOpacity onPress={handleGuestMode} disabled={loading}>
                    <Text style={styles.guestText}>Pokračovať bez prihlásenia</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#121212', 
    },
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        padding: 20,
    },
    title: { 
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: { 
        fontSize: 16,
        color: '#bbb',
        textAlign: 'center',
        marginBottom: 40,
    },
    input: { 
        marginBottom: 15,
        backgroundColor: '#2c2c2c',
        color: '#eee',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#444'
    },
    
    // vlastné tlačidlo 
    buttonBase: {
        marginVertical: 8,
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    outlinedButton: {
        borderWidth: 1,
        borderColor: '#555',
        backgroundColor: 'transparent',
    },
    buttonDisabled: {
        opacity: 0.5,
    },

    button: { 
        marginVertical: 8,
    },
    separatorContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    separatorText: {
        color: '#555',
        fontSize: 14,
        fontWeight: 'bold',
    },
    guestText: {
        color: '#bbb',
        textAlign: 'center',
        fontSize: 16,
        textDecorationLine: 'underline',
        marginTop: 10,
    },
});