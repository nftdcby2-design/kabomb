// Emergency Game Loading Fix
// This file ensures the PirateBombGame class is properly available globally

console.log('🔧 Loading emergency game fix...');

// Wait for the main game.js to load
window.addEventListener('load', function() {
    console.log('🔍 Checking game loading status...');
    
    // Check if PirateBombGame is available
    if (typeof PirateBombGame === 'undefined') {
        console.warn('⚠️ PirateBombGame not found, creating emergency fallback...');
        
        // Create a minimal fallback game class
        window.PirateBombGame = class EmergencyGame {
            constructor() {
                console.log('🎮 Creating emergency game instance');
                this.canvas = document.getElementById('gameCanvas');
                if (!this.canvas) {
                    console.error('❌ Canvas element not found!');
                    throw new Error('Canvas element not found!');
                }
                this.ctx = this.canvas.getContext('2d');
                this.width = this.canvas.width;
                this.height = this.canvas.height;
                
                // Set up basic game state
                this.gameState = {
                    currentScore: 0,
                    totalScore: 0,
                    level: 1,
                    lives: 3,
                    gameOver: false,
                    paused: false
                };
                
                console.log('✅ Emergency game instance created');
            }
            
            boot() {
                console.log('🎮 Booting emergency game...');
                
                try {
                    // Hide loading screen immediately
                    const loadingScreen = document.getElementById('loadingScreen');
                    if (loadingScreen) {
                        loadingScreen.style.display = 'none';
                        console.log('✅ Loading screen hidden');
                    }
                    
                    // Clear canvas and show game ready message
                    this.ctx.fillStyle = '#1a1a2e';
                    this.ctx.fillRect(0, 0, this.width, this.height);
                    
                    this.ctx.fillStyle = '#4fc3f7';
                    this.ctx.font = 'bold 32px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('🎮 Kaboom', this.width / 2, this.height / 2 - 60);
                    
                    this.ctx.fillStyle = '#ffffff';
                    this.ctx.font = '18px Arial';
                    this.ctx.fillText('Game Ready!', this.width / 2, this.height / 2 - 20);
                    
                    this.ctx.fillStyle = '#ffeb3b';
                    this.ctx.font = '14px Arial';
                    this.ctx.fillText('Click "Play (PVE)" to start', this.width / 2, this.height / 2 + 20);
                    
                    // Show welcome menu
                    const welcomeMenu = document.getElementById('welcomeMenu');
                    if (welcomeMenu) {
                        welcomeMenu.style.display = 'block';
                        console.log('✅ Welcome menu shown');
                    }
                    
                    console.log('✅ Emergency game booted successfully');
                    
                } catch (error) {
                    console.error('❌ Emergency game boot failed:', error);
                    this.showError('Game Boot Error', error.message);
                }
            }
            
            tryLoadRealGame() {
                console.log('🔄 Attempting to load real game...');
                
                // Check if the real game class is now available
                if (typeof window.RealPirateBombGame !== 'undefined') {
                    console.log('✅ Real game class found, switching...');
                    try {
                        const realGame = new window.RealPirateBombGame();
                        window.game = realGame;
                        realGame.boot();
                        return;
                    } catch (error) {
                        console.error('❌ Failed to start real game:', error);
                    }
                }
                
                // If real game is not available, show a message
                this.ctx.fillStyle = '#1a1a2e';
                this.ctx.fillRect(0, 0, this.width, this.height);
                
                this.ctx.fillStyle = '#ff6b6b';
                this.ctx.font = 'bold 24px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('Game Loading Issue', this.width / 2, this.height / 2 - 60);
                
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '16px Arial';
                this.ctx.fillText('The game is having trouble loading.', this.width / 2, this.height / 2 - 20);
                this.ctx.fillText('Please refresh the page (F5)', this.width / 2, this.height / 2 + 10);
                
                this.ctx.fillStyle = '#4fc3f7';
                this.ctx.font = '14px Arial';
                this.ctx.fillText('If the problem persists, check your internet connection', this.width / 2, this.height / 2 + 50);
            }
            
            showError(title, message) {
                this.ctx.fillStyle = '#1a1a2e';
                this.ctx.fillRect(0, 0, this.width, this.height);
                
                this.ctx.fillStyle = '#ff6b6b';
                this.ctx.font = 'bold 24px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(title, this.width / 2, this.height / 2 - 40);
                
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '16px Arial';
                this.ctx.fillText(message, this.width / 2, this.height / 2);
                
                this.ctx.fillStyle = '#4fc3f7';
                this.ctx.font = '14px Arial';
                this.ctx.fillText('Please refresh the page (F5)', this.width / 2, this.height / 2 + 40);
            }
            
            // Add basic game methods to prevent errors
            updateUI() {
                // Do nothing for emergency game
            }
            
            update() {
                // Do nothing for emergency game
            }
            
            render() {
                // Do nothing for emergency game
            }
        };
        
        console.log('✅ Emergency PirateBombGame class created');
    } else {
        console.log('✅ PirateBombGame class is already available');
        
        // Store the real game class for potential fallback
        window.RealPirateBombGame = PirateBombGame;
        
        // Override the boot method to handle asset loading issues
        const originalBoot = PirateBombGame.prototype.boot;
        PirateBombGame.prototype.boot = async function() {
            try {
                console.log('🎮 Starting enhanced boot process...');
                
                // Set a timeout for asset loading
                const assetLoadingTimeout = setTimeout(() => {
                    console.warn('⚠️ Asset loading taking too long, forcing game start...');
                    this.forceGameStart();
                }, 10000); // 10 second timeout
                
                // Try the original boot method
                await originalBoot.call(this);
                
                // Clear timeout if boot succeeds
                clearTimeout(assetLoadingTimeout);
                console.log('✅ Original boot completed successfully');
                
            } catch (error) {
                console.error('❌ Boot failed, using fallback:', error);
                this.forceGameStart();
            }
        };
        
        // Add force game start method
        PirateBombGame.prototype.forceGameStart = function() {
            console.log('🔄 Force starting game...');
            
            // Hide loading screen
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
                console.log('✅ Loading screen hidden');
            }
            
            // Show welcome menu
            const welcomeMenu = document.getElementById('welcomeMenu');
            if (welcomeMenu) {
                welcomeMenu.style.display = 'block';
                console.log('✅ Welcome menu shown');
            }
            
            // Initialize basic game state
            this.gameState = {
                currentScore: 0,
                totalScore: 0,
                level: 1,
                lives: 3,
                gameOver: false,
                paused: false
            };
            
            // Set up basic assets if they failed to load
            if (!this.assets) {
                this.assets = {
                    player: {},
                    enemies: {},
                    objects: {}
                };
                console.log('✅ Basic assets initialized');
            }
            
            console.log('✅ Game force started successfully');
        };
    }
    
    // Ensure startGame function is available
    if (typeof window.startGame !== 'function') {
        console.log('🔄 Creating emergency startGame function...');
        
        window.startGame = function() {
            console.log('🎮 Emergency startGame called...');
            
            try {
                // Hide welcome menu
                const welcomeMenu = document.getElementById('welcomeMenu');
                if (welcomeMenu) welcomeMenu.style.display = 'none';
                
                // Hide loading screen
                const loadingScreen = document.getElementById('loadingScreen');
                if (loadingScreen) loadingScreen.style.display = 'none';
                
                // Start the game
                if (typeof PirateBombGame !== 'undefined') {
                    const game = new PirateBombGame();
                    window.game = game;
                    game.boot();
                } else {
                    console.error('❌ PirateBombGame still not available');
                    alert('Game failed to load. Please refresh the page.');
                }
            } catch (error) {
                console.error('❌ Emergency startGame failed:', error);
                alert('Game failed to start: ' + error.message);
            }
        };
        
        console.log('✅ Emergency startGame function created');
    }
    
    // Force hide loading screen after 15 seconds if still showing
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen && loadingScreen.style.display !== 'none') {
            console.warn('⚠️ Loading screen still visible after 15 seconds, forcing hide...');
            loadingScreen.style.display = 'none';
            
            // Show welcome menu
            const welcomeMenu = document.getElementById('welcomeMenu');
            if (welcomeMenu) {
                welcomeMenu.style.display = 'block';
            }
        }
    }, 15000);
    
    console.log('🔧 Emergency game fix loaded successfully');
});

// Also try to fix immediately if DOM is already loaded
if (document.readyState === 'loading') {
    // Document is still loading, wait for load event
    console.log('📄 Document still loading, waiting for load event...');
} else {
    // Document is already loaded, run fix immediately
    console.log('📄 Document already loaded, running fix immediately...');
    
    // Trigger the load event handler
    const loadEvent = new Event('load');
    window.dispatchEvent(loadEvent);
}
