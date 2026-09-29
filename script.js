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
  initHeaderAutoHide();
  initSignalWirePulses();
  initFloatingNodeParallax();
  initAnimatedCounters();
  initGlobalClickRipple();
  initPortalLoginModal();
  initDatasetExplorer();
});

/* ==========================================================================
   1. Segmented Pill Tab Toggle (Full Curriculum vs Free Datasets)
   ========================================================================== */
function initTabToggle() {
  const toggleContainer = document.getElementById('segmentedPillToggle');
  const pillGlider = document.getElementById('pillGlider');
  const tabCurriculum = document.getElementById('tabCurriculum');
  const tabDatasets = document.getElementById('tabDatasets');
  const tabs = document.querySelectorAll('.pill-tab');

  if (!toggleContainer || !pillGlider) return;

  // Calculate and animate glider position
  function updateGlider(activeTab, animate = true) {
    if (!activeTab) return;
    const containerRect = toggleContainer.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();
    const offsetLeft = tabRect.left - containerRect.left;
    const width = tabRect.width;

    if (animate && typeof gsap !== 'undefined') {
      gsap.to(pillGlider, {
        x: offsetLeft - 4,
        width: width,
        duration: 0.38,
        ease: 'power3.out'
      });
    } else {
      pillGlider.style.transform = `translateX(${offsetLeft - 4}px)`;
      pillGlider.style.width = `${width}px`;
    }
  }

  function setActiveTab(targetTab, shouldScroll = true) {
    if (!targetTab) return;
    tabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    targetTab.classList.add('active');
    targetTab.setAttribute('aria-selected', 'true');
    updateGlider(targetTab, true);

    if (!shouldScroll) return;

    const targetType = targetTab.getAttribute('data-target');
    if (targetType === 'curriculum') {
      const skillsSec = document.getElementById('skillsSection') || document.getElementById('heroSection');
      if (skillsSec) {
        skillsSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (targetType === 'datasets') {
      const datasetCard = document.getElementById('bonusDatasetCard') || document.getElementById('materialsSection');
      if (datasetCard) {
        datasetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Trigger electric cyan highlight pulse
        setTimeout(() => {
          datasetCard.classList.remove('dataset-highlight-active');
          void datasetCard.offsetWidth; // trigger reflow
          datasetCard.classList.add('dataset-highlight-active');
        }, 350);
      }
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      setActiveTab(tab, true);
    });
  });

  // Initial glider placement on load
  const initialActive = document.querySelector('.pill-tab.active') || tabCurriculum;
  setTimeout(() => updateGlider(initialActive, false), 100);
  window.addEventListener('resize', () => {
    const currActive = document.querySelector('.pill-tab.active') || tabCurriculum;
    updateGlider(currActive, false);
  });

  // ScrollSpy: Update active tab based on scroll position
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) return;
    scrollTimeout = requestAnimationFrame(() => {
      scrollTimeout = null;
      const materialsSec = document.getElementById('materialsSection');
      if (!materialsSec) return;
      const matTop = materialsSec.getBoundingClientRect().top;
      // If materials section is in or above middle of screen
      if (matTop <= window.innerHeight * 0.45) {
        if (tabDatasets && !tabDatasets.classList.contains('active')) {
          setActiveTab(tabDatasets, false);
        }
      } else {
        if (tabCurriculum && !tabCurriculum.classList.contains('active')) {
          setActiveTab(tabCurriculum, false);
        }
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   1B. Free Datasets Interactive Explorer Modal
   ========================================================================== */
function initDatasetExplorer() {
  const modalBackdrop = document.getElementById('datasetModalBackdrop');
  const modalStage = document.getElementById('datasetModalStage');
  const modalWindow = document.getElementById('datasetModalWindow');
  const closeBtn = document.getElementById('datasetModalCloseBtn');
  const doneBtn = document.getElementById('datasetDoneBtn');
  const openCtaBtn = document.getElementById('btnOpenDatasetExplorer');
  const dsItems = document.querySelectorAll('.ds-item');
  const switchBtns = document.querySelectorAll('.ds-switch-btn');
  const tabBtns = document.querySelectorAll('.ds-tab-btn');
  
  const modalName = document.getElementById('datasetModalName');
  const modalDesc = document.getElementById('datasetModalDesc');
  const splitBadge = document.getElementById('datasetSplitBadge');
  const codeContent = document.getElementById('datasetCodeContent');
  const downloadBtn = document.getElementById('datasetDownloadBtn');

  if (!modalStage || !modalWindow) return;

  const datasetVault = {
    pubmed: {
      name: 'Clinical PubMed QA (80 GB)',
      split: '800K Verified Clinical Splits',
      desc: '800K multi-turn biomedical reasoning pairs with clinical diagnostic rationales, PubMed ID citations, and human specialist ground truth.',
      filename: 'pubmed_qa_clinical_80gb.parquet',
      sample: `{
  "pmid": 34981042,
  "question": "Does microRNA-21 inhibition attenuate pulmonary fibrosis in bleomycin murine models?",
  "context": "MicroRNA-21 is significantly upregulated in fibrotic lung parenchyma. In vivo murine models received anti-miR-21 oligonucleotide therapy twice weekly for 21 days...",
  "reasoning_steps": [
    "Step 1: In vitro assessment confirmed 68% reduction of collagen-1 mRNA in TGF-b1-stimulated lung fibroblasts.",
    "Step 2: Histological Ashcroft fibrotic score was reduced from 6.8 to 2.4 (p < 0.001) in treatment vs control.",
    "Step 3: Hydroxyproline lung content normalized to near-baseline non-fibrotic levels."
  ],
  "final_answer": "yes",
  "medical_domain": "Pulmonology & Molecular Pathology",
  "verified_by": "Board-Certified Medical Pathologist (ATH Clinical NLP Lab)"
}`,
      schema: `pyarrow.schema([
    ('pmid', pa.int64()),
    ('question', pa.string()),
    ('context', pa.string()),
    ('reasoning_steps', pa.list_(pa.string())),
    ('final_answer', pa.string()),
    ('medical_domain', pa.string()),
    ('verified_by', pa.string()),
    ('embedding_768d', pa.list_(pa.float32()))
])`,
      code: `from datasets import load_dataset
import torch

# Stream 800K Clinical PubMed QA pairs directly into PyTorch
dataset = load_dataset(
    "ath-research/pubmed-qa-clinical-reasoning",
    split="train",
    streaming=True
)

for record in dataset.take(3):
    print("Question:", record["question"])
    print("Answer:  ", record["final_answer"])
    print("Verified:", record["verified_by"])`
    },
    finance: {
      name: 'Financial Quotes L3 (110 GB)',
      split: '4.2B Nanosecond Order Book Events',
      desc: 'Tick-level Level 3 limit order book data, order cancel/replace events, trade execution logs, and depth snapshots from US Equities & CME Perps.',
      filename: 'financial_quotes_l3_110gb.parquet',
      sample: `{
  "timestamp_ns": 1711728000000124982,
  "symbol": "NVDA",
  "exchange": "NASDAQ",
  "event_type": "ADD_ORDER",
  "order_id": 984210943,
  "side": "BUY",
  "price": 894.25,
  "shares": 500,
  "best_bid": 894.20,
  "best_ask": 894.30,
  "microprice": 894.248,
  "order_flow_imbalance_500ms": 0.342
}`,
      schema: `pyarrow.schema([
    ('timestamp_ns', pa.int64()),
    ('symbol', pa.string()),
    ('exchange', pa.string()),
    ('event_type', pa.string()),
    ('order_id', pa.int64()),
    ('side', pa.string()),
    ('price', pa.float64()),
    ('shares', pa.int32()),
    ('best_bid', pa.float64()),
    ('best_ask', pa.float64()),
    ('microprice', pa.float64()),
    ('order_flow_imbalance_500ms', pa.float32())
])`,
      code: `import pyarrow.parquet as pq
import polars as pl

# Fast Polars scan over 110GB L3 Market Data
df = pl.scan_parquet("s3://ath-open-datasets/financial_l3_2026.parquet") \\
    .filter(pl.col("symbol") == "NVDA") \\
    .select(["timestamp_ns", "side", "price", "shares", "microprice"]) \\
    .collect()

print("Loaded NVDA L3 Events:", df.shape)`
    },
    commoncrawl: {
      name: 'Common Crawl HQ (240 GB)',
      split: '1.8B Clean Deduplicated Documents',
      desc: 'High-perplexity filtered web corpus curated for LLM pre-training, fine-grained safety alignment, and dense factual reasoning.',
      filename: 'common_crawl_hq_240gb.parquet',
      sample: `{
  "doc_id": "ath_cc_2026_8849102",
  "url": "https://research.stanford.edu/ai/transformer-scaling",
  "source_domain": "stanford.edu",
  "char_count": 14280,
  "perplexity_score": 12.4,
  "synthetic_quality_tier": "A+",
  "text": "Recent investigations into Chinchilla compute-optimal scaling show that modern decoder-only transformers achieve optimal downstream generalization...",
  "primary_language": "en"
}`,
      schema: `pyarrow.schema([
    ('doc_id', pa.string()),
    ('url', pa.string()),
    ('source_domain', pa.string()),
    ('char_count', pa.int32()),
    ('perplexity_score', pa.float32()),
    ('synthetic_quality_tier', pa.string()),
    ('text', pa.string()),
    ('primary_language', pa.string())
])`,
      code: `from datasets import load_dataset

# Pre-training data loader with dynamic buffer shuffling
dataset = load_dataset(
    "ath-research/common-crawl-hq-curated",
    split="train",
    streaming=True
)

for doc in dataset.take(2):
    print("Domain:", doc["source_domain"])
    print("Length:", doc["char_count"], "chars")`
    },
    code: {
      name: 'Code Instruct 15L (70 GB)',
      split: '15M Multi-Turn Code Reasoning Traces',
      desc: 'Synthesized algorithmic solutions, unit test generation, AST transformations, and security vulnerability repair across 40 programming languages.',
      filename: 'code_instruct_15l_70gb.parquet',
      sample: `{
  "task_id": "PYTHON_CUDA_TENSOR_OPTIM_491",
  "language": "python",
  "problem_statement": "Implement fused Softmax + CrossEntropy with online normalizer for FlashAttention kernels in PyTorch C++ extension.",
  "algorithmic_solution": "import torch\\nimport triton\\nimport triton.language as tl\\n\\n@triton.jit\\ndef fused_softmax_kernel(x_ptr, y_ptr, n_cols, BLOCK_SIZE: tl.constexpr):\\n    row_idx = tl.program_id(0)\\n    ...",
  "unit_tests_passed": 14,
  "benchmark_eval": "HumanEval: 89.2% pass@1"
}`,
      schema: `pyarrow.schema([
    ('task_id', pa.string()),
    ('language', pa.string()),
    ('problem_statement', pa.string()),
    ('algorithmic_solution', pa.string()),
    ('unit_tests_passed', pa.int32()),
    ('benchmark_eval', pa.string())
])`,
      code: `from datasets import load_dataset

# Load Code Instruct 15L for SFT or DPO
dataset = load_dataset(
    "ath-research/code-instruct-15l",
    split="train",
    streaming=True
)

sample = next(iter(dataset))
print("Task:", sample["task_id"])
print("Code:\\n", sample["algorithmic_solution"][:200])`
    }
  };

  let currentDs = 'pubmed';
  let currentView = 'sample';
  let isModalOpen = false;

  function renderContent() {
    const ds = datasetVault[currentDs] || datasetVault.pubmed;
    if (modalName) modalName.textContent = ds.name;
    if (modalDesc) modalDesc.textContent = ds.desc;
    if (splitBadge) splitBadge.textContent = ds.split;

    if (codeContent) {
      if (currentView === 'sample') codeContent.textContent = ds.sample;
      else if (currentView === 'schema') codeContent.textContent = ds.schema;
      else if (currentView === 'code') codeContent.textContent = ds.code;
    }
  }

  function openModal(dsKey = 'pubmed') {
    if (isModalOpen) return;
    isModalOpen = true;

    if (datasetVault[dsKey]) currentDs = dsKey;
    
    // Update active switcher tab
    switchBtns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-ds') === currentDs);
    });

    renderContent();

    modalBackdrop.classList.add('active');
    modalStage.classList.add('active');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    modalStage.setAttribute('aria-hidden', 'false');

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(modalWindow,
        { scale: 0.85, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.5)' }
      );
    }
  }

  function closeModal() {
    if (!isModalOpen) return;
    
    if (typeof gsap !== 'undefined') {
      gsap.to(modalWindow, {
        scale: 0.88,
        opacity: 0,
        y: 10,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          modalBackdrop.classList.remove('active');
          modalStage.classList.remove('active');
          modalBackdrop.setAttribute('aria-hidden', 'true');
          modalStage.setAttribute('aria-hidden', 'true');
          isModalOpen = false;
        }
      });
    } else {
      modalBackdrop.classList.remove('active');
      modalStage.classList.remove('active');
      isModalOpen = false;
    }
  }

  // Switcher buttons
  switchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDs = btn.getAttribute('data-ds') || 'pubmed';
      renderContent();
    });
  });

  // View mode tabs (sample, schema, code)
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentView = btn.getAttribute('data-view') || 'sample';
      renderContent();
    });
  });

  // Open triggers
  if (openCtaBtn) {
    openCtaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(currentDs);
    });
  }

  dsItems.forEach(item => {
    item.addEventListener('click', () => {
      const dsKey = item.getAttribute('data-dataset') || 'pubmed';
      openModal(dsKey);
    });
  });

  // Close triggers
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (doneBtn) doneBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const ds = datasetVault[currentDs] || datasetVault.pubmed;
      downloadBtn.innerHTML = `<span>⏳ Preparing ${ds.filename}...</span>`;
      setTimeout(() => {
        downloadBtn.innerHTML = `<span>✓ Streaming from ATH Data Lake</span>`;
        setTimeout(() => {
          downloadBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg><span>Download Parquet</span>`;
        }, 2200);
      }, 700);
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isModalOpen) {
      closeModal();
    }
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

/* ==========================================================================
   6. Header Auto-Hide on Scroll Down / Reveal on Scroll Up
   ========================================================================== */
function initHeaderAutoHide() {
  const topbar = document.querySelector('.global-topbar');
  if (!topbar) return;

  let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScrollY > 60 && currentScrollY > lastScrollY) {
          // Scrolling down
          topbar.classList.add('topbar-hidden');
        } else {
          // Scrolling up
          topbar.classList.remove('topbar-hidden');
        }
        lastScrollY = Math.max(0, currentScrollY);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================================================
   7. Continuous Glowing Signal Pulses on SVG Circuit Wires
   ========================================================================== */
function initSignalWirePulses() {
  if (typeof gsap === 'undefined') return;
  const wirePaths = document.querySelectorAll('.graph-wires .wire-path');
  if (!wirePaths.length) return;

  wirePaths.forEach((path, i) => {
    const pulse = path.cloneNode(true);
    pulse.classList.add('wire-pulse');
    pulse.setAttribute('stroke', '#38bdf8');
    pulse.setAttribute('stroke-width', '2.5');
    
    let totalLen = 300;
    try {
      totalLen = path.getTotalLength() || 300;
    } catch (e) {
      totalLen = 300;
    }
    
    const pulseLen = Math.max(30, Math.min(60, totalLen * 0.25));
    pulse.style.strokeDasharray = `${pulseLen} ${totalLen * 2}`;
    pulse.style.strokeDashoffset = '0';
    pulse.style.pointerEvents = 'none';

    path.parentNode.appendChild(pulse);

    gsap.fromTo(pulse, 
      { strokeDashoffset: totalLen + pulseLen },
      {
        strokeDashoffset: -totalLen,
        duration: 2.4 + (i % 4) * 0.5,
        repeat: -1,
        ease: 'power1.inOut',
        delay: i * 0.3
      }
    );
  });
}

/* ==========================================================================
   8. Floating Parallax Micro-Physics on Satellite Nodes
   ========================================================================== */
function initFloatingNodeParallax() {
  if (typeof gsap === 'undefined') return;
  const satelliteNodes = document.querySelectorAll('.hero-graph-container .graph-node:not(.node-central-card)');
  
  satelliteNodes.forEach((node, idx) => {
    const yOffset = (idx % 2 === 0 ? 1 : -1) * (4 + (idx % 3) * 2);
    const rotOffset = (idx % 2 === 0 ? 1 : -1) * (1.2 + (idx % 2) * 0.8);
    const duration = 2.4 + ((idx * 0.4) % 1.6);

    gsap.to(node, {
      y: `+=${yOffset}`,
      rotation: `+=${rotOffset}`,
      duration: duration,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      delay: idx * 0.2
    });
  });

  // Central ATH core subtle micro-pulse
  const centralCard = document.querySelector('.node-central-card');
  if (centralCard) {
    gsap.to(centralCard, {
      y: '-=3',
      duration: 3.2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });
  }
}

/* ==========================================================================
   9. Scroll-Triggered Animated Counters
   ========================================================================== */
function initAnimatedCounters() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Donut badge counter: +98%
  const donutBadge = document.querySelector('.donut-badge');
  if (donutBadge) {
    ScrollTrigger.create({
      trigger: donutBadge,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 98,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            donutBadge.textContent = `+${Math.round(obj.val)}%`;
          }
        });
      }
    });
  }

  // Token percentage: +25%
  const tokPct = document.querySelector('.tok-pct');
  if (tokPct) {
    ScrollTrigger.create({
      trigger: tokPct,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 25,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: () => {
            tokPct.textContent = `+${Math.round(obj.val)}%`;
          }
        });
      }
    });
  }

  // Latency gauge: 4ms
  const gaugeTag = document.querySelector('.gauge-tag');
  if (gaugeTag) {
    ScrollTrigger.create({
      trigger: gaugeTag,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const obj = { val: 50 };
        gsap.to(obj, {
          val: 4,
          duration: 1.4,
          ease: 'power3.out',
          onUpdate: () => {
            gaugeTag.textContent = `${Math.round(obj.val)}ms`;
          }
        });
      }
    });
  }

  // Win chip: +98% RAG
  const winChip = document.querySelector('.win-chip');
  if (winChip) {
    ScrollTrigger.create({
      trigger: winChip,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 98,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            winChip.textContent = `+${Math.round(obj.val)}% RAG`;
          }
        });
      }
    });
  }
}

/* ==========================================================================
   10. Global Click Ripple Wave
   ========================================================================== */
function initGlobalClickRipple() {
  document.addEventListener('click', (e) => {
    // Prevent ripple if clicking inside modal or dock
    if (e.target.closest('.portal-window') || e.target.closest('.portal-side-dock')) return;

    const ripple = document.createElement('div');
    ripple.className = 'interactive-click-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);

    if (typeof gsap !== 'undefined') {
      gsap.to(ripple, {
        scale: 3.5,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => ripple.remove()
      });
    } else {
      setTimeout(() => ripple.remove(), 600);
    }
  });
}

/* ==========================================================================
   11. 3D Student Login Portal with macOS Genie Minimization & Side Dock
   ========================================================================== */
function initPortalLoginModal() {
  const portalStage = document.getElementById('portalStage');
  const portalWindow = document.getElementById('portalWindow');
  const portalBackdrop = document.getElementById('portalBackdrop');
  const portalSideDock = document.getElementById('portalSideDock');
  const dockRestoreBtn = document.getElementById('dockRestoreBtn');
  const openPortalBtn = document.getElementById('openPortalBtn');
  const profileBtn = document.querySelector('.profile-btn');
  const portalCloseDot = document.getElementById('portalCloseDot');
  const portalMinDot = document.getElementById('portalMinDot');
  const portalExpandDot = document.getElementById('portalExpandDot');
  const pwdToggleBtn = document.getElementById('pwdToggleBtn');
  const portalPassword = document.getElementById('portalPassword');
  const tabSignIn = document.getElementById('tabSignIn');
  const tabEnroll = document.getElementById('tabEnroll');
  const portalSubmitBtn = document.getElementById('portalSubmitBtn');
  const trackPills = document.querySelectorAll('.track-pill');

  if (!portalWindow || !portalStage || !portalSideDock) return;

  let isPortalOpen = false;
  let isAnimating = false;

  // Track Pills Selection
  trackPills.forEach(pill => {
    pill.addEventListener('click', () => {
      trackPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // Password Visibility Toggle
  if (pwdToggleBtn && portalPassword) {
    pwdToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isPwd = portalPassword.type === 'password';
      portalPassword.type = isPwd ? 'text' : 'password';
      pwdToggleBtn.style.color = isPwd ? '#38bdf8' : '#64748b';
    });
  }

  // Sign In vs Enroll Tabs
  if (tabSignIn && tabEnroll) {
    tabSignIn.addEventListener('click', () => {
      tabSignIn.classList.add('active');
      tabSignIn.setAttribute('aria-selected', 'true');
      tabEnroll.classList.remove('active');
      tabEnroll.setAttribute('aria-selected', 'false');
      if (portalSubmitBtn) {
        portalSubmitBtn.querySelector('.submit-text').textContent = 'Authenticate & Launch Cluster';
      }
    });

    tabEnroll.addEventListener('click', () => {
      tabEnroll.classList.add('active');
      tabEnroll.setAttribute('aria-selected', 'true');
      tabSignIn.classList.remove('active');
      tabSignIn.setAttribute('aria-selected', 'false');
      if (portalSubmitBtn) {
        portalSubmitBtn.querySelector('.submit-text').textContent = 'Submit Enrollment & Claim GPU Access';
      }
    });
  }

  // Form Submission Simulation
  if (portalSubmitBtn) {
    portalSubmitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const submitText = portalSubmitBtn.querySelector('.submit-text');
      const prevText = submitText.textContent;
      submitText.textContent = 'Authenticating Cluster...';
      portalSubmitBtn.style.pointerEvents = 'none';

      setTimeout(() => {
        submitText.textContent = '✓ Workstation Ready! Launching...';
        portalSubmitBtn.style.background = 'linear-gradient(135deg, #059669 0%, #10b981 100%)';
        setTimeout(() => {
          minimizePortal(true);
          setTimeout(() => {
            submitText.textContent = prevText;
            portalSubmitBtn.style.background = '';
            portalSubmitBtn.style.pointerEvents = 'auto';
          }, 800);
        }, 1000);
      }, 900);
    });
  }

  // 3D Tilt on Mousemove across the Portal Window
  portalWindow.addEventListener('mousemove', (e) => {
    if (!isPortalOpen || isAnimating) return;
    const rect = portalWindow.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    portalWindow.style.setProperty('--sheen-x', `${(x / rect.width) * 100}%`);
    portalWindow.style.setProperty('--sheen-y', `${(y / rect.height) * 100}%`);

    if (typeof gsap !== 'undefined') {
      gsap.to(portalWindow, {
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 0.3,
        ease: 'power1.out',
        overwrite: 'auto'
      });
    }
  });

  portalWindow.addEventListener('mouseleave', () => {
    if (!isPortalOpen || isAnimating) return;
    if (typeof gsap !== 'undefined') {
      gsap.to(portalWindow, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  });

  // Calculate target offset between window center and docked button
  function getDockOffsets() {
    const dockRect = dockRestoreBtn.getBoundingClientRect();
    const winRect = portalWindow.getBoundingClientRect();

    const winCenterX = winRect.left + winRect.width / 2;
    const winCenterY = winRect.top + winRect.height / 2;

    const dockCenterX = dockRect.left + dockRect.width / 2;
    const dockCenterY = dockRect.top + dockRect.height / 2;

    return {
      x: dockCenterX - winCenterX,
      y: dockCenterY - winCenterY
    };
  }

  // MACOS GENIE MINIMIZATION
  function minimizePortal(skipSound = false) {
    if (isAnimating) return;
    isAnimating = true;

    const offset = getDockOffsets();

    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline({
        onComplete: () => {
          isPortalOpen = false;
          isAnimating = false;
          portalStage.classList.remove('active');
          portalBackdrop.classList.remove('active');
          portalStage.setAttribute('aria-hidden', 'true');
          portalBackdrop.setAttribute('aria-hidden', 'true');

          // MacOS Dock arrival bounce / magnification
          gsap.fromTo(dockRestoreBtn, 
            { scale: 0.75, x: 25 },
            { scale: 1, x: 0, duration: 0.55, ease: 'back.out(2)' }
          );
        }
      });

      // Backdrop fades out
      tl.to(portalBackdrop, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out'
      }, 0);

      // MacOS Genie Curve: Squeezes, tilts and swoops toward the side dock
      tl.to(portalWindow, {
        x: offset.x,
        y: offset.y,
        scaleX: 0.08,
        scaleY: 0.05,
        rotationY: -35,
        rotationX: 18,
        rotationZ: -8,
        opacity: 0.05,
        filter: 'blur(10px)',
        transformOrigin: '95% 50%',
        duration: 0.65,
        ease: 'power3.inOut'
      }, 0);

    } else {
      isPortalOpen = false;
      isAnimating = false;
      portalStage.classList.remove('active');
      portalBackdrop.classList.remove('active');
    }
  }

  // MACOS UN-MINIMIZE / RESTORE GENIE EXPANSION
  function restorePortal() {
    if (isAnimating || isPortalOpen) return;
    isAnimating = true;

    portalStage.classList.add('active');
    portalBackdrop.classList.add('active');
    portalStage.setAttribute('aria-hidden', 'false');
    portalBackdrop.setAttribute('aria-hidden', 'false');

    const offset = getDockOffsets();

    if (typeof gsap !== 'undefined') {
      // Dock click feedback bounce
      gsap.to(dockRestoreBtn, {
        scale: 0.88,
        duration: 0.12,
        yoyo: true,
        repeat: 1
      });

      const tl = gsap.timeline({
        onComplete: () => {
          isPortalOpen = true;
          isAnimating = false;
          portalWindow.style.transformOrigin = '50% 50%';
        }
      });

      tl.set(portalBackdrop, { opacity: 0 });
      tl.to(portalBackdrop, { opacity: 1, duration: 0.45, ease: 'power2.out' }, 0);

      // Genie Expansion out of dock into center with 3D settle
      tl.fromTo(portalWindow, {
        x: offset.x,
        y: offset.y,
        scaleX: 0.08,
        scaleY: 0.05,
        rotationY: -35,
        rotationX: 18,
        rotationZ: -8,
        opacity: 0.05,
        filter: 'blur(10px)',
        transformOrigin: '95% 50%'
      }, {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        rotationY: 0,
        rotationX: 0,
        rotationZ: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.72,
        ease: 'power4.out'
      }, 0.05);

    } else {
      isPortalOpen = true;
      isAnimating = false;
    }
  }

  // Event Listeners for Opening/Closing
  if (openPortalBtn) openPortalBtn.addEventListener('click', restorePortal);
  if (profileBtn) profileBtn.addEventListener('click', restorePortal);
  if (dockRestoreBtn) dockRestoreBtn.addEventListener('click', restorePortal);
  
  // Footer portal trigger buttons
  const footerPortalBtns = document.querySelectorAll('.open-portal-footer');
  footerPortalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      restorePortal();
    });
  });

  if (portalCloseDot) portalCloseDot.addEventListener('click', () => minimizePortal());
  if (portalMinDot) portalMinDot.addEventListener('click', () => minimizePortal());
  if (portalExpandDot) {
    portalExpandDot.addEventListener('click', () => {
      gsap.to(portalWindow, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.3 });
    });
  }

  // Backdrop click minimizes to side
  if (portalBackdrop) {
    portalBackdrop.addEventListener('click', () => {
      if (isPortalOpen) minimizePortal();
    });
  }

  // Keyboard shortcut: Esc to minimize, Cmd+K / Ctrl+K to open
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isPortalOpen) {
      minimizePortal();
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (isPortalOpen) minimizePortal();
      else restorePortal();
    }
  });
}

