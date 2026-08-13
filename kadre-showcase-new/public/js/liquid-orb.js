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
        document.body.appendChild(container);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 8;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // ─── Shader Custom — Orbe iridescent cyan ───────────────────────────
        // Pas de MeshPhysicalMaterial (requiert HDR env map → blob blanc)
        // On fait un shader GLSL maison pour l'effet liquide cyan
        const vertexShader = `
            uniform float u_time;

            vec3 mod289v3(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 mod289v4(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 permute4(vec4 x) { return mod289v4(((x*34.0)+1.0)*x); }
            vec4 taylorInvSqrt4(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
            float snoise(vec3 v) {
                const vec2 C = vec2(1.0/6.0, 1.0/3.0);
                const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
                vec3 i  = floor(v + dot(v, C.yyy));
                vec3 x0 = v - i + dot(i, C.xxx);
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 i1 = min(g.xyz, l.zxy);
                vec3 i2 = max(g.xyz, l.zxy);
                vec3 x1 = x0 - i1 + C.xxx;
                vec3 x2 = x0 - i2 + C.yyy;
                vec3 x3 = x0 - D.yyy;
                i = mod289v3(i);
                vec4 p = permute4(permute4(permute4(
                         i.z + vec4(0.0, i1.z, i2.z, 1.0))
                       + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                       + i.x + vec4(0.0, i1.x, i2.x, 1.0));
                float n_ = 0.142857142857;
                vec3 ns = n_ * D.wyz - D.xzx;
                vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
                vec4 x_ = floor(j * ns.z);
                vec4 y_ = floor(j - 7.0 * x_);
                vec4 x = x_ * ns.x + ns.yyyy;
                vec4 y = y_ * ns.x + ns.yyyy;
                vec4 h = 1.0 - abs(x) - abs(y);
                vec4 b0 = vec4(x.xy, y.xy);
                vec4 b1 = vec4(x.zw, y.zw);
                vec4 s0 = floor(b0)*2.0 + 1.0;
                vec4 s1 = floor(b1)*2.0 + 1.0;
                vec4 sh = -step(h, vec4(0.0));
                vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
                vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
                vec3 p0 = vec3(a0.xy, h.x);
                vec3 p1 = vec3(a0.zw, h.y);
                vec3 p2 = vec3(a1.xy, h.z);
                vec3 p3 = vec3(a1.zw, h.w);
                vec4 norm = taylorInvSqrt4(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
                p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
                vec4 m = max(0.5 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
                m = m * m;
                return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
            }

            varying vec3 vNormal;
            varying vec3 vPosition;
            varying float vNoise;

            void main() {
                vNormal = normalize(normalMatrix * normal);
                float n1 = snoise(position * 0.4 + u_time * 0.25) * 1.2;
                float n2 = snoise(position * 1.1 - u_time * 0.35) * 0.35;
                float n3 = snoise(position * 2.4 + u_time * 0.45) * 0.08;
                float totalNoise = n1 + n2 + n3;
                vNoise = totalNoise;
                vec3 displaced = position + normal * totalNoise;
                vPosition = displaced;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
            }
        `;

        const fragmentShader = `
            uniform float u_time;
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying float vNoise;

            void main() {
                // Fresnel rim glow
                vec3 viewDir = normalize(cameraPosition - vPosition);
                float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.5);

                // Base cyan color — brand color #00E5FF
                vec3 cyanCore = vec3(0.0, 0.898, 1.0);
                // Deep indigo for shadows
                vec3 indigoDeep = vec3(0.12, 0.06, 0.28);
                // Electric cyan for highlights
                vec3 electricCyan = vec3(0.5, 1.0, 1.0);

                // Color based on noise + fresnel
                float t = clamp(vNoise * 0.5 + 0.5, 0.0, 1.0);
                vec3 color = mix(indigoDeep, cyanCore, t);
                color = mix(color, electricCyan, fresnel * 0.7);

                // Pulsing glow effect
                float pulse = 0.5 + 0.5 * sin(u_time * 1.8 + vNoise * 3.0);
                color += cyanCore * pulse * 0.15;

                // Edge soft transparency
                float alpha = 0.72 + fresnel * 0.22;
                alpha *= smoothstep(0.0, 0.15, t);

                gl_FragColor = vec4(color, alpha);
            }
        `;

        const shaderMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                u_time: { value: 0.0 },
            },
            transparent: true,
            depthWrite: false,
        });

        // ─── Géométries qui alternent ────────────────────────────────────────
        const isMobile = window.innerWidth < 768;
        const geometries = [
            new THREE.IcosahedronGeometry(2.5, isMobile ? 24 : 64),
            new THREE.BoxGeometry(3.5, 3.5, 3.5, 16, 16, 16),
            new THREE.CylinderGeometry(2.5, 2.5, 4.5, 32, 16),
            new THREE.TorusGeometry(2.0, 1.2, 32, 48)
        ];

        let currentGeoIndex = 0;
        let morphScale = 1.0;
        let morphPhase = 0;
        let morphTimer = 0;
        let baseScale = 1.0;

        const mesh = new THREE.Mesh(geometries[currentGeoIndex], shaderMaterial);
        scene.add(mesh);

        function updateBlobScale() {
            const aspect = window.innerWidth / window.innerHeight;
            if (aspect < 0.8) {
                baseScale = 0.35;
                camera.position.z = 20;
            } else if (aspect > 1.2) {
                baseScale = 0.85;
                camera.position.z = 12;
            } else {
                baseScale = 0.65;
                camera.position.z = 14;
            }
            mesh.scale.setScalar(baseScale * morphScale);
        }
        updateBlobScale();

        // Mouse interaction
        let mouseX = 0, mouseY = 0;
        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const time = clock.getElapsedTime();

            shaderMaterial.uniforms.u_time.value = time;

            // Rotation + mouse follow
            mesh.rotation.y += 0.005;
            mesh.rotation.x += 0.002;
            mesh.position.x += (mouseX * 0.5 - mesh.position.x) * 0.05;
            mesh.position.y += (mouseY * 0.5 - mesh.position.y) * 0.05;

            // Shape Morphing Logic
            morphTimer += 0.01;
            if (morphTimer > 5.0 && morphPhase === 0) {
                morphPhase = 1;
                morphTimer = 0;
            }
            if (morphPhase === 1) {
                morphScale += (0.001 - morphScale) * 0.12;
                if (morphScale < 0.02) {
                    currentGeoIndex = (currentGeoIndex + 1) % geometries.length;
                    mesh.geometry = geometries[currentGeoIndex];
                    morphPhase = 2;
                }
            } else if (morphPhase === 2) {
                morphScale += (1.0 - morphScale) * 0.08;
                if (morphScale > 0.99) {
                    morphScale = 1.0;
                    morphPhase = 0;
                }
            }

            const pulse = 1.0 + Math.sin(time * 2.0) * 0.05;
            mesh.scale.setScalar(baseScale * morphScale * pulse);

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
