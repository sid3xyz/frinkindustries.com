// HUD.js - Oregon Trail-style status display with cyberpunk decay
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
        // Insert before output (prepend to container)
        const output = this.container.querySelector('#game-output');
        if (output) {
            this.container.insertBefore(div, output);
        } else {
            this.container.prepend(div);
        }
        return div;
    }

    setupListeners() {
        bus.on('STATE_UPDATED', (state) => this.render(state));
        bus.on('STATE_LOADED', (state) => this.render(state));
    }

    render(state) {
        const p = state.player;
        const pos = state.position;
        
        // Oregon Trail-style resource bar with decay aesthetic
        const bar = (val, max = 100, len = 10) => {
            const fill = Math.ceil((val / max) * len);
            const filled = '█'.repeat(fill);
            const empty = '░'.repeat(len - fill);
            return `<span class="resource-bar"><span class="filled">${filled}</span><span class="empty">${empty}</span></span>`;
        };

        // Add critical class if resources are low
        const intClass = p.integrity <= 25 ? 'resource-critical' : '';
        const bwClass = p.bandwidth <= 25 ? 'resource-critical' : '';

        // Clean node ID for display
        const cleanNodeId = (id) => id.replace(/^ZONE_\d+_/, '');
        const zoneName = cleanNodeId(pos.current_node_id);

        // Date simulation (era based on zone)
        const era = this.getEra(pos.current_zone || 0);

        this.element.innerHTML = `
<div class="hud-row">
  <span class="${intClass}">INTEGRITY: ${bar(p.integrity)} ${p.integrity}%</span>
  <span class="${bwClass}">BANDWIDTH: ${bar(p.bandwidth)} ${p.bandwidth}%</span>
</div>
<div class="hud-row">
  <span>CREDITS: ${String(p.credits).padStart(4, '0')}</span>
  <span>ERA: ${era}</span>
  <span>LOC: ${zoneName}</span>
</div>
<div class="hud-sep">╔══════════════════════════════════════════════════════════════╗</div>
        `;
    }

    getEra(zone) {
        const eras = [
            '1983 [ARPANET]',
            '1989 [WORLD WIDE WEB]',
            '1995 [BROWSER WARS]',
            '2001 [DOT-COM CRASH]',
            '2010 [SOCIAL NETWORKS]',
            '2025 [THE SOURCE]'
        ];
        return eras[zone] || eras[0];
    }
}
