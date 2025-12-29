// TerminalUI.js - Oregon Trail-style text display with cyberpunk decay
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
        bus.on('TEXT_MSG', (msg) => this.addMessage(msg));
        bus.on('CLEAR_SCREEN', () => this.clear());
    }

    clear() {
        this.output.innerHTML = '';
        this.inputArea.innerHTML = '';
    }

    addMessage(text, className = '') {
        const line = document.createElement('div');
        line.className = `line ${className}`;
        line.textContent = text;
        this.output.appendChild(line);
        this.scrollToBottom();
    }

    renderNode(node) {
        this.clear();
        
        // Oregon Trail-style location header with box
        const header = document.createElement('div');
        header.className = 'node-header';
        header.innerHTML = `
╔════════════════════════════════════════════════════════════════╗
║  <span class="loc-title">${this.padCenter(node.title, 60)}</span>  ║
╚════════════════════════════════════════════════════════════════╝`;
        this.output.appendChild(header);
        
        // Description with proper line breaks
        const desc = document.createElement('div');
        desc.className = 'node-description';
        // Split by \n and render each line
        const lines = node.description.split('\n');
        lines.forEach(line => {
            const p = document.createElement('p');
            p.textContent = line || ' '; // Preserve empty lines
            desc.appendChild(p);
        });
        this.output.appendChild(desc);
        
        // Separator before choices
        const sep = document.createElement('div');
        sep.className = 'separator';
        sep.textContent = '────────────────────────────────────────';
        this.output.appendChild(sep);
        
        // Render choices
        this.renderChoices(node.choices);
        
        this.scrollToBottom();
    }

    padCenter(text, width) {
        if (text.length >= width) return text.substring(0, width);
        const pad = width - text.length;
        const left = Math.floor(pad / 2);
        const right = pad - left;
        return ' '.repeat(left) + text + ' '.repeat(right);
    }

    renderChoices(choices) {
        if (!choices || choices.length === 0) return;

        const prompt = document.createElement('div');
        prompt.className = 'choice-prompt';
        prompt.textContent = '>> SELECT ACTION:';
        this.inputArea.appendChild(prompt);

        const choiceList = document.createElement('div');
        choiceList.className = 'choice-list';

        choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'terminal-btn';
            
            // Build label with cost indicator (Oregon Trail style)
            let label = `[${index + 1}] ${choice.label}`;
            
            // Add keyboard shortcut hint
            btn.setAttribute('data-key', index + 1);
            
            btn.innerHTML = label;
            
            btn.onclick = () => {
                // Visual feedback
                btn.classList.add('selected');
                btn.textContent = `>> ${choice.label}...`;
                
                // Small delay for feedback
                setTimeout(() => {
                    bus.emit('PLAYER_ACTION', choice);
                }, 150);
            };
            
            choiceList.appendChild(btn);
        });

        this.inputArea.appendChild(choiceList);
        
        // Keyboard navigation (Oregon Trail style - press number to select)
        this.setupKeyboardNav(choices);
    }

    setupKeyboardNav(choices) {
        // Remove old listener if exists
        if (this.keyHandler) {
            document.removeEventListener('keydown', this.keyHandler);
        }
        
        this.keyHandler = (e) => {
            const num = parseInt(e.key);
            if (num >= 1 && num <= choices.length) {
                const btn = this.inputArea.querySelector(`[data-key="${num}"]`);
                if (btn) btn.click();
            }
        };
        
        document.addEventListener('keydown', this.keyHandler);
    }

    scrollToBottom() {
        // Scroll the game container
        this.container.scrollTop = this.container.scrollHeight;
        // Also scroll parent if needed
        const parent = this.container.parentElement;
        if (parent) parent.scrollTop = parent.scrollHeight;
    }
}
