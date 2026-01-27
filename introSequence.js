class IntroSequence {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.isPlaying = false;
        this.currentScene = 0;
        this.skipButton = null;
        this.introObjects = [];
        this.fallingLight = null;
        this.shimmerParticles = null;
        this.time = 0;
        this.lastFrameTime = 0;
        this.ticking = false;
    }

    start(onComplete) {
        this.isPlaying = true;
        this.onComplete = onComplete;
        this.time = 0;
        this.lastFrameTime = performance.now();
        this.startClock();

        // Hide game UI during intro
        document.getElementById('ui-overlay').style.display = 'none';

        // Create skip button
        this.createSkipButton();

        // Start the intro sequence
        this.playScene1();
    }

    createSkipButton() {
        this.skipButton = document.createElement('button');
        this.skipButton.textContent = 'Skip Intro (Space)';
        this.skipButton.style.position = 'fixed';
        this.skipButton.style.bottom = '20px';
        this.skipButton.style.right = '20px';
        this.skipButton.style.padding = '10px 20px';
        this.skipButton.style.background = 'rgba(0, 0, 0, 0.7)';
        this.skipButton.style.color = '#ffd700';
        this.skipButton.style.border = '2px solid #ffd700';
        this.skipButton.style.borderRadius = '8px';
        this.skipButton.style.fontSize = '16px';
        this.skipButton.style.cursor = 'pointer';
        this.skipButton.style.zIndex = '1000';

        this.skipButton.addEventListener('click', () => this.skip());
        document.body.appendChild(this.skipButton);

        // Also allow spacebar to skip
        this.spaceHandler = (e) => {
            if (e.key === ' ' && this.isPlaying) {
                e.preventDefault();
                this.skip();
            }
        };
        document.addEventListener('keydown', this.spaceHandler);
    }

    showText(text, duration, callback) {
        const textElement = document.createElement('div');
        textElement.textContent = text;
        textElement.style.position = 'fixed';
        textElement.style.top = '50%';
        textElement.style.left = '50%';
        textElement.style.transform = 'translate(-50%, -50%)';
        textElement.style.color = '#ffd700';
        textElement.style.fontSize = '32px';
        textElement.style.fontWeight = 'bold';
        textElement.style.textAlign = 'center';
        textElement.style.textShadow = '2px 2px 4px black';
        textElement.style.zIndex = '999';
        textElement.style.maxWidth = '80%';
        textElement.style.opacity = '0';
        textElement.style.transition = 'opacity 1s';

        document.body.appendChild(textElement);

        // Fade in
        setTimeout(() => {
            textElement.style.opacity = '1';
        }, 100);

        // Fade out and remove
        setTimeout(() => {
            textElement.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(textElement);
                if (callback && this.isPlaying) callback();
            }, 1000);
        }, duration - 1000);
    }

    // Scene 1: Magical Being on Mountain
    playScene1() {
        this.currentScene = 1;
        this.clearScene();

        // Position camera to show mountain and kingdom nearby
        this.camera.position.set(-20, 90, 80);
        this.camera.lookAt(10, 40, -20);

        // Create mountain peak
        this.createMountain();

        // Create magical being (glowing ethereal form)
        this.createMagicalBeing();

        // Distant kingdom beside the mountain
        this.createDistantKingdom();

        this.showText('High on the mountain, a magical being watched a flourishing kingdom below...', 4500, () => {
            setTimeout(() => this.playScene2(), 1000);
        });
    }

    createMountain() {
        const group = new THREE.Group();

        // Mountain peak (large cone)
        const peakGeo = new THREE.ConeGeometry(15, 40, 8);
        const peakMat = new THREE.MeshStandardMaterial({
            color: 0x808080,
            roughness: 0.9
        });
        const peak = new THREE.Mesh(peakGeo, peakMat);
        peak.position.y = 40;
        peak.castShadow = true;
        group.add(peak);

        // Snow cap
        const snowGeo = new THREE.ConeGeometry(8, 15, 8);
        const snowMat = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            roughness: 0.3
        });
        const snow = new THREE.Mesh(snowGeo, snowMat);
        snow.position.y = 57;
        group.add(snow);

        // Clouds around mountain
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const cloudGeo = new THREE.SphereGeometry(3, 8, 8);
            const cloudMat = new THREE.MeshBasicMaterial({
                color: 0xFFFFFF,
                transparent: true,
                opacity: 0.6
            });
            const cloud = new THREE.Mesh(cloudGeo, cloudMat);
            cloud.position.set(
                Math.cos(angle) * 20,
                45 + Math.random() * 10,
                Math.sin(angle) * 20
            );
            group.add(cloud);
        }

        this.scene.add(group);
        this.introObjects.push(group);
    }

    createMagicalBeing() {
        const group = new THREE.Group();

        // Ethereal glowing form
        const bodyGeo = new THREE.SphereGeometry(2, 16, 16);
        const bodyMat = new THREE.MeshStandardMaterial({
            color: 0x00BFFF,
            emissive: 0x00BFFF,
            emissiveIntensity: 1.0,
            transparent: true,
            opacity: 0.7
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 62;
        group.add(body);

        // Magical aura
        const auraGeo = new THREE.SphereGeometry(3, 16, 16);
        const auraMat = new THREE.MeshBasicMaterial({
            color: 0xFFD700,
            transparent: true,
            opacity: 0.3
        });
        const aura = new THREE.Mesh(auraGeo, auraMat);
        aura.position.y = 62;
        group.add(aura);
        this.magicalAura = aura;

        // Floating particles
        for (let i = 0; i < 20; i++) {
            const particleGeo = new THREE.SphereGeometry(0.2, 4, 4);
            const particleMat = new THREE.MeshBasicMaterial({
                color: 0xFFD700,
                transparent: true,
                opacity: 0.8
            });
            const particle = new THREE.Mesh(particleGeo, particleMat);
            particle.position.set(
                (Math.random() - 0.5) * 6,
                60 + Math.random() * 6,
                (Math.random() - 0.5) * 6
            );
            group.add(particle);
        }

        this.scene.add(group);
        this.introObjects.push(group);
        this.magicalBeing = group;

        // Animate aura pulsing
        const animateAura = () => {
            if (!this.isPlaying || !this.magicalAura) return;
            const time = this.time * 0.001;
            this.magicalAura.scale.set(
                1 + Math.sin(time * 2) * 0.3,
                1 + Math.sin(time * 2) * 0.3,
                1 + Math.sin(time * 2) * 0.3
            );
            requestAnimationFrame(animateAura);
        };
        animateAura();
    }

    // Scene 2: Kingdom Below - Bustling City
    playScene2() {
        this.currentScene = 2;

        this.clearScene();

        // Camera pans down to show kingdom below
        this.animateCamera(
            { x: 0, y: 70, z: 90 },
            { x: 0, y: 0, z: 0 },
            3000
        );

        // Create bustling kingdom
        this.createBustlingEmpire();

        this.showText('Below, a vast kingdom flourished with life and prosperity...', 5000, () => {
            setTimeout(() => this.playScene3(), 1000);
        });
    }

    createBustlingEmpire() {
        const group = new THREE.Group();

        const kingdomSize = 160;
        const halfSize = kingdomSize / 2;
        const roadWidth = 8;
        const canalWidth = 12;
        const canalZ = -20;

        // Outer walls and towers
        const wallMat = new THREE.MeshStandardMaterial({
            color: 0xB0B0B0,
            roughness: 0.8,
            metalness: 0.1
        });
        const outerWalls = this.createKingdomWalls(kingdomSize, 12, 3, wallMat);
        group.add(outerWalls);

        // Gatehouses for each wall
        const gatehouses = this.createGatehouses(kingdomSize, wallMat);
        group.add(gatehouses);

        // Main roads
        const roads = this.createCityRoads(kingdomSize, roadWidth);
        group.add(roads);

        // Canal with ships and bridges
        const canal = this.createCanal(kingdomSize - 30, canalWidth);
        canal.position.set(0, 0, canalZ);
        group.add(canal);

        // Main castle (much larger and more detailed)
        const castleGroup = this.createDetailedCastle();
        group.add(castleGroup);

        // Monument plaza
        const monument = this.createMonument();
        monument.position.set(0, 0, 22);
        group.add(monument);

        // Market district
        const market = this.createMarketStalls(14, {
            minX: -35,
            maxX: 35,
            minZ: 25,
            maxZ: 55
        });
        group.add(market);

        // City buildings around castle (120+ buildings)
        const buildingCount = 120;
        const canalBuffer = canalWidth / 2 + 6;
        const roadBuffer = roadWidth / 2 + 4;
        for (let i = 0; i < buildingCount; i++) {
            const x = (Math.random() * (kingdomSize - 24)) - (halfSize - 12);
            const z = (Math.random() * (kingdomSize - 24)) - (halfSize - 12);

            if (Math.abs(x) < 16 && Math.abs(z) < 16) {
                i--;
                continue;
            }
            if (Math.abs(x) < roadBuffer || Math.abs(z) < roadBuffer) {
                i--;
                continue;
            }
            if (Math.abs(z - canalZ) < canalBuffer) {
                i--;
                continue;
            }
            if (x > -40 && x < 40 && z > 20 && z < 60) {
                i--;
                continue;
            }

            const building = this.createBuilding();
            building.position.set(x, 0, z);
            group.add(building);
        }

        // People (small moving figures)
        const peopleCount = 90;
        for (let i = 0; i < peopleCount; i++) {
            const person = this.createPerson();
            const x = (Math.random() * (kingdomSize - 30)) - (halfSize - 15);
            const z = (Math.random() * (kingdomSize - 30)) - (halfSize - 15);
            if (Math.abs(z - canalZ) < canalWidth / 2 + 2) {
                i--;
                continue;
            }
            person.position.set(x, 0, z);
            group.add(person);
        }

        // Ground
        const groundSize = kingdomSize + 40;
        const groundGeo = new THREE.PlaneGeometry(groundSize, groundSize);
        const groundMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        group.add(ground);

        // Golden prosperity glow
        const glowGeo = new THREE.RingGeometry(60, 70, 48);
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0xFFD700,
            transparent: true,
            opacity: 0.35,
            side: THREE.DoubleSide
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        glow.rotation.x = -Math.PI / 2;
        glow.position.y = 0.1;
        group.add(glow);

        // Distant hills for depth
        const hills = this.createBackgroundHills(220, 18);
        group.add(hills);

        this.scene.add(group);
        this.introObjects.push(group);
        this.empire = group;
    }

    createDistantKingdom() {
        const group = new THREE.Group();

        const kingdomSize = 120;
        const halfSize = kingdomSize / 2;

        const wallMat = new THREE.MeshStandardMaterial({
            color: 0xB0B0B0,
            roughness: 0.9,
            metalness: 0.1
        });
        const outerWalls = this.createKingdomWalls(kingdomSize, 10, 2, wallMat);
        group.add(outerWalls);

        const castleGroup = this.createDetailedCastle();
        castleGroup.scale.set(0.6, 0.6, 0.6);
        group.add(castleGroup);

        for (let i = 0; i < 18; i++) {
            const building = this.createBuilding();
            building.scale.set(0.7, 0.7, 0.7);
            const x = (Math.random() * (kingdomSize - 30)) - (halfSize - 15);
            const z = (Math.random() * (kingdomSize - 30)) - (halfSize - 15);
            building.position.set(x, 0, z);
            group.add(building);
        }

        const hills = this.createBackgroundHills(170, 12);
        group.add(hills);

        const groundGeo = new THREE.PlaneGeometry(kingdomSize + 30, kingdomSize + 30);
        const groundMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        group.add(ground);

        group.position.set(35, 0, -35);

        this.scene.add(group);
        this.introObjects.push(group);
        this.kingdomBackdrop = group;
    }

    createKingdomWalls(size, height, thickness, material) {
        const group = new THREE.Group();
        const half = size / 2;

        const wallGeo = new THREE.BoxGeometry(size, height, thickness);
        const wallSideGeo = new THREE.BoxGeometry(thickness, height, size);

        const northWall = new THREE.Mesh(wallGeo, material);
        northWall.position.set(0, height / 2, -half);
        northWall.castShadow = true;
        group.add(northWall);

        const southWall = new THREE.Mesh(wallGeo, material);
        southWall.position.set(0, height / 2, half);
        southWall.castShadow = true;
        group.add(southWall);

        const westWall = new THREE.Mesh(wallSideGeo, material);
        westWall.position.set(-half, height / 2, 0);
        westWall.castShadow = true;
        group.add(westWall);

        const eastWall = new THREE.Mesh(wallSideGeo, material);
        eastWall.position.set(half, height / 2, 0);
        eastWall.castShadow = true;
        group.add(eastWall);

        const towerGeo = new THREE.CylinderGeometry(4, 4, height + 6, 8);
        for (let i = 0; i < 4; i++) {
            const tower = new THREE.Mesh(towerGeo, material);
            const x = i < 2 ? -half : half;
            const z = i % 2 === 0 ? -half : half;
            tower.position.set(x, (height + 6) / 2, z);
            tower.castShadow = true;
            group.add(tower);
        }

        return group;
    }

    createGatehouses(kingdomSize, wallMat) {
        const group = new THREE.Group();
        const half = kingdomSize / 2;
        const gateWidth = 22;
        const gateHeight = 14;
        const gateDepth = 6;

        const northGate = this.createGatehouse(gateWidth, gateHeight, gateDepth, wallMat);
        northGate.position.set(0, 0, -half);
        group.add(northGate);

        const southGate = this.createGatehouse(gateWidth, gateHeight, gateDepth, wallMat);
        southGate.position.set(0, 0, half);
        southGate.rotation.y = Math.PI;
        group.add(southGate);

        const eastGate = this.createGatehouse(gateWidth, gateHeight, gateDepth, wallMat);
        eastGate.position.set(half, 0, 0);
        eastGate.rotation.y = Math.PI / 2;
        group.add(eastGate);

        const westGate = this.createGatehouse(gateWidth, gateHeight, gateDepth, wallMat);
        westGate.position.set(-half, 0, 0);
        westGate.rotation.y = -Math.PI / 2;
        group.add(westGate);

        return group;
    }

    createGatehouse(width, height, depth, wallMat) {
        const group = new THREE.Group();
        const roofMat = new THREE.MeshStandardMaterial({
            color: 0x8B0000,
            roughness: 0.8
        });
        const doorMat = new THREE.MeshStandardMaterial({
            color: 0x5A3B2E,
            roughness: 0.9
        });
        const bannerMat = new THREE.MeshBasicMaterial({
            color: 0xB22222,
            side: THREE.DoubleSide
        });

        const pillarGeo = new THREE.BoxGeometry(4, height - 2, depth);
        const leftPillar = new THREE.Mesh(pillarGeo, wallMat);
        leftPillar.position.set(-width / 2 + 2, (height - 2) / 2, 0);
        leftPillar.castShadow = true;
        group.add(leftPillar);

        const rightPillar = new THREE.Mesh(pillarGeo, wallMat);
        rightPillar.position.set(width / 2 - 2, (height - 2) / 2, 0);
        rightPillar.castShadow = true;
        group.add(rightPillar);

        const topBeamGeo = new THREE.BoxGeometry(width - 6, 3, depth);
        const topBeam = new THREE.Mesh(topBeamGeo, wallMat);
        topBeam.position.y = height - 1.5;
        topBeam.castShadow = true;
        group.add(topBeam);

        const roofGeo = new THREE.ConeGeometry(width / 2 + 2, 4, 4);
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.y = height + 1.5;
        roof.rotation.y = Math.PI / 4;
        group.add(roof);

        const doorGeo = new THREE.BoxGeometry(width - 8, height - 6, 0.5);
        const door = new THREE.Mesh(doorGeo, doorMat);
        door.position.set(0, (height - 6) / 2, depth / 2 - 0.3);
        door.castShadow = true;
        group.add(door);

        const bannerGeo = new THREE.PlaneGeometry(4, 6);
        const banner = new THREE.Mesh(bannerGeo, bannerMat);
        banner.position.set(0, height - 4, depth / 2 + 0.2);
        group.add(banner);

        return group;
    }

    createCityRoads(kingdomSize, roadWidth) {
        const group = new THREE.Group();
        const roadLength = kingdomSize - 10;
        const roadMat = new THREE.MeshStandardMaterial({
            color: 0x8B6B4A,
            roughness: 0.9
        });

        const eastWest = new THREE.Mesh(new THREE.PlaneGeometry(roadLength, roadWidth), roadMat);
        eastWest.rotation.x = -Math.PI / 2;
        eastWest.position.y = 0.02;
        group.add(eastWest);

        const northSouth = new THREE.Mesh(new THREE.PlaneGeometry(roadWidth, roadLength), roadMat);
        northSouth.rotation.x = -Math.PI / 2;
        northSouth.position.y = 0.02;
        group.add(northSouth);

        return group;
    }

    createCanal(length, width) {
        const group = new THREE.Group();

        const waterGeo = new THREE.PlaneGeometry(length, width);
        const waterMat = new THREE.MeshStandardMaterial({
            color: 0x1E90FF,
            transparent: true,
            opacity: 0.7,
            metalness: 0.3,
            roughness: 0.2
        });
        const water = new THREE.Mesh(waterGeo, waterMat);
        water.rotation.x = -Math.PI / 2;
        water.position.y = 0.05;
        group.add(water);

        const bankGeo = new THREE.BoxGeometry(length, 1.2, 2);
        const bankMat = new THREE.MeshStandardMaterial({
            color: 0xA9A9A9,
            roughness: 0.9
        });
        const northBank = new THREE.Mesh(bankGeo, bankMat);
        northBank.position.set(0, 0.6, width / 2 + 1);
        northBank.castShadow = true;
        group.add(northBank);

        const southBank = new THREE.Mesh(bankGeo, bankMat);
        southBank.position.set(0, 0.6, -width / 2 - 1);
        southBank.castShadow = true;
        group.add(southBank);

        const bridgeOffsets = [-length * 0.3, 0, length * 0.3];
        bridgeOffsets.forEach(offset => {
            const bridge = this.createBridge(width + 4);
            bridge.position.set(offset, 0, 0);
            group.add(bridge);
        });

        for (let i = 0; i < 6; i++) {
            const dock = this.createDock();
            const x = (-length / 2 + 12) + Math.random() * (length - 24);
            const z = Math.random() > 0.5 ? width / 2 + 3.5 : -width / 2 - 3.5;
            dock.position.set(x, 0, z);
            dock.rotation.y = Math.random() * Math.PI * 2;
            group.add(dock);
        }

        for (let i = 0; i < 6; i++) {
            const ship = this.createShip();
            const x = (-length / 2 + 10) + Math.random() * (length - 20);
            const z = (Math.random() > 0.5 ? 1 : -1) * (width * 0.25);
            ship.position.set(x, 0.1, z);
            ship.rotation.y = Math.random() * Math.PI * 2;
            group.add(ship);
        }

        return group;
    }

    createBridge(width) {
        const group = new THREE.Group();
        const deckMat = new THREE.MeshStandardMaterial({
            color: 0x8B6B4A,
            roughness: 0.9
        });
        const railMat = new THREE.MeshStandardMaterial({
            color: 0x4E3620,
            roughness: 0.9
        });

        const deckGeo = new THREE.BoxGeometry(width, 0.5, 6);
        const deck = new THREE.Mesh(deckGeo, deckMat);
        deck.position.y = 0.6;
        deck.castShadow = true;
        group.add(deck);

        const railGeo = new THREE.BoxGeometry(width, 0.6, 0.3);
        const railFront = new THREE.Mesh(railGeo, railMat);
        railFront.position.set(0, 1.1, 2.8);
        group.add(railFront);

        const railBack = new THREE.Mesh(railGeo, railMat);
        railBack.position.set(0, 1.1, -2.8);
        group.add(railBack);

        return group;
    }

    createDock() {
        const group = new THREE.Group();
        const deckMat = new THREE.MeshStandardMaterial({
            color: 0x8B6B4A,
            roughness: 0.9
        });
        const postMat = new THREE.MeshStandardMaterial({
            color: 0x4E3620,
            roughness: 0.9
        });

        const deckGeo = new THREE.BoxGeometry(6, 0.3, 3);
        const deck = new THREE.Mesh(deckGeo, deckMat);
        deck.position.y = 0.2;
        deck.castShadow = true;
        group.add(deck);

        const postGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.2, 6);
        for (let i = 0; i < 4; i++) {
            const post = new THREE.Mesh(postGeo, postMat);
            post.position.set(i < 2 ? -2.5 : 2.5, 0.6, i % 2 === 0 ? -1 : 1);
            post.castShadow = true;
            group.add(post);
        }

        return group;
    }

    createShip() {
        const group = new THREE.Group();
        const hullMat = new THREE.MeshStandardMaterial({
            color: 0x7B4A12,
            roughness: 0.8
        });
        const sailMat = new THREE.MeshStandardMaterial({
            color: 0xF5F5DC,
            side: THREE.DoubleSide,
            roughness: 0.8
        });
        const mastMat = new THREE.MeshStandardMaterial({
            color: 0x5A3B2E,
            roughness: 0.9
        });

        const hullGeo = new THREE.BoxGeometry(6, 1, 2);
        const hull = new THREE.Mesh(hullGeo, hullMat);
        hull.position.y = 0.6;
        hull.castShadow = true;
        group.add(hull);

        const bowGeo = new THREE.ConeGeometry(1, 2, 6);
        const bow = new THREE.Mesh(bowGeo, hullMat);
        bow.position.set(3.5, 0.6, 0);
        bow.rotation.z = Math.PI / 2;
        bow.castShadow = true;
        group.add(bow);

        const mastGeo = new THREE.CylinderGeometry(0.1, 0.1, 4, 6);
        const mast = new THREE.Mesh(mastGeo, mastMat);
        mast.position.y = 2.6;
        group.add(mast);

        const sailGeo = new THREE.PlaneGeometry(2.4, 2.2);
        const sail = new THREE.Mesh(sailGeo, sailMat);
        sail.position.set(0, 2.6, 0.8);
        group.add(sail);

        return group;
    }

    createMarketStalls(count, bounds) {
        const group = new THREE.Group();

        for (let i = 0; i < count; i++) {
            const stall = this.createMarketStall();
            const x = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
            const z = bounds.minZ + Math.random() * (bounds.maxZ - bounds.minZ);
            stall.position.set(x, 0, z);
            stall.rotation.y = Math.random() * Math.PI * 2;
            group.add(stall);
        }

        return group;
    }

    createMarketStall() {
        const group = new THREE.Group();
        const woodMat = new THREE.MeshStandardMaterial({
            color: 0x8B6B4A,
            roughness: 0.9
        });
        const clothMat = new THREE.MeshStandardMaterial({
            color: 0xFFD700,
            roughness: 0.8
        });

        const tableGeo = new THREE.BoxGeometry(2, 0.3, 1);
        const table = new THREE.Mesh(tableGeo, woodMat);
        table.position.y = 0.6;
        table.castShadow = true;
        group.add(table);

        const postGeo = new THREE.CylinderGeometry(0.07, 0.07, 1.5, 6);
        for (let i = 0; i < 4; i++) {
            const post = new THREE.Mesh(postGeo, woodMat);
            post.position.set(i < 2 ? -0.9 : 0.9, 1.1, i % 2 === 0 ? -0.4 : 0.4);
            post.castShadow = true;
            group.add(post);
        }

        const canopyGeo = new THREE.PlaneGeometry(2.4, 1.4);
        const canopy = new THREE.Mesh(canopyGeo, clothMat);
        canopy.rotation.x = -Math.PI / 2;
        canopy.position.y = 1.8;
        group.add(canopy);

        return group;
    }

    createMonument() {
        const group = new THREE.Group();
        const stoneMat = new THREE.MeshStandardMaterial({
            color: 0xC0C0C0,
            roughness: 0.8
        });
        const bronzeMat = new THREE.MeshStandardMaterial({
            color: 0xCD7F32,
            metalness: 0.6,
            roughness: 0.4
        });

        const baseGeo = new THREE.CylinderGeometry(3, 3.4, 1, 12);
        const base = new THREE.Mesh(baseGeo, stoneMat);
        base.position.y = 0.5;
        base.castShadow = true;
        group.add(base);

        const pillarGeo = new THREE.CylinderGeometry(0.9, 1.1, 4, 10);
        const pillar = new THREE.Mesh(pillarGeo, stoneMat);
        pillar.position.y = 3;
        pillar.castShadow = true;
        group.add(pillar);

        const statueGeo = new THREE.CylinderGeometry(0.5, 0.7, 2.5, 8);
        const statue = new THREE.Mesh(statueGeo, bronzeMat);
        statue.position.y = 5.2;
        statue.castShadow = true;
        group.add(statue);

        const headGeo = new THREE.SphereGeometry(0.5, 8, 8);
        const head = new THREE.Mesh(headGeo, bronzeMat);
        head.position.y = 6.8;
        group.add(head);

        return group;
    }

    createBackgroundHills(radius, count) {
        const group = new THREE.Group();
        const hillMat = new THREE.MeshStandardMaterial({
            color: 0x3B5A3B,
            roughness: 0.9
        });

        for (let i = 0; i < count; i++) {
            const size = 18 + Math.random() * 16;
            const hillGeo = new THREE.SphereGeometry(size, 10, 10);
            const hill = new THREE.Mesh(hillGeo, hillMat);
            const angle = (i / count) * Math.PI * 2;
            const spread = radius + Math.random() * 25;
            hill.position.set(
                Math.cos(angle) * spread,
                -10 + Math.random() * 4,
                Math.sin(angle) * spread
            );
            hill.scale.y = 0.4 + Math.random() * 0.4;
            hill.castShadow = true;
            group.add(hill);
        }

        return group;
    }

    createRuinsField(areaSize, count) {
        const group = new THREE.Group();
        const half = areaSize / 2;
        const stoneMat = new THREE.MeshStandardMaterial({
            color: 0x8B8B8B,
            roughness: 0.9
        });
        const rubbleMat = new THREE.MeshStandardMaterial({
            color: 0x6E6E6E,
            roughness: 0.9
        });

        for (let i = 0; i < count; i++) {
            const x = (Math.random() * areaSize) - half;
            const z = (Math.random() * areaSize) - half;
            const roll = Math.random();

            if (roll < 0.4) {
                const wallGeo = new THREE.BoxGeometry(6 + Math.random() * 6, 1.5 + Math.random() * 2, 1);
                const wall = new THREE.Mesh(wallGeo, stoneMat);
                wall.position.set(x, 0.8, z);
                wall.rotation.y = Math.random() * Math.PI;
                wall.rotation.z = (Math.random() - 0.5) * 0.3;
                wall.castShadow = true;
                group.add(wall);
            } else if (roll < 0.7) {
                const columnGeo = new THREE.CylinderGeometry(0.5, 0.7, 4 + Math.random() * 3, 6);
                const column = new THREE.Mesh(columnGeo, stoneMat);
                column.position.set(x, 2.2, z);
                column.rotation.z = (Math.random() - 0.5) * 0.4;
                column.castShadow = true;
                group.add(column);
            } else {
                const rubbleGeo = new THREE.DodecahedronGeometry(0.7 + Math.random() * 0.8, 0);
                const rubble = new THREE.Mesh(rubbleGeo, rubbleMat);
                rubble.position.set(x, 0.4, z);
                rubble.rotation.set(
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                );
                rubble.castShadow = true;
                group.add(rubble);
            }
        }

        return group;
    }

    createDetailedCastle() {
        const group = new THREE.Group();

        // Main tower (taller)
        const towerGeo = new THREE.CylinderGeometry(6, 7, 28, 8);
        const towerMat = new THREE.MeshStandardMaterial({
            color: 0xD3D3D3,
            roughness: 0.8
        });
        const tower = new THREE.Mesh(towerGeo, towerMat);
        tower.position.y = 14;
        tower.castShadow = true;
        group.add(tower);

        // Castle roof
        const roofGeo = new THREE.ConeGeometry(7, 8, 8);
        const roofMat = new THREE.MeshStandardMaterial({ color: 0x8B0000 });
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.y = 30;
        group.add(roof);

        // 8 side towers
        const towerCount = 8;
        const towerRadius = 16;
        for (let i = 0; i < towerCount; i++) {
            const angle = (i / towerCount) * Math.PI * 2;
            const x = Math.cos(angle) * towerRadius;
            const z = Math.sin(angle) * towerRadius;

            const sideTowerGeo = new THREE.CylinderGeometry(3, 3.5, 16, 8);
            const sideTower = new THREE.Mesh(sideTowerGeo, towerMat);
            sideTower.position.set(x, 8, z);
            sideTower.castShadow = true;
            group.add(sideTower);

            const sideRoofGeo = new THREE.ConeGeometry(3.5, 5, 8);
            const sideRoof = new THREE.Mesh(sideRoofGeo, roofMat);
            sideRoof.position.set(x, 17.5, z);
            group.add(sideRoof);
        }

        // Castle walls connecting towers
        for (let i = 0; i < towerCount; i++) {
            const angle1 = (i / towerCount) * Math.PI * 2;
            const angle2 = ((i + 1) / towerCount) * Math.PI * 2;
            const midAngle = (angle1 + angle2) / 2;
            const wallRadius = 13;
            const x = Math.cos(midAngle) * wallRadius;
            const z = Math.sin(midAngle) * wallRadius;

            const wallGeo = new THREE.BoxGeometry(5, 10, 0.8);
            const wall = new THREE.Mesh(wallGeo, towerMat);
            wall.position.set(x, 5, z);
            wall.rotation.y = midAngle;
            wall.castShadow = true;
            group.add(wall);
        }

        return group;
    }

    createBuilding() {
        const group = new THREE.Group();

        const height = 4 + Math.random() * 8;
        const width = 3 + Math.random() * 3;

        const buildingGeo = new THREE.BoxGeometry(width, height, width);
        const buildingMat = new THREE.MeshStandardMaterial({
            color: Math.random() > 0.5 ? 0xD2B48C : 0xA0522D,
            roughness: 0.8
        });
        const building = new THREE.Mesh(buildingGeo, buildingMat);
        building.position.y = height / 2;
        building.castShadow = true;
        group.add(building);

        // Roof
        const roofGeo = new THREE.ConeGeometry(width * 0.7, width * 0.5, 4);
        const roofMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.y = height + width * 0.25;
        roof.rotation.y = Math.PI / 4;
        group.add(roof);

        return group;
    }

    createPerson() {
        const group = new THREE.Group();

        // Simple person (small cylinder)
        const bodyGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.8, 6);
        const bodyMat = new THREE.MeshStandardMaterial({
            color: Math.random() > 0.5 ? 0x4169E1 : 0x8B0000
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.4;
        group.add(body);

        // Head
        const headGeo = new THREE.SphereGeometry(0.2, 8, 8);
        const headMat = new THREE.MeshStandardMaterial({ color: 0xFFDBAC });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 1;
        group.add(head);

        return group;
    }

    // Scene 3: Darkness and Monster Attack
    playScene3() {
        this.currentScene = 3;

        // Darken scene
        this.scene.background = new THREE.Color(0x1a1a1a);

        this.showText('But darkness came... and terrible beasts marched on the kingdom!', 4000, () => {
            setTimeout(() => this.playScene4(), 1000);
        });
    }

    // Scene 4: Giant Monsters Attack from Outside
    playScene4() {
        this.currentScene = 4;

        // Make scene very dark
        this.scene.background = new THREE.Color(0x0a0a0a);

        // Create HUGE monsters attacking from outside
        this.createGiantMonstersAttacking();

        const ruins = this.createRuinsField(140, 32);
        if (this.empire) {
            this.empire.add(ruins);
        } else {
            this.scene.add(ruins);
            this.introObjects.push(ruins);
        }

        // Camera pans to show scale
        this.animateCamera(
            { x: 80, y: 50, z: 80 },
            { x: 0, y: 10, z: 0 },
            3000
        );

        this.showText('Massive beasts laid siege to the kingdom!', 5000, () => {
            setTimeout(() => this.playScene5(), 1000);
        });
    }

    createGiantMonstersAttacking() {
        // Create 3 HUGE boss monsters outside the kingdom
        const monsterPositions = [
            { x: -120, z: 0, angle: 0 },
            { x: 90, z: -120, angle: Math.PI / 3 },
            { x: 90, z: 120, angle: -Math.PI / 3 }
        ];

        monsterPositions.forEach((pos) => {
            const monster = this.createGiantMonster();
            monster.position.set(pos.x, 0, pos.z);
            monster.rotation.y = pos.angle;
            this.scene.add(monster);
            this.introObjects.push(monster);
        });

        // Add destruction effects
        this.addDestructionEffects();
    }

    createGiantMonster() {
        const group = new THREE.Group();

        // HUGE body (10x scale)
        const bodyGeo = new THREE.BoxGeometry(8, 15, 8);
        const bodyMat = new THREE.MeshStandardMaterial({
            color: 0x000000,
            emissive: 0xff0000,
            emissiveIntensity: 0.5,
            roughness: 0.8
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 7.5;
        body.castShadow = true;
        group.add(body);

        // HUGE head
        const headGeo = new THREE.SphereGeometry(4, 16, 16);
        const headMat = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            emissive: 0xff0000,
            emissiveIntensity: 0.3
        });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 18;
        head.castShadow = true;
        group.add(head);

        // MASSIVE glowing eyes
        const eyeGeo = new THREE.SphereGeometry(1, 16, 16);
        const eyeMat = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 2.0
        });

        const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
        leftEye.position.set(-1.5, 18, 3);
        group.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
        rightEye.position.set(1.5, 18, 3);
        group.add(rightEye);

        // HUGE horns
        const hornGeo = new THREE.ConeGeometry(1.5, 6, 8);
        const hornMat = new THREE.MeshStandardMaterial({
            color: 0x1C1C1C,
            metalness: 0.7
        });

        const leftHorn = new THREE.Mesh(hornGeo, hornMat);
        leftHorn.position.set(-3, 21, 0);
        leftHorn.rotation.z = -0.5;
        leftHorn.castShadow = true;
        group.add(leftHorn);

        const rightHorn = new THREE.Mesh(hornGeo, hornMat);
        rightHorn.position.set(3, 21, 0);
        rightHorn.rotation.z = 0.5;
        rightHorn.castShadow = true;
        group.add(rightHorn);

        // Jagged jaw and fangs
        const jawGeo = new THREE.BoxGeometry(6, 2, 5);
        const jawMat = new THREE.MeshStandardMaterial({
            color: 0x0f0f0f,
            roughness: 0.9
        });
        const jaw = new THREE.Mesh(jawGeo, jawMat);
        jaw.position.set(0, 14, 4);
        jaw.castShadow = true;
        group.add(jaw);

        const fangGeo = new THREE.ConeGeometry(0.4, 1.2, 4);
        const fangMat = new THREE.MeshStandardMaterial({
            color: 0xEEEEEE,
            roughness: 0.4
        });
        for (let i = 0; i < 6; i++) {
            const fang = new THREE.Mesh(fangGeo, fangMat);
            fang.position.set(-2.5 + i * 1.0, 13, 6.2);
            fang.rotation.x = Math.PI;
            fang.castShadow = true;
            group.add(fang);
        }

        // Back spikes
        const spikeGeo = new THREE.ConeGeometry(0.6, 3, 6);
        const spikeMat = new THREE.MeshStandardMaterial({
            color: 0x1C1C1C,
            roughness: 0.8
        });
        for (let i = 0; i < 6; i++) {
            const spike = new THREE.Mesh(spikeGeo, spikeMat);
            spike.position.set(0, 6 + i * 2.2, -4);
            spike.rotation.x = Math.PI / 8;
            spike.castShadow = true;
            group.add(spike);
        }

        // Massive arms
        const armGeo = new THREE.CylinderGeometry(2, 2.5, 12, 8);
        const armMat = new THREE.MeshStandardMaterial({
            color: 0x2F2F2F,
            roughness: 0.9
        });

        const leftArm = new THREE.Mesh(armGeo, armMat);
        leftArm.position.set(-6, 8, 0);
        leftArm.rotation.z = Math.PI / 6;
        leftArm.castShadow = true;
        group.add(leftArm);

        const rightArm = new THREE.Mesh(armGeo, armMat);
        rightArm.position.set(6, 8, 0);
        rightArm.rotation.z = -Math.PI / 6;
        rightArm.castShadow = true;
        group.add(rightArm);

        // Clawed hands
        const handGeo = new THREE.SphereGeometry(1, 8, 8);
        const handMat = new THREE.MeshStandardMaterial({
            color: 0x1C1C1C,
            roughness: 0.8
        });
        const leftHand = new THREE.Mesh(handGeo, handMat);
        leftHand.position.set(-8, 4, 2);
        leftHand.castShadow = true;
        group.add(leftHand);

        const rightHand = new THREE.Mesh(handGeo, handMat);
        rightHand.position.set(8, 4, 2);
        rightHand.castShadow = true;
        group.add(rightHand);

        const clawGeo = new THREE.ConeGeometry(0.3, 1.5, 4);
        const clawMat = new THREE.MeshStandardMaterial({
            color: 0xDDDDDD,
            roughness: 0.3
        });
        const clawOffsets = [-0.5, 0, 0.5];
        clawOffsets.forEach(offset => {
            const leftClaw = new THREE.Mesh(clawGeo, clawMat);
            leftClaw.position.set(-8 + offset, 3.6, 3.2);
            leftClaw.rotation.x = -Math.PI / 2;
            leftClaw.castShadow = true;
            group.add(leftClaw);

            const rightClaw = new THREE.Mesh(clawGeo, clawMat);
            rightClaw.position.set(8 + offset, 3.6, 3.2);
            rightClaw.rotation.x = -Math.PI / 2;
            rightClaw.castShadow = true;
            group.add(rightClaw);
        });

        // Red aura
        const auraGeo = new THREE.RingGeometry(8, 10, 32);
        const auraMat = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
        });
        const aura = new THREE.Mesh(auraGeo, auraMat);
        aura.rotation.x = -Math.PI / 2;
        aura.position.y = 0.1;
        group.add(aura);

        return group;
    }

    addDestructionEffects() {
        // Create fire and smoke
        for (let i = 0; i < 30; i++) {
            const fireGeo = new THREE.SphereGeometry(1, 8, 8);
            const fireMat = new THREE.MeshBasicMaterial({
                color: 0xff4500,
                transparent: true,
                opacity: 0.7
            });
            const fire = new THREE.Mesh(fireGeo, fireMat);
            fire.position.set(
                (Math.random() - 0.5) * 160,
                Math.random() * 25,
                (Math.random() - 0.5) * 160
            );
            this.scene.add(fire);
            this.introObjects.push(fire);
        }
    }

    // Scene 5: House and Sword
    playScene5() {
        this.currentScene = 5;
        this.clearScene();

        // Reset to lighter scene
        this.scene.background = new THREE.Color(0x87ceeb);

        // Create simple house
        this.createHouse();

        // Camera inside house looking at sword
        this.camera.position.set(0, 3, 8);
        this.camera.lookAt(0, 2, 0);

        this.showText('Seeing the kingdom fall, the being rushed home for a simple sword...', 4500, () => {
            setTimeout(() => this.playScene6(), 1000);
        });
    }

    createHouse() {
        const group = new THREE.Group();

        // House floor and walls (open front)
        const wallMat = new THREE.MeshStandardMaterial({
            color: 0xD2B48C,
            roughness: 0.9,
            side: THREE.DoubleSide
        });

        const floorGeo = new THREE.BoxGeometry(12, 0.4, 12);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0xC2B280,
            roughness: 0.9
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.position.y = 0.2;
        floor.receiveShadow = true;
        group.add(floor);

        const backWallGeo = new THREE.BoxGeometry(12, 6, 0.4);
        const backWall = new THREE.Mesh(backWallGeo, wallMat);
        backWall.position.set(0, 3, -6);
        backWall.castShadow = true;
        group.add(backWall);

        const sideWallGeo = new THREE.BoxGeometry(0.4, 6, 12);
        const leftWall = new THREE.Mesh(sideWallGeo, wallMat);
        leftWall.position.set(-6, 3, 0);
        leftWall.castShadow = true;
        group.add(leftWall);

        const rightWall = new THREE.Mesh(sideWallGeo, wallMat);
        rightWall.position.set(6, 3, 0);
        rightWall.castShadow = true;
        group.add(rightWall);

        // Roof
        const roofGeo = new THREE.ConeGeometry(9, 4, 4);
        const roofMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.y = 8;
        roof.rotation.y = Math.PI / 4;
        group.add(roof);

        // Old sword hanging on wall (NOT magical, just regular)
        const swordGroup = new THREE.Group();

        const bladeGeo = new THREE.BoxGeometry(0.15, 2, 0.05);
        const bladeMat = new THREE.MeshStandardMaterial({
            color: 0x808080, // Dull gray, not shiny
            metalness: 0.3,
            roughness: 0.9
        });
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.y = 1;
        swordGroup.add(blade);

        const handleGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.4, 8);
        const handleMat = new THREE.MeshStandardMaterial({
            color: 0x654321,
            roughness: 0.9
        });
        const handle = new THREE.Mesh(handleGeo, handleMat);
        swordGroup.add(handle);

        const guardGeo = new THREE.BoxGeometry(0.4, 0.06, 0.1);
        const guard = new THREE.Mesh(guardGeo, handleMat);
        guard.position.y = 0.2;
        swordGroup.add(guard);

        swordGroup.position.set(0, 3.8, -5.2);
        swordGroup.rotation.z = Math.PI / 6;
        group.add(swordGroup);
        this.oldSword = swordGroup;

        this.scene.add(group);
        this.introObjects.push(group);
    }

    // Scene 6: Grab Sword and Jump
    playScene6() {
        this.currentScene = 6;

        this.showText('An old sword waited on the wall...', 3000, () => {
            setTimeout(() => this.playScene7(), 1000);
        });
    }

    // Scene 7: Jump Down
    playScene7() {
        this.currentScene = 7;

        // Sword moves toward camera (grabbed)
        if (this.oldSword) {
            const startZ = this.oldSword.position.z;
            const duration = 1000;
            const startTime = this.time;

            const animate = () => {
                if (!this.isPlaying) return;
                const elapsed = this.time - startTime;
                const progress = Math.min(elapsed / duration, 1);

                this.oldSword.position.z = startZ + progress * 10;
                this.oldSword.rotation.z = Math.PI / 6 + progress * Math.PI;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.startJumpAndRebirth();
                }
            };
            animate();
        }

        this.showText('They seized the sword and leaped into the storm!', 1500);
    }

    flashTransition() {
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.background = 'white';
        flash.style.zIndex = '9999';
        flash.style.opacity = '0';
        flash.style.transition = 'opacity 0.5s';
        document.body.appendChild(flash);

        setTimeout(() => {
            flash.style.opacity = '1';
        }, 100);

        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(flash);
                this.end();
            }, 500);
        }, 1000);
    }

    startJumpAndRebirth() {
        this.clearScene();

        this.scene.background = new THREE.Color(0x6F87A8);

        // Ground for landing
        const groundGeo = new THREE.PlaneGeometry(80, 80);
        const groundMat = new THREE.MeshStandardMaterial({
            color: 0x556B2F,
            roughness: 0.9
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        this.introObjects.push(ground);

        // Camera framing the fall
        this.camera.position.set(0, 18, 25);
        this.camera.lookAt(0, 2, 0);

        // Falling light
        const lightGeo = new THREE.SphereGeometry(1, 16, 16);
        const lightMat = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.9
        });
        const fallingLight = new THREE.Mesh(lightGeo, lightMat);
        fallingLight.position.set(0, 20, 0);
        this.scene.add(fallingLight);
        this.introObjects.push(fallingLight);
        this.fallingLight = fallingLight;

        // Shimmering trail
        const shimmerParticles = [];
        const particleGeo = new THREE.SphereGeometry(0.2, 6, 6);
        for (let i = 0; i < 30; i++) {
            const particleMat = new THREE.MeshBasicMaterial({
                color: 0xFFFFFF,
                transparent: true,
                opacity: 0.8
            });
            const particle = new THREE.Mesh(particleGeo, particleMat);
            particle.userData = {
                offset: new THREE.Vector3(
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2
                ),
                phase: Math.random() * Math.PI * 2
            };
            this.scene.add(particle);
            this.introObjects.push(particle);
            shimmerParticles.push(particle);
        }
        this.shimmerParticles = shimmerParticles;

        this.showText('He leaped, his body shattered into light...', 3000);

        const startTime = this.time;
        const duration = 1800;
        const startY = 20;
        const endY = 1.5;

        const animate = () => {
            if (!this.isPlaying) return;
            const elapsed = this.time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 2);

            fallingLight.position.y = startY + (endY - startY) * eased;
            fallingLight.material.opacity = 0.9 - progress * 0.4;

            shimmerParticles.forEach(particle => {
                const wobble = Math.sin(elapsed * 0.006 + particle.userData.phase) * 0.5;
                particle.position.x = fallingLight.position.x + particle.userData.offset.x + wobble;
                particle.position.y = fallingLight.position.y + particle.userData.offset.y + wobble;
                particle.position.z = fallingLight.position.z + particle.userData.offset.z + wobble;
                particle.material.opacity = 0.8 - progress * 0.6;
            });

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.spawnHumanHero();
            }
        };
        animate();
    }

    spawnHumanHero() {
        if (!this.isPlaying) return;

        if (this.fallingLight) {
            this.scene.remove(this.fallingLight);
            this.fallingLight = null;
        }
        if (this.shimmerParticles) {
            this.shimmerParticles.forEach(particle => this.scene.remove(particle));
            this.shimmerParticles = null;
        }

        const hero = this.createHumanHero();
        hero.position.set(0, 0, 0);
        this.scene.add(hero);
        this.introObjects.push(hero);

        this.createLandingShimmer(new THREE.Vector3(0, 0, 0));

        this.showText('Reborn as a human, he landed in the realm below.', 2500);
        setTimeout(() => this.end(), 2600);
    }

    createLandingShimmer(position) {
        const ringGeo = new THREE.RingGeometry(0.6, 1.4, 24);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(position.x, 0.1, position.z);
        this.scene.add(ring);
        this.introObjects.push(ring);

        const startTime = this.time;
        const duration = 800;
        const animate = () => {
            if (!this.isPlaying) return;
            const elapsed = this.time - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const scale = 1 + progress * 3;
            ring.scale.set(scale, scale, 1);
            ring.material.opacity = 0.8 * (1 - progress);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(ring);
            }
        };
        animate();
    }

    createHumanHero() {
        const group = new THREE.Group();

        const torsoGeo = new THREE.CylinderGeometry(0.5, 0.6, 1.6, 8);
        const torsoMat = new THREE.MeshStandardMaterial({
            color: 0xFFD700,
            roughness: 0.6
        });
        const torso = new THREE.Mesh(torsoGeo, torsoMat);
        torso.position.y = 1.3;
        group.add(torso);

        const headGeo = new THREE.SphereGeometry(0.4, 16, 16);
        const headMat = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            roughness: 0.7
        });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 2.4;
        group.add(head);

        const armGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.0, 8);
        const armMat = new THREE.MeshStandardMaterial({
            color: 0xFFD700,
            roughness: 0.6
        });

        const leftArm = new THREE.Mesh(armGeo, armMat);
        leftArm.position.set(-0.7, 1.2, 0);
        group.add(leftArm);

        const rightArm = new THREE.Mesh(armGeo, armMat);
        rightArm.position.set(0.7, 1.2, 0);
        group.add(rightArm);

        const legGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.0, 8);
        const legMat = new THREE.MeshStandardMaterial({
            color: 0xFFD700,
            roughness: 0.8
        });

        const leftLeg = new THREE.Mesh(legGeo, legMat);
        leftLeg.position.set(-0.2, 0.5, 0);
        group.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeo, legMat);
        rightLeg.position.set(0.2, 0.5, 0);
        group.add(rightLeg);

        const capeGeo = new THREE.PlaneGeometry(1.4, 1.8);
        const capeMat = new THREE.MeshStandardMaterial({
            color: 0xDC143C,
            side: THREE.DoubleSide,
            roughness: 0.8
        });
        const cape = new THREE.Mesh(capeGeo, capeMat);
        cape.position.set(0, 1.2, -0.7);
        group.add(cape);

        const swordGroup = new THREE.Group();
        const bladeGeo = new THREE.BoxGeometry(0.1, 1.2, 0.04);
        const bladeMat = new THREE.MeshStandardMaterial({
            color: 0xC0C0C0,
            metalness: 0.5,
            roughness: 0.6
        });
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.y = 0.6;
        swordGroup.add(blade);

        const handleGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.4, 8);
        const handleMat = new THREE.MeshStandardMaterial({
            color: 0x654321,
            roughness: 0.8
        });
        const handle = new THREE.Mesh(handleGeo, handleMat);
        handle.position.y = 0.1;
        swordGroup.add(handle);

        const guardGeo = new THREE.BoxGeometry(0.3, 0.06, 0.1);
        const guard = new THREE.Mesh(guardGeo, handleMat);
        guard.position.y = 0.3;
        swordGroup.add(guard);

        swordGroup.position.set(0.9, 1.0, 0.1);
        swordGroup.rotation.z = -Math.PI / 4;
        group.add(swordGroup);

        return group;
    }

    animateCamera(targetPos, lookAtPos, duration) {
        const startPos = {
            x: this.camera.position.x,
            y: this.camera.position.y,
            z: this.camera.position.z
        };
        const startTime = this.time;

        const animate = () => {
            if (!this.isPlaying) return;
            const elapsed = this.time - startTime;
            const progress = Math.min(elapsed / duration, 1);

            this.camera.position.x = startPos.x + (targetPos.x - startPos.x) * progress;
            this.camera.position.y = startPos.y + (targetPos.y - startPos.y) * progress;
            this.camera.position.z = startPos.z + (targetPos.z - startPos.z) * progress;
            this.camera.lookAt(lookAtPos.x, lookAtPos.y, lookAtPos.z);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        animate();
    }

    clearScene() {
        // Remove all intro objects
        this.introObjects.forEach(obj => {
            if (obj.traverse) {
                obj.traverse(child => {
                    if (child.geometry) {
                        child.geometry.dispose();
                    }
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(material => material.dispose());
                        } else {
                            child.material.dispose();
                        }
                    }
                });
            }
            this.scene.remove(obj);
        });
        this.introObjects = [];
    }

    skip() {
        this.end();
    }

    end() {
        this.isPlaying = false;
        this.clearScene();

        // Remove skip button
        if (this.skipButton) {
            document.body.removeChild(this.skipButton);
        }

        // Remove space handler
        if (this.spaceHandler) {
            document.removeEventListener('keydown', this.spaceHandler);
        }

        // Reset scene
        this.scene.background = new THREE.Color(0x87ceeb);

        // Show game UI
        document.getElementById('ui-overlay').style.display = 'block';

        // Call completion callback
        if (this.onComplete) {
            this.onComplete();
        }
    }

    startClock() {
        if (this.ticking) return;
        this.ticking = true;

        const tick = (now) => {
            if (!this.isPlaying) {
                this.ticking = false;
                return;
            }

            if (!this.lastFrameTime) {
                this.lastFrameTime = now;
            }

            const delta = now - this.lastFrameTime;
            this.lastFrameTime = now;
            this.time += delta;

            requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    }
}
