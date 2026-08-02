/**
 * TERMINAL CRAFT — Tesseract 3D Background
 * CSS 3D hypercube, appears on all pages as subtle background
 */
(function() {
    var wrap = document.getElementById('tesseract-wrap');
    if (!wrap) return;

    var html = '<div class="tesseract-scene">' +
        '<div class="tesseract-rotator">' +
        '<div class="tesseract-cube inner">' +
        '<div class="face front"></div>' +
        '<div class="face back"></div>' +
        '<div class="face left"></div>' +
        '<div class="face right"></div>' +
        '<div class="face top"></div>' +
        '<div class="face bottom"></div>' +
        '</div>' +
        '<div class="tesseract-cube outer">' +
        '<div class="face front"></div>' +
        '<div class="face back"></div>' +
        '<div class="face left"></div>' +
        '<div class="face right"></div>' +
        '<div class="face top"></div>' +
        '<div class="face bottom"></div>' +
        '</div>' +
        '<div class="edge e1"></div>' +
        '<div class="edge e2"></div>' +
        '<div class="edge e3"></div>' +
        '<div class="edge e4"></div>' +
        '<div class="edge e5"></div>' +
        '<div class="edge e6"></div>' +
        '<div class="edge e7"></div>' +
        '<div class="edge e8"></div>' +
        '</div></div>';

    wrap.innerHTML = html;

    var style = document.createElement('style');
    style.textContent =
        '.tesseract-scene{' +
        'width:300px;height:300px;perspective:600px;position:relative;' +
        '}' +
        '.tesseract-rotator{' +
        'width:100%;height:100%;position:relative;transform-style:preserve-3d;' +
        'animation:tesseractSpin 12s linear infinite;' +
        '}' +
        '.tesseract-cube{' +
        'position:absolute;top:50%;left:50%;transform-style:preserve-3d;' +
        '}' +
        '.tesseract-cube.inner{' +
        'width:80px;height:80px;margin:-40px 0 0 -40px;' +
        'animation:tesseractInner 12s linear infinite;' +
        '}' +
        '.tesseract-cube.outer{' +
        'width:140px;height:140px;margin:-70px 0 0 -70px;' +
        '}' +
        '.tesseract-cube .face{' +
        'position:absolute;width:100%;height:100%;' +
        'border:1px solid rgba(57,255,118,0.25);' +
        'background:rgba(57,255,118,0.02);' +
        '}' +
        '.tesseract-cube .front{transform:translateZ(50%)}' +
        '.tesseract-cube .back{transform:translateZ(-50%) rotateY(180deg)}' +
        '.tesseract-cube .left{transform:translateX(-50%) rotateY(-90deg)}' +
        '.tesseract-cube .right{transform:translateX(50%) rotateY(90deg)}' +
        '.tesseract-cube .top{transform:translateY(-50%) rotateX(90deg)}' +
        '.tesseract-cube .bottom{transform:translateY(50%) rotateX(-90deg)}' +
        '.edge{' +
        'position:absolute;width:1px;height:1px;' +
        'background:rgba(57,255,118,0.2);' +
        'top:50%;left:50%;transform-origin:0 0;' +
        '}' +
        '.e1{transform:translate3d(-40px,-40px,-40px)}' +
        '.e2{transform:translate3d(40px,-40px,-40px)}' +
        '.e3{transform:translate3d(-40px,40px,-40px)}' +
        '.e4{transform:translate3d(40px,40px,-40px)}' +
        '.e5{transform:translate3d(-40px,-40px,40px)}' +
        '.e6{transform:translate3d(40px,-40px,40px)}' +
        '.e7{transform:translate3d(-40px,40px,40px)}' +
        '.e8{transform:translate3d(40px,40px,40px)}' +
        '.tesseract-scene::after{' +
        'content:"";position:absolute;top:50%;left:50%;' +
        'width:12px;height:12px;margin:-6px 0 0 -6px;' +
        'background:radial-gradient(circle,rgba(57,255,118,0.3),transparent);' +
        'border-radius:50%;animation:glowPulse 3s ease-in-out infinite;z-index:5;' +
        '}' +
        '@keyframes tesseractSpin{' +
        '0%{transform:rotateX(0deg) rotateY(0deg)}' +
        '100%{transform:rotateX(360deg) rotateY(360deg)}' +
        '}' +
        '@keyframes tesseractInner{' +
        '0%{transform:rotateX(0deg) rotateY(0deg) rotateZ(0deg)}' +
        '100%{transform:rotateX(-360deg) rotateY(-360deg) rotateZ(-360deg)}' +
        '}' +
        '@keyframes glowPulse{' +
        '0%,100%{opacity:0.3;transform:scale(1)}' +
        '50%{opacity:0.6;transform:scale(1.3)}' +
        '}';
    document.head.appendChild(style);
})();
