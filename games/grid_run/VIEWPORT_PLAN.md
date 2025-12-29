# Grid Run Viewport Implementation Plan

## Overview

Add a Three.js 3D visualization layer ("The Grid") to Grid Run, creating an immersive Tron/Neuromancer/Matrix-style experience. The viewport displays above the terminal interface.

---

## Research Summary

### Three.js Configuration
- **Version**: Latest (r183+) via ES6 modules from CDN
- **Renderer**: WebGLRenderer with antialias
- **Post-processing**: EffectComposer → RenderPass → UnrealBloomPass → FilmPass → OutputPass

### Key Components Identified
1. **InfiniteGridHelper** - Shader-based infinite grid with anti-aliasing and distance fade
2. **UnrealBloomPass** - High-quality bloom for neon glow effects
3. **FilmPass** - Scanlines and noise for CRT aesthetic
4. **Line2/LineMaterial** - Thick lines for wireframe objects (if needed)

### Reference Implementations
- [THREE.InfiniteGridHelper](https://github.com/Fyrestar/THREE.InfiniteGridHelper) - MIT licensed
- Three.js webgl_postprocessing_unreal_bloom example
- Three.js webgl_geometry_terrain for camera/controls pattern

---

## Design Decisions (User Confirmed)

| Decision | Choice |
|----------|--------|
| Layout | Top viewport + bottom terminal |
| Fidelity | Smooth 3D (not ASCII) |
| Interactivity | 3D objects can trigger choices when appropriate |
| Performance | Production quality with good effects |
| Fallback | Progressive enhancement (works without WebGL) |

---

## Architecture

```
games/grid_run/
├── index.html              # Updated with viewport container
├── grid_run.css            # Updated with split layout
├── main.js                 # Updated to init viewport
├── viewport/
│   ├── viewport.js         # Main GridViewport class
│   ├── grid.js             # InfiniteGrid implementation
│   ├── nodes.js            # Node/ICE visualization
│   └── postprocessing.js   # Effect chain setup
├── core/
│   ├── events.js           # Existing event bus
│   └── engine.js           # Existing game engine
└── ui/
    ├── terminal.js         # Existing
    └── hud.js              # Existing
```

---

## File Structure

### viewport/viewport.js (Main Entry)
```javascript
// Responsibilities:
// - WebGL capability detection
// - Three.js scene/camera/renderer setup
// - Animation loop
// - Event bus integration (NODE_ENTER, GAME_START, etc.)
// - Progressive enhancement fallback
```

### viewport/grid.js (Infinite Grid)
```javascript
// Responsibilities:
// - ShaderMaterial-based infinite grid
// - Era-based color theming (80s=green, 90s=cyan, 2000s=white)
// - Distance-based fade
// - Anti-aliased lines via shader
```

### viewport/nodes.js (Object Visualization)
```javascript
// Responsibilities:
// - IcosahedronGeometry for current node
// - BoxGeometry for ICE/obstacles
// - Particle systems for data packets
// - Click/hover detection (Raycaster)
```

### viewport/postprocessing.js (Effects)
```javascript
// Responsibilities:
// - EffectComposer setup
// - UnrealBloomPass (glow)
// - Optional FilmPass (scanlines)
// - Resize handling
```

---

## Implementation Phases

### Phase 1: Core Viewport (MVP)
1. Update `index.html` with `<div id="viewport-container">` before terminal
2. Update `grid_run.css` with split-screen layout
3. Create `viewport/viewport.js` with:
   - WebGL detection
   - Basic scene (black background)
   - Perspective camera
   - Animation loop
4. Integrate with `main.js`

### Phase 2: Infinite Grid
1. Port InfiniteGridHelper shader to ES6 module
2. Add era-based color system:
   - ZONE_0/1 (1980s): `#00ff00` phosphor green
   - ZONE_2 (1990s): `#00ffff` cyan
   - ZONE_3 (2000s): `#ffffff` white/blue
3. Add subtle grid animation (scroll on NODE_ENTER)

### Phase 3: Post-Processing
1. Add EffectComposer
2. Configure UnrealBloomPass:
   - threshold: 0
   - strength: 0.8
   - radius: 0.3
3. Optional FilmPass for scanlines

### Phase 4: Node Visualization
1. Add central node geometry (IcosahedronGeometry)
2. Add wireframe edges with glow
3. Animate on NODE_ENTER (pulse/rotate)
4. Add floating particles

### Phase 5: Interactivity
1. Raycaster for click detection
2. Map 3D objects to game choices (optional)
3. Hover effects

---

## CDN Strategy

```html
<script type="importmap">
{
  "imports": {
    "three": "https://unpkg.com/three@0.170.0/build/three.module.js",
    "three/addons/": "https://unpkg.com/three@0.170.0/examples/jsm/"
  }
}
</script>
```

---

## Event Integration

| Game Event | Viewport Response |
|------------|-------------------|
| `GAME_START` | Initialize, show grid |
| `NODE_ENTER` | Animate transition, update colors based on era |
| `PLAYER_ACTION` | Pulse effect on node |
| `GAME_OVER` | Glitch/distort effect |

---

## Progressive Enhancement

```javascript
// In viewport.js
if (!supportsWebGL()) {
  console.log('WebGL not supported, falling back to terminal-only mode');
  document.getElementById('viewport-container').style.display = 'none';
  document.getElementById('terminal-container').style.height = '100vh';
  return;
}
```

---

## Performance Targets

- **60 FPS** on modern hardware
- **30 FPS** minimum on integrated graphics
- **< 50MB** memory footprint
- **< 5s** initial load time

---

## Color Palette (Era-Based)

| Era | Primary | Secondary | Accent |
|-----|---------|-----------|--------|
| 1980s (ARPANET) | `#00ff00` | `#003300` | `#00aa00` |
| 1990s (BBS/Web) | `#00ffff` | `#003333` | `#0088ff` |
| 2000s (Modern) | `#ffffff` | `#333333` | `#ff3333` |

---

## Next Steps

1. ✅ Research complete
2. ⏳ Create viewport.js with WebGL detection and basic scene
3. ⏳ Add infinite grid shader
4. ⏳ Add bloom postprocessing
5. ⏳ Update HTML/CSS layout
6. ⏳ Integrate with event bus
7. ⏳ Test and iterate
