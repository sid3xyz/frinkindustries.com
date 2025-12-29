// main.js
import { GameEngine } from './core/engine.js';
import { TerminalUI } from './ui/terminal.js';
import { HUD } from './ui/hud.js';
import { bus } from './core/events.js';

export function initGame(containerId) {
    console.log("Initializing Grid Run...");
    
    // Clear container
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    // Init components
    new HUD(containerId);     // Status bars
    new TerminalUI(containerId); // Text output/input
    new GameEngine();         // Logic
    
    // Start
    bus.emit('GAME_START');
}
