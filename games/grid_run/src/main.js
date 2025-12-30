// src/main.js
import { GameEngine } from './engine.js';
import { TerminalUI } from './ui.js';
import { HUD } from './hud.js';
import { bus } from './events.js';

console.log("Initializing Grid Run (Vertical Slice)...");

// Initialize the UI components
const ui = new TerminalUI('terminal');
const hud = new HUD('hud-bar');
const engine = new GameEngine();

// Start the game loop
bus.emit('GAME_START');