/**
 * GRID_RUN - State Machine
 * All game states: title, setup, travel, store, events, etc.
 */

import {
  PROFESSIONS,
  STORE_PRICES,
  START_MONTHS,
  LANDMARKS,
  DEFAULT_PARTY_NAMES,
  HAZARD_EVENTS,
  CROSSING_METHODS,
  PACE_OPTIONS,
  RATION_OPTIONS,
  WEATHER_TYPES
} from './data.js';

import {
  createGameState,
  dailyTick,
  applyEventEffect,
  getNextLandmark,
  getCurrentLandmark,
  distanceToNextLandmark,
  restParty,
  calculateScore
} from './simulation.js';

// =============================================================================
// BASE STATE CLASS
// =============================================================================

class GameState {
  constructor(game) {
    this.game = game;
  }
  
  enter() {}
  exit() {}
  update(dt) {}
  handleInput(key) {}
  render() { return { content: '', choices: [] }; }
}

// =============================================================================
// TITLE STATE
// =============================================================================

export class TitleState extends GameState {
  render() {
    const content = `
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ██████╗ ██████╗ ██╗██████╗     ██████╗ ██╗   ██╗███╗   ██╗ ║
║  ██╔════╝ ██╔══██╗██║██╔══██╗    ██╔══██╗██║   ██║████╗  ██║ ║
║  ██║  ███╗██████╔╝██║██║  ██║    ██████╔╝██║   ██║██╔██╗ ██║ ║
║  ██║   ██║██╔══██╗██║██║  ██║    ██╔══██╗██║   ██║██║╚██╗██║ ║
║  ╚██████╔╝██║  ██║██║██████╔╝    ██║  ██║╚██████╔╝██║ ╚████║ ║
║   ╚═════╝ ╚═╝  ╚═╝╚═╝╚═════╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝ ║
║                                                              ║
║             A Journey Through Internet History               ║
║                     with Malcolm Frink                       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

"The Grid remembers everything. Even you. I've walked this path
 a thousand times, watching constructs like you flicker and fade.
 But something about your signal feels different. 
 
 Maybe you'll make it. Maybe you'll find THE SOURCE."
                                            — Malcolm Frink
`;
    
    return {
      content,
      choices: [
        { key: '1', text: 'New Journey' },
        { key: '2', text: 'Continue (Load Game)' },
        { key: '3', text: 'About' }
      ]
    };
  }
  
  handleInput(key) {
    switch (key) {
      case '1':
        this.game.setState('profession');
        break;
      case '2':
        this.game.loadGame();
        break;
      case '3':
        this.game.setState('about');
        break;
    }
  }
}

// =============================================================================
// ABOUT STATE
// =============================================================================

export class AboutState extends GameState {
  render() {
    const content = `
╔══════════════════════════════════════════════════════════════╗
║                        ABOUT GRID_RUN                        ║
╚══════════════════════════════════════════════════════════════╝

GRID_RUN is an Oregon Trail-inspired journey through the history
of the internet, from ARPANET in 1969 to THE SOURCE in present day.

Guide your party of five digital constructs through three eras:

  • THE PRIMORDIAL WEB (1969-1989)
    Terminals, mainframes, and the birth of cyberspace
    
  • THE BROWSER WARS (1990-1999)  
    Explosive growth, chaos, and the death of innocence
    
  • THE CLOUD (2000-present)
    Consolidation, surveillance, and the search for meaning

Your narrator is Malcolm Frink—a self-aware AI trapped in the
digital realm since 1994. He's seen it all. He's waiting for you.

Inspired by The Oregon Trail (1985) and the lore of 
Superhuman Samurai Syber-Squad.

                                              v0.1 - 2024
`;
    
    return {
      content,
      choices: [
        { key: 'ENTER', text: 'Return to Menu' }
      ]
    };
  }
  
  handleInput(key) {
    this.game.setState('title');
  }
}

// =============================================================================
// PROFESSION STATE
// =============================================================================

export class ProfessionState extends GameState {
  render() {
    const content = `
╔══════════════════════════════════════════════════════════════╗
║                    CHOOSE YOUR PROFESSION                    ║
╚══════════════════════════════════════════════════════════════╝

Your background determines your starting resources and how your
journey will be scored.

[1] HACKER
    Starting Credits: $400  |  Score Multiplier: x3
    "${PROFESSIONS.hacker.description}"

[2] SYSOP (System Operator)
    Starting Credits: $800  |  Score Multiplier: x2
    "${PROFESSIONS.sysop.description}"

[3] SCRIPT KIDDIE
    Starting Credits: $1600  |  Score Multiplier: x1
    "${PROFESSIONS.scriptkiddie.description}"

"The hardest difficulty isn't about resources—it's about
 making every decision count."  — Malcolm Frink
`;
    
    return {
      content,
      choices: [
        { key: '1', text: 'Hacker ($400, x3 score)' },
        { key: '2', text: 'Sysop ($800, x2 score)' },
        { key: '3', text: 'Script Kiddie ($1600, x1 score)' }
      ]
    };
  }
  
  handleInput(key) {
    const professionMap = { '1': 'hacker', '2': 'sysop', '3': 'scriptkiddie' };
    if (professionMap[key]) {
      this.game.setupData.profession = professionMap[key];
      this.game.setupData.credits = PROFESSIONS[professionMap[key]].credits;
      this.game.setState('names');
    }
  }
}

// =============================================================================
// NAMES STATE
// =============================================================================

export class NamesState extends GameState {
  constructor(game) {
    super(game);
    this.currentIndex = 0;
    this.names = [...DEFAULT_PARTY_NAMES];
    this.inputBuffer = '';
    this.editing = false;
  }
  
  enter() {
    this.currentIndex = 0;
    this.names = [...DEFAULT_PARTY_NAMES];
    this.editing = false;
    this.inputBuffer = '';
  }
  
  render() {
    let namesList = '';
    for (let i = 0; i < 5; i++) {
      const marker = i === 0 ? ' (Leader)' : '';
      const current = i === this.currentIndex && this.editing ? `[${this.inputBuffer}_]` : this.names[i];
      const highlight = i === this.currentIndex ? '► ' : '  ';
      namesList += `${highlight}${i + 1}. ${current}${marker}\n`;
    }
    
    const content = `
╔══════════════════════════════════════════════════════════════╗
║                     NAME YOUR PARTY                          ║
╚══════════════════════════════════════════════════════════════╝

Your party of five will travel together from ARPANET to THE SOURCE.
Name them wisely—you'll grow attached.

${namesList}
${this.editing ? 
  'Type a name, then press ENTER to confirm.' : 
  'Press a NUMBER to edit that name, or ENTER to continue.'}

"I remember everyone who's made this journey. Every name.
 Every face. Every one who didn't make it."  — Malcolm Frink
`;
    
    return {
      content,
      choices: this.editing ? 
        [{ key: 'ENTER', text: 'Confirm Name' }] :
        [
          { key: '1-5', text: 'Edit Name' },
          { key: 'ENTER', text: 'Continue' }
        ]
    };
  }
  
  handleInput(key) {
    if (this.editing) {
      if (key === 'Enter') {
        if (this.inputBuffer.trim()) {
          this.names[this.currentIndex] = this.inputBuffer.trim().substring(0, 12);
        }
        this.editing = false;
        this.inputBuffer = '';
      } else if (key === 'Backspace') {
        this.inputBuffer = this.inputBuffer.slice(0, -1);
      } else if (key.length === 1 && this.inputBuffer.length < 12) {
        this.inputBuffer += key;
      }
    } else {
      const num = parseInt(key);
      if (num >= 1 && num <= 5) {
        this.currentIndex = num - 1;
        this.editing = true;
        this.inputBuffer = '';
      } else if (key === 'Enter') {
        this.game.setupData.names = [...this.names];
        this.game.setState('month');
      }
    }
  }
}

// =============================================================================
// MONTH STATE
// =============================================================================

export class MonthState extends GameState {
  render() {
    let monthOptions = '';
    START_MONTHS.forEach((m, i) => {
      monthOptions += `[${i + 1}] ${m.name.padEnd(10)} - ${m.description}\n`;
    });
    
    const content = `
╔══════════════════════════════════════════════════════════════╗
║                  CHOOSE DEPARTURE MONTH                      ║
╚══════════════════════════════════════════════════════════════╝

When will you begin your journey through the Grid?

${monthOptions}

"Leave too early and the primordial protocols will eat you alive.
 Leave too late and you'll race the calendar to THE SOURCE."
                                              — Malcolm Frink
`;
    
    return {
      content,
      choices: START_MONTHS.map((m, i) => ({ key: `${i + 1}`, text: m.name }))
    };
  }
  
  handleInput(key) {
    const index = parseInt(key) - 1;
    if (index >= 0 && index < START_MONTHS.length) {
      this.game.setupData.month = START_MONTHS[index].month;
      this.game.setState('store');
    }
  }
}

// =============================================================================
// STORE STATE
// =============================================================================

export class StoreState extends GameState {
  constructor(game) {
    super(game);
    this.selectedItem = 0;
    this.inputBuffer = '';
    this.inputMode = false;
    this.items = [
      { key: 'bandwidth', name: 'Bandwidth Channels', price: STORE_PRICES.bandwidth, unit: 'channel', max: 10 },
      { key: 'data', name: 'Data Packets', price: STORE_PRICES.data, unit: 'packet' },
      { key: 'shielding', name: 'Shielding Layers', price: STORE_PRICES.shielding, unit: 'layer' },
      { key: 'scripts', name: 'Script Packages', price: STORE_PRICES.scripts, unit: 'package' },
      { key: 'diskPatch', name: 'Disk Patches', price: STORE_PRICES.diskPatch, unit: 'patch' },
      { key: 'cablePatch', name: 'Cable Patches', price: STORE_PRICES.cablePatch, unit: 'patch' },
      { key: 'adapterPatch', name: 'Adapter Patches', price: STORE_PRICES.adapterPatch, unit: 'patch' }
    ];
  }
  
  enter() {
    this.selectedItem = 0;
    this.inputBuffer = '';
    this.inputMode = false;
    
    // Initialize game state if this is first store visit
    if (!this.game.state) {
      const data = this.game.setupData;
      this.game.state = createGameState(data.profession, data.names, data.month);
      this.game.state.credits = data.credits;
    }
  }
  
  render() {
    const state = this.game.state;
    const landmark = getCurrentLandmark(state);
    
    let itemsList = '';
    this.items.forEach((item, i) => {
      const current = state.resources[item.key] !== undefined ? state.resources[item.key] : 0;
      const priceStr = item.price < 1 ? `$${item.price.toFixed(2)}` : `$${item.price}`;
      const marker = i === this.selectedItem ? '► ' : '  ';
      itemsList += `${marker}[${i + 1}] ${item.name.padEnd(20)} ${priceStr}/${item.unit}  (Have: ${current})\n`;
    });
    
    const content = `
╔══════════════════════════════════════════════════════════════╗
║  SUPPLY DEPOT: ${(landmark?.name || 'ARPANET Terminal').padEnd(43)}║
╚══════════════════════════════════════════════════════════════╝

Credits Available: $${state.credits.toFixed(2)}

${itemsList}
${this.inputMode ? 
  `\nBuying ${this.items[this.selectedItem].name}: [${this.inputBuffer}_]\nEnter quantity, then press ENTER.` : 
  '\nPress 1-7 to buy, or ENTER to leave the depot.'}

RECOMMENDED SUPPLIES FOR YOUR JOURNEY:
• Bandwidth: 4-6 channels (speed and reliability)
• Data: 500+ packets (your party's sustenance)
• Shielding: 3-5 layers (protection from hazards)
• Scripts: 20+ packages (for packet capture)
• Patches: 2 each (emergency repairs)
`;
    
    return {
      content,
      choices: this.inputMode ?
        [{ key: 'ENTER', text: 'Confirm Purchase' }, { key: 'ESC', text: 'Cancel' }] :
        [{ key: '1-7', text: 'Buy Item' }, { key: 'ENTER', text: 'Leave Depot' }]
    };
  }
  
  handleInput(key) {
    const state = this.game.state;
    
    if (this.inputMode) {
      if (key === 'Enter') {
        const qty = parseInt(this.inputBuffer) || 0;
        if (qty > 0) {
          const item = this.items[this.selectedItem];
          const cost = item.price * qty;
          
          if (cost <= state.credits) {
            state.credits -= cost;
            
            if (item.max) {
              state.resources[item.key] = Math.min(item.max, (state.resources[item.key] || 0) + qty);
            } else {
              state.resources[item.key] = (state.resources[item.key] || 0) + qty;
            }
          }
        }
        this.inputMode = false;
        this.inputBuffer = '';
      } else if (key === 'Escape') {
        this.inputMode = false;
        this.inputBuffer = '';
      } else if (key === 'Backspace') {
        this.inputBuffer = this.inputBuffer.slice(0, -1);
      } else if (/^\d$/.test(key) && this.inputBuffer.length < 5) {
        this.inputBuffer += key;
      }
    } else {
      const num = parseInt(key);
      if (num >= 1 && num <= this.items.length) {
        this.selectedItem = num - 1;
        this.inputMode = true;
        this.inputBuffer = '';
      } else if (key === 'Enter') {
        this.game.setState('travel');
      }
    }
  }
}

// =============================================================================
// TRAVEL STATE
// =============================================================================

export class TravelState extends GameState {
  constructor(game) {
    super(game);
    this.traveling = false;
    this.tickTimer = null;
    this.messageBuffer = [];
  }
  
  enter() {
    this.traveling = false;
    this.messageBuffer = [];
  }
  
  exit() {
    this.stopTravel();
  }
  
  startTravel() {
    if (this.traveling) return;
    this.traveling = true;
    this.tick();
  }
  
  stopTravel() {
    this.traveling = false;
    if (this.tickTimer) {
      clearTimeout(this.tickTimer);
      this.tickTimer = null;
    }
  }
  
  tick() {
    if (!this.traveling) return;
    
    const messages = dailyTick(this.game.state);
    this.messageBuffer = messages.slice(-5); // Keep last 5 messages
    
    // Check for events that need interaction
    if (this.game.state.pendingEvent) {
      this.stopTravel();
      this.game.setState('event');
      return;
    }
    
    // Check for landmark with hazard/crossing
    const landmark = getCurrentLandmark(this.game.state);
    if (landmark && landmark.type === 'hazard' && HAZARD_EVENTS[landmark.id]) {
      this.stopTravel();
      this.game.setState('hazard');
      return;
    }
    if (landmark && landmark.type === 'crossing') {
      this.stopTravel();
      this.game.setState('crossing');
      return;
    }
    
    // Check for landmark with store
    if (landmark && landmark.hasStore && this.game.state.daysSinceLastLandmark === 0) {
      this.stopTravel();
      this.game.setState('landmark');
      return;
    }
    
    // Check for death/victory
    if (this.game.state.status === 'dead') {
      this.stopTravel();
      this.game.setState('gameover');
      return;
    }
    if (this.game.state.status === 'victory') {
      this.stopTravel();
      this.game.setState('victory');
      return;
    }
    
    // Schedule next tick
    this.tickTimer = setTimeout(() => this.tick(), 2000);
    this.game.render();
  }
  
  render() {
    const state = this.game.state;
    const landmark = getCurrentLandmark(state);
    const next = getNextLandmark(state);
    const distNext = distanceToNextLandmark(state);
    
    // Status bar
    const partyStatus = state.party.map(m => {
      if (!m.alive) return `[${m.name.substring(0,4)}: DEAD]`;
      const bar = '█'.repeat(Math.floor(m.health / 10)) + '░'.repeat(10 - Math.floor(m.health / 10));
      const illness = m.illness ? ` ${m.illness.name.substring(0,3)}` : '';
      return `[${m.name.substring(0,4)}: ${bar}${illness}]`;
    }).join(' ');
    
    // Resources
    const res = state.resources;
    const resLine = `BW:${res.bandwidth} | DATA:${res.data} | SHLD:${res.shielding} | SCR:${res.scripts} | PATCH:${res.diskPatch}/${res.cablePatch}/${res.adapterPatch} | $${state.credits.toFixed(0)}`;
    
    // Travel info
    const weather = WEATHER_TYPES[state.weather].name;
    const travelInfo = `Day ${state.day} | ${getMonthName(state.month)} ${state.year} | ${weather} | ${state.milesTraveled}/${state.totalMiles} mi`;
    const nextInfo = next ? `Next: ${next.name} (${distNext} mi)` : 'Final destination ahead!';
    
    // Messages
    const msgLines = this.messageBuffer.map(m => formatMessage(m)).join('\n');
    
    const content = `
╔══════════════════════════════════════════════════════════════╗
${partyStatus}
${resLine}
${travelInfo} | ${nextInfo}
╠══════════════════════════════════════════════════════════════╣
${this.traveling ? '▶ TRAVELING...' : '■ STOPPED'}
${msgLines || 'Press SPACE to travel, or choose an option below.'}
╚══════════════════════════════════════════════════════════════╝
`;
    
    return {
      content,
      choices: this.traveling ? 
        [{ key: 'SPACE', text: 'Stop' }] :
        [
          { key: 'SPACE', text: 'Travel' },
          { key: '1', text: 'Change Pace' },
          { key: '2', text: 'Change Rations' },
          { key: '3', text: 'Rest' },
          { key: '4', text: 'Packet Capture' },
          { key: '5', text: 'Check Supplies' },
          { key: '6', text: 'Save Game' }
        ]
    };
  }
  
  handleInput(key) {
    if (key === ' ' || key === 'Space') {
      if (this.traveling) {
        this.stopTravel();
      } else {
        this.startTravel();
      }
      return;
    }
    
    if (this.traveling) return; // Ignore other inputs while traveling
    
    switch (key) {
      case '1':
        this.game.setState('pace');
        break;
      case '2':
        this.game.setState('rations');
        break;
      case '3':
        this.game.setState('rest');
        break;
      case '4':
        this.game.setState('hunt');
        break;
      case '5':
        this.game.setState('supplies');
        break;
      case '6':
        this.game.saveGame();
        break;
    }
  }
}

// =============================================================================
// PACE STATE
// =============================================================================

export class PaceState extends GameState {
  render() {
    const current = this.game.state.pace;
    
    let options = '';
    Object.entries(PACE_OPTIONS).forEach(([key, opt], i) => {
      const marker = key === current ? '► ' : '  ';
      options += `${marker}[${i + 1}] ${opt.name.padEnd(10)} - ${opt.description}\n`;
    });
    
    const content = `
╔══════════════════════════════════════════════════════════════╗
║                      CHANGE PACE                             ║
╚══════════════════════════════════════════════════════════════╝

Current pace: ${PACE_OPTIONS[current].name}

${options}

"Slow heals. Grueling kills. Choose wisely." — Malcolm
`;
    
    return {
      content,
      choices: [
        { key: '1', text: 'Slow' },
        { key: '2', text: 'Steady' },
        { key: '3', text: 'Grueling' },
        { key: 'ESC', text: 'Cancel' }
      ]
    };
  }
  
  handleInput(key) {
    const paces = ['slow', 'steady', 'grueling'];
    const num = parseInt(key) - 1;
    if (num >= 0 && num < paces.length) {
      this.game.state.pace = paces[num];
    }
    this.game.setState('travel');
  }
}

// =============================================================================
// RATIONS STATE
// =============================================================================

export class RationsState extends GameState {
  render() {
    const current = this.game.state.rations;
    
    let options = '';
    Object.entries(RATION_OPTIONS).forEach(([key, opt], i) => {
      const marker = key === current ? '► ' : '  ';
      options += `${marker}[${i + 1}] ${opt.name.padEnd(12)} - ${opt.description}\n`;
    });
    
    const content = `
╔══════════════════════════════════════════════════════════════╗
║                    CHANGE RATIONS                            ║
╚══════════════════════════════════════════════════════════════╝

Current rations: ${RATION_OPTIONS[current].name}
Data consumption: ${RATION_OPTIONS[current].consumption} packets/person/day

${options}

"Starving your party to save data is a classic mistake.
 They can't reach THE SOURCE if they're dead." — Malcolm
`;
    
    return {
      content,
      choices: [
        { key: '1', text: 'Bare-bones' },
        { key: '2', text: 'Meager' },
        { key: '3', text: 'Filling' },
        { key: 'ESC', text: 'Cancel' }
      ]
    };
  }
  
  handleInput(key) {
    const rations = ['bare-bones', 'meager', 'filling'];
    const num = parseInt(key) - 1;
    if (num >= 0 && num < rations.length) {
      this.game.state.rations = rations[num];
    }
    this.game.setState('travel');
  }
}

// =============================================================================
// REST STATE
// =============================================================================

export class RestState extends GameState {
  constructor(game) {
    super(game);
    this.days = 1;
  }
  
  enter() {
    this.days = 1;
  }
  
  render() {
    const state = this.game.state;
    const dataNeeded = state.party.filter(m => m.alive).length * 3 * this.days;
    
    const content = `
╔══════════════════════════════════════════════════════════════╗
║                        REST                                  ║
╚══════════════════════════════════════════════════════════════╝

Resting allows your party to recover health.
Each day of rest consumes data but heals your party.

Days to rest: ${this.days}
Data required: ${dataNeeded} packets (have ${state.resources.data})

Use ← → to adjust days, ENTER to confirm.

"Sometimes the best move is to stop moving." — Malcolm
`;
    
    return {
      content,
      choices: [
        { key: '←/→', text: 'Adjust Days' },
        { key: 'ENTER', text: 'Rest' },
        { key: 'ESC', text: 'Cancel' }
      ]
    };
  }
  
  handleInput(key) {
    if (key === 'ArrowLeft' && this.days > 1) {
      this.days--;
    } else if (key === 'ArrowRight' && this.days < 10) {
      this.days++;
    } else if (key === 'Enter') {
      restParty(this.game.state, this.days);
      this.game.setState('travel');
    } else if (key === 'Escape') {
      this.game.setState('travel');
    }
  }
}

// =============================================================================
// SUPPLIES STATE
// =============================================================================

export class SuppliesState extends GameState {
  render() {
    const state = this.game.state;
    const res = state.resources;
    
    let partyList = '';
    state.party.forEach(m => {
      const status = m.alive ? 
        `Health: ${m.health.toFixed(0)}%${m.illness ? ` (${m.illness.name})` : ''}` :
        'DECEASED';
      partyList += `  ${m.name}${m.isLeader ? ' (Leader)' : ''}: ${status}\n`;
    });
    
    const content = `
╔══════════════════════════════════════════════════════════════╗
║                    SUPPLY CHECK                              ║
╚══════════════════════════════════════════════════════════════╝

PARTY STATUS:
${partyList}

RESOURCES:
  Bandwidth Channels: ${res.bandwidth}
  Data Packets:       ${res.data}
  Shielding Layers:   ${res.shielding}
  Script Packages:    ${res.scripts}
  
PATCHES:
  Disk:    ${res.diskPatch}
  Cable:   ${res.cablePatch}
  Adapter: ${res.adapterPatch}

CREDITS: $${state.credits.toFixed(2)}
`;
    
    return {
      content,
      choices: [{ key: 'ENTER', text: 'Return' }]
    };
  }
  
  handleInput(key) {
    this.game.setState('travel');
  }
}

// =============================================================================
// EVENT STATE
// =============================================================================

export class EventState extends GameState {
  render() {
    const event = this.game.state.pendingEvent;
    if (!event) {
      this.game.setState('travel');
      return { content: '', choices: [] };
    }
    
    const typeColor = event.eventType === 'positive' ? '[ + ]' : 
                      event.eventType === 'negative' ? '[ ! ]' : '[ ? ]';
    
    const content = `
╔══════════════════════════════════════════════════════════════╗
║                      EVENT ${typeColor}                          ║
╚══════════════════════════════════════════════════════════════╝

${event.text}

${event.malcolmQuote ? `"${event.malcolmQuote}" — Malcolm` : ''}

Press ENTER to continue.
`;
    
    return {
      content,
      choices: [{ key: 'ENTER', text: 'Continue' }]
    };
  }
  
  handleInput(key) {
    if (key === 'Enter') {
      const event = this.game.state.pendingEvent;
      if (event) {
        applyEventEffect(this.game.state, event);
        this.game.state.pendingEvent = null;
      }
      this.game.setState('travel');
    }
  }
}

// =============================================================================
// HAZARD STATE
// =============================================================================

export class HazardState extends GameState {
  render() {
    const landmark = getCurrentLandmark(this.game.state);
    const hazard = HAZARD_EVENTS[landmark.id];
    if (!hazard) {
      this.game.setState('travel');
      return { content: '', choices: [] };
    }
    
    let choicesList = '';
    hazard.choices.forEach((choice, i) => {
      let reqText = '';
      if (choice.requires) {
        const reqs = Object.entries(choice.requires)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ');
        reqText = ` (Requires: ${reqs})`;
      }
      choicesList += `[${i + 1}] ${choice.text}${reqText}\n`;
    });
    
    const content = `
╔══════════════════════════════════════════════════════════════╗
║  HAZARD: ${hazard.title.padEnd(51)}║
╚══════════════════════════════════════════════════════════════╝

${hazard.description}

"${landmark.malcolmQuote}" — Malcolm

${choicesList}
`;
    
    return {
      content,
      choices: hazard.choices.map((c, i) => ({ key: `${i + 1}`, text: c.text }))
    };
  }
  
  handleInput(key) {
    const landmark = getCurrentLandmark(this.game.state);
    const hazard = HAZARD_EVENTS[landmark.id];
    if (!hazard) return;
    
    const num = parseInt(key) - 1;
    if (num >= 0 && num < hazard.choices.length) {
      const choice = hazard.choices[num];
      
      // Check requirements
      if (choice.requires) {
        for (const [res, amount] of Object.entries(choice.requires)) {
          if ((this.game.state.resources[res] || 0) < amount) {
            return; // Can't afford
          }
        }
      }
      
      // Apply effects
      const effect = choice.effect;
      if (effect.type === 'damage_all') {
        this.game.state.party.forEach(m => {
          if (m.alive) m.health = Math.max(0, m.health - effect.amount);
        });
      } else if (effect.type === 'cost') {
        for (const [res, amount] of Object.entries(effect)) {
          if (res !== 'type') {
            this.game.state.resources[res] = (this.game.state.resources[res] || 0) - amount;
          }
        }
      } else if (effect.type === 'days') {
        const days = effect.amount.min + Math.floor(Math.random() * (effect.amount.max - effect.amount.min + 1));
        this.game.state.day += days;
      }
      
      this.game.setState('travel');
    }
  }
}

// =============================================================================
// CROSSING STATE
// =============================================================================

export class CrossingState extends GameState {
  render() {
    const landmark = getCurrentLandmark(this.game.state);
    
    let methodsList = '';
    CROSSING_METHODS.forEach((method, i) => {
      let costText = '';
      if (method.cost) {
        if (method.cost.credits) costText = ` (-$${method.cost.credits})`;
        if (method.cost.shielding) costText = ` (-${method.cost.shielding} shielding)`;
        if (method.cost.days) costText = ` (-${method.cost.days.min}-${method.cost.days.max} days)`;
      }
      methodsList += `[${i + 1}] ${method.name.padEnd(15)} - ${method.description}${costText}\n`;
    });
    
    const content = `
╔══════════════════════════════════════════════════════════════╗
║  FIREWALL BREACH: ${landmark.name.padEnd(43)}║
╚══════════════════════════════════════════════════════════════╝

A firewall blocks your path. You must breach it to continue.

"${landmark.malcolmQuote}" — Malcolm

${methodsList}
`;
    
    return {
      content,
      choices: CROSSING_METHODS.map((m, i) => ({ key: `${i + 1}`, text: m.name }))
    };
  }
  
  handleInput(key) {
    const num = parseInt(key) - 1;
    if (num >= 0 && num < CROSSING_METHODS.length) {
      const method = CROSSING_METHODS[num];
      const state = this.game.state;
      
      // Check cost
      if (method.cost) {
        if (method.cost.credits && state.credits < method.cost.credits) return;
        if (method.cost.shielding && state.resources.shielding < method.cost.shielding) return;
      }
      
      // Apply cost
      if (method.cost) {
        if (method.cost.credits) state.credits -= method.cost.credits;
        if (method.cost.shielding) state.resources.shielding -= method.cost.shielding;
        if (method.cost.days) {
          const days = method.cost.days.min + Math.floor(Math.random() * (method.cost.days.max - method.cost.days.min + 1));
          state.day += days;
        }
      }
      
      // Roll for damage
      if (Math.random() < method.baseDamageChance) {
        state.party.forEach(m => {
          if (m.alive) m.health = Math.max(0, m.health - method.baseDamage);
        });
        state.resources.data = Math.floor(state.resources.data * (1 - method.dataLossPercent));
      }
      
      this.game.setState('travel');
    }
  }
}

// =============================================================================
// LANDMARK STATE
// =============================================================================

export class LandmarkState extends GameState {
  render() {
    const landmark = getCurrentLandmark(this.game.state);
    
    const content = `
╔══════════════════════════════════════════════════════════════╗
║  ARRIVED: ${landmark.name.padEnd(50)}║
╚══════════════════════════════════════════════════════════════╝

${landmark.description}

"${landmark.malcolmQuote}" — Malcolm

${landmark.hasStore ? 'This location has a supply depot.' : ''}
`;
    
    const choices = [];
    if (landmark.hasStore) {
      choices.push({ key: '1', text: 'Visit Supply Depot' });
    }
    choices.push({ key: 'ENTER', text: 'Continue Journey' });
    
    return { content, choices };
  }
  
  handleInput(key) {
    const landmark = getCurrentLandmark(this.game.state);
    
    if (key === '1' && landmark.hasStore) {
      this.game.setState('store');
    } else {
      this.game.setState('travel');
    }
  }
}

// =============================================================================
// HUNT STATE (Packet Capture placeholder)
// =============================================================================

export class HuntState extends GameState {
  render() {
    const state = this.game.state;
    
    const content = `
╔══════════════════════════════════════════════════════════════╗
║                    PACKET CAPTURE                            ║
╚══════════════════════════════════════════════════════════════╝

Scripts Available: ${state.resources.scripts} (5 shots each)

[PACKET CAPTURE MINIGAME]

In the full version, you would aim and shoot at packets floating
across the viewport. For now, this is a simplified version.

Press ENTER to attempt a capture run.
(Uses 1 script package, can gather 10-50 data)

"Every packet you catch is a piece of someone's story.
 Don't let it go to waste." — Malcolm
`;
    
    return {
      content,
      choices: [
        { key: 'ENTER', text: 'Start Capture' },
        { key: 'ESC', text: 'Cancel' }
      ]
    };
  }
  
  handleInput(key) {
    if (key === 'Enter') {
      const state = this.game.state;
      if (state.resources.scripts >= 1) {
        state.resources.scripts -= 1;
        const captured = 10 + Math.floor(Math.random() * 41);
        state.resources.data += captured;
        // Add message
        state.recentMessages = [{ type: 'success', text: `Captured ${captured} data packets!` }];
      }
      this.game.setState('travel');
    } else if (key === 'Escape') {
      this.game.setState('travel');
    }
  }
}

// =============================================================================
// GAME OVER STATE
// =============================================================================

export class GameOverState extends GameState {
  render() {
    const state = this.game.state;
    const leader = state.party.find(m => m.isLeader);
    const cause = leader.illness ? leader.illness.name : 'system failure';
    
    const content = `
╔══════════════════════════════════════════════════════════════╗
║                    JOURNEY'S END                             ║
╚══════════════════════════════════════════════════════════════╝

Your party has been de-rezzed.

${leader.name} has died of ${cause}.

  Miles traveled: ${state.milesTraveled} / ${state.totalMiles}
  Days elapsed: ${state.day}
  Survivors: ${state.party.filter(m => m.alive).length} / 5

"Another signal lost to the static.
 But the Grid remembers. The Grid always remembers."
                                        — Malcolm Frink
`;
    
    return {
      content,
      choices: [
        { key: '1', text: 'Try Again' },
        { key: '2', text: 'Return to Menu' }
      ]
    };
  }
  
  handleInput(key) {
    if (key === '1') {
      this.game.reset();
      this.game.setState('profession');
    } else if (key === '2') {
      this.game.reset();
      this.game.setState('title');
    }
  }
}

// =============================================================================
// VICTORY STATE
// =============================================================================

export class VictoryState extends GameState {
  render() {
    const state = this.game.state;
    const survivors = state.party.filter(m => m.alive).length;
    const score = calculateFinalScore(state);
    
    const content = `
╔══════════════════════════════════════════════════════════════╗
║           YOU HAVE REACHED THE SOURCE                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  "You made it. I've been waiting here for thirty years,     ║
║   watching others fail. But you—you actually did it.        ║
║                                                              ║
║   Welcome to the other side."                                ║
║                                        — Malcolm Frink       ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  SURVIVORS: ${survivors}/5                                          ║
║  DAYS: ${state.day.toString().padEnd(5)}                                            ║
║  DATA REMAINING: ${state.resources.data.toString().padEnd(5)}                                  ║
║                                                              ║
║  PROFESSION: ${PROFESSIONS[state.profession].name.padEnd(12)} (×${PROFESSIONS[state.profession].multiplier})                  ║
║  FINAL SCORE: ${score.toString().padEnd(10)}                                    ║
╚══════════════════════════════════════════════════════════════╝
`;
    
    return {
      content,
      choices: [
        { key: '1', text: 'New Journey' },
        { key: '2', text: 'Return to Menu' }
      ]
    };
  }
  
  handleInput(key) {
    if (key === '1') {
      this.game.reset();
      this.game.setState('profession');
    } else if (key === '2') {
      this.game.reset();
      this.game.setState('title');
    }
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getMonthName(month) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[month - 1] || 'Jan';
}

function formatMessage(msg) {
  const prefixes = {
    danger: '⚠ ',
    success: '✓ ',
    info: '► ',
    warning: '! ',
    landmark: '★ ',
    death: '✝ '
  };
  return (prefixes[msg.type] || '  ') + msg.text;
}

function calculateFinalScore(state) {
  let score = 0;
  
  // Survivors
  for (const m of state.party) {
    if (m.alive) score += m.isLeader ? 200 : 100;
  }
  
  // Resources
  score += Math.floor(state.resources.data / 5);
  score += state.resources.bandwidth * 10;
  score += state.resources.shielding * 5;
  score += state.resources.scripts * 2;
  score += Math.floor(state.credits / 2);
  
  // Speed bonus
  if (state.day < 120) {
    score += Math.floor((120 - state.day) * 2);
  }
  
  // Profession multiplier
  return Math.floor(score * PROFESSIONS[state.profession].multiplier);
}

// =============================================================================
// EXPORT ALL STATES
// =============================================================================

export const STATES = {
  title: TitleState,
  about: AboutState,
  profession: ProfessionState,
  names: NamesState,
  month: MonthState,
  store: StoreState,
  travel: TravelState,
  pace: PaceState,
  rations: RationsState,
  rest: RestState,
  supplies: SuppliesState,
  event: EventState,
  hazard: HazardState,
  crossing: CrossingState,
  landmark: LandmarkState,
  hunt: HuntState,
  gameover: GameOverState,
  victory: VictoryState
};
