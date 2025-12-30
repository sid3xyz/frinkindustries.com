// src/ui.js
import { bus } from './events.js';

export class TerminalUI {
    constructor(id) {
        this.container = document.getElementById(id);
        this.output = this.container.querySelector('#content');
        this.choices = this.container.querySelector('#choices');
        
        bus.on('NODE_ENTER', (node) => this.render(node));
        bus.on('TEXT_MSG', (msg) => this.log(msg));
    }

    log(text) {
        const p = document.createElement('div');
        p.innerText = text;
        this.output.appendChild(p);
        this.container.scrollTop = this.container.scrollHeight;
    }

    render(node) {
        this.output.innerHTML = '';
        this.choices.innerHTML = '';
        
        this.log(`> LOC: ${node.title}`);
        this.log(node.description);
        this.log('--------------------------------');

        node.choices.forEach((c, i) => {
            const btn = document.createElement('div');
            btn.className = 'choice-button';
            btn.innerText = `[${i+1}] ${c.label}`;
            btn.onclick = () => bus.emit('PLAYER_ACTION', c);
            this.choices.appendChild(btn);
        });
    }
}
