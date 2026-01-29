// Game state
const game = {
    scene: null,
    camera: null,
    renderer: null,
    player: null,
    monsters: [],
    lootItems: [],
    smith: null,
    keys: {},
    clock: new THREE.Clock(),
    monsterSpawnTimer: 0,
    monsterSpawnInterval: 3, // seconds
    zoneSystem: null,
    wallSystem: null,
    fogSystem: null,
    progressionCheckTimer: 0,
    speedControl: null,
    lootSystem: null,
    craftingSystem: null,
    introSequence: null,
    showMessage: null,
    spawnBoss: null,
    gameStarted: false,
};

// Initialize the game
function init() {
    // Create scene
    game.scene = new THREE.Scene();
    game.scene.background = new THREE.Color(0x87ceeb); // Sky blue

    // Create camera
    game.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    game.camera.position.set(0, 5, 10);

    // Create renderer
    game.renderer = new THREE.WebGLRenderer({ antialias: true });
    game.renderer.setSize(window.innerWidth, window.innerHeight);
    game.renderer.shadowMap.enabled = true;
    document.getElementById('game-container').appendChild(game.renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    game.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.bias = -0.0001;
    game.scene.add(directionalLight);

    // Initialize zone system
    game.zoneSystem = new ZoneSystem();
    game.zoneSystem.createZoneGrounds(game.scene);

    // Initialize wall system
    game.wallSystem = new WallSystem();
    game.wallSystem.createWalls(game.scene);

    // Initialize fog system
    game.fogSystem = new FogSystem();
    game.fogSystem.createAllFog(game.zoneSystem.zones, game.scene);

    // Create zone decorations
    game.zoneDecorations = new ZoneDecorations(game.scene, game.zoneSystem);
    game.zoneDecorations.createDecorationsForAllZones();

    // Initialize speed control
    game.speedControl = new SpeedControl();

    // Initialize loot system
    game.lootSystem = new LootSystem();

    // Initialize crafting system
    game.craftingSystem = new CraftingSystem();

    game.showMessage = showMessage;
    game.spawnBoss = spawnBoss;

    // Create player
    game.player = new Player(game.scene);

    // Initialize crafting UI
    game.player.craftingUI = new CraftingUI(
        game.craftingSystem,
        game.player.inventory,
        game.player
    );

    // Create Smith NPC near the player in Zone 1 (starting zone)
    game.smith = new Smith(
        game.scene,
        game.player.mesh.position.x + 6,
        game.player.mesh.position.z + 4
    );

    // Set up speed button
    const speedButton = document.getElementById('speed-button');
    speedButton.addEventListener('click', () => {
        game.speedControl.cycleSpeed();
        speedButton.textContent = `⚡ Speed: ${game.speedControl.getSpeedLabel()}`;
    });

    // Add grid helper for reference (centered on 3x3 grid layout)
    const gridHelper = new THREE.GridHelper(150, 75, 0x000000, 0x444444);
    gridHelper.position.x = 0; // Center on x-axis (between -75 and 75)
    gridHelper.position.z = 0; // Center on z-axis (between -75 and 75)
    game.scene.add(gridHelper);

    // Initialize intro sequence
    game.introSequence = new IntroSequence(game.scene, game.camera, game.renderer);

    // Set up keyboard controls
    document.addEventListener('keydown', (e) => {
        game.keys[e.key.toLowerCase()] = true;

        // Attack on spacebar
        if (e.key === ' ') {
            e.preventDefault();
            performAttack();
        }

        // Toggle inventory with 'I' key
        if (e.key.toLowerCase() === 'i') {
            if (game.player && game.player.inventoryUI) {
                game.player.inventoryUI.toggle();
            }
        }

        // Open crafting with 'C' key
        if (e.key.toLowerCase() === 'c') {
            if (game.player && game.player.craftingUI) {
                if (!game.player.craftingUI.isOpen) {
                    e.preventDefault();
                    game.player.craftingUI.open();
                }
            }
        }

        // Open crafting with Enter
        if (e.key === 'Enter') {
            if (game.player && game.player.craftingUI) {
                if (!game.player.craftingUI.isOpen) {
                    e.preventDefault();
                    game.player.craftingUI.open();
                }
            }
        }

        // Interact with Smith with 'E' key
        if (e.key.toLowerCase() === 'e') {
            if (game.player && game.smith && game.player.craftingUI && game.gameStarted) {
                if (game.smith.isPlayerInRange(game.player.mesh.position)) {
                    game.player.craftingUI.toggle();
                } else {
                    showMessage('Find the Smith to craft.', 1500);
                }
            }
        }

        // Use health potion with 'H' key
        if (e.key.toLowerCase() === 'h') {
            if (game.player && game.player.useHealthPotion) {
                game.player.useHealthPotion();
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        game.keys[e.key.toLowerCase()] = false;
    });

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation loop
    animate();

    // Start intro sequence
    game.introSequence.start(() => {
        // Intro complete - start the game
        game.gameStarted = true;
        showMessage('Welcome, Hero! Your journey begins...', 3000);
    });
}

// Handle window resize
function onWindowResize() {
    game.camera.aspect = window.innerWidth / window.innerHeight;
    game.camera.updateProjectionMatrix();
    game.renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    const delta = game.clock.getDelta() * game.speedControl.getCurrentSpeed();

    // Update player
    if (game.player && game.gameStarted) {
        game.player.update(delta, game.keys, game.wallSystem);

        // Update camera to follow player
        const playerPos = game.player.mesh.position;
        game.camera.position.x = playerPos.x;
        game.camera.position.y = playerPos.y + 5;
        game.camera.position.z = playerPos.z + 10;
        game.camera.lookAt(playerPos);

        // Update zone UI
        const currentZone = game.zoneSystem.getCurrentZone(playerPos);
        const zoneElement = document.getElementById('current-zone');
        if (zoneElement) {
            zoneElement.textContent = currentZone.name;
        }
    }

    // Check progression
    if (game.zoneSystem && game.player && game.gameStarted) {
        game.zoneSystem.checkProgression(game.player, game);
    }

    // Update Smith NPC
    if (game.smith && game.gameStarted) {
        game.smith.update(game.camera);

        // Show interaction prompt when near Smith
        if (game.player && game.smith.isPlayerInRange(game.player.mesh.position)) {
            // Could add a visual indicator here
        }
    }

    // Auto-attack nearby monsters
    if (game.player && game.player.canAttack() && game.gameStarted) {
        const playerPos = game.player.mesh.position;
        const attackRange = game.player.attackRange;

        // Find closest monster in range
        let closestMonster = null;
        let closestDistance = attackRange;

        game.monsters.forEach(monster => {
            const monsterPos = monster.getPosition();
            const distance = Math.sqrt(
                Math.pow(playerPos.x - monsterPos.x, 2) +
                Math.pow(playerPos.z - monsterPos.z, 2)
            );

            if (distance <= attackRange && distance < closestDistance) {
                closestMonster = monster;
                closestDistance = distance;
            }
        });

        // Auto-attack if monster found
        if (closestMonster) {
            performAttack();
        }
    }

    // Update monsters
    for (let i = game.monsters.length - 1; i >= 0; i--) {
        const monster = game.monsters[i];
        if (monster.health <= 0) {
            // Remove dead monster
            game.scene.remove(monster.mesh);
            game.monsters.splice(i, 1);
        } else {
            monster.update(delta, game.player, game.wallSystem);
        }
    }

    // Update loot items
    for (let i = game.lootItems.length - 1; i >= 0; i--) {
        const loot = game.lootItems[i];
        if (loot.pickedUp) {
            game.lootItems.splice(i, 1);
            continue;
        }

        loot.update(delta);

        // Check for pickup
        if (game.player && loot.checkPickup(game.player.mesh.position)) {
            // Add to inventory
            game.player.inventory.addItem(loot.itemId, loot.lootData);
            showMessage(`Picked up ${loot.lootData.name}`, 1500);
        }
    }

    // Spawn monsters
    if (game.gameStarted) {
        game.monsterSpawnTimer += delta;
        if (game.monsterSpawnTimer >= game.monsterSpawnInterval) {
            spawnMonster();
            game.monsterSpawnTimer = 0;
        }
    }

    // Render scene
    game.renderer.render(game.scene, game.camera);
}

// Spawn a monster at a random position
function spawnMonster() {
    if (!game.player || !game.zoneSystem) return;

    // Get current player zone
    const playerZone = game.zoneSystem.getCurrentZone(game.player.mesh.position);

    // Get a zone to spawn in (current or adjacent unlocked zones)
    const spawnZone = game.zoneSystem.getZoneForSpawning(playerZone);

    // Get random position within the spawn zone
    const pos = game.zoneSystem.getRandomPositionInZone(spawnZone);

    // Create monster with zone-specific configuration
    const monster = new Monster(game.scene, pos.x, pos.z, spawnZone.monsterConfig);
    game.monsters.push(monster);
}

// Spawn a boss monster in a zone
function spawnBoss(zone) {
    // Get center position of the zone
    const centerX = (zone.bounds.minX + zone.bounds.maxX) / 2;
    const centerZ = (zone.bounds.minZ + zone.bounds.maxZ) / 2;

    // Create boss monster
    const boss = new BossMonster(game.scene, centerX, centerZ, zone);
    game.monsters.push(boss);

    showMessage(`A powerful boss has appeared in ${zone.name}!`, 3000);
}

// Show message to player
function showMessage(text, duration = 2000) {
    const messagePanel = document.getElementById('message-panel');
    messagePanel.textContent = text;
    messagePanel.classList.add('show');

    setTimeout(() => {
        messagePanel.classList.remove('show');
    }, duration);
}

// Start the game when page loads
window.addEventListener('load', init);
