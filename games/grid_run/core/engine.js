// GameEngine.js
import { bus } from './events.js';
import { state } from './state.js';
import { zones } from '../data/zones.js'; // We'll create this next

export class GameEngine {
    constructor() {
        this.setupListeners();
    }

    setupListeners() {
        bus.on('GAME_START', () => this.start());
        bus.on('PLAYER_ACTION', (action) => this.handleAction(action));
    }

    start() {
        state.init();
        const current = state.get();
        // If just starting, load the first node
        if (current.position.current_node_id === "START_NODE") {
            // Logic to find actual start node from data
            const firstNode = this.getNode("ZONE_0_START"); 
            this.loadNode(firstNode);
        } else {
            // Load saved node
            const node = this.getNode(current.position.current_node_id);
            this.loadNode(node);
        }
    }

    getNode(id) {
        // Simple lookup. In real app, search through zones.
        // For prototype, we assume a flat list or simple zone lookup.
        return zones[id]; 
    }

    loadNode(node) {
        if (!node) {
            console.error("Node not found!");
            return;
        }
        // Update state
        state.update({ position: { current_node_id: node.id } });
        
        // Tell UI to render
        bus.emit('NODE_ENTER', node);
    }

    handleAction(action) {
        // 1. Check costs (Bandwidth/Integrity)
        const player = state.get().player;
        
        if (action.cost) {
            if (action.cost.bandwidth && player.bandwidth < action.cost.bandwidth) {
                bus.emit('TEXT_MSG', ">> CRITICAL: INSUFFICIENT BANDWIDTH.");
                return;
            }
            // Apply costs
            const newStats = {
                bandwidth: player.bandwidth - (action.cost.bandwidth || 0),
                integrity: player.integrity - (action.cost.integrity || 0)
            };
            state.update({ player: newStats });
        }

        // 2. Execute effects
        if (action.effect) {
            if (action.effect.next_node) {
                const nextNode = this.getNode(action.effect.next_node);
                this.loadNode(nextNode);
            }
            // Add other effects like 'loot', 'damage', etc.
        }
    }
}
