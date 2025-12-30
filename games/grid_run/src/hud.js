// src/hud.js
import { bus } from './events.js';

export class HUD {
    constructor(id) {
        this.el = document.getElementById(id);
        bus.on('STATE_UPDATED', (s) => this.render(s));
        bus.on('STATE_LOADED', (s) => this.render(s));
    }

    render(state) {
        const p = state.player;
        const bar = (val) => '█'.repeat(Math.ceil(val/10)) + '░'.repeat(10 - Math.ceil(val/10));
        
        this.el.innerHTML = `
            <div id="hud-status">
                <span>INT: [${bar(p.integrity)}] ${p.integrity}%</span>
                <span>BW: [${bar(p.bandwidth)}] ${p.bandwidth}%</span>
            </div>
            <div class="hud-credits">$${p.credits}</div>
        `;
    }
}
