# Firestore Setup Guide for Pirate Bomb Game

This guide explains how to properly set up Firestore security rules and import game asset data.

## Prerequisites

1. You have created a Firebase project (kabomb-53f1d)
2. You have enabled Firestore Database in your project
3. You have registered a web app in your Firebase project

## Setting Up Firestore Security Rules

### Option 1: Basic Rules (Development Only)

For development purposes, you can use these basic rules that allow read/write access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **Warning**: These rules allow anyone to read and write to your database. Only use them for development.

### Option 2: Production-Ready Rules

For production, use these more secure rules:

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

## Importing Game Asset Data

There are two ways to import the game asset data:

### Method 1: Using Admin SDK (Recommended)

1. Go to Firebase Console > Project Settings > Service Accounts
2. Generate a new private key and download the JSON file
3. Rename the file to `serviceAccountKey.json` and place it in the project root
4. Run the admin import script:
   ```bash
   node import-asset-data-admin.js
   ```

### Method 2: Using Client SDK (Requires Updated Security Rules)

1. Update your Firestore security rules to allow writes (see above)
2. Run the client import script:
   ```bash
   node import-asset-data.js
   ```

## Troubleshooting

### Permission Denied Errors

If you encounter "PERMISSION_DENIED" errors:

1. Make sure your security rules allow writes to the `gameAssets` collection
2. Or use the Admin SDK method which bypasses security rules

### Authentication Required

If you see authentication errors:

1. Make sure you've downloaded and placed the `serviceAccountKey.json` file correctly
2. Or ensure your Firebase project has the correct configuration in `firebase-config.js`

## Verifying Data Import

After importing, you can verify the data in the Firebase Console:

1. Go to Firestore Database in your Firebase Console
2. Check that the `gameAssets` collection exists
3. Verify that the `assetList` document contains the correct data structure