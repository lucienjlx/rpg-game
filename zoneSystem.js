class ZoneSystem {
    constructor() {
        this.zones = [
            {
                id: 1,
                name: "Green Plains",
                bounds: { minX: -50, maxX: 0, minZ: -25, maxZ: 25 },
                groundColor: 0x228b22,
                monsterConfig: {
                    color: 0x8b0000,
                    scale: 1.0,
                    health: 50,
                    damage: 5
                },
                bossConfig: {
                    color: 0x8b0000,
                    scale: 3.0,
                    health: 250,
                    damage: 15
                },
                unlocked: true,
                unlockThreshold: 0
            },
            {
                id: 2,
                name: "Desert Wastes",
                bounds: { minX: 0, maxX: 50, minZ: -25, maxZ: 25 },
                groundColor: 0xdaa520,
                monsterConfig: {
                    color: 0xd2691e,
                    scale: 1.2,
                    health: 100,
                    damage: 10
                },
                bossConfig: {
                    color: 0xd2691e,
                    scale: 3.6,
                    health: 500,
                    damage: 30
                },
                unlocked: false,
                unlockThreshold: 50
            },
            {
                id: 3,
                name: "Volcanic Lands",
                bounds: { minX: 50, maxX: 100, minZ: -25, maxZ: 25 },
                groundColor: 0xff4500,
                monsterConfig: {
                    color: 0xff4500,
                    scale: 1.4,
                    health: 200,
                    damage: 20
                },
                bossConfig: {
                    color: 0xff4500,
                    scale: 4.2,
                    health: 1000,
                    damage: 60
                },
                unlocked: false,
                unlockThreshold: 100
            },
            {
                id: 4,
                name: "Shadow Realm",
                bounds: { minX: 100, maxX: 150, minZ: -25, maxZ: 25 },
                groundColor: 0x4b0082,
                monsterConfig: {
                    color: 0x4b0082,
                    scale: 1.6,
                    health: 400,
                    damage: 40
                },
                bossConfig: {
                    color: 0x4b0082,
                    scale: 4.8,
                    health: 2000,
                    damage: 120
                },
                unlocked: false,
                unlockThreshold: 200
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
            game.showMessage("You have grown powerful! The path forward opens...");
        }

        // Remove wall
        const wallIndex = zone.id - 2; // Wall 0 is between zones 1 and 2
        if (wallIndex >= 0 && game.wallSystem) {
            game.wallSystem.removeWall(wallIndex, game.scene);
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
        // Spawn monsters in the current zone or adjacent unlocked zones
        const zones = [playerZone];

        // Add previous zone if unlocked
        const prevZone = this.zones.find(z => z.id === playerZone.id - 1);
        if (prevZone && prevZone.unlocked) {
            zones.push(prevZone);
        }

        // Add next zone if unlocked
        const nextZone = this.zones.find(z => z.id === playerZone.id + 1);
        if (nextZone && nextZone.unlocked) {
            zones.push(nextZone);
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
