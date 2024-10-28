import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
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

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const realtimeDB = getDatabase(app);
const firestore = getFirestore(app);
export { firestore, provider };
