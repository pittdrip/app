import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, router } from 'expo-router';
import React from 'react';
import { StyleSheet, Pressable, Text, TextInput, View } from 'react-native';

export default function SignIn() {
    const [value, setValue] = React.useState({
        email: '',
        password: '',
        error: ''
    });
    const [showPassword, setShowPassword] = React.useState(false);

    // Reset state when component unmounts or user navigates away
    const resetFields = () => {
        setValue({
            email: '',
            password: '',
            error: ''
        });
    };

    async function signIn() {
        setValue((currentValue) => {
            if (!currentValue.email || !currentValue.password) {
                return { ...currentValue, error: 'Please enter both email and password.' };
            }

            signInWithEmailAndPassword(auth, currentValue.email, currentValue.password)
                .then((userCredential) => {
                    router.replace('/(tabs)/home');
                })
                .catch(() => {
                    setValue((prevValue) => ({ ...prevValue, error: 'Invalid email or password. Please try again.' }));
                });

            // Return the current value without changes
            return currentValue;
        });
    }

    async function resetPassword() {
        setValue(currentValue => {
            if (currentValue.email === '') {
                return { ...currentValue, error: 'Please enter your email to reset password' };
            }

            sendPasswordResetEmail(auth, currentValue.email)
                .then(() => {
                    setValue({ ...currentValue, error: 'Password reset email sent!' });
                })
                .catch(() => {
                    setValue((prevValue) => ({ ...prevValue, error: 'Invalid email. Please try again.' }));
                });

            return currentValue;
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign In</Text>

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

                <Pressable
                    style={({ pressed }) => [styles.signInButton, pressed && styles.buttonPressed]}
                    onPress={signIn}
                >
                    {({ pressed }) => (
                        <Text style={[styles.buttonText, pressed && styles.textPressed]}>
                            Sign in
                        </Text>
                    )}
                </Pressable>

                <Pressable
                    style={styles.resetPasswordButton}
                    onPress={resetPassword}
                >
                    {({ pressed }) => (
                        <Text style={[styles.linkText, pressed && styles.textPressed]}>
                            Reset your password
                        </Text>
                    )}
                </Pressable>

                <Link href="./signup" asChild>
                    <Pressable
                        style={styles.signUpButton}
                        onPress={resetFields}>
                        {({ pressed }) => (
                            <Text style={[styles.linkText, pressed && styles.textPressed]}>
                                Sign up
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
    signInButton: {
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
    resetPasswordButton: {
        marginTop: 16,
    },
    signUpButton: {
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