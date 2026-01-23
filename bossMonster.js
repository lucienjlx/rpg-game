class BossMonster extends Monster {
    constructor(scene, x, z, zoneConfig) {
        super(scene, x, z);

        // Override stats with boss configuration
        this.maxHealth = zoneConfig.bossConfig.health;
        this.health = zoneConfig.bossConfig.health;
        this.damage = zoneConfig.bossConfig.damage;
        this.xpReward = 125; // 5x base XP reward
        this.color = zoneConfig.bossConfig.color;
        this.scale = zoneConfig.bossConfig.scale;

        // Boss-specific properties
        this.areaAttackCooldown = 0;
        this.areaAttackCooldownTime = 5;
        this.areaAttackRange = 5;
        this.isBoss = true;

        // Recreate mesh with boss appearance
        this.scene.remove(this.mesh);
        this.createBossMesh(x, z);
    }

    createBossMesh(x, z) {
        // Create a group for the boss
        this.mesh = new THREE.Group();

        // Create boss body (larger and colored based on zone)
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

        // Create golden crown
        const crownGeometry = new THREE.CylinderGeometry(0.6, 0.5, 0.3, 8);
        const crownMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0xffd700,
            emissiveIntensity: 0.3
        });
        const crown = new THREE.Mesh(crownGeometry, crownMaterial);
        crown.position.y = 2.4;
        crown.castShadow = true;
        this.mesh.add(crown);

        // Create crown spikes
        const spikeGeometry = new THREE.ConeGeometry(0.1, 0.4, 4);
        const spikeMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            metalness: 0.8,
            roughness: 0.2
        });

        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);
            spike.position.set(
                Math.cos(angle) * 0.5,
                2.6,
                Math.sin(angle) * 0.5
            );
            this.mesh.add(spike);
        }

        // Create horns (larger than regular monsters)
        const hornGeometry = new THREE.ConeGeometry(0.2, 0.7, 4);
        const hornMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

        const leftHorn = new THREE.Mesh(hornGeometry, hornMaterial);
        leftHorn.position.set(-0.4, 2.5, 0);
        leftHorn.rotation.z = -0.3;
        this.mesh.add(leftHorn);

        const rightHorn = new THREE.Mesh(hornGeometry, hornMaterial);
        rightHorn.position.set(0.4, 2.5, 0);
        rightHorn.rotation.z = 0.3;
        this.mesh.add(rightHorn);

        // Create eyes (glowing)
        const eyeGeometry = new THREE.SphereGeometry(0.12, 8, 8);
        const eyeMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 0.8
        });

        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.2, 1.9, 0.4);
        this.mesh.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.2, 1.9, 0.4);
        this.mesh.add(rightEye);

        // Scale the entire boss
        this.mesh.scale.set(this.scale, this.scale, this.scale);

        // Position boss
        this.mesh.position.set(x, 0, z);

        this.scene.add(this.mesh);
    }

    update(delta, player) {
        // Update area attack cooldown
        if (this.areaAttackCooldown > 0) {
            this.areaAttackCooldown -= delta;
        }

        // Call parent update for normal behavior
        super.update(delta, player);

        if (!player || player.health <= 0) return;

        // Check for area attack
        const playerPos = player.mesh.position;
        const bossPos = this.mesh.position;
        const distance = Math.sqrt(
            Math.pow(playerPos.x - bossPos.x, 2) +
            Math.pow(playerPos.z - bossPos.z, 2)
        );

        // Perform area attack if player is in range and cooldown is ready
        if (distance < this.areaAttackRange && this.areaAttackCooldown <= 0) {
            this.performAreaAttack(player);
        }
    }

    performAreaAttack(player) {
        // Deal damage to player
        player.takeDamage(this.damage * 1.5); // Area attack does 1.5x damage
        this.areaAttackCooldown = this.areaAttackCooldownTime;

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

        // Scale animation for boss
        const originalScale = this.mesh.scale.clone();
        this.mesh.scale.multiplyScalar(1.1);
        setTimeout(() => {
            this.mesh.scale.copy(originalScale);
        }, 100);
    }

    attackPlayer(player) {
        // Boss attacks are more powerful
        player.takeDamage(this.damage);
        this.attackCooldown = this.attackCooldownTime;

        // Visual feedback - scale animation
        const originalScale = this.mesh.scale.clone();
        this.mesh.scale.multiplyScalar(1.15);
        setTimeout(() => {
            this.mesh.scale.copy(originalScale);
        }, 100);
    }
}
