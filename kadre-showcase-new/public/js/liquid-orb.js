(function() {
    function initOrb() {
        if (typeof THREE === 'undefined') {
            setTimeout(initOrb, 50);
            return;
        }

        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.zIndex = '-1'; 
        container.style.pointerEvents = 'none';
        // Add a subtle radial gradient to focus on the center
        container.style.background = 'radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 60%)';
        document.body.appendChild(container);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 8;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        container.appendChild(renderer.domElement);

        // Complex Lights for Iridescent / Chromatic effect — Cyan palette
        const light1 = new THREE.PointLight(0x00E5FF, 250, 30); // Cyan (brand color)
        light1.position.set(5, 5, 5);
        const light2 = new THREE.PointLight(0xffffff, 200, 30); // White
        light2.position.set(-5, 5, 5);
        const light3 = new THREE.PointLight(0x6366f1, 150, 30); // Indigo for contrast
        light3.position.set(0, -5, 5);
        const light4 = new THREE.PointLight(0x80F2FF, 120, 30); // Light cyan
        light4.position.set(-5, -3, 3);
        scene.add(light1, light2, light3, light4);

        const ambientLight = new THREE.AmbientLight(0x00E5FF, 0.8); // Cyan ambient
        scene.add(ambientLight);


        // The Blob (Organic dynamic shape)
        const isMobile = window.innerWidth < 768;
        
        // Define multiple shapes for morphing
        // Subdivisions basses = formes clairement reconnaissables
        const geometries = [
            new THREE.IcosahedronGeometry(2.5, 2),          // sphere facettée
            new THREE.BoxGeometry(3.5, 3.5, 3.5, 1, 1, 1),  // cube net
            new THREE.CylinderGeometry(2.2, 2.2, 4.5, 8, 1), // cylindre 8 faces
            new THREE.TorusGeometry(2.0, 1.0, 8, 16)         // tore
        ];
        
        let currentGeoIndex = 0;
        let morphScale = 1.0;
        let morphPhase = 0; // 0: idle, 1: shrink, 2: grow
        let morphTimer = 0;

        let baseScaleX = 1.0, baseScaleY = 1.0, baseScaleZ = 1.0;
        
        // MeshLambertMaterial = couleur directe, pas besoin d'env map
        // La couleur cyan #00E5FF sera visible avec les PointLights
        const material = new THREE.MeshLambertMaterial({
            color: 0x00E5FF,
            emissive: 0x004466,
            emissiveIntensity: 1.0,
            transparent: true,
            opacity: 0.75,
        });

        const sphere = new THREE.Mesh(geometries[currentGeoIndex], material);
        scene.add(sphere);

        function updateBlobScale() {
            const aspect = window.innerWidth / window.innerHeight;
            if (aspect < 0.8) {
                // Mobile : on augmente légèrement la taille comme demandé
                baseScaleX = 0.35;
                baseScaleY = 0.35;
                baseScaleZ = 0.35;
                camera.position.z = 20;
            } else if (aspect > 1.2) {
                // PC : taille moyenne
                baseScaleX = 0.85;
                baseScaleY = 0.85;
                baseScaleZ = 0.85;
                camera.position.z = 12;
            } else {
                // Tablette
                baseScaleX = 0.65;
                baseScaleY = 0.65;
                baseScaleZ = 0.65;
                camera.position.z = 14;
            }
            sphere.scale.set(baseScaleX * morphScale, baseScaleY * morphScale, baseScaleZ * morphScale);
        }
        updateBlobScale();

        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;
        
        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const time = clock.getElapsedTime();

            // Smooth mouse follow
            sphere.rotation.y += 0.005;
            sphere.rotation.x += 0.002;
            
            sphere.position.x += (mouseX * 0.5 - sphere.position.x) * 0.05;
            sphere.position.y += (mouseY * 0.5 - sphere.position.y) * 0.05;

            // Orbiting lights inside/around the sphere to create internal refraction colors
            light1.position.set(Math.sin(time) * 2, Math.cos(time * 0.8) * 2, Math.sin(time * 1.2) * 2);
            light2.position.set(Math.cos(time * 0.9) * 2, Math.sin(time * 1.1) * 2, Math.cos(time * 0.7) * 2);
            light3.position.set(Math.sin(time * 1.3) * 2, Math.cos(time * 0.6) * 2, Math.sin(time * 0.9) * 2);
            light4.position.set(Math.cos(time * 1.2) * 2, Math.sin(time * 1.4) * 2, Math.cos(time * 1.1) * 2);

            // Shape Morphing Logic
            morphTimer += 0.01;
            if (morphTimer > 5.0 && morphPhase === 0) { // faster morph cycle (5s)
                morphPhase = 1;
                morphTimer = 0;
            }
            if (morphPhase === 1) {
                morphScale += (0.001 - morphScale) * 0.12; // faster shrink
                if (morphScale < 0.02) { // get smaller before switching
                    currentGeoIndex = (currentGeoIndex + 1) % geometries.length;
                    sphere.geometry = geometries[currentGeoIndex];
                    morphPhase = 2;
                }
            } else if (morphPhase === 2) {
                morphScale += (1.0 - morphScale) * 0.08; // faster grow
                if (morphScale > 0.99) {
                    morphScale = 1.0;
                    morphPhase = 0;
                }
            }
            
            // Apply scale with morphing (pulse effect with math.sin added to base scale)
            const pulse = 1.0 + Math.sin(time * 2.0) * 0.05;
            sphere.scale.set(
                baseScaleX * morphScale * pulse, 
                baseScaleY * morphScale * pulse, 
                baseScaleZ * morphScale * pulse
            );

            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            updateBlobScale();
        });
    } // end initOrb

    initOrb();
})();
