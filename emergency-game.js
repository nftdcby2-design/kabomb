// Emergency Standalone Game
// This version generates assets programmatically to avoid loading issues

class EmergencyGame {
  constructor() {
    console.log('🚨 Starting emergency game version');
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.width = this.canvas ? this.canvas.width : 800;
    this.height = this.canvas ? this.canvas.height : 600;
    
    // Game state
    this.gameState = {
      score: 0,
      health: 100,
      level: 1,
      gameOver: false,
      paused: false
    };
    
    // Player properties
    this.player = {
      x: 100,
      y: this.height - 150,
      width: 40,
      height: 60,
      speed: 5,
      jumping: false,
      velocity: 0,
      gravity: 0.5,
      color: '#228B22' // Pirate green
    };
    
    // Input handling
    this.keys = {};
    this.setupEventListeners();
    
    // Animation frame
    this.lastFrameTime = 0;
    this.animationId = null;
  }
  
  // Set up event listeners for keyboard input
  setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
    });
    
    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });
  }
  
  // Start the game
  boot() {
    console.log('🎮 Booting emergency game');
    
    // Hide the welcome menu
    try {
      const welcomeMenu = document.getElementById('welcomeMenu');
      if (welcomeMenu) welcomeMenu.style.display = 'none';
    } catch (error) {
      console.warn('Error hiding welcome menu:', error);
    }
    
    // Show the canvas
    if (this.canvas) {
      this.canvas.style.display = 'block';
      
      // Show a success message
      this.ctx.fillStyle = '#1a1a2e';
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.fillStyle = '#4fc3f7';
      this.ctx.font = 'bold 24px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Emergency Game Mode', this.width / 2, this.height / 2 - 60);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '18px Arial';
      this.ctx.fillText('Game loaded successfully in emergency mode', this.width / 2, this.height / 2 - 20);
      this.ctx.fillText('Use arrow keys or WASD to move and Space to jump', this.width / 2, this.height / 2 + 20);
      this.ctx.fillStyle = '#4ecca3';
      this.ctx.font = '16px Arial';
      this.ctx.fillText('Click anywhere to start', this.width / 2, this.height / 2 + 60);
      
      // Start on click
      this.canvas.addEventListener('click', () => {
        this.startGameLoop();
      }, { once: true });
    }
  }
  
  // Start the game loop
  startGameLoop() {
    // Start game loop
    this.lastFrameTime = performance.now();
    this.gameLoop();
  }
  
  // Main game loop
  gameLoop(currentTime = 0) {
    // Calculate delta time
    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;
    
    // Clear canvas
    this.ctx.fillStyle = '#87CEEB'; // Sky blue
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Update game state
    this.update(deltaTime);
    
    // Render game
    this.render();
    
    // Continue game loop
    this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
  }
  
  // Update game state
  update(deltaTime) {
    // Player movement
    if (this.keys['ArrowRight'] || this.keys['d']) {
      this.player.x += this.player.speed;
    }
    if (this.keys['ArrowLeft'] || this.keys['a']) {
      this.player.x -= this.player.speed;
    }
    
    // Jumping
    if ((this.keys['ArrowUp'] || this.keys['w'] || this.keys[' ']) && !this.player.jumping) {
      this.player.jumping = true;
      this.player.velocity = -12;
    }
    
    // Apply gravity
    this.player.velocity += this.player.gravity;
    this.player.y += this.player.velocity;
    
    // Check floor collision
    if (this.player.y > this.height - 100 - this.player.height) {
      this.player.y = this.height - 100 - this.player.height;
      this.player.jumping = false;
      this.player.velocity = 0;
    }
    
    // Check boundaries
    if (this.player.x < 0) this.player.x = 0;
    if (this.player.x > this.width - this.player.width) {
      this.player.x = this.width - this.player.width;
    }
  }
  
  // Render game objects
  render() {
    // Draw floor
    this.ctx.fillStyle = '#8B4513'; // Brown
    this.ctx.fillRect(0, this.height - 100, this.width, 100);
    
    // Draw player - pirate character with hat
    this.drawPirateCharacter(this.player.x, this.player.y, this.player.width, this.player.height);
    
    // Draw UI
    this.drawUI();
  }
  
  // Draw pirate character
  drawPirateCharacter(x, y, width, height) {
    // Body
    this.ctx.fillStyle = '#228B22'; // Pirate green
    this.ctx.fillRect(x, y, width, height);
    
    // Face
    this.ctx.fillStyle = '#FFF';
    
    // Eyes
    this.ctx.beginPath();
    this.ctx.arc(x + width * 0.3, y + height * 0.3, width * 0.1, 0, Math.PI * 2);
    this.ctx.arc(x + width * 0.7, y + height * 0.3, width * 0.1, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Pupils
    this.ctx.fillStyle = '#000';
    this.ctx.beginPath();
    this.ctx.arc(x + width * 0.3, y + height * 0.3, width * 0.05, 0, Math.PI * 2);
    this.ctx.arc(x + width * 0.7, y + height * 0.3, width * 0.05, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Smile
    this.ctx.beginPath();
    this.ctx.arc(x + width * 0.5, y + height * 0.5, width * 0.2, 0, Math.PI);
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    
    // Pirate hat
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(x - width * 0.1, y - height * 0.1, width * 1.2, height * 0.2);
    this.ctx.fillRect(x, y - height * 0.3, width, height * 0.2);
    
    // Hat decoration
    this.ctx.fillStyle = '#FF0000';
    this.ctx.fillRect(x, y - height * 0.3, width, height * 0.05);
  }
  
  // Draw UI elements
  drawUI() {
    // Score
    this.ctx.fillStyle = '#FFF';
    this.ctx.font = 'bold 20px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${this.gameState.score}`, 20, 30);
    
    // Health
    this.ctx.fillText(`Health: ${this.gameState.health}`, 20, 60);
    
    // Level
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`Level: ${this.gameState.level}`, this.width - 20, 30);
    
    // Emergency mode indicator
    this.ctx.textAlign = 'center';
    this.ctx.font = '16px Arial';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    this.ctx.fillText('Emergency Mode Active', this.width / 2, 30);
  }
}

// Make emergency game globally available
window.PirateBombGame = EmergencyGame;
window.EmergencyGame = EmergencyGame;

// Auto-start function
window.startGame = function() {
  console.log('🎮 Starting emergency game...');
  const game = new EmergencyGame();
  window.game = game;
  game.boot();
  return game;
};

console.log('✅ Emergency game loaded successfully');