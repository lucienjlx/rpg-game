class Monster {
    constructor(scene, x, z, zoneConfig = null) {
        this.scene = scene;
        this.speed = 2;
        this.detectionRange = 20;
        this.attackRange = 2;
        this.attackCooldown = 0;
        this.attackCooldownTime = 1.5;
        this.zoneId = zoneConfig ? zoneConfig.zoneId : 1;

        // Apply zone configuration if provided
        if (zoneConfig) {
            this.maxHealth = zoneConfig.health;
            this.health = zoneConfig.health;
            this.damage = zoneConfig.damage;
            this.color = zoneConfig.color;
            this.ferocity = zoneConfig.ferocity || 1.0;
        } else {
            // Default stats
            this.maxHealth = 50;
            this.health = 50;
            this.damage = 10;
            this.color = 0x8b0000;
            this.ferocity = 1.0;
        }

        // Apply ferocity to behavior stats
        this.speed = 2 * this.ferocity;
        this.attackCooldownTime = 1.5 / this.ferocity;
        this.detectionRange = 20 * (1 + (this.ferocity - 1) * 0.5);

        this.xpReward = 50; // Doubled from 25 for faster progression

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

        // Apply ferocity-based eye color
        const eyeColor = this.getEyeColorByFerocity();
        leftEye.material.color.set(eyeColor);
        leftEye.material.emissive.set(eyeColor);
        leftEye.material.emissiveIntensity = 0.5 + (this.ferocity - 1) * 0.3;
        rightEye.material.color.set(eyeColor);
        rightEye.material.emissive.set(eyeColor);
        rightEye.material.emissiveIntensity = 0.5 + (this.ferocity - 1) * 0.3;

        // Beastly jaw and teeth
        const jawGeo = new THREE.BoxGeometry(0.7, 0.2, 0.6);
        const jawMat = new THREE.MeshStandardMaterial({
            color: this.color,
            roughness: 0.9
        });
        const jaw = new THREE.Mesh(jawGeo, jawMat);
        jaw.position.set(0, 1.45, 0.5);
        jaw.castShadow = true;
        this.mesh.add(jaw);

        const toothGeo = new THREE.ConeGeometry(0.05, 0.2, 4);
        const toothMat = new THREE.MeshStandardMaterial({
            color: 0xEEEEEE,
            roughness: 0.3
        });
        for (let i = 0; i < 4; i++) {
            const tooth = new THREE.Mesh(toothGeo, toothMat);
            tooth.position.set(-0.18 + i * 0.12, 1.3, 0.7);
            tooth.rotation.x = Math.PI;
            this.mesh.add(tooth);
        }

        // Back spikes
        const spikeGeo = new THREE.ConeGeometry(0.08, 0.3, 4);
        const spikeMat = new THREE.MeshStandardMaterial({
            color: 0x1C1C1C,
            roughness: 0.8
        });
        for (let i = 0; i < 4; i++) {
            const spike = new THREE.Mesh(spikeGeo, spikeMat);
            spike.position.set(0, 1.1 + i * 0.25, -0.4);
            spike.rotation.x = Math.PI / 10;
            this.mesh.add(spike);
        }

        // DO NOT SCALE - all monsters same size
        // Ferocity affects behavior, not size

        // Add weapon
        this.weapon = null;
        this.createWeapon();

        // Apply random variant for visual variety
        if (MonsterVariants) {
            const variant = MonsterVariants.getRandomVariant(this.zoneId);
            MonsterVariants.applyVariantToMonster(this, variant);
        }

        // Position monster
        this.mesh.position.set(x, 0, z);

        // Create health bar
        this.createHealthBar();

        this.scene.add(this.mesh);
    }

    createHealthBar() {
        // Create a separate group for health bar that can rotate independently
        this.healthBarGroup = new THREE.Group();
        this.healthBarGroup.position.y = 3;

        // Health bar background
        const bgGeometry = new THREE.PlaneGeometry(1.5, 0.2);
        const bgMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.DoubleSide
        });
        this.healthBarBg = new THREE.Mesh(bgGeometry, bgMaterial);
        this.healthBarGroup.add(this.healthBarBg);

        // Health bar foreground
        const fgGeometry = new THREE.PlaneGeometry(1.5, 0.15);
        const fgMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            side: THREE.DoubleSide
        });
        this.healthBarFg = new THREE.Mesh(fgGeometry, fgMaterial);
        this.healthBarFg.position.z = 0.01; // Slightly in front
        this.healthBarGroup.add(this.healthBarFg);

        // Create health text using canvas texture
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const context = canvas.getContext('2d');

        this.healthCanvas = canvas;
        this.healthContext = context;

        const texture = new THREE.CanvasTexture(canvas);
        const textMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        });

        const textGeometry = new THREE.PlaneGeometry(1.5, 0.4);
        this.healthText = new THREE.Mesh(textGeometry, textMaterial);
        this.healthText.position.z = 0.02;
        this.healthText.position.y = 0.3;
        this.healthBarGroup.add(this.healthText);

        this.updateHealthBar();

        this.mesh.add(this.healthBarGroup);
    }

    updateHealthBar() {
        if (!this.healthBarFg) return;

        const healthPercent = this.health / this.maxHealth;
        this.healthBarFg.scale.x = healthPercent;
        this.healthBarFg.position.x = -0.75 * (1 - healthPercent);

        // Change color based on health
        if (healthPercent > 0.5) {
            this.healthBarFg.material.color.set(0x00ff00); // Green
        } else if (healthPercent > 0.25) {
            this.healthBarFg.material.color.set(0xffff00); // Yellow
        } else {
            this.healthBarFg.material.color.set(0xff0000); // Red
        }

        // Update health text
        if (this.healthContext && this.healthText) {
            const ctx = this.healthContext;
            ctx.clearRect(0, 0, this.healthCanvas.width, this.healthCanvas.height);

            ctx.font = 'bold 32px Arial';
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 4;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const text = `${Math.ceil(this.health)}/${this.maxHealth}`;
            ctx.strokeText(text, 128, 32);
            ctx.fillText(text, 128, 32);

            this.healthText.material.map.needsUpdate = true;
        }
    }

    update(delta, player, wallSystem = null) {
        // Update attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown -= delta;
        }

        // Make health bar face camera (more stable approach)
        if (this.healthBarGroup && game.camera) {
            const cameraDirection = new THREE.Vector3();
            game.camera.getWorldDirection(cameraDirection);

            // Calculate angle to face camera
            const angle = Math.atan2(cameraDirection.x, cameraDirection.z);
            this.healthBarGroup.rotation.y = angle + Math.PI;
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

                const oldPosition = this.mesh.position.clone();

                this.mesh.position.x += direction.x * this.speed * delta;
                if (wallSystem && wallSystem.checkCollision(this.mesh.position)) {
                    this.mesh.position.x = oldPosition.x;
                }

                this.mesh.position.z += direction.z * this.speed * delta;
                if (wallSystem && wallSystem.checkCollision(this.mesh.position)) {
                    this.mesh.position.z = oldPosition.z;
                }

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

        // Swing weapon animation
        this.swingWeapon();

        // Visual feedback - scale animation
        const originalScale = this.mesh.scale.clone();
        this.mesh.scale.set(1.2, 1.2, 1.2);
        setTimeout(() => {
            this.mesh.scale.copy(originalScale);
        }, 100);
    }

    takeDamage(amount) {
        this.health -= amount;

        // Update health bar
        this.updateHealthBar();

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

    getEyeColorByFerocity() {
        // Eye color changes based on ferocity level
        if (this.ferocity >= 4.0) {
            return 0x9400D3; // Purple for extreme ferocity
        } else if (this.ferocity >= 3.0) {
            return 0x8B008B; // Dark magenta for very high ferocity
        } else if (this.ferocity >= 2.0) {
            return 0xFF0000; // Red for high ferocity
        } else if (this.ferocity >= 1.5) {
            return 0xFF8C00; // Orange for medium ferocity
        } else {
            return 0xFFFF00; // Yellow for normal ferocity
        }
    }

    createWeapon() {
        if (!MonsterWeapons) return;

        const weaponConfig = MonsterWeapons.getWeaponForZone(this.zoneId);
        if (!weaponConfig) return;

        this.weapon = MonsterWeapons.createWeapon(weaponConfig.type, weaponConfig.color);
        if (this.weapon) {
            // Position weapon at monster's side
            this.weapon.position.set(0.6, 1.0, 0);
            this.weapon.rotation.z = -Math.PI / 4;
            this.mesh.add(this.weapon);
            this.weaponDamage = weaponConfig.damage;
        }
    }

    swingWeapon() {
        if (!this.weapon) return;

        const originalRotation = this.weapon.rotation.clone();
        const swingDuration = 200;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / swingDuration, 1);

            if (progress < 0.5) {
                // Swing forward
                const swingProgress = progress * 2;
                this.weapon.rotation.z = originalRotation.z + (Math.PI / 2) * swingProgress;
            } else {
                // Swing back
                const returnProgress = (progress - 0.5) * 2;
                this.weapon.rotation.z = originalRotation.z + (Math.PI / 2) * (1 - returnProgress);
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.weapon.rotation.copy(originalRotation);
            }
        };

        animate();
    }
}
