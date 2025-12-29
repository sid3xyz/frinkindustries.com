// StateManager.js
import { bus } from './events.js';

const STORAGE_KEY = 'FRINK_GRID_RUN_SAVE';

const defaultState = {
    meta: {
        version: "1.0.0",
        started_at: null
    },
    player: {
        integrity: 100, // Health
        bandwidth: 100, // Fuel
        credits: 0,
        inventory: []
    },
    position: {
        current_zone: 0,
        current_node_id: "START_NODE",
        distance_traveled: 0
    },
    flags: {}
};

class StateManager {
    constructor() {
        this.state = JSON.parse(JSON.stringify(defaultState)); // Deep copy
    }

    // Load from local storage or create new
    init() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                this.state = JSON.parse(saved);
                console.log("Game loaded from save.");
            } catch (e) {
                console.warn("Save file corrupted. Starting new game.");
                this.reset();
            }
        } else {
            this.reset();
        }
        bus.emit('STATE_LOADED', this.state);
    }

    reset() {
        this.state = JSON.parse(JSON.stringify(defaultState));
        this.state.meta.started_at = Date.now();
        this.save();
        bus.emit('STATE_RESET', this.state);
    }

    save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        bus.emit('STATE_SAVED');
    }

    // Update specific parts of state
    update(updates) {
        // Simple recursive merge or specific logic could go here.
        // For now, we manually update for safety.
        if (updates.player) Object.assign(this.state.player, updates.player);
        if (updates.position) Object.assign(this.state.position, updates.position);
        if (updates.flags) Object.assign(this.state.flags, updates.flags);
        
        this.save();
        bus.emit('STATE_UPDATED', this.state);
    }

    get() {
        return this.state;
    }
}

export const state = new StateManager();
