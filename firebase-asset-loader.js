// Firebase Asset Loader
// Dynamically import Firebase modules
let db;

async function initializeFirebase() {
  try {
    // Try to import from the regular path first
    const { db: firebaseDb } = await import('./firebase-config.js');
    if (firebaseDb) {
      console.log('✅ Firebase DB imported successfully');
      db = firebaseDb;
      return true;
    } else {
      console.warn('⚠️ Firebase DB was imported but is undefined');
      return false;
    }
  } catch (error) {
    console.error('❌ Error importing Firebase DB:', error);
    return false;
  }
}

class FirebaseAssetLoader {
  constructor() {
    this.assets = {
      player: {},
      enemies: {},
      objects: {}
    };
    this.criticalAssetsLoaded = false;
    this.lazyAssetsLoading = false;
  }

  // Fetch asset list from Firebase Firestore
  async fetchAssetList() {
    try {
      // Make sure Firebase is initialized
      const isInitialized = await initializeFirebase();
      if (!isInitialized) {
        console.warn('⚠️ Firebase not initialized, using default assets');
        return this.getDefaultAssetList();
      }
      
      // Try to import Firestore functions
      let doc, getDoc;
      try {
        const firestoreModule = await import('firebase/firestore');
        doc = firestoreModule.doc;
        getDoc = firestoreModule.getDoc;
      } catch (firestoreError) {
        console.error('❌ Error importing Firestore functions:', firestoreError);
        return this.getDefaultAssetList();
      }
      
      // Now try to fetch the asset list
      try {
        const docRef = doc(db, 'gameAssets', 'assetList');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          console.log('✅ Firebase asset list loaded successfully');
          return docSnap.data();
        } else {
          console.warn('⚠️ No asset list found in Firebase, using default assets');
          return this.getDefaultAssetList();
        }
      } catch (firestoreError) {
        console.error('❌ Error fetching from Firestore:', firestoreError);
        return this.getDefaultAssetList();
      }
    } catch (error) {
      console.error('❌ Error in fetchAssetList:', error);
      return this.getDefaultAssetList();
    }
  }

  // Default asset list in case Firebase fails
  getDefaultAssetList() {
    return {
      critical: {
        player: {
          '1-Idle': { path: 'Sprites/1-Player-Bomb Guy/1-Idle', count: 26 },
          '2-Run': { path: 'Sprites/1-Player-Bomb Guy/2-Run', count: 14 },
          '4-Jump': { path: 'Sprites/1-Player-Bomb Guy/4-Jump', count: 4 },
          '5-Fall': { path: 'Sprites/1-Player-Bomb Guy/5-Fall', count: 2 }
        },
        enemies: {
          'Bald Pirate': {
            '1-Idle': { path: 'Sprites/2-Enemy-Bald Pirate/1-Idle', count: 34 },
            '2-Run': { path: 'Sprites/2-Enemy-Bald Pirate/2-Run', count: 14 },
            '4-Jump': { path: 'Sprites/2-Enemy-Bald Pirate/4-Jump', count: 4 }
          }
        },
        objects: {
          bomb: {
            '1-Bomb Off': { path: 'Sprites/7-Objects/1-BOMB/1-Bomb Off', count: 1 },
            '2-Bomb On': { path: 'Sprites/7-Objects/1-BOMB/2-Bomb On', count: 10 }
          },
          door: {
            '1-Closed': { path: 'Sprites/7-Objects/2-Door/1-Closed', count: 1 }
          }
        }
      },
      lazy: {
        player: {
          '3-Jump Anticipation': { path: 'Sprites/1-Player-Bomb Guy/3-Jump Anticipation', count: 1 },
          '6-Ground': { path: 'Sprites/1-Player-Bomb Guy/6-Ground', count: 3 },
          '7-Hit': { path: 'Sprites/1-Player-Bomb Guy/7-Hit', count: 8 },
          '8-Dead Hit': { path: 'Sprites/1-Player-Bomb Guy/8-Dead Hit', count: 6 },
          '9-Dead Ground': { path: 'Sprites/1-Player-Bomb Guy/9-Dead Ground', count: 4 },
          '10-Door In': { path: 'Sprites/1-Player-Bomb Guy/10-Door In', count: 16 },
          '11-Door Out': { path: 'Sprites/1-Player-Bomb Guy/11-Door Out', count: 16 }
        },
        enemies: {
          'Bald Pirate': {
            '3-Jump Anticipation': { path: 'Sprites/2-Enemy-Bald Pirate/3-Jump Anticipation', count: 1 },
            '5-Fall': { path: 'Sprites/2-Enemy-Bald Pirate/5-Fall', count: 2 },
            '6-Ground': { path: 'Sprites/2-Enemy-Bald Pirate/6-Ground', count: 3 },
            '7-Attack': { path: 'Sprites/2-Enemy-Bald Pirate/7-Attack', count: 12 },
            '8-Hit': { path: 'Sprites/2-Enemy-Bald Pirate/8-Hit', count: 8 },
            '9-Dead Hit': { path: 'Sprites/2-Enemy-Bald Pirate/9-Dead Hit', count: 6 },
            '10-Dead Ground': { path: 'Sprites/2-Enemy-Bald Pirate/10-Dead Ground', count: 4 }
          },
          'Cucumber': {
            '1-Idle': { path: 'Sprites/3-Enemy-Cucumber/1-Idle', count: 36 },
            '2-Run': { path: 'Sprites/3-Enemy-Cucumber/2-Run', count: 12 }
          }
        }
      }
    };
  }

  // Load image with timeout protection
  loadImageWithTimeout(src, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      // Set timeout to prevent hanging
      const timer = setTimeout(() => {
        console.warn(`⏰ Timeout loading asset: ${src}`);
        reject(new Error(`Timeout loading asset: ${src}`));
      }, timeout);
      
      img.onload = () => {
        clearTimeout(timer);
        console.log(`✅ Loaded asset: ${src}`);
        resolve(img);
      };
      
      img.onerror = () => {
        clearTimeout(timer);
        console.warn(`❌ Failed to load asset: ${src}`);
        resolve(this.createFallbackImage()); // Resolve with fallback instead of rejecting
      };
      
      img.src = src;
    });
  }

  // Create a simple fallback image
  createFallbackImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Draw a simple colored rectangle as fallback
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(0, 0, 64, 64);
    
    // Convert to image
    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
  }

  // Load frames with parallel processing and timeout
  async loadFrames(assetInfo, onProgress = null) {
    const frames = [];
    const promises = [];
    
    // Create all promises first
    for (let i = 1; i <= assetInfo.count; i++) {
      const src = `${assetInfo.path}/${i}.png`;
      promises.push(this.loadImageWithTimeout(src));
    }
    
    // Process in batches to avoid overwhelming the browser
    const batchSize = 6; // Browser concurrent request limit
    for (let i = 0; i < promises.length; i += batchSize) {
      const batch = promises.slice(i, i + batchSize);
      try {
        const results = await Promise.allSettled(batch);
        results.forEach((result, index) => {
          const frameIndex = i + index;
          if (result.status === 'fulfilled') {
            frames[frameIndex] = result.value;
          } else {
            console.warn(`Frame ${frameIndex + 1} failed:`, result.reason);
            frames[frameIndex] = this.createFallbackImage();
          }
          
          // Report progress if callback provided
          if (onProgress) {
            onProgress(frameIndex + 1, assetInfo.count);
          }
        });
      } catch (error) {
        console.error('Batch loading error:', error);
      }
    }
    
    return frames.filter(frame => frame !== undefined);
  }

  // Load critical assets
  async loadCriticalAssets(onProgress = null) {
    console.log('🔄 Loading critical assets from Firebase...');
    
    try {
      const assetList = await this.fetchAssetList();
      const criticalAssets = assetList.critical;
      
      let totalAssets = 0;
      let loadedAssets = 0;
      
      // Count total assets for progress tracking
      Object.values(criticalAssets.player).forEach(asset => totalAssets += asset.count);
      Object.values(criticalAssets.enemies).forEach(enemy => {
        Object.values(enemy).forEach(asset => totalAssets += asset.count);
      });
      Object.values(criticalAssets.objects).forEach(obj => {
        Object.values(obj).forEach(asset => totalAssets += asset.count);
      });
      
      const progressCallback = (loaded, total) => {
        loadedAssets += loaded;
        if (onProgress) {
          onProgress(loadedAssets, totalAssets);
        }
      };
      
      // Load player assets
      console.log('👤 Loading critical player assets...');
      for (const [animName, assetInfo] of Object.entries(criticalAssets.player)) {
        try {
          const frames = await this.loadFrames(assetInfo, progressCallback);
          this.assets.player[animName] = frames;
          console.log(`✅ Loaded player animation: ${animName} (${frames.length} frames)`);
        } catch (error) {
          console.warn(`⚠️ Failed to load player animation ${animName}:`, error);
          this.assets.player[animName] = [this.createFallbackImage()];
        }
      }
      
      // Load enemy assets
      console.log('👾 Loading critical enemy assets...');
      for (const [enemyName, animations] of Object.entries(criticalAssets.enemies)) {
        this.assets.enemies[enemyName] = {};
        for (const [animName, assetInfo] of Object.entries(animations)) {
          try {
            const frames = await this.loadFrames(assetInfo, progressCallback);
            this.assets.enemies[enemyName][animName] = frames;
            console.log(`✅ Loaded enemy ${enemyName} animation: ${animName} (${frames.length} frames)`);
          } catch (error) {
            console.warn(`⚠️ Failed to load enemy ${enemyName} animation ${animName}:`, error);
            this.assets.enemies[enemyName][animName] = [this.createFallbackImage()];
          }
        }
      }
      
      // Load object assets
      console.log('💣 Loading critical object assets...');
      for (const [objName, animations] of Object.entries(criticalAssets.objects)) {
        this.assets.objects[objName] = {};
        for (const [animName, assetInfo] of Object.entries(animations)) {
          try {
            const frames = await this.loadFrames(assetInfo, progressCallback);
            this.assets.objects[objName][animName] = frames;
            console.log(`✅ Loaded object ${objName} animation: ${animName} (${frames.length} frames)`);
          } catch (error) {
            console.warn(`⚠️ Failed to load object ${objName} animation ${animName}:`, error);
            this.assets.objects[objName][animName] = [this.createFallbackImage()];
          }
        }
      }
      
      this.criticalAssetsLoaded = true;
      console.log('✅ All critical assets loaded successfully');
      return true;
    } catch (error) {
      console.error('❌ Critical asset loading failed:', error);
      return false;
    }
  }

  // Start lazy loading non-critical assets
  async startLazyLoading() {
    if (this.lazyAssetsLoading) return;
    
    this.lazyAssetsLoading = true;
    console.log('🔄 Starting lazy loading of non-critical assets...');
    
    try {
      const assetList = await this.fetchAssetList();
      const lazyAssets = assetList.lazy;
      
      // Load player lazy assets
      console.log('👤 Loading lazy player assets...');
      for (const [animName, assetInfo] of Object.entries(lazyAssets.player || {})) {
        try {
          const frames = await this.loadFrames(assetInfo);
          this.assets.player[animName] = frames;
          console.log(`✅ Lazy loaded player animation: ${animName} (${frames.length} frames)`);
        } catch (error) {
          console.warn(`⚠️ Failed to lazy load player animation ${animName}:`, error);
          this.assets.player[animName] = [this.createFallbackImage()];
        }
      }
      
      // Load enemy lazy assets
      console.log('👾 Loading lazy enemy assets...');
      for (const [enemyName, animations] of Object.entries(lazyAssets.enemies || {})) {
        if (!this.assets.enemies[enemyName]) {
          this.assets.enemies[enemyName] = {};
        }
        
        for (const [animName, assetInfo] of Object.entries(animations)) {
          try {
            const frames = await this.loadFrames(assetInfo);
            this.assets.enemies[enemyName][animName] = frames;
            console.log(`✅ Lazy loaded enemy ${enemyName} animation: ${animName} (${frames.length} frames)`);
          } catch (error) {
            console.warn(`⚠️ Failed to lazy load enemy ${enemyName} animation ${animName}:`, error);
            this.assets.enemies[enemyName][animName] = [this.createFallbackImage()];
          }
        }
      }
      
      console.log('✅ Lazy loading completed');
    } catch (error) {
      console.error('❌ Lazy loading failed:', error);
    }
  }

  // Get loaded assets
  getAssets() {
    return this.assets;
  }

  // Check if critical assets are loaded
  areCriticalAssetsLoaded() {
    return this.criticalAssetsLoaded;
  }
}

// Export as singleton
const firebaseAssetLoader = new FirebaseAssetLoader();
export default firebaseAssetLoader;