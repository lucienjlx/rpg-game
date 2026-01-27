class BossMonster extends Monster {
    constructor(scene, x, z, zoneConfig) {
        super(scene, x, z);
        const bossConfig = zoneConfig.bossConfig || {};

        // Override stats with boss configuration
        this.maxHealth = bossConfig.health;
        this.health = bossConfig.health;
        this.damage = bossConfig.damage;
        this.xpReward = bossConfig.xpReward ?? bossConfig.xp ?? 250;
        this.color = bossConfig.color;
        this.ferocity = bossConfig.ferocity || 1.5;
        this.attackCooldown = 0;

        // Apply ferocity to behavior stats
        this.speed = 2 * this.ferocity;
        this.attackCooldownTime = 1.5 / this.ferocity;
        this.detectionRange = 20 * (1 + (this.ferocity - 1) * 0.5);

        // Boss-specific properties
        this.bossName = bossConfig.name || 'Unknown Horror';
        this.areaAttackCooldown = 0;
        this.areaAttackCooldownTime = 5;
        this.areaAttackRange = 5;
        this.areaAttackWindupTime = 0.45;
        this.pendingAreaAttack = false;
        this.pendingAreaAttackElapsed = 0;
        this.pendingAreaAttackRing = null;
        this.elapsedTime = 0;
        this.isBoss = true;

        // Recreate mesh with boss appearance
        this.scene.remove(this.mesh);
        this.createBossMesh(x, z);
    }

    createBossMesh(x, z) {
        // Create a group for the boss
        this.mesh = new THREE.Group();

        // Create boss body (larger, more imposing, and colored based on zone)
        const bodyGeometry = new THREE.BoxGeometry(1.5, 2.5, 1.5);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: this.color,
            metalness: 0.4,
            roughness: 0.6,
            emissive: this.color,
            emissiveIntensity: 0.3
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.25;
        body.castShadow = true;
        this.mesh.add(body);

        // Create head (larger and more menacing)
        const headGeometry = new THREE.SphereGeometry(0.7, 16, 16);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: this.color,
            metalness: 0.3,
            roughness: 0.7,
            emissive: this.color,
            emissiveIntensity: 0.2
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 3;
        head.castShadow = true;
        this.mesh.add(head);

        // Create massive shoulders/pauldrons
        const shoulderGeometry = new THREE.SphereGeometry(0.5, 8, 8);
        const shoulderMaterial = new THREE.MeshStandardMaterial({
            color: 0x2F4F4F,
            metalness: 0.8,
            roughness: 0.3
        });

        const leftShoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
        leftShoulder.position.set(-1, 2.2, 0);
        leftShoulder.scale.set(1, 0.7, 1);
        leftShoulder.castShadow = true;
        this.mesh.add(leftShoulder);

        const rightShoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
        rightShoulder.position.set(1, 2.2, 0);
        rightShoulder.scale.set(1, 0.7, 1);
        rightShoulder.castShadow = true;
        this.mesh.add(rightShoulder);

        // Create golden crown (more elaborate)
        const crownGeometry = new THREE.CylinderGeometry(0.8, 0.7, 0.4, 8);
        const crownMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFD700,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0xFFD700,
            emissiveIntensity: 0.5
        });
        const crown = new THREE.Mesh(crownGeometry, crownMaterial);
        crown.position.y = 3.6;
        crown.castShadow = true;
        this.mesh.add(crown);

        // Create crown spikes (larger and more dramatic)
        const spikeGeometry = new THREE.ConeGeometry(0.15, 0.6, 4);
        const spikeMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFD700,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0xFFD700,
            emissiveIntensity: 0.4
        });

        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);
            spike.position.set(
                Math.cos(angle) * 0.7,
                3.9,
                Math.sin(angle) * 0.7
            );
            spike.castShadow = true;
            this.mesh.add(spike);
        }

        // Create massive horns (much larger than regular monsters)
        const hornGeometry = new THREE.ConeGeometry(0.3, 1.2, 6);
        const hornMaterial = new THREE.MeshStandardMaterial({
            color: 0x1C1C1C,
            metalness: 0.7,
            roughness: 0.3
        });

        const leftHorn = new THREE.Mesh(hornGeometry, hornMaterial);
        leftHorn.position.set(-0.6, 3.8, 0);
        leftHorn.rotation.z = -0.4;
        leftHorn.castShadow = true;
        this.mesh.add(leftHorn);

        const rightHorn = new THREE.Mesh(hornGeometry, hornMaterial);
        rightHorn.position.set(0.6, 3.8, 0);
        rightHorn.rotation.z = 0.4;
        rightHorn.castShadow = true;
        this.mesh.add(rightHorn);

        // Create glowing eyes (much larger and more intense)
        const eyeGeometry = new THREE.SphereGeometry(0.18, 16, 16);
        const eyeColor = this.getEyeColorByFerocity();
        const eyeMaterial = new THREE.MeshStandardMaterial({
            color: eyeColor,
            emissive: eyeColor,
            emissiveIntensity: 1.2 + (this.ferocity - 1) * 0.3
        });

        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.3, 3.1, 0.6);
        this.mesh.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.3, 3.1, 0.6);
        this.mesh.add(rightEye);

        // Create aura effect (glowing ring around boss)
        const auraGeometry = new THREE.RingGeometry(1.5, 2, 32);
        const auraMaterial = new THREE.MeshBasicMaterial({
            color: this.color,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        const aura = new THREE.Mesh(auraGeometry, auraMaterial);
        aura.rotation.x = -Math.PI / 2;
        aura.position.y = 0.1;
        this.mesh.add(aura);
        this.aura = aura;

        // Create particle effect around boss
        const particleCount = 20;
        const particleGeometry = new THREE.SphereGeometry(0.1, 4, 4);
        const particleMaterial = new THREE.MeshBasicMaterial({
            color: this.color,
            transparent: true,
            opacity: 0.6
        });

        this.particles = [];
        for (let i = 0; i < particleCount; i++) {
            const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = 2;
            particle.position.set(
                Math.cos(angle) * radius,
                Math.random() * 3,
                Math.sin(angle) * radius
            );
            particle.userData = {
                angle: angle,
                radius: radius,
                speed: 0.5 + Math.random() * 0.5,
                yOffset: Math.random() * 3
            };
            this.mesh.add(particle);
            this.particles.push(particle);
        }

        // Position boss
        this.mesh.position.set(x, 0, z);

        this.scene.add(this.mesh);
    }

    update(delta, player, wallSystem = null) {
        // Update area attack cooldown
        if (this.areaAttackCooldown > 0) {
            this.areaAttackCooldown -= delta;
        }
        this.elapsedTime += delta;

        // Animate aura (pulsing effect)
        if (this.aura) {
            const time = this.elapsedTime;
            this.aura.material.opacity = 0.2 + Math.sin(time * 2) * 0.1;
            this.aura.rotation.z += delta * 0.5;
        }

        // Animate particles (orbiting around boss)
        if (this.particles) {
            const time = this.elapsedTime;
            this.particles.forEach(particle => {
                particle.userData.angle += delta * particle.userData.speed;
                particle.position.x = Math.cos(particle.userData.angle) * particle.userData.radius;
                particle.position.z = Math.sin(particle.userData.angle) * particle.userData.radius;
                particle.position.y = particle.userData.yOffset + Math.sin(time * 2 + particle.userData.angle) * 0.5;
            });
        }

        // Call parent update for normal behavior
        super.update(delta, player, wallSystem);

        if (!player || player.health <= 0) return;

        if (this.pendingAreaAttack) {
            this.pendingAreaAttackElapsed += delta;
            this.updateAreaAttackTelegraph();

            if (this.pendingAreaAttackElapsed >= this.areaAttackWindupTime) {
                this.resolveAreaAttack(player, wallSystem);
            }
        } else if (this.areaAttackCooldown <= 0 && this.isTargetInAreaRange(player, wallSystem)) {
            this.startAreaAttack();
        }
    }

    isTargetInAreaRange(player, wallSystem = null) {
        if (!player || !player.mesh) return false;

        const playerPos = player.mesh.position;
        const bossPos = this.mesh.position;
        const distance = Math.sqrt(
            Math.pow(playerPos.x - bossPos.x, 2) +
            Math.pow(playerPos.z - bossPos.z, 2)
        );

        if (distance >= this.areaAttackRange) {
            return false;
        }

        if (wallSystem && typeof wallSystem.hasLineOfSight === 'function') {
            return wallSystem.hasLineOfSight(bossPos, playerPos);
        }

        return true;
    }

    startAreaAttack() {
        this.areaAttackCooldown = this.areaAttackCooldownTime;
        this.pendingAreaAttack = true;
        this.pendingAreaAttackElapsed = 0;

        if (!this.pendingAreaAttackRing) {
            const ringGeometry = new THREE.RingGeometry(0.6, 1.2, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0xff3333,
                transparent: true,
                opacity: 0.35,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = -Math.PI / 2;
            ring.position.copy(this.mesh.position);
            ring.position.y = 0.1;
            this.scene.add(ring);
            this.pendingAreaAttackRing = ring;
        }
    }

    updateAreaAttackTelegraph() {
        if (!this.pendingAreaAttackRing) return;

        const progress = Math.min(this.pendingAreaAttackElapsed / this.areaAttackWindupTime, 1);
        const scale = 1 + progress * 3.5;
        this.pendingAreaAttackRing.scale.set(scale, scale, 1);
        this.pendingAreaAttackRing.material.opacity = 0.35 * (1 - progress);
        this.pendingAreaAttackRing.position.copy(this.mesh.position);
        this.pendingAreaAttackRing.position.y = 0.1;
    }

    resolveAreaAttack(player, wallSystem = null) {
        this.pendingAreaAttack = false;
        this.pendingAreaAttackElapsed = 0;

        if (this.pendingAreaAttackRing) {
            this.scene.remove(this.pendingAreaAttackRing);
            this.pendingAreaAttackRing = null;
        }

        if (!this.isTargetInAreaRange(player, wallSystem)) {
            return;
        }

        // Deal damage to player
        player.takeDamage(this.damage * 1.5); // Area attack does 1.5x damage

        this.createAreaAttackImpact();

        // Visual feedback - boss pulses
        const originalY = this.mesh.position.y;
        this.mesh.position.y = originalY + 0.3;
        setTimeout(() => {
            this.mesh.position.y = originalY;
        }, 100);
    }

    createAreaAttackImpact() {
        // Visual feedback - create expanding ring
        const ringGeometry = new THREE.RingGeometry(0.5, 1, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = -Math.PI / 2;
        ring.position.copy(this.mesh.position);
        ring.position.y = 0.1;
        this.scene.add(ring);

        // Animate ring expanding and fading
        const startTime = Date.now();
        const duration = 500;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;

            if (progress < 1) {
                const scale = 1 + progress * 4;
                ring.scale.set(scale, scale, 1);
                ring.material.opacity = 0.8 * (1 - progress);
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(ring);
            }
        };

        animate();
    }

    attackPlayer(player) {
        // Boss attacks are more powerful
        player.takeDamage(this.damage);
        this.attackCooldown = this.attackCooldownTime;

        // Visual feedback - boss lunges forward
        const originalY = this.mesh.position.y;
        this.mesh.position.y = originalY + 0.2;
        setTimeout(() => {
            this.mesh.position.y = originalY;
        }, 100);
    }
}
