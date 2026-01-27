// Combat system
const ATTACK_HIT_DELAY_MS = 100;

function performAttack() {
    if (!game.player || !game.player.canAttack()) {
        return;
    }

    game.player.startAttackCooldown();

    // Sword swing animation
    if (game.player.swingSword) {
        game.player.swingSword();
    }

    // Visual attack animation (body scale)
    const originalScale = game.player.mesh.scale.clone();
    game.player.mesh.scale.set(1.2, 1.2, 1.2);
    setTimeout(() => {
        if (!game.player || !game.player.mesh) return;
        game.player.mesh.scale.copy(originalScale);
    }, 150);

    setTimeout(() => {
        if (!game.player || !game.player.mesh) {
            return;
        }

        // Check for monsters in attack range
        const playerPos = game.player.mesh.position;
        const attackRange = game.player.attackRange;
        const attackRangeSq = attackRange * attackRange;
        let hitCount = 0;

        game.monsters.forEach(monster => {
            if (!monster || monster.isDead || monster.health <= 0) {
                return;
            }

            const monsterPos = monster.getPosition();
            const dx = playerPos.x - monsterPos.x;
            const dz = playerPos.z - monsterPos.z;
            const distanceSq = dx * dx + dz * dz;

            if (distanceSq <= attackRangeSq) {
                // Hit the monster
                const damage = calculateDamage(game.player.damage);
                monster.takeDamage(damage);
                hitCount++;

                // Award XP if monster died
                if (monster.isDead || monster.health <= 0) {
                    if (!monster.isDead) {
                        monster.isDead = true;
                    }
                    game.player.gainXP(monster.xpReward);
                    createDeathParticles(monsterPos);

                    // Drop loot
                    dropLoot(monster, monsterPos);
                }
            }
        });

        // Visual feedback for attack
        if (hitCount > 0) {
            createAttackEffect(playerPos);
        } else {
            createMissEffect(playerPos);
        }
    }, ATTACK_HIT_DELAY_MS);
}

function disposeMesh(mesh) {
    if (!mesh) return;
    if (mesh.geometry) {
        mesh.geometry.dispose();
    }
    if (mesh.material) {
        if (Array.isArray(mesh.material)) {
            mesh.material.forEach(material => material.dispose());
        } else {
            mesh.material.dispose();
        }
    }
}

function createRingEffect(position, options) {
    const {
        color,
        opacity = 0.8,
        startScale = 1,
        endScale = 2,
        duration = 300
    } = options;

    const geometry = new THREE.RingGeometry(1, 2, 16);
    const material = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity
    });
    const ring = new THREE.Mesh(geometry, material);
    ring.position.copy(position);
    ring.position.y = 0.1;
    ring.rotation.x = -Math.PI / 2;
    game.scene.add(ring);

    const startTime = performance.now();
    const animate = (time) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const scale = startScale + (endScale - startScale) * progress;
        ring.scale.set(scale, scale, 1);
        ring.material.opacity = opacity * (1 - progress);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            game.scene.remove(ring);
            disposeMesh(ring);
        }
    };

    requestAnimationFrame(animate);
}

// Create visual effect for attack
function createAttackEffect(position) {
    createRingEffect(position, {
        color: 0xffff00,
        opacity: 0.8,
        endScale: 2.2,
        duration: 300
    });
}

function createMissEffect(position) {
    createRingEffect(position, {
        color: 0x666666,
        opacity: 0.4,
        endScale: 1.6,
        duration: 200
    });
}

// Create particle effect when monster dies
function createDeathParticles(position) {
    const particleCount = 10;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        const geometry = new THREE.SphereGeometry(0.1, 4, 4);
        const material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 1
        });
        const particle = new THREE.Mesh(geometry, material);

        particle.position.copy(position);
        particle.position.y += 1;

        // Random velocity
        particle.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 5,
            Math.random() * 5,
            (Math.random() - 0.5) * 5
        );

        game.scene.add(particle);
        particles.push(particle);
    }

    // Animate particles
    const duration = 1;
    const gravity = -9.8;
    let elapsed = 0;
    let lastTime = performance.now();

    const animate = (time) => {
        const delta = (time - lastTime) / 1000;
        lastTime = time;
        elapsed += delta;
        const progress = Math.min(elapsed / duration, 1);

        particles.forEach(particle => {
            particle.position.x += particle.velocity.x * delta;
            particle.position.y += particle.velocity.y * delta;
            particle.position.z += particle.velocity.z * delta;

            // Gravity
            particle.velocity.y += gravity * delta;

            // Fade out
            particle.material.opacity = 1 - progress;
        });

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            particles.forEach(particle => {
                game.scene.remove(particle);
                disposeMesh(particle);
            });
        }
    };

    requestAnimationFrame(animate);
}

// Calculate damage with variance
function calculateDamage(baseDamage) {
    const variance = 0.2; // 20% variance
    const min = baseDamage * (1 - variance);
    const max = baseDamage * (1 + variance);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Drop loot when monster dies
function dropLoot(monster, position) {
    if (!game.lootSystem || !game.zoneSystem) return;

    // Determine which zone the monster was in
    const currentZone = game.zoneSystem.getCurrentZone(position);
    const isBoss = monster.constructor.name === 'BossMonster';

    // Generate loot drops
    const drops = game.lootSystem.generateLoot(currentZone.id, isBoss);

    // Create loot items in the world
    drops.forEach(itemId => {
        const lootData = game.lootSystem.getLootData(itemId);
        if (lootData) {
            const loot = new LootItem(
                game.scene,
                position.x + (Math.random() - 0.5) * 2,
                position.z + (Math.random() - 0.5) * 2,
                itemId,
                lootData
            );
            game.lootItems.push(loot);
        }
    });
}
