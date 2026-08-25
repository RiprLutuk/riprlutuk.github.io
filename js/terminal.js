/**
 * Interactive CLI Terminal Console (Ctrl+K / Cmd+K)
 */

class InteractiveTerminal {
  constructor() {
    this.modal = document.getElementById("terminal-modal");
    this.body = document.getElementById("cli-output-body");
    this.form = document.getElementById("cli-form");
    this.input = document.getElementById("cli-input");
    this.history = [];
    this.historyIndex = -1;

    this.commands = {
      help: () => this.cmdHelp(),
      whoami: () => this.cmdWhoami(),
      bio: () => this.cmdWhoami(),
      skills: () => this.cmdSkills(),
      experience: () => this.cmdExperience(),
      projects: () => this.cmdProjects(),
      repos: () => this.cmdRepos(),
      architecture: () => this.cmdArchitecture(),
      resume: () => this.cmdATS(),
      contact: () => this.cmdContact(),
      hire: () => this.cmdHire(),
      "sudo hire": () => this.cmdHire(true),
      theme: (arg) => this.cmdTheme(arg),
      clear: () => this.cmdClear(),
      exit: () => this.close()
    };

    this.init();
  }

  init() {
    // Keyboard shortcut: Ctrl+K or Cmd+K
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        this.toggle();
      }
      if (e.key === "Escape" && this.isOpen()) {
        this.close();
      }
    });

    document.querySelectorAll(".open-terminal-btn").forEach(btn => {
      btn.addEventListener("click", () => this.open());
    });

    if (this.form && this.input) {
      this.form.addEventListener("submit", (e) => {
        e.preventDefault();
        const raw = this.input.value.trim();
        if (raw) {
          this.execute(raw);
          this.history.push(raw);
          this.historyIndex = this.history.length;
          this.input.value = "";
        }
      });

      // History navigation (Up / Down arrow)
      this.input.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") {
          e.preventDefault();
          if (this.historyIndex > 0) {
            this.historyIndex--;
            this.input.value = this.history[this.historyIndex];
          }
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.input.value = this.history[this.historyIndex];
          } else {
            this.historyIndex = this.history.length;
            this.input.value = "";
          }
        }
      });
    }
  }

  isOpen() {
    return this.modal && this.modal.classList.contains("open");
  }

  open() {
    if (this.modal) {
      this.modal.classList.add("open");
      if (window.soundFx) window.soundFx.playBeep(700, 0.05);
      setTimeout(() => this.input && this.input.focus(), 100);
    }
  }

  close() {
    if (this.modal) {
      this.modal.classList.remove("open");
      if (window.soundFx) window.soundFx.playClick();
    }
  }

  toggle() {
    if (this.isOpen()) this.close();
    else this.open();
  }

  print(html, isCmd = false) {
    if (!this.body) return;
    const line = document.createElement("div");
    line.className = isCmd ? "console-line" : "console-out-block";
    line.style.marginBottom = "8px";
    line.innerHTML = html;
    this.body.appendChild(line);
    this.body.scrollTop = this.body.scrollHeight;
  }

  execute(cmdStr) {
    if (window.soundFx) window.soundFx.playClick();
    this.print(`<span class="console-prompt">riprlutuk@cloud:~$</span> <span class="console-cmd">${cmdStr}</span>`, true);

    const lower = cmdStr.toLowerCase();
    const parts = lower.split(" ");
    const mainCmd = parts[0];
    const subCmd = parts.slice(1).join(" ");

    if (lower === "sudo hire") {
      this.commands["sudo hire"]();
    } else if (mainCmd === "theme") {
      this.commands.theme(subCmd);
    } else if (this.commands[mainCmd]) {
      this.commands[mainCmd](subCmd);
    } else {
      this.print(`<span style="color: #ef4444;">zsh: command not found: ${cmdStr}. Type <strong style="color:#f97316;">help</strong> for available commands.</span>`);
    }
  }

  cmdHelp() {
    this.print(`
      <div style="color: var(--text-secondary); line-height: 1.6;">
        <strong style="color: var(--accent-cyan);">AVAILABLE COMMANDS:</strong><br>
        • <span style="color: var(--accent-primary); font-weight:600;">whoami / bio</span> — View Heri Riski Anto summary & career profile<br>
        • <span style="color: var(--accent-primary); font-weight:600;">skills</span> — Core DBA, Infra, Backend & Security competencies<br>
        • <span style="color: var(--accent-primary); font-weight:600;">experience</span> — Career timeline and enterprise achievements<br>
        • <span style="color: var(--accent-primary); font-weight:600;">projects</span> — Flagship production systems (DDAG, CDC, PasPapan)<br>
        • <span style="color: var(--accent-primary); font-weight:600;">repos</span> — List public open source GitHub repositories<br>
        • <span style="color: var(--accent-primary); font-weight:600;">architecture</span> — Inspect AFPI, CDC and DDAG system topology<br>
        • <span style="color: var(--accent-primary); font-weight:600;">ats</span> — View ATS resume score & download links<br>
        • <span style="color: var(--accent-primary); font-weight:600;">contact</span> — Phone, WhatsApp, Email, LinkedIn<br>
        • <span style="color: var(--accent-emerald); font-weight:700;">hire / sudo hire</span> — 1-Click direct hiring pipeline<br>
        • <span style="color: var(--accent-primary); font-weight:600;">theme &lt;obsidian|matrix|cyberpunk|light&gt;</span> — Switch UI visual theme<br>
        • <span style="color: var(--accent-primary); font-weight:600;">clear</span> — Clear terminal output<br>
        • <span style="color: var(--accent-primary); font-weight:600;">exit</span> — Close terminal
      </div>
    `);
  }

  cmdWhoami() {
    this.print(`
      <div style="color: var(--text-secondary); line-height: 1.5;">
        <strong style="color: var(--text-primary); font-size: 1.05rem;">HERI RISKI ANTO (@RiprLutuk)</strong><br>
        <span style="color: var(--accent-cyan);">Senior Database Administrator | Cloud Infrastructure | Backend Platform Engineer</span><br><br>
        📍 Location: Tangerang City, Banten & Pemalang, Central Java, Indonesia<br>
        💼 Status: <span style="color: var(--accent-emerald); font-weight:700;">● Available for Senior DBA / Infrastructure Roles & Consulting</span><br>
        ⏱ Experience: 7+ Years Enterprise Production Systems<br>
        🛡 ISO 27001 ISMS Lead Implementation Experience (AFPI National Fintech Data Center)
      </div>
    `);
  }

  cmdSkills() {
    this.print(`
      <div style="color: var(--text-secondary); line-height: 1.6;">
        <strong style="color: var(--accent-cyan);">ENGINEERING STACK & COMPETENCIES:</strong><br>
        • <strong>Databases (DBA):</strong> PostgreSQL, MS SQL Server, Oracle Database 19c, MySQL/MariaDB, ClickHouse, Redis, PgBouncer, HA/DR, Backup & RMAN, Performance Tuning.<br>
        • <strong>Data Platform & CDC:</strong> Debezium, Apache Kafka, OLTP-to-OLAP Real-time CDC, ETL Automation, Grafana, Prometheus & Blackbox Exporter Synthetic Monitoring (HTTP/TCP/SSL).<br>
        • <strong>Backend & APIs:</strong> Go (Golang), Python (FastAPI), PHP (Laravel), Java, C# / .NET, TypeScript, REST, Microservices.<br>
        • <strong>Cloud & Infra:</strong> Linux (Ubuntu, Debian, RHEL), AWS (EC2, RDS, VPC), Docker, Kubernetes basics, Nginx, Caddy, CI/CD.<br>
        • <strong>Security & Network:</strong> ISO/IEC 27001 ISMS, Fortinet FortiGate Firewall, IPsec VPN (StrongSwan), OpenVPN, Zero-Trust.
      </div>
    `);
  }

  cmdExperience() {
    this.print(`
      <div style="color: var(--text-secondary); line-height: 1.6;">
        <strong style="color: var(--accent-cyan);">CAREER HIGHLIGHTS:</strong><br>
        • <strong>PT Link Net Tbk</strong> (2025–Present) — Database Administrator (SQL Server, Oracle 19c, Postgres, MySQL)<br>
        • <strong>Halalvestor Global Asia / Vestora.id</strong> (2024–2025) — Senior Fullstack / IT Specialist<br>
        • <strong>AFPI (Fintech Data Center)</strong> (2020–2025) — Data Management & Infra Operations Lead (ISO 27001 Certified)<br>
        • <strong>PT Sas Kreasindo Utama</strong> (2019–2020) — IT Business Analyst (Odoo ERP)<br>
        • <strong>Syarfi P2P Fintech</strong> (2018–2019) — ICT & Systems Officer<br>
        • <strong>Kerjaholic</strong> (2018) — Java Android Software Engineer
      </div>
    `);
  }

  cmdProjects() {
    this.print(`
      <div style="color: var(--text-secondary); line-height: 1.6;">
        <strong style="color: var(--accent-cyan);">FLAGSHIP PRODUCTION PROJECTS:</strong><br>
        1. <strong>DDAG (Dynamic Data API Gateway):</strong> Go-based Zero-Trust Multi-Dialect SQL API Gateway. (<a href="https://github.com/RiprLutuk/DDAG" target="_blank" style="color:var(--accent-primary); text-decoration:underline;">github.com/RiprLutuk/DDAG</a>)<br>
        2. <strong>ch-olap-pipeline:</strong> Universal CDC streaming pipeline into ClickHouse (Debezium + Kafka). (<a href="https://riprlutuk.github.io/ch-olap-pipeline/" target="_blank" style="color:var(--accent-primary); text-decoration:underline;">Demo</a>)<br>
        3. <strong>OpenOrg:</strong> Organization governance platform with digital KTA, SKP academy & certificate verification. (<a href="https://github.com/RiprLutuk/openorg" target="_blank" style="color:var(--accent-primary); text-decoration:underline;">github.com/RiprLutuk/openorg</a>)<br>
        4. <strong>WargaHub:</strong> Neighborhood digital governance & financial transparency PWA with embedded WASM PostgreSQL. (<a href="https://github.com/RiprLutuk/WargaHub" target="_blank" style="color:var(--accent-primary); text-decoration:underline;">github.com/RiprLutuk/WargaHub</a>)<br>
        5. <strong>PasPapan HRIS:</strong> Enterprise HRIS with Face ID & GPS biometric attendance and payroll. (<a href="https://paspapan.pandanteknik.com" target="_blank" style="color:var(--accent-primary); text-decoration:underline;">Demo</a>)
      </div>
    `);
  }

  cmdRepos() {
    this.print(`
      <div style="color: var(--text-secondary); line-height: 1.5;">
        <strong style="color: var(--accent-cyan);">PUBLIC GITHUB REPOSITORIES (49+ Active):</strong><br>
        • DDAG (Go) ⭐ 4 | Forks: 2<br>
        • WargaHub (TypeScript / Vue 3 / PGlite) ⭐ 1 | Forks: 2<br>
        • ch-olap-pipeline (Kafka / ClickHouse / Shell)<br>
        • PasPapan (Laravel / Mobile)<br>
        • pg2ora_debezium_kafka (Shell / CDC)<br>
        • copy-table-oracle-to-postgresql (Python)<br>
        • AntigravityManager (Electron)<br>
        • xcodepandawarouter (Linux NAT / VPN Router)<br>
        Explore full interactive explorer in the <strong>Public Works</strong> section!
      </div>
    `);
  }

  cmdArchitecture() {
    this.print(`
      <div style="color: var(--text-secondary); line-height: 1.5;">
        <strong style="color: var(--accent-cyan);">SYSTEM ARCHITECTURE VISUALIZER:</strong><br>
        Switch between live topologies in the <strong>System Architecture</strong> section on page:<br>
        1. <strong>AFPI National Fintech Data Center</strong> (100+ Nodes, FortiGate VPN, Postgres HA, Grafana)<br>
        2. <strong>Universal CDC Pipeline</strong> (Debezium, Kafka, ClickHouse OLAP)<br>
        3. <strong>DDAG Zero-Trust API Gateway</strong> (Multi-Dialect SQL Router)
      </div>
    `);
  }

  cmdResume() {
    this.print(`
      <div style="color: var(--text-secondary); line-height: 1.6;">
        <strong style="color: var(--accent-cyan); font-size: 1rem;">HERI RISKI ANTO — CURRICULUM VITAE & EXECUTIVE SUMMARY</strong><br>
        • <strong>Role Focus:</strong> Senior Database Administrator (DBA), Cloud Infrastructure & Platform Engineer<br>
        • <strong>Track Record:</strong> 7+ Years Experience across Telecom (Link Net), Fintech P2P (AFPI Data Center), and Crowdfunding (Vestora.id)<br>
        • <strong>Security Credential:</strong> ISO/IEC 27001 ISMS Implementation Lead (AFPI)<br>
        • <strong>Core Databases:</strong> PostgreSQL, Microsoft SQL Server, Oracle Database 19c, MySQL/MariaDB, ClickHouse<br>
        • <strong>Contact for Full PDF CV:</strong><br>
        &nbsp;&nbsp;👉 <a href="https://t.me/riprlutuk" target="_blank" style="color:#22c55e; text-decoration:underline; font-weight:700;">Request via Telegram (@riprlutuk) ↗</a><br>
        &nbsp;&nbsp;👉 <a href="mailto:rizqy.pra85@gmail.com?subject=Request%20Full%20CV%20-%20Heri%20Riski%20Anto" style="color:var(--accent-primary); text-decoration:underline; font-weight:700;">Request via Email (rizqy.pra85@gmail.com) ↗</a>
      </div>
    `);
  }

  cmdContact() {
    this.print(`
      <div style="color: var(--text-secondary); line-height: 1.6;">
        <strong style="color: var(--accent-cyan);">DIRECT CONTACT CHANNELS:</strong><br>
        • <strong>Telegram:</strong> <a href="https://t.me/riprlutuk" target="_blank" style="color:#229ED9; text-decoration:underline;">@riprlutuk (t.me/riprlutuk)</a><br>
        • <strong>LinkedIn:</strong> <a href="https://linkedin.com/in/riprlutuk" target="_blank" style="color:var(--accent-cyan); text-decoration:underline;">linkedin.com/in/riprlutuk</a><br>
        • <strong>Email:</strong> <a href="mailto:rizqy.pra85@gmail.com" style="color:var(--accent-primary); text-decoration:underline;">rizqy.pra85@gmail.com</a><br>
        • <strong>GitHub:</strong> <a href="https://github.com/RiprLutuk" target="_blank" style="color:var(--text-primary); text-decoration:underline;">github.com/RiprLutuk</a>
      </div>
    `);
  }

  cmdHire(isSudo = false) {
    if (window.soundFx) window.soundFx.playSuccess();
    const promptText = isSudo ? "👑 [ROOT ACCESS GRANTED] Direct Fast-Track Candidate Access Initiated!" : "🚀 Direct Fast-Track Candidate Access:";
    this.print(`
      <div style="color: var(--accent-emerald); font-weight:700; margin: 6px 0;">
        ${promptText}
      </div>
      <div style="color: var(--text-secondary); line-height: 1.6;">
        Heri Riski Anto is available for full-time senior roles & consulting.<br>
        👉 <a href="https://t.me/riprlutuk" target="_blank" style="display:inline-block; background:#229ED9; color:#fff; padding:6px 14px; border-radius:999px; margin-top:8px; font-weight:700;">Open Direct Telegram (@riprlutuk) ↗</a>
      </div>
    `);
  }

  cmdTheme(themeName) {
    const valid = ["obsidian", "matrix", "cyberpunk", "light"];
    if (valid.includes(themeName)) {
      document.documentElement.setAttribute("data-theme", themeName);
      localStorage.setItem("theme_preset", themeName);
      this.print(`<span style="color: var(--accent-emerald);">Theme switched to: <strong>${themeName}</strong></span>`);
    } else {
      this.print(`<span style="color: #ef4444;">Invalid theme. Available: obsidian, matrix, cyberpunk, light. (e.g. theme matrix)</span>`);
    }
  }

  cmdClear() {
    if (this.body) {
      this.body.innerHTML = `
        <div style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 12px;">
          Terminal cleared. Type <strong style="color: var(--accent-cyan);">help</strong> for commands.
        </div>
      `;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.interactiveTerminal = new InteractiveTerminal();
});
