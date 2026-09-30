/**
 * Asian Technology Hub (ATS) - Data Science with AI & ML
 * High-Performance Engine: Three.js 3D Brain, Lottie Vector Animations, Mobile Drawer & 5s Popup
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientStars();
  initLottieAnimations();
  initEducationalDoodles();
  initGsapScrollAnimations();
  initMobileDrawer();
  initRegistrationModal();
  initFaqAccordion();
});

/* ==========================================================================
   1. AMBIENT DRIFTING STAR PARTICLES & INTERACTIVE DOODLE CHALK TRAIL
   ========================================================================== */
function initAmbientStars() {
  const canvas = document.getElementById('ambientCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Star & Math doodle particle pool
  const mathSymbols = ['+', '×', '∑', '√', '∫', 'π', 'λ', '0', '1', '✦', '∆'];
  const starCount = Math.min(50, Math.floor(width / 24));
  const stars = [];

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.5 + 0.6,
      alpha: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      symbol: Math.random() > 0.6 ? mathSymbols[Math.floor(Math.random() * mathSymbols.length)] : null,
      symbolSize: Math.floor(Math.random() * 4) + 10,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.015
    });
  }

  // Interactive continuous mouse chalk ribbon
  const mouseRibbon = [];
  const maxRibbonPoints = 28;

  window.addEventListener('mousemove', (e) => {
    if (prefersReducedMotion) return;
    mouseRibbon.push({
      x: e.clientX,
      y: e.clientY,
      life: 1.0
    });
    if (mouseRibbon.length > maxRibbonPoints) {
      mouseRibbon.shift();
    }
  }, { passive: true });

  // Interactive mouse chalk doodle trail particles
  const trailParticles = [];
  const maxTrail = 40;

  window.addEventListener('mousemove', (e) => {
    if (prefersReducedMotion) return;
    if (trailParticles.length < maxTrail && Math.random() > 0.45) {
      trailParticles.push({
        x: e.clientX,
        y: e.clientY + window.scrollY,
        vx: (Math.random() - 0.5) * 1.4,
        vy: (Math.random() - 0.5) * 1.4 - 0.4,
        size: Math.random() * 10 + 8,
        symbol: mathSymbols[Math.floor(Math.random() * mathSymbols.length)],
        life: 1.0,
        decay: 0.025 + Math.random() * 0.02,
        rot: Math.random() * Math.PI * 2
      });
    }
  }, { passive: true });

  // Click burst doodle chalk particles
  window.addEventListener('click', (e) => {
    if (prefersReducedMotion) return;
    const burstCount = 8;
    for (let b = 0; b < burstCount; b++) {
      const angle = (b / burstCount) * Math.PI * 2 + (Math.random() - 0.5);
      const speed = Math.random() * 2.8 + 1.8;
      trailParticles.push({
        x: e.clientX,
        y: e.clientY + window.scrollY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        size: Math.random() * 8 + 10,
        symbol: mathSymbols[Math.floor(Math.random() * mathSymbols.length)],
        life: 1.0,
        decay: 0.02 + Math.random() * 0.015,
        rot: Math.random() * Math.PI * 2
      });
    }
  }, { passive: true });

  // Live Automated Whiteboard Ghost Sketcher (Constantly sketching AI & Math formulas!)
  const activeSketches = [];
  const sketchTypes = ['sineWave', 'neuralNet', 'normalDist', 'eulerSpiral', 'softmaxAttn'];
  let lastSketchTime = Date.now();

  function spawnGhostSketch() {
    if (activeSketches.length >= 3) return;
    const type = sketchTypes[Math.floor(Math.random() * sketchTypes.length)];
    const margin = 110;
    const cx = Math.random() * (width - margin * 2) + margin;
    const cy = Math.random() * (height - margin * 2) + margin;
    activeSketches.push({
      type,
      cx,
      cy,
      progress: 0,
      phase: 'drawing',
      holdTime: 0,
      alpha: 0,
      maxAlpha: Math.random() * 0.24 + 0.28,
      scale: Math.random() * 0.35 + 0.85
    });
  }

  // Scroll reaction drift boost
  let scrollBoostY = 0;
  let lastScrollPos = window.scrollY;
  window.addEventListener('scroll', () => {
    if (prefersReducedMotion) return;
    const currentScroll = window.scrollY;
    const scrollDelta = currentScroll - lastScrollPos;
    lastScrollPos = currentScroll;
    scrollBoostY = Math.max(-4, Math.min(4, -scrollDelta * 0.1));
  }, { passive: true });

  function renderParticles() {
    ctx.clearRect(0, 0, width, height);

    // Fade scroll boost back to 0 smoothly
    scrollBoostY *= 0.92;

    // 1. Render ambient stars & floating math doodles
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      if (!prefersReducedMotion) {
        s.x += s.vx;
        s.y += s.vy + scrollBoostY;
        s.pulse += 0.02;
        s.rot += s.rotSpeed;

        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;
      }

      const currentAlpha = s.alpha * (0.6 + 0.4 * Math.sin(s.pulse));

      if (s.symbol) {
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        ctx.font = `${s.symbolSize}px 'JetBrains Mono', monospace, sans-serif`;
        ctx.fillStyle = `rgba(37, 99, 235, ${currentAlpha * 0.28})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(s.symbol, 0, 0);
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, ${currentAlpha * 0.32})`;
        ctx.fill();
      }

      // Constellation links between nearby stars
      for (let j = i + 1; j < stars.length; j++) {
        const s2 = stars[j];
        const dx = s.x - s2.x;
        const dy = s.y - s2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 80) {
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s2.x, s2.y);
          ctx.strokeStyle = `rgba(37, 99, 235, ${(1 - dist / 80) * 0.045})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // 2. Render live Ghost Whiteboard Sketches
    const now = Date.now();
    if (now - lastSketchTime > 2200 && !prefersReducedMotion) {
      lastSketchTime = now;
      spawnGhostSketch();
    }

    for (let sIdx = activeSketches.length - 1; sIdx >= 0; sIdx--) {
      const gs = activeSketches[sIdx];
      if (gs.phase === 'drawing') {
        gs.progress += 0.016;
        gs.alpha = Math.min(gs.maxAlpha, gs.alpha + 0.02);
        if (gs.progress >= 1.0) {
          gs.progress = 1.0;
          gs.phase = 'holding';
          gs.holdTime = now;
        }
      } else if (gs.phase === 'holding') {
        if (now - gs.holdTime > 2500) {
          gs.phase = 'fading';
        }
      } else if (gs.phase === 'fading') {
        gs.alpha -= 0.008;
        if (gs.alpha <= 0) {
          activeSketches.splice(sIdx, 1);
          continue;
        }
      }

      ctx.save();
      ctx.translate(gs.cx, gs.cy);
      ctx.scale(gs.scale, gs.scale);
      ctx.strokeStyle = `rgba(37, 99, 235, ${gs.alpha})`;
      ctx.fillStyle = `rgba(37, 99, 235, ${gs.alpha})`;
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      let penTip = null;

      if (gs.type === 'sineWave') {
        ctx.beginPath();
        ctx.moveTo(-60, 0); ctx.lineTo(60, 0);
        ctx.moveTo(0, -35); ctx.lineTo(0, 35);
        ctx.stroke();

        const totalPoints = 60;
        const drawCount = Math.floor(totalPoints * gs.progress);
        if (drawCount > 1) {
          ctx.beginPath();
          for (let p = 0; p < drawCount; p++) {
            const px = -55 + (p / totalPoints) * 110;
            const py = -Math.sin((p / totalPoints) * Math.PI * 4) * 24;
            if (p === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
            if (p === drawCount - 1) penTip = { x: px, y: py };
          }
          ctx.stroke();
        }
        if (gs.progress > 0.6) {
          ctx.font = "11px 'JetBrains Mono', monospace";
          ctx.fillText("sin(ωt)", 15, -20);
        }
      } else if (gs.type === 'normalDist') {
        ctx.beginPath();
        ctx.moveTo(-65, 25); ctx.lineTo(65, 25);
        ctx.moveTo(0, 25); ctx.lineTo(0, -35);
        ctx.stroke();

        const totalPoints = 50;
        const drawCount = Math.floor(totalPoints * gs.progress);
        if (drawCount > 1) {
          ctx.beginPath();
          for (let p = 0; p < drawCount; p++) {
            const normX = -2.5 + (p / totalPoints) * 5.0;
            const px = normX * 24;
            const py = 25 - Math.exp(-(normX * normX) / 2) * 55;
            if (p === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
            if (p === drawCount - 1) penTip = { x: px, y: py };
          }
          ctx.stroke();
        }
        if (gs.progress > 0.7) {
          ctx.font = "11px 'JetBrains Mono', monospace";
          ctx.fillText("N(μ, σ²)", 12, -22);
        }
      } else if (gs.type === 'neuralNet') {
        const inNodes = [-18, 18];
        const hidNodes = [-26, 0, 26];
        const outNode = 0;

        const connProgress = Math.min(1, gs.progress * 1.5);
        ctx.beginPath();
        inNodes.forEach(iy => {
          hidNodes.forEach(hy => {
            ctx.moveTo(-45, iy);
            ctx.lineTo(-45 + 45 * connProgress, iy + (hy - iy) * connProgress);
          });
        });
        hidNodes.forEach(hy => {
          ctx.moveTo(0, hy);
          ctx.lineTo(45 * connProgress, hy + (outNode - hy) * connProgress);
        });
        ctx.stroke();

        if (gs.progress > 0.2) {
          inNodes.forEach(iy => {
            ctx.beginPath(); ctx.arc(-45, iy, 4, 0, Math.PI * 2); ctx.stroke();
          });
        }
        if (gs.progress > 0.5) {
          hidNodes.forEach(hy => {
            ctx.beginPath(); ctx.arc(0, hy, 4, 0, Math.PI * 2); ctx.stroke();
          });
        }
        if (gs.progress > 0.8) {
          ctx.beginPath(); ctx.arc(45, outNode, 4, 0, Math.PI * 2); ctx.stroke();
          ctx.font = "10px 'JetBrains Mono', monospace";
          ctx.fillText("σ(Wx+b)", 18, 22);
        }
      } else if (gs.type === 'eulerSpiral') {
        const totalSteps = 45;
        const drawSteps = Math.floor(totalSteps * gs.progress);
        if (drawSteps > 1) {
          ctx.beginPath();
          for (let s = 0; s < drawSteps; s++) {
            const rad = s * 0.18;
            const r = s * 0.9;
            const px = Math.cos(rad) * r;
            const py = Math.sin(rad) * r;
            if (s === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
            if (s === drawSteps - 1) penTip = { x: px, y: py };
          }
          ctx.stroke();
        }
        if (gs.progress > 0.7) {
          ctx.font = "11px 'JetBrains Mono', monospace";
          ctx.fillText("∇f(θ)", 15, -15);
        }
      } else if (gs.type === 'softmaxAttn') {
        ctx.strokeRect(-35, -25, 70, 50);
        ctx.beginPath();
        ctx.moveTo(-35, 0); ctx.lineTo(35, 0);
        ctx.moveTo(0, -25); ctx.lineTo(0, 25);
        ctx.stroke();

        if (gs.progress > 0.5) {
          ctx.beginPath();
          ctx.arc(0, 0, 15 * gs.progress, 0, Math.PI * 2);
          ctx.stroke();
        }
        if (gs.progress > 0.7) {
          ctx.font = "10px 'JetBrains Mono', monospace";
          ctx.fillText("QKᵀ/√d", -20, -30);
        }
      }

      if (penTip && gs.phase === 'drawing') {
        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.arc(penTip.x, penTip.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = "12px sans-serif";
        ctx.fillText("✦", penTip.x + 4, penTip.y - 4);
      }

      ctx.restore();
    }

    // 3. Render continuous chalk ribbon following mouse
    for (let r = 0; r < mouseRibbon.length; r++) {
      mouseRibbon[r].life -= 0.035;
    }
    while (mouseRibbon.length > 0 && mouseRibbon[0].life <= 0) {
      mouseRibbon.shift();
    }
    if (mouseRibbon.length > 1) {
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (let r = 1; r < mouseRibbon.length; r++) {
        const p1 = mouseRibbon[r - 1];
        const p2 = mouseRibbon[r];
        const alpha = p2.life * 0.35;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
        ctx.lineWidth = p2.life * 4.5 + 0.5;
        ctx.stroke();
      }
      ctx.restore();
    }

    // 4. Render active mouse chalk doodle trail
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      if (!prefersReducedMotion) {
        s.x += s.vx;
        s.y += s.vy + scrollBoostY;
        s.pulse += 0.02;
        s.rot += s.rotSpeed;

        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;
      }

      const currentAlpha = s.alpha * (0.6 + 0.4 * Math.sin(s.pulse));

      if (s.symbol) {
        // Draw tiny subtle chalk doodle symbol
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        ctx.font = `${s.symbolSize}px 'JetBrains Mono', monospace, sans-serif`;
        ctx.fillStyle = `rgba(37, 99, 235, ${currentAlpha * 0.28})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(s.symbol, 0, 0);
        ctx.restore();
      } else {
        // Draw star particle
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, ${currentAlpha * 0.32})`;
        ctx.fill();
      }

      // Constellation links between nearby stars
      for (let j = i + 1; j < stars.length; j++) {
        const s2 = stars[j];
        const dx = s.x - s2.x;
        const dy = s.y - s2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 80) {
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s2.x, s2.y);
          ctx.strokeStyle = `rgba(37, 99, 235, ${(1 - dist / 80) * 0.045})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // 2. Render active mouse chalk doodle trail
    const scrollY = window.scrollY;
    for (let k = trailParticles.length - 1; k >= 0; k--) {
      const p = trailParticles[k];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      p.rot += 0.02;

      if (p.life <= 0) {
        trailParticles.splice(k, 1);
        continue;
      }

      const screenY = p.y - scrollY;
      if (screenY >= -50 && screenY <= height + 50) {
        ctx.save();
        ctx.translate(p.x, screenY);
        ctx.rotate(p.rot);
        ctx.font = `bold ${p.size}px 'JetBrains Mono', monospace, sans-serif`;
        ctx.fillStyle = `rgba(37, 99, 235, ${p.life * 0.38})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.symbol, 0, 0);
        ctx.restore();
      }
    }

    requestAnimationFrame(renderParticles);
  }

  renderParticles();
}

/* ==========================================================================
   2. THREE.JS 3D LUMINOUS BRAIN HOLOGRAM
   ========================================================================== */
function initThreeJSBrain() {
  const container = document.getElementById('brainViewport');
  const canvas = document.getElementById('brain3DCanvas');
  if (!container || !canvas || typeof THREE === 'undefined') return;

  const width = container.clientWidth || 600;
  const height = container.clientHeight || 350;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 7.2);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Procedural Brain Dual Hemisphere Point Cloud
  const particleCount = 1600;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const baseColor = new THREE.Color(0x38bdf8);
  const purpleColor = new THREE.Color(0x818cf8);
  const goldColor = new THREE.Color(0xfbbf24);

  const nodes = [];

  for (let i = 0; i < particleCount; i++) {
    const isLeftHemisphere = i < particleCount / 2;
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);

    let r = 2.3 * Math.cbrt(Math.random() * 0.4 + 0.6);
    let x = r * Math.sin(phi) * Math.cos(theta);
    let y = r * Math.sin(phi) * Math.sin(theta) * 0.85;
    let z = r * Math.cos(phi) * 1.15;

    // Sulci convolutions
    const fold = Math.sin(x * 3.8) * Math.cos(y * 3.8) * Math.sin(z * 3.8) * 0.2;
    x += fold;
    y += fold;
    z += fold;

    const gap = 0.24;
    if (isLeftHemisphere) {
      x = -Math.abs(x) - gap;
    } else {
      x = Math.abs(x) + gap;
    }

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    nodes.push(new THREE.Vector3(x, y, z));

    const rnd = Math.random();
    const c = rnd > 0.85 ? goldColor : (rnd > 0.5 ? purpleColor : baseColor);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });

  const brainPoints = new THREE.Points(geometry, material);
  scene.add(brainPoints);

  // Synaptic Connecting Lines
  const linePositions = [];
  const maxDistance = 0.52;
  for (let i = 0; i < nodes.length; i += 4) {
    for (let j = i + 1; j < nodes.length; j += 4) {
      const d = nodes[i].distanceTo(nodes[j]);
      if (d < maxDistance) {
        linePositions.push(nodes[i].x, nodes[i].y, nodes[i].z);
        linePositions.push(nodes[j].x, nodes[j].y, nodes[j].z);
      }
    }
  }

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending
  });

  const neuralLines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(neuralLines);

  // Mouse Interaction Rotation
  let isDragging = false;
  let previousMouseX = 0;
  let previousMouseY = 0;
  let targetRotY = 0;
  let targetRotX = 0;

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMouseX = e.clientX;
    previousMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousMouseX;
    const deltaY = e.clientY - previousMouseY;
    targetRotY += deltaX * 0.008;
    targetRotX += deltaY * 0.008;
    previousMouseX = e.clientX;
    previousMouseY = e.clientY;
  });

  // Touch Support for Mobile
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      previousMouseX = e.touches[0].clientX;
      previousMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => { isDragging = false; });
  canvas.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMouseX;
    const deltaY = e.touches[0].clientY - previousMouseY;
    targetRotY += deltaX * 0.008;
    targetRotX += deltaY * 0.008;
    previousMouseX = e.touches[0].clientX;
    previousMouseY = e.touches[0].clientY;
  }, { passive: true });

  // Animation Loop
  let clock = new THREE.Clock();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    if (!prefersReducedMotion) {
      brainPoints.rotation.y += 0.003;
      brainPoints.position.y = Math.sin(elapsedTime * 1.4) * 0.1;
      neuralLines.position.y = brainPoints.position.y;
    }

    brainPoints.rotation.y += (targetRotY - brainPoints.rotation.y) * 0.05;
    brainPoints.rotation.x += (targetRotX - brainPoints.rotation.x) * 0.05;

    neuralLines.rotation.y = brainPoints.rotation.y;
    neuralLines.rotation.x = brainPoints.rotation.x;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    if (!container) return;
    const w = container.clientWidth || 600;
    const h = container.clientHeight || 350;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

let lottieNeuralAnim = null;
let lottieAnalyticsAnim = null;

/* ==========================================================================
   3. LOTTIE ANIMATIONS (HERO AI CORE & DISTRIBUTED TELEMETRY STREAM)
   ========================================================================== */
function initLottieAnimations() {
  if (typeof lottie === 'undefined') return;

  // Lottie 1: Interactive AI Neural Core (Hero micro-sandbox or showcase)
  const heroCoreContainer = document.getElementById('lottieHeroCore') || document.getElementById('lottieNeuralCore');
  if (heroCoreContainer) {
    fetch('lottie_neural_core.json')
      .then(res => res.json())
      .then(data => {
        lottieNeuralAnim = lottie.loadAnimation({
          container: heroCoreContainer,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: data
        });
      })
      .catch(e => console.warn('Lottie neural core load error:', e));
  }

  // Lottie 2: Distributed GPU Loss Telemetry Stream (Curriculum or projects)
  const analyticsStreamContainer = document.getElementById('lottieAnalyticsStream') || document.getElementById('lottieAnalyticsWave');
  if (analyticsStreamContainer) {
    fetch('lottie_analytics_wave.json')
      .then(res => res.json())
      .then(data => {
        lottieAnalyticsAnim = lottie.loadAnimation({
          container: analyticsStreamContainer,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: data
        });
      })
      .catch(e => console.warn('Lottie analytics stream load error:', e));
  }
}

/* ==========================================================================
   3.1. GSAP EDUCATIONAL DOODLING ENGINE & INTERACTIVE SKETCH PHYSICS
   ========================================================================== */
function initEducationalDoodles() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Prepare SVG Doodle Paths for Live Pen Drawing
  const doodlePaths = document.querySelectorAll('.doodle-path');
  doodlePaths.forEach(path => {
    try {
      const length = path.getTotalLength();
      if (length && length > 0) {
        path.style.strokeDasharray = length;
        if (!prefersReducedMotion) {
          path.style.strokeDashoffset = length;
        } else {
          path.style.strokeDashoffset = '0';
        }
      }
    } catch (e) {}
  });

  if (prefersReducedMotion) return;

  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // 2. Hero title squiggly underline drawing
    const heroUnderline = document.querySelector('.doodle-underline-svg .doodle-path');
    if (heroUnderline) {
      gsap.to(heroUnderline, {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: 'power2.out',
        delay: 0.5
      });
    }

    // Hero CTA arrow pointer drawing
    const ctaArrowPaths = document.querySelectorAll('.doodle-cta-pointer .doodle-path');
    if (ctaArrowPaths.length > 0) {
      gsap.to(ctaArrowPaths, {
        strokeDashoffset: 0,
        duration: 1.2,
        stagger: 0.25,
        ease: 'power2.out',
        delay: 0.8
      });
    }

    // Ambient floating hero doodles stroke reveal sequence
    const ambientHeroDoodlePaths = document.querySelectorAll('.educational-doodles-layer .doodle-path');
    if (ambientHeroDoodlePaths.length > 0) {
      gsap.to(ambientHeroDoodlePaths, {
        strokeDashoffset: 0,
        duration: 1.6,
        stagger: 0.12,
        ease: 'power1.inOut',
        delay: 0.3
      });
    }

    // 3. ScrollTrigger-driven Stroke Drawing for subsequent sections
    if (typeof ScrollTrigger !== 'undefined') {
      // Metric card 100% loop circle
      const loopCircle = document.querySelector('.doodle-loop-circle .doodle-path');
      if (loopCircle) {
        gsap.to(loopCircle, {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: loopCircle,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });
      }

      // Section Ambient Doodles Stroke Reveal on Scroll
      ScrollTrigger.batch('.doodle-ambient .doodle-path', {
        start: 'top 88%',
        onEnter: batch => {
          gsap.to(batch, {
            strokeDashoffset: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: 'power2.out',
            overwrite: true
          });
        },
        once: true
      });

      // Roadmap curved arrow
      const roadmapArrow = document.querySelector('.doodle-curved-arrow .doodle-path');
      if (roadmapArrow) {
        gsap.to(roadmapArrow, {
          strokeDashoffset: 0,
          duration: 1.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: roadmapArrow,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });
      }

      // Projects mini star doodle
      const projStar = document.querySelector('.doodle-star-mini .doodle-path');
      if (projStar) {
        gsap.to(projStar, {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: projStar,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });
      }

      // Outcome CTA mini sparkle
      const ctaSparkle = document.querySelector('.doodle-sparkle-mini .doodle-path');
      if (ctaSparkle) {
        gsap.to(ctaSparkle, {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ctaSparkle,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });
      }

      // Live Telemetry Pulse Path (continuous electrocardiogram/loss heartbeat)
      const pulsePath = document.querySelector('.doodle-pulse-path');
      if (pulsePath) {
        const pulseLen = pulsePath.getTotalLength() || 100;
        gsap.set(pulsePath, { strokeDasharray: pulseLen, strokeDashoffset: 0 });
        gsap.to(pulsePath, {
          strokeDashoffset: -pulseLen * 2,
          duration: 3,
          repeat: -1,
          ease: 'linear'
        });
      }

      // 4. Interactive Roadmap Scrub Track: Snake line draws as user scrolls down!
      const roadmapTrack = document.querySelector('.roadmap-scrub-path');
      const travelingDot = document.querySelector('.roadmap-traveling-dot');
      if (roadmapTrack) {
        const pathLen = roadmapTrack.getTotalLength() || 1000;
        roadmapTrack.style.strokeDasharray = pathLen;
        roadmapTrack.style.strokeDashoffset = pathLen;

        ScrollTrigger.create({
          trigger: '.curriculum-roadmap-wrap',
          start: 'top 75%',
          end: 'bottom 50%',
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const currentOffset = pathLen * (1 - progress);
            roadmapTrack.style.strokeDashoffset = currentOffset;
            if (travelingDot) {
              travelingDot.style.opacity = progress > 0.02 && progress < 0.98 ? '1' : '0';
              try {
                const point = roadmapTrack.getPointAtLength(pathLen * progress);
                travelingDot.style.left = `${point.x - 5}px`;
                travelingDot.style.top = `${point.y - 5}px`;
              } catch (e) {}
            }
          }
        });
      }

      // 4.1. Vertical Full-Page Educational Doodle Snake Trail & Traveling Pencil
      const globalSnakePath = document.querySelector('.global-snake-path');
      const globalPencil = document.getElementById('globalTravelingPencil');
      const mainContent = document.getElementById('mainContent');

      if (globalSnakePath && mainContent) {
        ScrollTrigger.create({
          trigger: mainContent,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.2,
          onUpdate: (self) => {
            const p = self.progress;
            if (globalPencil) {
              const contentHeight = mainContent.offsetHeight;
              const currentY = p * (contentHeight - 60);
              const oscX = Math.sin(p * Math.PI * 16) * 20;
              globalPencil.style.transform = `translate3d(${oscX}px, ${currentY}px, 0)`;
            }
          }
        });
      }

      // 4.2. Title Doodle Scribble Underlines Revealed on Scroll
      ScrollTrigger.batch('.doodle-title-scribble', {
        start: 'top 88%',
        onEnter: (batch) => {
          batch.forEach((svg) => {
            svg.classList.add('in-view');
          });
        },
        once: true
      });

      // 4.3. Animated Metric & Outcome Number Counters on Scroll
      const counters = document.querySelectorAll('.counter-val');
      counters.forEach((counter) => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const isDecimal = counter.getAttribute('data-decimal') !== null;
        if (isNaN(target)) return;

        ScrollTrigger.create({
          trigger: counter,
          start: 'top 92%',
          once: true,
          onEnter: () => {
            const obj = { val: 0 };
            gsap.to(obj, {
              val: target,
              duration: 1.6,
              ease: 'power2.out',
              onUpdate: () => {
                counter.textContent = isDecimal ? obj.val.toFixed(1) : Math.floor(obj.val);
              }
            });
          }
        });
      });

      // 5. Continuous Scroll Scrub Parallax on Hero Doodles
      const heroDoodles = document.querySelectorAll('.educational-doodles-layer .doodle-item');
      heroDoodles.forEach((doodle, idx) => {
        const yDrift = (idx % 2 === 0 ? -1 : 1) * (30 + (idx % 3) * 20);
        const rotDrift = (idx % 2 === 0 ? 18 : -18);
        gsap.to(doodle, {
          y: yDrift,
          rotation: rotDrift,
          ease: 'none',
          scrollTrigger: {
            trigger: '#overview',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2
          }
        });
      });

      // Continuous Scroll Scrub Parallax on Section Ambient Doodles
      const sectionDoodles = document.querySelectorAll('.doodle-ambient');
      sectionDoodles.forEach((doodle, idx) => {
        const parentSec = doodle.closest('section');
        if (!parentSec) return;
        const yDrift = (idx % 2 === 0 ? -40 : 40);
        const rotDrift = (idx % 2 === 0 ? 15 : -15);
        gsap.to(doodle, {
          y: yDrift,
          rotation: rotDrift,
          ease: 'none',
          scrollTrigger: {
            trigger: parentSec,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.4
          }
        });
      });

      // 5.1. Wavy Section Divider Stroke Drawing on Scroll
      const dividers = document.querySelectorAll('.doodle-section-divider');
      dividers.forEach((divider) => {
        const path = divider.querySelector('.doodle-divider-path');
        if (path) {
          const len = 1200;
          path.style.strokeDasharray = len;
          path.style.strokeDashoffset = len;
          ScrollTrigger.create({
            trigger: divider,
            start: 'top 88%',
            end: 'top 35%',
            scrub: 1.2,
            onUpdate: (self) => {
              path.style.strokeDashoffset = len * (1 - self.progress);
            }
          });
        }
      });

      // 5.2. Floating Math & AI Formula Chips Parallax Scrub
      const formulaChips = document.querySelectorAll('.formula-chip');
      formulaChips.forEach((chip) => {
        const speed = parseFloat(chip.getAttribute('data-speed')) || 0.3;
        gsap.to(chip, {
          y: speed * 160,
          rotation: (speed > 0 ? 8 : -8),
          ease: 'none',
          scrollTrigger: {
            trigger: '#mainContent',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2
          }
        });
      });
    }

    // 6. Dynamic Scroll-Velocity Doodle Reaction & Pencil Sparks
    let lastScrollPos = window.scrollY;
    let velocityTimer = null;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      const speed = Math.abs(currentScroll - lastScrollPos);
      lastScrollPos = currentScroll;

      if (speed > 5) {
        const energy = Math.min(speed / 20, 1.5);
        gsap.to('.doodle-item, .doodle-ambient, .card-doodle-sticker', {
          scale: 1 + energy * 0.08,
          rotation: (Math.random() > 0.5 ? 4 : -4) * energy,
          duration: 0.15,
          overwrite: 'auto'
        });

        // Spawn spark from traveling pencil when scrolling fast
        const pencil = document.getElementById('globalTravelingPencil');
        if (pencil && Math.random() > 0.45 && typeof trailParticles !== 'undefined') {
          const pRect = pencil.getBoundingClientRect();
          trailParticles.push({
            x: pRect.left + 16,
            y: pRect.top + window.scrollY + 16,
            vx: (Math.random() - 0.5) * 2.2,
            vy: (Math.random() - 0.5) * 2.2 - 0.5,
            size: 13,
            symbol: '✦',
            life: 0.9,
            decay: 0.03,
            rot: Math.random() * Math.PI * 2
          });
        }

        clearTimeout(velocityTimer);
        velocityTimer = setTimeout(() => {
          gsap.to('.doodle-item, .doodle-ambient, .card-doodle-sticker', {
            scale: 1,
            rotation: 0,
            duration: 0.6,
            ease: 'power2.out'
          });
        }, 120);
      }
    }, { passive: true });

    // 7. Hero Mouse Parallax Physics for Educational Doodles
    const heroSection = document.getElementById('overview');
    const doodleItems = document.querySelectorAll('.educational-doodles-layer .doodle-item');
    if (heroSection && doodleItems.length > 0) {
      const depthFactors = [14, -18, 22, -15, 26, -20, 16, -24, 18, -16];

      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;

        doodleItems.forEach((doodle, idx) => {
          const depth = depthFactors[idx % depthFactors.length];
          gsap.to(doodle, {
            x: normX * depth,
            y: normY * depth,
            duration: 0.9,
            ease: 'power1.out',
            overwrite: 'auto'
          });
        });
      });

      heroSection.addEventListener('mouseleave', () => {
        doodleItems.forEach((doodle) => {
          gsap.to(doodle, {
            x: 0,
            y: 0,
            duration: 1.2,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        });
      });
    }

    // 8. Interactive Card Doodle Wiggles
    const interactiveCards = document.querySelectorAll('.curriculum-card, .project-card, .why-card, .pillar-card');
    interactiveCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.module-svg-icon, .proj-icon-svg, .why-card-icon, .pillar-icon');
        if (icon) {
          gsap.to(icon, {
            rotation: (Math.random() > 0.5 ? 10 : -10),
            scale: 1.15,
            duration: 0.25,
            yoyo: true,
            repeat: 1,
            ease: 'back.out(2)'
          });
        }
      });
    });

    // 9. Interactive Card & Doodle Click Shockwave + Chalk Explosions
    const clickTargets = document.querySelectorAll('.curriculum-card, .project-card, .why-card, .pillar-card, .doodle-item, .doodle-ambient, .card-doodle-sticker, .metric-card, .btn-primary-hero, .btn-enroll-nav');
    clickTargets.forEach((target) => {
      target.addEventListener('click', (e) => {
        gsap.timeline()
          .to(target, { scale: 0.93, duration: 0.08, ease: 'power1.in' })
          .to(target, { scale: 1.05, duration: 0.15, ease: 'back.out(2)' })
          .to(target, { scale: 1, duration: 0.12 });

        if (typeof trailParticles !== 'undefined') {
          const clickX = e.clientX;
          const clickY = e.clientY + window.scrollY;
          const sparks = ['✦', '∑', '√', 'π', '0', '1', 'λ', '∆', '×', '+'];
          for (let i = 0; i < 10; i++) {
            const ang = (i / 10) * Math.PI * 2 + (Math.random() - 0.5);
            const spd = Math.random() * 3 + 2;
            trailParticles.push({
              x: clickX,
              y: clickY,
              vx: Math.cos(ang) * spd,
              vy: Math.sin(ang) * spd - 0.8,
              size: Math.random() * 8 + 12,
              symbol: sparks[i % sparks.length],
              life: 1.0,
              decay: 0.022,
              rot: Math.random() * Math.PI * 2
            });
          }
        }
      });
    });
  }
}

/* ==========================================================================
   3.2. GSAP SCROLLTRIGGER REVEAL ANIMATIONS FOR CARDS & ROADMAP
   ========================================================================== */
function initGsapScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Reveal Section Headers smoothly when scrolled into view
  ScrollTrigger.batch('.section-header', {
    start: 'top 92%',
    onEnter: batch => gsap.from(batch, {
      opacity: 0,
      y: 24,
      duration: 0.65,
      stagger: 0.1,
      ease: 'power2.out',
      overwrite: true
    }),
    once: true
  });

  // Stagger Why ATH Cards
  ScrollTrigger.batch('.why-card', {
    start: 'top 90%',
    onEnter: batch => gsap.from(batch, {
      opacity: 0,
      y: 28,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
      overwrite: true
    }),
    once: true
  });

  // Stagger Roadmap Steps
  ScrollTrigger.batch('.roadmap-step', {
    start: 'top 90%',
    onEnter: batch => gsap.from(batch, {
      opacity: 0,
      y: 24,
      duration: 0.6,
      stagger: 0.08,
      ease: 'back.out(1.2)',
      overwrite: true
    }),
    once: true
  });

  // Stagger Curriculum Cards
  ScrollTrigger.batch('.curriculum-card', {
    start: 'top 90%',
    onEnter: batch => gsap.from(batch, {
      opacity: 0,
      y: 30,
      duration: 0.65,
      stagger: 0.08,
      ease: 'power2.out',
      overwrite: true
    }),
    once: true
  });

  // Stagger Project Cards
  ScrollTrigger.batch('.project-card', {
    start: 'top 90%',
    onEnter: batch => gsap.from(batch, {
      opacity: 0,
      y: 30,
      duration: 0.65,
      stagger: 0.08,
      ease: 'power2.out',
      overwrite: true
    }),
    once: true
  });

  // Refresh ScrollTrigger after dynamic resources load
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
}

/* ==========================================================================
   4. SHOWCASE VIEW SWITCHER (3D BRAIN <-> LOTTIE MATRIX) - WCAG TABS
   ========================================================================== */
function initShowcaseViewSwitcher() {
  const tab3D = document.getElementById('tab3DBrain');
  const tabLottie = document.getElementById('tabLottieCore');
  const view3D = document.getElementById('brainViewport');
  const viewLottie = document.getElementById('lottieViewport');

  if (!tab3D || !tabLottie || !view3D || !viewLottie) return;

  function switchTo3D() {
    tab3D.classList.add('active');
    tab3D.setAttribute('aria-selected', 'true');
    tab3D.setAttribute('tabindex', '0');

    tabLottie.classList.remove('active');
    tabLottie.setAttribute('aria-selected', 'false');
    tabLottie.setAttribute('tabindex', '-1');

    view3D.style.display = 'flex';
    view3D.removeAttribute('hidden');

    viewLottie.style.display = 'none';
    viewLottie.setAttribute('hidden', '');
  }

  function switchToLottie() {
    tabLottie.classList.add('active');
    tabLottie.setAttribute('aria-selected', 'true');
    tabLottie.setAttribute('tabindex', '0');

    tab3D.classList.remove('active');
    tab3D.setAttribute('aria-selected', 'false');
    tab3D.setAttribute('tabindex', '-1');

    view3D.style.display = 'none';
    view3D.setAttribute('hidden', '');

    viewLottie.style.display = 'flex';
    viewLottie.removeAttribute('hidden');

    if (lottieNeuralAnim) {
      lottieNeuralAnim.resize();
      lottieNeuralAnim.play();
    }
  }

  tab3D.addEventListener('click', switchTo3D);
  tabLottie.addEventListener('click', switchToLottie);

  // Keyboard navigation for tablist (WCAG 2.1 Tab Pattern)
  [tab3D, tabLottie].forEach(tab => {
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        if (tab === tab3D) {
          switchToLottie();
          tabLottie.focus();
        } else {
          switchTo3D();
          tab3D.focus();
        }
      }
    });
  });
}

/* ==========================================================================
   5. MOBILE & TABLET DRAWER NAVIGATION (ACCESSIBLE ARIA)
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileDrawer');
  const links = document.querySelectorAll('.drawer-link');
  const drawerEnrollBtn = document.getElementById('drawerEnrollBtn');

  if (!toggleBtn || !drawer) return;

  function toggleMenu() {
    const isOpening = !drawer.classList.contains('open');
    toggleBtn.classList.toggle('open', isOpening);
    drawer.classList.toggle('open', isOpening);
    toggleBtn.setAttribute('aria-expanded', isOpening ? 'true' : 'false');
    drawer.setAttribute('aria-hidden', isOpening ? 'false' : 'true');
  }

  function closeMenu() {
    toggleBtn.classList.remove('open');
    drawer.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
  }

  toggleBtn.addEventListener('click', toggleMenu);

  links.forEach(l => l.addEventListener('click', closeMenu));
  if (drawerEnrollBtn) drawerEnrollBtn.addEventListener('click', closeMenu);

  // Close drawer on Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeMenu();
      toggleBtn.focus();
    }
  });
}

/* ==========================================================================
   6. GSAP SHOWCASE FLOATING OSCILLATION
   ========================================================================== */
function initGSAPShowcase() {
  if (typeof gsap === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Gentle float for holographic panels
  gsap.to('#holoLoss', { y: -10, duration: 3.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  gsap.to('#holoQuant', { y: -12, duration: 4.1, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.3 });
  gsap.to('#holoVideo', { y: 10, duration: 4.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.6 });
  gsap.to('#holoTopics', { y: 12, duration: 3.8, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.2 });
}

/* ==========================================================================
   7. STUDENT REGISTRATION MODAL (ACCESSIBLE FOCUS TRAP & 5S AUTO-POPUP)
   ========================================================================== */
function initRegistrationModal() {
  const backdrop = document.getElementById('modalBackdrop');
  const stage = document.getElementById('modalStage');
  const closeBtn = document.getElementById('closeModalBtn');
  const navEnrollBtn = document.getElementById('navEnrollBtn');
  const heroEnrollBtn = document.getElementById('heroEnrollBtn');
  const drawerEnrollBtn = document.getElementById('drawerEnrollBtn');
  const outcomeEnrollBtn = document.getElementById('outcomeEnrollBtn');
  const form = document.getElementById('studentForm');
  const submitBtn = document.getElementById('submitFormBtn');

  let isOpen = false;
  let lastActiveElement = null;

  function openModal(trigger = null) {
    if (isOpen) return;
    isOpen = true;
    lastActiveElement = trigger || document.activeElement;

    if (backdrop) {
      backdrop.classList.add('active');
      backdrop.setAttribute('aria-hidden', 'false');
    }
    if (stage) {
      stage.classList.add('active');
      stage.setAttribute('aria-hidden', 'false');
    }

    // Set focus to the first interactive field for keyboard/screen reader users
    setTimeout(() => {
      const nameInput = document.getElementById('formName');
      if (nameInput) nameInput.focus();
    }, 120);

    if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo('.modal-dialog',
        { scale: 0.9, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }

  function closeModal() {
    if (!isOpen) return;
    isOpen = false;

    if (backdrop) {
      backdrop.classList.remove('active');
      backdrop.setAttribute('aria-hidden', 'true');
    }
    if (stage) {
      stage.classList.remove('active');
      stage.setAttribute('aria-hidden', 'true');
    }

    // Restore focus to original trigger element (WCAG 2.4.3)
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  // Automatic popup trigger in 5 seconds
  setTimeout(() => {
    if (!isOpen) {
      openModal();
    }
  }, 5000);

  [navEnrollBtn, heroEnrollBtn, drawerEnrollBtn, outcomeEnrollBtn].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(btn);
      });
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  // Keyboard accessibility: Escape to close + Focus Trap inside modal (WCAG 2.1.2)
  window.addEventListener('keydown', (e) => {
    if (!isOpen) return;

    if (e.key === 'Escape') {
      closeModal();
      return;
    }

    if (e.key === 'Tab' && stage) {
      const focusable = stage.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  });

  // Form submission with Gmail / Admissions notification
  if (form && submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = document.getElementById('formName');
      const phone = document.getElementById('formPhone');
      const email = document.getElementById('formEmail');
      const mode = document.getElementById('formMode');
      const track = document.getElementById('formTrack');

      if (!name.value || !phone.value || !email.value) {
        alert('Please fill in your Full Name, Phone / WhatsApp, and Email Address.');
        return;
      }

      const prevHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Forwarding to Admissions...</span>';
      submitBtn.style.pointerEvents = 'none';

      const modeText = mode ? mode.options[mode.selectedIndex].text : 'Flexible Hybrid';
      const trackText = track ? track.options[track.selectedIndex].text : 'Data Science with AI & ML';

      // Simulate network dispatch to admissions inbox
      setTimeout(() => {
        const modalBody = document.querySelector('.modal-body');
        if (modalBody) {
          modalBody.innerHTML = `
            <div class="modal-success-card" style="text-align: center; padding: 24px 12px;">
              <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.35); display: inline-flex; align-items: center; justify-content: center; color: #10b981; margin-bottom: 16px;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3 style="font-family: var(--font-heading); font-size: 1.35rem; color: #ffffff; margin-bottom: 8px;">Admissions Application Dispatched</h3>
              <p style="font-size: 0.86rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 20px;">
                Thank you, <strong style="color: #ffffff;">${name.value}</strong>! Your registration details have been forwarded to the Asian Technology Hub admissions office.
              </p>
              <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 16px; margin-bottom: 22px; text-align: left; font-size: 0.8rem; line-height: 1.8; color: var(--text-muted);">
                <div><span style="color: var(--text-dim); font-family: var(--font-mono);">Notified Inbox:</span> <strong style="color: var(--accent-cyan);">admissions@asiantechnologyhub.com</strong></div>
                <div><span style="color: var(--text-dim); font-family: var(--font-mono);">Learning Mode:</span> <strong style="color: #ffffff;">${modeText}</strong></div>
                <div><span style="color: var(--text-dim); font-family: var(--font-mono);">Specialization:</span> <strong style="color: #ffffff;">${trackText}</strong></div>
                <div><span style="color: var(--text-dim); font-family: var(--font-mono);">WhatsApp Update:</span> <strong style="color: #10b981;">Admissions counselor will text ${phone.value} within 2 hours.</strong></div>
              </div>
              <button type="button" id="successCloseBtn" style="padding: 12px 28px; border-radius: 999px; background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); border: 1px solid var(--border-cyan-bright); color: #ffffff; font-weight: 700; font-size: 0.88rem; cursor: pointer;">
                Close &amp; Continue Exploring
              </button>
            </div>
          `;

          const successCloseBtn = document.getElementById('successCloseBtn');
          if (successCloseBtn) {
            successCloseBtn.addEventListener('click', closeModal);
          }
        }
      }, 700);
    });
  }
}

/* ==========================================================================
   FAQ ACCORDION INTERACTIVITY
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other items
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-question-btn');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}
