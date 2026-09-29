/**
 * FIGMA ILLUSTRATION INTENSIVE — INTERACTION & ANIMATION ENGINE
 * Exact choreography and physics based on optical flow analysis of reference video.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize GSAP & Plugins
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
    if (typeof ScrollToPlugin !== 'undefined') gsap.registerPlugin(ScrollToPlugin);
  }

  initTabToggle();
  initTiltEffects();
  initInteractiveWidgets();
  initScrollAnimations();
  initWalkthroughEngine();
});

/* ==========================================================================
   1. Segmented Pill Tab Toggle
   ========================================================================== */
function initTabToggle() {
  const tabs = document.querySelectorAll('.pill-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
    });
  });
}

/* ==========================================================================
   2. 3D Card Tilt on Hover
   ========================================================================== */
function initTiltEffects() {
  const tiltCards = document.querySelectorAll('[data-tilt]');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ==========================================================================
   3. Interactive Micro-Widgets (Swatches, Buttons, Ask AI)
   ========================================================================== */
function initInteractiveWidgets() {
  // Tool icons in Figma Master Card
  const toolBtns = document.querySelectorAll('.tool-icon-btn');
  toolBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toolBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      gsap.fromTo(btn, { scale: 0.85 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
    });
  });

  // Ask AI Buttons
  const askBtns = document.querySelectorAll('#askAiBtn, .pill-ask-ai-bonus');
  askBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      gsap.timeline()
        .to(btn, { scale: 0.92, duration: 0.1 })
        .to(btn, { scale: 1.05, duration: 0.2, ease: 'back.out(2)' })
        .to(btn, { scale: 1, duration: 0.2 });
    });
  });

  // Swatches interactive highlight
  const swatches = document.querySelectorAll('.swatches-grid .swatch');
  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.style.outline = 'none');
      swatch.style.outline = '2px solid #38bdf8';
      swatch.style.outlineOffset = '2px';
      gsap.fromTo(swatch, { scale: 1.3 }, { scale: 1.15, duration: 0.25, ease: 'back.out(2)' });
    });
  });

  // Appearance Node Hover
  const nodeAppearance = document.getElementById('nodeAppearance');
  const appearanceChip = document.getElementById('appearanceChip');
  if (nodeAppearance && appearanceChip) {
    nodeAppearance.addEventListener('mouseenter', () => {
      gsap.to(appearanceChip, { y: -4, boxShadow: '0 0 16px rgba(56, 189, 248, 0.4)', duration: 0.25 });
    });
    nodeAppearance.addEventListener('mouseleave', () => {
      gsap.to(appearanceChip, { y: 0, boxShadow: 'none', duration: 0.25 });
    });
  }
}

/* ==========================================================================
   4. Scroll Animations with GSAP & ScrollTrigger
   ========================================================================== */
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Stagger reveal of Skills Bento Cards
  gsap.from('.skill-bento-card', {
    scrollTrigger: {
      trigger: '#skillsSection',
      start: 'top 75%',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out'
  });

  // Stagger reveal of AI Feature Cards
  gsap.from('.ai-feature-card', {
    scrollTrigger: {
      trigger: '#aiSection',
      start: 'top 75%',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.14,
    ease: 'power3.out'
  });

  // Draw Animated Bezier Curve
  gsap.from('.animated-curve-line', {
    scrollTrigger: {
      trigger: '#aiSection',
      start: 'top 65%',
    },
    strokeDasharray: 300,
    strokeDashoffset: 300,
    duration: 1.4,
    ease: 'power2.inOut'
  });

  // Reveal AI Hierarchy Bottom Cluster
  gsap.from('.ai-bottom-hierarchy', {
    scrollTrigger: {
      trigger: '.ai-bottom-hierarchy',
      start: 'top 85%',
    },
    y: 30,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out'
  });

  // Stagger reveal of Materials Bento Columns
  gsap.from('.bento-column', {
    scrollTrigger: {
      trigger: '#materialsSection',
      start: 'top 75%',
    },
    y: 60,
    opacity: 0,
    duration: 0.9,
    stagger: 0.2,
    ease: 'power3.out'
  });
}

/* ==========================================================================
   5. Walkthrough Engine (1:1 Playback matching the reference video)
   ========================================================================== */
let walkthroughTimeline = null;
let isPlayingWalkthrough = false;

function initWalkthroughEngine() {
  const toggleBtn = document.getElementById('walkthroughToggle');
  const simCursor = document.getElementById('simCursor');
  const ripple = document.getElementById('cursorRipple');

  if (!toggleBtn || !simCursor) return;

  toggleBtn.addEventListener('click', () => {
    if (isPlayingWalkthrough) {
      stopWalkthrough();
    } else {
      startWalkthrough();
    }
  });

  function triggerCursorClick() {
    if (!ripple) return;
    ripple.classList.remove('click-pulse');
    void ripple.offsetWidth; // trigger reflow
    ripple.classList.add('click-pulse');
  }

  function startWalkthrough() {
    isPlayingWalkthrough = true;
    toggleBtn.classList.add('active');
    toggleBtn.querySelector('.btn-text').textContent = 'Pause Walkthrough';
    toggleBtn.querySelector('.btn-icon').textContent = '⏸';

    simCursor.classList.add('active');

    // Create GSAP Timeline matching the exact millisecond video timing
    walkthroughTimeline = gsap.timeline({
      onComplete: () => {
        // Seamless loop back to hero
        startWalkthrough();
      }
    });

    const windowEl = document.getElementById('canvasWindow');
    const skillsSheet = document.getElementById('skillsSheet');

    // 0.0s – Start at Hero, cursor over Appearance node (1260, 1165 in 1800x1350 canvas)
    walkthroughTimeline.set(window, { scrollTo: 0 });
    walkthroughTimeline.set(simCursor, { x: 810, y: 470, opacity: 1 });

    // 0.0s -> 3.1s: Idle hover over Appearance node
    walkthroughTimeline.to(simCursor, {
      x: 820,
      y: 475,
      duration: 3.1,
      ease: 'sine.inOut'
    });

    // 3.1s -> 4.22s: Cursor moves up, scrolls smoothly into Skills Sheet
    walkthroughTimeline.to(simCursor, {
      x: 720,
      y: 200,
      duration: 1.12,
      ease: 'expo.out'
    }, '+=0');

    walkthroughTimeline.to(window, {
      scrollTo: '#skillsSection',
      duration: 1.12,
      ease: 'expo.out'
    }, '<');

    // 4.22s -> 6.17s: Inspect skills bento cards
    walkthroughTimeline.to(simCursor, {
      x: 450,
      y: 350,
      duration: 1.95,
      ease: 'power2.out',
      onStart: () => {
        triggerCursorClick();
      }
    });

    // 6.17s -> 7.35s: Scroll smoothly to AI section
    walkthroughTimeline.to(window, {
      scrollTo: '#aiSection',
      duration: 1.18,
      ease: 'expo.out'
    });

    walkthroughTimeline.to(simCursor, {
      x: 600,
      y: 380,
      duration: 1.18,
      ease: 'expo.out'
    }, '<');

    // 7.35s -> 10.63s: AI section interaction: Hover over Ask AI button
    walkthroughTimeline.to(simCursor, {
      x: 580,
      y: 420,
      duration: 1.5,
      ease: 'power2.out'
    });

    walkthroughTimeline.call(() => {
      triggerCursorClick();
      const askBtn = document.getElementById('askAiBtn');
      if (askBtn) askBtn.click();
    });

    walkthroughTimeline.to(simCursor, {
      x: 600,
      y: 560, // Hover down near bottom hierarchy tree
      duration: 1.78,
      ease: 'sine.inOut'
    });

    // 10.63s -> 11.8s: Transition to Materials Bento Section
    walkthroughTimeline.to(window, {
      scrollTo: '#materialsSection',
      duration: 1.2,
      ease: 'expo.out'
    });

    walkthroughTimeline.to(simCursor, {
      x: 680,
      y: 360,
      duration: 1.2,
      ease: 'expo.out'
    }, '<');

    // 11.8s -> 14.5s: Explore Materials Grid: Hover SaaS card & Gradient swatches
    walkthroughTimeline.to(simCursor, {
      x: 640,
      y: 340, // SaaS card 'Make it beautiful'
      duration: 1.4,
      ease: 'power2.out'
    });

    walkthroughTimeline.to(simCursor, {
      x: 950,
      y: 380, // Gradient matrix card
      duration: 1.3,
      ease: 'power2.out',
      onComplete: () => {
        triggerCursorClick();
      }
    });

    // 14.5s -> 15.5s: Reset back to Hero loop
    walkthroughTimeline.to(window, {
      scrollTo: 0,
      duration: 1.0,
      ease: 'power3.inOut'
    });

    walkthroughTimeline.to(simCursor, {
      x: 810,
      y: 470,
      duration: 1.0,
      ease: 'power3.inOut'
    }, '<');
  }

  function stopWalkthrough() {
    isPlayingWalkthrough = false;
    if (walkthroughTimeline) {
      walkthroughTimeline.pause();
      walkthroughTimeline.kill();
    }
    toggleBtn.classList.remove('active');
    toggleBtn.querySelector('.btn-text').textContent = 'Watch Walkthrough';
    toggleBtn.querySelector('.btn-icon').textContent = '▶';
    simCursor.classList.remove('active');
  }
}
