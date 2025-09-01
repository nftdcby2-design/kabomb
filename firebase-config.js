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
let app, db;

try {
  // Dynamic imports with error handling
  const firebaseModules = async () => {
    try {
      const firebaseApp = await import('https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js');
      const firestore = await import('https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js');
      
      return { 
        initializeApp: firebaseApp.initializeApp,
        getFirestore: firestore.getFirestore 
      };
    } catch (error) {
      console.error('Error loading Firebase modules:', error);
      throw error;
    }
  };

  // Initialize Firebase app and services
  (async () => {
    try {
      const { initializeApp, getFirestore } = await firebaseModules();
      app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      console.log('✅ Firebase initialized successfully');
    } catch (error) {
      console.error('❌ Firebase initialization failed:', error);
      // Will use fallback in game.js
    }
  })();
} catch (error) {
  console.error('❌ Firebase setup error:', error);
  // Will use fallback in game.js
}

// Export the db object (may be undefined if initialization fails)
export { db };