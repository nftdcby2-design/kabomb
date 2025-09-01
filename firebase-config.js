// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbj7Ae1UO6yyI35oaaXIGtM1ZuF52XcR4",
  authDomain: "kabomb-53f1d.firebaseapp.com",
  projectId: "kabomb-53f1d",
  storageBucket: "kabomb-53f1d.firebasestorage.app",
  messagingSenderId: "389894006613",
  appId: "1:389894006613:web:ae7ac4186f869534ecb1dc",
  measurementId: "G-4V3F6QDB96"
};

// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };