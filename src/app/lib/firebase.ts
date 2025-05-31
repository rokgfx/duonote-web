// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7CL6hgWKtku4-kuLfG8FP0X8p0babpJQ",
  authDomain: "duonote-9f2b0.firebaseapp.com",
  projectId: "duonote-9f2b0",
  storageBucket: "duonote-9f2b0.firebasestorage.app",
  messagingSenderId: "63703264830",
  appId: "1:63703264830:web:87ff5ef24afbed21de2b6f",
  measurementId: "G-QB6GR7HW37"
};

// Initialize Firebase (singleton pattern for Next.js hot reload)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const analytics = typeof window !== "undefined" ? getAnalytics(app) : undefined;
const auth = typeof window !== "undefined" ? getAuth(app) : undefined;
const db = typeof window !== "undefined" ? getFirestore(app) : undefined;

export { app, analytics, auth, db };
