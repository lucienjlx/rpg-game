class FogSystem {
    constructor() {
        this.fogPlanes = [];
    }

    createZoneFog(zone, scene) {
        if (zone.unlocked || zone.id === 1) return; // Don't create fog for Zone 1 or unlocked zones

        // Calculate zone center and dimensions
        const centerX = (zone.bounds.minX + zone.bounds.maxX) / 2;
        const centerZ = (zone.bounds.minZ + zone.bounds.maxZ) / 2;
        const width = zone.bounds.maxX - zone.bounds.minX;
        const depth = zone.bounds.maxZ - zone.bounds.minZ;

        // Create horizontal fog plane covering the entire zone
        const geometry = new THREE.PlaneGeometry(width, depth);
        const material = new THREE.MeshBasicMaterial({
            color: 0x666666,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide
        });
        const fogPlane = new THREE.Mesh(geometry, material);

        // Position fog horizontally above the zone
        fogPlane.position.set(centerX, 8, centerZ);
        fogPlane.rotation.x = -Math.PI / 2; // Rotate to be horizontal

        scene.add(fogPlane);
        this.fogPlanes.push({
            mesh: fogPlane,
            zoneId: zone.id,
            active: true
        });
    }

    createAllFog(zones, scene) {
        for (let zone of zones) {
            if (!zone.unlocked) {
                this.createZoneFog(zone, scene);
            }
        }
    }

    clearZoneFog(zoneId, scene) {
        const fogPlane = this.fogPlanes.find(f => f.zoneId === zoneId && f.active);
        if (!fogPlane) return;

        fogPlane.active = false;

        // Animate fog fading over 2 seconds
        const startOpacity = fogPlane.mesh.material.opacity;
        const endOpacity = 0;
        const duration = 2000;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            fogPlane.mesh.material.opacity = startOpacity + (endOpacity - startOpacity) * progress;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Remove from scene after animation
                scene.remove(fogPlane.mesh);
            }
        };

        animate();
    }
}
