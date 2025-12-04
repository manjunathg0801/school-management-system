import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { loginUser } from '../services/api';
import { UserContext } from '../contexts/UserContext';

export default function LoginScreen() {
    const { login } = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please enter both username and password.');
            return;
        }

        setLoading(true);
        console.log("Attempting login with:", username);

        try {
            // Call backend API
            const data = await loginUser(username, password);
            console.log("Login success:", data);
            // On success, update global context
            login(data.user);
        } catch (error) {
            // Error is already handled/alerted in api.js
            console.log('Login failed in screen:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.logoContainer}>
                <Image
                    source={{ uri: 'https://i.ibb.co/9hh6sMb/school-logo.png' }} // Replace with local asset if available
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.schoolName}>THE SCHOOL</Text>
                <Text style={styles.subtitle}>School Management System</Text>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.welcomeText}>Welcome Back!</Text>
                <Text style={styles.instructionText}>Please login to continue</Text>

                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color="#6b7280" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Username / Student ID"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#6b7280" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color="#6b7280"
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.forgotButton}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.loginButton, loading && { opacity: 0.7 }]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <Text style={styles.loginButtonText}>Logging in...</Text>
                    ) : (
                        <Text style={styles.loginButtonText}>Login</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Powered by QUAD THOUGHT</Text>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 24,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 16,
    },
    schoolName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111',
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
        marginTop: 4,
    },
    formContainer: {
        width: '100%',
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
    },
    instructionText: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 16,
        backgroundColor: '#f9fafb',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#111',
    },
    forgotButton: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotText: {
        color: '#3b82f6',
        fontWeight: '600',
    },
    loginButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
    },
    footerText: {
        color: '#9ca3af',
        fontSize: 12,
    },
});
