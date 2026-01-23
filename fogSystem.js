class FogSystem {
    constructor() {
        this.fogPlanes = [];
        this.fogPositions = [
            { x: 0, zoneId: 2 },   // Fog for Zone 2
            { x: 50, zoneId: 3 },  // Fog for Zone 3
            { x: 100, zoneId: 4 }  // Fog for Zone 4
        ];
    }

    createZoneFog(zone, scene) {
        if (zone.unlocked || zone.id === 1) return; // Don't create fog for Zone 1 or unlocked zones

        // Find the fog position for this zone
        const fogPos = this.fogPositions.find(f => f.zoneId === zone.id);
        if (!fogPos) return;

        // Create vertical fog wall at zone boundary
        const geometry = new THREE.PlaneGeometry(50, 20); // 50 wide (zone depth), 20 tall
        const material = new THREE.MeshBasicMaterial({
            color: 0x666666,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        const fogPlane = new THREE.Mesh(geometry, material);

        // Position fog vertically at zone boundary
        fogPlane.position.set(fogPos.x, 10, 0); // x at boundary, y=10 for sky, z=0 center
        fogPlane.rotation.y = Math.PI / 2; // Rotate to face along x-axis

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
