// Game state
const game = {
    scene: null,
    camera: null,
    renderer: null,
    player: null,
    monsters: [],
    keys: {},
    clock: new THREE.Clock(),
    monsterSpawnTimer: 0,
    monsterSpawnInterval: 3, // seconds
    zoneSystem: null,
    wallSystem: null,
    fogSystem: null,
    progressionCheckTimer: 0,
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
    directionalLight.shadow.camera.right = 200;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
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

    // Add grid helper for reference
    const gridHelper = new THREE.GridHelper(200, 100, 0x000000, 0x444444);
    gridHelper.position.x = 50; // Center grid on all zones
    game.scene.add(gridHelper);

    // Create player
    game.player = new Player(game.scene);

    // Set up keyboard controls
    document.addEventListener('keydown', (e) => {
        game.keys[e.key.toLowerCase()] = true;

        // Attack on spacebar
        if (e.key === ' ') {
            e.preventDefault();
            performAttack();
        }
    });

    document.addEventListener('keyup', (e) => {
        game.keys[e.key.toLowerCase()] = false;
    });

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation loop
    animate();
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

    const delta = game.clock.getDelta();

    // Update player
    if (game.player) {
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
    if (game.zoneSystem && game.player) {
        game.zoneSystem.checkProgression(game.player, game);
    }

    // Auto-attack nearby monsters
    if (game.player && game.player.canAttack()) {
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
    game.monsters.forEach((monster, index) => {
        if (monster.health <= 0) {
            // Remove dead monster
            game.scene.remove(monster.mesh);
            game.monsters.splice(index, 1);
        } else {
            monster.update(delta, game.player);
        }
    });

    // Spawn monsters
    game.monsterSpawnTimer += delta;
    if (game.monsterSpawnTimer >= game.monsterSpawnInterval) {
        spawnMonster();
        game.monsterSpawnTimer = 0;
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
