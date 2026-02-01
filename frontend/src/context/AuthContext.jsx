// import { createContext, useState, useEffect } from 'react';
// import API from '../services/api';
// import {
//     createUserWithEmailAndPassword,
//     signInWithEmailAndPassword,
//     signInWithPopup,
//     signOut,
//     onAuthStateChanged,
//     updateProfile
// } from 'firebase/auth';
// import { auth, googleProvider, githubProvider } from '../config/firebase';
// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         checkAuth();
//     }, []);

//     const checkAuth = async () => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             try {
//                 const { data } = await API.get('/auth/me');
//                 setUser(data);
//             } catch (error) {
//                 localStorage.removeItem('token');
//             }
//         }
//         setLoading(false);
//     };

//     const login = async (email, password) => {
//         const { data } = await API.post('/auth/login', { email, password });
//         localStorage.setItem('token', data.token);
//         setUser(data);
//         return data;
//     };

//     const register = async (name, email, password) => {
//         const { data } = await API.post('/auth/register', { name, email, password });
//         localStorage.setItem('token', data.token);
//         setUser(data);
//         return data;
//     };

//     const logout = () => {
//         localStorage.removeItem('token');
//         setUser(null);
//     };

//     return (
//         <AuthContext.Provider
//             value={{
//                 user,
//                 loading,
//                 register,
//                 login,
//                 logout
//             }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
// };


// import { createContext, useState, useEffect } from 'react';
// import API from '../services/api';
// import {
//     createUserWithEmailAndPassword,
//     signInWithEmailAndPassword,
//     signInWithPopup,
//     signOut,
//     onAuthStateChanged,
//     updateProfile
// } from 'firebase/auth';
// import { auth, googleProvider, githubProvider } from '../config/firebase';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     // Monitor Firebase auth state
//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//             if (firebaseUser) {
//                 // If user is authenticated with Firebase, sync with backend
//                 try {
//                     const token = await firebaseUser.getIdToken();
//                     localStorage.setItem('firebaseToken', token);

//                     // Check if user exists in your backend
//                     const { data } = await API.post('/auth/firebase-login', {
//                         firebaseUid: firebaseUser.uid,
//                         email: firebaseUser.email,
//                         name: firebaseUser.displayName,
//                         avatar: firebaseUser.photoURL,
//                         provider: firebaseUser.providerData[0]?.providerId
//                     });

//                     localStorage.setItem('token', data.token);
//                     setUser(data.user);
//                 } catch (error) {
//                     console.error('Firebase sync error:', error);
//                 }
//             }
//             setLoading(false);
//         });

//         // Also check for existing session
//         checkAuth();

//         return () => unsubscribe();
//     }, []);

//     const checkAuth = async () => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             try {
//                 const { data } = await API.get('/auth/me');
//                 setUser(data);
//             } catch (error) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('firebaseToken');
//             }
//         }
//         setLoading(false);
//     };

//     // Email/Password Login
//     const login = async (email, password) => {
//         const { data } = await API.post('/auth/login', { email, password });
//         localStorage.setItem('token', data.token);
//         setUser(data.user);
//         return data;
//     };

//     // Email/Password Registration with OTP
//     const register = async (name, email, password, avatar) => {
//         // Step 1: Send OTP to email
//         await API.post('/auth/send-otp', { email, name });

//         // Return a function that will complete registration after OTP verification
//         return {
//             email,
//             name,
//             password,
//             avatar,
//             requiresOTP: true
//         };
//     };

//     // Verify OTP and complete registration
//     const verifyOTPAndRegister = async (email, name, password, avatar, otp) => {
//         const { data } = await API.post('/auth/register', {
//             name,
//             email,
//             password,
//             avatar,
//             otp
//         });

//         localStorage.setItem('token', data.token);
//         setUser(data.user);
//         return data;
//     };

//     // Resend OTP
//     const resendOTP = async (email, name) => {
//         await API.post('/auth/send-otp', { email, name });
//     };

//     // Google OAuth Login/Register
//     const loginWithGoogle = async () => {
//         try {
//             const result = await signInWithPopup(auth, googleProvider);
//             const firebaseUser = result.user;

//             // Get Firebase token
//             const firebaseToken = await firebaseUser.getIdToken();
//             localStorage.setItem('firebaseToken', firebaseToken);

//             // Sync with backend
//             const { data } = await API.post('/auth/oauth-login', {
//                 firebaseUid: firebaseUser.uid,
//                 email: firebaseUser.email,
//                 name: firebaseUser.displayName,
//                 avatar: firebaseUser.photoURL,
//                 provider: 'google'
//             });

//             localStorage.setItem('token', data.token);
//             setUser(data.user);
//             return data;
//         } catch (error) {
//             throw error;
//         }
//     };

//     // GitHub OAuth Login/Register
//     const loginWithGithub = async () => {
//         try {
//             const result = await signInWithPopup(auth, githubProvider);
//             const firebaseUser = result.user;

//             // Get Firebase token
//             const firebaseToken = await firebaseUser.getIdToken();
//             localStorage.setItem('firebaseToken', firebaseToken);

//             // Sync with backend
//             const { data } = await API.post('/auth/oauth-login', {
//                 firebaseUid: firebaseUser.uid,
//                 email: firebaseUser.email,
//                 name: firebaseUser.displayName,
//                 avatar: firebaseUser.photoURL,
//                 provider: 'github'
//             });

//             localStorage.setItem('token', data.token);
//             setUser(data.user);
//             return data;
//         } catch (error) {
//             throw error;
//         }
//     };

//     // Logout
//     const logout = async () => {
//         try {
//             // Sign out from Firebase if user is authenticated
//             if (auth.currentUser) {
//                 await signOut(auth);
//             }

//             // Clear local storage
//             localStorage.removeItem('token');
//             localStorage.removeItem('firebaseToken');
//             setUser(null);
//         } catch (error) {
//             console.error('Logout error:', error);
//         }
//     };

//     return (
//         <AuthContext.Provider
//             value={{
//                 user,
//                 loading,
//                 register,
//                 verifyOTPAndRegister,
//                 resendOTP,
//                 login,
//                 loginWithGoogle,
//                 loginWithGithub,
//                 logout
//             }}
//         >
//             {!loading && children}
//         </AuthContext.Provider>
//     );
// };



import { createContext, useState, useEffect } from 'react';
import API from '../services/api';
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
            setUser(data);
        } catch {
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    // Email/Password Registration with OTP
    const register = async (name, email, password, avatar) => {
        // Step 1: Send OTP to email
        await API.post('/auth/send-otp', { email, name });

        // Return a function that will complete registration after OTP verification
        return {
            email,
            name,
            password,
            // avatar,
            requiresOTP: true
        };
    };

    // Verify OTP and complete registration
    const verifyOTPAndRegister = async (email, name, password, otp) => {
        const { data } = await API.post('/auth/register', {
            name,
            email,
            password,
            // avatar,
            otp
        });

        localStorage.setItem('token', data.token);
        setUser(data.user);
        return data;
    };

    // Email/password login
    const login = async (email, password) => {
        const { data } = await API.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        setUser(data.user);
    };

    // Google OAuth
    const loginWithGoogle = async () => {
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseToken = await result.user.getIdToken();


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
    };

    // GitHub OAuth
    const loginWithGithub = async () => {
        try {

            const result = await signInWithPopup(auth, githubProvider);

            const firebaseToken = await result.user.getIdToken(true);

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
        } catch (error) {
            console.error('GitHub auth error:', error);
        }
    };

    const logout = async () => {
        await signOut(auth);
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
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
