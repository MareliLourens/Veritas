import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCOQiAJnlUSDJBOcTHdiJUD_AhuptJc8I0",
  authDomain: "veritas-b5695.firebaseapp.com",
  projectId: "veritas-b5695",
  storageBucket: "veritas-b5695.appspot.com",
  messagingSenderId: "561340048771",
  appId: "1:561340048771:web:1f51eb99e888c4dfbd82b6",
  measurementId: "G-BMJKL7LJQE"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const provider = new GoogleAuthProvider();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app, "gs://veritas-b5695");
export const realtimeDB = getDatabase(app);
export { provider };
