/*
🏴‍☠️ HYBRID PIRATE BOMB LOADER - REAL SPRITES + FAST LOADING
Combines fast loading with actual pirate game assets
*/

class HybridPirateLoader {
    constructor() {
        this.assets = {
            player: {},
            enemies: {},
            objects: {},
            backgrounds: {}
        };
        this.loadedImages = new Map();
        this.fallbackUsed = false;
    }

    // Load essential REAL pirate sprites quickly
    async loadAll(onProgress) {
        console.log('🏴‍☠️ HYBRID LOADER: Loading real pirate sprites with fast fallbacks...');
        
        const essentialSprites = [
            // Player sprites - REAL pirate animations
            { id: 'player_idle', path: 'Sprites/1-Player-Bomb Guy/1-Idle/1.png', category: 'player', anim: '1-Idle' },
            { id: 'player_run1', path: 'Sprites/1-Player-Bomb Guy/2-Run/1.png', category: 'player', anim: '2-Run' },
            { id: 'player_run2', path: 'Sprites/1-Player-Bomb Guy/2-Run/2.png', category: 'player', anim: '2-Run' },
            { id: 'player_jump', path: 'Sprites/1-Player-Bomb Guy/4-Jump/1.png', category: 'player', anim: '4-Jump' },
            
            // Enemy sprites - REAL pirate enemies
            { id: 'enemy_pirate', path: 'Sprites/2-Enemy-Bald Pirate/1-Idle/1.png', category: 'enemies', enemy: 'Bald Pirate', anim: '1-Idle' },
            { id: 'enemy_cucumber', path: 'Sprites/3-Enemy-Cucumber/1-Idle/1.png', category: 'enemies', enemy: 'Cucumber', anim: '1-Idle' },
            
            // Objects - REAL bomb and tiles
            { id: 'bomb_off', path: 'Sprites/7-Objects/1-BOMB/1-Bomb Off/1.png', category: 'objects', obj: '1-BOMB', anim: '1-Bomb Off' },
            { id: 'tiles_blocks', path: 'Sprites/8-Tile-Sets/blocks.png', category: 'tiles', type: 'blocks' }
        ];

        let loaded = 0;
        const total = essentialSprites.length;
        
        // Load sprites with 3-second timeout per sprite
        const loadPromises = essentialSprites.map(async (sprite) => {
            try {
                console.log(`🏴‍☠️ Loading real sprite: ${sprite.path}`);
                
                const img = await Promise.race([
                    this.loadImageWithRetry(sprite.path),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
                ]);
                
                this.storeSprite(sprite, img);
                loaded++;
                if (onProgress) onProgress(loaded, total);
                console.log(`✅ Real sprite loaded: ${sprite.id}`);
                
                return { success: true, sprite };
                
            } catch (error) {
                console.warn(`⚠️ Real sprite failed, using enhanced fallback: ${sprite.id}`);
                this.createEnhancedFallback(sprite);
                loaded++;
                if (onProgress) onProgress(loaded, total);
                return { success: false, sprite };
            }
        });

        const results = await Promise.allSettled(loadPromises);
        
        // Build complete game assets structure
        this.buildCompleteAssets();
        
        const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
        console.log(`🏴‍☠️ HYBRID LOADING COMPLETE: ${successful}/${total} real sprites loaded`);
        
        return this.assets;
    }

    async loadImageWithRetry(src, retries = 2) {
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                return await this.createImagePromise(src);
            } catch (error) {
                if (attempt === retries) throw error;
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
    }

    createImagePromise(src) {
        if (this.loadedImages.has(src)) {
            return Promise.resolve(this.loadedImages.get(src));
        }

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                if (img.complete && img.naturalWidth > 0) {
                    this.loadedImages.set(src, img);
                    resolve(img);
                } else {
                    reject(new Error(`Invalid image: ${src}`));
                }
            };
            
            img.onerror = () => reject(new Error(`Failed to load: ${src}`));
            img.src = src;
        });
    }

    storeSprite(sprite, img) {
        switch (sprite.category) {
            case 'player':
                if (!this.assets.player[sprite.anim]) this.assets.player[sprite.anim] = [];
                this.assets.player[sprite.anim].push(img);
                break;
                
            case 'enemies':
                if (!this.assets.enemies[sprite.enemy]) this.assets.enemies[sprite.enemy] = {};
                if (!this.assets.enemies[sprite.enemy][sprite.anim]) this.assets.enemies[sprite.enemy][sprite.anim] = [];
                this.assets.enemies[sprite.enemy][sprite.anim].push(img);
                break;
                
            case 'objects':
                if (!this.assets.objects[sprite.obj]) this.assets.objects[sprite.obj] = {};
                if (!this.assets.objects[sprite.obj][sprite.anim]) this.assets.objects[sprite.obj][sprite.anim] = [];
                this.assets.objects[sprite.obj][sprite.anim].push(img);
                break;
                
            case 'tiles':
                if (!this.assets.objects['tiles']) this.assets.objects['tiles'] = {};
                this.assets.objects['tiles'][sprite.type] = [img];
                break;
        }
    }

    createEnhancedFallback(sprite) {
        this.fallbackUsed = true;
        
        // Create pirate-themed fallbacks (not basic blocks)
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        switch (sprite.category) {
            case 'player':
                this.drawPirateFallback(ctx, '#228B22', '🏴‍☠️');
                break;
            case 'enemies':
                this.drawPirateFallback(ctx, '#DC143C', '☠️');
                break;
            case 'objects':
                if (sprite.obj === '1-BOMB') {
                    this.drawBombFallback(ctx);
                }
                break;
            case 'tiles':
                this.drawTileFallback(ctx);
                break;
        }

        this.storeSprite(sprite, canvas);
    }

    drawPirateFallback(ctx, color, emoji) {
        // Pirate character shape
        ctx.fillStyle = color;
        ctx.fillRect(16, 16, 32, 48);
        
        // Head
        ctx.fillStyle = '#FDBCB4';
        ctx.fillRect(20, 16, 24, 20);
        
        // Hat
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(18, 12, 28, 8);
        
        // Eyes
        ctx.fillStyle = '#000000';
        ctx.fillRect(24, 22, 4, 4);
        ctx.fillRect(36, 22, 4, 4);
        
        // Shirt
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(20, 36, 24, 28);
        
        // Emoji overlay
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(emoji, 32, 32);
    }

    drawBombFallback(ctx) {
        // Bomb body
        ctx.fillStyle = '#2F2F2F';
        ctx.beginPath();
        ctx.arc(32, 40, 18, 0, Math.PI * 2);
        ctx.fill();
        
        // Fuse
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(32, 22);
        ctx.lineTo(28, 10);
        ctx.stroke();
        
        // Spark
        ctx.fillStyle = '#FF4500';
        ctx.beginPath();
        ctx.arc(28, 10, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Bomb emoji
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('💣', 32, 45);
    }

    drawTileFallback(ctx) {
        // Stone/brick pattern
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(0, 0, 64, 64);
        
        // Brick lines
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 32);
        ctx.lineTo(64, 32);
        ctx.moveTo(32, 0);
        ctx.lineTo(32, 32);
        ctx.moveTo(16, 32);
        ctx.lineTo(16, 64);
        ctx.moveTo(48, 32);
        ctx.lineTo(48, 64);
        ctx.stroke();
    }

    buildCompleteAssets() {
        // Ensure all required animations exist
        const requiredPlayerAnims = ['1-Idle', '2-Run', '3-Jump Anticipation', '4-Jump', '5-Fall', '6-Ground', '7-Hit', '8-Dead Hit', '9-Dead Ground', '10-Door In', '11-Door Out'];
        
        for (const anim of requiredPlayerAnims) {
            if (!this.assets.player[anim] || this.assets.player[anim].length === 0) {
                // Use idle animation as fallback
                this.assets.player[anim] = this.assets.player['1-Idle'] || [this.createGenericSprite('#228B22', '🏴‍☠️')];
            }
        }

        // Ensure all enemy types exist
        const enemyTypes = ['Bald Pirate', 'Cucumber', 'Big Guy', 'Captain', 'Whale'];
        const enemyAnims = ['1-Idle', '2-Run', '7-Attack', '8-Hit', '9-Dead Hit', '10-Dead Ground'];
        
        for (const enemyType of enemyTypes) {
            if (!this.assets.enemies[enemyType]) {
                this.assets.enemies[enemyType] = {};
            }
            
            for (const anim of enemyAnims) {
                if (!this.assets.enemies[enemyType][anim]) {
                    this.assets.enemies[enemyType][anim] = [this.createGenericSprite('#DC143C', '☠️')];
                }
            }
        }

        // Ensure objects exist
        if (!this.assets.objects['1-BOMB']) {
            this.assets.objects['1-BOMB'] = {
                '1-Bomb Off': [this.createGenericSprite('#2F2F2F', '💣')],
                '2-Bomb On': [this.createGenericSprite('#FF4500', '💥')],
                '3-Explotion': [this.createGenericSprite('#FF6347', '💥')]
            };
        }

        if (!this.assets.objects['2-Door']) {
            this.assets.objects['2-Door'] = {
                '1-Closed': [this.createGenericSprite('#8B4513', '🚪')],
                '2-Opening': [this.createGenericSprite('#CD853F', '🚪')],
                '3-Closing': [this.createGenericSprite('#8B4513', '🚪')]
            };
        }

        if (!this.assets.objects['tiles']) {
            this.assets.objects['tiles'] = {
                'blocks': [this.createGenericSprite('#8B7355', '🧱')]
            };
        }

        console.log('🏴‍☠️ Complete asset structure built with pirate theme');
    }

    createGenericSprite(color, emoji) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 64, 64);
        
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, 62, 62);
        
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, 32, 32);
        
        return canvas;
    }
}

// Replace OptimizedAssetLoader with HybridPirateLoader - ONLY if not already defined
if (typeof OptimizedAssetLoader === 'undefined') {
    class OptimizedAssetLoader extends HybridPirateLoader {
        constructor() {
            super();
            console.log('🏴‍☠️ Hybrid Pirate Loader initialized (replacing OptimizedAssetLoader)');
        }
    }
} else {
    console.log('🏴‍☠️ OptimizedAssetLoader already exists, using HybridPirateLoader directly');
    // Replace the existing loader methods
    OptimizedAssetLoader.prototype.loadAll = HybridPirateLoader.prototype.loadAll;
    OptimizedAssetLoader.prototype.loadImageWithRetry = HybridPirateLoader.prototype.loadImageWithRetry;
    OptimizedAssetLoader.prototype.createImagePromise = HybridPirateLoader.prototype.createImagePromise;
    OptimizedAssetLoader.prototype.storeSprite = HybridPirateLoader.prototype.storeSprite;
    OptimizedAssetLoader.prototype.createEnhancedFallback = HybridPirateLoader.prototype.createEnhancedFallback;
    OptimizedAssetLoader.prototype.drawPirateFallback = HybridPirateLoader.prototype.drawPirateFallback;
    OptimizedAssetLoader.prototype.drawBombFallback = HybridPirateLoader.prototype.drawBombFallback;
    OptimizedAssetLoader.prototype.drawTileFallback = HybridPirateLoader.prototype.drawTileFallback;
    OptimizedAssetLoader.prototype.buildCompleteAssets = HybridPirateLoader.prototype.buildCompleteAssets;
    OptimizedAssetLoader.prototype.createGenericSprite = HybridPirateLoader.prototype.createGenericSprite;
    console.log('🏴‍☠️ OptimizedAssetLoader enhanced with pirate loading capabilities');
}

console.log('🏴‍☠️ Hybrid Pirate Loader ready - real sprites with fast fallbacks!');