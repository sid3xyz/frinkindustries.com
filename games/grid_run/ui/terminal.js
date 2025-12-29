// TerminalUI.js
import { bus } from '../core/events.js';

export class TerminalUI {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`UI Container #${containerId} not found!`);
            return;
        }
        this.output = this.container.querySelector('#game-output') || this.createOutput();
        this.inputArea = this.container.querySelector('#game-input') || this.createInput();
        
        this.setupListeners();
    }

    createOutput() {
        const div = document.createElement('div');
        div.id = 'game-output';
        div.className = 'terminal-output';
        this.container.appendChild(div);
        return div;
    }

    createInput() {
        const div = document.createElement('div');
        div.id = 'game-input';
        div.className = 'terminal-input';
        this.container.appendChild(div);
        return div;
    }

    setupListeners() {
        bus.on('NODE_ENTER', (node) => this.renderNode(node));
        bus.on('TEXT_MSG', (msg) => this.typeText(msg));
        bus.on('CLEAR_SCREEN', () => this.clear());
    }

    clear() {
        this.output.innerHTML = '';
        this.inputArea.innerHTML = '';
    }

    async typeText(text, speed = 20) {
        const p = document.createElement('div');
        p.className = 'line';
        this.output.appendChild(p);

        // Simple typing effect
        // In a real implementation, we'd use a promise to wait for completion
        p.textContent = text; 
        
        // Auto-scroll
        this.container.scrollTop = this.container.scrollHeight;
    }

    renderNode(node) {
        this.clear();
        this.typeText(`> LOC: ${node.title}`);
        this.typeText(node.description);
        this.typeText('--------------------------------');
        
        this.renderChoices(node.choices);
    }

    renderChoices(choices) {
        if (!choices) return;

        const choiceList = document.createElement('div');
        choiceList.className = 'choice-list';

        choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'terminal-btn';
            btn.textContent = `[${index + 1}] ${choice.label}`;
            btn.onclick = () => {
                bus.emit('PLAYER_ACTION', choice);
            };
            choiceList.appendChild(btn);
        });

        this.inputArea.appendChild(choiceList);
        
        // Auto-scroll
        this.container.scrollTop = this.container.scrollHeight;
    }
}
