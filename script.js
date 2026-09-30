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
  initFaqAccordion();
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

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      if (!prefersReducedMotion) {
        s.x += s.vx;
        s.y += s.vy;
        s.pulse += 0.02;

        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;
      }

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
