# Firebase Setup for Pirate Bomb Game

This document explains how to set up Firebase for the asset loading system.

## Firebase Project Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Firestore Database
4. Register your web app and get the configuration

## Firestore Security Rules

To allow the game to read asset data and for the import script to write data, you need to set up Firestore security rules.

Create a `firebase/firestore.rules` file with the following content:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to game assets for all users
    match /gameAssets/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Allow read/write access to player data only for the owner
    match /players/{playerId} {
      allow read, write: if request.auth != null && request.auth.uid == playerId;
    }
    
    // Allow read access to achievements for all users
    match /achievements/{achievementId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Deploying Security Rules

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Deploy the rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

## Firestore Data Structure

Create a collection called `gameAssets` with a document named `assetList` containing the following structure:

```
{
  "critical": {
    "player": {
      "1-Idle": { "path": "Sprites/1-Player-Bomb Guy/1-Idle", "count": 2 },
      "2-Run": { "path": "Sprites/1-Player-Bomb Guy/2-Run", "count": 6 },
      "4-Jump": { "path": "Sprites/1-Player-Bomb Guy/4-Jump", "count": 1 },
      "5-Fall": { "path": "Sprites/1-Player-Bomb Guy/5-Fall", "count": 2 }
    },
    "enemies": {
      "Bald Pirate": {
        "1-Idle": { "path": "Sprites/2-Enemy-Bald Pirate/1-Idle", "count": 1 },
        "2-Run": { "path": "Sprites/2-Enemy-Bald Pirate/2-Run", "count": 4 },
        "4-Jump": { "path": "Sprites/2-Enemy-Bald Pirate/4-Jump", "count": 1 }
      }
    },
    "objects": {
      "bomb": {
        "1-Bomb Off": { "path": "Sprites/7-Objects/1-BOMB/1-Bomb Off", "count": 1 },
        "2-Bomb On": { "path": "Sprites/7-Objects/1-BOMB/2-Bomb On", "count": 10 }
      },
      "door": {
        "1-Closed": { "path": "Sprites/7-Objects/2-Door/1-Closed", "count": 1 }
      }
    }
  },
  "lazy": {
    "player": {
      "3-Jump Anticipation": { "path": "Sprites/1-Player-Bomb Guy/3-Jump Anticipation", "count": 1 },
      "6-Ground": { "path": "Sprites/1-Player-Bomb Guy/6-Ground", "count": 1 },
      "7-Hit": { "path": "Sprites/1-Player-Bomb Guy/7-Hit", "count": 2 },
      "8-Dead Hit": { "path": "Sprites/1-Player-Bomb Guy/8-Dead Hit", "count": 1 },
      "9-Dead Ground": { "path": "Sprites/1-Player-Bomb Guy/9-Dead Ground", "count": 1 },
      "10-Door In": { "path": "Sprites/1-Player-Bomb Guy/10-Door In", "count": 1 },
      "11-Door Out": { "path": "Sprites/1-Player-Bomb Guy/11-Door Out", "count": 1 }
    },
    "enemies": {
      "Bald Pirate": {
        "3-Jump Anticipation": { "path": "Sprites/2-Enemy-Bald Pirate/3-Jump Anticipation", "count": 1 },
        "5-Fall": { "path": "Sprites/2-Enemy-Bald Pirate/5-Fall", "count": 2 },
        "6-Ground": { "path": "Sprites/2-Enemy-Bald Pirate/6-Ground", "count": 3 },
        "7-Attack": { "path": "Sprites/2-Enemy-Bald Pirate/7-Attack", "count": 4 },
        "8-Hit": { "path": "Sprites/2-Enemy-Bald Pirate/8-Hit", "count": 2 },
        "9-Dead Hit": { "path": "Sprites/2-Enemy-Bald Pirate/9-Dead Hit", "count": 2 },
        "10-Dead Ground": { "path": "Sprites/2-Enemy-Bald Pirate/10-Dead Ground", "count": 1 }
      },
      "Cucumber": {
        "1-Idle": { "path": "Sprites/3-Enemy-Cucumber/1-Idle", "count": 1 },
        "2-Run": { "path": "Sprites/3-Enemy-Cucumber/2-Run", "count": 3 }
      }
    }
  }
}
```

## Importing Data to Firestore

There are two scripts to import the asset data:

1. `import-asset-data.js` - Uses the client SDK (requires security rules update)
2. `import-asset-data-admin.js` - Uses the Admin SDK (requires service account key)

For the Admin SDK method:
1. Go to Firebase Console > Project Settings > Service Accounts
2. Generate a new private key and download the JSON file
3. Rename the file to `serviceAccountKey.json` and place it in the project root
4. Run: `node import-asset-data-admin.js`

## Firebase Configuration

Update the `firebase-config.js` file with your actual Firebase project configuration:

```javascript
// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
```

## Benefits of Firebase Asset Loading

1. **Reduced HTTP Requests**: Fetch asset lists from a single Firestore document instead of making individual requests for each asset
2. **Progressive Loading**: Load critical assets first, then lazy load non-critical assets in the background
3. **Robust Error Handling**: Timeout protection prevents the loading bar from freezing
4. **Flexible Configuration**: Easily update asset lists without changing code
5. **Fallback System**: Automatically falls back to the default asset loader if Firebase is unavailable