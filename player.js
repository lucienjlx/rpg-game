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

        // Position player at origin
        this.mesh.position.set(0, 0, 0);

        this.scene.add(this.mesh);
    }

    update(delta, keys) {
        // Update attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown -= delta;
        }

        // Movement
        const moveSpeed = this.speed * delta;
        let moved = false;

        if (keys['w'] || keys['arrowup']) {
            this.mesh.position.z -= moveSpeed;
            moved = true;
        }
        if (keys['s'] || keys['arrowdown']) {
            this.mesh.position.z += moveSpeed;
            moved = true;
        }
        if (keys['a'] || keys['arrowleft']) {
            this.mesh.position.x -= moveSpeed;
            moved = true;
        }
        if (keys['d'] || keys['arrowright']) {
            this.mesh.position.x += moveSpeed;
            moved = true;
        }

        // Keep player within bounds
        const boundary = 45;
        this.mesh.position.x = Math.max(-boundary, Math.min(boundary, this.mesh.position.x));
        this.mesh.position.z = Math.max(-boundary, Math.min(boundary, this.mesh.position.z));

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
            this.mesh.position.set(0, 0, 0);
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
}
