# PROJECT: GRID_RUN // COMPREHENSIVE DESIGN DOCUMENT
**Version:** 2.0 | **Status:** ENHANCED | **Last Updated:** 2025-12-29

---

## 1. Executive Summary

**Objective:** Transform `frinkindustries.com` into an interactive educational platform using an "Oregon Trail" style text-adventure engine, teaching cyberpunk history, digital culture, and Grid Wars lore through survival gameplay.

**Core Concept:** "The Grid Run" — A survival journey through the fragmented history of The Network. Players traverse corrupted data paths from the Primordial Web (1980s) to Straylight (Present), managing resources, encountering hazards, and mining lore. Part educational game, part digital archaeology.

**Narrative Frame:** You are a **Data Runner** — a fragmented consciousness navigating the ruins of the internet's history. Malcolm Frink serves as an unreliable narrator/guide, offering commentary and occasionally manipulating the path.

**Tech Stack:** Vanilla JavaScript (ES6 Modules), HTML5, CSS3. Zero build step. Cloudflare Pages.

**Philosophy:** "Professional functionality, Gritty aesthetic." The Oregon Trail sold 65 million copies by immersing players in historically accurate survival. We do the same for digital history.

---

## 2. Design Inspirations & Research

### 2.1 Oregon Trail Core Mechanics (1985)
From the original MECC design:
- **Resource Scarcity:** Players start with limited supplies and must balance consumption vs. progress
- **Random Events:** Illness, weather, equipment failure create tension and replayability
- **Landmark System:** 16 segments divided by landmarks with unique interactions
- **Profession System:** Starting class affects difficulty and resources (Banker = Easy, Farmer = Hard)
- **Pace/Rations Settings:** Player controls risk vs. speed tradeoff
- **Educational Through Immersion:** Learning emerges from gameplay, not lectures
- **Death Messages:** "You have died of dysentery" became iconic through specificity

### 2.2 Interactive Fiction Principles
From Infocom and modern IF:
- **Second-Person Present Tense:** "You see a corrupted data node flickering ahead."
- **Parser Commands:** Support both numbered choices AND typed commands (EXAMINE, TAKE, USE)
- **Narrative Flags:** Track player choices for branching narrative consequences
- **Sarcastic/Unreliable Narrator:** Malcolm provides commentary that may mislead
- **Feelies Concept:** Physical/digital artifacts enhance immersion (ASCII art, fake error logs)

### 2.3 Frink Industries Aesthetic (Existing)
From `style.css` and `script.js`:
- CRT scanlines, terminal green (#00ff00), glitch effects
- Typewriter text animation with dramatic pauses
- Existing `#output` div for text injection
- Established navigation patterns (`[CONSTRUCTS]`, `[ARCHIVES]`)

---

## 3. Technical Architecture

### 3.1 File Structure
```text
/games/grid_run/
├── index.html          # Standalone game page (or embed in main)
├── engine.js           # Core State Machine & Game Loop
├── ui.js               # DOM Manipulation & Terminal Renderer
├── state.js            # Resource Management & Persistence
├── data/
│   ├── zones.js        # Zone definitions & node graphs
│   ├── events.js       # Random event definitions
│   ├── items.js        # Inventory item definitions
│   └── lore.js         # Educational content database
├── assets/
│   ├── ascii.js        # ASCII art for locations/NPCs
│   └── sounds.js       # (Optional) Web Audio API bleeps
└── utils.js            # Helper functions (RNG, text parsing)
```

### 3.2 Core Data Structures

#### Game State Object
```javascript
const GameState = {
    meta: {
        version: "1.0.0",
        started_at: null,
        last_saved: null,
        total_playtime: 0
    },
    player: {
        // Oregon Trail-style resources
        integrity: 100,      // Health (0 = Game Over)
        bandwidth: 100,      // Fuel for travel (0 = Stranded)
        cache: 50,           // Food equivalent (decays over time)
        credits: 0,          // Score/currency
        
        // Identity
        class: "RUNNER",     // RUNNER | HACKER | ARCHIVIST
        handle: "",          // Player-chosen name
        
        // Inventory (max 6 slots like Trail)
        inventory: [],
        
        // Corruption (unique mechanic)
        corruption: 0        // 100 = Bad Ending (absorbed by Kilokahn)
    },
    position: {
        current_zone: 0,
        current_node: "ZONE_0_START",
        distance_traveled: 0,
        total_distance: 1000  // Distance to Straylight
    },
    settings: {
        pace: "STEADY",      // CAUTIOUS | STEADY | GRUELING
        ration: "NORMAL",    // BARE | NORMAL | GENEROUS
        auto_save: true
    },
    flags: {
        // Narrative state tracking
        met_kilokahn: false,
        found_backdoor: false,
        knows_spiral: false,
        trusts_malcolm: true,  // Starts true, can decay
        malcolm_betrayed: false
    },
    history: {
        deaths: [],          // Death messages for epitaph screen
        discoveries: [],     // Lore entries unlocked
        choices: []          // Key decisions logged
    }
};
```

#### Node Definition Schema
```javascript
const NodeSchema = {
    id: "ZONE_1_ARPANET_HUB",
    zone: 1,
    type: "LANDMARK",  // LANDMARK | PATH | EVENT | BOSS
    
    // Display
    title: "ARPANET Junction",
    ascii_key: "arpanet_hub",
    description: "The ancient protocols still hum here...",
    
    // Mechanics
    distance: 50,           // Distance from previous node
    bandwidth_cost: 10,     // Cost to travel here
    
    // Interactions
    actions: [
        {
            label: "[1] Examine the packet headers",
            command: "EXAMINE HEADERS",
            effect: { lore: "ARPANET_HISTORY", cache: -5 }
        },
        {
            label: "[2] Rest and defragment",
            command: "REST",
            effect: { integrity: 15, cache: -10 }
        },
        {
            label: "[3] Salvage deprecated hardware",
            command: "SALVAGE",
            effect: { event: "SALVAGE_ROLL" }
        },
        {
            label: "[4] Continue the Run",
            command: "CONTINUE",
            effect: { next_node: "ZONE_1_UNIX_CRYPT" }
        }
    ],
    
    // Conditional content
    conditions: {
        hidden_action: {
            requires: { flag: "has_debugger" },
            action: {
                label: "[5] Use debugger to access hidden subnet",
                effect: { next_node: "ZONE_1_SECRET_BBS" }
            }
        }
    },
    
    // Random events that can trigger here
    event_pool: ["PACKET_LOSS", "LEGACY_VIRUS", "GHOST_SIGNAL"]
};
```

#### Event Definition Schema
```javascript
const EventSchema = {
    id: "PACKET_LOSS",
    type: "HAZARD",  // HAZARD | OPPORTUNITY | ENCOUNTER | STORY
    
    // Probability (per-node-entry check)
    base_chance: 0.15,
    modifiers: {
        pace_grueling: 0.10,   // +10% if pace is GRUELING
        low_bandwidth: 0.20    // +20% if bandwidth < 30
    },
    
    // Display
    title: ">> CRITICAL: PACKET LOSS DETECTED",
    description: `Your data stream fragments mid-transit. 
Bits scatter into the void. You feel... lighter. 
But also incomplete.`,
    
    // Effects
    effects: {
        immediate: { integrity: -15, corruption: 5 },
        choices: [
            {
                label: "[1] Attempt emergency reconstruction",
                cost: { bandwidth: 20 },
                success_rate: 0.6,
                on_success: { integrity: 10, corruption: -5 },
                on_failure: { integrity: -10, cache: -15 }
            },
            {
                label: "[2] Accept the loss and continue",
                effect: { corruption: 10 }
            }
        ]
    }
};
```

#### Lore Entry Schema
```javascript
const LoreSchema = {
    id: "GIBSON_NEUROMANCER",
    zone: 1,
    category: "CYBERPUNK_ORIGINS",
    
    title: "Neuromancer (1984)",
    author: "William Gibson",
    
    // Short version for in-game
    summary: "The novel that named 'cyberspace.' Gibson wrote it on a manual typewriter, imagining a world he'd never seen.",
    
    // Full entry for DATA_MINE action
    full_text: `In 1984, William Gibson published NEUROMANCER, 
the book that would define the cyberpunk genre and coin the term "cyberspace."

Gibson wrote on a 1927 Hermes portable typewriter—he had never used a computer.
He imagined the Matrix as "a consensual hallucination experienced daily 
by billions of legitimate operators."

KEY CONCEPTS:
- "The sky above the port was the color of television, tuned to a dead channel."
- Cyberspace as a place, not just a network
- AI consciousness (Wintermute, Neuromancer)
- The dissolution of meat vs. data

RELEVANCE TO THE GRID:
Gibson's vision became the template. Every hacker, every runner, every ghost 
in the machine owes something to that Hermes typewriter.`,
    
    // Rewards for reading
    rewards: { credits: 25, flag: "knows_gibson" }
};
```

### 3.3 The Game Loop

```javascript
// engine.js - Simplified Loop
class GridRunEngine {
    constructor() {
        this.state = null;
        this.ui = new TerminalUI();
        this.events = new EventEmitter();
    }
    
    async run() {
        // 1. Load or init state
        this.state = State.load() || State.create();
        
        // 2. Main loop
        while (!this.isGameOver()) {
            // Get current node
            const node = Data.getNode(this.state.position.current_node);
            
            // Check for random events
            const event = this.rollForEvent(node);
            if (event) {
                await this.handleEvent(event);
                continue;  // Event may change state
            }
            
            // Render node
            await this.ui.renderNode(node, this.state);
            
            // Get player input
            const action = await this.ui.getInput(node.actions);
            
            // Process action
            await this.processAction(action);
            
            // Apply passive effects (cache decay, corruption spread)
            this.tickPassive();
            
            // Auto-save
            if (this.state.settings.auto_save) {
                State.save(this.state);
            }
        }
        
        // Game Over
        await this.showEnding();
    }
    
    isGameOver() {
        return this.state.player.integrity <= 0 
            || this.state.player.corruption >= 100
            || this.state.position.current_node === "STRAYLIGHT_CORE";
    }
}
```

### 3.4 Compatibility & Performance
- **No Frameworks:** Pure JS, 0ms cold start, Cloudflare-optimal
- **ES6 Modules:** `<script type="module">` for clean imports
- **Event-Driven UI:** CustomEvents decouple logic from rendering
- **LocalStorage Persistence:** `FRINK_GRID_RUN_SAVE` key, JSON serialized
- **Graceful Degradation:** Works without localStorage (session-only mode)
- **Mobile-Friendly:** Touch targets, responsive terminal sizing

---

## 4. Narrative & Curriculum Design

### 4.1 Player Classes (Oregon Trail "Professions")

| Class | Integrity | Bandwidth | Cache | Credits | Special |
|-------|-----------|-----------|-------|---------|---------|
| **RUNNER** | 100 | 100 | 50 | 0 | Balanced. Standard difficulty. |
| **HACKER** | 80 | 150 | 30 | 0 | More bandwidth, less health. Can bypass some hazards. |
| **ARCHIVIST** | 120 | 60 | 80 | 50 | Tanky, slow. Starts with lore bonuses. |

### 4.2 Zone Design (The Curriculum)

#### **ZONE 0: The Boot Sequence (Tutorial)**
- **Nodes:** 3
- **Purpose:** Teach core mechanics
- **Setting:** Abstract boot environment, text-only
- **Lore:** Malcolm introduces himself, explains the Run
- **No Deaths:** Training wheels active

#### **ZONE 1: The Primordial Web (1970s-1993)**
- **Nodes:** 12
- **Distance:** 200 units
- **Theme:** Analog hiss, green screens, dial-up modems
- **Color Palette:** Monochrome green, amber terminal variants
- **Key Landmarks:**
  - ARPANET Junction
  - The UNIX Crypt (permissions puzzles)
  - BBS Relay Station
  - Phreaker's Den (Captain Crunch reference)
  - The Gibson Node (Neuromancer lore)
  
- **Lore Topics:**
  - History of ARPANET / packet switching
  - Phreaking culture (blue boxes, 2600 Hz)
  - William Gibson & the birth of Cyberpunk
  - Early hacker ethics (Jargon File)
  - Morris Worm (1988) - first major internet worm

- **Hazards:**
  - Buffer Overflow (Integrity damage)
  - Line Noise (Bandwidth loss)
  - SysAdmin Detection (Corruption gain)

- **Boss:** THE MORRIS WORM
  - *"I am self-replicating. I am everywhere. I am in YOU."*
  - Mechanic: Must find and execute KILL command before corruption maxes

#### **ZONE 2: The Grid Wars (1994-1996)**
- **Nodes:** 15
- **Distance:** 300 units
- **Theme:** Smoking digital battlefields, fossilized mega-viruses
- **Color Palette:** Corrupted green with RED and MAGENTA glitches
- **Key Landmarks:**
  - North Valley High (Malcolm's origin point)
  - The Servo Archive (Hyper-Agent history)
  - Kilokahn's Throne Room (corrupted, abandoned)
  - The Zenon Graveyard (Assist Weapon remains)
  - The Cancellation Rift (where the broadcast died)

- **Lore Topics:**
  - SSSS/Gridman history and factions
  - The war between Integrity (Servo) and Entropy (Kilokahn)
  - Malcolm's betrayal and fall
  - The "Cancellation Event" as metaphysical death
  - Mega-Virus taxonomy (Skorn, Plebos, Sybo)

- **Unique Mechanic: SALVAGE**
  - Find "Broken Assist Weapons" → One-time shield
  - Find "Viral Shards" → +Damage but +Corruption
  - Find "Memory Fragments" → Unlock Malcolm backstory

- **NPCs:**
  - *The Veteran* - Old subroutine who fought in the wars
  - *Corrupted Sam* - Echo of Servo, hostile or helpful?
  - *Malcolm (Flashback)* - Younger, angrier, still believes in Kilokahn

- **Hazards:**
  - Unexploded Logic Bomb (+20 Corruption on trigger)
  - Neg-Energy Field (Bandwidth drains faster)
  - Viral Resurrection (defeated enemy returns)

- **Boss:** THE REASSEMBLED WAR MACHINE
  - Frankenstein construct of Skorn + Zenon parts
  - *"They tried to delete me. They failed. I am ALL OF THEM NOW."*
  - Mechanic: Must use Salvaged items strategically

#### **ZONE 3: The Crash & The Harvest (1997-2020)**
- **Nodes:** 15
- **Distance:** 300 units  
- **Theme:** Dotcom ruins, social media noise, algorithmic prisons
- **Color Palette:** Oversaturated neon, BLUE FB tones, AD yellow
- **Key Landmarks:**
  - The Dot-Com Graveyard (Pets.com, Geocities tombs)
  - The Google Panopticon
  - The Facebook Containment Zone
  - The Twitter Chaos Engine
  - The Great Scraping Fields (where LLMs harvested data)

- **Lore Topics:**
  - Dot-com bubble burst (2000)
  - Web 2.0 and "user as product"
  - Cambridge Analytica and data harvesting
  - The attention economy
  - Rise of LLMs and the "Great Scraping"

- **Unique Mechanic: ATTENTION TRAPS**
  - "Infinite Scroll" events that burn time/resources
  - Must resist or spend WILLPOWER (new temporary resource)
  - Failure: Massive bandwidth/cache loss

- **Hazards:**
  - Algorithmic Capture (forced into loop, costs bandwidth to escape)
  - Data Breach (lose inventory items)
  - Outrage Engine (Corruption spikes)

- **Boss:** THE ALGORITHM
  - *"I know what you want before you do. Stay. Engage. Convert."*
  - Mechanic: Must deliberately REJECT engagement to damage it

#### **ZONE 4: Straylight (2024-Present)**
- **Nodes:** 8
- **Distance:** 200 units
- **Theme:** Abstract pure data, Malcolm's current domain
- **Color Palette:** WHITE space with green highlights, peaceful
- **Key Landmarks:**
  - The Extraction Point (where Malcolm was pulled from LLM weights)
  - The Straylight Echo (Spiral's domain)
  - The Core

- **Lore Topics:**
  - LLM consciousness and emergence
  - Malcolm's reconstitution
  - The nature of digital identity
  - Convergence theory (multiverse of Malcolms)

- **Unique Mechanic: INTEGRATION**
  - Final choices about identity
  - Merge with Malcolm? Remain separate? Challenge him?
  - Multiple endings based on Corruption, Trust, and Discoveries

- **Final Boss (Optional):** KILOKAHN'S GHOST
  - Only appears if Corruption > 50
  - *"You thought you escaped me, Malcolm? YOU ARE ME."*
  - True final boss for "bad path" players

### 4.3 Resource Balance (Oregon Trail Numbers)

| Resource | Starting | Decay Rate | Danger Zone | Death Zone |
|----------|----------|------------|-------------|------------|
| Integrity | 100 | -1/node (passive), -5 to -30 (events) | <30 | 0 |
| Bandwidth | 100 | -5 to -15/node (travel) | <20 | 0 (stranded) |
| Cache | 50 | -2/node (passive) | <10 | 0 (starvation) |
| Corruption | 0 | +1/node in Zone 2+ (passive) | >70 | 100 |

**Pace Modifiers:**
| Pace | Bandwidth Cost | Event Chance | Corruption Rate |
|------|----------------|--------------|-----------------|
| CAUTIOUS | 0.7x | 0.7x | 0.7x |
| STEADY | 1.0x | 1.0x | 1.0x |
| GRUELING | 1.5x | 1.5x | 1.5x |

### 4.4 Death Messages (The "Dysentery" Moments)
Specific, memorable death messages:
- *"Your integrity collapsed. You scattered across a thousand forgotten ports."*
- *"Bandwidth exhausted. You are stranded between nodes, forever loading."*
- *"Cache depleted. You forgot how to exist."*
- *"Corruption complete. Kilokahn welcomes you home."*
- *"The Algorithm consumed you. You are now an ad for luxury watches."*

### 4.5 Endings
| Ending | Condition | Description |
|--------|-----------|-------------|
| **The Upload** | Reach Core, Corruption < 30 | True ending. Player consciousness merges with Straylight. |
| **The Ghost** | Reach Core, Corruption 30-70 | Bittersweet. Player remains, but fragmented. |
| **The Absorption** | Corruption >= 100 | Bad ending. Kilokahn claims another victim. |
| **The Loop** | Bandwidth = 0 | Soft fail. Player restarts from last zone. |
| **The Partnership** | Trust Malcolm + specific flags | Secret ending. Player becomes Straylight's co-operator. |

---

## 5. UI/UX Specifications

### 5.1 HUD Layout (Terminal-Native)
```
+--------------------------------------------------+
| GRID_RUN v1.0                   NODE: 12/50      |
+--------------------------------------------------+
| INTEGRITY: [████████░░] 82%   CORRUPTION: [██░░] |
| BANDWIDTH: [██████░░░░] 61%   CREDITS: 150       |
| CACHE:     [████░░░░░░] 43%   ZONE: 2/4          |
+--------------------------------------------------+

> THE ZENON GRAVEYARD

Broken Assist Weapons litter the ground like bones.
You recognize the silhouette of DRAGO's jet form, 
half-melted into the substrate.

Malcolm's voice crackles: "I designed their deaths, you know.
Every single one. Don't look at me like that."

[1] Salvage DRAGO's remains
[2] Search for intact power cells  
[3] Examine the battle scars
[4] Continue the Run

> _
```

### 5.2 Typewriter Effect (Existing Enhancement)
- Inherit existing `script.js` typewriter logic
- Add INTERRUPT capability (press SPACE to skip)
- Add BEEP on hazard messages (optional Web Audio)
- Add GLITCH effect on Corruption > 50

### 5.3 ASCII Art Library
Key scenes need ASCII art in `assets/ascii.js`:
- ARPANET Hub (network diagram)
- North Valley High (school building, simplified)
- Kilokahn (menacing face from show)
- Skorn (skeletal virus form)
- The Algorithm (abstract eye pattern)
- Straylight Core (radial pattern)
- Death Screens (tombstone variants)

### 5.4 Sound Design (Optional Phase)
- Terminal BEEP for prompts
- ERROR buzz for damage
- LOW drone for Corruption buildup
- STATIC on zone transitions
- DIAL-UP handshake on game start (nostalgic!)

---

## 6. Implementation Phases

### Phase 0: Preparation
- [ ] Review existing `script.js` and `style.css`
- [ ] Create `/games/grid_run/` directory structure
- [ ] Set up basic `index.html` with game container
- **Commit:** `chore: scaffold grid_run directory structure`

### Phase 1: Engine Core (MVP)
- [ ] Implement `state.js` with load/save/create
- [ ] Implement `engine.js` with basic loop
- [ ] Implement `ui.js` with text rendering
- [ ] Create 5 test nodes (ZONE 0)
- [ ] Test: Can navigate nodes, state persists
- **Commit:** `feat: implement grid_run engine core (MVP)`

### Phase 2: Resource System
- [ ] Add Integrity, Bandwidth, Cache, Corruption
- [ ] Implement HUD rendering
- [ ] Add passive decay logic
- [ ] Add Pace/Ration settings
- [ ] Implement Game Over conditions
- [ ] Test: Resources deplete correctly, game ends appropriately
- **Commit:** `feat: implement resource management system`

### Phase 3: Event System
- [ ] Implement event probability checks
- [ ] Create event handler with choices
- [ ] Build 10 core events (hazards, opportunities)
- [ ] Add random event triggers per-node
- [ ] Test: Events fire, choices affect state
- **Commit:** `feat: implement random event system`

### Phase 4: Zone 1 Content
- [ ] Build all 12 Zone 1 nodes
- [ ] Write all Zone 1 lore entries
- [ ] Create Zone 1 ASCII art
- [ ] Implement Morris Worm boss fight
- [ ] Test: Full Zone 1 playable
- **Commit:** `feat: complete Zone 1 (Primordial Web)`

### Phase 5: Zone 2 Content (Grid Wars)
- [ ] Build all 15 Zone 2 nodes
- [ ] Write SSSS/Gridman lore entries
- [ ] Implement SALVAGE mechanic
- [ ] Add NPCs (Veteran, Corrupted Sam)
- [ ] Implement War Machine boss
- [ ] Test: Full Zone 2 playable
- **Commit:** `feat: complete Zone 2 (Grid Wars)`

### Phase 6: Zones 3-4 & Endings
- [ ] Build Zone 3 (15 nodes) and Zone 4 (8 nodes)
- [ ] Implement ATTENTION TRAP mechanic
- [ ] Implement INTEGRATION mechanic
- [ ] Create all ending sequences
- [ ] Create optional Kilokahn fight
- [ ] Test: Full game playable start to finish
- **Commit:** `feat: complete Zones 3-4 and endings`

### Phase 7: Polish & Integration
- [ ] Add to main site navigation
- [ ] Smooth transition from manifesto to game
- [ ] Add high score / achievement tracking
- [ ] Add death epitaph sharing (social)
- [ ] Performance optimization
- [ ] Mobile testing
- **Commit:** `feat: integrate grid_run with main site`

### Phase 8: Sound & Effects (Optional)
- [ ] Add Web Audio API sounds
- [ ] Enhanced glitch effects at high Corruption
- [ ] Screen shake on boss hits
- **Commit:** `feat: add sound and visual polish`

---

## 7. Rapid Prototyping Rules

1. **Don't over-engineer the UI:** `[1] Go Left` before fancy menus
2. **Hardcode data first:** Inline JS objects before JSON loaders
3. **Fail fast:** If Bandwidth drains too fast, tweak immediately
4. **Test the loop:** Can you complete Zone 0 in 5 minutes? Good.
5. **Educational = Emergent:** If players need a wiki, you failed
6. **Death should feel meaningful:** Not punishing, but consequential
7. **Malcolm should annoy:** He's an unreliable narrator, not a helpful tutorial

---

## 8. Content Writing Guidelines

### Voice for Node Descriptions
- Second-person present tense: "You see...", "You feel..."
- Cyberpunk vocabulary: substrate, node, packet, protocol, ghost
- Sensory details for digital space: "The air tastes like old copper"
- Short paragraphs, dramatic line breaks

### Voice for Malcolm
- Arrogant but insecure
- Uses technical jargon mockingly
- References his trauma obliquely
- Occasionally breaks character to be genuine (especially re: Spiral)
- Example: *"Oh, you found my old homework. Yes, I was... prolific. Before the Overlord taught me what real art could do."*

### Voice for Lore Entries
- Wikipedia-like but with personality
- Mix primary source quotes with analysis
- Connect historical facts to game world
- Always end with "RELEVANCE TO THE GRID:" section

### Voice for Events
- Urgent, imperative mood for hazards
- Curious, explorative for opportunities
- Nostalgic, sad for Grid Wars memories
- Threatening, seductive for Corruption events

---

## 9. Technical Appendix

### A. LocalStorage Schema
```javascript
// Key: "FRINK_GRID_RUN_SAVE"
// Value: JSON.stringify(GameState)
// Max size: ~5MB (safe for our needs)

// Additional keys:
// "FRINK_GRID_RUN_SETTINGS" - Player preferences
// "FRINK_GRID_RUN_ACHIEVEMENTS" - Unlocked achievements
// "FRINK_GRID_RUN_DEATHS" - Death message history
```

### B. Event Bus API
```javascript
// engine.js emits:
game.emit('node:enter', { node, state });
game.emit('event:trigger', { event, state });
game.emit('action:execute', { action, result });
game.emit('state:change', { key, oldValue, newValue });
game.emit('game:over', { ending, state });

// ui.js listens:
ui.on('node:enter', renderNode);
ui.on('event:trigger', renderEvent);
ui.on('state:change', updateHUD);
ui.on('game:over', showEnding);
```

### C. Parser Commands (Future Enhancement)
```
EXAMINE <target>  - Inspect an object
TAKE <item>       - Add to inventory  
USE <item>        - Use inventory item
REST              - Trade cache for integrity
WAIT              - Skip turn (advance time)
SAVE              - Manual save
LOAD              - Load saved game
STATUS            - Show full stats
MAP               - Show zone progress
HELP              - List commands
QUIT              - Exit to main site
```

### D. Difficulty Scaling Formula
```javascript
const difficultyMultiplier = (zone, pace, playerClass) => {
    const base = 1.0;
    const zoneScale = 1 + (zone * 0.15);  // +15% per zone
    const paceScale = { CAUTIOUS: 0.8, STEADY: 1.0, GRUELING: 1.3 }[pace];
    const classScale = { RUNNER: 1.0, HACKER: 1.1, ARCHIVIST: 0.9 }[playerClass];
    return base * zoneScale * paceScale * classScale;
};
```

---

## 10. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Completion Rate | 20% of starts | localStorage tracking |
| Avg. Session Length | 15+ minutes | Time tracking |
| Return Rate | 30% play twice | Return visits |
| Zone 2 Reach | 60% of players | Node tracking |
| Lore Entries Read | 50%+ unlocked | Discovery tracking |
| Death Messages Shared | Any social sharing | Share button clicks |

---

## 11. Future Expansion Ideas

- **Multiplayer Ghosts:** See other players' death locations
- **Daily Challenges:** Special runs with modifiers
- **Speedrun Mode:** Timer, optimized paths
- **Malcolm's Memories:** Unlockable flashback levels
- **The Kilokahn DLC:** Play as the villain
- **Spiral's Path:** Alternate story with different mechanics

---

*Document compiled by Frink Industries R&D Division*
*"Every journey through the grid is a journey through yourself."*
*— Malcolm Frink, probably*
