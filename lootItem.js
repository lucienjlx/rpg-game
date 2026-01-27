class LootItem {
    constructor(scene, x, z, itemId, lootData) {
        this.scene = scene;
        this.itemId = itemId;
        this.lootData = lootData;
        this.pickedUp = false;
        this.bobTime = Math.random() * Math.PI * 2; // Random start phase for bobbing
        this.glowTime = Math.random() * Math.PI * 2;
        this.glowRing = null;
        this.sparkleGroup = null;
        this.baseGlowOpacity = this.getGlowOpacity();

        this.createMesh(x, z);
    }

    createMesh(x, z) {
        this.mesh = new THREE.Group();

        const itemName = (this.lootData.name || '').toLowerCase();
        let lootMesh = null;

        if (itemName.includes('potion')) {
            lootMesh = this.createPotionMesh();
        } else if (itemName.includes('essence')) {
            lootMesh = this.createEssenceMesh();
        } else if (itemName.includes('ore')) {
            lootMesh = this.createOreMesh();
        } else if (itemName.includes('crystal') || itemName.includes('shard') || itemName.includes('fragment')) {
            lootMesh = this.createCrystalMesh();
        } else if (itemName.includes('scrap') || itemName.includes('plate') || itemName.includes('wood')) {
            lootMesh = this.createBundleMesh();
        } else {
            lootMesh = this.createDefaultMesh();
        }

        this.mesh.add(lootMesh);

        // Add a glow ring
        const ringGeometry = new THREE.RingGeometry(0.45, 0.65, 24);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: this.lootData.color,
            transparent: true,
            opacity: this.baseGlowOpacity,
            side: THREE.DoubleSide
        });
        this.glowRing = new THREE.Mesh(ringGeometry, ringMaterial);
        this.glowRing.rotation.x = -Math.PI / 2;
        this.glowRing.position.y = -0.3;
        this.mesh.add(this.glowRing);

        // Position loot
        this.mesh.position.set(x, 0.5, z);

        this.scene.add(this.mesh);
    }

    getGlowOpacity() {
        if (this.lootData.rarity === 'rare') {
            return 0.45;
        }
        if (this.lootData.rarity === 'uncommon') {
            return 0.35;
        }
        return 0.25;
    }

    createPotionMesh() {
        const bottleGroup = new THREE.Group();
        const bottleMat = new THREE.MeshStandardMaterial({
            color: this.lootData.color,
            emissive: this.lootData.color,
            emissiveIntensity: 0.5,
            metalness: 0.2,
            roughness: 0.4,
            transparent: true,
            opacity: 0.9
        });

        const bottleGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.45, 12);
        const bottle = new THREE.Mesh(bottleGeo, bottleMat);
        bottle.position.y = 0.1;
        bottleGroup.add(bottle);

        const neckGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.15, 12);
        const neck = new THREE.Mesh(neckGeo, bottleMat);
        neck.position.y = 0.4;
        bottleGroup.add(neck);

        const liquidGeo = new THREE.CylinderGeometry(0.13, 0.17, 0.25, 12);
        const liquidMat = new THREE.MeshStandardMaterial({
            color: this.lootData.color,
            emissive: this.lootData.color,
            emissiveIntensity: 0.7,
            transparent: true,
            opacity: 0.7,
            roughness: 0.2,
            metalness: 0.1
        });
        const liquid = new THREE.Mesh(liquidGeo, liquidMat);
        liquid.position.y = 0.08;
        bottleGroup.add(liquid);

        const corkGeo = new THREE.SphereGeometry(0.1, 8, 8);
        const corkMat = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.8
        });
        const cork = new THREE.Mesh(corkGeo, corkMat);
        cork.position.y = 0.52;
        bottleGroup.add(cork);

        return bottleGroup;
    }

    createEssenceMesh() {
        const group = new THREE.Group();

        const orbGeo = new THREE.SphereGeometry(0.28, 16, 16);
        const orbMat = new THREE.MeshStandardMaterial({
            color: this.lootData.color,
            emissive: this.lootData.color,
            emissiveIntensity: 1.0,
            transparent: true,
            opacity: 0.9,
            roughness: 0.2,
            metalness: 0.2
        });
        const orb = new THREE.Mesh(orbGeo, orbMat);
        group.add(orb);

        const haloGeo = new THREE.RingGeometry(0.2, 0.45, 24);
        const haloMat = new THREE.MeshBasicMaterial({
            color: this.lootData.color,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide
        });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.rotation.x = Math.PI / 2;
        halo.rotation.z = Math.PI / 6;
        group.add(halo);

        const sparkleGroup = new THREE.Group();
        const sparkleGeo = new THREE.SphereGeometry(0.05, 8, 8);
        const sparkleMat = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.9
        });
        for (let i = 0; i < 4; i++) {
            const sparkle = new THREE.Mesh(sparkleGeo, sparkleMat);
            const angle = (i / 4) * Math.PI * 2;
            sparkle.position.set(Math.cos(angle) * 0.45, 0.1, Math.sin(angle) * 0.45);
            sparkleGroup.add(sparkle);
        }
        this.sparkleGroup = sparkleGroup;
        group.add(sparkleGroup);

        return group;
    }

    createOreMesh() {
        const group = new THREE.Group();
        const rockMat = new THREE.MeshStandardMaterial({
            color: this.lootData.color,
            emissive: this.lootData.color,
            emissiveIntensity: 0.2,
            metalness: 0.8,
            roughness: 0.5
        });

        for (let i = 0; i < 4; i++) {
            const rockGeo = new THREE.DodecahedronGeometry(0.18 + Math.random() * 0.08, 0);
            const rock = new THREE.Mesh(rockGeo, rockMat);
            rock.position.set(
                (Math.random() - 0.5) * 0.4,
                0.05 + Math.random() * 0.15,
                (Math.random() - 0.5) * 0.4
            );
            rock.rotation.set(Math.random(), Math.random(), Math.random());
            group.add(rock);
        }

        return group;
    }

    createCrystalMesh() {
        const group = new THREE.Group();
        const shardMat = new THREE.MeshStandardMaterial({
            color: this.lootData.color,
            emissive: this.lootData.color,
            emissiveIntensity: 0.6,
            metalness: 0.4,
            roughness: 0.3
        });

        for (let i = 0; i < 5; i++) {
            const shardGeo = new THREE.ConeGeometry(0.12 + Math.random() * 0.08, 0.6 + Math.random() * 0.3, 6);
            const shard = new THREE.Mesh(shardGeo, shardMat);
            shard.position.set(
                (Math.random() - 0.5) * 0.4,
                0.2 + Math.random() * 0.2,
                (Math.random() - 0.5) * 0.4
            );
            shard.rotation.y = Math.random() * Math.PI * 2;
            group.add(shard);
        }

        return group;
    }

    createBundleMesh() {
        const group = new THREE.Group();
        const bundleMat = new THREE.MeshStandardMaterial({
            color: this.lootData.color,
            roughness: 0.9
        });

        for (let i = 0; i < 3; i++) {
            const plankGeo = new THREE.BoxGeometry(0.45, 0.08, 0.2);
            const plank = new THREE.Mesh(plankGeo, bundleMat);
            plank.position.set(0, 0.05 + i * 0.08, (i - 1) * 0.05);
            plank.rotation.y = (i - 1) * 0.1;
            group.add(plank);
        }

        const strapGeo = new THREE.BoxGeometry(0.48, 0.02, 0.08);
        const strapMat = new THREE.MeshStandardMaterial({
            color: 0x3B2F2F,
            roughness: 0.9
        });
        const strap = new THREE.Mesh(strapGeo, strapMat);
        strap.position.set(0, 0.18, 0);
        group.add(strap);

        return group;
    }

    createDefaultMesh() {
        let geometry;
        if (this.lootData.rarity === 'rare') {
            geometry = new THREE.SphereGeometry(0.3, 16, 16);
        } else if (this.lootData.rarity === 'uncommon') {
            geometry = new THREE.OctahedronGeometry(0.3, 0);
        } else {
            geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        }

        const material = new THREE.MeshStandardMaterial({
            color: this.lootData.color,
            emissive: this.lootData.color,
            emissiveIntensity: 0.4,
            metalness: 0.7,
            roughness: 0.3
        });

        return new THREE.Mesh(geometry, material);
    }

    update(delta) {
        if (this.pickedUp) return;

        // Rotate the loot
        this.mesh.rotation.y += delta * 2;

        // Bob up and down
        this.bobTime += delta * 3;
        this.mesh.position.y = 0.5 + Math.sin(this.bobTime) * 0.2;

        if (this.glowRing) {
            this.glowTime += delta * 3;
            this.glowRing.material.opacity =
                this.baseGlowOpacity + Math.sin(this.glowTime) * 0.08;
        }

        if (this.sparkleGroup) {
            this.sparkleGroup.rotation.y += delta * 2;
            this.sparkleGroup.rotation.z += delta * 1.5;
        }
    }

    checkPickup(playerPosition) {
        if (this.pickedUp) return false;

        const distance = Math.sqrt(
            Math.pow(playerPosition.x - this.mesh.position.x, 2) +
            Math.pow(playerPosition.z - this.mesh.position.z, 2)
        );

        if (distance < 2) {
            this.pickup();
            return true;
        }

        return false;
    }

    pickup() {
        this.pickedUp = true;
        this.scene.remove(this.mesh);
    }

    getPosition() {
        return this.mesh.position;
    }
}
