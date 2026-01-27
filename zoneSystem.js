class ZoneSystem {
    constructor() {
        // 9-zone layout in 3x3 grid with varied shapes:
        // [7]-[8]-[9]
        //  |   |   |
        // [4]-[5]-[6]
        //  |   |   |
        // [1]-[2]-[3]
        this.zones = [
            {
                id: 1,
                name: "Green Plains",
                shape: "square", // Square starting area
                bounds: { minX: -75, maxX: -25, minZ: -75, maxZ: -25 },
                centerX: -50,
                centerZ: -50,
                radius: 25,
                groundColor: 0x228b22,
                monsterConfig: {
                    color: 0x8b0000,
                    ferocity: 1.0,
                    health: 50,
                    damage: 5,
                    zoneId: 1
                },
                bossConfig: {
                    color: 0x8b0000,
                    ferocity: 1.5,
                    health: 250,
                    damage: 15
                },
                unlocked: true,
                unlockThreshold: 0,
                connections: [2, 4] // Connects to Desert and Volcanic
            },
            {
                id: 2,
                name: "Desert Wastes",
                shape: "square", // Square hub
                bounds: { minX: -25, maxX: 25, minZ: -75, maxZ: -25 },
                centerX: 0,
                centerZ: -50,
                radius: 25,
                groundColor: 0xdaa520,
                monsterConfig: {
                    color: 0xd2691e,
                    ferocity: 1.5,
                    health: 100,
                    damage: 10,
                    zoneId: 2
                },
                bossConfig: {
                    color: 0xd2691e,
                    ferocity: 2.0,
                    health: 500,
                    damage: 30
                },
                unlocked: false,
                unlockThreshold: 50,
                connections: [1, 3, 5] // Connects to Green Plains, Shadow, Frozen
            },
            {
                id: 3,
                name: "Shadow Realm",
                shape: "square", // Square dark zone
                bounds: { minX: 25, maxX: 75, minZ: -75, maxZ: -25 },
                centerX: 50,
                centerZ: -50,
                radius: 25,
                groundColor: 0x4b0082,
                monsterConfig: {
                    color: 0x4b0082,
                    ferocity: 3.0,
                    health: 400,
                    damage: 40,
                    zoneId: 3
                },
                bossConfig: {
                    color: 0x4b0082,
                    ferocity: 3.5,
                    health: 2000,
                    damage: 120
                },
                unlocked: false,
                unlockThreshold: 200,
                connections: [2, 6] // Connects to Desert and Corrupted Forest
            },
            {
                id: 4,
                name: "Volcanic Lands",
                shape: "square", // Square volcanic zone
                bounds: { minX: -75, maxX: -25, minZ: -25, maxZ: 25 },
                centerX: -50,
                centerZ: 0,
                radius: 25,
                groundColor: 0xff4500,
                monsterConfig: {
                    color: 0xff4500,
                    ferocity: 2.0,
                    health: 200,
                    damage: 20,
                    zoneId: 4
                },
                bossConfig: {
                    color: 0xff4500,
                    ferocity: 2.5,
                    health: 1000,
                    damage: 60
                },
                unlocked: false,
                unlockThreshold: 100,
                connections: [1, 5, 7] // Connects to Green Plains, Frozen, Crystal
            },
            {
                id: 5,
                name: "Frozen Tundra",
                shape: "square", // Square center hub
                bounds: { minX: -25, maxX: 25, minZ: -25, maxZ: 25 },
                centerX: 0,
                centerZ: 0,
                radius: 25,
                groundColor: 0xE0FFFF,
                monsterConfig: {
                    color: 0x00CED1,
                    ferocity: 2.0,
                    health: 800,
                    damage: 80,
                    zoneId: 5
                },
                bossConfig: {
                    color: 0x00CED1,
                    ferocity: 3.0,
                    health: 4000,
                    damage: 240
                },
                unlocked: false,
                unlockThreshold: 300,
                connections: [2, 4, 6, 8] // Central hub: connects to Desert, Volcanic, Forest, Mystic
            },
            {
                id: 6,
                name: "Corrupted Forest",
                shape: "square", // Square corrupted zone
                bounds: { minX: 25, maxX: 75, minZ: -25, maxZ: 25 },
                centerX: 50,
                centerZ: 0,
                radius: 25,
                groundColor: 0x2F4F2F,
                monsterConfig: {
                    color: 0x556B2F,
                    ferocity: 2.5,
                    health: 1600,
                    damage: 160,
                    zoneId: 6
                },
                bossConfig: {
                    color: 0x556B2F,
                    ferocity: 3.5,
                    health: 8000,
                    damage: 480
                },
                unlocked: false,
                unlockThreshold: 450,
                connections: [3, 5, 9] // Connects to Shadow, Frozen, Void
            },
            {
                id: 7,
                name: "Crystal Caverns",
                shape: "square", // Square crystal zone
                bounds: { minX: -75, maxX: -25, minZ: 25, maxZ: 75 },
                centerX: -50,
                centerZ: 50,
                radius: 25,
                groundColor: 0x9370DB,
                monsterConfig: {
                    color: 0x8A2BE2,
                    ferocity: 3.0,
                    health: 3200,
                    damage: 320,
                    zoneId: 7
                },
                bossConfig: {
                    color: 0x8A2BE2,
                    ferocity: 4.0,
                    health: 16000,
                    damage: 960
                },
                unlocked: false,
                unlockThreshold: 650,
                connections: [4, 8] // Connects to Volcanic and Mystic
            },
            {
                id: 8,
                name: "Mystic Gardens",
                shape: "square", // Square mystical zone
                bounds: { minX: -25, maxX: 25, minZ: 25, maxZ: 75 },
                centerX: 0,
                centerZ: 50,
                radius: 25,
                groundColor: 0xFF69B4, // Hot pink/magenta for mystical feel
                monsterConfig: {
                    color: 0xFF1493,
                    ferocity: 3.5,
                    health: 5000,
                    damage: 500,
                    zoneId: 8
                },
                bossConfig: {
                    color: 0xFF1493,
                    ferocity: 4.5,
                    health: 25000,
                    damage: 1500
                },
                unlocked: false,
                unlockThreshold: 800,
                connections: [5, 7, 9] // Connects to Frozen, Crystal, Void
            },
            {
                id: 9,
                name: "Void Nexus",
                shape: "square", // Square void zone
                bounds: { minX: 25, maxX: 75, minZ: 25, maxZ: 75 },
                centerX: 50,
                centerZ: 50,
                radius: 25,
                groundColor: 0x000033,
                monsterConfig: {
                    color: 0x1C1C1C,
                    ferocity: 4.0,
                    health: 6400,
                    damage: 640,
                    zoneId: 9
                },
                bossConfig: {
                    color: 0x1C1C1C,
                    ferocity: 5.0,
                    health: 32000,
                    damage: 1920
                },
                unlocked: false,
                unlockThreshold: 1000,
                connections: [6, 8] // Connects to Forest and Mystic
            }
        ];

        this.walls = [];
        this.fogPlanes = [];
        this.bosses = [];
        this.lastProgressionCheck = 0;
    }

    getCurrentZone(position) {
        for (let zone of this.zones) {
            if (position.x >= zone.bounds.minX && position.x < zone.bounds.maxX &&
                position.z >= zone.bounds.minZ && position.z <= zone.bounds.maxZ) {
                return zone;
            }
        }
        return this.zones[0]; // Default to Zone 1
    }

    getNextZone(currentZone) {
        const currentIndex = this.zones.findIndex(z => z.id === currentZone.id);
        if (currentIndex < this.zones.length - 1) {
            return this.zones[currentIndex + 1];
        }
        return null;
    }

    checkProgression(player, game) {
        // Check every second
        const now = Date.now();
        if (now - this.lastProgressionCheck < 1000) {
            return;
        }
        this.lastProgressionCheck = now;

        // Find the next locked zone
        for (let i = 0; i < this.zones.length; i++) {
            const zone = this.zones[i];
            if (!zone.unlocked && player.damage >= zone.unlockThreshold) {
                this.unlockZone(zone, game);
                break; // Only unlock one zone at a time
            }
        }
    }

    unlockZone(zone, game) {
        console.log(`Unlocking zone: ${zone.name}`);
        zone.unlocked = true;

        // Show message
        if (game.showMessage) {
            showMessage(`New area unlocked: ${zone.name}!`, 3000);
        }

        // Remove walls connected to this zone
        if (game.wallSystem) {
            // Find all zones connected to the newly unlocked zone
            zone.connections.forEach(connectedId => {
                const connectedZone = this.zones.find(z => z.id === connectedId);
                if (connectedZone && connectedZone.unlocked) {
                    // Remove wall between this zone and the connected zone
                    game.wallSystem.removeWallBetweenZones(zone.id, connectedId, game.scene);
                }
            });
        }

        // Clear fog
        if (game.fogSystem) {
            game.fogSystem.clearZoneFog(zone.id, game.scene);
        }

        // Spawn boss
        if (game.spawnBoss) {
            game.spawnBoss(zone);
        }
    }

    createZoneGrounds(scene) {
        const grounds = [];

        for (let zone of this.zones) {
            // Use full square grounds so zones connect without gaps.
            const width = zone.bounds.maxX - zone.bounds.minX;
            const depth = zone.bounds.maxZ - zone.bounds.minZ;
            const centerX = (zone.bounds.minX + zone.bounds.maxX) / 2;
            const centerZ = (zone.bounds.minZ + zone.bounds.maxZ) / 2;

            const geometry = new THREE.PlaneGeometry(width, depth);
            const material = new THREE.MeshStandardMaterial({
                color: zone.groundColor,
                roughness: 0.8,
                metalness: 0.2
            });
            const ground = new THREE.Mesh(geometry, material);
            ground.rotation.x = -Math.PI / 2;
            ground.position.set(centerX, 0, centerZ);
            ground.receiveShadow = true;

            scene.add(ground);
            grounds.push(ground);
        }

        return grounds;
    }

    getZoneForSpawning(playerZone) {
        // Spawn monsters in the current zone or connected unlocked zones
        const zones = [playerZone];

        // Add connected zones if unlocked
        if (playerZone.connections) {
            playerZone.connections.forEach(connectedId => {
                const connectedZone = this.zones.find(z => z.id === connectedId);
                if (connectedZone && connectedZone.unlocked) {
                    zones.push(connectedZone);
                }
            });
        }

        // Pick a random zone from available zones
        return zones[Math.floor(Math.random() * zones.length)];
    }

    getRandomPositionInZone(zone) {
        const x = zone.bounds.minX + Math.random() * (zone.bounds.maxX - zone.bounds.minX);
        const z = zone.bounds.minZ + Math.random() * (zone.bounds.maxZ - zone.bounds.minZ);
        return { x, z };
    }
}
