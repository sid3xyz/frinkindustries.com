// src/state.js
import { bus } from './events.js';

const defaultState = {
    player: { integrity: 100, bandwidth: 100, credits: 0 },
    position: { current_node_id: "ZONE_0_START" }
};

class StateManager {
    constructor() { this.state = JSON.parse(JSON.stringify(defaultState)); }
    init() { bus.emit('STATE_LOADED', this.state); }
    update(updates) {
        if (updates.player) Object.assign(this.state.player, updates.player);
        if (updates.position) Object.assign(this.state.position, updates.position);
        bus.emit('STATE_UPDATED', this.state);
    }
    get() { return this.state; }
}
export const state = new StateManager();
