import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  updateProfile,
} from "firebase/auth";

// Your web app's Firebase configuration
// REPLACE THESE WITH YOUR ACTUAL FIREBASE PROJECT KEYS
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSy_mock_key_for_dev",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cargobee-mock.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cargobee-mock",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cargobee-mock.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:mock123",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Action code settings for email link sign-in
export const actionCodeSettings = {
  // URL to redirect to after sign-in. Must be whitelisted in Firebase Console.
  url: import.meta.env.VITE_APP_URL || window.location.origin + '/login',
  handleCodeInApp: true,
};

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  updateProfile,
};
