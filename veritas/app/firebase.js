import { initializeApp, getApps } from "firebase/app"; // Firebase SDK for app initialization
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Firebase Authentication and Google Auth Provider
import { getFirestore } from "firebase/firestore"; // Firestore database for storing data
import { getStorage } from "firebase/storage"; // Firebase Storage for file uploads and downloads
import { getDatabase } from "firebase/database"; // Firebase Realtime Database for real-time data synchronization

// Firebase configuration object containing API key, project details, and other necessary identifiers
const firebaseConfig = {
  apiKey: "AIzaSyCOQiAJnlUSDJBOcTHdiJUD_AhuptJc8I0",
  authDomain: "veritas-b5695.firebaseapp.com",
  projectId: "veritas-b5695",
  storageBucket: "veritas-b5695.appspot.com",
  messagingSenderId: "561340048771",
  appId: "1:561340048771:web:1f51eb99e888c4dfbd82b6",
  measurementId: "G-BMJKL7LJQE"
};

// Initialize Firebase app, ensuring only one instance is created
// If there are no initialized apps, initialize one; otherwise, use the already initialized app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Google authentication provider for login functionality using Google
const provider = new GoogleAuthProvider();

// Export Firebase authentication instance, which is used to manage user authentication
export const auth = getAuth(app);

// Export Firestore instance for interacting with the Firestore database (NoSQL database)
export const db = getFirestore(app);

// Export Firebase Storage instance for managing files in cloud storage (uploading, downloading, etc.)
export const storage = getStorage(app, "gs://veritas-b5695"); // The second argument specifies the storage bucket location

// Export Realtime Database instance for syncing data in real time (alternative to Firestore)
export const realtimeDB = getDatabase(app);

// Export the Google authentication provider for use in authentication flows
export { provider };
