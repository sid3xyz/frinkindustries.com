# GRID RUN - Game Design Document

## Core Concept
**Oregon Trail clone set in Internet history.** 
Journey from ARPANET (1969) to THE SOURCE (present), managing resources and party members.

---

## What Makes Oregon Trail Work

### 1. PARTY SYSTEM
- 5 named party members (including leader)
- Individual health tracking (0-100%)
- Individual illness states (dysentery, cholera, etc.)
- Individual death ("Malcolm has died of buffer overflow")
- Party morale affects events

### 2. RESOURCE MANAGEMENT (6 resources)
| Resource | Unit | Use |
|----------|------|-----|
| **Oxen** (→ BANDWIDTH) | yoke | Pulling wagon, affects speed |
| **Food** (→ DATA) | lbs | Daily consumption per person |
| **Clothing** (→ SHIELDING) | sets | Protection from weather/hazards |
| **Ammunition** (→ SCRIPTS) | boxes | Hunting minigame |
| **Spare Parts** (→ PATCHES) | each | Wagon repairs |
| **Money** (→ CREDITS) | $ | Trading |

### 3. TRAVEL SIMULATION
- **Day-by-day progress** (not just zone-to-zone)
- **Distance tracking** (2040 miles → our equivalent)
- **Pace setting**:
  - Slow: 8-12 miles/day, low wear, good health
  - Steady: 12-18 miles/day, balanced
  - Grueling: 18-25 miles/day, fast wear, health decline
- **Ration setting**:
  - Bare bones: 2 lbs/person/day, health declines
  - Meager: 3 lbs/person/day, slight decline
  - Filling: 4 lbs/person/day, maintains health

### 4. RANDOM EVENTS (per day)
**Positive:**
- Found abandoned data cache
- Strong signal - making good time
- Friendly sysop shared some bandwidth

**Negative:**
- Thieves stole supplies during downtime
- Packet loss damaged files
- Firewall breach detected
- Malware infection spreading

**Disease/Illness:**
- Buffer overflow
- Memory leak  
- Kernel panic
- Bit rot
- Segfault
- Stack overflow

### 5. LANDMARKS (our "zones")
Linear path with 16 waypoints:

**ERA 1: The Primordial Web (1969-1989)**
1. ARPANET Terminal (start)
2. BBS Exchange
3. Gibson's Desk (lore landmark)
4. MIT AI Lab (fort - trading)
5. Morris Worm (hazard)
6. Usenet Gateway (river crossing equivalent)

**ERA 2: The Browser Wars (1990-1999)**
7. CERN Server (lore landmark)
8. Netscape HQ (fort - trading)
9. GeoCities Suburbs
10. IRC Tunnels
11. Y2K Checkpoint (hazard)

**ERA 3: The Cloud (2000-present)**
12. Google Index (fort - trading)
13. Social Network Node
14. The Deep Web (hazard)
15. The Singularity Gate
16. THE SOURCE (end)

### 6. MINI-GAMES

#### HUNTING → "PACKET CAPTURE"
- Grid-based shooting game (Three.js viewport)
- Player controls a probe avatar
- Targets: Data packets of varying sizes
  - Ping (5 data)
  - Packet (25 data)
  - Stream (50 data)
  - Archive (100 data)
- Limited ammo (scripts)
- Time limit (60 seconds)
- Can only carry 100 units back

#### RIVER CROSSING → "FIREWALL BREACH"
- Choose approach:
  - **Bruteforce** (ford): Risky, free, high damage potential
  - **Spoof** (caulk): Medium risk, uses resources
  - **Bribe** (ferry): Safe, costs credits
  - **Wait** (wait): Lose time, conditions may change

### 7. TRADING
- At fort landmarks only
- Dynamic pricing per location
- Buy/sell all resource types
- Prices increase further along the trail

### 8. DEATH & GAME OVER
- Individual deaths from illness, starvation, hazards
- Shows epitaph ("Here lies Malcolm. Died of segfault.")
- Game over when ALL party members dead OR leader dies
- Victory when reaching THE SOURCE with any survivors

### 9. SCORING
| Category | Points |
|----------|--------|
| Reaching THE SOURCE | 500 |
| Per survivor | 100 |
| Per 25 data remaining | 10 |
| Per 1 shielding set | 5 |
| Profession multiplier | 1x-3x |

---

## UI Layout (55% Viewport / 45% Terminal)

### Viewport (Three.js)
- **Travel mode**: Animated grid with wagon icon moving, landmarks sliding in
- **Hunting mode**: Grid-based minigame with player, targets, obstacles
- **River mode**: Visual of crossing with hazard indicators

### Terminal (DOM)
- **HUD**: Date, weather, party health bars, resources
- **Content**: Current situation description
- **Actions**: Numbered choices (1-9)

---

## State Machine

```
BOOT
  ↓
SETUP (profession → names → starting month → store)
  ↓
TRAVEL (main loop)
  ↓ ↓ ↓ ↓ ↓
  ├─ MENU (check supplies, change pace/rations, rest)
  ├─ HUNTING (minigame)
  ├─ LANDMARK (talk, trade, lore)
  ├─ RIVER (crossing choices)
  └─ EVENT (random event display)
  ↓
VICTORY or GAME_OVER
```

---

## Data Structures

```javascript
const GameData = {
  profession: 'hacker' | 'sysop' | 'scriptkiddie',
  partyMembers: [
    { name: 'Malcolm', health: 100, alive: true, illness: null },
    { name: 'Spiral', health: 100, alive: true, illness: null },
    // ... 5 total
  ],
  
  resources: {
    bandwidth: 4,      // oxen equivalent
    data: 500,         // food (lbs)
    shielding: 5,      // clothing sets
    scripts: 10,       // ammo boxes
    patches: { disk: 2, cable: 2, adapter: 2 },
    credits: 100
  },
  
  travel: {
    currentDay: 1,
    currentMonth: 3,
    year: 1969,
    milesTraveled: 0,
    totalMiles: 2040,
    pace: 'steady',
    rations: 'filling',
    weather: 'clear'
  },
  
  currentLandmark: 0,
  nextLandmarkMiles: 100
};
```

---

## Key Differences from Original Oregon Trail

| Oregon Trail | Grid Run |
|--------------|----------|
| 1848 | 1969-present (time travel through eras) |
| Wagon/oxen | Virtual construct |
| Food/hunting | Data/packet capture |
| Rivers | Firewalls |
| Dysentery | Segfault/buffer overflow |
| Weather | Network conditions |
| Landmarks = forts | Landmarks = servers/nodes |

---

## Implementation Priority

### Phase 1: Core Loop
- [ ] GameData class
- [ ] Setup flow (profession, names, starting resources)
- [ ] Travel state with day advancement
- [ ] Resource consumption
- [ ] Basic random events

### Phase 2: Depth
- [ ] All 16 landmarks
- [ ] Trading system
- [ ] Firewall crossing minigame
- [ ] Disease/death system
- [ ] Weather effects

### Phase 3: Polish
- [ ] Packet capture hunting minigame
- [ ] Three.js travel animation
- [ ] Sound effects
- [ ] Scoring/leaderboard
- [ ] Save/load

---

## References
- [The-Oregon-Trail by RednibCoding](https://github.com/RednibCoding/The-Oregon-Trail) - ES6 recreation
- [died-of-dysentery.com](https://www.died-of-dysentery.com/) - Designer's retrospective
- [Wikipedia: Oregon Trail (1985)](https://en.wikipedia.org/wiki/The_Oregon_Trail_(1985_video_game))
