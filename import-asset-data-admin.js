// Firebase Asset Import Script using Admin SDK

// Import Firebase Admin SDK
const admin = require('firebase-admin');

// Asset list data structure (same as in the original script)
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

// Initialize Firebase Admin SDK
// You need to download your service account key from Firebase Console
// and save it as 'serviceAccountKey.json' in the project root
try {
  const serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error('❌ Error initializing Firebase Admin SDK:', error);
  console.log('💡 To use this script, you need to:');
  console.log('   1. Go to Firebase Console > Project Settings > Service Accounts');
  console.log('   2. Generate a new private key and download the JSON file');
  console.log('   3. Rename the file to serviceAccountKey.json and place it in the project root');
  process.exit(1);
}

const db = admin.firestore();

// Function to import asset list data to Firestore using Admin SDK
async function importAssetListData() {
  try {
    console.log('Starting import of asset list data to Firestore using Admin SDK...');
    
    const docRef = db.collection('gameAssets').doc('assetList');
    await docRef.set(assetListData);
    
    console.log('✅ Asset list data imported successfully using Admin SDK!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing asset list data:', error);
    process.exit(1);
  }
}

// Run the import function
importAssetListData();