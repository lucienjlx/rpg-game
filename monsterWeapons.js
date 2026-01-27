class MonsterWeapons {
    static createWeapon(weaponType, color) {
        const weaponGroup = new THREE.Group();

        switch(weaponType) {
            case 'club':
                return this.createClub(weaponGroup, color);
            case 'axe':
                return this.createAxe(weaponGroup, color);
            case 'sword':
                return this.createSword(weaponGroup, color);
            case 'spear':
                return this.createSpear(weaponGroup, color);
            case 'hammer':
                return this.createHammer(weaponGroup, color);
            case 'scythe':
                return this.createScythe(weaponGroup, color);
            default:
                return null;
        }
    }

    static createClub(group, color) {
        // Wooden club - simple and brutal
        const handleGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8);
        const handleMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const handle = new THREE.Mesh(handleGeo, handleMat);
        handle.position.y = 0.4;
        group.add(handle);

        const headGeo = new THREE.SphereGeometry(0.15, 8, 8);
        const headMat = new THREE.MeshStandardMaterial({ color: 0x654321 });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 0.85;
        head.scale.set(1, 1.3, 1);
        group.add(head);

        return group;
    }

    static createAxe(group, color) {
        // Stone/metal axe
        const handleGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.9, 8);
        const handleMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const handle = new THREE.Mesh(handleGeo, handleMat);
        handle.position.y = 0.45;
        group.add(handle);

        const bladeGeo = new THREE.BoxGeometry(0.4, 0.3, 0.05);
        const bladeMat = new THREE.MeshStandardMaterial({
            color: color || 0x808080,
            metalness: 0.7,
            roughness: 0.3
        });
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.y = 0.95;
        group.add(blade);

        return group;
    }

    static createSword(group, color) {
        // Sword with blade and handle
        const bladeGeo = new THREE.BoxGeometry(0.08, 1.0, 0.04);
        const bladeMat = new THREE.MeshStandardMaterial({
            color: color || 0xC0C0C0,
            metalness: 0.9,
            roughness: 0.1,
            emissive: color || 0x000000,
            emissiveIntensity: 0.2
        });
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.y = 0.7;
        group.add(blade);

        const handleGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.3, 8);
        const handleMat = new THREE.MeshStandardMaterial({ color: 0x4A4A4A });
        const handle = new THREE.Mesh(handleGeo, handleMat);
        handle.position.y = 0.15;
        group.add(handle);

        const guardGeo = new THREE.BoxGeometry(0.3, 0.05, 0.05);
        const guardMat = new THREE.MeshStandardMaterial({ color: 0xFFD700 });
        const guard = new THREE.Mesh(guardGeo, guardMat);
        guard.position.y = 0.3;
        group.add(guard);

        return group;
    }

    static createSpear(group, color) {
        // Long spear with pointed tip
        const shaftGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8);
        const shaftMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const shaft = new THREE.Mesh(shaftGeo, shaftMat);
        shaft.position.y = 0.6;
        group.add(shaft);

        const tipGeo = new THREE.ConeGeometry(0.1, 0.3, 8);
        const tipMat = new THREE.MeshStandardMaterial({
            color: color || 0x808080,
            metalness: 0.8,
            roughness: 0.2
        });
        const tip = new THREE.Mesh(tipGeo, tipMat);
        tip.position.y = 1.35;
        group.add(tip);

        return group;
    }

    static createHammer(group, color) {
        // Heavy hammer
        const handleGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.8, 8);
        const handleMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const handle = new THREE.Mesh(handleGeo, handleMat);
        handle.position.y = 0.4;
        group.add(handle);

        const headGeo = new THREE.BoxGeometry(0.3, 0.25, 0.25);
        const headMat = new THREE.MeshStandardMaterial({
            color: color || 0x696969,
            metalness: 0.8,
            roughness: 0.4
        });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 0.95;
        group.add(head);

        return group;
    }

    static createScythe(group, color) {
        // Curved scythe
        const handleGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.0, 8);
        const handleMat = new THREE.MeshStandardMaterial({ color: 0x4A4A4A });
        const handle = new THREE.Mesh(handleGeo, handleMat);
        handle.position.y = 0.5;
        group.add(handle);

        const bladeGeo = new THREE.BoxGeometry(0.5, 0.15, 0.03);
        const bladeMat = new THREE.MeshStandardMaterial({
            color: color || 0x8B008B,
            metalness: 0.9,
            roughness: 0.1,
            emissive: color || 0x000000,
            emissiveIntensity: 0.3
        });
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.set(0.2, 1.0, 0);
        blade.rotation.z = Math.PI / 6;
        group.add(blade);

        return group;
    }

    static getWeaponForZone(zoneId) {
        const weaponConfigs = {
            1: { type: 'club', color: 0x8B4513, damage: 5 },
            2: { type: 'axe', color: 0xCD7F32, damage: 15 },
            3: { type: 'scythe', color: 0x8B008B, damage: 60 },
            4: { type: 'sword', color: 0xFF4500, damage: 30 },
            5: { type: 'spear', color: 0x00CED1, damage: 120 },
            6: { type: 'hammer', color: 0x556B2F, damage: 240 },
            7: { type: 'sword', color: 0x8A2BE2, damage: 480 },
            8: { type: 'scythe', color: 0x9400D3, damage: 960 },
            9: { type: 'scythe', color: 0x191970, damage: 1920 }
        };

        return weaponConfigs[zoneId] || weaponConfigs[1];
    }
}
