// Combat system

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
        game.player.mesh.scale.copy(originalScale);
    }, 150);

    // Check for monsters in attack range
    const playerPos = game.player.mesh.position;
    const attackRange = game.player.attackRange;
    let hitCount = 0;

    game.monsters.forEach(monster => {
        const monsterPos = monster.getPosition();
        const distance = Math.sqrt(
            Math.pow(playerPos.x - monsterPos.x, 2) +
            Math.pow(playerPos.z - monsterPos.z, 2)
        );

        if (distance <= attackRange) {
            // Hit the monster
            monster.takeDamage(game.player.damage);
            hitCount++;

            // Award XP if monster died
            if (monster.health <= 0) {
                game.player.gainXP(monster.xpReward);
                createDeathParticles(monsterPos);
            }
        }
    });

    // Visual feedback for attack
    if (hitCount > 0) {
        createAttackEffect(playerPos);
    }
}

// Create visual effect for attack
function createAttackEffect(position) {
    const geometry = new THREE.RingGeometry(1, 2, 16);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
    });
    const ring = new THREE.Mesh(geometry, material);
    ring.position.copy(position);
    ring.position.y = 0.1;
    ring.rotation.x = -Math.PI / 2;
    game.scene.add(ring);

    // Animate and remove
    let scale = 1;
    const interval = setInterval(() => {
        scale += 0.1;
        ring.scale.set(scale, scale, 1);
        ring.material.opacity -= 0.1;

        if (ring.material.opacity <= 0) {
            game.scene.remove(ring);
            clearInterval(interval);
        }
    }, 30);
}

// Create particle effect when monster dies
function createDeathParticles(position) {
    const particleCount = 10;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        const geometry = new THREE.SphereGeometry(0.1, 4, 4);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
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
    let time = 0;
    const interval = setInterval(() => {
        time += 0.05;

        particles.forEach(particle => {
            particle.position.x += particle.velocity.x * 0.05;
            particle.position.y += particle.velocity.y * 0.05;
            particle.position.z += particle.velocity.z * 0.05;

            // Gravity
            particle.velocity.y -= 9.8 * 0.05;

            // Fade out
            particle.material.opacity = 1 - time;
        });

        if (time >= 1) {
            particles.forEach(particle => {
                game.scene.remove(particle);
            });
            clearInterval(interval);
        }
    }, 50);
}

// Calculate damage with variance
function calculateDamage(baseDamage) {
    const variance = 0.2; // 20% variance
    const min = baseDamage * (1 - variance);
    const max = baseDamage * (1 + variance);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
