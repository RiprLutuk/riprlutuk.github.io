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
// 8. BOOTSTRAP ALL CONTROLLERS SAFELY
// ==========================================
function startCoreEngine() {
  window.soundFx = new SoundFX();
  window.themeManager = new ThemeManager();
  window.modalManager = new ModalManager();
  window.particleMesh = new ParticleMesh();
  window.cardTilt3D = new CardTilt3D();
  window.rollingCounters = new RollingCounters();

  // Initialize Typewriter Effect
  const typeEl = document.getElementById("hero-dynamic-text");
  if (typeEl) {
    window.heroTypewriter = new TypeWriter(typeEl, [
      "Fullstack Web & Mobile Apps (Android Java Native, Flutter, Vue 3, Laravel).",
      "Zero-Downtime Multi-Engine Database Clusters (Postgres, MSSQL, Oracle).",
      "High-Throughput Go & Python API Gateways with Zero-Trust Security.",
      "Real-Time CDC & OLAP Pipelines (Kafka, ClickHouse, Debezium).",
      "ISO/IEC 27001 & UU PDP Certified Fintech Security Lead."
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
