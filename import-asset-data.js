// Firebase Asset Import Script

// Import Firebase modules
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
// Add auth module for service account authentication
const { getAuth } = require('firebase/auth');

// Firebase configuration from firebase-config.js
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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Initialize Auth
const auth = getAuth(app);

// Asset list data structure
const assetListData = {
  critical: {
    player: {
      "1-Idle": { path: "Sprites/1-Player-Bomb Guy/1-Idle", count: 26 },
      "2-Run": { path: "Sprites/1-Player-Bomb Guy/2-Run", count: 14 },
      "4-Jump": { path: "Sprites/1-Player-Bomb Guy/4-Jump", count: 4 },
      "5-Fall": { path: "Sprites/1-Player-Bomb Guy/5-Fall", count: 2 }
    },
    enemies: {
      "Bald Pirate": {
        "1-Idle": { path: "Sprites/2-Enemy-Bald Pirate/1-Idle", count: 34 },
        "2-Run": { path: "Sprites/2-Enemy-Bald Pirate/2-Run", count: 14 },
        "4-Jump": { path: "Sprites/2-Enemy-Bald Pirate/4-Jump", count: 4 }
      }
    },
    objects: {
      bomb: {
        "1-Bomb Off": { path: "Sprites/7-Objects/1-BOMB/1-Bomb Off", count: 1 },
        "2-Bomb On": { path: "Sprites/7-Objects/1-BOMB/2-Bomb On", count: 10 }
      },
      door: {
        "1-Closed": { path: "Sprites/7-Objects/2-Door/1-Closed", count: 1 }
      }
    }
  },
  lazy: {
    player: {
      "3-Jump Anticipation": { path: "Sprites/1-Player-Bomb Guy/3-Jump Anticipation", count: 1 },
      "6-Ground": { path: "Sprites/1-Player-Bomb Guy/6-Ground", count: 3 },
      "7-Hit": { path: "Sprites/1-Player-Bomb Guy/7-Hit", count: 8 },
      "8-Dead Hit": { path: "Sprites/1-Player-Bomb Guy/8-Dead Hit", count: 6 },
      "9-Dead Ground": { path: "Sprites/1-Player-Bomb Guy/9-Dead Ground", count: 4 },
      "10-Door In": { path: "Sprites/1-Player-Bomb Guy/10-Door In", count: 16 },
      "11-Door Out": { path: "Sprites/1-Player-Bomb Guy/11-Door Out", count: 16 }
    },
    enemies: {
      "Bald Pirate": {
        "3-Jump Anticipation": { path: "Sprites/2-Enemy-Bald Pirate/3-Jump Anticipation", count: 1 },
        "5-Fall": { path: "Sprites/2-Enemy-Bald Pirate/5-Fall", count: 2 },
        "6-Ground": { path: "Sprites/2-Enemy-Bald Pirate/6-Ground", count: 3 },
        "7-Attack": { path: "Sprites/2-Enemy-Bald Pirate/7-Attack", count: 12 },
        "8-Hit": { path: "Sprites/2-Enemy-Bald Pirate/8-Hit", count: 8 },
        "9-Dead Hit": { path: "Sprites/2-Enemy-Bald Pirate/9-Dead Hit", count: 6 },
        "10-Dead Ground": { path: "Sprites/2-Enemy-Bald Pirate/10-Dead Ground", count: 4 }
      },
      "Cucumber": {
        "1-Idle": { path: "Sprites/3-Enemy-Cucumber/1-Idle", count: 36 },
        "2-Run": { path: "Sprites/3-Enemy-Cucumber/2-Run", count: 12 }
      }
    }
  }
};

// Function to import asset list data to Firestore
async function importAssetListData() {
  try {
    console.log('Starting import of asset list data to Firestore...');
    
    // Note: For production, you would need to authenticate with a service account
    // For now, we're using the client SDK which requires user authentication
    // or you need to set up Firebase security rules to allow unauthenticated writes
    
    const docRef = doc(db, 'gameAssets', 'assetList');
    await setDoc(docRef, assetListData);
    
    console.log('✅ Asset list data imported successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing asset list data:', error);
    console.log('💡 To resolve this issue, you need to:');
    console.log('   1. Update your Firestore security rules to allow writes');
    console.log('   2. Or set up Firebase Admin SDK with service account credentials');
    process.exit(1);
  }
}

// Run the import function
importAssetListData();