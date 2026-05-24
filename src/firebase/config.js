import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration keys
// These match your specific "taxigo-app-2026" web console project settings
const firebaseConfig = {
  apiKey: "AIzaSyDwm_K_240nXjg2MkDYBf49r7je--q6G5I",
  authDomain: "taxigo-fleet.firebaseapp.com",
  projectId: "taxigo-fleet",
  storageBucket: "taxigo-fleet.firebasestorage.app",
  messagingSenderId: "586349103347",
  appId: "1:586349103347:web:866dec90a5ffe726108f86"
};

// Initialize the core Firebase instance node
const app = initializeApp(firebaseConfig);

// Task 1: Initialize and export the Authentication module reference
export const auth = getAuth(app);

// Task 1: Create and export the Google Sign-In Provider object instance
export const googleProvider = new GoogleAuthProvider();

// Task 2 & 4: Initialize and export the Firestore Cloud Database connection instance
export const db = getFirestore(app);

// Default export wrapper
export default app;