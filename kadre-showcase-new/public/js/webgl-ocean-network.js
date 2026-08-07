/**
 * KADRE SHOWCASE — WebGL 3D Background
 * Liquid Metal Shader + Metallic Particle Ocean + Geometric Network
 */
(function() {
    // Désactiver cet effet très lourd sur mobile (P0 Fix)
    if (window.innerWidth < 768) return;

    var canvas = document.getElementById('kadre-webgl');
    if (!canvas || typeof THREE === 'undefined') return;

    // ── Renderer ──────────────────────────────────────────────────────────
    var renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: false, 
        alpha: false,
        powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x060608, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // ── Mouse Tracking ────────────────────────────────────────────────────
    var mouseX = 0, mouseY = 0;
    var targetRotX = 0, targetRotY = 0;
    window.addEventListener('mousemove', function(e) {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });

    // ══════════════════════════════════════════════════════════════════════
    // LAYER 1 — LIQUID METAL SHADER (fullscreen background)
    // ══════════════════════════════════════════════════════════════════════
    var liquidScene = new THREE.Scene();
    var liquidCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    var liquidUniforms = {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        u_mouse: { value: new THREE.Vector2(0.5, 0.5) }
    };

    var liquidVertexShader = [
        'varying vec2 vUv;',
        'void main() {',
        '    vUv = uv;',
        '    gl_Position = vec4(position, 1.0);',
        '}'
    ].join('\n');

    var liquidFragmentShader = [
        'uniform float u_time;',
        'uniform vec2 u_resolution;',
        'uniform vec2 u_mouse;',
        'varying vec2 vUv;',
        '',
        'vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }',
        'vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }',
        'vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }',
        '',
        'float snoise(vec2 v) {',
        '    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);',
        '    vec2 i  = floor(v + dot(v, C.yy));',
        '    vec2 x0 = v - i + dot(i, C.xx);',
        '    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);',
        '    vec4 x12 = x0.xyxy + C.xxzz;',
        '    x12.xy -= i1;',
        '    i = mod289(i);',
        '    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));',
        '    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);',
        '    m = m*m; m = m*m;',
        '    vec3 x = 2.0 * fract(p * C.www) - 1.0;',
        '    vec3 h = abs(x) - 0.5;',
        '    vec3 ox = floor(x + 0.5);',
        '    vec3 a0 = x - ox;',
        '    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);',
        '    vec3 g;',
        '    g.x = a0.x * x0.x + h.x * x0.y;',
        '    g.yz = a0.yz * x12.xz + h.yz * x12.yw;',
        '    return 130.0 * dot(m, g);',
        '}',
        '',
        'void main() {',
        '    vec2 uv = vUv;',
        '    float aspect = u_resolution.x / u_resolution.y;',
        '    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);',
        '    float t = u_time * 0.25;',
        '',
        '    // 6 metaballs',
        '    float d = 0.0;',
        '    for (int i = 0; i < 6; i++) {',
        '        float fi = float(i);',
        '        vec2 center = vec2(',
        '            0.4 * sin(t * (0.7 + fi * 0.15) + fi * 1.8),',
        '            0.35 * cos(t * (0.5 + fi * 0.12) + fi * 2.1)',
        '        );',
        '        float radius = 0.18 + 0.06 * sin(t + fi * 1.5);',
        '        float dist = length(p - center);',
        '        d += radius / (dist + 0.01);',
        '    }',
        '',
        '    // Threshold',
        '    float threshold = 5.5;',
        '    float liquid = smoothstep(threshold - 0.8, threshold + 0.8, d);',
        '',
        '    // Chrome coloring',
        '    float fresnel = pow(1.0 - abs(dot(normalize(vec3(p, 0.3)), vec3(0.0, 0.0, 1.0))), 2.0);',
        '    float noise = snoise(p * 3.0 + t * 0.5) * 0.5 + 0.5;',
        '',
        '    vec3 chromeLight = vec3(0.85, 0.78, 0.65);',
        '    vec3 chromeDark = vec3(0.08, 0.07, 0.06);',
        '    vec3 chromeMid = vec3(0.25, 0.22, 0.18);',
        '',
        '    // Gold-tinted chrome',
        '    vec3 chrome = mix(chromeDark, chromeMid, noise);',
        '    chrome = mix(chrome, chromeLight, fresnel * 0.6);',
        '    chrome += liquid * 0.12;',
        '',
        '    // Specular',
        '    float spec = pow(max(0.0, 1.0 - abs(d - threshold) * 0.3), 8.0);',
        '    chrome += spec * 0.35 * vec3(1.0, 0.95, 0.85);',
        '',
        '    // Edge glow',
        '    float edge = smoothstep(threshold + 0.4, threshold - 0.4, d);',
        '    chrome += edge * 0.08 * vec3(0.85, 0.72, 0.5);',
        '',
        '    // Background',
        '    float bg = 1.0 - liquid;',
        '    vec3 bgCol = vec3(0.06, 0.06, 0.08) + 0.015 * noise;',
        '    chrome = mix(bgCol, chrome, liquid * 0.85 + edge * 0.25);',
        '',
        '    // Dim it slightly so particles show on top',
        '    chrome *= 0.6;',
        '',
        '    gl_FragColor = vec4(chrome, 1.0);',
        '}'
    ].join('\n');

    var liquidGeo = new THREE.PlaneGeometry(2, 2);
    var liquidMat = new THREE.ShaderMaterial({
        vertexShader: liquidVertexShader,
        fragmentShader: liquidFragmentShader,
        uniforms: liquidUniforms,
        depthWrite: false
    });
    var liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidScene.add(liquidMesh);

    // ══════════════════════════════════════════════════════════════════════
    // LAYER 2 — METALLIC PARTICLE OCEAN
    // ══════════════════════════════════════════════════════════════════════
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 300);
    camera.position.set(0, 5, 28);
    camera.lookAt(0, 0, 0);

    var OCEAN_SEG = 60;
    var oceanGeo = new THREE.PlaneGeometry(100, 100, OCEAN_SEG, OCEAN_SEG);
    oceanGeo.rotateX(-Math.PI / 2.8);

    var posArr = oceanGeo.attributes.position.array;
    var originY = new Float32Array(posArr.length / 3);
    for (var i = 0; i < originY.length; i++) {
        originY[i] = posArr[i * 3 + 1];
    }

    var oceanMat = new THREE.PointsMaterial({
        color: 0xd4a656,
        size: 0.06,
        transparent: true,
        opacity: 0.55,
        sizeAttenuation: true
    });
    var oceanPoints = new THREE.Points(oceanGeo, oceanMat);
    oceanPoints.position.y = -7;
    oceanPoints.position.z = -5;
    scene.add(oceanPoints);

    // ══════════════════════════════════════════════════════════════════════
    // LAYER 3 — GEOMETRIC NETWORK
    // ══════════════════════════════════════════════════════════════════════
    var NODE_COUNT = 40;
    var EDGE_DIST = 7;
    var nodePos = [];
    for (var n = 0; n < NODE_COUNT; n++) {
        nodePos.push(
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 30 - 8
        );
    }

    var nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.Float32BufferAttribute(nodePos, 3));
    var nodeMat = new THREE.PointsMaterial({ color: 0xd4a656, size: 0.15, transparent: true, opacity: 0.6 });
    scene.add(new THREE.Points(nodeGeo, nodeMat));

    var edgeVerts = [];
    for (var a = 0; a < NODE_COUNT; a++) {
        for (var b = a + 1; b < NODE_COUNT; b++) {
            var dx = nodePos[a*3]   - nodePos[b*3];
            var dy = nodePos[a*3+1] - nodePos[b*3+1];
            var dz = nodePos[a*3+2] - nodePos[b*3+2];
            if (Math.sqrt(dx*dx + dy*dy + dz*dz) < EDGE_DIST) {
                edgeVerts.push(
                    nodePos[a*3], nodePos[a*3+1], nodePos[a*3+2],
                    nodePos[b*3], nodePos[b*3+1], nodePos[b*3+2]
                );
            }
        }
    }
    var edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgeVerts, 3));
    var edgeMat = new THREE.LineBasicMaterial({ color: 0xd4a656, transparent: true, opacity: 0.12 });
    var lineSegs = new THREE.LineSegments(edgeGeo, edgeMat);
    scene.add(lineSegs);

    // ── Lights ────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    var pt1 = new THREE.PointLight(0xd4a656, 4, 80);
    pt1.position.set(10, 10, 15);
    scene.add(pt1);

    var pt2 = new THREE.PointLight(0x8899ff, 2, 60);
    pt2.position.set(-10, 5, -10);
    scene.add(pt2);

    var pt3 = new THREE.PointLight(0xd4a656, 1.5, 40);
    pt3.position.set(0, -5, 5);
    scene.add(pt3);

    // ── Clock ─────────────────────────────────────────────────────────────
    var clock = new THREE.Clock();

    // ── Animation Loop ────────────────────────────────────────────────────
    function animate() {
        var t = clock.getElapsedTime();

        // Liquid metal uniforms
        liquidUniforms.u_time.value = t;
        liquidUniforms.u_mouse.value.lerp(
            new THREE.Vector2(mouseX * 0.5 + 0.5, mouseY * 0.5 + 0.5),
            0.05
        );

        // Wave on ocean
        var pos = oceanGeo.attributes.position;
        for (var k = 0; k < pos.count; k++) {
            var x = pos.getX(k);
            var z = pos.getZ(k);
            pos.setY(k, originY[k] + Math.sin(x * 0.25 + t * 0.5) * 0.6 + Math.sin(z * 0.2 + t * 0.35) * 0.5);
        }
        pos.needsUpdate = true;

        // Camera parallax
        targetRotX += (mouseY * 0.3 - targetRotX) * 0.03;
        targetRotY += (mouseX * 0.4 - targetRotY) * 0.03;
        scene.rotation.x = targetRotX * 0.12;
        scene.rotation.y = targetRotY * 0.15;

        // Network slow rotate
        lineSegs.rotation.y = t * 0.008;

        // ── Render: liquid metal first, then 3D scene on top ──────────────
        renderer.autoClear = false;
        renderer.clear();
        renderer.render(liquidScene, liquidCamera);
        renderer.clearDepth();
        renderer.render(scene, camera);
    }

    // Pause animation when tab is hidden (save CPU/GPU)
    var animId;
    function animateLoop() {
        animId = requestAnimationFrame(animateLoop);
        animate();
    }
    animateLoop();

    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            cancelAnimationFrame(animId);
        } else {
            animateLoop();
        }
    });

    // ── Resize ────────────────────────────────────────────────────────────
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        liquidUniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    });
})();
