
// ==========================================
// VANILLA WEBGL LIQUID METAL (DESIGN MONSTER)
// ==========================================
(function() {
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16) / 255,
            parseInt(result[2], 16) / 255,
            parseInt(result[3], 16) / 255
        ] : [0.5, 0.5, 0.5];
    }

    function initLiquidMetal() {
        const canvas = document.getElementById('liquid-metal-canvas');
        if (!canvas) return;

        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) { console.warn("WebGL not supported"); return; }

        const vertexShaderSource = `
            attribute vec2 position;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;

        const fragmentShaderSource = `
            precision highp float;
            uniform vec2 u_resolution;
            uniform float u_time;
            uniform vec3 u_color1;
            uniform vec3 u_color2;
            uniform float u_isLight;

            // Pseudo-random noise
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

            float snoise(vec2 v) {
                const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                                    0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                                   -0.577350269189626,  // -1.0 + 2.0 * C.x
                                    0.024390243902439); // 1.0 / 41.0
                vec2 i  = floor(v + dot(v, C.yy) );
                vec2 x0 = v -   i + dot(i, C.xx);
                vec2 i1;
                i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                vec4 x12 = x0.xyxy + C.xxzz;
                x12.xy -= i1;
                i = mod289(i); // Avoid truncation effects in permutation
                vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
                vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                m = m*m ;
                m = m*m ;
                vec3 x = 2.0 * fract(p * C.www) - 1.0;
                vec3 h = abs(x) - 0.5;
                vec3 ox = floor(x + 0.5);
                vec3 a0 = x - ox;
                m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
                vec3 g;
                g.x  = a0.x  * x0.x  + h.x  * x0.y;
                g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                return 130.0 * dot(m, g);
            }

            float fbm(vec2 x) {
                float v = 0.0;
                float a = 0.5;
                vec2 shift = vec2(100.0);
                // Rotate to reduce axial bias
                mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
                for (int i = 0; i < 4; ++i) {
                    v += a * snoise(x);
                    x = rot * x * 2.0 + shift;
                    a *= 0.5;
                }
                return v;
            }

            void main() {
                vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                uv.x *= u_resolution.x / u_resolution.y;

                // Time scaled
                float t = u_time * 0.2;

                // Domain warping (liquid effect)
                vec2 q = vec2(0.);
                q.x = fbm(uv + 0.00 * t);
                q.y = fbm(uv + vec2(1.0));

                vec2 r = vec2(0.);
                r.x = fbm(uv + 1.0 * q + vec2(1.7,9.2) + 0.15 * t);
                r.y = fbm(uv + 1.0 * q + vec2(8.3,2.8) + 0.126 * t);

                float f = fbm(uv + r);

                // Mix colors based on noise
                vec3 color = mix(u_color1, u_color2, clamp((f*f)*4.0, 0.0, 1.0));
                
                // Add metallic shine
                float shine = smoothstep(0.4, 0.6, f);
                color += vec3(shine * 0.3);

                // Contrast & blending
                if (u_isLight > 0.5) {
                    // Light mode: make ripples more remarkable and vibrant
                    // Base background is slightly off-white, and the liquid color mixes in stronger
                    color = mix(vec3(0.93), color, 0.5 + 0.4*shine);
                } else {
                    // Dark mode: make it deep and glowing
                    color = mix(vec3(0.08), color, 0.4 + 0.2*shine);
                }

                gl_FragColor = vec4(color, 1.0);
            }
        `;

        function createShader(gl, type, source) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = [ -1.0, -1.0,  1.0, -1.0,  -1.0, 1.0,  1.0, 1.0 ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        const resLocation = gl.getUniformLocation(program, "u_resolution");
        const timeLocation = gl.getUniformLocation(program, "u_time");
        const col1Location = gl.getUniformLocation(program, "u_color1");
        const col2Location = gl.getUniformLocation(program, "u_color2");
        const isLightLocation = gl.getUniformLocation(program, "u_isLight");

        let startTime = Date.now();

        function render() {
            // Resize canvas to match display size
            const displayWidth = canvas.clientWidth;
            const displayHeight = canvas.clientHeight;
            if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
                canvas.width = displayWidth;
                canvas.height = displayHeight;
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            }

            // Get colors from CSS variables (can be modified by CMS)
            const rs = getComputedStyle(document.documentElement);
            const c1Hex = rs.getPropertyValue('--accent-primary').trim() || '#759280';
            const c2Hex = rs.getPropertyValue('--accent-secondary').trim() || '#577364';
            const isLight = document.documentElement.getAttribute('data-theme-mode') === 'light' ? 1.0 : 0.0;

            gl.uniform2f(resLocation, canvas.width, canvas.height);
            gl.uniform1f(timeLocation, (Date.now() - startTime) / 1000.0);
            gl.uniform3fv(col1Location, hexToRgb(c1Hex));
            gl.uniform3fv(col2Location, hexToRgb(c2Hex));
            gl.uniform1f(isLightLocation, isLight);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            requestAnimationFrame(render);
        }
        render();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLiquidMetal);
    } else {
        initLiquidMetal();
    }
})();
