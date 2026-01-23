class Monster {
    constructor(scene, x, z, zoneConfig = null) {
        this.scene = scene;
        this.speed = 2;
        this.detectionRange = 20;
        this.attackRange = 2;
        this.attackCooldown = 0;
        this.attackCooldownTime = 1.5;

        // Apply zone configuration if provided
        if (zoneConfig) {
            this.maxHealth = zoneConfig.health;
            this.health = zoneConfig.health;
            this.damage = zoneConfig.damage;
            this.color = zoneConfig.color;
            this.scale = zoneConfig.scale;
        } else {
            // Default stats
            this.maxHealth = 50;
            this.health = 50;
            this.damage = 10;
            this.color = 0x8b0000;
            this.scale = 1.0;
        }

        this.xpReward = 25;

        // Create monster mesh
        this.createMesh(x, z);
    }

    createMesh(x, z) {
        // Create a group for the monster
        this.mesh = new THREE.Group();

        // Create monster body (box with horns)
        const bodyGeometry = new THREE.BoxGeometry(1, 1.5, 1);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: this.color });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.75;
        body.castShadow = true;
        this.mesh.add(body);

        // Create head
        const headGeometry = new THREE.SphereGeometry(0.5, 8, 8);
        const headMaterial = new THREE.MeshStandardMaterial({ color: this.color });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.8;
        head.castShadow = true;
        this.mesh.add(head);

        // Create horns
        const hornGeometry = new THREE.ConeGeometry(0.15, 0.5, 4);
        const hornMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

        const leftHorn = new THREE.Mesh(hornGeometry, hornMaterial);
        leftHorn.position.set(-0.3, 2.3, 0);
        leftHorn.rotation.z = -0.3;
        this.mesh.add(leftHorn);

        const rightHorn = new THREE.Mesh(hornGeometry, hornMaterial);
        rightHorn.position.set(0.3, 2.3, 0);
        rightHorn.rotation.z = 0.3;
        this.mesh.add(rightHorn);

        // Create eyes
        const eyeGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff00 });

        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.2, 1.9, 0.4);
        this.mesh.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.2, 1.9, 0.4);
        this.mesh.add(rightEye);

        // Apply scale
        this.mesh.scale.set(this.scale, this.scale, this.scale);

        // Position monster
        this.mesh.position.set(x, 0, z);

        this.scene.add(this.mesh);
    }

    update(delta, player) {
        // Update attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown -= delta;
        }

        if (!player || player.health <= 0) return;

        // Calculate distance to player
        const playerPos = player.mesh.position;
        const monsterPos = this.mesh.position;
        const distance = Math.sqrt(
            Math.pow(playerPos.x - monsterPos.x, 2) +
            Math.pow(playerPos.z - monsterPos.z, 2)
        );

        // If player is in detection range, move toward them
        if (distance < this.detectionRange) {
            if (distance > this.attackRange) {
                // Move toward player
                const direction = new THREE.Vector3(
                    playerPos.x - monsterPos.x,
                    0,
                    playerPos.z - monsterPos.z
                ).normalize();

                this.mesh.position.x += direction.x * this.speed * delta;
                this.mesh.position.z += direction.z * this.speed * delta;

                // Rotate to face player
                const angle = Math.atan2(direction.x, direction.z);
                this.mesh.rotation.y = angle;
            } else {
                // Attack player
                if (this.attackCooldown <= 0) {
                    this.attackPlayer(player);
                }
            }
        }
    }

    attackPlayer(player) {
        player.takeDamage(this.damage);
        this.attackCooldown = this.attackCooldownTime;

        // Visual feedback - scale animation
        const originalScale = this.mesh.scale.clone();
        this.mesh.scale.set(1.2, 1.2, 1.2);
        setTimeout(() => {
            this.mesh.scale.copy(originalScale);
        }, 100);
    }

    takeDamage(amount) {
        this.health -= amount;

        // Visual feedback - flash red
        this.mesh.children.forEach(child => {
            if (child.material) {
                const originalColor = child.material.color.clone();
                child.material.color.set(0xffffff);
                setTimeout(() => {
                    child.material.color.copy(originalColor);
                }, 100);
            }
        });

        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        // Monster is removed in game.js update loop
        // XP is awarded in combat.js
    }

    getPosition() {
        return this.mesh.position;
    }
}
