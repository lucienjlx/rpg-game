class WallSystem {
    constructor() {
        this.walls = [];
        // Walls for 3x3 grid layout - all adjacent zones
        // Format: { x, z, width, depth, height, zoneA, zoneB, type }
        this.wallPositions = [
            // Bottom row vertical walls (between columns)
            { x: -25, z: -50, width: 3, depth: 50, height: 8, zoneA: 1, zoneB: 2, type: 'stone' },  // Green-Desert
            { x: 25, z: -50, width: 3, depth: 50, height: 8, zoneA: 2, zoneB: 3, type: 'stone' },   // Desert-Shadow

            // Middle row vertical walls (between columns)
            { x: -25, z: 0, width: 3, depth: 50, height: 8, zoneA: 4, zoneB: 5, type: 'lava' },     // Volcanic-Frozen
            { x: 25, z: 0, width: 3, depth: 50, height: 8, zoneA: 5, zoneB: 6, type: 'ice' },       // Frozen-Forest

            // Top row vertical walls (between columns)
            { x: -25, z: 50, width: 3, depth: 50, height: 8, zoneA: 7, zoneB: 8, type: 'crystal' }, // Crystal-Mystic
            { x: 25, z: 50, width: 3, depth: 50, height: 8, zoneA: 8, zoneB: 9, type: 'void' },     // Mystic-Void

            // Horizontal walls (between rows)
            { x: -50, z: -25, width: 50, depth: 3, height: 8, zoneA: 1, zoneB: 4, type: 'stone' },  // Green-Volcanic
            { x: 0, z: -25, width: 50, depth: 3, height: 8, zoneA: 2, zoneB: 5, type: 'stone' },    // Desert-Frozen
            { x: 50, z: -25, width: 50, depth: 3, height: 8, zoneA: 3, zoneB: 6, type: 'shadow' },  // Shadow-Forest

            { x: -50, z: 25, width: 50, depth: 3, height: 8, zoneA: 4, zoneB: 7, type: 'lava' },    // Volcanic-Crystal
            { x: 0, z: 25, width: 50, depth: 3, height: 8, zoneA: 5, zoneB: 8, type: 'ice' },       // Frozen-Mystic
            { x: 50, z: 25, width: 50, depth: 3, height: 8, zoneA: 6, zoneB: 9, type: 'corrupted' } // Forest-Void
        ];
    }

    createWalls(scene) {
        for (let i = 0; i < this.wallPositions.length; i++) {
            const pos = this.wallPositions[i];

            // Create wall with specified dimensions
            const geometry = new THREE.BoxGeometry(pos.width, pos.height, pos.depth);

            // Choose material based on wall type for more realism
            let material;
            switch(pos.type) {
                case 'lava':
                    material = new THREE.MeshStandardMaterial({
                        color: 0x8B0000,
                        roughness: 0.7,
                        metalness: 0.3,
                        emissive: 0xFF4500,
                        emissiveIntensity: 0.3
                    });
                    break;
                case 'ice':
                    material = new THREE.MeshStandardMaterial({
                        color: 0xB0E0E6,
                        roughness: 0.2,
                        metalness: 0.1,
                        transparent: true,
                        opacity: 0.8,
                        emissive: 0x00CED1,
                        emissiveIntensity: 0.2
                    });
                    break;
                case 'crystal':
                    material = new THREE.MeshStandardMaterial({
                        color: 0x9370DB,
                        roughness: 0.3,
                        metalness: 0.7,
                        emissive: 0x8A2BE2,
                        emissiveIntensity: 0.4
                    });
                    break;
                case 'shadow':
                    material = new THREE.MeshStandardMaterial({
                        color: 0x2F2F2F,
                        roughness: 0.9,
                        metalness: 0.1,
                        emissive: 0x4b0082,
                        emissiveIntensity: 0.2
                    });
                    break;
                case 'void':
                    material = new THREE.MeshStandardMaterial({
                        color: 0x1C1C1C,
                        roughness: 0.8,
                        metalness: 0.5,
                        emissive: 0x9400D3,
                        emissiveIntensity: 0.5
                    });
                    break;
                case 'corrupted':
                    material = new THREE.MeshStandardMaterial({
                        color: 0x3D5229,
                        roughness: 0.9,
                        metalness: 0.1,
                        emissive: 0x228B22,
                        emissiveIntensity: 0.1
                    });
                    break;
                default: // stone
                    material = new THREE.MeshStandardMaterial({
                        color: 0x808080,
                        roughness: 0.9,
                        metalness: 0.1
                    });
            }

            const wall = new THREE.Mesh(geometry, material);
            wall.position.set(pos.x, pos.height / 2, pos.z);
            wall.castShadow = true;
            wall.receiveShadow = true;

            scene.add(wall);
            this.walls.push({
                mesh: wall,
                active: true,
                removing: false,
                position: pos,
                zoneA: pos.zoneA,
                zoneB: pos.zoneB
            });
        }
    }

    checkCollision(position) {
        for (let wall of this.walls) {
            if (!wall.active) continue;

            // AABB collision detection
            const wallHalfWidth = wall.position.width / 2;
            const wallHalfDepth = wall.position.depth / 2;
            const playerRadius = 1.0;

            const minX = wall.position.x - wallHalfWidth - playerRadius;
            const maxX = wall.position.x + wallHalfWidth + playerRadius;
            const minZ = wall.position.z - wallHalfDepth - playerRadius;
            const maxZ = wall.position.z + wallHalfDepth + playerRadius;

            if (position.x >= minX && position.x <= maxX &&
                position.z >= minZ && position.z <= maxZ) {
                return true; // Collision detected
            }
        }
        return false;
    }

    removeWall(wallIndex, scene) {
        if (wallIndex < 0 || wallIndex >= this.walls.length) return;

        const wall = this.walls[wallIndex];
        if (!wall.active || wall.removing) return;

        wall.removing = true;
        wall.active = false;

        // Animate wall sinking over 2 seconds
        const startY = wall.mesh.position.y;
        const endY = -5;
        const duration = 2000;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            wall.mesh.position.y = startY + (endY - startY) * progress;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Remove from scene after animation
                scene.remove(wall.mesh);
            }
        };

        animate();
    }

    // Remove wall between two specific zones
    removeWallBetweenZones(zoneA, zoneB, scene) {
        for (let i = 0; i < this.walls.length; i++) {
            const wall = this.walls[i];
            if ((wall.zoneA === zoneA && wall.zoneB === zoneB) ||
                (wall.zoneA === zoneB && wall.zoneB === zoneA)) {
                this.removeWall(i, scene);
                return;
            }
        }
    }

    update(deltaTime) {
        // Update any ongoing animations if needed
    }
}
