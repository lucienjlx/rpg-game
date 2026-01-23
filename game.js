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
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    game.scene.add(directionalLight);

    // Create ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x228b22,
        roughness: 0.8
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    game.scene.add(ground);

    // Add grid helper for reference
    const gridHelper = new THREE.GridHelper(100, 50, 0x000000, 0x444444);
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
        game.player.update(delta, game.keys);

        // Update camera to follow player
        const playerPos = game.player.mesh.position;
        game.camera.position.x = playerPos.x;
        game.camera.position.y = playerPos.y + 5;
        game.camera.position.z = playerPos.z + 10;
        game.camera.lookAt(playerPos);
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
    const angle = Math.random() * Math.PI * 2;
    const distance = 15 + Math.random() * 10;
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;

    const monster = new Monster(game.scene, x, z);
    game.monsters.push(monster);
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
