import { auth } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, router } from 'expo-router';
import React from 'react';
import { StyleSheet, Pressable, Text, TextInput, View } from 'react-native';

export default function SignUp() {
    const [value, setValue] = React.useState({
        email: '',
        password: '',
        confirmPassword: '',
        error: ''
    });
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const resetFields = () => {
        setValue({
            email: '',
            password: '',
            confirmPassword: '',
            error: ''
        });
    };

    async function signUp() {
        setValue((currentValue) => {
            if (!currentValue.email || !currentValue.password || !currentValue.confirmPassword) {
                return { ...currentValue, error: 'Please fill in all fields.' };
            }

            if (currentValue.password !== currentValue.confirmPassword) {
                return { ...currentValue, error: 'Passwords do not match.' };
            }

            createUserWithEmailAndPassword(auth, currentValue.email, currentValue.password)
                .then(() => {
                    router.replace('/(auth)/signin');
                })
                .catch((error) => {
                    // Handle different types of errors
                    switch (error.code) {
                        case 'auth/email-already-in-use':
                            setValue((prevValue) => ({ ...prevValue, error: 'This email is already in use. Please try a different email or sign in.' }));
                            break;
                        case 'auth/invalid-email':
                            setValue((prevValue) => ({ ...prevValue, error: 'Please enter a valid email.' }));
                            break;
                        case 'auth/weak-password':
                            setValue((prevValue) => ({ ...prevValue, error: 'Please use a password at least 6 characters long.' }));
                            break;
                        default:
                            setValue((prevValue) => ({ ...prevValue, error: 'An error occurred during sign up. Please try again.' }));
                            console.error(error);
                    }
                });

            return currentValue;
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>

            {!!value.error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{value.error}</Text>
                </View>
            )}

            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={24} color="gray" />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={value.email}
                        onChangeText={(text) => setValue((prevValue) => ({ ...prevValue, email: text }))}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="key-outline" size={24} color="gray" />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={value.password}
                        onChangeText={(text) => setValue((prevValue) => ({ ...prevValue, password: text }))}
                        secureTextEntry={!showPassword}
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons
                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                            size={24}
                            color="gray"
                        />
                    </Pressable>
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="key-outline" size={24} color="gray" />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        value={value.confirmPassword}
                        onChangeText={(text) => setValue((prevValue) => ({ ...prevValue, confirmPassword: text }))}
                        secureTextEntry={!showConfirmPassword}
                    />
                    <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <Ionicons
                            name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                            size={24}
                            color="gray"
                        />
                    </Pressable>
                </View>

                <Pressable
                    style={({ pressed }) => [styles.signUpButton, pressed && styles.buttonPressed]}
                    onPress={signUp}
                >
                    {({ pressed }) => (
                        <Text style={[styles.buttonText, pressed && styles.textPressed]}>
                            Sign up
                        </Text>
                    )}
                </Pressable>

                <Link href="/signin" asChild>
                    <Pressable
                        style={styles.signInButton}
                        onPress={resetFields}>
                        {({ pressed }) => (
                            <Text style={[styles.linkText, pressed && styles.textPressed]}>
                                Sign in
                            </Text>
                        )}
                    </Pressable>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 80,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 16,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    errorContainer: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#EF4444',
        borderRadius: 4,
    },
    errorText: {
        color: 'white',
    },
    formContainer: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#D1D5DB',
        paddingVertical: 8,
        marginBottom: 16,
    },
    input: {
        flex: 1,
        marginLeft: 8,
        marginRight: 8,
    },
    signUpButton: {
        backgroundColor: '#003594',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
    },
    buttonPressed: {
        backgroundColor: '#166534',
    },
    buttonText: {
        color: '#FFB81C',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    signInButton: {
        marginTop: 16,
    },
    linkText: {
        textAlign: 'center',
        color: '#4B5563',
    },
    textPressed: {
        opacity: 0.75,
    },
});