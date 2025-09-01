/*
SIMPLIFIED KABOOM GAME - FOCUSED ON RELIABLE LOADING
- Minimal asset loading with proper error handling
- Fast startup with critical assets only
- Robust fallbacks for all failure points
*/

console.log('🎮 Starting Simplified Kaboom Game...');

// ---------------------------
// Minimal Asset Loader
// ---------------------------
class SimpleAssetLoader {
    constructor() {
        this.assets = {
            player: {},
            enemies: {},
            objects: {},
            backgrounds: {}
        };
        this.timeoutDuration = 5000; // 5 second timeout
    }

    // Load image with proper error handling and timeout
    loadImage(src) {
        return new Promise((resolve, reject) => {
            // Add timeout protection
            const timeout = setTimeout(() => {
                console.warn(`⏰ Timeout loading image: ${src}`);
                reject(new Error(`Timeout loading image: ${src}`));
            }, this.timeoutDuration);
            
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                clearTimeout(timeout);
                // Verify image loaded correctly
                if (img.complete && img.naturalWidth > 0) {
                    console.log(`✅ Loaded: ${src}`);
                    resolve(img);
                } else {
                    console.warn(`⚠️ Invalid image loaded: ${src}`);
                    reject(new Error(`Invalid image: ${src}`));
                }
            };
            
            img.onerror = (error) => {
                clearTimeout(timeout);
                console.warn(`❌ Failed to load: ${src}`, error);
                reject(new Error(`Failed to load image: ${src}`));
            };
            
            img.src = src;
        });
    }

    // Load critical assets only
    async loadCriticalAssets(onProgress) {
        console.log('🚀 Loading critical assets...');
        
        const criticalAssets = [
            { id: 'player_idle', path: 'Sprites/1-Player-Bomb Guy/1-Idle/1.png' },
            { id: 'player_run', path: 'Sprites/1-Player-Bomb Guy/2-Run/1.png' },
            { id: 'enemy_basic', path: 'Sprites/2-Enemy-Bald Pirate/1-Idle/1.png' },
            { id: 'bomb_basic', path: 'Sprites/7-Objects/1-BOMB/1-Bomb Off/1.png' },
            { id: 'tiles_basic', path: 'Sprites/8-Tile-Sets/blocks.png' }
        ];

        let loaded = 0;
        const total = criticalAssets.length;

        // Create fallback sprites immediately
        this.createFallbackSprites();

        // Load critical assets with timeout protection
        for (const asset of criticalAssets) {
            try {
                const img = await Promise.race([
                    this.loadImage(asset.path),
                    new Promise((_, reject) => {
                        setTimeout(() => {
                            console.warn(`⏰ Timeout loading critical asset: ${asset.id} (${asset.path})`);
                            reject(new Error(`Timeout loading ${asset.id}`));
                        }, this.timeoutDuration);
                    })
                ]);
                
                this.assets.player['1-Idle'] = [img];
                console.log(`✅ Critical asset loaded: ${asset.id}`);
                
                loaded++;
                if (onProgress) {
                    try {
                        onProgress(loaded, total);
                    } catch (progressError) {
                        console.warn('⚠️ Progress callback error:', progressError);
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Critical asset failed, using fallback: ${asset.id}`, error.message);
                loaded++;
                if (onProgress) {
                    try {
                        onProgress(loaded, total);
                    } catch (progressError) {
                        console.warn('⚠️ Progress callback error:', progressError);
                    }
                }
            }
        }
        
        console.log('🎮 CRITICAL ASSETS READY - Game can start!');
        console.log(`📊 Loaded ${loaded}/${total} critical assets`);
        
        return this.assets;
    }

    // Create fallback sprites for error handling
    createFallbackSprites() {
        console.log('🎨 Creating fallback sprites...');
        
        // Create a simple colored canvas as fallback
        const createFallbackAsset = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#CCCCCC';
            ctx.fillRect(0, 0, 64, 64);
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, 64, 64);
            return canvas;
        };
        
        // Create player fallback sprites
        this.assets.player = {
            '1-Idle': [createFallbackAsset()],
            '2-Run': [createFallbackAsset()]
        };
        
        // Create enemy fallback sprites
        this.assets.enemies = {
            'Bald Pirate': {
                '1-Idle': [createFallbackAsset()]
            }
        };
        
        // Create object fallback sprites
        this.assets.objects = {
            '1-BOMB': {
                '1-Bomb Off': [createFallbackAsset()]
            },
            'tiles': {
                'blocks': [createFallbackAsset()]
            }
        };
        
        console.log('✅ Fallback sprites created successfully');
    }
}

// ---------------------------
// Simplified Game Core
// ---------------------------
class SimplePirateBombGame {
    constructor() {
        console.log('🎮 Initializing Simplified Pirate Bomb Game...');
        
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            console.error('❌ Canvas element not found!');
            throw new Error('Canvas element not found! Make sure the HTML has <canvas id="gameCanvas">');
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Performance optimizations
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.imageSmoothingQuality = 'low';

        this.assets = null;
        this.gameState = {
            currentScore: 0,
            totalScore: 0,
            level: 1,
            lives: 3,
            gameOver: false,
            paused: false
        };

        this.player = null;
        this.enemies = [];
        this.bombs = [];
        this.platforms = [];
        this.camera = { x: 0, y: 0 };
        this.keys = {};
        this.lastTime = 0;

        console.log('✅ Simplified Pirate Bomb Game initialized');
    }

    async boot() {
        try {
            console.log('🚀 Booting simplified game...');
            
            // Add timeout protection for the entire boot process
            const bootTimeout = setTimeout(() => {
                console.error('❌ Game boot timeout - took longer than 30 seconds');
                this.showBootError('Game boot timeout - took longer than 30 seconds');
            }, 30000); // 30 second timeout
            
            // Show loading screen
            this.showLoadingScreen('Initializing game...');
            
            // Load critical assets
            this.showLoadingScreen('Loading critical assets...');
            const loader = new SimpleAssetLoader();
            
            this.assets = await loader.loadCriticalAssets((loaded, total) => {
                // Update loading progress UI
                try {
                    const loadingFill = document.getElementById('loadingFill');
                    const loadingText = document.getElementById('loadingText');
                    if (loadingFill) {
                        const progress = (loaded / total) * 100;
                        loadingFill.style.width = progress + '%';
                    }
                    if (loadingText) {
                        loadingText.textContent = `⚡ Loading critical assets... ${loaded}/${total}`;
                    }
                } catch (uiError) {
                    console.warn('⚠️ Loading UI update failed:', uiError);
                }
            });
            
            // Clear boot timeout
            clearTimeout(bootTimeout);
            
            // Update UI to show 100% completion
            try {
                const loadingFill = document.getElementById('loadingFill');
                const loadingText = document.getElementById('loadingText');
                if (loadingFill) {
                    loadingFill.style.width = '100%';
                }
                if (loadingText) {
                    loadingText.textContent = '✅ Loading complete!';
                }
            } catch (uiError) {
                console.warn('⚠️ Final loading UI update failed:', uiError);
            }
            
            // Small delay to show completion
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Hide loading screen and show game
            this.hideLoadingScreen();
            this.showGame();
            
            // Start game loop
            this.startGameLoop();
            
            console.log('✅ Simplified game booted successfully!');
            
        } catch (error) {
            console.error('❌ Game boot failed:', error);
            this.showBootError('Game failed to start: ' + error.message);
        }
    }

    showLoadingScreen(message) {
        try {
            const loadingScreen = document.getElementById('loadingScreen');
            const loadingText = document.getElementById('loadingText');
            if (loadingScreen) {
                loadingScreen.style.display = 'flex';
            }
            if (loadingText) {
                loadingText.textContent = message || '⚡ Initializing game...';
            }
        } catch (error) {
            console.warn('⚠️ Failed to show loading screen:', error);
        }
    }

    hideLoadingScreen() {
        try {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
        } catch (error) {
            console.warn('⚠️ Failed to hide loading screen:', error);
        }
    }

    showGame() {
        try {
            // Hide welcome menu
            const welcomeMenu = document.getElementById('welcomeMenu');
            if (welcomeMenu) {
                welcomeMenu.style.display = 'none';
            }
            
            // Show canvas
            if (this.canvas) {
                this.canvas.style.display = 'block';
            }
            
            console.log('🎮 Game is now visible');
        } catch (error) {
            console.warn('⚠️ Failed to show game:', error);
        }
    }

    showBootError(message) {
        try {
            // Hide loading screen
            this.hideLoadingScreen();
            
            // Show error on canvas
            if (this.ctx && this.canvas) {
                this.ctx.fillStyle = '#1a1a2e';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                this.ctx.textAlign = 'center';
                this.ctx.fillStyle = '#ff6b6b';
                this.ctx.font = 'bold 24px Arial';
                this.ctx.fillText('Game Loading Error', this.canvas.width / 2, this.canvas.height / 2 - 40);
                
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '16px Arial';
                this.ctx.fillText(message, this.canvas.width / 2, this.canvas.height / 2);
                
                this.ctx.fillStyle = '#4fc3f7';
                this.ctx.font = '14px Arial';
                this.ctx.fillText('Please refresh the page (F5)', this.canvas.width / 2, this.canvas.height / 2 + 40);
            }
            
            // Show welcome menu again
            const welcomeMenu = document.getElementById('welcomeMenu');
            if (welcomeMenu) {
                welcomeMenu.style.display = 'block';
            }
            
            console.error('🚨 Game boot error displayed:', message);
        } catch (error) {
            console.error('❌ Failed to display boot error:', error);
        }
    }

    startGameLoop() {
        console.log('🎮 Starting game loop...');
        this.lastTime = performance.now();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    gameLoop(currentTime) {
        // Calculate delta time
        const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1); // Cap at 100ms
        this.lastTime = currentTime;
        
        // Clear canvas
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw simple placeholder
        if (this.assets && this.assets.player && this.assets.player['1-Idle']) {
            const playerSprite = this.assets.player['1-Idle'][0];
            this.ctx.drawImage(playerSprite, 100, 100, 64, 64);
        } else {
            // Draw fallback player
            this.ctx.fillStyle = '#228B22';
            this.ctx.fillRect(100, 100, 64, 64);
        }
        
        // Draw UI
        this.ctx.fillStyle = '#4682B4';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Simplified Kaboom', 20, 40);
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Game is running with minimal assets', 20, 70);
        this.ctx.fillText('Press any key to test input', 20, 100);
        
        // Continue game loop
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    // Setup input handling
    setupInput() {
        // Keyboard input
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            console.log('🎮 Key pressed:', e.code);
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Mobile controls
        const mobileControls = document.querySelectorAll('.control-btn, .dpad-btn');
        mobileControls.forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const key = btn.dataset.key;
                if (key) {
                    this.keys[key] = true;
                    btn.style.transform = 'scale(0.95)';
                    console.log('🎮 Mobile button pressed:', key);
                }
            });
            
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                const key = btn.dataset.key;
                if (key) {
                    this.keys[key] = false;
                    btn.style.transform = '';
                }
            });
        });
        
        console.log('🎮 Input handlers set up');
    }
}

// Make the game class globally available
window.SimplePirateBombGame = SimplePirateBombGame;

// Create simplified startGame function
window.startSimpleGame = async function() {
    console.log('🎮 Starting simplified game...');
    
    try {
        // Hide welcome menu
        const welcomeMenu = document.getElementById('welcomeMenu');
        if (welcomeMenu) {
            welcomeMenu.style.display = 'none';
        }
        
        // Show loading screen
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
        
        // Create and boot game
        const game = new SimplePirateBombGame();
        window.simpleGame = game;
        await game.boot();
        
        console.log('✅ Simplified game started successfully!');
        
    } catch (error) {
        console.error('❌ Failed to start simplified game:', error);
        alert('Failed to start game: ' + error.message);
        
        // Show welcome menu again on error
        const welcomeMenu = document.getElementById('welcomeMenu');
        if (welcomeMenu) {
            welcomeMenu.style.display = 'block';
        }
        
        // Hide loading screen
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }
};

console.log('✅ Simplified game.js loaded successfully');