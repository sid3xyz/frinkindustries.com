// GameEngine.js
import { bus } from './events.js';
import { state } from './state.js';
import { zones } from '../data/zones.js';

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
        if (current.position.current_node_id === "START_NODE") {
            const firstNode = zones["ZONE_0_START"]; 
            this.loadNode(firstNode);
        } else {
            const node = zones[current.position.current_node_id];
            this.loadNode(node);
        }
    }

    loadNode(node) {
        if (!node) {
            console.error("Node missing:", state.get().position.current_node_id);
            return;
        }
        state.update({ position: { current_node_id: node.id } });
        bus.emit('NODE_ENTER', node);
    }

    handleAction(action) {
        const player = state.get().player;

        // 1. Reset Game Check
        if (action.command === "RESET") {
            state.reset();
            this.start();
            return;
        }

        // 2. Cost Check
        if (action.cost) {
            const costBw = action.cost.bandwidth || 0;
            const costInt = action.cost.integrity || 0;

            if (player.bandwidth < costBw) {
                bus.emit('TEXT_MSG', ">> CRITICAL: INSUFFICIENT BANDWIDTH.");
                return;
            }
            
            // Apply costs
            const newStats = {
                bandwidth: Math.max(0, player.bandwidth - costBw),
                integrity: Math.max(0, player.integrity - costInt)
            };
            
            // Apply Rewards
            if (action.reward) {
                if (action.reward.credits) newStats.credits = (player.credits || 0) + action.reward.credits;
                if (action.reward.bandwidth) newStats.bandwidth += action.reward.bandwidth;
            }

            state.update({ player: newStats });
        }

        // 3. Game Over Check
        const freshState = state.get().player;
        if (freshState.integrity <= 0) {
            bus.emit('CLEAR_SCREEN');
            bus.emit('TEXT_MSG', ">> CRITICAL FAILURE: INTEGRITY COMPROMISED.");
            bus.emit('TEXT_MSG', "Your construct de-rezzed into static.");
            bus.emit('NODE_ENTER', {
                title: "GAME OVER",
                description: "You have been deleted.",
                choices: [{ label: "Reboot System", command: "RESET" }]
            });
            return;
        }
        if (freshState.bandwidth <= 0) {
             bus.emit('CLEAR_SCREEN');
             bus.emit('TEXT_MSG', ">> CRITICAL FAILURE: BANDWIDTH DEPLETED.");
             bus.emit('TEXT_MSG', "You are stranded between nodes, forever buffering.");
             bus.emit('NODE_ENTER', {
                title: "GAME OVER",
                description: "Connection Lost.",
                choices: [{ label: "Reboot System", command: "RESET" }]
            });
            return;
        }

        // 4. Execute Movement/Effect
        if (action.effect && action.effect.next_node) {
            const nextNode = zones[action.effect.next_node];
            this.loadNode(nextNode);
        } else if (action.effect && action.effect.msg) {
             bus.emit('TEXT_MSG', action.effect.msg);
        }
    }
}