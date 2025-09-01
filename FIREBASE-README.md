# Firebase Integration for Pirate Bomb Game

This document explains how to set up and use Firebase for the Pirate Bomb game.

## Overview

The Firebase integration provides:

1. **Asset Loading**: Load game assets from Firestore instead of individual HTTP requests
2. **Progressive Loading**: Load critical assets first, then lazy load non-critical assets
3. **Error Handling**: Timeout protection prevents the loading bar from freezing
4. **Flexible Configuration**: Easily update asset lists without changing code

## Files

- `firebase-config.js`: Firebase initialization and configuration
- `firebase-asset-loader.js`: Firebase-based asset loading implementation
- `import-asset-data.js`: Script to import asset data using client SDK
- `import-asset-data-admin.js`: Script to import asset data using Admin SDK
- `test-firebase-config.js`: Script to test Firebase connection
- `firebase/firestore.rules`: Firestore security rules
- `firebase/firebase.json`: Firebase configuration
- `FIREBASE-SETUP.md`: Detailed setup instructions
- `FIRESTORE-SETUP-GUIDE.md`: Comprehensive guide for Firestore setup
- `deploy-firebase-rules.sh`: Script to deploy Firestore security rules

## Setup Process

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project named "kabomb-53f1d"
   - Enable Firestore Database

2. **Register Web App**
   - In Firebase Console, register a new web app
   - Copy the configuration values to `firebase-config.js`

3. **Set Up Security Rules**
   - Update `firebase/firestore.rules` with appropriate rules
   - Deploy rules using `firebase deploy --only firestore:rules`

4. **Import Asset Data**
   - Use either the client SDK script or Admin SDK script:
     - `node import-asset-data.js` (requires security rules update)
     - `node import-asset-data-admin.js` (requires service account key)

## Usage

The game will automatically use Firebase asset loading when `firebase-config.js` is properly configured. If Firebase is unavailable, it falls back to the default asset loader.

## Testing

Run `node test-firebase-config.js` to verify the Firebase connection.

## Troubleshooting

### Permission Denied Errors

If you encounter "PERMISSION_DENIED" errors:

1. Check that your Firestore security rules allow read access to `gameAssets`
2. For write operations, either update security rules or use the Admin SDK

### Authentication Issues

If you see authentication errors:

1. Make sure you've downloaded and placed the `serviceAccountKey.json` file correctly
2. Or ensure your Firebase project has the correct configuration in `firebase-config.js`

## Security Considerations

For production use:

1. Never commit `serviceAccountKey.json` to version control
2. Use restrictive security rules that only allow necessary operations
3. Regularly rotate service account keys