/**
 * ASIAN TECHNOLOGY HUB (ATH) - LANDING PAGE INTERACTIVE CONTROLS
 */

document.addEventListener('DOMContentLoaded', () => {
  initCurriculumTabs();
  initFacultyCarousel();
  initEmiCalculator();
  initFaqAccordion();
  initHeaderScroll();
  initMobileMenu();
  initSmoothScrolling();
});

/* ==========================================================================
   1. CURRICULUM BROWSER TABS
   ========================================================================== */
function initCurriculumTabs() {
  const tabButtons = document.querySelectorAll('.curriculum-tab-btn');
  const panels = document.querySelectorAll('.curriculum-panel');

  if (!tabButtons.length || !panels.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      tabButtons.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   2. FACULTY & MENTORS SLIDER
   ========================================================================== */
let currentFacultyIdx = 0;
let facultyAutoTimer = null;

function initFacultyCarousel() {
  const slides = document.querySelectorAll('.faculty-slide');
  if (!slides.length) return;

  startFacultyTimer();

  const container = document.querySelector('.faculty-card-container');
  if (container) {
    container.addEventListener('mouseenter', () => clearInterval(facultyAutoTimer));
    container.addEventListener('mouseleave', () => startFacultyTimer());
  }
}

function startFacultyTimer() {
  clearInterval(facultyAutoTimer);
  facultyAutoTimer = setInterval(() => {
    nextFaculty();
  }, 6500);
}

function showFaculty(index) {
  const slides = document.querySelectorAll('.faculty-slide');
  const dots = document.querySelectorAll('.faculty-dot');
  if (!slides.length) return;

  if (index >= slides.length) {
    currentFacultyIdx = 0;
  } else if (index < 0) {
    currentFacultyIdx = slides.length - 1;
  } else {
    currentFacultyIdx = index;
  }

  slides.forEach((s, idx) => {
    s.classList.toggle('active', idx === currentFacultyIdx);
  });

  dots.forEach((d, idx) => {
    d.classList.toggle('active', idx === currentFacultyIdx);
  });
}

function nextFaculty() {
  showFaculty(currentFacultyIdx + 1);
}

function prevFaculty() {
  showFaculty(currentFacultyIdx - 1);
}

function jumpFaculty(index) {
  showFaculty(index);
  startFacultyTimer();
}

/* ==========================================================================
   3. NO-COST EMI & TENURE PLANNER (NO HARDCODED PRICES)
   ========================================================================== */
function initEmiCalculator() {
  // Initialized with 3 months default
}

function selectTenure(months, btn) {
  const buttons = document.querySelectorAll('.tenure-btn');
  buttons.forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const label = document.getElementById('tenureSelectedLabel');
  if (label) {
    label.textContent = `Selected Plan: ${months} Months 0% No-Cost EMI`;
  }
}

/* ==========================================================================
   4. FAQ ACCORDION & CATEGORY FILTERING
   ========================================================================== */
function initFaqAccordion() {
  // First item open by default
  const openItem = document.querySelector('.faq-item.open');
  if (openItem) {
    const ans = openItem.querySelector('.faq-answer-content');
    if (ans) ans.style.maxHeight = ans.scrollHeight + 30 + 'px';
  }
}

function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  if (!item) return;

  const answer = item.querySelector('.faq-answer-content');
  const isOpen = item.classList.contains('open');

  // Close other open faqs
  const allItems = document.querySelectorAll('.faq-item');
  allItems.forEach(i => {
    i.classList.remove('open');
    const a = i.querySelector('.faq-answer-content');
    if (a) a.style.maxHeight = null;
  });

  if (!isOpen) {
    item.classList.add('open');
    if (answer) {
      answer.style.maxHeight = answer.scrollHeight + 35 + 'px';
    }
  }
}

function filterFaq(category, btn) {
  const buttons = document.querySelectorAll('.faq-nav-btn');
  buttons.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const cat = item.getAttribute('data-category');
    if (category === 'all' || cat === category) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

/* ==========================================================================
   5. HEADER AUTO-HIDE ON SCROLL DOWN & RE-APPEAR ON SCROLL UP
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('mainHeader') || document.querySelector('.header');
  if (!header) return;

  let lastScrollY = Math.max(0, window.pageYOffset || document.documentElement.scrollTop || 0);
  let isTicking = false;
  const scrollDeltaThreshold = 8; // Avoid micro-jitter / rubber-banding triggers
  const headerHeight = header.offsetHeight || 76;

  function updateHeaderState() {
    const currentScrollY = Math.max(0, window.pageYOffset || document.documentElement.scrollTop || 0);
    const drawer = document.getElementById('mobileDrawer');
    const isDrawerOpen = drawer && (drawer.classList.contains('open') || drawer.classList.contains('drawer-open'));

    // Always keep header visible if mobile navigation drawer is open
    if (isDrawerOpen) {
      header.classList.remove('header--hidden');
      lastScrollY = currentScrollY;
      isTicking = false;
      return;
    }

    // Dynamic elevation & border lighting
    if (currentScrollY > 40) {
      header.style.boxShadow = '0 12px 35px rgba(0, 10, 40, 0.65)';
      header.style.borderBottomColor = 'rgba(0, 229, 255, 0.4)';
    } else {
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
      header.style.borderBottomColor = 'rgba(255, 255, 255, 0.1)';
    }

    const deltaY = currentScrollY - lastScrollY;

    // At top of the page - always show header
    if (currentScrollY <= headerHeight) {
      header.classList.remove('header--hidden');
    }
    // Scrolling DOWN - auto-hide after passing the header height
    else if (deltaY > scrollDeltaThreshold && currentScrollY > headerHeight) {
      header.classList.add('header--hidden');
    }
    // Scrolling UP - reveal header smoothly
    else if (deltaY < -scrollDeltaThreshold) {
      header.classList.remove('header--hidden');
    }

    lastScrollY = currentScrollY;
    isTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(updateHeaderState);
      isTicking = true;
    }
  }, { passive: true });
}

/* ==========================================================================
   6. MOBILE MENU DRAWER
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('menuToggle') || document.getElementById('mobileToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleMobileMenu);
  }
}

function toggleMobileMenu() {
  const drawer = document.getElementById('mobileDrawer');
  const toggleBtn = document.getElementById('menuToggle') || document.getElementById('mobileToggle');
  if (!drawer) return;
  const isOpen = drawer.classList.toggle('drawer-open');
  drawer.classList.toggle('open', isOpen);
  if (toggleBtn) {
    toggleBtn.classList.toggle('is-active', isOpen);
  }
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

/* ==========================================================================
   6B. FLUID SMOOTH SCROLLING ENGINE (WITH DYNAMIC FIXED HEADER OFFSET)
   ========================================================================== */
function initSmoothScrolling() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href || href === '#' || href === '#!') return;

    // Try finding target by selector or id
    let target = null;
    try {
      target = document.querySelector(href);
    } catch (err) {
      target = document.getElementById(href.replace(/^#/, ''));
    }

    if (!target) return;

    e.preventDefault();

    // Close mobile drawer if currently open
    const drawer = document.getElementById('mobileDrawer');
    if (drawer && (drawer.classList.contains('open') || drawer.classList.contains('drawer-open'))) {
      drawer.classList.remove('open', 'drawer-open');
      const toggleBtn = document.getElementById('menuToggle') || document.getElementById('mobileToggle');
      if (toggleBtn) toggleBtn.classList.remove('is-active');
      document.body.style.overflow = '';
    }

    // Determine fixed header height dynamically
    const header = document.getElementById('mainHeader') || document.querySelector('.header');
    if (header) {
      header.classList.remove('header--hidden');
    }
    const headerHeight = header ? header.offsetHeight : 76;
    const offsetMargin = 14; // Comfortable visual breathing room above section title

    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - offsetMargin;
    const finalScrollTop = Math.max(0, Math.round(targetPosition));

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({
      top: finalScrollTop,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });

    // Update URL hash cleanly without default abrupt jump
    if (history.pushState) {
      history.pushState(null, '', href);
    } else {
      window.location.hash = href;
    }

    // Accessibility: Set focus for screen readers and keyboard users
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
    }
    target.focus({ preventScroll: true });
  });

  // Smooth scroll to initial hash if user lands directly on a hashed URL
  if (window.location.hash && window.location.hash !== '#') {
    window.addEventListener('load', () => {
      setTimeout(() => {
        let initialTarget = null;
        try {
          initialTarget = document.querySelector(window.location.hash);
        } catch (err) {
          initialTarget = document.getElementById(window.location.hash.replace(/^#/, ''));
        }
        if (initialTarget) {
          const header = document.getElementById('mainHeader') || document.querySelector('.header');
          const headerHeight = header ? header.offsetHeight : 76;
          const offsetMargin = 14;
          const targetPosition = initialTarget.getBoundingClientRect().top + window.pageYOffset - headerHeight - offsetMargin;
          window.scrollTo({
            top: Math.max(0, Math.round(targetPosition)),
            behavior: 'smooth'
          });
        }
      }, 100);
    }, { once: true });
  }
}

/* ==========================================================================
   7. MODALS & LEAD CAPTURE FORM SUBMISSION
   ========================================================================== */
function openBrochureModal() {
  const modal = document.getElementById('brochureModal');
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeBrochureModal() {
  const modal = document.getElementById('brochureModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on Escape Key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeBrochureModal();
    const drawer = document.getElementById('mobileDrawer');
    if (drawer && drawer.classList.contains('open')) {
      toggleMobileMenu();
    }
  }
});

function handleLeadSubmit(event, source = 'Form') {
  event.preventDefault();
  const form = event.target;

  // Retrieve basic info
  const nameInput = form.querySelector('input[type="text"]');
  const candidateName = nameInput ? nameInput.value : 'Candidate';

  // Trigger feedback toast
  showToast(`Thank you, ${candidateName}! Your application has been received. Our Admissions Officer will contact you shortly.`);

  // Close modal if open
  closeBrochureModal();

  // Reset form
  form.reset();
}

function showToast(message) {
  const toast = document.getElementById('toastNotice');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast) return;

  if (toastMsg) toastMsg.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 5000);
}

// =============================================================================
// INTERNAL RESOLUTION & DEVICE RESPONSIVE ENGINE (HIDDEN SYSTEM)
// =============================================================================
const ResponsiveEngine = {
  state: {
    width: 0,
    height: 0,
    dpr: 1,
    isTouch: false,
    pointerType: 'fine',
    orientation: 'landscape',
    device: 'desktop',
    breakpoint: 'xl'
  },

  init() {
    this.detectTouch();
    this.update();

    // Debounced resize & orientation monitoring
    let rAF = null;
    const onResize = () => {
      if (rAF) cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(() => this.update());
    };

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.update(), 100);
    }, { passive: true });

    // Touch event listener to ensure immediate detection on first interaction
    window.addEventListener('touchstart', () => {
      if (!this.state.isTouch) {
        this.state.isTouch = true;
        document.documentElement.setAttribute('data-touch', 'true');
      }
    }, { passive: true, once: true });
  },

  detectTouch() {
    const isTouch = ('ontouchstart' in window) ||
                    (navigator.maxTouchPoints > 0) ||
                    (navigator.msMaxTouchPoints > 0) ||
                    (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

    const isCoarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

    this.state.isTouch = !!isTouch;
    this.state.pointerType = isCoarse ? 'coarse' : 'fine';

    document.documentElement.setAttribute('data-touch', this.state.isTouch ? 'true' : 'false');
    document.documentElement.setAttribute('data-pointer', this.state.pointerType);
  },

  getDeviceCategory(w) {
    if (w < 768) return 'mobile';
    if (w <= 991) return 'tablet';
    if (w <= 1220) return 'laptop';
    return 'desktop';
  },

  getBreakpoint(w) {
    if (w >= 1440) return '2xl';
    if (w >= 1200) return 'xl';
    if (w >= 992) return 'lg';
    if (w >= 769) return 'md';
    if (w >= 481) return 'sm';
    return 'xs';
  },

  update() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.round((window.devicePixelRatio || 1) * 100) / 100;
    const orientation = w >= h ? 'landscape' : 'portrait';
    const device = this.getDeviceCategory(w);
    const breakpoint = this.getBreakpoint(w);

    this.state.width = w;
    this.state.height = h;
    this.state.dpr = dpr;
    this.state.orientation = orientation;
    this.state.device = device;
    this.state.breakpoint = breakpoint;

    const root = document.documentElement;

    // Apply semantic data attributes to root element
    root.setAttribute('data-device', device);
    root.setAttribute('data-breakpoint', breakpoint);
    root.setAttribute('data-orientation', orientation);
    root.setAttribute('data-dpr', Math.round(dpr));
    root.setAttribute('data-res-width', w);
    root.setAttribute('data-res-height', h);

    // Dynamic viewport height & width custom properties
    root.style.setProperty('--res-vw', `${w}px`);
    root.style.setProperty('--res-vh', `${h}px`);
    root.style.setProperty('--res-dpr', dpr);

    // Dispatch internal event for components if needed
    window.dispatchEvent(new CustomEvent('responsiveupdate', { detail: this.state }));
  }
};

// Auto-initialize internal responsive engine
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ResponsiveEngine.init());
} else {
  ResponsiveEngine.init();
}

