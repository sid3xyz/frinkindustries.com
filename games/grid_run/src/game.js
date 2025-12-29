/**
 * GRID_RUN - Game Controller
 * Main game class, rendering, input handling
 */

import { STATES } from './states.js';
import { LANDMARKS, WEATHER_TYPES } from './data.js';

// =============================================================================
// GAME CLASS
// =============================================================================

export class Game {
  constructor() {
    this.currentState = null;
    this.currentStateName = '';
    this.state = null; // Game simulation state
    this.setupData = {
      profession: null,
      credits: 0,
      names: [],
      month: 3
    };
    
    // DOM elements
    this.viewport = null;
    this.terminal = null;
    this.contentArea = null;
    this.choicesArea = null;
    
    // Three.js (placeholder)
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    
    // Input handling
    this.inputHandler = this.handleKeyPress.bind(this);
  }
  
  // ===========================================================================
  // INITIALIZATION
  // ===========================================================================
  
  init() {
    // Get DOM elements
    this.viewport = document.getElementById('viewport');
    this.terminal = document.getElementById('terminal');
    this.contentArea = document.getElementById('content');
    this.choicesArea = document.getElementById('choices');
    
    if (!this.terminal || !this.contentArea || !this.choicesArea) {
      console.error('Required DOM elements not found!');
      return;
    }
    
    // Setup input
    document.addEventListener('keydown', this.inputHandler);
    
    // Setup viewport (Three.js placeholder)
    this.initViewport();
    
    // Start at title
    this.setState('title');
    
    console.log('GRID_RUN initialized');
  }
  
  // ===========================================================================
  // VIEWPORT (Three.js)
  // ===========================================================================
  
  initViewport() {
    if (!this.viewport) return;
    
    // Check for Three.js
    if (typeof THREE === 'undefined') {
      this.viewport.innerHTML = `
        <div style="color: #0f0; font-family: monospace; padding: 20px; text-align: center;">
          <pre>
╔══════════════════════════════════════╗
║      GRID_RUN VIEWPORT               ║
║                                      ║
║   [Three.js Loading...]              ║
║                                      ║
║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ║
║                                      ║
╚══════════════════════════════════════╝
          </pre>
        </div>
      `;
      return;
    }
    
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    
    // Create camera
    const aspect = this.viewport.clientWidth / this.viewport.clientHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(0, 0, 0);
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.viewport.clientWidth, this.viewport.clientHeight);
    this.viewport.appendChild(this.renderer.domElement);
    
    // Create grid (cyberpunk aesthetic)
    this.createGrid();
    
    // Start render loop
    this.animate();
    
    // Handle resize
    window.addEventListener('resize', () => this.onResize());
  }
  
  createGrid() {
    // Ground grid
    const gridHelper = new THREE.GridHelper(100, 50, 0x00ff00, 0x003300);
    this.scene.add(gridHelper);
    
    // Add some atmosphere
    const fog = new THREE.Fog(0x000000, 10, 50);
    this.scene.fog = fog;
    
    // Simple "wagon" placeholder
    const geometry = new THREE.BoxGeometry(1, 0.5, 2);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x00ffff, 
      wireframe: true 
    });
    this.wagon = new THREE.Mesh(geometry, material);
    this.wagon.position.set(0, 0.5, 0);
    this.scene.add(this.wagon);
    
    // Add some ambient objects
    for (let i = 0; i < 20; i++) {
      const size = 0.5 + Math.random() * 1.5;
      const geo = new THREE.BoxGeometry(size, size * 2, size);
      const mat = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00, 
        wireframe: true,
        opacity: 0.3,
        transparent: true
      });
      const obj = new THREE.Mesh(geo, mat);
      obj.position.set(
        (Math.random() - 0.5) * 40,
        size,
        (Math.random() - 0.5) * 40
      );
      this.scene.add(obj);
    }
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    // Animate grid scrolling effect when traveling
    if (this.currentStateName === 'travel' && this.currentState.traveling) {
      this.scene.traverse(obj => {
        if (obj.position && obj !== this.wagon && obj !== this.camera) {
          obj.position.z += 0.1;
          if (obj.position.z > 30) {
            obj.position.z = -30;
          }
        }
      });
    }
    
    // Render
    if (this.renderer) {
      this.renderer.render(this.scene, this.camera);
    }
  }
  
  onResize() {
    if (!this.viewport || !this.renderer || !this.camera) return;
    
    const width = this.viewport.clientWidth;
    const height = this.viewport.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
  
  // ===========================================================================
  // STATE MANAGEMENT
  // ===========================================================================
  
  setState(stateName) {
    // Exit current state
    if (this.currentState) {
      this.currentState.exit();
    }
    
    // Create new state
    const StateClass = STATES[stateName];
    if (!StateClass) {
      console.error(`Unknown state: ${stateName}`);
      return;
    }
    
    this.currentStateName = stateName;
    this.currentState = new StateClass(this);
    this.currentState.enter();
    
    // Render
    this.render();
  }
  
  // ===========================================================================
  // RENDERING
  // ===========================================================================
  
  render() {
    if (!this.currentState) return;
    
    const { content, choices } = this.currentState.render();
    
    // Render content
    this.contentArea.innerHTML = this.formatContent(content);
    
    // Render choices
    this.choicesArea.innerHTML = choices.map(c => 
      `<div class="choice" data-key="${c.key}">[${c.key}] ${c.text}</div>`
    ).join('');
    
    // Add click handlers to choices
    this.choicesArea.querySelectorAll('.choice').forEach(el => {
      el.addEventListener('click', () => {
        const key = el.dataset.key;
        this.handleKeyPress({ key: key === 'ENTER' ? 'Enter' : key });
      });
    });
    
    // Update viewport era styling
    this.updateViewportStyle();
  }
  
  formatContent(text) {
    // Convert to HTML with styling
    return text
      .replace(/\n/g, '<br>')
      .replace(/╔/g, '<span class="box-char">╔</span>')
      .replace(/╗/g, '<span class="box-char">╗</span>')
      .replace(/╚/g, '<span class="box-char">╚</span>')
      .replace(/╝/g, '<span class="box-char">╝</span>')
      .replace(/║/g, '<span class="box-char">║</span>')
      .replace(/═/g, '<span class="box-char">═</span>')
      .replace(/╠/g, '<span class="box-char">╠</span>')
      .replace(/╣/g, '<span class="box-char">╣</span>')
      .replace(/█/g, '<span class="health-full">█</span>')
      .replace(/░/g, '<span class="health-empty">░</span>')
      .replace(/►/g, '<span class="marker">►</span>')
      .replace(/✓/g, '<span class="success">✓</span>')
      .replace(/⚠/g, '<span class="danger">⚠</span>')
      .replace(/✝/g, '<span class="death">✝</span>')
      .replace(/★/g, '<span class="landmark">★</span>')
      .replace(/— Malcolm/g, '<span class="malcolm">— Malcolm</span>');
  }
  
  updateViewportStyle() {
    if (!this.state || !this.viewport) return;
    
    const landmark = LANDMARKS[this.state.currentLandmarkIndex];
    if (!landmark) return;
    
    // Update colors based on era
    const eraColors = {
      1: { bg: 0x001100, grid: 0x00ff00 }, // Primordial - green
      2: { bg: 0x110011, grid: 0xff00ff }, // Browser Wars - magenta
      3: { bg: 0x001122, grid: 0x0088ff }  // Cloud - blue
    };
    
    const colors = eraColors[landmark.era] || eraColors[1];
    
    if (this.scene) {
      this.scene.background = new THREE.Color(colors.bg);
    }
  }
  
  // ===========================================================================
  // INPUT HANDLING
  // ===========================================================================
  
  handleKeyPress(event) {
    if (!this.currentState) return;
    
    // Normalize key
    let key = event.key;
    
    // Handle special keys
    if (key === ' ') key = 'Space';
    
    // Pass to current state
    this.currentState.handleInput(key);
    
    // Re-render
    this.render();
  }
  
  // ===========================================================================
  // SAVE / LOAD
  // ===========================================================================
  
  saveGame() {
    if (!this.state) return;
    
    const saveData = {
      state: this.state,
      setupData: this.setupData,
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem('GRID_RUN_SAVE', JSON.stringify(saveData));
      this.state.recentMessages = [{ type: 'success', text: 'Game saved!' }];
    } catch (e) {
      console.error('Save failed:', e);
      this.state.recentMessages = [{ type: 'danger', text: 'Save failed!' }];
    }
  }
  
  loadGame() {
    try {
      const saveJson = localStorage.getItem('GRID_RUN_SAVE');
      if (!saveJson) {
        alert('No saved game found.');
        return;
      }
      
      const saveData = JSON.parse(saveJson);
      this.state = saveData.state;
      this.setupData = saveData.setupData;
      
      this.setState('travel');
    } catch (e) {
      console.error('Load failed:', e);
      alert('Failed to load saved game.');
    }
  }
  
  // ===========================================================================
  // RESET
  // ===========================================================================
  
  reset() {
    this.state = null;
    this.setupData = {
      profession: null,
      credits: 0,
      names: [],
      month: 3
    };
  }
  
  // ===========================================================================
  // CLEANUP
  // ===========================================================================
  
  destroy() {
    document.removeEventListener('keydown', this.inputHandler);
    
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
