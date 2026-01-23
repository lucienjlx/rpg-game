class FogSystem {
    constructor() {
        this.fogPlanes = [];
    }

    createZoneFog(zone, scene) {
        if (zone.unlocked) return; // Don't create fog for unlocked zones

        const width = zone.bounds.maxX - zone.bounds.minX;
        const depth = zone.bounds.maxZ - zone.bounds.minZ;
        const centerX = (zone.bounds.minX + zone.bounds.maxX) / 2;
        const centerZ = (zone.bounds.minZ + zone.bounds.maxZ) / 2;

        const geometry = new THREE.PlaneGeometry(width, depth);
        const material = new THREE.MeshBasicMaterial({
            color: 0x333333,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        const fogPlane = new THREE.Mesh(geometry, material);
        fogPlane.rotation.x = -Math.PI / 2;
        fogPlane.position.set(centerX, 1, centerZ);

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
