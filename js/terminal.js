/**
 * Cybernetic CLI Terminal Emulator (Ctrl+K)
 * Full UNIX/Linux simulation, DBA interactive diagnostics & fun easter eggs
 */

class CyberTerminal {
  constructor() {
    this.history = [];
    this.historyIndex = -1;
    this.isMaximized = false;
    this.welcomePrinted = false;

    this.resolveElements();
    this.init();
  }

  resolveElements() {
    if (!this.modal) this.modal = document.getElementById("terminal-modal") || document.getElementById("cli-modal");
    if (!this.output) this.output = document.getElementById("cli-output-body") || document.getElementById("cli-output");
    if (!this.input) this.input = document.getElementById("cli-input");
    if (!this.form) this.form = document.getElementById("cli-form");
    if (!this.promptUser) this.promptUser = document.getElementById("cli-prompt-user");
  }

  init() {
    this.resolveElements();
    this.bindEvents();
    if (!this.welcomePrinted && this.output) {
      this.printWelcome();
      this.welcomePrinted = true;
    }
  }

  bindEvents() {
    // Keyboard shortcut Ctrl+K / Cmd+K
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "k" || e.code === "KeyK")) {
        e.preventDefault();
        this.toggle();
      }
      if (e.key === "Escape" && this.isOpen()) {
        this.close();
      }
    });

    // Delegated click handler on document for open-terminal buttons
    document.addEventListener("click", (e) => {
      const openBtn = e.target.closest(".open-terminal-btn");
      if (openBtn) {
        e.preventDefault();
        this.open();
      }
    });

    this.resolveElements();
    if (this.modal) {
      // Modal Close buttons inside terminal modal
      const closeBtns = this.modal.querySelectorAll(".modal-close-btn");
      closeBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          this.close();
        });
      });

      // Backdrop click close
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal) {
          this.close();
        }
      });

      // Auto-focus input when clicking terminal window background
      this.modal.addEventListener("click", (e) => {
        if (!e.target.closest("a") && !e.target.closest("button") && e.target !== this.modal) {
          if (this.input) this.input.focus();
        }
      });
    }

    // Form submit for Run button & mobile enter
    if (this.form) {
      this.form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!this.input) this.input = document.getElementById("cli-input");
        const cmd = this.input ? this.input.value.trim() : "";
        if (cmd) {
          this.history.push(cmd);
          this.historyIndex = this.history.length;
          this.execute(cmd);
          if (this.input) this.input.value = "";
        }
      });
    }

    // Input handlers
    if (this.input) {
      this.input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          if (!this.form) {
            const cmd = this.input.value.trim();
            if (cmd) {
              this.history.push(cmd);
              this.historyIndex = this.history.length;
              this.execute(cmd);
              this.input.value = "";
            }
          }
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          if (this.history.length > 0 && this.historyIndex > 0) {
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
        } else if (e.key === "Tab") {
          e.preventDefault();
          this.handleAutocomplete();
        }
      });
    }
  }

  open() {
    this.resolveElements();
    if (!this.modal) return;
    this.modal.classList.add("active");
    this.modal.classList.add("open");
    document.body.style.overflow = "hidden";
    if (window.soundFx && typeof window.soundFx.playClick === "function") {
      window.soundFx.playClick();
    }
    setTimeout(() => {
      if (!this.input) this.input = document.getElementById("cli-input");
      if (this.input) this.input.focus();
    }, 60);
  }

  close() {
    this.resolveElements();
    if (!this.modal) return;
    this.modal.classList.remove("active");
    this.modal.classList.remove("open");
    const remainingOpen = document.querySelectorAll(".modal-backdrop.open, .modal-backdrop.active");
    if (remainingOpen.length === 0) {
      document.body.style.overflow = "";
    }
  }

  toggle() {
    if (this.isOpen()) this.close();
    else this.open();
  }

  isOpen() {
    this.resolveElements();
    return this.modal && (this.modal.classList.contains("active") || this.modal.classList.contains("open"));
  }

  print(html, className = "") {
    const line = document.createElement("div");
    line.className = `cli-line ${className}`;
    line.innerHTML = html;
    this.output.appendChild(line);
    this.output.scrollTop = this.output.scrollHeight;
  }

  printWelcome() {
    this.print(`
      <div style="color: var(--accent-primary); font-weight: 800; font-size: 0.95rem; margin-bottom: 4px;">
        ⚡ HERI RISKI ANTO // CYBERNETIC CLOUD CONSOLE v2.6.0
      </div>
      <div style="color: var(--text-secondary); font-size: 0.8rem; line-height: 1.5; margin-bottom: 10px;">
        Type <span style="color: var(--accent-emerald); font-weight: 700;">help</span> for commands, 
        <span style="color: var(--accent-primary); font-weight: 700;">resume</span> for CV, 
        <span style="color: var(--accent-cyan); font-weight: 700;">lab</span> for DBA optimizer, 
        or <span style="color: var(--accent-emerald); font-weight: 700;">sudo hire</span> for priority candidate booking.
      </div>
    `);
  }

  execute(rawCmd) {
    let cleanCmd = rawCmd.trim();
    // Strip trailing dots, slashes, or quotes for resilient user experience
    cleanCmd = cleanCmd.replace(/[\.\/\'\"]+$/, "").trim();

    // Print command entered
    this.print(`
      <div style="display: flex; gap: 8px; align-items: center; color: var(--text-muted); font-size: 0.8rem; margin-top: 8px;">
        <span style="color: var(--accent-emerald); font-weight: 700;">riprlutuk@cloud:~$</span>
        <span style="color: #fff; font-weight: 600;">${rawCmd}</span>
      </div>
    `);

    const lower = cleanCmd.toLowerCase();
    const args = lower.split(/\s+/);
    const mainCommand = args[0];

    // Sudo commands matcher
    if (lower.startsWith("sudo apt") || lower.startsWith("apt ") || lower.startsWith("apt-get")) {
      this.cmdApt(args);
      return;
    }
    if (lower.startsWith("sudo systemctl") || lower.startsWith("systemctl")) {
      this.cmdSystemctl(args);
      return;
    }
    if (lower === "sudo su" || lower === "sudo -i" || lower === "su") {
      this.print(`<div style="color:var(--accent-emerald); font-weight:700;">👑 root@cloud:~# (Root Access Granted: Welcome Superadmin Heri!)</div>`);
      return;
    }

    // Command Router
    switch (mainCommand) {
      case "help":
      case "?":
      case "man":
        this.cmdHelp();
        break;
      case "ats":
      case "resume":
      case "cv":
      case "bio":
      case "profile":
        this.cmdResume();
        break;
      case "lab":
      case "dbalab":
      case "explain":
      case "sql":
        this.cmdLab();
        break;
      case "roi":
      case "calc":
      case "cost":
        this.cmdROI();
        break;
      case "drill":
      case "incident":
      case "failover":
        this.cmdDrill();
        break;
      case "migrations":
      case "migration":
        this.cmdMigrations();
        break;
      case "mobile":
      case "apps":
        this.cmdMobile();
        break;
      case "security":
      case "iso":
      case "iso27001":
      case "masking":
      case "encryption":
      case "compliance":
        this.cmdSecurity();
        break;
      case "fullstack":
      case "skills":
      case "stack":
      case "tech":
        this.cmdSkills();
        break;
      case "projects":
        this.cmdProjects();
        break;
      case "repos":
      case "github":
        this.cmdRepos(args.slice(1).join(" "));
        break;
      case "hire":
      case "contact":
      case "telegram":
      case "email":
        this.cmdHire(false);
        break;
      case "sudo":
        if (args[1] === "hire") this.cmdHire(true);
        else this.cmdSudo(args.slice(1).join(" "));
        break;
      case "neofetch":
      case "screenfetch":
      case "fetch":
        this.cmdNeofetch();
        break;
      case "psql":
      case "pg_stat":
      case "postgres":
        this.cmdPsql();
        break;
      case "clickhouse":
      case "clickhouse-client":
        this.cmdClickHouse();
        break;
      case "kafka":
      case "kafka-topics":
        this.cmdKafka();
        break;
      case "theme":
        this.cmdTheme(args[1]);
        break;
      case "sound":
        this.cmdSound(args[1]);
        break;
      case "ls":
      case "dir":
        this.cmdLs();
        break;
      case "pwd":
        this.print(`<div style="color:var(--text-secondary);">/home/riprlutuk/infrastructure</div>`);
        break;
      case "whoami":
      case "id":
        this.print(`<div style="color:var(--accent-emerald);">uid=1000(riprlutuk) gid=1000(dba) groups=1000(dba),27(sudo),4(adm),1001(devops)</div>`);
        break;
      case "uname":
        this.print(`<div style="color:var(--text-secondary);">Linux cloud-node-01 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux</div>`);
        break;
      case "uptime":
        this.print(`<div style="color:var(--accent-emerald);">${new Date().toLocaleTimeString()} up 7+ years, 100+ nodes, load average: 0.12, 0.08, 0.04 (99.98% SLA)</div>`);
        break;
      case "free":
      case "top":
      case "htop":
        this.cmdFree();
        break;
      case "cat":
        this.cmdCat(args[1]);
        break;
      case "ping":
        this.cmdPing(args[1] || "fdc.afpi.or.id");
        break;
      case "curl":
        this.cmdCurl(args[1] || "https://riprlutuk.github.io");
        break;
      case "matrix":
        this.cmdMatrix();
        break;
      case "sl":
      case "train":
        this.cmdTrain();
        break;
      case "cowsay":
        this.cmdCowsay(args.slice(1).join(" ") || "Hire Heri Riski Anto for your database infrastructure!");
        break;
      case "fortune":
        this.cmdFortune();
        break;
      case "clear":
      case "cls":
        this.output.innerHTML = "";
        this.printWelcome();
        break;
      case "exit":
      case "quit":
        this.close();
        break;
      default:
        this.print(`
          <div style="color: var(--accent-rose); font-size: 0.8rem;">
            zsh: command not found: <strong style="color:#fff;">${cleanCmd}</strong>. 
            Type <span style="color: var(--accent-emerald); font-weight:700;">help</span> for available commands.
          </div>
        `);
        break;
    }
  }

  cmdHelp() {
    this.print(`
      <div style="color: var(--text-secondary); line-height: 1.6; font-size: 0.82rem;">
        <strong style="color: var(--accent-primary);">COMMAND DIRECTORY:</strong><br>
        • <strong style="color:#fff;">resume / cv / ats</strong> — View full professional resume &amp; candidate summary<br>
        • <strong style="color:#fff;">lab / dbalab</strong> — Launch interactive DBA query diagnostic lab<br>
        • <strong style="color:#fff;">roi / calc</strong> — Calculate AWS/Cloud database spend reduction estimate<br>
        • <strong style="color:#fff;">drill / incident</strong> — Execute automated SRE incident resilience drill<br>
        • <strong style="color:#fff;">projects</strong> — Inspect flagship open-source architectures (DDAG, CDC, etc.)<br>
        • <strong style="color:#fff;">repos</strong> — Search and list original public GitHub repositories<br>
        • <strong style="color:#fff;">skills</strong> — Display DBA, Data Platform, Security &amp; Backend matrix<br>
        • <strong style="color:#fff;">hire / contact</strong> — Fast candidate booking &amp; direct Telegram (@riprlutuk)<br>
        • <strong style="color:#fff;">sudo apt update</strong> — Simulate Linux package update<br>
        • <strong style="color:#fff;">neofetch</strong> — Display ASCII profile &amp; system specifications<br>
        • <strong style="color:#fff;">psql / clickhouse / kafka</strong> — Interactive database &amp; broker prompts<br>
        • <strong style="color:#fff;">ping / curl / free / uptime</strong> — Network &amp; system diagnostics<br>
        • <strong style="color:#fff;">theme &lt;obsidian|matrix|cyberpunk|light&gt;</strong> — Switch color theme<br>
        • <strong style="color:#fff;">matrix / cowsay / sl / fortune</strong> — Terminal easter eggs<br>
        • <strong style="color:#fff;">clear</strong> — Clear terminal screen
      </div>
    `);
  }

  cmdResume() {
    if (window.soundFx) window.soundFx.playSuccess();
    this.print(`
      <div style="color: var(--text-secondary); line-height: 1.6; font-size: 0.82rem;">
        <strong style="color: var(--accent-cyan); font-size: 0.95rem;">HERI RISKI ANTO — CURRICULUM VITAE &amp; EXECUTIVE PROFILE</strong><br>
        • <strong>Role:</strong> Senior Database Administrator (DBA), Cloud Infrastructure &amp; Platform Engineer<br>
        • <strong>Current Role (PT Link Net Tbk):</strong> Database Administrator (DBA) &bull; Oracle &rarr; PostgreSQL Migration, MongoDB &rarr; AWS DocumentDB, AWS RDS &rarr; TencentDB, and Centralized Grafana Fleet Dashboards.<br>
• <strong>Track Record:</strong> 7+ Years Experience across Telecom (PT Link Net Tbk), Fintech (AFPI Data Center), and Crowdfunding (Vestora.id)<br>
        • <strong>Compliance Lead:</strong> ISO/IEC 27001:2013 &amp; Upgrade to 27001:2022 (ISMS), UU No. 27/2022 (UU PDP), POJK 10/2022<br>
        • <strong>Core Databases:</strong> PostgreSQL, MS SQL Server (AlwaysOn AG), Oracle 19c, MySQL, ClickHouse, Redis<br>
        • <strong>Direct Contact &amp; Download:</strong><br>
        &nbsp;&nbsp;👉 <a href="cv-ats-heri-riski-anto.html" target="_blank" style="color:var(--accent-emerald); text-decoration:underline; font-weight:700;">📄 View Official ATS Print-Ready Resume / PDF ↗</a><br>
        &nbsp;&nbsp;👉 <a href="https://t.me/riprlutuk" target="_blank" style="color:#229ED9; text-decoration:underline; font-weight:700;">✈️ Chat on Telegram (@riprlutuk) ↗</a><br>
        &nbsp;&nbsp;👉 <a href="https://linkedin.com/in/riprlutuk" target="_blank" style="color:var(--accent-cyan); text-decoration:underline; font-weight:700;">💼 LinkedIn: linkedin.com/in/riprlutuk ↗</a><br>
        &nbsp;&nbsp;👉 <a href="mailto:rizqy.pra85@gmail.com" style="color:var(--accent-primary); text-decoration:underline; font-weight:700;">✉️ Email: rizqy.pra85@gmail.com ↗</a>
      </div>
    `);
  }

  cmdApt(args) {
    if (window.soundFx) window.soundFx.playSuccess();
    this.print(`
      <div style="color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.78rem; line-height: 1.5;">
        Hit:1 http://archive.ubuntu.com/ubuntu noble InRelease<br>
        Get:2 https://download.postgresql.org/pub/repos/apt noble-pgdg InRelease [123 kB]<br>
        Get:3 https://packages.clickhouse.com/deb stable InRelease [14.2 kB]<br>
        Hit:4 https://download.fortinet.com/fortios/deb stable InRelease<br>
        Fetched 137 kB in 1s (128 kB/s)<br>
        Reading package lists... Done<br>
        Building dependency tree... Done<br>
        <span style="color:var(--accent-emerald); font-weight:700;">All 7+ years of DBA, Cloud Infra &amp; Security dependencies are up to date!</span>
      </div>
    `);
  }

  cmdSystemctl(args) {
    const service = args[2] || "postgresql";
    this.print(`
      <div style="color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.78rem; line-height: 1.5;">
        ● ${service}.service - High-Availability Database Engine<br>
        &nbsp;&nbsp;&nbsp;Loaded: loaded (/lib/systemd/system/${service}.service; enabled)<br>
        &nbsp;&nbsp;&nbsp;Active: <span style="color:var(--accent-emerald); font-weight:700;">active (running)</span> since 7 years ago<br>
        &nbsp;&nbsp;&nbsp;Docs: https://riprlutuk.github.io<br>
        &nbsp;&nbsp;&nbsp;Main PID: 18402 (${service})<br>
        &nbsp;&nbsp;&nbsp;Tasks: 48 (limit: 4915)<br>
        &nbsp;&nbsp;&nbsp;Memory: 24.2G (shared_buffers=16GB, work_mem=64MB)<br>
        &nbsp;&nbsp;&nbsp;CGroup: /system.slice/${service}.service
      </div>
    `);
  }

  cmdNeofetch() {
    this.print(`
      <div style="display: flex; gap: 16px; font-family: var(--font-mono); font-size: 0.75rem; line-height: 1.4; color: var(--text-secondary);">
        <pre style="color: var(--accent-primary); font-weight: 800; margin: 0;">
       /\\
      /  \\
     / /\\ \\
    / /  \\ \\
   / /    \\ \\
  / /  __  \\ \\
 / /  /  \\  \\ \\
/_/  /____\\  \\_\\
        </pre>
        <div>
          <span style="color: var(--accent-primary); font-weight: 800;">riprlutuk</span>@<span style="color: var(--accent-emerald); font-weight: 800;">cloud-node-01</span><br>
          ------------------------<br>
          <strong style="color: #fff;">Role:</strong> The "One-Man IT Division" (Fullstack, Mobile &amp; DBA)<br>
          <strong style="color: #fff;">Track Record:</strong> 7+ Years Continuous Production Delivery<br>
          <strong style="color: #fff;">Mobile:</strong> Flutter, React Native, Android Biometrics &amp; Anti-Mock GPS<br>
          <strong style="color: #fff;">Frontend:</strong> Vue 3, React, Tailwind CSS, Fastify, PGlite WASM, PWA<br>
          <strong style="color: #fff;">Backend:</strong> Go (Golang), Python, PHP (Laravel), Java, C# / .NET<br>
          <strong style="color: #fff;">Databases:</strong> Postgres 16, MSSQL, Oracle 19c, ClickHouse, MySQL, Redis<br>
          <strong style="color: #fff;">Security:</strong> ISO/IEC 27001:2022 Lead, UU PDP, FortiGate VPN<br>
          <strong style="color: #fff;">Availability:</strong> 99.98% High Availability SLA
        </div>
      </div>
    `);
  }

  cmdPsql() {
    this.print(`
      <div style="color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.78rem; line-height: 1.5;">
        psql (16.2, server 16.2 (Ubuntu 16.2-1.pgdg22.04+1))<br>
        Type "help" for help.<br>
        <span style="color:var(--accent-cyan);">afpi_fdc_prod=&gt;</span> SELECT client_addr, state, sync_state FROM pg_stat_replication;<br>
        &nbsp;client_addr &nbsp;| &nbsp; state &nbsp; | sync_state<br>
        -------------+-----------+------------<br>
        &nbsp;10.240.0.12 | streaming | sync &nbsp; &nbsp; &nbsp; <span style="color:var(--accent-emerald); font-weight:700;">(DRC Standby Synced - 0 Lag)</span><br>
        (1 row)
      </div>
    `);
  }

  cmdClickHouse() {
    this.print(`
      <div style="color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.78rem; line-height: 1.5;">
        Connected to ClickHouse server version 24.3.1.<br>
        <span style="color:var(--accent-primary);">clickhouse-ch-olap :)</span> SELECT count(), avg(credit_score) FROM fdc_credit_records_ch;<br>
        ┌──count()──┬─avg(credit_score)─┐<br>
        │ 50000000 │ &nbsp; &nbsp; &nbsp; &nbsp;748.2148 │<br>
        └───────────┴───────────────────┘<br>
        <span style="color:var(--accent-emerald); font-weight:700;">1 row in set. Elapsed: 0.024 sec. Processed 50.00 million rows (33.33 GB/s.)</span>
      </div>
    `);
  }

  cmdKafka() {
    this.print(`
      <div style="color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.78rem; line-height: 1.5;">
        <strong style="color:var(--accent-primary);">KAFKA TOPICS CLUSTER (3 Replicas / ISR Clean):</strong><br>
        • fdc.credit.inquiries.mutations.v1 (Partition: 12, Rate: 4,800 msg/s)<br>
        • telecom.linknet.billing.cdc (Partition: 8, Rate: 3,200 msg/s)<br>
        • paspapan.attendance.biometric.events (Partition: 6, Rate: 1,400 msg/s)<br>
        • dead.letter.queue.replay (Partition: 2, Error Rate: 0.00%)
      </div>
    `);
  }

  cmdLab() {
    this.print(`
      <div style="color: var(--text-secondary); line-height: 1.6;">
        <strong style="color: var(--accent-primary);">🔬 INTERACTIVE DBA DIAGNOSTIC LAB:</strong><br>
        • <strong>Available Workloads:</strong> 10M Row SeqScan vs B-Tree, Crowdfunding Deadlock, Real-Time ClickHouse OLAP, PgBouncer Multiplexing.<br>
        👉 <a href="#dba-lab" onclick="document.getElementById('cli-modal').classList.remove('active');" style="color:var(--accent-emerald); text-decoration:underline; font-weight:700;">Jump to Interactive DBA Lab on Page ↗</a>
      </div>
    `);
  }

  cmdROI() {
    this.print(`
      <div style="color: var(--text-secondary); line-height: 1.6;">
        <strong style="color: var(--accent-emerald);">💰 CLOUD DATABASE ROI ESTIMATOR:</strong><br>
        • Average AWS/Cloud RDS Cost Reduction: <strong>35% – 55%</strong> via index defragmentation &amp; query plan tuning.<br>
        • Query Latency Reduction: <strong>Up to 96%</strong>.<br>
        👉 <a href="#roi-calculator" onclick="document.getElementById('cli-modal').classList.remove('active');" style="color:var(--accent-primary); text-decoration:underline; font-weight:700;">Open Interactive ROI Calculator ↗</a>
      </div>
    `);
  }

  cmdDrill() {
    if (window.sreIncidentRoom) {
      window.sreIncidentRoom.runDrill();
      this.print(`
        <div style="color: var(--accent-emerald); font-weight:700;">
          🚨 SRE Incident Resilience Playbook Triggered! Watch live telemetry on page.
        </div>
      `);
    }
  }

  cmdMigrations() {
    this.print(`
      <div style="color: var(--text-secondary); line-height: 1.6;">
        <strong style="color: var(--accent-primary);">🚀 ENTERPRISE DATABASE MIGRATIONS (PT LINK NET TBK):</strong><br>
        1. <strong style="color:#fff;">Oracle 19c &rarr; PostgreSQL 16:</strong> Full PL/SQL to PL/pgSQL rewrite, schema mapping &amp; zero-downtime CDC sync.<br>
        2. <strong style="color:#fff;">MongoDB &rarr; AWS DocumentDB:</strong> Sharded NoSQL migration, index optimization &amp; replica scaling.<br>
        3. <strong style="color:#fff;">AWS RDS &rarr; TencentDB:</strong> Cross-cloud database migration for cloud compute cost reduction &amp; 99.98% SLA.<br>
        4. <strong style="color:#fff;">Centralized Grafana Dashboards:</strong> Real-time Prometheus telemetry for connection pools, buffer hits &amp; slow queries.
      </div>
    `);
  }

  cmdMobile() {
    this.print(`
      <div style="color: var(--text-secondary); line-height: 1.6;">
        <strong style="color: var(--accent-cyan);">📱 MOBILE &amp; BIOMETRIC APP CAPABILITIES:</strong><br>
        • <strong>Frameworks:</strong> Flutter, React Native, Native Android (Java/Kotlin)<br>
        • <strong>Biometrics &amp; Security:</strong> Face ID Biometric Attendance, Anti-Mock GPS spoof detection, Offline SQLite/WASM caching, Secure Keystore tokenization.<br>
        • <strong>Flagship Apps:</strong> PasPapan Enterprise HRIS &amp; WargaHub Civic Governance PWA.
      </div>
    `);
  }

  cmdSecurity() {
    if (window.soundFx) window.soundFx.playSuccess();
    this.print(`
      <div style="color: var(--text-secondary); line-height: 1.6; font-size: 0.82rem;">
        <strong style="color: var(--accent-emerald); font-size: 0.95rem;">🛡️ ISO/IEC 27001:2022 &amp; DATA PRIVACY ARCHITECTURE</strong><br>
        • <strong>Audit Lead:</strong> Spearheaded full ISO/IEC 27001:2022 ISMS lifecycle &amp; transition for national Fintech Data Center (AFPI).<br>
        • <strong>Data Masking &amp; PII Anonymization:</strong> Dynamic Data Masking (DDM), salted HMAC-SHA256 pseudonymization for NIK, bank accounts &amp; credit records across staging/analytics clusters.<br>
        • <strong>Encryption:</strong> AES-256-GCM Transparent Data Encryption (TDE) &amp; LUKS at rest, TLS 1.3 / mTLS &amp; FortiGate IPsec tunnels in transit.<br>
        • <strong>Access Control &amp; Forensics:</strong> Row-Level Security (RLS) multi-tenant isolation, pgAudit 5-year tamper-proof immutable audit retention.<br>
        • <strong>Regulatory Compliance:</strong> 100% compliant with UU Pelindungan Data Pribadi (UU PDP No. 27/2022), POJK 10/2022, and CIS Linux Benchmarks.
      </div>
    `);
  }

  cmdSkills() {
    this.print(`
      <div style="color: var(--text-secondary); line-height: 1.6;">
        <strong style="color: var(--accent-primary);">THE "ONE-MAN IT DIVISION" FULL CAPABILITIES:</strong><br>
        • <strong>Mobile &amp; Frontend:</strong> Flutter, Android, Vue 3, React, Tailwind CSS, Fastify, PGlite WASM, PWA.<br>
        • <strong>Backend &amp; APIs:</strong> Go (Golang), Python (FastAPI/Flask), PHP (Laravel/Livewire), Java, C# / .NET, REST, WebSockets.<br>
        • <strong>Core Databases (DBA):</strong> PostgreSQL (9-16), MS SQL Server (AlwaysOn), Oracle 19c (RMAN), MySQL, ClickHouse OLAP, Redis.<br>
        • <strong>Data Platform &amp; SRE:</strong> Apache Kafka, Debezium CDC, Prometheus, Grafana Blackbox Exporter, Linux Fleet.<br>
        • <strong>Security &amp; Compliance:</strong> ISO/IEC 27001:2022 Lead, UU No. 27/2022 (UU PDP), Fortinet FortiGate, StrongSwan IPsec VPN.
      </div>
    `);
    return;
  }

  _oldCmdSkills() {
    this.print(`
      <div style="color: var(--text-secondary); line-height: 1.6;">
        <strong style="color: var(--accent-primary);">CORE TECHNICAL COMPETENCIES:</strong><br>
        • <strong>Databases (DBA):</strong> PostgreSQL (9-16), MS SQL Server (AlwaysOn), Oracle 19c (RMAN), MySQL, ClickHouse, Redis.<br>
        • <strong>Data Platform:</strong> Apache Kafka, Debezium CDC, Prometheus, Grafana Blackbox Exporter.<br>
        • <strong>Security &amp; Compliance:</strong> ISO/IEC 27001:2022 Lead, UU No. 27/2022 (UU PDP), Fortinet FortiGate, IPsec VPN (StrongSwan).<br>
        • <strong>Backend &amp; Cloud:</strong> Go (Golang), Python, PHP (Laravel), Linux (Ubuntu, Debian, RHEL), AWS, Docker, CI/CD.
      </div>
    `);
  }

  cmdProjects() {
    this.print(`
      <div style="color: var(--text-secondary); line-height: 1.6;">
        <strong style="color: var(--accent-cyan);">FLAGSHIP PRODUCTION ARCHITECTURES:</strong><br>
        1. <strong>DDAG:</strong> Zero-Trust Multi-Dialect SQL API Gateway in Go (<a href="https://github.com/RiprLutuk/DDAG" target="_blank" style="color:var(--accent-primary); text-decoration:underline;">GitHub ↗</a>)<br>
        2. <strong>ch-olap-pipeline:</strong> Universal CDC streaming pipeline to ClickHouse (<a href="https://riprlutuk.github.io/ch-olap-pipeline/" target="_blank" style="color:var(--accent-primary); text-decoration:underline;">Demo ↗</a>)<br>
        3. <strong>OpenOrg:</strong> Organization governance platform &amp; digital KTA (<a href="https://github.com/RiprLutuk/openorg" target="_blank" style="color:var(--accent-primary); text-decoration:underline;">GitHub ↗</a>)<br>
        4. <strong>WargaHub:</strong> Civic governance PWA with embedded WASM Postgres (<a href="https://github.com/RiprLutuk/WargaHub" target="_blank" style="color:var(--accent-primary); text-decoration:underline;">GitHub ↗</a>)<br>
        5. <strong>PasPapan HRIS:</strong> Enterprise HRIS with Anti-Mock GPS &amp; Face ID (<a href="https://paspapan.pandanteknik.com" target="_blank" style="color:var(--accent-primary); text-decoration:underline;">Demo ↗</a>)<br>
        6. <strong>pg2ora-cdc:</strong> Postgres to Oracle real-time CDC sync pipeline (<a href="https://github.com/RiprLutuk/pg2ora_debezium_kafka" target="_blank" style="color:var(--accent-primary); text-decoration:underline;">GitHub ↗</a>)<br>
        7. <strong>db-port-monitoring:</strong> Multi-DB Port &amp; Connection Health Sentinel (<a href="https://github.com/RiprLutuk/db-port-monitoring" target="_blank" style="color:var(--accent-primary); text-decoration:underline;">GitHub ↗</a>)
      </div>
    `);
  }

  cmdRepos(filter = "") {
    const list = [
      { name: "DDAG", desc: "Zero-Trust Dynamic SQL API Gateway in Go", lang: "Go", url: "https://github.com/RiprLutuk/DDAG" },
      { name: "ch-olap-pipeline", desc: "Universal Real-Time CDC to ClickHouse", lang: "Shell/Kafka", url: "https://github.com/RiprLutuk/ch-olap-pipeline" },
      { name: "openorg", desc: "Organization governance platform & headless CMS", lang: "TypeScript", url: "https://github.com/RiprLutuk/openorg" },
      { name: "WargaHub", desc: "Neighborhood governance & financial transparency PWA", lang: "Fastify/Vue3", url: "https://github.com/RiprLutuk/WargaHub" },
      { name: "PasPapan", desc: "Enterprise HRIS & biometric attendance platform", lang: "PHP/Laravel", url: "https://github.com/RiprLutuk/PasPapan" },
      { name: "pg2ora_debezium_kafka", desc: "Real-Time CDC streaming from Postgres to Oracle 19c", lang: "Shell/Kafka", url: "https://github.com/RiprLutuk/pg2ora_debezium_kafka" },
      { name: "db-port-monitoring", desc: "Zero-credential multi-database port & connection health sentinel", lang: "Shell", url: "https://github.com/RiprLutuk/db-port-monitoring" },
      { name: "copy-table-oracle-to-postgresql", desc: "Automated table data migrator from Oracle to PostgreSQL", lang: "Python", url: "https://github.com/RiprLutuk/copy-table-oracle-to-postgresql" },
      { name: "docker-php-81", desc: "Optimized Dockerfile for PHP 8.1 FPM & Nginx", lang: "Dockerfile", url: "https://github.com/RiprLutuk/docker-php-81" }
    ];

    let filtered = list;
    if (filter) {
      filtered = list.filter(r => r.name.toLowerCase().includes(filter) || r.desc.toLowerCase().includes(filter) || r.lang.toLowerCase().includes(filter));
    }

    const items = filtered.map(r => `
      • <a href="${r.url}" target="_blank" style="color:var(--accent-primary); font-weight:700; text-decoration:underline;">${r.name}</a> 
        <span style="color:var(--text-muted);">[${r.lang}]</span>: ${r.desc}
    `).join("<br>");

    this.print(`
      <div style="color: var(--text-secondary); line-height: 1.6;">
        <strong style="color: var(--accent-emerald);">ORIGINAL PUBLIC WORKS (${filtered.length} Repositories):</strong><br>
        ${items}
      </div>
    `);
  }

  cmdHire(isSudo = false) {
    if (window.soundFx) window.soundFx.playSuccess();
    const promptText = isSudo ? "👑 [ROOT ACCESS GRANTED] Direct Fast-Track Candidate Access:" : "🚀 Direct Fast-Track Candidate Access:";
    this.print(`
      <div style="color: var(--accent-emerald); font-weight:700; margin: 6px 0;">
        ${promptText}
      </div>
      <div style="color: var(--text-secondary); line-height: 1.6;">
        Heri Riski Anto is available for senior full-time roles &amp; architecture consulting.<br>
        👉 <a href="https://t.me/riprlutuk" target="_blank" style="display:inline-block; background:#229ED9; color:#fff; padding:6px 14px; border-radius:999px; margin-top:8px; font-weight:700; text-decoration:none;">Open Telegram (@riprlutuk) ↗</a>
      </div>
    `);
  }

  cmdSudo(rest) {
    this.print(`
      <div style="color: var(--accent-emerald); font-weight:700;">
        [sudo] password for riprlutuk: **********<br>
        Permission granted for command: ${rest || "hire"}.
      </div>
    `);
  }

  cmdLs() {
    this.print(`
      <div style="color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.8rem;">
        <span style="color:var(--accent-cyan); font-weight:700;">drwxr-xr-x</span> &nbsp;2 riprlutuk dba 4096 Aug 26 01:40 <span style="color:var(--accent-primary); font-weight:700;">ddag-gateway/</span><br>
        <span style="color:var(--accent-cyan); font-weight:700;">drwxr-xr-x</span> &nbsp;2 riprlutuk dba 4096 Aug 26 01:40 <span style="color:var(--accent-primary); font-weight:700;">ch-olap-cdc/</span><br>
        <span style="color:var(--accent-cyan); font-weight:700;">drwxr-xr-x</span> &nbsp;2 riprlutuk dba 4096 Aug 26 01:40 <span style="color:var(--accent-primary); font-weight:700;">openorg-platform/</span><br>
        <span style="color:var(--accent-cyan); font-weight:700;">drwxr-xr-x</span> &nbsp;2 riprlutuk dba 4096 Aug 26 01:40 <span style="color:var(--accent-primary); font-weight:700;">wargahub-pwa/</span><br>
        <span style="color:var(--accent-cyan); font-weight:700;">drwxr-xr-x</span> &nbsp;2 riprlutuk dba 4096 Aug 26 01:40 <span style="color:var(--accent-primary); font-weight:700;">paspapan-hris/</span><br>
        <span style="color:#94a3b8;">-rw-r--r--</span> &nbsp;1 riprlutuk dba 7639 Aug 26 01:40 <span style="color:var(--accent-emerald);">curriculum-vitae.pdf</span><br>
        <span style="color:#94a3b8;">-rw-r--r--</span> &nbsp;1 riprlutuk dba 5235 Aug 26 01:40 <span style="color:var(--accent-emerald);">iso-27001-compliance.policy</span>
      </div>
    `);
  }

  cmdFree() {
    this.print(`
      <div style="color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.78rem;">
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;total &nbsp; &nbsp; &nbsp; &nbsp;used &nbsp; &nbsp; &nbsp; &nbsp;free &nbsp; &nbsp; &nbsp;shared &nbsp;buff/cache &nbsp; available<br>
        Mem: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;64Gi &nbsp; &nbsp; &nbsp; 8.8Gi &nbsp; &nbsp; &nbsp; &nbsp;38Gi &nbsp; &nbsp; &nbsp; 4.2Gi &nbsp; &nbsp; &nbsp; &nbsp;17Gi &nbsp; &nbsp; &nbsp; &nbsp;54Gi<br>
        Swap: &nbsp; &nbsp; &nbsp; &nbsp; 16Gi &nbsp; &nbsp; &nbsp; &nbsp; 0Gi &nbsp; &nbsp; &nbsp; &nbsp;16Gi<br>
        <span style="color:var(--accent-emerald); font-weight:700;">System Memory: 13.7% Used • 0% Swap Used • Health: OPTIMAL</span>
      </div>
    `);
  }

  cmdCat(file) {
    if (!file) {
      this.print(`<div style="color:var(--accent-rose);">Usage: cat &lt;filename&gt; (try: cat curriculum-vitae.pdf)</div>`);
      return;
    }
    if (file.includes("cv") || file.includes("resume")) {
      this.cmdResume();
    } else {
      this.print(`<div style="color:var(--text-secondary);">[Contents of ${file}]: Encrypted production artifact. To view full resume, type <span style="color:var(--accent-emerald);">resume</span>.</div>`);
    }
  }

  cmdPing(host) {
    this.print(`
      <div style="color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.78rem;">
        PING ${host} (10.240.0.1) 56(84) bytes of data.<br>
        64 bytes from 10.240.0.1: icmp_seq=1 ttl=64 time=0.42 ms<br>
        64 bytes from 10.240.0.1: icmp_seq=2 ttl=64 time=0.38 ms<br>
        64 bytes from 10.240.0.1: icmp_seq=3 ttl=64 time=0.41 ms<br>
        --- ${host} ping statistics ---<br>
        <span style="color:var(--accent-emerald); font-weight:700;">3 packets transmitted, 3 received, 0% packet loss, time 2002ms, rtt avg = 0.403 ms</span>
      </div>
    `);
  }

  cmdCurl(url) {
    this.print(`
      <div style="color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.78rem;">
        HTTP/2 200 OK<br>
        server: GitHub.com<br>
        content-type: text/html; charset=utf-8<br>
        x-sla-status: 99.98% High Availability<br>
        x-candidate: Heri Riski Anto (Platform Architect &amp; Core DBA)<br>
        <span style="color:var(--accent-emerald); font-weight:700;">Connection successful to ${url} (1.2ms latency)</span>
      </div>
    `);
  }

  cmdTheme(themeName) {
    if (!themeName) {
      this.print(`<div style="color:var(--text-secondary);">Available themes: obsidian, matrix, cyberpunk, light. (e.g. theme matrix)</div>`);
      return;
    }
    const validThemes = ["obsidian", "matrix", "cyberpunk", "light"];
    if (validThemes.includes(themeName)) {
      document.documentElement.setAttribute("data-theme", themeName);
      localStorage.setItem("ripr_theme", themeName);
      if (window.soundFx) window.soundFx.playSuccess();
      this.print(`<div style="color:var(--accent-emerald); font-weight:700;">Theme switched to: ${themeName}</div>`);
    } else {
      this.print(`<div style="color:var(--accent-rose);">Unknown theme: ${themeName}. Try: theme obsidian, theme matrix, theme cyberpunk, theme light.</div>`);
    }
  }

  cmdSound(action) {
    if (action === "on" || action === "enable") {
      if (window.soundFx) window.soundFx.toggleMute(false);
      this.print(`<div style="color:var(--accent-emerald); font-weight:700;">Sound FX enabled!</div>`);
    } else if (action === "off" || action === "disable") {
      if (window.soundFx) window.soundFx.toggleMute(true);
      this.print(`<div style="color:var(--text-muted);">Sound FX muted.</div>`);
    } else {
      const isMuted = window.soundFx ? window.soundFx.isMuted : false;
      this.print(`<div style="color:var(--text-secondary);">Sound is currently: <strong style="color:${isMuted ? "var(--text-muted)" : "var(--accent-emerald)"};">${isMuted ? "MUTED" : "ENABLED"}</strong>. Use "sound on" or "sound off".</div>`);
    }
  }

  cmdMatrix() {
    this.print(`
      <div style="color: #22c55e; font-family: var(--font-mono); font-size: 0.75rem; line-height: 1.2;">
        01001000 01100101 01110010 01101001 00100000 01010010 01101001 01110011 01101011 01101001<br>
        01000001 01101110 01110100 01101111 00100000 01010011 01100101 01101110 01101001 01101111<br>
        01110010 00100000 01000100 01000010 01000001 00100000 00100110 00100000 01001001 01101110<br>
        <span style="color:#fff; font-weight:700;">&gt; Wake up, Neo... Follow the white rabbit to https://riprlutuk.github.io</span>
      </div>
    `);
  }

  cmdTrain() {
    this.print(`
      <pre style="color: var(--accent-primary); font-family: var(--font-mono); font-size: 0.7rem; margin: 0; line-height: 1.2;">
      ====        ________                ___________
  _D _|  |_______/        \\__I_I_____===__|_________|
   |(_)---  |   Heri Riski Anto Express   | |       |
   /     |================================| |=======|
  |      |________________________________|_|_______|
  |________|_______________________________|_________|
   (O)  (O)        (O)  (O)             (O)   (O)
      </pre>
    `);
  }

  cmdCowsay(msg) {
    const border = "-".repeat(msg.length + 2);
    this.print(`
      <pre style="color: var(--accent-emerald); font-family: var(--font-mono); font-size: 0.75rem; margin: 0; line-height: 1.2;">
 ${border}
&lt; ${msg} &gt;
 ${border}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
      </pre>
    `);
  }

  cmdFortune() {
    const quotes = [
      "There are only two hard things in Computer Science: cache invalidation and naming things. — Phil Karlton",
      "Always design databases as if the person who ends up maintaining them will be a violent psychopath who knows where you live. — Martin Golding",
      "99.98% uptime is not an accident; it is the discipline of continuous automated backups and disaster recovery drills.",
      "Hardware eventually fails. Software eventually works. — Michael Hartung",
      "Premature optimization is the root of all evil. But unindexed foreign keys are pure malice."
    ];
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    this.print(`<div style="color: var(--accent-cyan); font-style: italic;">🔮 "${q}"</div>`);
  }

  handleAutocomplete() {
    const current = this.input.value.trim().toLowerCase();
    if (!current) return;

    const available = [
      "help", "resume", "cv", "ats", "lab", "dbalab", "roi", "drill",
      "projects", "repos", "skills", "hire", "contact", "sudo apt update",
      "sudo hire", "neofetch", "psql", "clickhouse", "kafka", "theme",
      "sound", "matrix", "cowsay", "fortune", "ls", "pwd", "whoami",
      "uptime", "free", "ping", "curl", "clear"
    ];

    const match = available.find(c => c.startsWith(current));
    if (match) {
      this.input.value = match;
    }
  }
}

window.CyberTerminal = CyberTerminal;

function initTerminal() {
  if (!window.cyberTerminal) {
    window.cyberTerminal = new CyberTerminal();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTerminal);
} else {
  initTerminal();
}
