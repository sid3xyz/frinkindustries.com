/**
 * GRID_RUN - Entry Point
 * A Journey Through Internet History with Malcolm Frink
 * 
 * Inspired by The Oregon Trail (1985)
 */

import { Game } from './game.js';

// =============================================================================
// INITIALIZATION
// =============================================================================

let game = null;

function init() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║                      GRID_RUN                                ║');
  console.log('║         A Journey Through Internet History                   ║');
  console.log('║                  with Malcolm Frink                          ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  
  // Create game instance
  game = new Game();
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => game.init());
  } else {
    game.init();
  }
}

// =============================================================================
// START
// =============================================================================

init();

// Expose for debugging
window.GRID_RUN = {
  game: () => game,
  version: '0.1.0'
};
