import { createContext, useState, useEffect } from 'react';
import API from '../services/api';
import axios from 'axios';
import {
    signInWithPopup,
    signOut
} from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../config/firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check backend session on app load
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const { data } = await API.get('/auth/me');
            // ✅ FIX: Set user.user if response has that structure, otherwise use data directly
            setUser(data.user || data);
            localStorage.setItem("user", JSON.stringify(data.user || data));
        } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    };

    // Email/Password Registration with OTP
    const register = async (name, email, password) => {
        // Step 1: Send OTP to email
        await API.post('/auth/send-otp', { email, name });

        return {
            email,
            name,
            password,
            requiresOTP: true
        };
    };

    // Verify OTP and complete registration
    const verifyOTPAndRegister = async (email, name, password, otp) => {
        const { data } = await API.post('/auth/register', {
            name,
            email,
            password,
            otp
        });

        localStorage.setItem('token', data.token);
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        return data;
    };

    // Email/password login
    const login = async (email, password) => {
        const { data } = await API.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
    };

    // Google OAuth
    const loginWithGoogle = async () => {
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseToken = await result.user.getIdToken(true);

        localStorage.setItem('firebaseToken', firebaseToken); // ✅ Store firebase token

        const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/oauth-login`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${firebaseToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        localStorage.setItem('token', data.token);
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
    };

    // GitHub OAuth
    const loginWithGithub = async () => {
        try {
            const result = await signInWithPopup(auth, githubProvider);
            const firebaseToken = await result.user.getIdToken(true);

            localStorage.setItem('firebaseToken', firebaseToken); // ✅ Store firebase token

            const { data } = await API.post(
                '/auth/oauth-login',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${firebaseToken}`
                    }
                }
            );

            localStorage.setItem('token', data.token);
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
        } catch (error) {
            console.error('GitHub auth error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            const firebaseToken = localStorage.getItem('firebaseToken');

            if (firebaseToken && auth.currentUser) {
                await signOut(auth);
            }
        } catch (error) {
            console.error('Firebase signout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('firebaseToken');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                login,
                loginWithGoogle,
                loginWithGithub,
                logout,
                register,
                verifyOTPAndRegister
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};