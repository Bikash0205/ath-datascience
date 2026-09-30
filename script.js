/**
 * Futuristic Data-Analytics Workspace Engine
 * Asian Technology Hub (ATS) - Data Science with AI & ML
 * Incorporating 30-Second Registration Popup, Three.js 3D Brain, GSAP & Web Audio
 */

document.addEventListener('DOMContentLoaded', () => {
  initAudioSynthesizer();
  initAmbientParticles();
  initGoldenDataStreams();
  initThreeJSBrain();
  initCyberKeyboard();
  initRegistrationModal();
  initParallaxUniverse();
  initGSAPEntrance();
});

/* ==========================================================================
   1. WEB AUDIO API SYNTHESIZER
   ========================================================================== */
let audioCtx = null;
let sfxEnabled = true;

function initAudioSynthesizer() {
  const toggleBtn = document.getElementById('audioToggleBtn');
  const icon = document.getElementById('audioIcon');
  const text = document.getElementById('audioText');

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sfxEnabled = !sfxEnabled;
      if (icon) icon.textContent = sfxEnabled ? '🔊' : '🔇';
      if (text) text.textContent = sfxEnabled ? 'SFX ON' : 'MUTED';
      if (sfxEnabled) {
        getAudioContext();
        playTone(880, 'sine', 0.1, 0.08);
      }
    });
  }

  document.addEventListener('pointerdown', () => {
    if (sfxEnabled && !audioCtx) getAudioContext();
  }, { once: true });
}

function playTone(freq = 600, type = 'sine', duration = 0.1, gainVal = 0.05) {
  if (!sfxEnabled) return;
  try {
    const ctx = audioCtx || (window.AudioContext && new (window.AudioContext || window.webkitAudioContext)());
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.4, ctx.currentTime + duration);

    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

function playKeyClickSound() {
  const freqs = [540, 680, 800, 920, 1050];
  const f = freqs[Math.floor(Math.random() * freqs.length)];
  playTone(f, 'sine', 0.05, 0.04);
}

function playNeuralSpikeSound() {
  if (!sfxEnabled) return;
  try {
    const ctx = audioCtx || (window.AudioContext && new (window.AudioContext || window.webkitAudioContext)());
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {}
}

/* ==========================================================================
   2. STUDENT ENROLLMENT REGISTRATION MODAL
   ========================================================================== */
function initRegistrationModal() {
  const backdrop = document.getElementById('registrationModalBackdrop');
  const stage = document.getElementById('registrationModalStage');
  const closeBtn = document.getElementById('closeRegModalBtn');
  const navRegisterBtn = document.getElementById('navRegisterBtn');
  const heroRegisterBtn = document.getElementById('heroRegisterBtn');
  const form = document.getElementById('quickRegisterForm');
  const submitBtn = document.getElementById('submitRegBtn');

  let modalActive = false;

  function openPopup() {
    if (modalActive) return;
    modalActive = true;
    if (backdrop) backdrop.classList.add('active');
    if (stage) stage.classList.add('active');
    playTone(720, 'sine', 0.2, 0.08);

    if (typeof gsap !== 'undefined') {
      gsap.fromTo('.registration-modal-window', 
        { scale: 0.85, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)' }
      );
    }
  }

  function closePopup() {
    modalActive = false;
    if (backdrop) backdrop.classList.remove('active');
    if (stage) stage.classList.remove('active');
    playTone(480, 'sine', 0.1);
  }

  // Student Trigger Buttons (Topbar & Center Hero)
  [navRegisterBtn, heroRegisterBtn].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openPopup();
      });
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closePopup);
  if (backdrop) backdrop.addEventListener('click', closePopup);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalActive) closePopup();
  });

  // Form Submission
  if (form && submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName');
      const phone = document.getElementById('regPhone');
      const email = document.getElementById('regEmail');

      if (!name.value || !phone.value || !email.value) {
        alert('Please fill in your Name, Phone and Email to submit your enrollment application.');
        return;
      }

      const prevHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Submitting Application to Asian Technology Hub...</span>';
      submitBtn.style.pointerEvents = 'none';
      playTone(840, 'sine', 0.2);

      setTimeout(() => {
        submitBtn.innerHTML = '<span>✓ Application Received! Batch Seat Reserved</span>';
        submitBtn.style.background = 'linear-gradient(135deg, #059669 0%, #10b981 100%)';
        playTone(1100, 'sine', 0.35);

        setTimeout(() => {
          alert(`Thank you, ${name.value}! Your enrollment application for Data Science with AI & ML has been confirmed. Our academic counselor will reach out via WhatsApp/Phone shortly.`);
          submitBtn.innerHTML = prevHtml;
          submitBtn.style.background = '';
          submitBtn.style.pointerEvents = 'auto';
          form.reset();
          closePopup();
        }, 1000);
      }, 900);
    });
  }
}

/* ==========================================================================
   3. AMBIENT ZERO-GRAVITY PARTICLES CANVAS
   ========================================================================== */
function initAmbientParticles() {
  const canvas = document.getElementById('ambientParticlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(110, Math.floor(width / 14));
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.8 + 0.6,
      alpha: Math.random() * 0.7 + 0.2,
      isGold: Math.random() > 0.75,
      pulse: Math.random() * Math.PI * 2
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.02;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      const alphaPulse = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.isGold
        ? `rgba(251, 191, 36, ${alphaPulse})`
        : `rgba(56, 189, 248, ${alphaPulse})`;
      ctx.shadowBlur = p.isGold ? 8 : 10;
      ctx.shadowColor = p.isGold ? '#fbbf24' : '#38bdf8';
      ctx.fill();

      // Constellation link
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 85) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - dist / 85) * 0.12})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   4. GOLDEN DIGITAL DATA CONDUITS
   ========================================================================== */
function initGoldenDataStreams() {
  const canvas = document.getElementById('goldenStreamsCanvas');
  const stage = document.getElementById('workspaceStage');
  const centerPanel = document.getElementById('centerGlassPanel');
  const widgets = [
    document.getElementById('holoDataViz'),
    document.getElementById('holoVideo'),
    document.getElementById('holoFinance'),
    document.getElementById('holoTopics')
  ];

  if (!canvas || !stage || !centerPanel) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  function resize() {
    canvas.width = stage.clientWidth;
    canvas.height = stage.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const packets = [];
  for (let i = 0; i < 20; i++) {
    packets.push({
      widgetIndex: i % widgets.length,
      progress: Math.random(),
      speed: 0.005 + Math.random() * 0.004,
      size: 2.2 + Math.random() * 1.8
    });
  }

  function drawStreams() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const sRect = stage.getBoundingClientRect();
    const cRect = centerPanel.getBoundingClientRect();
    const cX = cRect.left - sRect.left + cRect.width / 2;
    const cY = cRect.top - sRect.top + cRect.height / 2;

    widgets.forEach((w) => {
      if (!w || w.offsetParent === null) return;
      const wRect = w.getBoundingClientRect();
      const wX = wRect.left - sRect.left + wRect.width / 2;
      const wY = wRect.top - sRect.top + wRect.height / 2;
      const cpX = (cX + wX) / 2;
      const cpY = (cY + wY) / 2 - 25;

      ctx.beginPath();
      ctx.moveTo(cX, cY);
      ctx.quadraticCurveTo(cpX, cpY, wX, wY);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.2)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    packets.forEach(pkt => {
      pkt.progress += pkt.speed;
      if (pkt.progress > 1) pkt.progress = 0;

      const w = widgets[pkt.widgetIndex];
      if (!w || w.offsetParent === null) return;
      const wRect = w.getBoundingClientRect();
      const wX = wRect.left - sRect.left + wRect.width / 2;
      const wY = wRect.top - sRect.top + wRect.height / 2;
      const cpX = (cX + wX) / 2;
      const cpY = (cY + wY) / 2 - 25;

      const t = pkt.progress;
      const x = (1 - t) * (1 - t) * cX + 2 * (1 - t) * t * cpX + t * t * wX;
      const y = (1 - t) * (1 - t) * cY + 2 * (1 - t) * t * cpY + t * t * wY;

      ctx.beginPath();
      ctx.arc(x, y, pkt.size, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 10;
      ctx.fill();
    });

    requestAnimationFrame(drawStreams);
  }

  drawStreams();
}

/* ==========================================================================
   5. THREE.JS 3D WIREFRAME BRAIN HOLOGRAM
   ========================================================================== */
function initThreeJSBrain() {
  const container = document.getElementById('brainViewport');
  const canvas = document.getElementById('brain3DCanvas');
  if (!container || !canvas || typeof THREE === 'undefined') return;

  const width = container.clientWidth || 320;
  const height = container.clientHeight || 220;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 1, 26);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const brainGroup = new THREE.Group();
  scene.add(brainGroup);

  // Anatomical Two-Hemisphere Cortical Point Geometry
  const pointCount = 850;
  const positions = [];
  const colors = [];
  const baseColor = new THREE.Color(0x38bdf8);

  for (let i = 0; i < pointCount; i++) {
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * Math.PI;
    const hemi = Math.random() > 0.5 ? 1 : -1;

    const rx = 6.4 + Math.sin(u * 4) * 0.7 + Math.cos(v * 3) * 0.5;
    const ry = 5.2 + Math.cos(u * 3) * 0.8 + Math.sin(v * 4) * 0.4;
    const rz = 7.8 + Math.sin(v * 2) * 0.9;

    let x = Math.sin(v) * Math.cos(u) * rx;
    let y = Math.cos(v) * ry;
    let z = Math.sin(v) * Math.sin(u) * rz;

    x += hemi * 1.1;

    positions.push(x, y, z);
    colors.push(baseColor.r, baseColor.g, baseColor.b);
  }

  const brainGeom = new THREE.BufferGeometry();
  brainGeom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  brainGeom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const pMaterial = new THREE.PointsMaterial({
    size: 0.55,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });
  const brainPoints = new THREE.Points(brainGeom, pMaterial);
  brainGroup.add(brainPoints);

  // Synaptic Connecting Lines
  const linePositions = [];
  const posArr = brainGeom.attributes.position.array;
  for (let i = 0; i < pointCount; i += 2) {
    const x1 = posArr[i * 3];
    const y1 = posArr[i * 3 + 1];
    const z1 = posArr[i * 3 + 2];

    for (let j = i + 1; j < Math.min(i + 5, pointCount); j++) {
      const x2 = posArr[j * 3];
      const y2 = posArr[j * 3 + 1];
      const z2 = posArr[j * 3 + 2];
      const dist = Math.hypot(x1 - x2, y1 - y2, z1 - z2);

      if (dist < 4.0) {
        linePositions.push(x1, y1, z1, x2, y2, z2);
      }
    }
  }

  const lineGeom = new THREE.BufferGeometry();
  lineGeom.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x0284c7,
    transparent: true,
    opacity: 0.38,
    blending: THREE.AdditiveBlending
  });
  const brainLines = new THREE.LineSegments(lineGeom, lineMaterial);
  brainGroup.add(brainLines);

  // Traveling Neural Synaptic Sparks
  const sparkCount = 30;
  const sparkGeom = new THREE.BufferGeometry();
  const sparkPos = new Float32Array(sparkCount * 3);
  for (let k = 0; k < sparkCount * 3; k++) {
    sparkPos[k] = (Math.random() - 0.5) * 10;
  }
  sparkGeom.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));

  const sparkMat = new THREE.PointsMaterial({
    size: 1.1,
    color: 0xfbbf24,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending
  });
  const sparkPoints = new THREE.Points(sparkGeom, sparkMat);
  brainGroup.add(sparkPoints);

  // Mouse drag rotation
  let isDragging = false;
  let prevX = 0;
  let prevY = 0;

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevX = e.clientX;
    prevY = e.clientY;
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - prevX;
    const dy = e.clientY - prevY;
    brainGroup.rotation.y += dx * 0.008;
    brainGroup.rotation.x += dy * 0.008;
    prevX = e.clientX;
    prevY = e.clientY;
  });

  // Synaptic Spike Trigger
  function triggerSpike() {
    playNeuralSpikeSound();
    if (typeof gsap !== 'undefined') {
      gsap.to(brainGroup.scale, {
        x: 1.16,
        y: 1.16,
        z: 1.16,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out'
      });
      gsap.to(lineMaterial, { opacity: 0.85, duration: 0.15, yoyo: true, repeat: 1 });
      gsap.to(pMaterial, { size: 0.85, duration: 0.15, yoyo: true, repeat: 1 });
    }
  }

  const spikeBtn = document.getElementById('spikeNeuralBtn');
  if (spikeBtn) spikeBtn.addEventListener('click', triggerSpike);

  window.triggerGlobalBrainSpike = triggerSpike;

  // Animation Loop
  let clock = new THREE.Clock();
  function render() {
    const elapsed = clock.getElapsedTime();

    if (!isDragging) {
      brainGroup.rotation.y = elapsed * 0.35;
      brainGroup.rotation.x = Math.sin(elapsed * 0.35) * 0.12;
    }

    const sAttr = sparkGeom.attributes.position;
    for (let i = 0; i < sparkCount; i++) {
      const idx = (Math.floor(elapsed * 8 + i * 14)) % pointCount;
      sAttr.setXYZ(i, posArr[idx * 3], posArr[idx * 3 + 1], posArr[idx * 3 + 2]);
    }
    sAttr.needsUpdate = true;

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   6. INTERACTIVE CYBER KEYBOARD
   ========================================================================== */
function initCyberKeyboard() {
  const keyboard = document.getElementById('cyberKeyboard');
  if (!keyboard) return;

  const keys = keyboard.querySelectorAll('.k');

  keys.forEach(k => {
    k.addEventListener('click', () => {
      flashKey(k);
      playKeyClickSound();
      if (window.triggerGlobalBrainSpike && Math.random() > 0.3) {
        window.triggerGlobalBrainSpike();
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    const keyChar = e.key.toLowerCase();
    let matched = null;

    keys.forEach(k => {
      const attr = k.getAttribute('data-k');
      if (attr === keyChar || (attr === 'space' && e.code === 'Space')) {
        matched = k;
      }
    });

    if (matched) {
      flashKey(matched);
      playKeyClickSound();
      if (window.triggerGlobalBrainSpike && Math.random() > 0.4) {
        window.triggerGlobalBrainSpike();
      }
    }
  });

  function flashKey(keyEl) {
    keyEl.classList.add('k-active');
    setTimeout(() => keyEl.classList.remove('k-active'), 140);
  }
}

/* ==========================================================================
   7. PARALLAX UNIVERSE
   ========================================================================== */
function initParallaxUniverse() {
  const universe = document.getElementById('universeContainer');
  const spaceBg = document.getElementById('spacePanoramicBg');
  if (!universe) return;

  let mouseX = 0;
  let mouseY = 0;
  let curX = 0;
  let curY = 0;

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    mouseX = (e.clientX - cx) / cx;
    mouseY = (e.clientY - cy) / cy;
  });

  function update() {
    curX += (mouseX - curX) * 0.05;
    curY += (mouseY - curY) * 0.05;

    if (window.innerWidth > 768) {
      if (universe) {
        universe.style.transform = `rotateY(${curX * 6}deg) rotateX(${-curY * 4}deg)`;
      }
      if (spaceBg) {
        spaceBg.style.transform = `translateZ(-200px) scale(1.12) translate(${curX * -20}px, ${curY * -12}px)`;
      }
    }

    requestAnimationFrame(update);
  }

  update();
}

/* ==========================================================================
   8. GSAP ENTRANCE ANIMATION
   ========================================================================== */
function initGSAPEntrance() {
  if (typeof gsap === 'undefined') return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.cyber-topbar', { y: -70, opacity: 0, duration: 0.7 });
  tl.from('#centerGlassPanel', { scale: 0.9, opacity: 0, y: 35, duration: 0.9 }, '-=0.3');
  tl.from('#hologramStation', { scale: 0.75, opacity: 0, duration: 0.8 }, '-=0.5');
  tl.from('.holo-widget', { scale: 0.8, opacity: 0, stagger: 0.12, duration: 0.7 }, '-=0.4');
  tl.from('#cyberKeyboard', { y: 40, opacity: 0, duration: 0.7 }, '-=0.3');
}
