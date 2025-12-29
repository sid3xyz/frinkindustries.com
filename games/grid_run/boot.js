// boot.js - Grid Run Boot/Menu System
import { GameEngine } from './core/engine.js';
import { TerminalUI } from './ui/terminal.js';
import { HUD } from './ui/hud.js';
import { bus } from './core/events.js';
import { GridViewport } from './viewport/viewport.js';

const SAVE_KEY = 'FRINK_GRID_RUN_SAVE';

// Store viewport reference for cleanup
let viewport = null;

// Screen elements
const bootScreen = document.getElementById('boot-screen');
const aboutScreen = document.getElementById('about-screen');
const gameScreen = document.getElementById('game-screen');

// Buttons
const btnNewGame = document.getElementById('btn-new-game');
const btnContinue = document.getElementById('btn-continue');
const btnAbout = document.getElementById('btn-about');
const btnBackAbout = document.getElementById('btn-back-about');

// Check for existing save
function checkSaveGame() {
    const save = localStorage.getItem(SAVE_KEY);
    if (save) {
        try {
            const data = JSON.parse(save);
            if (data && data.position && data.position.current_node_id !== "START_NODE") {
                btnContinue.disabled = false;
                btnContinue.querySelector?.('span')?.remove();
                // Update button text to show progress
                const node = data.position.current_node_id.replace(/^ZONE_\d+_/, '');
                btnContinue.textContent = `[2] RESUME SIGNAL (${node})`;
            }
        } catch (e) {
            console.warn("Corrupted save detected");
        }
    }
}

// Show/hide screens
function showScreen(screen) {
    bootScreen.classList.add('hidden');
    aboutScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    screen.classList.remove('hidden');
}

// Start new game
function startNewGame() {
    localStorage.removeItem(SAVE_KEY);
    launchGame();
}

// Continue saved game
function continueGame() {
    launchGame();
}

// Launch the game engine
function launchGame() {
    showScreen(gameScreen);
    
    // Get containers (viewport and terminal are now separate)
    const viewportContainer = document.getElementById('viewport-container');
    const terminalContainer = document.getElementById('terminal-container');
    
    if (!terminalContainer) {
        console.error("[GRID_RUN] Terminal container not found");
        return;
    }
    
    // Clear terminal container only (viewport is separate)
    terminalContainer.innerHTML = '';
    
    // Initialize 3D Viewport (The Grid)
    if (viewportContainer && !viewport) {
        viewport = new GridViewport('viewport-container');
        const viewportInitialized = viewport.init();
        
        // Hide loading indicator on success
        if (viewportInitialized) {
            const loadingEl = viewportContainer.querySelector('.viewport-loading');
            if (loadingEl) {
                loadingEl.classList.add('hidden');
            }
            console.log("[GRID_RUN] Viewport initialized");
        }
    }
    
    // Initialize UI components
    // Order matters: TerminalUI creates #game-output, HUD inserts before it
    new TerminalUI('terminal-container');
    new HUD('terminal-container');
    new GameEngine();
    
    // Start game
    console.log("[GRID_RUN] Jacking in...");
    bus.emit('GAME_START');
}

// Event listeners
btnNewGame.addEventListener('click', () => {
    // Typing effect for "jacking in"
    btnNewGame.textContent = '>> INITIALIZING...';
    btnNewGame.disabled = true;
    setTimeout(() => {
        startNewGame();
    }, 500);
});

btnContinue.addEventListener('click', () => {
    if (!btnContinue.disabled) {
        btnContinue.textContent = '>> RECONNECTING...';
        setTimeout(() => {
            continueGame();
        }, 300);
    }
});

btnAbout.addEventListener('click', () => {
    showScreen(aboutScreen);
});

btnBackAbout.addEventListener('click', () => {
    showScreen(bootScreen);
});

// Keyboard navigation (Oregon Trail style)
document.addEventListener('keydown', (e) => {
    // Only on boot screen
    if (!bootScreen.classList.contains('hidden')) {
        switch(e.key) {
            case '1':
                btnNewGame.click();
                break;
            case '2':
                if (!btnContinue.disabled) btnContinue.click();
                break;
            case '3':
                btnAbout.click();
                break;
            case '0':
                window.location.href = '../../index.html';
                break;
        }
    }
    
    // On about screen
    if (!aboutScreen.classList.contains('hidden')) {
        if (e.key === '0' || e.key === 'Escape') {
            btnBackAbout.click();
        }
    }
});

// Listen for game quit to return to menu
bus.on('QUIT_TO_MENU', () => {
    // Dispose viewport to free WebGL resources
    if (viewport) {
        viewport.dispose();
        viewport = null;
    }
    showScreen(bootScreen);
    checkSaveGame();
});

// Initialize
checkSaveGame();
console.log("[GRID_RUN] Boot sequence complete. Awaiting input...");
