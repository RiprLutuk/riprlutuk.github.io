/**
 * Main Application Coordinator & Interactive Features
 */

// ==========================================
// 1. Interactive Particle Canvas Background
// ==========================================
class ParticleCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.numParticles = window.innerWidth < 768 ? 35 : 75;
    this.mouse = { x: null, y: null, radius: 120 };

    this.resize();
    this.initParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      this.resize();
      this.initParticles();
    });

    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
    });

    window.addEventListener("mouseout", () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 2 + 1,
        color: "rgba(249, 115, 22, 0.45)"
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > this.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.height) p.vy *= -1;

      // Mouse interaction
      if (this.mouse.x != null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          p.x -= (dx / dist) * force * 2;
          p.y -= (dy / dist) * force * 2;
        }
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();

      // Connect near particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(249, 115, 22, ${0.15 * (1 - dist / 110)})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ==========================================
// 2. Typewriter Effect
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

    let speed = this.isDeleting ? 30 : 60;

    if (!this.isDeleting && this.charIndex === current.length) {
      speed = 2200; // Pause at end of text
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
// 3. Theme Preset Controller
// ==========================================
class ThemeManager {
  constructor() {
    this.themes = ["obsidian", "matrix", "cyberpunk", "light"];
    this.currentTheme = localStorage.getItem("theme_preset") || "obsidian";
    this.themeBtn = document.getElementById("theme-toggle-btn");
    
    this.applyTheme(this.currentTheme);
    this.bindEvents();
  }

  bindEvents() {
    if (this.themeBtn) {
      this.themeBtn.addEventListener("click", () => {
        if (window.soundFx) window.soundFx.playClick();
        const nextIdx = (this.themes.indexOf(this.currentTheme) + 1) % this.themes.length;
        this.applyTheme(this.themes[nextIdx]);
        showToast(`Theme switched to: ${this.themes[nextIdx].toUpperCase()}`);
      });
    }
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme_preset", theme);
    
    if (this.themeBtn) {
      const icons = {
        obsidian: "🌌",
        matrix: "💻",
        cyberpunk: "⚡",
        light: "☀️"
      };
      this.themeBtn.innerHTML = icons[theme] || "🎨";
      this.themeBtn.title = `Current Theme: ${theme.toUpperCase()} (Click to cycle)`;
    }
  }
}

// ==========================================
// 4. Modal Manager
// ==========================================
class ModalManager {
  constructor() {
    this.bindModal("open-resume-modal-btn", "resume-modal");
    this.bindModal("open-contact-modal-btn", "contact-modal");
    
    // Close on backdrop click or close btn
    document.querySelectorAll(".modal-backdrop").forEach(modal => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("open");
          if (window.soundFx) window.soundFx.playClick();
        }
      });

      modal.querySelectorAll(".modal-close-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          modal.classList.remove("open");
          if (window.soundFx) window.soundFx.playClick();
        });
      });
    });
  }

  bindModal(triggerClass, modalId) {
    document.querySelectorAll(`.${triggerClass}`).forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.classList.add("open");
          if (window.soundFx) window.soundFx.playBeep(650, 0.06);
        }
      });
    });
  }
}

// ==========================================
// 5. Toast System & Clipboard
// ==========================================
function showToast(message, duration = 3000) {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>✨</span> <span>${message}</span>`;
  container.appendChild(toast);

  if (window.soundFx) window.soundFx.playBeep(880, 0.05);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function copyToClipboard(text, successMsg) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(successMsg || `Copied to clipboard: ${text}`);
    if (window.soundFx) window.soundFx.playSuccess();
  }).catch(() => {
    showToast("Failed to copy", 2000);
  });
}

// ==========================================
// 6. Initialization
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // Init Canvas
  new ParticleCanvas("bg-canvas");

  // Init Typewriter
  const typeEl = document.getElementById("hero-dynamic-text");
  if (typeEl) {
    new TypeWriter(typeEl, [
      "Zero-Downtime Multi-Engine Database Clusters.",
      "High-Throughput Real-Time CDC & OLAP Pipelines.",
      "ISO/IEC 27001 Certified Cloud & Network Security.",
      "Resilient Go API Gateways & Platform Engineering."
    ]);
  }

  // Init Theme Manager
  window.themeManager = new ThemeManager();

  // Init Modals
  window.modalManager = new ModalManager();

  // Sound Toggle Button
  const soundBtn = document.getElementById("sound-toggle-btn");
  if (soundBtn) {
    const updateSoundIcon = () => {
      const onIcon = soundBtn.querySelector(".sound-icon-on");
      const offIcon = soundBtn.querySelector(".sound-icon-off");
      if (onIcon && offIcon) {
        onIcon.style.display = window.soundFx.enabled ? "block" : "none";
        offIcon.style.display = window.soundFx.enabled ? "none" : "block";
      }
      soundBtn.title = window.soundFx.enabled ? "Sound FX: ON (Click to mute)" : "Sound FX: OFF (Click to unmute)";
    };
    updateSoundIcon();
    soundBtn.addEventListener("click", () => {
      const state = window.soundFx.toggle();
      updateSoundIcon();
      showToast(state ? "Sound FX Enabled" : "Sound FX Muted");
    });
  }

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("mobile-open");
    });
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => navLinks.classList.remove("mobile-open"));
    });
  }

  // Copy Buttons
  document.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const text = btn.getAttribute("data-copy");
      const msg = btn.getAttribute("data-msg");
      if (text) copyToClipboard(text, msg);
    });
  });

  // Smooth Active Nav ScrollSpy
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute("id");
      const link = document.querySelector(`.nav-links a[href*=${sectionId}]`);
      if (link) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      }
    });
  });
});
