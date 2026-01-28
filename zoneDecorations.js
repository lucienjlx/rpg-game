class ZoneDecorations {
    constructor(scene, zoneSystem) {
        this.scene = scene;
        this.zoneSystem = zoneSystem;
        this.decorations = [];
    }

    createDecorationsForAllZones() {
        this.zoneSystem.zones.forEach(zone => {
            this.createDecorationsForZone(zone);
        });
    }

    createDecorationsForZone(zone) {
        const decorationCount = 15; // Number of decorations per zone

        for (let i = 0; i < decorationCount; i++) {
            const pos = this.zoneSystem.getRandomPositionInZone(zone);
            const decoration = this.createDecorationByZone(zone.id, pos.x, pos.z);
            if (decoration) {
                this.decorations.push(decoration);
            }
        }
    }

    createDecorationByZone(zoneId, x, z) {
        switch(zoneId) {
            case 1: return this.createGreenPlainsDecoration(x, z);
            case 2: return this.createDesertDecoration(x, z);
            case 3: return this.createShadowDecoration(x, z);
            case 4: return this.createVolcanicDecoration(x, z);
            case 5: return this.createFrozenDecoration(x, z);
            case 6: return this.createForestDecoration(x, z);
            case 7: return this.createCrystalDecoration(x, z);
            case 8: return this.createMysticDecoration(x, z);
            case 9: return this.createVoidDecoration(x, z);
            default: return null;
        }
    }

    createGreenPlainsDecoration(x, z) {
        const rand = Math.random();

        if (rand < 0.4) {
            // Tree
            return this.createTree(x, z, 0x228b22, 0x8B4513);
        } else if (rand < 0.7) {
            // Rock
            return this.createRock(x, z, 0x808080);
        } else {
            // Bush
            return this.createBush(x, z, 0x2F4F2F);
        }
    }

    createDesertDecoration(x, z) {
        const rand = Math.random();

        if (rand < 0.5) {
            // Cactus
            return this.createCactus(x, z);
        } else if (rand < 0.8) {
            // Desert rock
            return this.createRock(x, z, 0xD2B48C);
        } else {
            // Dead tree
            return this.createDeadTree(x, z);
        }
    }

    createVolcanicDecoration(x, z) {
        const rand = Math.random();

        if (rand < 0.6) {
            // Lava rock
            return this.createRock(x, z, 0x8B0000);
        } else {
            // Volcanic crystal
            return this.createCrystal(x, z, 0xFF4500);
        }
    }

    createShadowDecoration(x, z) {
        const rand = Math.random();

        if (rand < 0.35) {
            // Dark obelisk
            return this.createObelisk(x, z, 0x4B0082);
        } else if (rand < 0.7) {
            // Shadow crystal
            return this.createCrystal(x, z, 0x8B008B);
        } else {
            // Ruined cityscape
            return this.createRuinedCityscape(x, z);
        }
    }

    createFrozenDecoration(x, z) {
        const rand = Math.random();

        if (rand < 0.5) {
            // Ice spike
            return this.createIceSpike(x, z);
        } else {
            // Frozen rock
            return this.createRock(x, z, 0xE0FFFF);
        }
    }

    createForestDecoration(x, z) {
        const rand = Math.random();

        if (rand < 0.15) {
            // Ruined watchpost
            return this.createRuinedWatchpost(x, z);
        } else if (rand < 0.65) {
            // Corrupted tree
            return this.createTree(x, z, 0x2F4F2F, 0x3D5229);
        } else {
            // Mushroom
            return this.createMushroom(x, z);
        }
    }

    createCrystalDecoration(x, z) {
        const rand = Math.random();

        if (rand < 0.7) {
            // Crystal formation
            return this.createCrystal(x, z, 0x9370DB);
        } else {
            // Glowing rock
            return this.createGlowingRock(x, z, 0x8A2BE2);
        }
    }

    createVoidDecoration(x, z) {
        const rand = Math.random();

        if (rand < 0.45) {
            // Void portal fragment
            return this.createVoidPortal(x, z);
        } else if (rand < 0.7) {
            // Dark crystal
            return this.createCrystal(x, z, 0x191970);
        } else {
            // Ruined cityscape
            return this.createRuinedCityscape(x, z);
        }
    }

    createMysticDecoration(x, z) {
        const rand = Math.random();

        if (rand < 0.4) {
            // Glowing flower
            return this.createMysticFlower(x, z);
        } else if (rand < 0.7) {
            // Enchanted tree
            return this.createTree(x, z, 0xFF69B4, 0xDA70D6);
        } else {
            // Mystic crystal
            return this.createCrystal(x, z, 0xFF1493);
        }
    }

    // Decoration creation methods
    createTree(x, z, leavesColor, trunkColor) {
        const group = new THREE.Group();

        // Trunk
        const trunkGeo = new THREE.CylinderGeometry(0.3, 0.4, 2, 8);
        const trunkMat = new THREE.MeshStandardMaterial({ color: trunkColor });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 1;
        trunk.castShadow = true;
        group.add(trunk);

        // Leaves
        const leavesGeo = new THREE.SphereGeometry(1, 8, 8);
        const leavesMat = new THREE.MeshStandardMaterial({ color: leavesColor });
        const leaves = new THREE.Mesh(leavesGeo, leavesMat);
        leaves.position.y = 2.5;
        leaves.scale.set(1, 1.2, 1);
        leaves.castShadow = true;
        group.add(leaves);

        group.position.set(x, 0, z);
        this.scene.add(group);
        return group;
    }

    createRock(x, z, color) {
        const group = new THREE.Group();

        const rockGeo = new THREE.DodecahedronGeometry(0.5 + Math.random() * 0.5, 0);
        const rockMat = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.9,
            metalness: 0.1
        });
        const rock = new THREE.Mesh(rockGeo, rockMat);
        rock.position.y = 0.3;
        rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        rock.castShadow = true;
        group.add(rock);

        group.position.set(x, 0, z);
        this.scene.add(group);
        return group;
    }

    createBush(x, z, color) {
        const group = new THREE.Group();

        const bushGeo = new THREE.SphereGeometry(0.6, 8, 8);
        const bushMat = new THREE.MeshStandardMaterial({ color: color });
        const bush = new THREE.Mesh(bushGeo, bushMat);
        bush.position.y = 0.4;
        bush.scale.set(1, 0.7, 1);
        bush.castShadow = true;
        group.add(bush);

        group.position.set(x, 0, z);
        this.scene.add(group);
        return group;
    }

    createCactus(x, z) {
        const group = new THREE.Group();

        const cactusMat = new THREE.MeshStandardMaterial({ color: 0x2F4F2F });

        // Main body
        const bodyGeo = new THREE.CylinderGeometry(0.3, 0.3, 2, 8);
        const body = new THREE.Mesh(bodyGeo, cactusMat);
        body.position.y = 1;
        body.castShadow = true;
        group.add(body);

        // Arms
        const armGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.8, 8);
        const leftArm = new THREE.Mesh(armGeo, cactusMat);
        leftArm.position.set(-0.4, 1.2, 0);
        leftArm.rotation.z = Math.PI / 3;
        group.add(leftArm);

        const rightArm = new THREE.Mesh(armGeo, cactusMat);
        rightArm.position.set(0.4, 1.5, 0);
        rightArm.rotation.z = -Math.PI / 3;
        group.add(rightArm);

        group.position.set(x, 0, z);
        this.scene.add(group);
        return group;
    }

    createDeadTree(x, z) {
        const group = new THREE.Group();

        const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 2.5, 8);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4A4A4A });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 1.25;
        trunk.rotation.z = 0.2;
        trunk.castShadow = true;
        group.add(trunk);

        group.position.set(x, 0, z);
        this.scene.add(group);
        return group;
    }

    createCrystal(x, z, color) {
        const group = new THREE.Group();

        const crystalGeo = new THREE.ConeGeometry(0.3, 1.5, 6);
        const crystalMat = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.8
        });
        const crystal = new THREE.Mesh(crystalGeo, crystalMat);
        crystal.position.y = 0.75;
        crystal.castShadow = true;
        group.add(crystal);

        group.position.set(x, 0, z);
        this.scene.add(group);
        return group;
    }

    createObelisk(x, z, color) {
        const group = new THREE.Group();

        const obeliskGeo = new THREE.BoxGeometry(0.5, 3, 0.5);
        const obeliskMat = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.2
        });
        const obelisk = new THREE.Mesh(obeliskGeo, obeliskMat);
        obelisk.position.y = 1.5;
        obelisk.castShadow = true;
        group.add(obelisk);

        group.position.set(x, 0, z);
        this.scene.add(group);
        return group;
    }

    createIceSpike(x, z) {
        const group = new THREE.Group();

        const spikeGeo = new THREE.ConeGeometry(0.4, 2, 8);
        const spikeMat = new THREE.MeshStandardMaterial({
            color: 0xE0FFFF,
            transparent: true,
            opacity: 0.7,
            emissive: 0x00CED1,
            emissiveIntensity: 0.2
        });
        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        spike.position.y = 1;
        spike.castShadow = true;
        group.add(spike);

        group.position.set(x, 0, z);
        this.scene.add(group);
        return group;
    }

    createMushroom(x, z) {
        const group = new THREE.Group();

        // Stem
        const stemGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.6, 8);
        const stemMat = new THREE.MeshStandardMaterial({ color: 0xF5F5DC });
        const stem = new THREE.Mesh(stemGeo, stemMat);
        stem.position.y = 0.3;
        group.add(stem);

        // Cap
        const capGeo = new THREE.SphereGeometry(0.4, 8, 8);
        const capMat = new THREE.MeshStandardMaterial({ color: 0x8B0000 });
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.y = 0.7;
        cap.scale.set(1, 0.6, 1);
        group.add(cap);

        group.position.set(x, 0, z);
        this.scene.add(group);
        return group;
    }

    createGlowingRock(x, z, color) {
        const group = new THREE.Group();

        const rockGeo = new THREE.DodecahedronGeometry(0.6, 0);
        const rockMat = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.5,
            roughness: 0.3,
            metalness: 0.7
        });
        const rock = new THREE.Mesh(rockGeo, rockMat);
        rock.position.y = 0.4;
        rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        rock.castShadow = true;
        group.add(rock);

        group.position.set(x, 0, z);
        this.scene.add(group);
        return group;
    }

    createVoidPortal(x, z) {
        const group = new THREE.Group();

        const portalGeo = new THREE.TorusGeometry(0.5, 0.1, 8, 16);
        const portalMat = new THREE.MeshStandardMaterial({
            color: 0x9400D3,
            emissive: 0x9400D3,
            emissiveIntensity: 0.8
        });
        const portal = new THREE.Mesh(portalGeo, portalMat);
        portal.position.y = 1;
        portal.rotation.x = Math.PI / 2;
        group.add(portal);

        group.position.set(x, 0, z);
        this.scene.add(group);
        return group;
    }

    createMysticFlower(x, z) {
        const group = new THREE.Group();

        // Stem
        const stemGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 8);
        const stemMat = new THREE.MeshStandardMaterial({ color: 0x90EE90 });
        const stem = new THREE.Mesh(stemGeo, stemMat);
        stem.position.y = 0.4;
        group.add(stem);

        // Flower petals (5 petals in a circle)
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i;
            const petalGeo = new THREE.SphereGeometry(0.2, 8, 8);
            const petalMat = new THREE.MeshStandardMaterial({
                color: 0xFF69B4,
                emissive: 0xFF1493,
                emissiveIntensity: 0.5
            });
            const petal = new THREE.Mesh(petalGeo, petalMat);
            petal.position.set(
                Math.cos(angle) * 0.3,
                0.8,
                Math.sin(angle) * 0.3
            );
            petal.scale.set(1, 0.5, 1);
            group.add(petal);
        }

        // Center of flower
        const centerGeo = new THREE.SphereGeometry(0.15, 8, 8);
        const centerMat = new THREE.MeshStandardMaterial({
            color: 0xFFD700,
            emissive: 0xFFD700,
            emissiveIntensity: 0.7
        });
        const center = new THREE.Mesh(centerGeo, centerMat);
        center.position.y = 0.8;
        group.add(center);

        group.position.set(x, 0, z);
        this.scene.add(group);
        return group;
    }

    createRuinedCityscape(x, z) {
        const group = new THREE.Group();
        const stoneMat = new THREE.MeshStandardMaterial({
            color: 0x6E6E6E,
            roughness: 0.9
        });
        const darkStoneMat = new THREE.MeshStandardMaterial({
            color: 0x4A4A4A,
            roughness: 0.95
        });

        const baseGeo = new THREE.BoxGeometry(6, 0.4, 4);
        const base = new THREE.Mesh(baseGeo, stoneMat);
        base.position.y = 0.2;
        base.castShadow = true;
        group.add(base);

        const wallCount = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < wallCount; i++) {
            const width = 2 + Math.random() * 2.5;
            const height = 1 + Math.random() * 2.5;
            const wallGeo = new THREE.BoxGeometry(width, height, 0.4);
            const wall = new THREE.Mesh(wallGeo, stoneMat);
            wall.position.set(
                (Math.random() - 0.5) * 4,
                height / 2,
                (Math.random() - 0.5) * 3
            );
            wall.rotation.y = Math.random() * Math.PI;
            wall.rotation.z = (Math.random() - 0.5) * 0.2;
            wall.castShadow = true;
            group.add(wall);
        }

        const towerGeo = new THREE.CylinderGeometry(0.6, 0.8, 3 + Math.random() * 2, 6);
        const tower = new THREE.Mesh(towerGeo, darkStoneMat);
        tower.position.set(-1.6, 1.6, 1.2);
        tower.rotation.z = -0.2;
        tower.castShadow = true;
        group.add(tower);

        const archGroup = this.createRuinedArch(darkStoneMat);
        archGroup.position.set(1.6, 0, -1.2);
        archGroup.rotation.y = Math.random() * Math.PI;
        group.add(archGroup);

        const rubbleCount = 6 + Math.floor(Math.random() * 4);
        for (let i = 0; i < rubbleCount; i++) {
            const rubbleGeo = new THREE.DodecahedronGeometry(0.3 + Math.random() * 0.3, 0);
            const rubble = new THREE.Mesh(rubbleGeo, darkStoneMat);
            rubble.position.set(
                (Math.random() - 0.5) * 5,
                0.2 + Math.random() * 0.3,
                (Math.random() - 0.5) * 3.5
            );
            rubble.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            rubble.castShadow = true;
            group.add(rubble);
        }

        group.position.set(x, 0, z);
        group.rotation.y = Math.random() * Math.PI * 2;
        this.scene.add(group);
        return group;
    }

    createRuinedArch(material) {
        const group = new THREE.Group();
        const pillarGeo = new THREE.BoxGeometry(0.4, 2.2, 0.4);
        const beamGeo = new THREE.BoxGeometry(2.2, 0.4, 0.4);

        const leftPillar = new THREE.Mesh(pillarGeo, material);
        leftPillar.position.set(-0.9, 1.1, 0);
        leftPillar.castShadow = true;
        group.add(leftPillar);

        const rightPillar = new THREE.Mesh(pillarGeo, material);
        rightPillar.position.set(0.9, 1.1, 0);
        rightPillar.castShadow = true;
        group.add(rightPillar);

        const beam = new THREE.Mesh(beamGeo, material);
        beam.position.set(0, 2.3, 0);
        beam.rotation.z = (Math.random() - 0.5) * 0.3;
        beam.castShadow = true;
        group.add(beam);

        return group;
    }

    createRuinedWatchpost(x, z) {
        const group = new THREE.Group();
        const woodMat = new THREE.MeshStandardMaterial({
            color: 0x5A3B2E,
            roughness: 0.9
        });
        const stoneMat = new THREE.MeshStandardMaterial({
            color: 0x5B5B5B,
            roughness: 0.9
        });

        const baseGeo = new THREE.CylinderGeometry(0.6, 0.8, 1.2, 8);
        const base = new THREE.Mesh(baseGeo, stoneMat);
        base.position.y = 0.6;
        base.castShadow = true;
        group.add(base);

        const postGeo = new THREE.BoxGeometry(0.2, 2.2, 0.2);
        const post = new THREE.Mesh(postGeo, woodMat);
        post.position.set(0, 2.1, 0);
        post.rotation.z = 0.2;
        post.castShadow = true;
        group.add(post);

        const platformGeo = new THREE.BoxGeometry(1.6, 0.2, 1.6);
        const platform = new THREE.Mesh(platformGeo, woodMat);
        platform.position.set(0, 3.2, 0);
        platform.rotation.z = -0.15;
        platform.castShadow = true;
        group.add(platform);

        const railingGeo = new THREE.BoxGeometry(1.6, 0.2, 0.2);
        const rail = new THREE.Mesh(railingGeo, woodMat);
        rail.position.set(0, 3.5, 0.7);
        rail.rotation.z = -0.15;
        group.add(rail);

        group.position.set(x, 0, z);
        this.scene.add(group);
        return group;
    }
}
