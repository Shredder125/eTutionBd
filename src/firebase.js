// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,            // Changed
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,    // Changed
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,      // Changed
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, // Changed
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, // Changed
  appId: import.meta.env.VITE_FIREBASE_APP_ID               // Changed
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and Export Authentication
export const auth = getAuth(app);
export default app;