// Test Firebase Configuration

// Import Firebase configuration
import { db } from './firebase-config.js';

// Test function to verify Firebase connection
async function testFirebaseConnection() {
  try {
    console.log('Testing Firebase connection...');
    
    // Try to read from the gameAssets collection
    const assetListRef = doc(db, 'gameAssets', 'assetList');
    const assetListSnap = await getDoc(assetListRef);
    
    if (assetListSnap.exists()) {
      console.log('✅ Firebase connection successful!');
      console.log('✅ Asset list document found');
      console.log('Asset list data:', Object.keys(assetListSnap.data()));
    } else {
      console.log('⚠️ Firebase connection successful, but asset list document not found');
      console.log('You may need to run the import script to populate the data');
    }
  } catch (error) {
    console.error('❌ Error testing Firebase connection:', error);
    
    if (error.code === 'permission-denied') {
      console.log('💡 This might be a security rules issue. Make sure your Firestore rules allow read access.');
    }
  }
}

// Import required Firebase functions
import { doc, getDoc } from 'firebase/firestore';

// Run the test
testFirebaseConnection();