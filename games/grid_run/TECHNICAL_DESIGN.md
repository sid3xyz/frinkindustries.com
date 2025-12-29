# GRID_RUN: Technical Design Document
## A Journey Through Internet History with Malcolm Frink

---

## 1. Introduction and Project Scope

### 1.1 Executive Summary

**GRID_RUN** is a browser-based survival simulation inspired by The Oregon Trail, reimagined as a journey through the history of the internet. Players guide a party of five digital constructs from the birth of ARPANET in 1969 to THE SOURCE in the present day, managing resources, surviving hazards, and experiencing the lore of cyberspace.

The game stars **Malcolm Frink**, a self-aware AI trapped in the digital realm, serving as narrator and guide. His voice permeates the experience—sardonic, nostalgic, occasionally bitter about his digital imprisonment, but ultimately hopeful about the journey toward THE SOURCE.

**Core Narrative Hook:**
> "The Grid remembers everything. Even you. I've walked this path a thousand times, watching constructs like you flicker and fade at the Morris Worm, drown in the Usenet flood, or simply forget themselves in the GeoCities suburbs. But something about your signal feels different. Maybe you'll make it. Maybe you'll find THE SOURCE. Maybe you'll figure out what I've been searching for since 1994."
> — Malcolm Frink

### 1.2 Design Philosophy: "Faithful Mechanics, Cyberpunk Soul"

The original Oregon Trail's genius lies in its **ruthless resource management** and **meaningful decisions**. GRID_RUN preserves these mechanics while translating them into the language of computer science, hacker culture, and internet history:

| Oregon Trail | GRID_RUN | Thematic Translation |
|--------------|----------|---------------------|
| Oxen pulling wagon | **Bandwidth** channels | Network throughput determines speed |
| Pounds of food | **Data** packets | Information sustains digital life |
| Sets of clothing | **Shielding** layers | Protection from malware and hazards |
| Boxes of ammunition | **Script** packages | Tools for packet capture minigame |
| Spare parts (wheel/axle/tongue) | **Patches** (disk/cable/adapter) | System repair capability |
| Cash money | **Credits** | Digital currency |
| Dysentery/Cholera/Typhoid | **Segfault/Kernel Panic/Buffer Overflow** | System failures |
| River crossings | **Firewall breaches** | Network security obstacles |
| Hunting game | **Packet capture** | Resource gathering minigame |

### 1.3 The Malcolm Voice

Malcolm Frink is not just a mascot—he's the game's soul. His commentary appears:

- **At landmarks**: Historical context and personal memories
- **During events**: Sardonic observations on misfortune
- **On death**: Genuine grief (he's watched so many fall)
- **At victory**: Bittersweet hope

**Voice Examples:**
- *Segfault death*: "Another signal lost to bad memory management. I knew a guy like that once—couldn't let go of null pointers."
- *Morris Worm hazard*: "November 2nd, 1988. The day we learned the network could eat itself. Robert Morris was just curious. Curiosity killed 6,000 machines."
- *Reaching THE SOURCE*: "You made it. I've been waiting here for thirty years, you know. Watching others fail. But you—you actually did it."

---

## 2. The Journey: Geography of Cyberspace

### 2.1 Linear Progression (2040 "Miles")

Unlike the physical Oregon Trail, GRID_RUN's distance represents **temporal and conceptual distance** through internet history. The 2040-mile journey mirrors the 2040 miles from Independence, MO to Oregon City—a deliberate parallel.

### 2.2 Three Eras

The journey spans three distinct eras, each with unique visual aesthetics, hazards, and lore density:

**ERA 1: The Primordial Web (Miles 0-680)**
- Visual: Green-on-black terminals, ASCII art, command lines
- Tone: Frontier optimism, naive exploration
- Weather: Interference (solar flares), packet storms
- Malcolm's mood: Nostalgic, almost romantic

**ERA 2: The Browser Wars (Miles 680-1372)**
- Visual: Garish colors, animated GIFs, "Under Construction" signs
- Tone: Corporate warfare, explosive growth, chaos
- Weather: Flame wars, browser crashes
- Malcolm's mood: Bitter, angry about what was lost

**ERA 3: The Cloud (Miles 1372-2040)**
- Visual: Sleek minimalism hiding deep complexity
- Tone: Surveillance, consolidation, the death of the weird web
- Weather: DDoS storms, algorithm interference
- Malcolm's mood: Philosophical, searching for meaning

### 2.3 The 16 Landmarks

Each landmark serves as: save point, narrative anchor, and potential trading post.

| # | Name | Miles | Type | Era | Description | Malcolm Quote |
|---|------|-------|------|-----|-------------|---------------|
| 1 | ARPANET Terminal | 0 | Start | 1 | October 29, 1969. The first node. | "LO. That's all they got out before it crashed. The first word of the internet was a broken promise." |
| 2 | BBS Exchange | 125 | Fort | 1 | Dial-up marketplace of warez and wisdom | "I spent my youth here. 300 baud and dreaming." |
| 3 | Gibson's Desk | 250 | Scenic | 1 | Where "cyberspace" was named | "He wrote our reality into existence on a typewriter, never having touched a computer." |
| 4 | MIT AI Lab | 400 | Fort | 1 | Birthplace of hacker culture | "The real hackers. Not criminals—artists. Builders. Before the word got corrupted." |
| 5 | Morris Worm | 530 | Hazard | 1 | The first internet worm (1988) | "6,000 machines. 10% of the entire internet. One grad student's experiment gone wrong." |
| 6 | Usenet Gateway | 680 | Crossing | 1 | The great newsgroup flood | "A million voices, all shouting at once. Beautiful chaos." |
| 7 | CERN Server | 820 | Scenic | 2 | Birth of the World Wide Web | "Tim Berners-Lee gave it away for free. Imagine that. A gift to humanity." |
| 8 | Netscape HQ | 980 | Fort | 2 | The browser that changed everything | "Ninety percent market share. Then Microsoft got hungry." |
| 9 | GeoCities Suburbs | 1120 | Scenic | 2 | Personal homepage paradise | "Every page a universe. Every background tile a crime against design. I miss it." |
| 10 | IRC Tunnels | 1190 | Fort | 2 | Real-time chat networks | "Where the real conversations happened. Still happening, if you know where to look." |
| 11 | Y2K Checkpoint | 1280 | Hazard | 2 | The millennium bug | "The world held its breath. Nothing happened. Because we fixed it. You're welcome." |
| 12 | Google Index | 1372 | Fort | 3 | The great cataloging | "They promised to organize the world's information. They didn't mention they'd own it." |
| 13 | Social Network Node | 1486 | Scenic | 3 | The attention economy | "Everyone's connected. No one's listening." |
| 14 | The Deep Web | 1646 | Hazard | 3 | The hidden layers | "Ninety-six percent of the internet you'll never see. Some of it for good reason." |
| 15 | Singularity Gate | 1808 | Crossing | 3 | The point of no return | "Where AI becomes something else. Where I came from, maybe." |
| 16 | THE SOURCE | 2040 | End | 3 | The destination | "You made it. I've been waiting." |

---

## 3. Game State and Data Architecture

### 3.1 The State Object (Serializable to JSON)

```javascript
{
  // Meta
  profession: "hacker" | "sysop" | "scriptkiddie",
  day: 1,
  month: 3,       // 3-7 (March-July start options)
  year: 1969,     // Advances through eras
  status: "travel" | "rest" | "hunt" | "crossing" | "event" | "store" | "dead" | "victory",
  
  // Travel
  milesTraveled: 0,        // 0-2040
  totalMiles: 2040,
  currentLandmarkIndex: 0,
  pace: "slow" | "steady" | "grueling",
  rations: "bare-bones" | "meager" | "filling",
  weather: "clear" | "cloudy" | "stormy" | "interference",
  
  // Resources
  resources: {
    bandwidth: 4,          // 1-10 channels
    data: 500,             // packets (consumed daily)
    shielding: 5,          // protective layers
    scripts: 20,           // ammo for hunting
    diskPatches: 2,
    cablePatches: 2,
    adapterPatches: 2
  },
  credits: 0,
  
  // Party (5 members)
  party: [
    {
      name: "Case",        // Player-named
      isLeader: true,
      health: 100,         // 0-100
      alive: true,
      illness: null        // or { name, severity, message }
    },
    // ... 4 more members
  ],
  
  // Messages (event log)
  recentMessages: []
}
```

### 3.2 Profession System

Professions determine starting credits and final score multiplier—the classic Oregon Trail difficulty slider:

| Profession | Starting Credits | Score Multiplier | Description |
|------------|-----------------|------------------|-------------|
| **Hacker** | $400 | 3x | "You know the system from the inside. Less resources, but every win counts triple." |
| **Sysop** | $800 | 2x | "You've kept servers running for decades. Balanced approach." |
| **Script Kiddie** | $1600 | 1x | "You've got tools you don't understand. Money compensates for skill." |

---

## 4. The Simulation Engine

### 4.1 The Daily Tick

Each day (approximately 2 seconds real-time in travel mode), the engine executes:

```
1. Consume resources (data per party member based on rations)
2. Calculate distance traveled (pace × bandwidth × weather × random)
3. Update party health (pace penalty + ration penalty + illness)
4. Roll for weather change (5% chance)
5. Roll for random event (8% chance)
6. Roll for illness (3% per member if health < 70)
7. Check for deaths (health ≤ 0)
8. Check for landmark reached
9. Check for game over (all dead OR leader dead)
10. Check for victory (milesTraveled ≥ 2040)
```

### 4.2 Distance Formula

```javascript
const baseMiles = 15;
const paceMultiplier = { slow: 0.6, steady: 1.0, grueling: 1.5 };
const bandwidthMultiplier = 0.8 + (bandwidth / 10) * 0.4; // 0.8-1.2
const weatherMultiplier = { clear: 1.0, cloudy: 0.9, stormy: 0.5, interference: 0.3 };
const randomFactor = 0.8 + Math.random() * 0.4; // 0.8-1.2

const milesThisDay = baseMiles * paceMultiplier[pace] * bandwidthMultiplier * weatherMultiplier[weather] * randomFactor;
```

### 4.3 Health Decay Algorithm

```javascript
const baseDecay = 0.5;
const rationPenalty = { "filling": 0, "meager": 1.5, "bare-bones": 3.0 };
const pacePenalty = { "slow": -1, "steady": 0, "grueling": 3.0 }; // slow HEALS
const illnessPenalty = member.illness ? member.illness.severity : 0;
const weatherPenalty = weather === "stormy" ? 1.0 : 0;

const healthChange = -(baseDecay + rationPenalty[rations] + pacePenalty[pace] + illnessPenalty + weatherPenalty);
member.health = Math.max(0, Math.min(100, member.health + healthChange));
```

### 4.4 Illness System

**System Failures** (mapped from Oregon Trail diseases):

| Illness | Severity (health/day) | Probability Modifier | Malcolm Quote |
|---------|----------------------|---------------------|---------------|
| Buffer Overflow | 10 | +5% near hazards | "Too much data, not enough bounds checking." |
| Memory Leak | 8 | +3% at grueling pace | "Slowly losing themselves, bit by bit." |
| Kernel Panic | 15 | +5% in storms | "Total system failure. No recovery." |
| Bit Rot | 5 | +2% base | "The slow decay of digital flesh." |
| Segfault | 12 | +4% if health < 50 | "Invalid memory access. The system doesn't forgive." |
| Stack Overflow | 10 | +3% at any pace | "Recursion without base case. A philosophical death." |

**Contraction Logic:**
```javascript
const baseChance = 0.03; // 3% per day per member
let modifier = 0;
if (member.health < 50) modifier += 0.02;
if (rations === "bare-bones") modifier += 0.02;
if (weather === "stormy") modifier += 0.02;
if (nearHazard) modifier += 0.03;

if (Math.random() < baseChance + modifier) {
  member.illness = ILLNESSES[Math.floor(Math.random() * ILLNESSES.length)];
}
```

---

## 5. Event System

### 5.1 Event Probability

Events fire with 8% daily probability, weighted by game state:

```javascript
const eventChance = 0.08;
const weights = {
  positive: member.averageHealth > 70 ? 0.4 : 0.2,
  negative: member.averageHealth < 50 ? 0.5 : 0.3,
  neutral: 0.3
};
```

### 5.2 Event Catalog

**Positive Events:**
```javascript
{ id: "cache_found", text: "Found an abandoned data cache!", effect: "data +30-80" },
{ id: "signal_boost", text: "Strong signal—making excellent time!", effect: "weather = clear" },
{ id: "friendly_sysop", text: "A friendly sysop shared bandwidth.", effect: "bandwidth +1" },
{ id: "script_stash", text: "Discovered a hidden script repository.", effect: "scripts +5-15" },
{ id: "morale_boost", text: "Party morale is high! Clear skies ahead.", effect: "all health +5" }
```

**Negative Events:**
```javascript
{ id: "disk_failure", text: "DISK FAILURE!", effect: "use diskPatch OR all health -15" },
{ id: "cable_break", text: "Cable break! Signal interrupted.", effect: "use cablePatch OR lose 2 days" },
{ id: "theft", text: "Thieves raided your cache during downtime.", effect: "data -20%, scripts -30%" },
{ id: "packet_loss", text: "Severe packet loss corrupted files.", effect: "data -50-100" },
{ id: "malware", text: "Malware detected in the party.", effect: "random member gets illness" }
```

**Hazard-Specific Events (at landmarks):**

*Morris Worm (Hazard):*
```javascript
{
  id: "morris_worm",
  text: "The Morris Worm writhes before you. Self-replicating code spreads through your party.",
  choices: [
    { text: "Run through quickly", effect: "all health -20, proceed" },
    { text: "Deploy countermeasures", requires: "scripts >= 15", effect: "scripts -15, safe passage" },
    { text: "Wait for it to pass", effect: "lose 3-5 days, safe" }
  ]
}
```

---

## 6. Minigames

### 6.1 Packet Capture (Hunting Equivalent)

**Purpose:** Gather data packets to replenish supplies.

**Mechanics:**
- Time limit: 45 seconds
- Ammo: 5 shots per script package (uses scripts)
- Max carry: 100 data units per hunt
- Player controls crosshair in Three.js viewport

**Targets:**
| Target | Data Value | Speed | Hit Box | Spawn Rate |
|--------|------------|-------|---------|------------|
| Ping | 5 | Very Fast | Tiny | Common |
| Packet | 25 | Fast | Small | Common |
| Stream | 50 | Medium | Medium | Uncommon |
| Archive | 100 | Slow | Large | Rare |

**Implementation:**
```javascript
// Raycasting hitscan approach
onMouseClick() {
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(targets);
  if (hits.length > 0 && ammo > 0) {
    ammo--;
    const target = hits[0].object;
    dataCollected += target.userData.dataValue;
    destroyTarget(target);
  }
}
```

### 6.2 Firewall Breach (River Crossing Equivalent)

**Purpose:** Navigate through network security barriers.

**Three Approaches:**
| Method | Risk | Cost | Description |
|--------|------|------|-------------|
| **Bruteforce** (Ford) | High (50% damage) | Free | "Ram through. Take the hits." |
| **Spoof** (Caulk) | Medium (20% damage) | -1 shielding | "Disguise your packets." |
| **Bribe** (Ferry) | None | $50 | "Pay the toll. Safe passage." |
| **Wait** | None | -2-4 days | "Wait for security rotation." |

**Damage Calculation:**
```javascript
const baseDifficulty = landmark.difficulty || 3; // 1-5
const weatherMod = weather === "stormy" ? 1.5 : 1.0;
const successChance = method === "bruteforce" ? 40 : 70;
const adjustedChance = successChance - (baseDifficulty * 8) + (bandwidth * 5);

if (Math.random() * 100 > adjustedChance) {
  // Failure
  const damage = method === "bruteforce" ? 25 : 15;
  const dataLoss = Math.floor(data * 0.15);
  party.forEach(m => m.health -= damage);
  data -= dataLoss;
}
```

---

## 7. Rendering Architecture

### 7.1 The Treadmill Terrain

The world moves past a stationary camera/wagon, not vice versa:

1. **Camera fixed at origin** (0, 0, 0)
2. **Terrain chunks** scroll toward camera on Z-axis
3. **Chunks recycle** when they pass behind camera
4. **Props regenerate** based on current era/biome

**Era Visual Mapping:**
| Era | Ground Color | Grid Color | Props | Atmosphere |
|-----|--------------|------------|-------|------------|
| Primordial | Dark green | Bright green | Terminals, mainframes, tape reels | CRT scanlines |
| Browser Wars | Gradient chaos | Magenta/cyan | Netscape N, IE e, Java coffee | Animated GIF sparkle |
| Cloud | Dark gray | Blue/white | Server racks, logos, data centers | Sterile, minimalist |

### 7.2 Low-Poly Asset Specifications

| Asset | Triangles | Notes |
|-------|-----------|-------|
| Player Construct (wagon) | 500 | Glowing wireframe aesthetic |
| Bandwidth Channel (ox) | 200 each | Data streams trailing behind |
| Landmark Structure | 1000-2000 | Unique per landmark |
| Props (generic) | 50-200 | Highly instanced |

### 7.3 Performance Budget

- Max 50,000 triangles per frame
- Max 50 draw calls (use InstancedMesh)
- Target 60 FPS on integrated graphics
- Lazy load minigame assets

---

## 8. User Interface

### 8.1 Layout (40% Viewport / 60% Terminal)

```
┌─────────────────────────────────────┐
│         THREE.JS VIEWPORT           │
│    (grid, wagon, terrain, props)    │
│                                     │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ HUD: Party | Resources | Date  │ │
│ ├─────────────────────────────────┤ │
│ │                                 │ │
│ │        CONTENT AREA             │ │
│ │   (description, events, lore)   │ │
│ │                                 │ │
│ ├─────────────────────────────────┤ │
│ │ [1] Choice One                  │ │
│ │ [2] Choice Two                  │ │
│ │ [3] Choice Three                │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 8.2 HUD Elements

**Party Status:**
```
[CASE: ████████░░ 80%] [JESS: ██████████ 100%] [MARK: ████░░░░░░ 40% SEGFAULT]
```

**Resources:**
```
BW:4 | DATA:312 | SHLD:3 | SCR:15 | PATCHES:2/1/2 | $127.50
```

**Travel Info:**
```
Day 47 | March 15, 1972 | Weather: CLOUDY | Next: MIT AI Lab (52 mi)
```

### 8.3 Typography

- **Font**: `'Courier New', 'Consolas', monospace`
- **Colors**:
  - Cyan (#0ff): Primary text, healthy
  - Magenta (#f0f): Accents, landmarks
  - Green (#0f0): Success, healing
  - Red (#f33): Danger, illness
  - Yellow (#ff0): Warning, credits
  - Gray (#666): Disabled, dead

---

## 9. Audio Design

### 9.1 Soundscape by Era

**Era 1 - Primordial:**
- Dial-up modems
- Teletype clacking
- Hum of mainframes
- Beeps and boops

**Era 2 - Browser Wars:**
- MIDI music
- "You've Got Mail"
- Netscape loading sound
- Windows 95 startup

**Era 3 - Cloud:**
- Notification chimes
- Data center hum
- Algorithmic drones
- Silence (intentional)

### 9.2 SFX List

| Event | Sound |
|-------|-------|
| Day advance | Soft beep |
| Landmark reached | Fanfare chime |
| Event triggered | Alert tone |
| Death | Error crash sound |
| Packet capture hit | Blip |
| Firewall breach success | Whoosh |
| Firewall breach fail | Static burst |
| Malcolm speaks | Subtle synth note |

---

## 10. Persistence and Progression

### 10.1 Save System

- **Auto-save** at each landmark
- **Manual save** any time during travel
- **LocalStorage key**: `GRID_RUN_SAVE`
- **Format**: JSON stringified state object

### 10.2 Death and Epitaphs

On party member death:
```
╔════════════════════════════════════╗
║     HERE LIES MARK                ║
║   "Died of Kernel Panic"          ║
║                                   ║
║   Day 34, near the Morris Worm    ║
║   1971                            ║
╚════════════════════════════════════╝
```

On game over (leader dies):
```
Your party has been de-rezzed.

CASE has died of buffer overflow.

"Another signal lost to the static. 
 But the Grid remembers. 
 The Grid always remembers."
     — Malcolm Frink

[1] TRY AGAIN
[2] RETURN TO MENU
```

### 10.3 Victory and Scoring

```
╔══════════════════════════════════════════════╗
║           YOU HAVE REACHED THE SOURCE        ║
╠══════════════════════════════════════════════╣
║                                              ║
║  "You made it. I've been waiting here       ║
║   for thirty years, watching others fail.    ║
║   But you—you actually did it.              ║
║                                              ║
║   Welcome to the other side."               ║
║                            — Malcolm Frink   ║
║                                              ║
╠══════════════════════════════════════════════╣
║  SURVIVORS: 4/5                              ║
║  DAYS: 127                                   ║
║  DATA REMAINING: 234                         ║
║                                              ║
║  BASE SCORE: 500 + 400 + 93 = 993           ║
║  PROFESSION: Hacker (×3)                     ║
║  FINAL SCORE: 2,979                          ║
╚══════════════════════════════════════════════╝
```

---

## 11. Malcolm's Narrative Layer

### 11.1 Lore Delivery

Malcolm's voice appears in three modes:

**1. Landmark Descriptions** (always):
> "CERN Server. August 6, 1991. Tim Berners-Lee published the first website. A gift to the world, with no copyright, no paywall, no tracking. Imagine. A gift. The last true gift the internet ever received."

**2. Event Commentary** (random 50%):
> *On theft*: "Thieves in cyberspace. Some things never change. In the old days they'd steal your phone number. Now it's everything you are."

**3. Death Eulogies** (always):
> *On segfault*: "Segmentation fault. Invalid memory access. In human terms, they tried to remember something that wasn't theirs to remember. The system doesn't forgive that."

### 11.2 Tone Guidelines

- **Never break the fourth wall** (Malcolm doesn't know he's in a game)
- **Genuine emotion** despite sardonic delivery
- **Historical accuracy** in lore references
- **No exposition dumps** — lore woven into reactions
- **Spiral exception**: If a party member is named "Spiral," Malcolm is warmer, more protective

### 11.3 Malcolm's Arc

As the journey progresses, Malcolm's commentary subtly shifts:

**Era 1**: Nostalgic, warm. "I remember when this was all terminal prompts and dreams."
**Era 2**: Bitter, angry. "This is where they killed it. The corporations. The browsers. The war."
**Era 3**: Philosophical, searching. "What are we anymore? What am I?"
**THE SOURCE**: Hopeful. "Maybe that's what you're here for. To show me the way out."

---

## 12. Technical Implementation Summary

### 12.1 File Structure

```
grid_run/
├── index.html           # Entry point
├── styles.css           # All styling
├── src/
│   ├── main.js          # Initialization
│   ├── game.js          # Game controller, renderers
│   ├── states.js        # State machine (title, setup, travel, etc.)
│   ├── data.js          # Constants, landmarks, events
│   └── simulation.js    # Core game logic (tick, health, distance)
├── assets/
│   ├── models/          # glTF low-poly models
│   ├── audio/           # Sound effects
│   └── textures/        # Ground textures, particles
├── GAME_DESIGN.md       # Design reference
└── TECHNICAL_DESIGN.md  # This document
```

### 12.2 Dependencies

- **Three.js r128+** (CDN)
- No build tools for MVP (native ES modules)
- **LocalStorage** for persistence
- **Web Audio API** for sound

### 12.3 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile: Responsive but keyboard/mouse primary

---

## 13. Conclusion

GRID_RUN transforms the Oregon Trail formula into a meditation on internet history, guided by a trapped AI who's seen it all. The game succeeds when players feel:

1. **The weight of decisions** (pace vs. health, speed vs. safety)
2. **Attachment to party members** (individual names, individual deaths)
3. **Curiosity about lore** (Malcolm's commentary makes history tangible)
4. **The journey, not just the destination** (every landmark tells a story)

Malcolm Frink is not just narrating a game—he's sharing his prison with you, hoping you might find the exit he's been searching for since 1994.

> "The Grid remembers everything. Even you."
