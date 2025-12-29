/**
 * nodes.js - Node Visualization
 * 
 * Creates 3D representations of game nodes:
 * - Central icosahedron for current location
 * - Wireframe edges with glow
 * - Floating data particles
 * - Pulse animations on events
 */

import * as THREE from 'three';

/**
 * NodeVisualizer - Manages 3D node representations
 */
export class NodeVisualizer {
    constructor(scene) {
        this.scene = scene;
        this.centralNode = null;
        this.wireframe = null;
        this.particles = null;
        this.particleCount = 50;
        
        // Animation state
        this.pulseIntensity = 0;
        this.rotationSpeed = 0.3;
        this.targetScale = 1.0;
        this.currentScale = 1.0;
    }

    /**
     * Create the central node geometry
     */
    createCentralNode() {
        // Main icosahedron (solid core)
        const geometry = new THREE.IcosahedronGeometry(2, 1);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.3
        });
        
        this.centralNode = new THREE.Mesh(geometry, material);
        this.centralNode.position.set(0, 3, 0);
        this.scene.add(this.centralNode);
        
        // Wireframe overlay (glowing edges)
        const wireMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true,
            transparent: true,
            opacity: 0.9
        });
        
        this.wireframe = new THREE.Mesh(geometry.clone(), wireMaterial);
        this.wireframe.position.copy(this.centralNode.position);
        this.wireframe.scale.setScalar(1.02); // Slightly larger to avoid z-fighting
        this.scene.add(this.wireframe);
        
        // Create floating particles
        this.createParticles();
        
        // Add point light inside node for extra glow
        this.nodeLight = new THREE.PointLight(0x00ff00, 1, 20);
        this.nodeLight.position.copy(this.centralNode.position);
        this.scene.add(this.nodeLight);
    }

    /**
     * Create floating data particles around the node
     */
    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const velocities = [];
        
        for (let i = 0; i < this.particleCount; i++) {
            // Random position in sphere around node
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const radius = 3 + Math.random() * 5;
            
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = 3 + radius * Math.cos(phi) * 0.5; // Flatten vertically
            positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
            
            // Store velocity for animation
            velocities.push({
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.02,
                orbitSpeed: 0.2 + Math.random() * 0.3
            });
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0x00ff00,
            size: 0.15,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.particles.userData.velocities = velocities;
        this.scene.add(this.particles);
    }

    /**
     * Update animations
     * @param {number} delta - Time since last frame
     * @param {number} elapsed - Total elapsed time
     */
    update(delta, elapsed) {
        if (!this.centralNode) return;
        
        // Rotate central node
        this.centralNode.rotation.y += this.rotationSpeed * delta;
        this.centralNode.rotation.x = Math.sin(elapsed * 0.5) * 0.1;
        
        // Sync wireframe rotation
        if (this.wireframe) {
            this.wireframe.rotation.copy(this.centralNode.rotation);
        }
        
        // Scale animation
        this.currentScale = THREE.MathUtils.lerp(this.currentScale, this.targetScale, delta * 3);
        this.centralNode.scale.setScalar(this.currentScale);
        if (this.wireframe) {
            this.wireframe.scale.setScalar(this.currentScale * 1.02);
        }
        
        // Pulse animation decay
        if (this.pulseIntensity > 0) {
            this.pulseIntensity -= delta * 2;
            const pulseScale = 1 + this.pulseIntensity * 0.3;
            this.centralNode.scale.multiplyScalar(pulseScale);
            if (this.wireframe) {
                this.wireframe.scale.multiplyScalar(pulseScale);
            }
            
            // Pulse light intensity
            if (this.nodeLight) {
                this.nodeLight.intensity = 1 + this.pulseIntensity * 2;
            }
        }
        
        // Animate particles
        this.updateParticles(delta, elapsed);
        
        // Subtle hover animation
        const hoverOffset = Math.sin(elapsed * 1.5) * 0.2;
        this.centralNode.position.y = 3 + hoverOffset;
        if (this.wireframe) {
            this.wireframe.position.y = 3 + hoverOffset;
        }
        if (this.nodeLight) {
            this.nodeLight.position.y = 3 + hoverOffset;
        }
    }

    /**
     * Update particle positions
     */
    updateParticles(delta, elapsed) {
        if (!this.particles) return;
        
        const positions = this.particles.geometry.attributes.position.array;
        const velocities = this.particles.userData.velocities;
        const centerY = 3;
        
        for (let i = 0; i < this.particleCount; i++) {
            const idx = i * 3;
            const vel = velocities[i];
            
            // Orbit around center
            const x = positions[idx];
            const z = positions[idx + 2];
            const angle = Math.atan2(z, x) + vel.orbitSpeed * delta;
            const radius = Math.sqrt(x * x + z * z);
            
            positions[idx] = Math.cos(angle) * radius;
            positions[idx + 2] = Math.sin(angle) * radius;
            
            // Vertical oscillation
            positions[idx + 1] = centerY + Math.sin(elapsed * vel.orbitSpeed + i) * 2;
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;
    }

    /**
     * Handle node enter event
     * @param {Object} node - The node data
     */
    onNodeEnter(node) {
        // Trigger transition animation
        this.targetScale = 0.5;
        
        // Expand back after a short delay
        setTimeout(() => {
            this.targetScale = 1.0;
            this.pulse();
        }, 200);
        
        // Update color based on zone
        if (node.id) {
            this.updateColorFromZone(node.id);
        }
    }

    /**
     * Update node color based on zone
     */
    updateColorFromZone(nodeId) {
        let color = 0x00ff00; // Default phosphor green
        
        if (nodeId.startsWith('ZONE_2')) {
            color = 0x00ffff; // Cyan for 90s
        } else if (nodeId.startsWith('ZONE_3')) {
            color = 0xffffff; // White for 2000s
        }
        
        const threeColor = new THREE.Color(color);
        
        if (this.centralNode) {
            this.centralNode.material.color.copy(threeColor);
        }
        if (this.wireframe) {
            this.wireframe.material.color.copy(threeColor);
        }
        if (this.particles) {
            this.particles.material.color.copy(threeColor);
        }
        if (this.nodeLight) {
            this.nodeLight.color.copy(threeColor);
        }
    }

    /**
     * Trigger pulse animation
     */
    pulse() {
        this.pulseIntensity = 1.0;
    }

    /**
     * Reset to initial state
     */
    reset() {
        this.targetScale = 1.0;
        this.currentScale = 1.0;
        this.pulseIntensity = 0;
        this.updateColorFromZone('ZONE_0');
    }

    /**
     * Dispose of all resources
     */
    dispose() {
        if (this.centralNode) {
            this.centralNode.geometry.dispose();
            this.centralNode.material.dispose();
            this.scene.remove(this.centralNode);
        }
        
        if (this.wireframe) {
            this.wireframe.geometry.dispose();
            this.wireframe.material.dispose();
            this.scene.remove(this.wireframe);
        }
        
        if (this.particles) {
            this.particles.geometry.dispose();
            this.particles.material.dispose();
            this.scene.remove(this.particles);
        }
        
        if (this.nodeLight) {
            this.scene.remove(this.nodeLight);
        }
    }
}
