/**
 * viewport.js - Grid Run 3D Visualization
 * 
 * Creates a Tron/Neuromancer/Matrix-style cyberpunk grid visualization
 * using Three.js with bloom postprocessing.
 * 
 * Architecture:
 * - Progressive enhancement (works without WebGL)
 * - Event-driven integration with game engine
 * - Era-based color theming
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { createInfiniteGrid } from './grid.js';
import { NodeVisualizer } from './nodes.js';
import { bus } from '../core/events.js';

// Era color themes
const ERA_COLORS = {
    'ZONE_0': { primary: 0x00ff00, secondary: 0x003300, name: '80s' },  // Phosphor green
    'ZONE_1': { primary: 0x00ff00, secondary: 0x003300, name: '80s' },  // ARPANET era
    'ZONE_2': { primary: 0x00ffff, secondary: 0x003333, name: '90s' },  // Cyan era
    'ZONE_3': { primary: 0xffffff, secondary: 0x333333, name: '2000s' }, // Modern
    'default': { primary: 0x00ff00, secondary: 0x001100, name: 'default' }
};

/**
 * Check for WebGL support
 */
function supportsWebGL() {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && 
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
}

/**
 * GridViewport - Main 3D visualization class
 */
export class GridViewport {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.composer = null;
        this.grid = null;
        this.nodeViz = null;
        this.clock = new THREE.Clock();
        this.isRunning = false;
        this.currentEra = 'default';
        
        // Bloom settings
        this.bloomParams = {
            threshold: 0,
            strength: 0.8,
            radius: 0.4
        };
    }

    /**
     * Initialize the viewport
     * @returns {boolean} True if initialization succeeded
     */
    init() {
        // Check WebGL support
        if (!supportsWebGL()) {
            console.warn('[VIEWPORT] WebGL not supported, falling back to terminal-only mode');
            this.handleFallback();
            return false;
        }

        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.error('[VIEWPORT] Container not found:', this.containerId);
            return false;
        }

        try {
            this.initScene();
            this.initCamera();
            this.initRenderer();
            this.initPostProcessing();
            this.initGrid();
            this.initNodeVisualizer();
            this.setupEventListeners();
            this.setupGameEvents();
            
            // Start animation loop
            this.isRunning = true;
            this.animate();
            
            console.log('[VIEWPORT] Initialized successfully');
            return true;
        } catch (error) {
            console.error('[VIEWPORT] Initialization failed:', error);
            this.handleFallback();
            return false;
        }
    }

    /**
     * Handle fallback when WebGL is unavailable
     */
    handleFallback() {
        const viewport = document.getElementById(this.containerId);
        if (viewport) {
            viewport.style.display = 'none';
        }
        // Terminal will take full height via CSS fallback
        document.body.classList.add('no-webgl');
    }

    /**
     * Initialize Three.js scene
     */
    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000505);
        
        // Subtle fog for depth
        this.scene.fog = new THREE.FogExp2(0x000505, 0.015);
    }

    /**
     * Initialize camera
     */
    initCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
        
        // Position camera looking down at the grid at an angle
        this.camera.position.set(0, 15, 25);
        this.camera.lookAt(0, 0, 0);
    }

    /**
     * Initialize WebGL renderer
     */
    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance'
        });
        
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap for performance
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        
        this.container.appendChild(this.renderer.domElement);
    }

    /**
     * Initialize post-processing effects
     */
    initPostProcessing() {
        const renderScene = new RenderPass(this.scene, this.camera);
        
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(this.container.clientWidth, this.container.clientHeight),
            this.bloomParams.strength,
            this.bloomParams.radius,
            this.bloomParams.threshold
        );
        
        const outputPass = new OutputPass();
        
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(renderScene);
        this.composer.addPass(bloomPass);
        this.composer.addPass(outputPass);
        
        // Store reference for later updates
        this.bloomPass = bloomPass;
    }

    /**
     * Initialize the infinite grid
     */
    initGrid() {
        const eraColor = ERA_COLORS[this.currentEra] || ERA_COLORS.default;
        this.grid = createInfiniteGrid(10, 100, new THREE.Color(eraColor.primary), 500);
        this.scene.add(this.grid);
    }

    /**
     * Initialize node visualizer
     */
    initNodeVisualizer() {
        this.nodeViz = new NodeVisualizer(this.scene);
        this.nodeViz.createCentralNode();
    }

    /**
     * Setup window resize listener
     */
    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
    }

    /**
     * Setup game event bus listeners
     */
    setupGameEvents() {
        // React to node changes
        bus.on('NODE_ENTER', (node) => this.onNodeEnter(node));
        
        // React to game start
        bus.on('GAME_START', () => this.onGameStart());
        
        // React to player actions
        bus.on('PLAYER_ACTION', (action) => this.onPlayerAction(action));
    }

    /**
     * Handle window resize
     */
    onWindowResize() {
        if (!this.container || !this.camera || !this.renderer) return;
        
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
        this.composer.setSize(width, height);
    }

    /**
     * Handle node enter event
     */
    onNodeEnter(node) {
        if (!node || !node.id) return;
        
        // Determine era from zone prefix
        const era = this.getEraFromNodeId(node.id);
        
        if (era !== this.currentEra) {
            this.currentEra = era;
            this.updateGridColor(era);
        }
        
        // Animate node visualizer
        if (this.nodeViz) {
            this.nodeViz.onNodeEnter(node);
        }
    }

    /**
     * Handle game start event
     */
    onGameStart() {
        this.currentEra = 'ZONE_0';
        this.updateGridColor('ZONE_0');
        
        if (this.nodeViz) {
            this.nodeViz.reset();
        }
    }

    /**
     * Handle player action event
     */
    onPlayerAction(action) {
        if (this.nodeViz) {
            this.nodeViz.pulse();
        }
    }

    /**
     * Extract era (zone) from node ID
     */
    getEraFromNodeId(nodeId) {
        if (!nodeId) return 'default';
        
        // Match ZONE_X pattern
        const match = nodeId.match(/^ZONE_(\d)/);
        if (match) {
            return `ZONE_${match[1]}`;
        }
        return 'default';
    }

    /**
     * Update grid color based on era
     */
    updateGridColor(era) {
        const eraColor = ERA_COLORS[era] || ERA_COLORS.default;
        
        if (this.grid && this.grid.material && this.grid.material.uniforms) {
            // Animate color transition
            const targetColor = new THREE.Color(eraColor.primary);
            this.grid.material.uniforms.uColor.value.copy(targetColor);
        }
        
        // Update scene background subtly
        this.scene.background = new THREE.Color(eraColor.secondary).multiplyScalar(0.1);
        this.scene.fog.color = new THREE.Color(eraColor.secondary).multiplyScalar(0.1);
    }

    /**
     * Animation loop
     */
    animate() {
        if (!this.isRunning) return;
        
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        const elapsed = this.clock.getElapsedTime();
        
        // Update node visualizer
        if (this.nodeViz) {
            this.nodeViz.update(delta, elapsed);
        }
        
        // Subtle camera breathing motion
        this.camera.position.y = 15 + Math.sin(elapsed * 0.5) * 0.5;
        
        // Render with post-processing
        this.composer.render();
    }

    /**
     * Clean up resources
     */
    dispose() {
        this.isRunning = false;
        
        if (this.grid) {
            this.grid.geometry.dispose();
            this.grid.material.dispose();
        }
        
        if (this.nodeViz) {
            this.nodeViz.dispose();
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.composer) {
            this.composer.dispose();
        }
    }
}

export { supportsWebGL, ERA_COLORS };
