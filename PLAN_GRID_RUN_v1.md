# PROJECT: GRID_RUN // UPGRADE PLAN

## 1. Executive Summary
**Objective:** Transform `frinkindustries.com` into an interactive educational platform using an "Oregon Trail" style text-adventure engine.
**Core Concept:** "The Grid Run." A survival journey through the history of Cyberpunk, Kaiju lore, and The Network.
**Tech Stack:** Vanilla JavaScript (ES6 Modules), HTML5, CSS3. Hosted on Cloudflare Pages.
**Philosophy:** "Professional functionality, Gritty aesthetic." Code must be modular, performant, and extensible.

---

## 2. Technical Architecture

### 2.1 File Structure
To maintain a clean codebase, the game will be isolated in its own directory structure.
```text
/games
  /grid_run
    ├── engine.js       # Core State Machine & Logic
    ├── ui.js           # DOM Manipulation & Rendering (Terminal Interface)
    ├── state.js        # State Management (Integrity, Bandwidth, Inventory)
    ├── data.js         # Content Dictionary (Nodes, Events, Items)
    └── assets.js       # ASCII Art & Static constants
```

### 2.2 The Engine (State Machine)
We will use a **Node-Based Traversal System** combined with a **Resource Manager**.

*   **Game State Object:**
    ```javascript
    const state = {
        player: {
            integrity: 100, // Health
            bandwidth: 100, // Fuel
            credits: 0,
            inventory: []
        },
        position: {
            current_node: "START_NODE",
            distance_traveled: 0
        },
        flags: {} // For narrative tracking (e.g., "MET_NEUROMANCER")
    };
    ```

*   **The Loop:**
    1.  **Render:** Engine reads `current_node` data -> UI clears terminal -> Types text.
    2.  **Input:** User selects option (1-4) or types command.
    3.  **Process:** Engine calculates resource delta -> updates State -> determines `next_node`.
    4.  **Save:** State is serialized to `localStorage` (Key: `FRINK_GRID_RUN_SAVE`).

### 2.3 Compatibility & Performance
*   **No Frameworks:** Pure JS ensures 0ms cold start time and zero build step, perfect for Cloudflare Pages.
*   **Modules:** usage of `<script type="module">` allows us to organize code without global namespace pollution.
*   **Event-Driven:** The UI will decouple from the Logic using CustomEvents, allowing for easy refactoring of the frontend without breaking the game rules.

---

## 3. Narrative & Logic Design

### 3.1 The Curriculum (Zones)
The game is divided into 4 linear "Zones," each representing an era of influence.

**Zone 1: The Primordial Web (1980s-1990s)**
*   **Theme:** Analog hiss, Phreaking, ARPANET.
*   **Key Learning:** Roots of Cyberpunk (Gibson), Early Internet.
*   **Boss:** *The Morris Worm.*

**Zone 2: The Battlegrounds (The Grid Wars)**
*   **Time Period:** 1994-1995 (The Golden Age of Conflict).
*   **Theme:** Navigating the smoking debris of the Great War. Fossilized server racks, unexploded logic bombs, and the corpses of Mega-Viruses.
*   **Key Learning:** The conflict between Integrity (Servo) and Entropy (Kilokahn). The player learns how Malcolm was manipulated.
*   **Mechanic: [Salvage]**
    *   Find "Broken Assist Weapons" (One-time shield boost).
    *   Find "Viral Shards" (High risk/reward attack buffs).
*   **Boss:** *The Re-assembled War Machine* (A Frankenstein construct made of Skorn and Zenon parts).

**Zone 3: The Crash (2000-2020)**
*   **Theme:** Dotcom bubble burst, Social Media noise, Data harvesting.
*   **Key Learning:** The "Death of the User," Algorithmic control.
*   **Hazard:** *Infinite Scroll Trap.*

**Zone 4: The Source (Future/Straylight)**
*   **Theme:** Abstract pure data. Malcolm's current domain.
*   **Goal:** Reach the Core and upload your consciousness.

### 3.2 Mechanics (The "Trail" Logic)
*   **Traveling:** Moving between nodes costs **Bandwidth**.
*   **Hazards:** Random events (Virus Attack, Glitch) damage **Integrity**.
*   **Education:** "Data Mining" events allow players to spend Bandwidth to learn Lore. Successful learning grants **Credits** or restores **Integrity**.

---

## 4. Implementation Phases (Git Strategy)

We will work in strict phases. Each phase concludes with a Git Commit to ensure rollback safety.

### Phase 1: The Skeleton (Engine Core)
*   **Goal:** A working "Game Loop" that can display text and accept input.
*   **Tasks:**
    *   Scaffold `/games/grid_run/` files.
    *   Implement `engine.js` (Start, Next Node, End).
    *   Implement `ui.js` (Hook into the main `#output` div).
    *   **Commit:** `feat: init grid_run engine core`

### Phase 2: The State Manager (Resources)
*   **Goal:** HUD displaying Health/Ammo (Integrity/Bandwidth) and Game Over logic.
*   **Tasks:**
    *   Implement `state.js`.
    *   Add HUD element to the Terminal UI.
    *   Implement Resource Logic (Travel = -Bandwidth).
    *   **Commit:** `feat: implement resource management system`

### Phase 3: Content Injection (The Data)
*   **Goal:** Playable "Zone 1" with real lore.
*   **Tasks:**
    *   Populate `data.js` with Zone 1 nodes.
    *   Write Lore entries for William Gibson / Neuromancer.
    *   **Commit:** `feat: populate zone 1 content`

### Phase 4: Integration
*   **Goal:** Link the game to the main site.
*   **Tasks:**
    *   Add `> INITIATE_RUN: [GRID_TRAIL]` to the home page nav.
    *   Ensure smooth transition (fade out manifesto, fade in game).
    *   **Commit:** `feat: integrate grid_run into main terminal`

---

## 5. Rapid Prototyping Rules
1.  **Don't over-engineer the UI:** Use simple text lists for choices `[1] Go Left` first.
2.  **Hardcode Data first:** Don't build a dynamic JSON loader yet. Import a constant JS object.
3.  **Fail Fast:** If a mechanic isn't fun (e.g., Bandwidth draining too fast), tweak the numbers in `state.js` immediately.
