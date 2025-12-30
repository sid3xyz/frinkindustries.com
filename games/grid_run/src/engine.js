// src/engine.js
import { bus } from './events.js';
import { state } from './state.js';
import { zones } from './data.js';

export class GameEngine {
    constructor() {
        bus.on('GAME_START', () => this.start());
        bus.on('PLAYER_ACTION', (action) => this.handleAction(action));
    }

    start() {
        state.init();
        this.loadNode(zones["ZONE_0_START"]);
    }

    loadNode(node) {
        state.update({ position: { current_node_id: node.id } });
        bus.emit('NODE_ENTER', node);
    }

    handleAction(action) {
        const player = state.get().player;
        
        // Costs
        if (action.cost) {
            const bw = action.cost.bandwidth || 0;
            const hp = action.cost.integrity || 0;
            
            if (player.bandwidth < bw) {
                bus.emit('TEXT_MSG', ">> ERROR: INSUFFICIENT BANDWIDTH.");
                return;
            }
            
            const newStats = {
                bandwidth: Math.max(0, player.bandwidth - bw),
                integrity: Math.max(0, player.integrity - hp)
            };
            
            if (action.reward) {
                if (action.reward.credits) newStats.credits = player.credits + action.reward.credits;
                if (action.reward.bandwidth) newStats.bandwidth += action.reward.bandwidth;
            }
            
            state.update({ player: newStats });
        }

        // Logic
        if (state.get().player.integrity <= 0) {
            bus.emit('NODE_ENTER', { title: "GAME OVER", description: "Construct De-rezzed.", choices: [{label: "Reboot", command: "RESET"}] });
            return;
        }

        if (action.command === "RESET") {
            state.constructor(); // Hack reset
            this.start();
            return;
        }

        if (action.effect && action.effect.next_node) {
            this.loadNode(zones[action.effect.next_node]);
        } else if (action.effect && action.effect.msg) {
            bus.emit('TEXT_MSG', action.effect.msg);
        }
    }
}
