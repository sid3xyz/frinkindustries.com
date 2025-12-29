// HUD.js
import { bus } from '../core/events.js';

export class HUD {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.element = this.createHUD();
        this.setupListeners();
    }

    createHUD() {
        const div = document.createElement('div');
        div.id = 'game-hud';
        div.className = 'terminal-hud';
        // Insert before output
        const output = this.container.querySelector('#game-output');
        this.container.insertBefore(div, output);
        return div;
    }

    setupListeners() {
        bus.on('STATE_UPDATED', (state) => this.render(state));
        bus.on('STATE_LOADED', (state) => this.render(state));
    }

    render(state) {
        const p = state.player;
        const pos = state.position;
        
        // Helper to make bars
        const bar = (val, max = 100, len = 10) => {
            const fill = Math.ceil((val / max) * len);
            return '█'.repeat(fill) + '░'.repeat(len - fill);
        };

        this.element.innerHTML = `
<div class="hud-row">
  <span>INTEGRITY: [${bar(p.integrity)}] ${p.integrity}%</span>
  <span>BANDWIDTH: [${bar(p.bandwidth)}] ${p.bandwidth}%</span>
</div>
<div class="hud-row">
  <span>CREDITS:   ${p.credits}</span>
  <span>LOC:       ${pos.current_node_id.replace('ZONE_1_', '')}</span>
</div>
<div class="hud-sep">==================================================</div>
        `;
    }
}
