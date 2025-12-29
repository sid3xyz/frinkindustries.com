# GRID RUN - Complete Redesign

## Research Findings

### From Sunset-Cyberspace (Retro Runner Game)
**Key Architecture Patterns:**
1. **Game Class** - Main orchestrator holding camera, scene, renderer, callbacks
2. **Level Class** - Manages floor geometry, obstacles, collectibles, movement
3. **Separate Concerns**: Particles, Lighting, Collectibles as own modules
4. **Post-Processing**: EffectComposer with custom shaders (vignette, hue shift, brightness)
5. **Input Handling**: Keyboard and touch unified, direction state variable
6. **Animation**: TweenMax/GSAP for smooth transitions
7. **State Machine**: `playing`, `acceptInput` flags control game flow

**Visual Style:**
- Wireframe geometry on mesh surfaces
- Fog for depth
- Neon colors (magenta, cyan, blue)
- Particles for atmosphere
- Perlin noise for floor deformation

### From Three-Infinite-Grid
**Key Patterns:**
1. **Shader-based grid** - Anti-aliased via fragment shader derivatives
2. **InstancedMesh** - Efficient rendering of grid patches
3. **Customizable**: Line widths, colors, axis highlighting
4. **Plane options**: XZ, XY, ZY

### From Oregon Trail Clones
**Game Design Patterns:**
1. **Resource Management** - Health, supplies, money
2. **Node-based travel** - Locations with events/choices
3. **Random Events** - Encounters, weather, hazards
4. **Simple UI** - Text-focused, clear choices
5. **Atmosphere** - Music, sound effects, transitions

---

## Grid Run Vision

**Concept**: A cyberpunk Oregon Trail through internet history, with a THREE.js cyberspace viewport as the visual anchor.

**Core Loop**:
1. Player sees 3D cyberspace visualization (the Grid)
2. Text terminal shows narrative and choices
3. Choices consume resources (Bandwidth, Integrity)
4. Navigate through historical "zones" of the internet
5. Reach THE SOURCE (the goal)

---

## Architecture: Clean Split

```
┌─────────────────────────────────────────────────────────────────┐
│                        VIEWPORT (Three.js)                       │
│  - Infinite neon grid with anti-aliasing                         │
│  - Central node (icosahedron) representing current location      │
│  - Particles/atmosphere effects                                  │
│  - Post-processing: CRT scanlines, bloom, color shift            │
└─────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────┐
│                        TERMINAL (DOM)                            │
│  - HUD bar: INTEGRITY | BANDWIDTH | CREDITS                      │
│  - Current zone title                                            │
│  - Description text (typewriter effect)                          │
│  - Choice buttons (1-9 hotkeys)                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## File Structure (New)

```
games/grid_run/
├── index.html          # Single page, no frameworks
├── styles.css          # All styling (CRT, terminal, viewport)
├── game/
│   ├── main.js         # Entry point, game loop
│   ├── Game.js         # Main game controller
│   ├── State.js        # Game state (resources, current node)
│   ├── Terminal.js     # DOM-based terminal UI
│   ├── Viewport.js     # Three.js scene manager
│   ├── Grid.js         # Infinite grid (based on research)
│   ├── Node.js         # Central node visualization
│   └── Effects.js      # Post-processing
└── data/
    └── zones.js        # Zone definitions (existing lore)
```

---

## Implementation Plan

### Phase 1: Viewport Foundation
1. Create minimal HTML with `#viewport` (canvas) and `#terminal` (div)
2. Set up Three.js: Scene, Camera, Renderer, OrbitControls
3. Add infinite grid shader from three-infinite-grid approach
4. Add central node (glowing icosahedron)
5. Basic animation loop

### Phase 2: Terminal UI
1. HUD with resource bars (CSS, no canvas)
2. Title display
3. Description with typewriter effect
4. Choice buttons with keyboard support
5. Proper scrolling (if needed)

### Phase 3: Game Logic
1. State machine: BOOT → PLAYING → GAMEOVER
2. Load node, render to terminal
3. Handle choice selection
4. Apply costs/rewards
5. Navigate to next node
6. Game over detection

### Phase 4: Polish
1. CRT scanline effect (CSS overlay + optional shader)
2. Transition animations between nodes
3. Sound effects (Web Audio API)
4. Node pulsing/glow effects in viewport
5. Particles in viewport

---

## Technical Decisions

### Three.js Setup
```javascript
// ES6 Modules from CDN
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.162.0/examples/jsm/controls/OrbitControls.js';
```

### Grid Shader (Simplified)
Based on research, use a plane with a custom shader that:
- Draws anti-aliased grid lines
- Fades with distance
- Has neon cyan/magenta colors

### Viewport/Terminal Split
- Flexbox column layout
- Viewport: 60% height (or fixed px)
- Terminal: 40% height (scrollable)
- No fighting for space, explicit heights

### Input Handling
- Keyboard: 1-9 for choices, Enter to confirm
- Click/Touch: Direct button clicks
- No complex gesture handling needed

---

## CSS Critical Rules

```css
/* Root Layout */
html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
    background: #0a0a0a;
}

#game {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

#viewport {
    flex: 0 0 60%;
    position: relative;
}

#viewport canvas {
    width: 100%;
    height: 100%;
    display: block;
}

#terminal {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    font-family: 'Courier New', monospace;
    color: #0ff;
    background: #000;
}
```

---

## Zone Data Format (Preserved)

```javascript
const zones = {
    "ZONE_ID": {
        id: "ZONE_ID",
        title: "Display Title",
        description: "Narrative text...",
        choices: [
            {
                label: "Choice Text",
                next: "NEXT_ZONE_ID",      // Optional: navigation
                cost: { bandwidth: 10 },    // Optional: resource cost
                reward: { credits: 50 },    // Optional: resource gain
                action: "RESET"             // Optional: special action
            }
        ]
    }
};
```

---

## Next Steps

1. Delete all old files except `data/zones.js`
2. Create new `index.html` with clean structure
3. Create `styles.css` with viewport/terminal split
4. Create `game/main.js` entry point
5. Build Viewport.js with grid
6. Build Terminal.js with choice rendering
7. Wire up Game.js state machine
8. Test and deploy
