class Smith {
    constructor(scene, x, z) {
        this.scene = scene;
        this.position = { x, z };
        this.interactionRange = 3;
        this.mesh = null;
        this.createMesh(x, z);
    }

    createMesh(x, z) {
        this.mesh = new THREE.Group();

        // Hidden pit under the anvil
        const pitGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.6, 16, 1, true);
        const pitMat = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.9,
            metalness: 0.1,
            side: THREE.DoubleSide
        });
        const pit = new THREE.Mesh(pitGeo, pitMat);
        pit.position.y = 0.3;
        this.mesh.add(pit);

        const rimGeo = new THREE.TorusGeometry(1.2, 0.1, 8, 16);
        const rimMat = new THREE.MeshStandardMaterial({
            color: 0x3b2f2f,
            roughness: 0.9,
            metalness: 0.1
        });
        const rim = new THREE.Mesh(rimGeo, rimMat);
        rim.rotation.x = Math.PI / 2;
        rim.position.y = 0.55;
        this.mesh.add(rim);

        const bodyOffset = -0.6;

        // Create smith body (larger than player)
        const bodyGeometry = new THREE.CylinderGeometry(0.6, 0.6, 2.5, 8);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Brown
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.25 + bodyOffset;
        body.castShadow = true;
        this.mesh.add(body);

        // Create head
        const headGeometry = new THREE.SphereGeometry(0.5, 8, 8);
        const headMaterial = new THREE.MeshStandardMaterial({ color: 0xFFDBAC }); // Skin tone
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2.8 + bodyOffset;
        head.castShadow = true;
        this.mesh.add(head);

        // Create beard
        const beardGeometry = new THREE.ConeGeometry(0.4, 0.6, 8);
        const beardMaterial = new THREE.MeshStandardMaterial({ color: 0x696969 }); // Gray
        const beard = new THREE.Mesh(beardGeometry, beardMaterial);
        beard.position.set(0, 2.4 + bodyOffset, 0.3);
        beard.rotation.x = Math.PI;
        this.mesh.add(beard);

        // Create blacksmith apron
        const apronGeometry = new THREE.BoxGeometry(1.0, 1.5, 0.1);
        const apronMaterial = new THREE.MeshStandardMaterial({ color: 0x2F4F4F }); // Dark gray
        const apron = new THREE.Mesh(apronGeometry, apronMaterial);
        apron.position.set(0, 1.2 + bodyOffset, 0.6);
        this.mesh.add(apron);

        // Create hammer (tool)
        const hammerHandle = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 8);
        const hammerHandleMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const handle = new THREE.Mesh(hammerHandle, hammerHandleMat);
        handle.position.set(0.8, 1.5 + bodyOffset, 0);
        handle.rotation.z = Math.PI / 4;
        this.mesh.add(handle);

        const hammerHead = new THREE.BoxGeometry(0.3, 0.2, 0.2);
        const hammerHeadMat = new THREE.MeshStandardMaterial({
            color: 0x808080,
            metalness: 0.8,
            roughness: 0.3
        });
        const head2 = new THREE.Mesh(hammerHead, hammerHeadMat);
        head2.position.set(1.2, 1.8 + bodyOffset, 0);
        this.mesh.add(head2);

        // Create anvil nearby
        const anvilBase = new THREE.BoxGeometry(0.8, 0.3, 0.6);
        const anvilMat = new THREE.MeshStandardMaterial({
            color: 0x404040,
            metalness: 0.9,
            roughness: 0.4
        });
        const anvil = new THREE.Mesh(anvilBase, anvilMat);
        anvil.position.set(0.9, 0.15, 0.2);
        anvil.castShadow = true;
        this.mesh.add(anvil);

        const anvilTop = new THREE.BoxGeometry(0.6, 0.4, 0.4);
        const anvilTop2 = new THREE.Mesh(anvilTop, anvilMat);
        anvilTop2.position.set(0.9, 0.5, 0.2);
        anvilTop2.castShadow = true;
        this.mesh.add(anvilTop2);

        // Create name label
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        context.font = 'bold 32px Arial';
        context.fillStyle = 'gold';
        context.strokeStyle = 'black';
        context.lineWidth = 4;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.strokeText('Smith', 128, 32);
        context.fillText('Smith', 128, 32);

        const texture = new THREE.CanvasTexture(canvas);
        const labelMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        });

        const labelGeometry = new THREE.PlaneGeometry(2, 0.5);
        this.label = new THREE.Mesh(labelGeometry, labelMaterial);
        this.label.position.y = 3.2;
        this.mesh.add(this.label);

        // Position smith
        this.mesh.position.set(x, 0, z);
        this.scene.add(this.mesh);
    }

    update(camera) {
        // Make label face camera
        if (this.label && camera) {
            const cameraDirection = new THREE.Vector3();
            camera.getWorldDirection(cameraDirection);
            const angle = Math.atan2(cameraDirection.x, cameraDirection.z);
            this.label.rotation.y = angle + Math.PI;
        }
    }

    isPlayerInRange(playerPosition) {
        const distance = Math.sqrt(
            Math.pow(playerPosition.x - this.position.x, 2) +
            Math.pow(playerPosition.z - this.position.z, 2)
        );
        return distance <= this.interactionRange;
    }

    getPosition() {
        return this.position;
    }
}
