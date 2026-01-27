class Player {
    constructor(scene) {
        this.scene = scene;
        this.speed = 5;
        this.rotationSpeed = 3;

        // Stats
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 100;
        this.baseMaxHealth = 100;
        this.baseDamage = 20;
        this.healthBonus = 0;
        this.damageBonus = 0;
        this.maxHealth = this.baseMaxHealth;
        this.health = this.maxHealth;
        this.damage = this.baseDamage;
        this.attackRange = 3;
        this.attackCooldown = 0;
        this.attackCooldownTime = 0.5;
        this.equipmentSlots = {
            weapon: null,
            armor: null
        };

        // Inventory
        this.inventory = new Inventory();
        this.inventory.onEquipmentRemoved = (item) => this.handleEquipmentRemoved(item);
        this.inventoryUI = new InventoryUI(this.inventory, this);

        const starterWeapon = {
            id: 'simple_sword',
            name: 'Simple Sword',
            type: 'equipment',
            slot: 'weapon',
            stats: { damage: 8 },
            rarity: 'common',
            equipped: false
        };
        this.inventory.addEquipment(starterWeapon);
        this.equipItem(starterWeapon);

        // Create player mesh
        this.createMesh();

        // Update UI
        this.updateUI();
    }

    createMesh() {
        // Create a group to hold all player parts
        this.mesh = new THREE.Group();

        // Create more realistic body (torso)
        const torsoGeometry = new THREE.CylinderGeometry(0.4, 0.5, 1.2, 8);
        const torsoMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFD700, // Heroic yellow
            metalness: 0.4,
            roughness: 0.5
        });
        const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
        torso.position.y = 1.2;
        torso.castShadow = true;
        this.mesh.add(torso);

        // Create head (more detailed)
        const headGeometry = new THREE.SphereGeometry(0.35, 16, 16);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF, // White head
            roughness: 0.7
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2.1;
        head.castShadow = true;
        this.mesh.add(head);

        // Create helmet
        const helmetGeometry = new THREE.SphereGeometry(0.38, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const helmetMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            metalness: 0.6,
            roughness: 0.3
        });
        const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
        helmet.position.y = 2.1;
        helmet.castShadow = true;
        this.mesh.add(helmet);

        // Create legs
        const legGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 8);
        const legMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFD700, // Match hero color
            roughness: 0.8
        });

        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.2, 0.4, 0);
        leftLeg.castShadow = true;
        this.mesh.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.2, 0.4, 0);
        rightLeg.castShadow = true;
        this.mesh.add(rightLeg);

        // Create arms
        const armGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.8, 8);
        const armMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFD700, // Match torso
            metalness: 0.4,
            roughness: 0.5
        });

        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.7, 1.0, 0);
        leftArm.rotation.z = 0;
        leftArm.castShadow = true;
        this.mesh.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.7, 1.0, 0);
        rightArm.rotation.z = 0;
        rightArm.castShadow = true;
        this.mesh.add(rightArm);

        // Create red cape (more detailed)
        const capeGeometry = new THREE.PlaneGeometry(1.2, 1.5);
        const capeMaterial = new THREE.MeshStandardMaterial({
            color: 0xDC143C, // Crimson red
            side: THREE.DoubleSide,
            roughness: 0.9
        });
        const cape = new THREE.Mesh(capeGeometry, capeMaterial);
        cape.position.set(0, 1.2, -0.6);
        cape.castShadow = true;
        this.mesh.add(cape);

        // Create sword weapon (more detailed)
        const swordGroup = new THREE.Group();

        // Sword blade (longer and more detailed)
        const bladeGeometry = new THREE.BoxGeometry(0.12, 1.8, 0.04);
        const bladeMaterial = new THREE.MeshStandardMaterial({
            color: 0xE8E8E8, // Bright silver
            metalness: 0.95,
            roughness: 0.05,
            emissive: 0xCCCCCC,
            emissiveIntensity: 0.1
        });
        const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
        blade.position.y = 0.9;
        blade.castShadow = true;
        swordGroup.add(blade);

        // Sword edge glow
        const edgeGeometry = new THREE.BoxGeometry(0.02, 1.8, 0.04);
        const edgeMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            emissive: 0x00BFFF,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.7
        });
        const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
        edge.position.set(0.05, 0.9, 0);
        swordGroup.add(edge);

        // Sword handle (leather wrapped)
        const handleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8);
        const handleMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513, // Saddle brown
            roughness: 0.9
        });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.castShadow = true;
        swordGroup.add(handle);

        // Sword guard (cross-guard)
        const guardGeometry = new THREE.BoxGeometry(0.5, 0.08, 0.12);
        const guardMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFD700, // Gold
            metalness: 0.9,
            roughness: 0.2
        });
        const guard = new THREE.Mesh(guardGeometry, guardMaterial);
        guard.position.y = 0.25;
        guard.castShadow = true;
        swordGroup.add(guard);

        // Sword pommel
        const pommelGeometry = new THREE.SphereGeometry(0.12, 8, 8);
        const pommelMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFD700,
            metalness: 0.9,
            roughness: 0.2
        });
        const pommel = new THREE.Mesh(pommelGeometry, pommelMaterial);
        pommel.position.y = -0.25;
        pommel.castShadow = true;
        swordGroup.add(pommel);

        // Position sword at player's side
        swordGroup.position.set(0.7, 1, 0);
        swordGroup.rotation.z = -Math.PI / 4;
        this.mesh.add(swordGroup);
        this.sword = swordGroup;

        // Position player at starting position in Zone 1
        this.mesh.position.set(-50, 0, -50);

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

        // Keep player within bounds (3x3 grid layout)
        this.mesh.position.x = Math.max(-75, Math.min(75, this.mesh.position.x));
        this.mesh.position.z = Math.max(-75, Math.min(75, this.mesh.position.z));

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

    recalculateStats() {
        this.baseMaxHealth = 100 + (this.level - 1) * 20;
        this.baseDamage = 20 + (this.level - 1) * 5;

        let bonusHealth = 0;
        let bonusDamage = 0;
        Object.values(this.equipmentSlots).forEach(item => {
            if (!item || !item.stats) return;
            bonusHealth += item.stats.health || 0;
            bonusDamage += item.stats.damage || 0;
        });

        this.healthBonus = bonusHealth;
        this.damageBonus = bonusDamage;

        this.maxHealth = this.baseMaxHealth + this.healthBonus;
        this.damage = this.baseDamage + this.damageBonus;

        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }
    }

    equipItem(item) {
        if (!item || !item.slot) return false;

        const slot = item.slot;
        const current = this.equipmentSlots[slot];
        if (current && current !== item) {
            current.equipped = false;
        }

        this.equipmentSlots[slot] = item;
        item.equipped = true;
        this.recalculateStats();
        this.updateUI();

        return true;
    }

    handleEquipmentRemoved(item) {
        if (!item || !item.slot) return;
        const slotItem = this.equipmentSlots[item.slot];
        if (slotItem && slotItem.id === item.id) {
            this.equipmentSlots[item.slot] = null;
            slotItem.equipped = false;
            this.recalculateStats();
            this.updateUI();
        }
    }

    useHealthPotion() {
        const potion = this.inventory.getBestHealingConsumable();
        if (!potion) {
            showMessage('No health potions available.', 1500);
            return;
        }

        this.heal(potion.healing);
        this.inventory.removeItem(potion.id, 1);
        showMessage(`Used ${potion.name} (+${potion.healing} HP)`, 1500);

        if (this.inventoryUI && this.inventoryUI.isOpen) {
            this.inventoryUI.render();
        }
    }

    formatStatValue(value) {
        if (value >= 1000) {
            const formatted = (value / 1000).toFixed(1);
            return formatted.endsWith('.0') ? `${formatted.slice(0, -2)}K` : `${formatted}K`;
        }
        return `${Math.floor(value)}`;
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
        this.recalculateStats();
        this.health = this.maxHealth;

        showMessage(`LEVEL UP! Now Level ${this.level}`, 3000);
        this.updateUI();
    }

    die() {
        showMessage('YOU DIED! Respawning...', 3000);

        // Respawn after delay
        setTimeout(() => {
            this.health = this.maxHealth;
            this.mesh.position.set(-50, 0, -50);
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

        const attackElement = document.getElementById('player-attack');
        if (attackElement) {
            attackElement.textContent = this.formatStatValue(this.damage);
        }

        const weaponElement = document.getElementById('player-weapon');
        if (weaponElement) {
            const weapon = this.equipmentSlots.weapon;
            if (weapon) {
                const bonus = weapon.stats && weapon.stats.damage ? weapon.stats.damage : 0;
                weaponElement.textContent = `${weapon.name} (+${this.formatStatValue(bonus)})`;
            } else {
                weaponElement.textContent = 'None';
            }
        }
    }

    canAttack() {
        return this.attackCooldown <= 0;
    }

    startAttackCooldown() {
        this.attackCooldown = this.attackCooldownTime;
    }

    swingSword() {
        if (!this.sword || this.isSwinging) return;

        this.isSwinging = true;

        // Store the original rotation as fixed values
        const originalRotationZ = -Math.PI / 4; // The initial rotation from createMesh
        const swingDuration = 200; // milliseconds
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / swingDuration, 1);

            // Swing from side to front
            if (progress < 0.5) {
                // Forward swing
                const swingProgress = progress * 2;
                this.sword.rotation.z = originalRotationZ + (Math.PI / 2) * swingProgress;
            } else {
                // Return to original position
                const returnProgress = (progress - 0.5) * 2;
                this.sword.rotation.z = originalRotationZ + (Math.PI / 2) * (1 - returnProgress);
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Ensure sword returns to exact original position
                this.sword.rotation.z = originalRotationZ;
                this.isSwinging = false;
            }
        };

        animate();
    }
}
