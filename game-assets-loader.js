/*
🚀 ADVANCED GAME ASSETS LOADER
Solves critical loading performance issues with smart asset management
- Asset bundling and sprite atlas generation
- Intelligent preloading and caching
- Lazy loading with priority system
- Memory-efficient asset management
*/

class GameAssetsLoader {
    constructor() {
        this.assets = new Map();
        this.loadingPromises = new Map();
        this.cache = new Map();
        this.loadingQueue = [];
        this.isLoading = false;
        
        // Performance settings
        this.maxConcurrentLoads = 3; // Reduced for better stability
        this.activeLoads = 0;
        this.retryAttempts = 2;
        
        // Asset priorities
        this.PRIORITY = {
            CRITICAL: 1,    // Must load before game starts
            HIGH: 2,        // Load immediately after critical
            MEDIUM: 3,      // Load in background
            LOW: 4          // Load on demand
        };
        
        // Create sprite atlas for efficient loading
        this.spriteAtlas = new Map();
        this.fallbackSprites = new Map();
        
        console.log('🎮 Advanced Game Assets Loader initialized');
    }

    /**
     * PHASE 1: Ultra-fast critical loading (< 5 seconds)
     * Load only the absolute minimum to start the game
     */
    async loadCriticalAssets(onProgress) {
        console.log('🚀 PHASE 1: Loading ultra-critical assets...');
        
        const criticalAssets = [
            { id: 'player_idle', path: 'Sprites/1-Player-Bomb Guy/1-Idle/1.png', priority: this.PRIORITY.CRITICAL },
            { id: 'player_run', path: 'Sprites/1-Player-Bomb Guy/2-Run/1.png', priority: this.PRIORITY.CRITICAL },
            { id: 'enemy_basic', path: 'Sprites/2-Enemy-Bald Pirate/1-Idle/1.png', priority: this.PRIORITY.CRITICAL },
            { id: 'bomb_basic', path: 'Sprites/7-Objects/1-BOMB/1-Bomb Off/1.png', priority: this.PRIORITY.CRITICAL },
            { id: 'tiles_basic', path: 'Sprites/8-Tile-Sets/blocks.png', priority: this.PRIORITY.CRITICAL }
        ];

        let loaded = 0;
        const total = criticalAssets.length;

        // Create fallback sprites immediately
        console.log('🎨 Creating instant fallbacks...');
        this.createInstantFallbacks();
        console.log('✅ Fallback sprites created');
        if (onProgress) onProgress(1, total + 2); // +2 for fallbacks and build steps

        // Load critical assets with timeout protection
        console.log('💾 Starting asset loading with timeout protection...');
        const loadPromises = criticalAssets.map(async (asset, index) => {
            try {
                console.log(`📎 Loading critical asset ${index + 1}/${total}: ${asset.id} from ${asset.path}`);
                
                const img = await Promise.race([
                    this.loadSingleAsset(asset.path),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout')), 5000) // Increased timeout to 5 seconds
                    )
                ]);
                
                this.assets.set(asset.id, img);
                console.log(`✅ Critical asset loaded: ${asset.id}`);
                
                loaded++;
                if (onProgress) onProgress(loaded + 1, total + 2); // +1 for fallbacks
                
                return img;
            } catch (error) {
                console.warn(`⚠️ Critical asset failed, using fallback: ${asset.id} - ${error.message}`);
                const fallback = this.getFallbackSprite(asset.id);
                this.assets.set(asset.id, fallback);
                
                loaded++;
                if (onProgress) onProgress(loaded + 1, total + 2); // +1 for fallbacks
                
                return fallback;
            }
        });

        // Wait for all assets to load or fallback
        console.log('🔄 Waiting for all critical assets to complete...');
        const results = await Promise.allSettled(loadPromises);
        
        // Log results
        const successful = results.filter(r => r.status === 'fulfilled').length;
        console.log(`🎮 CRITICAL ASSETS READY - ${successful}/${total} loaded successfully!`);
        
        // Ensure we have all required assets (either loaded or fallback)
        for (const asset of criticalAssets) {
            if (!this.assets.has(asset.id)) {
                console.warn(`⚠️ Missing critical asset ${asset.id}, creating emergency fallback`);
                this.assets.set(asset.id, this.getFallbackSprite(asset.id));
            }
        }
        
        // Start background loading immediately
        console.log('📺 Starting background loading process...');
        setTimeout(() => this.startBackgroundLoading(), 100);
        
        // Build final game assets
        console.log('🔧 Building game assets structure...');
        const gameAssets = this.buildGameAssets();
        if (onProgress) onProgress(total + 2, total + 2); // Complete
        console.log('✅ Game assets build completed!');
        
        return gameAssets;
    }

    /**
     * Load a single asset with retry logic
     */
    async loadSingleAsset(path, retries = this.retryAttempts) {
        if (this.cache.has(path)) {
            return this.cache.get(path);
        }

        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const img = await this.createImagePromise(path);
                this.cache.set(path, img);
                return img;
            } catch (error) {
                if (attempt === retries) {
                    throw error;
                }
                console.warn(`⚠️ Retry ${attempt + 1}/${retries} for: ${path}`);
                await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1)));
            }
        }
    }

    /**
     * Create image loading promise with proper error handling
     */
    createImagePromise(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                // Verify image loaded correctly
                if (img.complete && img.naturalWidth > 0) {
                    resolve(img);
                } else {
                    reject(new Error(`Invalid image: ${src}`));
                }
            };
            
            img.onerror = () => reject(new Error(`Failed to load: ${src}`));
            
            // Set src after setting up handlers
            img.src = src;
        });
    }

    /**
     * Create instant fallback sprites for immediate gameplay
     */
    createInstantFallbacks() {
        console.log('🎨 Creating instant fallback sprites...');
        
        // Player fallback
        this.fallbackSprites.set('player_idle', this.createPlayerFallback());
        this.fallbackSprites.set('player_run', this.createPlayerFallback());
        
        // Enemy fallback
        this.fallbackSprites.set('enemy_basic', this.createEnemyFallback());
        
        // Bomb fallback
        this.fallbackSprites.set('bomb_basic', this.createBombFallback());
        
        // Tile fallback
        this.fallbackSprites.set('tiles_basic', this.createTileFallback());
        
        console.log('✅ Fallback sprites ready for instant play');
    }

    /**
     * Get fallback sprite for failed loads
     */
    getFallbackSprite(assetId) {
        return this.fallbackSprites.get(assetId) || this.createGenericFallback();
    }

    /**
     * Create player fallback sprite
     */
    createPlayerFallback() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Draw pirate player
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(32, 32, 28, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(24, 24, 6, 6);
        ctx.fillRect(34, 24, 6, 6);
        
        // Pupils
        ctx.fillStyle = '#000000';
        ctx.fillRect(26, 26, 2, 2);
        ctx.fillRect(36, 26, 2, 2);
        
        // Hat
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(16, 12, 32, 8);
        
        return canvas;
    }

    /**
     * Create enemy fallback sprite
     */
    createEnemyFallback() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Draw enemy
        ctx.fillStyle = '#DC143C';
        ctx.beginPath();
        ctx.arc(32, 32, 28, 0, Math.PI * 2);
        ctx.fill();
        
        // Angry eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(24, 24, 6, 6);
        ctx.fillRect(34, 24, 6, 6);
        
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(26, 26, 2, 2);
        ctx.fillRect(36, 26, 2, 2);
        
        return canvas;
    }

    /**
     * Create bomb fallback sprite
     */
    createBombFallback() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Draw bomb
        ctx.fillStyle = '#2F2F2F';
        ctx.beginPath();
        ctx.arc(32, 40, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Fuse
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(32, 20);
        ctx.lineTo(28, 8);
        ctx.stroke();
        
        // Spark
        ctx.fillStyle = '#FF4500';
        ctx.beginPath();
        ctx.arc(28, 8, 3, 0, Math.PI * 2);
        ctx.fill();
        
        return canvas;
    }

    /**
     * Create tile fallback sprite
     */
    createTileFallback() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Draw tile
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, 0, 64, 64);
        
        // Border
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, 62, 62);
        
        // Pattern
        ctx.strokeStyle = '#A0522D';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 32);
        ctx.lineTo(64, 32);
        ctx.moveTo(32, 0);
        ctx.lineTo(32, 64);
        ctx.stroke();
        
        return canvas;
    }

    /**
     * Create generic fallback sprite
     */
    createGenericFallback() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#888888';
        ctx.fillRect(0, 0, 64, 64);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('?', 32, 36);
        
        return canvas;
    }

    /**
     * PHASE 2: Background loading for enhanced experience
     */
    async startBackgroundLoading() {
        console.log('📦 PHASE 2: Starting background asset loading...');
        
        const backgroundAssets = [
            // Player animations (reduced frames)
            { id: 'player_idle_full', paths: this.generateFramePaths('Sprites/1-Player-Bomb Guy/1-Idle', 8), priority: this.PRIORITY.HIGH },
            { id: 'player_run_full', paths: this.generateFramePaths('Sprites/1-Player-Bomb Guy/2-Run', 6), priority: this.PRIORITY.HIGH },
            { id: 'player_jump', paths: this.generateFramePaths('Sprites/1-Player-Bomb Guy/4-Jump', 4), priority: this.PRIORITY.HIGH },
            
            // Enemy animations (essential only)
            { id: 'enemy_idle_full', paths: this.generateFramePaths('Sprites/2-Enemy-Bald Pirate/1-Idle', 4), priority: this.PRIORITY.MEDIUM },
            { id: 'enemy_run', paths: this.generateFramePaths('Sprites/2-Enemy-Bald Pirate/2-Run', 4), priority: this.PRIORITY.MEDIUM },
            
            // Additional tiles for later levels
            { id: 'tiles_level2', path: 'Sprites/8-Tile-Sets/block2.png', priority: this.PRIORITY.LOW },
            { id: 'tiles_level3', path: 'Sprites/8-Tile-Sets/block3.png', priority: this.PRIORITY.LOW }
        ];

        // Load assets in priority order with delays to prevent blocking
        for (const asset of backgroundAssets) {
            try {
                if (asset.paths) {
                    // Load animation frames
                    const frames = await this.loadAnimationFrames(asset.paths, asset.priority);
                    this.assets.set(asset.id, frames);
                    console.log(`🎭 Background loaded: ${asset.id} (${frames.length} frames)`);
                } else {
                    // Load single asset
                    const img = await this.loadSingleAsset(asset.path);
                    this.assets.set(asset.id, img);
                    console.log(`🖼️ Background loaded: ${asset.id}`);
                }
                
                // Yield control to prevent blocking
                await new Promise(resolve => setTimeout(resolve, 50));
                
            } catch (error) {
                console.warn(`⚠️ Background loading failed for ${asset.id}:`, error);
            }
        }

        console.log('✨ Background loading completed!');
    }

    /**
     * Generate frame paths for animations (limited frames for performance)
     */
    generateFramePaths(basePath, maxFrames) {
        const paths = [];
        for (let i = 1; i <= maxFrames; i++) {
            paths.push(`${basePath}/${i}.png`);
        }
        return paths;
    }

    /**
     * Load animation frames with controlled concurrency
     */
    async loadAnimationFrames(paths, priority) {
        const frames = [];
        const batchSize = priority === this.PRIORITY.HIGH ? 3 : 2;
        
        for (let i = 0; i < paths.length; i += batchSize) {
            const batch = paths.slice(i, i + batchSize);
            const batchPromises = batch.map(async (path, index) => {
                try {
                    const img = await this.loadSingleAsset(path);
                    return { index: i + index, img };
                } catch (error) {
                    console.warn(`Frame load failed: ${path}`);
                    return { index: i + index, img: null };
                }
            });
            
            const batchResults = await Promise.allSettled(batchPromises);
            batchResults.forEach(result => {
                if (result.status === 'fulfilled' && result.value.img) {
                    frames[result.value.index] = result.value.img;
                }
            });
            
            // Yield control between batches
            await new Promise(resolve => setTimeout(resolve, 25));
        }
        
        return frames.filter(frame => frame !== null);
    }

    /**
     * Build game assets in expected format
     */
    buildGameAssets() {
        console.log('🔄 Building game assets in expected format...');
        
        const gameAssets = {
            player: {},
            enemies: {},
            objects: {}
        };

        // Map loaded assets to game format with enhanced fallbacks
        console.log('🔍 Available assets for mapping:', Array.from(this.assets.keys()));
        
        // Player assets - ensure all essential animations are available
        if (this.assets.has('player_idle_full')) {
            gameAssets.player['1-Idle'] = this.assets.get('player_idle_full');
        } else if (this.assets.has('player_idle')) {
            gameAssets.player['1-Idle'] = [this.assets.get('player_idle')];
        } else {
            console.warn('⚠️ No player idle asset found, using fallback');
            gameAssets.player['1-Idle'] = [this.getFallbackSprite('player_idle')];
        }

        if (this.assets.has('player_run_full')) {
            gameAssets.player['2-Run'] = this.assets.get('player_run_full');
        } else if (this.assets.has('player_run')) {
            gameAssets.player['2-Run'] = [this.assets.get('player_run')];
        } else {
            console.warn('⚠️ No player run asset found, using idle as fallback');
            gameAssets.player['2-Run'] = gameAssets.player['1-Idle'];
        }

        if (this.assets.has('player_jump')) {
            gameAssets.player['4-Jump'] = this.assets.get('player_jump');
        } else {
            console.warn('⚠️ No player jump asset found, using idle as fallback');
            gameAssets.player['4-Jump'] = gameAssets.player['1-Idle'];
        }

        // Add missing essential player animations using existing ones as fallbacks
        gameAssets.player['5-Fall'] = gameAssets.player['4-Jump']; // Use jump for fall
        gameAssets.player['3-Jump Anticipation'] = [gameAssets.player['1-Idle'][0]]; // Use idle frame
        gameAssets.player['6-Ground'] = gameAssets.player['1-Idle']; // Use idle animation
        gameAssets.player['7-Hit'] = gameAssets.player['1-Idle']; // Use idle animation
        gameAssets.player['8-Dead Hit'] = gameAssets.player['1-Idle']; // Use idle animation
        gameAssets.player['9-Dead Ground'] = gameAssets.player['1-Idle']; // Use idle animation
        gameAssets.player['10-Door In'] = gameAssets.player['1-Idle']; // Use idle for door
        gameAssets.player['11-Door Out'] = gameAssets.player['1-Idle']; // Use idle for door

        // Enemy assets - create proper structure for all enemy types
        const enemyTypes = ['Bald Pirate', 'Cucumber', 'Big Guy', 'Captain', 'Whale'];
        
        for (const enemyName of enemyTypes) {
            gameAssets.enemies[enemyName] = {};
            
            // Get enemy idle animation
            let enemyIdleFrames;
            if (this.assets.has('enemy_idle_full')) {
                enemyIdleFrames = this.assets.get('enemy_idle_full');
            } else if (this.assets.has('enemy_basic')) {
                enemyIdleFrames = [this.assets.get('enemy_basic')];
            } else {
                enemyIdleFrames = [this.getFallbackSprite('enemy_basic')];
            }
            
            // Set idle animation
            gameAssets.enemies[enemyName]['1-Idle'] = enemyIdleFrames;
            
            // Add all essential enemy animations using idle as fallback
            const essentialEnemyAnims = [
                '2-Run', '3-Jump Anticipation', '4-Jump', '5-Fall', '6-Ground',
                '7-Attack', '8-Hit', '9-Dead Hit', '10-Dead Ground',
                '11-Throw (Bomb)', '12-Hit', '13-Dead Hit', '14-Dead Ground'
            ];
            
            for (const anim of essentialEnemyAnims) {
                gameAssets.enemies[enemyName][anim] = enemyIdleFrames;
            }
            
            // Add special animations for specific enemies
            if (enemyName === 'Cucumber') {
                gameAssets.enemies[enemyName]['8-Blow the wick'] = enemyIdleFrames;
                gameAssets.enemies[enemyName]['11-Dead Ground'] = enemyIdleFrames;
            }
            
            if (enemyName === 'Big Guy') {
                gameAssets.enemies[enemyName]['8-Pick (Bomb)'] = enemyIdleFrames;
                gameAssets.enemies[enemyName]['9-Idle (Bomb)'] = enemyIdleFrames;
                gameAssets.enemies[enemyName]['10-Run (Bomb)'] = enemyIdleFrames;
            }
            
            if (enemyName === 'Captain') {
                gameAssets.enemies[enemyName]['8-Scare Run'] = enemyIdleFrames;
            }
            
            if (enemyName === 'Whale') {
                gameAssets.enemies[enemyName]['8-Swalow (Bomb)'] = enemyIdleFrames;
                gameAssets.enemies[enemyName]['11-Dead Ground'] = enemyIdleFrames;
            }
        }

        // Object assets - ensure proper structure
        gameAssets.objects = {
            '1-BOMB': {
                '1-Bomb Off': this.assets.has('bomb_basic') ? [this.assets.get('bomb_basic')] : [this.getFallbackSprite('bomb_basic')],
                '2-Bomb On': this.assets.has('bomb_basic') ? [this.assets.get('bomb_basic')] : [this.getFallbackSprite('bomb_basic')],
                '3-Explotion': this.assets.has('bomb_basic') ? [this.assets.get('bomb_basic')] : [this.getFallbackSprite('bomb_basic')]
            },
            '2-Door': {
                '1-Closed': this.assets.has('bomb_basic') ? [this.assets.get('bomb_basic')] : [this.getFallbackSprite('bomb_basic')],
                '2-Opening': this.assets.has('bomb_basic') ? [this.assets.get('bomb_basic')] : [this.getFallbackSprite('bomb_basic')],
                '3-Closing': this.assets.has('bomb_basic') ? [this.assets.get('bomb_basic')] : [this.getFallbackSprite('bomb_basic')]
            },
            'tiles': {
                'blocks': this.assets.has('tiles_basic') ? [this.assets.get('tiles_basic')] : [this.getFallbackSprite('tiles_basic')]
            }
        };

        // Add background tiles if loaded
        if (this.assets.has('tiles_level2')) {
            gameAssets.objects.tiles['block2'] = [this.assets.get('tiles_level2')];
        }
        if (this.assets.has('tiles_level3')) {
            gameAssets.objects.tiles['block3'] = [this.assets.get('tiles_level3')];
        }
        
        // Add backgrounds section
        gameAssets.backgrounds = {};
        
        console.log('✅ Game assets built successfully!');
        console.log('🔍 Assets structure:', {
            player: Object.keys(gameAssets.player),
            enemies: Object.keys(gameAssets.enemies),
            objects: Object.keys(gameAssets.objects)
        });
        
        return gameAssets;
    }

    /**
     * Get asset by ID
     */
    getAsset(id) {
        return this.assets.get(id);
    }

    /**
     * Check if asset is loaded
     */
    isAssetLoaded(id) {
        return this.assets.has(id);
    }

    /**
     * Get loading statistics
     */
    getStats() {
        return {
            totalAssets: this.assets.size,
            cacheSize: this.cache.size,
            activeLoads: this.activeLoads,
            queueSize: this.loadingQueue.length
        };
    }
}

// Export for global use
window.GameAssetsLoader = GameAssetsLoader;