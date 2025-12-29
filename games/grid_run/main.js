// main.js
import { GameEngine } from './core/engine.js';
import { TerminalUI } from './ui/terminal.js';
import { HUD } from './ui/hud.js';
import { bus } from './core/events.js';
import { GridViewport } from './viewport/viewport.js';

// Store viewport reference for cleanup
let viewport = null;

export function initGame(gameScreenId) {
    console.log("Initializing Grid Run...");
    
    // Get containers
    const terminalContainer = document.getElementById('terminal-container');
    const viewportContainer = document.getElementById('viewport-container');
    
    if (!terminalContainer) {
        console.error("[MAIN] Terminal container not found");
        return;
    }
    
    // Clear terminal container (viewport is separate)
    terminalContainer.innerHTML = '';

    // Initialize 3D Viewport (The Grid)
    if (viewportContainer) {
        viewport = new GridViewport('viewport-container');
        const viewportInitialized = viewport.init();
        
        // Hide loading indicator on success
        if (viewportInitialized) {
            const loadingEl = viewportContainer.querySelector('.viewport-loading');
            if (loadingEl) {
                loadingEl.classList.add('hidden');
            }
        }
    }

    // Init UI components (order matters: TerminalUI creates #game-output, HUD inserts before it)
    new TerminalUI('terminal-container'); // Text output/input - creates #game-output
    new HUD('terminal-container');        // Status bars - inserts before #game-output
    new GameEngine();                      // Game logic
    
    // Start game
    bus.emit('GAME_START');
}

/**
 * Cleanup function for viewport disposal
 */
export function disposeGame() {
    if (viewport) {
        viewport.dispose();
        viewport = null;
    }
