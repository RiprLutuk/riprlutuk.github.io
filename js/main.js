/**
 * Core UI Controller, Typewriter, Background Particle Mesh with Mouse Gravity & Interactive Effects
 * Pure Vanilla ES6 — 60fps Butter Smooth Execution
 */

// ==========================================
// 1. TYPEWRITER ENGINE
// ==========================================
class TypeWriter {
  constructor(el, phrases) {
    this.el = el;
    this.phrases = phrases;
    this.phraseIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.type();
  }

  type() {
    const current = this.phrases[this.phraseIndex];
    if (this.isDeleting) {
      this.charIndex--;
      this.el.textContent = current.substring(0, this.charIndex);
    } else {
      this.charIndex++;
      this.el.textContent = current.substring(0, this.charIndex);
    }

    let speed = this.isDeleting ? 25 : 55;

    if (!this.isDeleting && this.charIndex === current.length) {
      speed = 2200; // Pause at end of sentence
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
      speed = 400;
    }

    setTimeout(() => this.type(), speed);
  }
}

// ==========================================
// 2. SOUND FX SYNTHESIZER
// ==========================================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem("ripr_sound_muted") !== "false"; // Default muted
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  playSuccess() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.2);
    } catch (e) {}
  }

  toggleMute(forcedVal = null) {
    this.isMuted = forcedVal !== null ? forcedVal : !this.isMuted;
    localStorage.setItem("ripr_sound_muted", this.isMuted);
    return this.isMuted;
  }
}

// ==========================================
// 3. THEME MANAGER
// ==========================================
class ThemeManager {
  constructor() {
    this.themes = ["obsidian", "matrix", "cyberpunk", "light"];
    this.currentTheme = localStorage.getItem("ripr_theme") || "obsidian";
    this.applyTheme(this.currentTheme);
  }

  applyTheme(theme) {
    if (!this.themes.includes(theme)) theme = "obsidian";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ripr_theme", theme);
    this.currentTheme = theme;
  }

  cycleTheme() {
    const currentIndex = this.themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % this.themes.length;
    const nextTheme = this.themes[nextIndex];
    this.applyTheme(nextTheme);
    return nextTheme;
  }
}

// ==========================================
// 4. ADVANCED NEURAL CONSTELLATION & GRAVITY FIELD CANVAS
// ==========================================
class ParticleMesh {
  constructor() {
    this.canvas = document.getElementById("bg-canvas") || document.getElementById("ambient-particle-canvas");
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.particleCount = window.innerWidth < 768 ? 40 : 80;
    this.mouse = { x: -1000, y: -1000, radius: 160 };

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      const isOrange = Math.random() > 0.45;
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1.2,
        baseColor: isOrange ? "rgba(249, 115, 22," : "rgba(16, 185, 129,",
        alpha: Math.random() * 0.5 + 0.25,
        pulseSpeed: Math.random() * 0.02 + 0.01
      });
    }
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      this.resize();
      this.createParticles();
    });

    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener("mouseout", () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Natural movement
      p.x += p.vx;
      p.y += p.vy;

      // Pulse alpha
      p.alpha += Math.sin(Date.now() * p.pulseSpeed * 0.1) * 0.005;
      if (p.alpha < 0.15) p.alpha = 0.15;
      if (p.alpha > 0.8) p.alpha = 0.8;

      // Mouse gravity repulsion & deflection
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.mouse.radius && dist > 0) {
        const force = (this.mouse.radius - dist) / this.mouse.radius;
        const angle = Math.atan2(dy, dx);
        p.x -= Math.cos(angle) * force * 3;
        p.y -= Math.sin(angle) * force * 3;
      }

      // Screen boundary bounce
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      // Draw particle glow
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `${p.baseColor} ${p.alpha})`;
      this.ctx.shadowColor = p.baseColor.includes("249") ? "#f97316" : "#10b981";
      this.ctx.shadowBlur = 8;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // Connect adjacent nodes
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const distNodes = Math.hypot(p.x - p2.x, p.y - p2.y);

        if (distNodes < 110) {
          const lineAlpha = (1 - distNodes / 110) * 0.22;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(249, 115, 22, ${lineAlpha})`;
          this.ctx.lineWidth = 0.75;
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ==========================================
// 5. 3D HOLOGRAPHIC PARALLAX CARD TILT ENGINE
// ==========================================
class CardTilt3D {
  constructor() {
    this.cards = document.querySelectorAll(".bento-card, .benchmark-box, .dba-lab-card, .roi-results-card, .repo-card");
    this.init();
  }

  init() {
    if (window.innerWidth < 768) return; // Disable tilt on mobile for performance

    this.cards.forEach(card => {
      card.addEventListener("mousemove", (e) => this.handleMouseMove(e, card));
      card.addEventListener("mouseleave", () => this.handleMouseLeave(card));
    });
  }

  handleMouseMove(e, card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px) scale3d(1.01, 1.01, 1.01)`;
  }

  handleMouseLeave(card) {
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)";
  }
}

// ==========================================
// 6. ROLLING METRIC COUNTER TICKER
// ==========================================
class RollingCounters {
  constructor() {
    this.hasAnimated = false;
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true;
          this.animateNumbers();
        }
      });
    }, { threshold: 0.2 });

    const heroSection = document.getElementById("hero");
    if (heroSection) observer.observe(heroSection);
  }

  animateNumbers() {
    const counters = [
      { el: document.querySelector(".hero-counter-sla"), target: 99.98, decimals: 2, suffix: "%" },
      { el: document.querySelector(".hero-counter-exp"), target: 7, decimals: 0, suffix: "+ Years" },
      { el: document.querySelector(".hero-counter-nodes"), target: 100, decimals: 0, suffix: "+ Nodes" }
    ];

    counters.forEach(({ el, target, decimals, suffix }) => {
      if (!el) return;
      let start = 0;
      const duration = 1600;
      const startTime = performance.now();

      const update = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (target - start) * easeOut;

        el.textContent = `${current.toFixed(decimals)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = `${target.toFixed(decimals)}${suffix}`;
        }
      };

      requestAnimationFrame(update);
    });
  }
}

// ==========================================
// 7. GLOBAL TOAST ALERTS & MODAL CONTROLLERS
// ==========================================
window.showToast = function(message, duration = 3000) {
  let toast = document.getElementById("cyber-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "cyber-toast";
    toast.className = "cyber-toast";
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span style="color:var(--accent-primary); font-weight:800;">⚡ SYSTEM:</span> ${message}`;
  toast.classList.add("show");

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
};

class ModalManager {
  constructor() {
    this.bindModals();
  }

  bindModals() {
    // Open Resume Modal
    document.querySelectorAll(".open-resume-modal-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (window.soundFx) window.soundFx.playClick();
        this.openModal("resume-modal");
      });
    });

    // Open Contact Modal
    document.querySelectorAll(".open-contact-modal-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (window.soundFx) window.soundFx.playClick();
        this.openModal("contact-modal");
      });
    });

    // Close buttons & backdrop click
    document.querySelectorAll(".modal-backdrop").forEach(modal => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal || e.target.classList.contains("modal-close-btn") || e.target.closest(".modal-close-btn")) {
          this.closeModal(modal.id);
        }
      });
    });

    // Copy to clipboard buttons
    document.querySelectorAll(".copy-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const text = btn.getAttribute("data-copy");
        const msg = btn.getAttribute("data-msg") || "Copied to clipboard!";
        if (text) {
          navigator.clipboard.writeText(text).then(() => {
            if (window.soundFx) window.soundFx.playSuccess();
            window.showToast(msg);
          });
        }
      });
    });
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("active");
      modal.classList.add("open");
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("active");
      modal.classList.remove("open");
    }
  }
}

// ==========================================
// 8. CYBERNETIC LEFT-RIGHT SWIPE & INFINITE LOOP AUTO-CAROUSEL ENGINE
// ==========================================
class CyberCarousel {
  constructor(trackEl, options = {}) {
    this.track = trackEl;
    if (!this.track) return;

    this.prevBtn = options.prevBtn || null;
    this.nextBtn = options.nextBtn || null;
    this.dotsWrap = options.dotsWrap || null;
    this.counterEl = options.counterEl || null;
    this.autoPlayInterval = options.autoPlayInterval || 4000;
    this.autoPlay = options.autoPlay !== false;
    
    this.currentIndex = 0;
    this.items = [];
    this.autoTimer = null;
    this.resumeTimeout = null;
    this.isPaused = false;

    this.init();
  }

  init() {
    if (!this.track) return;
    this.updateItems();
    if (this.items.length === 0) return;

    this.currentIndex = Math.max(0, Math.min(this.currentIndex, this.items.length - 1));
    this.bindEvents();
    this.renderDots();
    this.updateUI();

    if (this.autoPlay && this.items.length > 1) {
      this.initIntersectionObserver();
      this.startAutoPlay();
    }
  }

  updateItems() {
    this.items = Array.from(this.track.children).filter(child => {
      return child.nodeType === 1 && !child.classList.contains('carousel-ignore') && window.getComputedStyle(child).display !== 'none';
    });
  }

  bindEvents() {
    if (this._eventsBound) return;
    this._eventsBound = true;

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.pauseAutoPlay();
        this.scrollPrev();
        this.resumeAutoPlayAfterDelay(5000);
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.pauseAutoPlay();
        this.scrollNext();
        this.resumeAutoPlayAfterDelay(5000);
      });
    }

    // Touch & Mouse hover interactions
    this.track.addEventListener('touchstart', () => this.pauseAutoPlay(), { passive: true });
    this.track.addEventListener('touchend', () => this.resumeAutoPlayAfterDelay(4000), { passive: true });
    this.track.addEventListener('mouseenter', () => this.pauseAutoPlay());
    this.track.addEventListener('mouseleave', () => this.resumeAutoPlayAfterDelay(2000));

    let scrollTimeout;
    this.track.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => this.handleScroll(), 60);
    }, { passive: true });

    window.addEventListener('resize', () => {
      this.updateUI();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAutoPlay();
      } else if (this.autoPlay && this.items.length > 1) {
        this.startAutoPlay();
      }
    });
  }

  initIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!this.isPaused) this.startAutoPlay();
        } else {
          this.pauseAutoPlay();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(this.track);
  }

  startAutoPlay() {
    this.stopAutoPlay();
    if (!this.autoPlay || this.items.length <= 1) return;
    this.autoTimer = setInterval(() => {
      this.scrollNext(true);
    }, this.autoPlayInterval);
  }

  stopAutoPlay() {
    if (this.autoTimer) {
      clearInterval(this.autoTimer);
      this.autoTimer = null;
    }
  }

  pauseAutoPlay() {
    this.isPaused = true;
    this.stopAutoPlay();
    if (this.resumeTimeout) {
      clearTimeout(this.resumeTimeout);
      this.resumeTimeout = null;
    }
  }

  resumeAutoPlayAfterDelay(delay = 4000) {
    if (this.resumeTimeout) clearTimeout(this.resumeTimeout);
    this.resumeTimeout = setTimeout(() => {
      this.isPaused = false;
      this.startAutoPlay();
    }, delay);
  }

  handleScroll() {
    this.updateItems();
    if (this.items.length === 0) return;

    const trackRect = this.track.getBoundingClientRect();
    const trackCenter = trackRect.left + trackRect.width / 2;

    let closestIndex = 0;
    let minDistance = Infinity;

    this.items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.left + rect.width / 2;
      const distance = Math.abs(itemCenter - trackCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== this.currentIndex) {
      this.currentIndex = closestIndex;
      this.updateUI();
    }
  }

  scrollToIndex(index, isAuto = false) {
    this.updateItems();
    const count = this.items.length;
    if (count === 0) return;

    // Continuous Infinite Loop Wrap
    if (index >= count) {
      index = 0;
    } else if (index < 0) {
      index = count - 1;
    }

    this.currentIndex = index;

    const targetItem = this.items[index];
    if (targetItem) {
      const trackRect = this.track.getBoundingClientRect();
      const itemRect = targetItem.getBoundingClientRect();
      const offset = itemRect.left - trackRect.left + this.track.scrollLeft - (trackRect.width - itemRect.width) / 2;

      this.track.scrollTo({
        left: Math.max(0, offset),
        behavior: 'smooth'
      });
    }

    this.updateUI();
    if (!isAuto && window.soundFx && typeof window.soundFx.playClick === 'function') {
      window.soundFx.playClick();
    }
  }

  scrollPrev() {
    this.scrollToIndex(this.currentIndex - 1);
  }

  scrollNext(isAuto = false) {
    this.scrollToIndex(this.currentIndex + 1, isAuto);
  }

  renderDots() {
    if (!this.dotsWrap) return;
    this.updateItems();
    this.dotsWrap.innerHTML = '';

    // If only 1 item, or if more than 7 items (e.g. 18 repos), hide dots to eliminate visual clutter and rely on the counter badge
    if (this.items.length <= 1 || this.items.length > 7) {
      this.dotsWrap.style.display = 'none';
      return;
    }
    this.dotsWrap.style.display = 'flex';

    this.items.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${i === this.currentIndex ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        this.pauseAutoPlay();
        this.scrollToIndex(i);
        this.resumeAutoPlayAfterDelay(5000);
      });
      this.dotsWrap.appendChild(dot);
    });
  }

  updateUI() {
    this.updateItems();
    const count = this.items.length;
    if (count === 0) {
      if (this.counterEl) this.counterEl.textContent = '0 / 0';
      return;
    }

    // Always enabled for continuous infinite loop
    if (this.prevBtn) {
      this.prevBtn.disabled = false;
      this.prevBtn.classList.remove('disabled');
    }

    if (this.nextBtn) {
      this.nextBtn.disabled = false;
      this.nextBtn.classList.remove('disabled');
    }

    if (this.counterEl) {
      this.counterEl.textContent = `${this.currentIndex + 1} / ${count}`;
    }

    if (this.dotsWrap) {
      const dots = this.dotsWrap.querySelectorAll('.carousel-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === this.currentIndex);
      });
    }
  }
}
window.CyberCarousel = CyberCarousel;

// ==========================================
// 9. CYBERNETIC MOBILE NAVIGATION DRAWER CONTROLLER
// ==========================================
class MobileNavDrawer {
  constructor() {
    this.drawer = document.getElementById('mobile-nav-drawer');
    this.toggleBtn = document.getElementById('mobile-menu-toggle');
    this.closeBtn = document.getElementById('mobile-drawer-close');
    this.backdrop = document.getElementById('mobile-drawer-backdrop');
    this.navLinks = document.querySelectorAll('.mobile-nav-link');
    this.init();
  }

  init() {
    if (!this.drawer || !this.toggleBtn) return;

    this.toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.open();
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.close();
      });
    }

    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => this.close());
    }

    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.close();
      });
    });

    const actionBtns = this.drawer.querySelectorAll('.open-resume-modal-btn, .open-terminal-btn');
    actionBtns.forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.drawer.classList.contains('open')) {
        this.close();
      }
    });
  }

  open() {
    this.drawer.classList.add('open');
    this.drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (window.soundFx && typeof window.soundFx.playClick === 'function') {
      window.soundFx.playClick();
    }
  }

  close() {
    this.drawer.classList.remove('open');
    this.drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

// ==========================================
// 10. BOOTSTRAP ALL CONTROLLERS SAFELY
// ==========================================
function startCoreEngine() {
  window.soundFx = new SoundFX();
  window.themeManager = new ThemeManager();
  window.modalManager = new ModalManager();
  window.mobileNavDrawer = new MobileNavDrawer();
  window.particleMesh = new ParticleMesh();
  window.cardTilt3D = new CardTilt3D();
  window.rollingCounters = new RollingCounters();

  // Initialize Cyber Carousels
  const projTrack = document.getElementById('projects-carousel-track');
  if (projTrack) {
    window.projectsCarousel = new CyberCarousel(projTrack, {
      prevBtn: document.getElementById('projects-prev-btn'),
      nextBtn: document.getElementById('projects-next-btn'),
      dotsWrap: document.getElementById('projects-carousel-dots'),
      counterEl: document.getElementById('projects-carousel-counter')
    });
  }

  const benchTrack = document.getElementById('benchmarks-carousel-track');
  if (benchTrack) {
    window.benchmarksCarousel = new CyberCarousel(benchTrack, {
      prevBtn: document.getElementById('benchmarks-prev-btn'),
      nextBtn: document.getElementById('benchmarks-next-btn'),
      dotsWrap: document.getElementById('benchmarks-carousel-dots'),
      counterEl: document.getElementById('benchmarks-carousel-counter')
    });
  }

  const eduTrack = document.getElementById('education-carousel-track');
  if (eduTrack) {
    window.educationCarousel = new CyberCarousel(eduTrack, {
      prevBtn: document.getElementById('education-prev-btn'),
      nextBtn: document.getElementById('education-next-btn'),
      dotsWrap: document.getElementById('education-carousel-dots'),
      counterEl: document.getElementById('education-carousel-counter')
    });
  }

  // Initialize Typewriter Effect
  const typeEl = document.getElementById("hero-dynamic-text");
  if (typeEl) {
    window.heroTypewriter = new TypeWriter(typeEl, [
      "Android Native & Flutter Mobile Apps.",
      "Zero-Downtime HA Database Clusters.",
      "High-Throughput Go & Python APIs.",
      "Real-Time Kafka & ClickHouse CDC.",
      "ISO 27001 & UU PDP Certified Lead."
    ]);
  }

// ==========================================
  // Recruiter 1-Click Role Matcher Controller
  // ==========================================
  const matcherData = {
    fullstack: {
      badge: "Fullstack & Mobile Maestro (Java Native, Flutter, Vue, Laravel)",
      desc: "End-to-end fullstack web & cross-platform mobile engineering: Flutter & Android mobile apps, Vue 3 PWAs with embedded WASM, responsive Tailwind CSS, WebSockets, Anti-Mock GPS, and Face ID biometric authentication."
    },
    dba: {
      badge: "7+ Years Track Record",
      desc: "Proven production experience managing high-availability multi-engine clusters at PT Link Net Tbk (99.98% SLA), query plan optimizer, partition tuning, and RMAN automated disaster recovery."
    },
    platform: {
      badge: "Go, Python & Microservices",
      desc: "Engineered DDAG Zero-Trust API gateway in Go with dynamic schema reflection, sub-2.5ms latency overhead, JWT auth, and PgBouncer connection multiplexing."
    },
    cdc: {
      badge: "Kafka + ClickHouse + Debezium",
      desc: "Architected real-time Change Data Capture pipelines streaming 50M+ mutations from OLTP into ClickHouse columnar storage for sub-second analytical reporting."
    },
    security: {
      badge: "Lead ISO 27001:2022 & UU PDP",
      desc: "Led security compliance across AFPI Fintech Data Center for 100+ P2P nodes, IPsec StrongSwan VPNs, FortiGate perimeter security, and pgAudit 5-year log retention."
    }
  };

  const matcherPills = document.querySelectorAll(".matcher-pill-btn");
  const matcherDescEl = document.getElementById("matcher-desc");
  const matcherBadgeEl = document.getElementById("matcher-exp-badge");

  if (matcherPills.length > 0) {
    matcherPills.forEach(pill => {
      pill.addEventListener("click", () => {
        matcherPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        const role = pill.getAttribute("data-role");
        const data = matcherData[role];
        if (data && matcherDescEl && matcherBadgeEl) {
          if (window.soundFx) window.soundFx.playClick();
          matcherDescEl.textContent = data.desc;
          matcherBadgeEl.textContent = data.badge;
          if (window.showToast) window.showToast(`Selected Role: ${pill.textContent.trim()} (100% Match)`);
        }
      });
    });
  }

  // ==========================================
  // Universal Project Sandbox Controller
  // ==========================================
  const sandboxBtns = document.querySelectorAll(".sandbox-trigger-btn");
  sandboxBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute("data-target");
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        const isActive = targetPanel.classList.toggle("active");
        btn.classList.toggle("active", isActive);
        if (window.soundFx) window.soundFx.playSuccess();
        if (isActive && window.showToast) {
          const title = targetPanel.querySelector(".sandbox-title");
          window.showToast(title ? `Executed: ${title.textContent}` : "Interactive Sandbox Executed!");
        }
      }
    });
  });

// ==========================================
  // Interactive Technical Trivia Quiz Controller
  // ==========================================
  const quizBoxes = document.querySelectorAll(".quiz-question-box");
  quizBoxes.forEach(box => {
    const btns = box.querySelectorAll(".quiz-option-btn");
    const explanation = box.querySelector(".quiz-explanation");
    btns.forEach(btn => {
      btn.addEventListener("click", () => {
        const isCorrect = btn.getAttribute("data-correct") === "true";
        btns.forEach(b => {
          b.disabled = true;
          if (b.getAttribute("data-correct") === "true") b.classList.add("correct");
        });
        if (!isCorrect) {
          btn.classList.add("wrong");
          if (window.soundFx) window.soundFx.playClick();
          if (window.showToast) window.showToast("Incorrect — See Heri's Production Architecture Solution!");
        } else {
          if (window.soundFx) window.soundFx.playSuccess();
          if (window.showToast) window.showToast("✅ Correct Answer! 345x Speedup Achieved!");
        }
        if (explanation) explanation.classList.add("active");
      });
    });
  });

// ==========================================
  // Dynamic Persona Switcher Controller
  // ==========================================
  const personaPills = document.querySelectorAll(".persona-pill-btn");
  const pitchIcon = document.getElementById("pitch-icon");
  const pitchTitle = document.getElementById("pitch-title");
  const pitchBadge = document.getElementById("pitch-badge");
  const pitchPoints = document.getElementById("pitch-points");
  const pitchCtaTg = document.getElementById("pitch-cta-tg");

  const PERSONA_DATA = {
    recruiter: {
      icon: "👔",
      title: "Senior DBA, Fullstack Platform & Mobile Architect",
      badge: "Immediate Fit",
      points: `
        <div class="persona-pitch-point-item"><span>🎯</span><span><strong>Target Roles:</strong> Senior DBA, Platform Engineer, Fullstack &amp; Mobile Architect.</span></div>
        <div class="persona-pitch-point-item"><span>🏢</span><span><strong>Enterprise Pedigree:</strong> PT Link Net Tbk (99.98% SLA), AFPI Fintech Data Center (ISO 27001).</span></div>
        <div class="persona-pitch-point-item"><span>💼</span><span><strong>Availability:</strong> Open for Full-Time &amp; High-Impact Consulting (Remote / Hybrid / On-Site).</span></div>
        <div class="persona-pitch-point-item"><span>📄</span><span><strong>ATS Match Score:</strong> 98/100 verified on Workday, Taleo, and Greenhouse.</span></div>
      `,
      tgLink: "https://t.me/riprlutuk?text=Halo%20Heri,%20kami%20dari%20tim%20Recruitment%20tertarik%20dengan%20profil%20Anda"
    },
    founder: {
      icon: "🚀",
      title: "The \"One-Man IT Division\" — Fast 0-to-1 MVP & Scalability",
      badge: "Founder & CTO Match",
      points: `
        <div class="persona-pitch-point-item"><span>📱</span><span><strong>Mobile &amp; Web Apps:</strong> Android Native (Java/Kotlin), Flutter, Vue 3 PWA, React.</span></div>
        <div class="persona-pitch-point-item"><span>⚡</span><span><strong>Backend &amp; APIs:</strong> High-throughput Go &amp; Python microservices, Laravel 11, Fastify.</span></div>
        <div class="persona-pitch-point-item"><span>💾</span><span><strong>Rock-Solid Databases:</strong> PostgreSQL, Redis caching, zero-downtime database architecture.</span></div>
        <div class="persona-pitch-point-item"><span>💰</span><span><strong>4-in-1 Efficiency:</strong> 1 veteran engineer executing your entire stack without hiring 4 specialists.</span></div>
      `,
      tgLink: "https://t.me/riprlutuk?text=Halo%20Heri,%20saya%20Founder/CTO%20ingin%20diskusi%20pengembangan%20produk%20kami"
    },
    enterprise: {
      icon: "🏢",
      title: "Enterprise Database Migrations, 99.98% SLA & ISO 27001 ISMS",
      badge: "Enterprise Scale",
      points: `
        <div class="persona-pitch-point-item"><span>🔄</span><span><strong>Proven Migrations:</strong> Oracle 19c &rarr; PostgreSQL 16, MongoDB &rarr; AWS DocumentDB, AWS RDS &rarr; TencentDB.</span></div>
        <div class="persona-pitch-point-item"><span>🛡️</span><span><strong>Security &amp; Compliance:</strong> Lead ISO/IEC 27001:2022, UU No. 27/2022 (UU PDP), Fortinet FortiGate IPsec.</span></div>
        <div class="persona-pitch-point-item"><span>📊</span><span><strong>Fleet Observability:</strong> Grafana &amp; Prometheus monitoring, automated RMAN DR (RPO &lt; 15m, RTO &lt; 1h).</span></div>
        <div class="persona-pitch-point-item"><span>⚡</span><span><strong>Query Optimization:</strong> 345x latency reduction on 10M+ row enterprise reporting workloads.</span></div>
      `,
      tgLink: "https://t.me/riprlutuk?text=Halo%20Heri,%20kami%20ingin%20konsultasi%20Enterprise%20DBA%20dan%20Migrasi%20Database"
    }
  };

  personaPills.forEach(pill => {
    pill.addEventListener("click", () => {
      personaPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const persona = pill.getAttribute("data-persona");
      const data = PERSONA_DATA[persona];
      if (data) {
        if (pitchIcon) pitchIcon.textContent = data.icon;
        if (pitchTitle) pitchTitle.textContent = data.title;
        if (pitchBadge) pitchBadge.textContent = data.badge;
        if (pitchPoints) pitchPoints.innerHTML = data.points;
        if (pitchCtaTg) pitchCtaTg.href = data.tgLink;
        if (window.soundFx) window.soundFx.playSuccess();
      }
    });
  });

  // ==========================================
  // Hero Terminal Tab Switcher Controller
  // ==========================================
  const terminalTabs = document.querySelectorAll(".t-tab-btn");
  const heroTermBody = document.getElementById("hero-terminal-body");

  const TERMINAL_TAB_CONTENT = {
    status: `
      <div class="cli-prompt-line">
        <span class="cli-user">riprlutuk@prod-k8s:~$</span>
        <span class="cli-cmd">fleetctl status --live</span>
      </div>
      <div class="cli-tree-list">
        <div class="cli-tree-row">
          <span><span class="cli-branch">├─</span> <span class="cli-tag">[DBA]</span> <span class="cli-name">PostgreSQL 16 &amp; MSSQL AlwaysOn</span></span>
          <span class="cli-status-badge online">● 99.98% STREAMING</span>
        </div>
        <div class="cli-tree-row">
          <span><span class="cli-branch">├─</span> <span class="cli-tag">[API]</span> <span class="cli-name">Go &amp; Python Microservices</span></span>
          <span class="cli-status-badge cyan">● 200 OK (2.1ms)</span>
        </div>
        <div class="cli-tree-row">
          <span><span class="cli-branch">├─</span> <span class="cli-tag">[APP]</span> <span class="cli-name">Vue 3 PWA &amp; PGlite WASM</span></span>
          <span class="cli-status-badge online">● OFFLINE SYNC</span>
        </div>
        <div class="cli-tree-row">
          <span><span class="cli-branch">└─</span> <span class="cli-tag">[SEC]</span> <span class="cli-name">ISO 27001 &amp; FortiGate VPN</span></span>
          <span class="cli-status-badge cyan">● 100+ NODES ENFORCED</span>
        </div>
      </div>
      <div class="cli-audit-panel">
        <span><span class="cli-audit-key">QUERY OPT:</span> <span style="color:#ef4444;text-decoration:line-through;">4,200ms</span> &rarr; <span class="cli-audit-val">18ms (-99.5%)</span></span>
        <span><span class="cli-audit-key">ISMS:</span> <span class="cli-audit-val">ISO 27001 Certified</span></span>
      </div>
    `,
    migrations: `
      <div class="cli-prompt-line">
        <span class="cli-user">riprlutuk@prod-k8s:~$</span>
        <span class="cli-cmd">db-migrate --audit-log</span>
      </div>
      <div class="cli-tree-list">
        <div class="cli-tree-row">
          <span><span class="cli-branch">├─</span> <span class="cli-tag">[MIGRATE]</span> <span class="cli-name">Oracle 19c &rarr; PostgreSQL 16</span></span>
          <span class="cli-status-badge online">● PL/pgSQL (0-LAG)</span>
        </div>
        <div class="cli-tree-row">
          <span><span class="cli-branch">├─</span> <span class="cli-tag">[NOSQL]</span> <span class="cli-name">MongoDB &rarr; AWS DocumentDB</span></span>
          <span class="cli-status-badge cyan">● REPLICAS ACTIVE</span>
        </div>
        <div class="cli-tree-row">
          <span><span class="cli-branch">├─</span> <span class="cli-tag">[CLOUD]</span> <span class="cli-name">AWS RDS &rarr; TencentDB Cloud</span></span>
          <span class="cli-status-badge online">● COST REDUCED -35%</span>
        </div>
        <div class="cli-tree-row">
          <span><span class="cli-branch">└─</span> <span class="cli-tag">[METRICS]</span> <span class="cli-name">Prometheus + Grafana Fleet</span></span>
          <span class="cli-status-badge cyan">● 24/7 TELEMETRY</span>
        </div>
      </div>
      <div class="cli-audit-panel">
        <span><span class="cli-audit-key">DATA INTEGRITY:</span> <span class="cli-audit-val">0 Rows Discrepancy (100%)</span></span>
        <span><span class="cli-audit-key">CUTOVER:</span> <span class="cli-audit-val">&lt; 10s Downtime</span></span>
      </div>
    `,
    security: `
      <div class="cli-prompt-line">
        <span class="cli-user">riprlutuk@prod-k8s:~$</span>
        <span class="cli-cmd">isms-audit --compliance</span>
      </div>
      <div class="cli-tree-list">
        <div class="cli-tree-row">
          <span><span class="cli-branch">├─</span> <span class="cli-tag">[ISO-27001]</span> <span class="cli-name">ISO/IEC 27001:2022 ISMS</span></span>
          <span class="cli-status-badge online">● AUDIT PASSED</span>
        </div>
        <div class="cli-tree-row">
          <span><span class="cli-branch">├─</span> <span class="cli-tag">[PDP-LAW]</span> <span class="cli-name">UU No. 27/2022 Data Privacy</span></span>
          <span class="cli-status-badge cyan">● AES-256 ACTIVE</span>
        </div>
        <div class="cli-tree-row">
          <span><span class="cli-branch">├─</span> <span class="cli-tag">[IPSEC]</span> <span class="cli-name">FortiGate VPN Mesh (100+ P2P)</span></span>
          <span class="cli-status-badge online">● TUNNELS SECURE</span>
        </div>
        <div class="cli-tree-row">
          <span><span class="cli-branch">└─</span> <span class="cli-tag">[AUDIT]</span> <span class="cli-name">pgAudit Immutable Audit Trails</span></span>
          <span class="cli-status-badge cyan">● 5-YEAR ARCHIVE</span>
        </div>
      </div>
      <div class="cli-audit-panel">
        <span><span class="cli-audit-key">DRC SITE:</span> <span class="cli-audit-val">Synchronized Standby</span></span>
        <span><span class="cli-audit-key">RECOVERY:</span> <span class="cli-audit-val">RPO &lt; 15m / RTO &lt; 1h</span></span>
      </div>
    `,
    mobile: `
      <div class="cli-prompt-line">
        <span class="cli-user">riprlutuk@prod-k8s:~$</span>
        <span class="cli-cmd">mobile-stack --diagnostics</span>
      </div>
      <div class="cli-tree-list">
        <div class="cli-tree-row">
          <span><span class="cli-branch">├─</span> <span class="cli-tag">[ANDROID]</span> <span class="cli-name">Java Native + Face Biometrics</span></span>
          <span class="cli-status-badge online">● PASS (0.4s CONFIRM)</span>
        </div>
        <div class="cli-tree-row">
          <span><span class="cli-branch">├─</span> <span class="cli-tag">[FLUTTER]</span> <span class="cli-name">Anti-Mock GPS Geo-Fencing</span></span>
          <span class="cli-status-badge cyan">● 0.00% SPOOF RATE</span>
        </div>
        <div class="cli-tree-row">
          <span><span class="cli-branch">├─</span> <span class="cli-tag">[PWA-SQL]</span> <span class="cli-name">PGlite WASM Embedded DB</span></span>
          <span class="cli-status-badge online">● 0.4ms LOCAL QUERY</span>
        </div>
        <div class="cli-tree-row">
          <span><span class="cli-branch">└─</span> <span class="cli-tag">[GATEWAY]</span> <span class="cli-name">Go REST &amp; WebSocket Daemon</span></span>
          <span class="cli-status-badge cyan">● 2.5ms LATENCY</span>
        </div>
      </div>
      <div class="cli-audit-panel">
        <span><span class="cli-audit-key">ATTENDANCE LOG:</span> <span class="cli-audit-val">0.4s Instant Sync</span></span>
        <span><span class="cli-audit-key">STORAGE:</span> <span class="cli-audit-val">100% Offline-First</span></span>
      </div>
    `
  };

  terminalTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      terminalTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const tabKey = tab.getAttribute("data-tab");
      const content = TERMINAL_TAB_CONTENT[tabKey];
      if (content && heroTermBody) {
        heroTermBody.innerHTML = content;
        if (window.soundFx) window.soundFx.playClick();
      }
    });
  });

  // Bind Navbar Theme Button
  const themeBtn = document.getElementById("theme-toggle-btn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const newTheme = window.themeManager.cycleTheme();
      if (window.soundFx) window.soundFx.playClick();
      window.showToast(`Active Theme: ${newTheme.toUpperCase()}`);
    });
  }

  // Bind Sound Button
  const soundBtn = document.getElementById("sound-toggle-btn");
  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      const isMuted = window.soundFx.toggleMute();
      soundBtn.classList.toggle("muted", isMuted);
      window.showToast(`Sound FX: ${isMuted ? "MUTED" : "ENABLED"}`);
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startCoreEngine);
} else {
  startCoreEngine();
}
