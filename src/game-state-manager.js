// Handle game button states
const gameStateManager = {
    init() {
        this.connectWalletButton = document.getElementById('connectWalletButton');
        this.playButton = document.getElementById('startButton');
        this.setupEventListeners();
        this.checkInitialState();
    },

    setupEventListeners() {
        // Listen for wallet connection events
        window.addEventListener('walletConnected', () => {
            this.updateButtonStates(true);
        });

        window.addEventListener('walletDisconnected', () => {
            this.updateButtonStates(false);
        });

        // Update button states when wallet status changes
        if (window.solana) {
            window.solana.on('connect', () => this.updateButtonStates(true));
            window.solana.on('disconnect', () => this.updateButtonStates(false));
        }
    },

    checkInitialState() {
        // Check if wallet is already connected
        const isConnected = window.solana && window.solana.isConnected;
        this.updateButtonStates(isConnected);
    },

    updateButtonStates(isConnected) {
        if (this.playButton) {
            this.playButton.disabled = !isConnected;
            this.playButton.style.opacity = isConnected ? '1' : '0.5';
            this.playButton.style.cursor = isConnected ? 'pointer' : 'not-allowed';
        }
    }
};

// Initialize when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    gameStateManager.init();
});
