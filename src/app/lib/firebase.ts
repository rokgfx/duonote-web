// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { enableNetwork, disableNetwork, initializeFirestore, persistentLocalCache, persistentMultipleTabManager, Firestore } from "firebase/firestore";
import { Analytics } from "firebase/analytics";
import { Auth } from "firebase/auth";

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

// Initialize services only on client side
let analytics: Analytics | undefined = undefined;
let auth: Auth | undefined = undefined;
let db: Firestore | undefined = undefined;

if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
  auth = getAuth(app);
  
  // Initialize Firestore with explicit persistence settings
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
  
  if (db) {
    console.log("Firestore initialized with explicit offline persistence enabled");
  }
}

// Utility functions for network management
export const goOffline = async () => {
  if (db) {
    try {
      await disableNetwork(db);
      console.log("Firestore offline mode enabled");
    } catch (error) {
      console.error("Error enabling offline mode:", error);
    }
  }
};

export const goOnline = async () => {
  if (db) {
    try {
      await enableNetwork(db);
      console.log("Firestore online mode enabled");
    } catch (error) {
      console.error("Error enabling online mode:", error);
    }
  }
};

export { app, analytics, auth, db };
