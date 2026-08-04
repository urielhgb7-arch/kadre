/**
 * TERMINAL CRAFT — Three.js 3D Interactive Hero Object
 * A wireframe tesseract-like rotating structure with particle dust
 * that users can drag/rotate with mouse — fusing retro terminal aesthetics
 * with modern 3D web.
 */
(function() {
    const canvas = document.getElementById('terminal-3d');
    if (!canvas || typeof THREE === 'undefined') return;

    const W = canvas.parentElement.offsetWidth || 320;
    const H = canvas.parentElement.offsetHeight || 320;

    // ── Renderer ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    // ── Icosphere (wireframe shell) ────────────────────────────────────────
    const icoGeo = new THREE.IcosahedronGeometry(1.4, 2);
    const icoMat = new THREE.MeshBasicMaterial({
        color: 0x39ff76,
        wireframe: true,
        transparent: true,
        opacity: 0.22,
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    scene.add(ico);

    // ── Inner dodecahedron ─────────────────────────────────────────────────
    const innerGeo = new THREE.OctahedronGeometry(0.85, 2);
    const innerMat = new THREE.MeshBasicMaterial({
        color: 0x00ffd0,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    scene.add(inner);

    // ── Core glowing sphere ────────────────────────────────────────────────
    const coreGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const coreMat = new THREE.MeshStandardMaterial({
        color: 0x39ff76,
        emissive: 0x39ff76,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.85,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // ── Orbiting rings ─────────────────────────────────────────────────────
    const makeRing = (r, tilt, color) => {
        const g = new THREE.TorusGeometry(r, 0.008, 4, 80);
        const m = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5 });
        const mesh = new THREE.Mesh(g, m);
        mesh.rotation.x = tilt;
        return mesh;
    };
    const ring1 = makeRing(1.8, Math.PI / 3, 0x00ff88);
    const ring2 = makeRing(2.0, -Math.PI / 5, 0x80ffe0);
    const ring3 = makeRing(2.2, Math.PI / 1.5, 0x40ffc0);
    scene.add(ring1, ring2, ring3);

    // ── Particle dust cloud ────────────────────────────────────────────────
    const PARTICLE_COUNT = 600;
    const pPos = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi   = Math.acos(2 * Math.random() - 1);
        const r     = 1.6 + Math.random() * 1.2;
        pPos.push(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        );
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x88ffcc, size: 0.025, transparent: true, opacity: 0.6 });
    scene.add(new THREE.Points(pGeo, pMat));

    // ── Lights ────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const pt = new THREE.PointLight(0x39ff76, 3, 20);
    pt.position.set(2, 2, 4);
    scene.add(pt);

    // ── Mouse drag interaction ─────────────────────────────────────────────
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    const targetRot = { x: 0, y: 0 };
    const currentRot = { x: 0, y: 0 };

    canvas.addEventListener('mousedown', (e) => { isDragging = true; prevMouse = { x: e.clientX, y: e.clientY }; });
    canvas.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        targetRot.y += (e.clientX - prevMouse.x) * 0.008;
        targetRot.x += (e.clientY - prevMouse.y) * 0.008;
        prevMouse = { x: e.clientX, y: e.clientY };
    });
    canvas.addEventListener('mouseup', () => isDragging = false);
    canvas.addEventListener('mouseleave', () => isDragging = false);
    canvas.style.cursor = 'grab';

    // Touch support
    canvas.addEventListener('touchstart', (e) => { isDragging = true; prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY }; });
    canvas.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        targetRot.y += (e.touches[0].clientX - prevMouse.x) * 0.008;
        targetRot.x += (e.touches[0].clientY - prevMouse.y) * 0.008;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: false });
    canvas.addEventListener('touchend', () => isDragging = false);

    // ── Animation loop ─────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        // Lerp rotation
        currentRot.x += (targetRot.x - currentRot.x) * 0.06;
        currentRot.y += (targetRot.y - currentRot.y) * 0.06;
        if (!isDragging) {
            targetRot.y += 0.003;
            targetRot.x = Math.sin(t * 0.2) * 0.2;
        }

        ico.rotation.x = currentRot.x;
        ico.rotation.y = currentRot.y;
        inner.rotation.x = -currentRot.x * 1.3;
        inner.rotation.y = -currentRot.y * 0.9;

        ring1.rotation.z = t * 0.4;
        ring2.rotation.z = -t * 0.3;
        ring3.rotation.z = t * 0.2;

        core.material.emissiveIntensity = 2 + Math.sin(t * 2) * 0.6;

        renderer.render(scene, camera);
    }
    animate();

    // ── Resize canvas on parent resize ────────────────────────────────────
    const ro = new ResizeObserver(() => {
        const nw = canvas.parentElement.offsetWidth;
        const nh = canvas.parentElement.offsetHeight;
        renderer.setSize(nw, nh);
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
    });
    ro.observe(canvas.parentElement);
})();
