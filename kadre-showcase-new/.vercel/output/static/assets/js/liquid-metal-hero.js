/**
 * KADRE — Liquid Metal Hero (Three.js equivalent)
 * Chrome/liquid metal metaball shader + animated text overlay
 */
(function () {
    'use strict';

    var canvas = document.getElementById('liquid-metal-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // ── Renderer ──────────────────────────────────────────────────────────
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);

    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // ── Uniforms ──────────────────────────────────────────────────────────
    var uniforms = {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        u_mouse: { value: new THREE.Vector2(0.5, 0.5) }
    };

    // ── Vertex Shader ─────────────────────────────────────────────────────
    var vertexShader = [
        'varying vec2 vUv;',
        'void main() {',
        '    vUv = uv;',
        '    gl_Position = vec4(position, 1.0);',
        '}'
    ].join('\n');

    // ── Fragment Shader: Liquid Metal ─────────────────────────────────────
    var fragmentShader = [
        'uniform float u_time;',
        'uniform vec2 u_resolution;',
        'uniform vec2 u_mouse;',
        'varying vec2 vUv;',
        '',
        '// Simplex noise helper',
        'vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }',
        'vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }',
        'vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }',
        '',
        'float snoise(vec2 v) {',
        '    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);',
        '    vec2 i  = floor(v + dot(v, C.yy));',
        '    vec2 x0 = v - i + dot(i, C.xx);',
        '    vec2 i1;',
        '    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);',
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
        '    float t = u_time * 0.3;',
        '',
        '    // Metaballs',
        '    float d = 0.0;',
        '    for (int i = 0; i < 6; i++) {',
        '        float fi = float(i);',
        '        vec2 center = vec2(',
        '            0.4 * sin(t * (0.7 + fi * 0.15) + fi * 1.8) + 0.1 * sin(t * 0.3 + fi),',
        '            0.35 * cos(t * (0.5 + fi * 0.12) + fi * 2.1) + 0.1 * cos(t * 0.4 + fi * 0.7)',
        '        );',
        '        float radius = 0.15 + 0.05 * sin(t + fi * 1.5);',
        '        float dist = length(p - center);',
        '        d += radius / (dist + 0.01);',
        '    }',
        '',
        '    // Threshold for liquid surface',
        '    float threshold = 6.0;',
        '    float liquid = smoothstep(threshold - 0.5, threshold + 0.5, d);',
        '',
        '    // Chrome/liquid metal coloring',
        '    float fresnel = pow(1.0 - abs(dot(normalize(vec3(p, 0.3)), vec3(0.0, 0.0, 1.0))), 2.0);',
        '    float noise = snoise(p * 3.0 + t * 0.5) * 0.5 + 0.5;',
        '',
        '    vec3 chromeLight = vec3(0.95, 0.92, 0.88);',
        '    vec3 chromeDark = vec3(0.15, 0.13, 0.12);',
        '    vec3 chromeMid = vec3(0.4, 0.38, 0.36);',
        '',
        '    vec3 chrome = mix(chromeDark, chromeMid, noise);',
        '    chrome = mix(chrome, chromeLight, fresnel * 0.7);',
        '    chrome += liquid * 0.15;',
        '',
        '    // Specular highlights',
        '    float spec = pow(max(0.0, 1.0 - abs(d - threshold) * 0.3), 8.0);',
        '    chrome += spec * 0.4 * vec3(1.0, 0.98, 0.95);',
        '',
        '    // Edge glow',
        '    float edge = smoothstep(threshold + 0.3, threshold - 0.3, d);',
        '    chrome += edge * 0.1 * vec3(0.85, 0.75, 0.6);',
        '',
        '    // Darken background (non-liquid areas)',
        '    float bg = 1.0 - liquid;',
        '    vec3 bgCol = vec3(0.06, 0.06, 0.08) + 0.02 * noise;',
        '    chrome = mix(bgCol, chrome, liquid * 0.9 + edge * 0.3);',
        '',
        '    gl_FragColor = vec4(chrome, 1.0);',
        '}'
    ].join('\n');

    // ── Fullscreen quad ───────────────────────────────────────────────────
    var geometry = new THREE.PlaneGeometry(2, 2);
    var material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: uniforms
    });
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // ── Mouse tracking ────────────────────────────────────────────────────
    var mouseX = 0.5, mouseY = 0.5;
    document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX / window.innerWidth;
        mouseY = 1.0 - e.clientY / window.innerHeight;
    });

    // ── Animation loop ────────────────────────────────────────────────────
    var startTime = Date.now();
    function animate() {
        requestAnimationFrame(animate);
        uniforms.u_time.value = (Date.now() - startTime) * 0.001;
        uniforms.u_mouse.value.lerp(new THREE.Vector2(mouseX, mouseY), 0.05);
        renderer.render(scene, camera);
    }
    animate();

    // ── Resize ────────────────────────────────────────────────────────────
    window.addEventListener('resize', function () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    });
})();
