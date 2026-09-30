/**
 * Asian Technology Hub (ATS) - Data Science with AI & ML
 * High-Performance Engine: Three.js 3D Brain, Lottie Vector Animations, Mobile Drawer & 5s Popup
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientStars();
  initThreeJSBrain();
  initLottieAnimations();
  initShowcaseViewSwitcher();
  initMobileDrawer();
  initGSAPShowcase();
  initRegistrationModal();
});

/* ==========================================================================
   1. AMBIENT DRIFTING STAR PARTICLES
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

  const starCount = Math.min(80, Math.floor(width / 18));
  const stars = [];

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI * 2
    });
  }

  function renderStars() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.x += s.vx;
      s.y += s.vy;
      s.pulse += 0.02;

      if (s.x < 0) s.x = width;
      if (s.x > width) s.x = 0;
      if (s.y < 0) s.y = height;
      if (s.y > height) s.y = 0;

      const currentAlpha = s.alpha * (0.6 + 0.4 * Math.sin(s.pulse));

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${currentAlpha})`;
      ctx.fill();

      // Delicate constellation links
      for (let j = i + 1; j < stars.length; j++) {
        const s2 = stars[j];
        const dx = s.x - s2.x;
        const dy = s.y - s2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 85) {
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s2.x, s2.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - dist / 85) * 0.08})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(renderStars);
  }

  renderStars();
}

/* ==========================================================================
   2. THREE.JS 3D LUMINOUS BRAIN HOLOGRAM
   ========================================================================== */
function initThreeJSBrain() {
  const container = document.getElementById('brainViewport');
  const canvas = document.getElementById('brain3DCanvas');
  if (!container || !canvas || typeof THREE === 'undefined') return;

  const width = container.clientWidth || 600;
  const height = container.clientHeight || 300;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 8.2);

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

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    brainPoints.rotation.y += 0.003;
    brainPoints.rotation.y += (targetRotY - brainPoints.rotation.y) * 0.05;
    brainPoints.rotation.x += (targetRotX - brainPoints.rotation.x) * 0.05;

    neuralLines.rotation.y = brainPoints.rotation.y;
    neuralLines.rotation.x = brainPoints.rotation.x;

    brainPoints.position.y = Math.sin(elapsedTime * 1.4) * 0.1;
    neuralLines.position.y = brainPoints.position.y;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    if (!container) return;
    const w = container.clientWidth || 600;
    const h = container.clientHeight || 300;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

let lottieNeuralAnim = null;
let lottieAnalyticsAnim = null;

/* ==========================================================================
   3. LOTTIE ANIMATIONS (NEURAL CORE & ANALYTICS WAVE)
   ========================================================================== */
function initLottieAnimations() {
  if (typeof lottie === 'undefined') return;

  // Lottie 1: Neural Core Animation in Showcase
  const neuralCoreContainer = document.getElementById('lottieNeuralCore');
  if (neuralCoreContainer) {
    fetch('lottie_neural_core.json')
      .then(res => res.json())
      .then(data => {
        lottieNeuralAnim = lottie.loadAnimation({
          container: neuralCoreContainer,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: data
        });
      })
      .catch(e => console.warn('Lottie neural core load error:', e));
  }

  // Lottie 2: Analytics Data Wave in Projects
  const analyticsWaveContainer = document.getElementById('lottieAnalyticsWave');
  if (analyticsWaveContainer) {
    fetch('lottie_analytics_wave.json')
      .then(res => res.json())
      .then(data => {
        lottieAnalyticsAnim = lottie.loadAnimation({
          container: analyticsWaveContainer,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: data
        });
      })
      .catch(e => console.warn('Lottie analytics wave load error:', e));
  }
}

/* ==========================================================================
   4. SHOWCASE VIEW SWITCHER (3D BRAIN <-> LOTTIE MATRIX)
   ========================================================================== */
function initShowcaseViewSwitcher() {
  const tab3D = document.getElementById('tab3DBrain');
  const tabLottie = document.getElementById('tabLottieCore');
  const view3D = document.getElementById('brainViewport');
  const viewLottie = document.getElementById('lottieViewport');

  if (!tab3D || !tabLottie || !view3D || !viewLottie) return;

  tab3D.addEventListener('click', () => {
    tab3D.classList.add('active');
    tabLottie.classList.remove('active');
    view3D.style.display = 'flex';
    viewLottie.style.display = 'none';
  });

  tabLottie.addEventListener('click', () => {
    tabLottie.classList.add('active');
    tab3D.classList.remove('active');
    view3D.style.display = 'none';
    viewLottie.style.display = 'flex';
    if (lottieNeuralAnim) {
      lottieNeuralAnim.resize();
      lottieNeuralAnim.play();
    }
  });
}

/* ==========================================================================
   5. MOBILE & TABLET DRAWER NAVIGATION
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileDrawer');
  const links = document.querySelectorAll('.drawer-link');
  const drawerEnrollBtn = document.getElementById('drawerEnrollBtn');

  if (!toggleBtn || !drawer) return;

  function toggleMenu() {
    toggleBtn.classList.toggle('open');
    drawer.classList.toggle('open');
  }

  function closeMenu() {
    toggleBtn.classList.remove('open');
    drawer.classList.remove('open');
  }

  toggleBtn.addEventListener('click', toggleMenu);

  links.forEach(l => l.addEventListener('click', closeMenu));
  if (drawerEnrollBtn) drawerEnrollBtn.addEventListener('click', closeMenu);
}

/* ==========================================================================
   6. GSAP SHOWCASE FLOATING OSCILLATION
   ========================================================================== */
function initGSAPShowcase() {
  if (typeof gsap === 'undefined') return;

  // Gentle float for holographic panels
  gsap.to('#holoLoss', { y: -10, duration: 3.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  gsap.to('#holoQuant', { y: -12, duration: 4.1, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.3 });
  gsap.to('#holoVideo', { y: 10, duration: 4.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.6 });
  gsap.to('#holoTopics', { y: 12, duration: 3.8, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.2 });
}

/* ==========================================================================
   7. STUDENT REGISTRATION MODAL (WITH 5-SECOND AUTO-POPUP)
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

  function openModal() {
    if (isOpen) return;
    isOpen = true;
    if (backdrop) backdrop.classList.add('active');
    if (stage) stage.classList.add('active');

    if (typeof gsap !== 'undefined') {
      gsap.fromTo('.modal-dialog',
        { scale: 0.9, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }

  function closeModal() {
    isOpen = false;
    if (backdrop) backdrop.classList.remove('active');
    if (stage) stage.classList.remove('active');
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
        openModal();
      });
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeModal();
  });

  // Form submission
  if (form && submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = document.getElementById('formName');
      const phone = document.getElementById('formPhone');
      const email = document.getElementById('formEmail');

      if (!name.value || !phone.value || !email.value) {
        alert('Please fill in your Full Name, Phone / WhatsApp, and Email Address.');
        return;
      }

      const prevHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Processing Application...</span>';
      submitBtn.style.pointerEvents = 'none';

      setTimeout(() => {
        submitBtn.innerHTML = '<span>✓ Application Received!</span>';
        submitBtn.style.background = 'linear-gradient(135deg, #059669 0%, #10b981 100%)';

        setTimeout(() => {
          alert(`Thank you, ${name.value}! Your enrollment application for Data Science with AI & ML has been submitted successfully. An academic admissions counselor will connect with you via WhatsApp/Phone shortly.`);
          submitBtn.innerHTML = prevHTML;
          submitBtn.style.background = '';
          submitBtn.style.pointerEvents = 'auto';
          form.reset();
          closeModal();
        }, 1000);
      }, 800);
    });
  }
}
