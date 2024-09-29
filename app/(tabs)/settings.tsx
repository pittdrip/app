import React from 'react';
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useAuth } from '../../contexts/AuthContext';

const Settings = () => {
    const router = useRouter();
    const { user } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.replace('/(auth)/signin');
        } catch (error) {
            console.error('Error signing out:', error);
            Alert.alert('Error', 'Failed to sign out. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            {user && user.email && (
                <View style={styles.emailContainer}>
                    <Text style={styles.emailLabel}>Logged in as:</Text>
                    <Text style={styles.emailText}>{user.email}</Text>
                </View>
            )}

            <Pressable onPress={handleSignOut} style={({ pressed }) => [
                styles.button,
                pressed && styles.pressedButton
            ]}>
                <Text style={styles.buttonText}>Log Out</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingBottom: 20,
        paddingHorizontal: 20,
        marginTop: 40,
    },
    pressedButton: {
        opacity: .6
    },
    emailContainer: {
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#f3f4f6',
        paddingBottom: 15,
        borderRadius: 10,
        width: '100%',
    },
    emailLabel: {
        fontSize: 16,
        color: '#4b5563',
        marginBottom: 5,
    },
    emailText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
    },
    button: {
        backgroundColor: '#003594',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#FFB81C',
        fontSize: 18,
        fontWeight: '500'
    },
});

export default Settings;