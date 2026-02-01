import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration



const firebaseConfig = {
    apiKey: process.env.VITE_apiKey,
    authDomain: process.env.VITE_authDomain,
    projectId: process.env.VITE_projectId,
    storageBucket: process.env.VITE_storageBucket,
    messagingSenderId: process.env.VITE_messagingSenderId,
    appId: process.env.VITE_appId,
    measurementId: process.env.VITE_measurementId
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
const app = getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp();

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

export default app;