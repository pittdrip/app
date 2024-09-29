import React from 'react';
import { View, Text, Pressable, Alert, StyleSheet, ScrollView } from 'react-native';
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
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>My</Text>
                <Text style={[styles.logoText, styles.logoTextDrip]}>Settings</Text>
            </View>
            <ScrollView style={styles.contentContainer}>
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
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    logoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 30,
        paddingBottom: 10,
        backgroundColor: '#003594',
    },
    logoText: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#FFB81C',
    },
    logoTextDrip: {
        color: '#FFFFFF',
        marginLeft: 5,
    },
    contentContainer: {
        flex: 1,
        padding: 20,
    },
    emailContainer: {
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
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
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    pressedButton: {
        opacity: 0.8
    },
    buttonText: {
        color: '#FFB81C',
        fontSize: 22,
        fontWeight: '800'
    },
});

export default Settings;