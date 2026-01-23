class Player {
    constructor(scene) {
        this.scene = scene;
        this.speed = 5;
        this.rotationSpeed = 3;

        // Stats
        this.maxHealth = 100;
        this.health = 100;
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 100;
        this.damage = 20;
        this.attackRange = 3;
        this.attackCooldown = 0;
        this.attackCooldownTime = 0.5;

        // Create player mesh
        this.createMesh();

        // Update UI
        this.updateUI();
    }

    createMesh() {
        // Create a group to hold body and cape
        this.mesh = new THREE.Group();

        // Create yellow body (cylinder for character)
        const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 8);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1;
        body.castShadow = true;
        this.mesh.add(body);

        // Create head (sphere)
        const headGeometry = new THREE.SphereGeometry(0.4, 8, 8);
        const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffdd00 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2.4;
        head.castShadow = true;
        this.mesh.add(head);

        // Create red cape (plane behind the character)
        const capeGeometry = new THREE.PlaneGeometry(1.5, 2);
        const capeMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide
        });
        const cape = new THREE.Mesh(capeGeometry, capeMaterial);
        cape.position.set(0, 1, -0.6);
        cape.castShadow = true;
        this.mesh.add(cape);

        // Create sword weapon
        const swordGroup = new THREE.Group();

        // Sword blade
        const bladeGeometry = new THREE.BoxGeometry(0.15, 1.5, 0.05);
        const bladeMaterial = new THREE.MeshStandardMaterial({
            color: 0xc0c0c0,
            metalness: 0.9,
            roughness: 0.1
        });
        const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
        blade.position.y = 0.75;
        blade.castShadow = true;
        swordGroup.add(blade);

        // Sword handle
        const handleGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.4, 8);
        const handleMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b4513,
            roughness: 0.8
        });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.castShadow = true;
        swordGroup.add(handle);

        // Sword guard
        const guardGeometry = new THREE.BoxGeometry(0.4, 0.05, 0.1);
        const guardMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            metalness: 0.8,
            roughness: 0.2
        });
        const guard = new THREE.Mesh(guardGeometry, guardMaterial);
        guard.position.y = 0.2;
        guard.castShadow = true;
        swordGroup.add(guard);

        // Position sword at player's side
        swordGroup.position.set(0.6, 1, 0);
        swordGroup.rotation.z = -Math.PI / 4;
        this.mesh.add(swordGroup);
        this.sword = swordGroup;

        // Position player at starting position in Zone 1
        this.mesh.position.set(-25, 0, 0);

        this.scene.add(this.mesh);
    }

    update(delta, keys, wallSystem = null) {
        // Update attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown -= delta;
        }

        // Store old position for collision detection
        const oldPosition = this.mesh.position.clone();

        // Movement
        const moveSpeed = this.speed * delta;
        let moved = false;

        // Handle X-axis movement
        if (keys['a'] || keys['arrowleft']) {
            this.mesh.position.x -= moveSpeed;
            // Check collision for X movement
            if (wallSystem && wallSystem.checkCollision(this.mesh.position)) {
                this.mesh.position.x = oldPosition.x; // Revert only X
            } else {
                moved = true;
            }
        }
        if (keys['d'] || keys['arrowright']) {
            this.mesh.position.x += moveSpeed;
            // Check collision for X movement
            if (wallSystem && wallSystem.checkCollision(this.mesh.position)) {
                this.mesh.position.x = oldPosition.x; // Revert only X
            } else {
                moved = true;
            }
        }

        // Handle Z-axis movement
        if (keys['w'] || keys['arrowup']) {
            this.mesh.position.z -= moveSpeed;
            // Check collision for Z movement
            if (wallSystem && wallSystem.checkCollision(this.mesh.position)) {
                this.mesh.position.z = oldPosition.z; // Revert only Z
            } else {
                moved = true;
            }
        }
        if (keys['s'] || keys['arrowdown']) {
            this.mesh.position.z += moveSpeed;
            // Check collision for Z movement
            if (wallSystem && wallSystem.checkCollision(this.mesh.position)) {
                this.mesh.position.z = oldPosition.z; // Revert only Z
            } else {
                moved = true;
            }
        }

        // Keep player within bounds
        const boundary = 200; // Increased to accommodate all zones
        this.mesh.position.x = Math.max(-50, Math.min(150, this.mesh.position.x));
        this.mesh.position.z = Math.max(-25, Math.min(25, this.mesh.position.z));

        // Rotate player based on movement direction
        if (moved) {
            const direction = new THREE.Vector3();
            if (keys['w'] || keys['arrowup']) direction.z -= 1;
            if (keys['s'] || keys['arrowdown']) direction.z += 1;
            if (keys['a'] || keys['arrowleft']) direction.x -= 1;
            if (keys['d'] || keys['arrowright']) direction.x += 1;

            if (direction.length() > 0) {
                const targetRotation = Math.atan2(direction.x, direction.z);
                this.mesh.rotation.y = targetRotation;
            }
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) this.health = 0;

        this.updateUI();

        if (this.health <= 0) {
            this.die();
        }
    }

    heal(amount) {
        this.health += amount;
        if (this.health > this.maxHealth) this.health = this.maxHealth;
        this.updateUI();
    }

    gainXP(amount) {
        this.xp += amount;

        if (this.xp >= this.xpToNextLevel) {
            this.levelUp();
        }

        this.updateUI();
    }

    levelUp() {
        this.level++;
        this.xp -= this.xpToNextLevel;
        this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.5);

        // Increase stats
        this.maxHealth += 20;
        this.health = this.maxHealth;
        this.damage += 5;

        showMessage(`LEVEL UP! Now Level ${this.level}`, 3000);
        this.updateUI();
    }

    die() {
        showMessage('YOU DIED! Respawning...', 3000);

        // Respawn after delay
        setTimeout(() => {
            this.health = this.maxHealth;
            this.mesh.position.set(-25, 0, 0);
            this.updateUI();
        }, 3000);
    }

    updateUI() {
        // Update level
        document.getElementById('player-level').textContent = this.level;

        // Update health bar
        const healthPercent = (this.health / this.maxHealth) * 100;
        document.getElementById('health-bar').style.width = healthPercent + '%';
        document.getElementById('health-text').textContent =
            `${Math.floor(this.health)}/${this.maxHealth}`;

        // Update XP bar
        const xpPercent = (this.xp / this.xpToNextLevel) * 100;
        document.getElementById('xp-bar').style.width = xpPercent + '%';
        document.getElementById('xp-text').textContent =
            `${Math.floor(this.xp)}/${this.xpToNextLevel}`;
    }

    canAttack() {
        return this.attackCooldown <= 0;
    }

    startAttackCooldown() {
        this.attackCooldown = this.attackCooldownTime;
    }

    swingSword() {
        if (!this.sword) return;

        // Animate sword swing
        const originalRotation = this.sword.rotation.clone();
        const swingDuration = 200; // milliseconds
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / swingDuration, 1);

            // Swing from side to front
            if (progress < 0.5) {
                // Forward swing
                const swingProgress = progress * 2;
                this.sword.rotation.z = originalRotation.z + (Math.PI / 2) * swingProgress;
            } else {
                // Return to original position
                const returnProgress = (progress - 0.5) * 2;
                this.sword.rotation.z = originalRotation.z + (Math.PI / 2) * (1 - returnProgress);
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.sword.rotation.copy(originalRotation);
            }
        };

        animate();
    }
}
