/**
 * grid.js - Infinite Grid Shader
 * 
 * Creates a shader-based infinite grid with:
 * - Anti-aliased lines via fwidth()
 * - Distance-based fade
 * - Era-based color theming
 * 
 * Based on THREE.InfiniteGridHelper by Fyrestar (MIT License)
 * https://github.com/Fyrestar/THREE.InfiniteGridHelper
 */

import * as THREE from 'three';

/**
 * Create an infinite grid mesh with custom shader
 * 
 * @param {number} size1 - Size of primary grid cells
 * @param {number} size2 - Size of secondary grid cells (larger, dimmer)
 * @param {THREE.Color} color - Grid line color
 * @param {number} distance - Fade distance from camera
 * @returns {THREE.Mesh} The grid mesh
 */
export function createInfiniteGrid(size1 = 10, size2 = 100, color = new THREE.Color(0x00ff00), distance = 500) {
    const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
    
    const material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
        
        uniforms: {
            uSize1: { value: size1 },
            uSize2: { value: size2 },
            uColor: { value: color },
            uDistance: { value: distance },
            uTime: { value: 0 }
        },
        
        vertexShader: /* glsl */`
            varying vec3 worldPosition;
            uniform float uDistance;
            
            void main() {
                // Expand plane to cover view distance
                vec3 pos = position.xzy * uDistance;
                
                // Follow camera on xz plane
                pos.xz += cameraPosition.xz;
                
                worldPosition = pos;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        
        fragmentShader: /* glsl */`
            varying vec3 worldPosition;
            
            uniform float uSize1;
            uniform float uSize2;
            uniform vec3 uColor;
            uniform float uDistance;
            uniform float uTime;
            
            /**
             * Calculate grid line intensity using anti-aliased approach
             */
            float getGrid(float size) {
                vec2 r = worldPosition.xz / size;
                
                // Anti-aliased grid lines using fwidth
                vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
                float line = min(grid.x, grid.y);
                
                return 1.0 - min(line, 1.0);
            }
            
            void main() {
                // Distance-based fade
                float d = 1.0 - min(distance(cameraPosition.xz, worldPosition.xz) / uDistance, 1.0);
                
                // Primary and secondary grid
                float g1 = getGrid(uSize1);
                float g2 = getGrid(uSize2);
                
                // Subtle pulse animation
                float pulse = 1.0 + sin(uTime * 2.0) * 0.05;
                
                // Combine grids with primary on top
                float gridIntensity = mix(g2, g1, g1) * pulse;
                
                // Calculate alpha with distance fade (cubic falloff)
                float alpha = gridIntensity * pow(d, 3.0);
                
                // Blend secondary grid at half intensity
                alpha = mix(0.4 * alpha, alpha, g2);
                
                // Discard fully transparent fragments
                if (alpha <= 0.0) discard;
                
                // Add slight glow intensity for bloom
                vec3 finalColor = uColor * (1.0 + g1 * 0.5);
                
                gl_FragColor = vec4(finalColor, alpha);
            }
        `,
        
        extensions: {
            derivatives: true
        }
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    
    // Rotate to lie flat on XZ plane
    mesh.rotation.x = -Math.PI / 2;
    
    // Prevent frustum culling (infinite grid is always visible)
    mesh.frustumCulled = false;
    
    // Store reference for animation updates
    mesh.userData.isGrid = true;
    
    return mesh;
}

/**
 * Animated grid that scrolls/pulses on events
 */
export class AnimatedGrid {
    constructor(scene, options = {}) {
        this.scene = scene;
        this.options = {
            size1: options.size1 || 10,
            size2: options.size2 || 100,
            color: options.color || new THREE.Color(0x00ff00),
            distance: options.distance || 500
        };
        
        this.mesh = null;
        this.targetColor = this.options.color.clone();
        this.scrollSpeed = 0;
        this.init();
    }
    
    init() {
        this.mesh = createInfiniteGrid(
            this.options.size1,
            this.options.size2,
            this.options.color,
            this.options.distance
        );
        this.scene.add(this.mesh);
    }
    
    /**
     * Update grid animation
     * @param {number} delta - Time since last frame
     * @param {number} elapsed - Total elapsed time
     */
    update(delta, elapsed) {
        if (!this.mesh || !this.mesh.material.uniforms) return;
        
        // Update time uniform for subtle pulse
        this.mesh.material.uniforms.uTime.value = elapsed;
        
        // Smooth color transition
        const currentColor = this.mesh.material.uniforms.uColor.value;
        currentColor.lerp(this.targetColor, delta * 2);
    }
    
    /**
     * Set grid color with smooth transition
     * @param {THREE.Color} color - Target color
     */
    setColor(color) {
        this.targetColor.copy(color);
    }
    
    /**
     * Trigger scroll animation (for node transitions)
     * @param {number} speed - Scroll speed
     * @param {number} duration - Duration in seconds
     */
    scroll(speed = 5, duration = 1) {
        this.scrollSpeed = speed;
        
        // Decay scroll speed over duration
        const decay = () => {
            this.scrollSpeed *= 0.95;
            if (this.scrollSpeed > 0.01) {
                requestAnimationFrame(decay);
            } else {
                this.scrollSpeed = 0;
            }
        };
        
        setTimeout(decay, duration * 1000);
    }
    
    /**
     * Dispose of grid resources
     */
    dispose() {
        if (this.mesh) {
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
            this.scene.remove(this.mesh);
        }
    }
}
