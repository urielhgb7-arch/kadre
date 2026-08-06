(function() {
    window.addEventListener('DOMContentLoaded', () => {
        if (typeof THREE === 'undefined') return;

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

        const ambientLight = new THREE.AmbientLight(0x0a0a1a, 1.5);
        scene.add(ambientLight);

        // Environment Map (for metal reflections)
        const envScene = new THREE.Scene();
        envScene.background = new THREE.Color(0x060608);
        const envLight1 = new THREE.PointLight(0x00E5FF, 1, 0); // Cyan
        envLight1.position.set(10, 10, 10);
        envScene.add(envLight1);
        const envLight2 = new THREE.PointLight(0xffffff, 1, 0);
        envLight2.position.set(-10, -10, 10);
        envScene.add(envLight2);
        
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();
        scene.environment = pmremGenerator.fromScene(envScene).texture;

        // The Orb (Large diameter)
        const geometry = new THREE.SphereGeometry(2.8, 256, 256);
        
        const material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 1.0,
            roughness: 0.15,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            envMapIntensity: 2.0
        });

        // Add vertex displacement to make it "liquid"
        material.onBeforeCompile = (shader) => {
            shader.uniforms.time = { value: 0 };
            shader.vertexShader = `
                uniform float time;
                
                // Simplex noise function
                vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
                vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
                float snoise(vec3 v) {
                  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
                  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
                  vec3 i  = floor(v + dot(v, C.yyy) );
                  vec3 x0 = v - i + dot(i, C.xxx) ;
                  vec3 g = step(x0.yzx, x0.xyz);
                  vec3 l = 1.0 - g;
                  vec3 i1 = min( g.xyz, l.zxy );
                  vec3 i2 = max( g.xyz, l.zxy );
                  vec3 x1 = x0 - i1 + C.xxx;
                  vec3 x2 = x0 - i2 + C.yyy;
                  vec3 x3 = x0 - D.yyy;
                  i = mod289(i);
                  vec4 p = permute( permute( permute(
                             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
                  float n_ = 0.142857142857;
                  vec3  ns = n_ * D.wyz - D.xzx;
                  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
                  vec4 x_ = floor(j * ns.z);
                  vec4 y_ = floor(j - 7.0 * x_ );
                  vec4 x = x_ *ns.x + ns.yyyy;
                  vec4 y = y_ *ns.x + ns.yyyy;
                  vec4 h = 1.0 - abs(x) - abs(y);
                  vec4 b0 = vec4( x.xy, y.xy );
                  vec4 b1 = vec4( x.zw, y.zw );
                  vec4 s0 = floor(b0)*2.0 + 1.0;
                  vec4 s1 = floor(b1)*2.0 + 1.0;
                  vec4 sh = -step(h, vec4(0.0));
                  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
                  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
                  vec3 p0 = vec3(a0.xy,h.x);
                  vec3 p1 = vec3(a0.zw,h.y);
                  vec3 p2 = vec3(a1.xy,h.z);
                  vec3 p3 = vec3(a1.zw,h.w);
                  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                  p0 *= norm.x;
                  p1 *= norm.y;
                  p2 *= norm.z;
                  p3 *= norm.w;
                  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                  m = m * m;
                  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
                }
                ` + shader.vertexShader;
            shader.vertexShader = shader.vertexShader.replace(
                `#include <begin_vertex>`,
                `
                #include <begin_vertex>
                float noise = snoise(position * 0.8 + time * 0.5) * 0.3;
                float noise2 = snoise(position * 2.0 - time * 0.2) * 0.1;
                transformed += normal * (noise + noise2);
                `
            );
            material.userData.shader = shader;
        };

        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

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

            if (material.userData.shader) {
                material.userData.shader.uniforms.time.value = time * 0.8;
            }

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

            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    });
})();
