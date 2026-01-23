class WallSystem {
    constructor() {
        this.walls = [];
        this.wallPositions = [
            { x: 0, z: 0 },   // Between Zone 1 and 2
            { x: 50, z: 0 },  // Between Zone 2 and 3
            { x: 100, z: 0 }  // Between Zone 3 and 4
        ];
    }

    createWalls(scene) {
        for (let i = 0; i < this.wallPositions.length; i++) {
            const pos = this.wallPositions[i];

            // Make walls thicker to prevent glitching through
            const geometry = new THREE.BoxGeometry(3, 5, 50);
            const material = new THREE.MeshStandardMaterial({
                color: 0x808080,
                roughness: 0.9,
                metalness: 0.1
            });
            const wall = new THREE.Mesh(geometry, material);
            wall.position.set(pos.x, 2.5, pos.z);
            wall.castShadow = true;
            wall.receiveShadow = true;

            scene.add(wall);
            this.walls.push({
                mesh: wall,
                active: true,
                removing: false,
                position: pos
            });
        }
    }

    checkCollision(position) {
        for (let wall of this.walls) {
            if (!wall.active) continue;

            // AABB collision detection with larger buffer
            const wallHalfWidth = 1.5;  // Wall width is now 3
            const wallHalfDepth = 25;   // Wall depth is 50
            const playerRadius = 1.0;   // Increased player collision radius

            const minX = wall.position.x - wallHalfWidth - playerRadius;
            const maxX = wall.position.x + wallHalfWidth + playerRadius;
            const minZ = wall.position.z - wallHalfDepth;
            const maxZ = wall.position.z + wallHalfDepth;

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
        const endY = -3;
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

    update(deltaTime) {
        // Update any ongoing animations if needed
    }
}
