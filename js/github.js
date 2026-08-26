/**
 * GitHub Public Repositories Live Explorer
 * Strictly filters out all forked repositories, displaying only original public works
 */

const LANG_COLORS = {
  Go: "#00ADD8",
  Python: "#3572A5",
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  PHP: "#4F5D95",
  Java: "#B07219",
  Shell: "#89E051",
  Dockerfile: "#384D54",
  HTML: "#E34C26",
  CSS: "#563D7C",
  PLpgSQL: "#336791",
  Blade: "#f43f5e",
  Other: "#6E7681"
};

const KNOWN_FORKS = new Set([
  "fmhy", "awesome-laravel", "awesome-selfhosted", "signal-android",
  "adminlte", "azzara-admin-dashboard-template", "dompdf", "phpauth",
  "php-login", "php-login-advanced", "ezservermonitor-web", "linfo",
  "phpmailer", "postmark-templates", "html-email-templates",
  "html-email-templates-1", "email-templates", "edit", "pgtune",
  "dev-roadmaps"
]);

const FALLBACK_REPOS = [
  {
    "name": "openorg",
    "description": "Open-source single-tenant organization platform & headless CMS with digital KTA, SKP academy, governance hierarchy, and credential verification.",
    "language": "TypeScript",
    "stars": 0,
    "forks": 0,
    "url": "https://github.com/RiprLutuk/openorg",
    "updated_at": "2026-08-25T09:41:51Z",
    "category": "Backend & APIs",
    "is_fork": false,
    "is_featured": true,
    "demo_url": null
  },
  {
    "name": "db-port-monitoring",
    "description": "Zero-credential multi-database port & connection health sentinel. Prometheus Blackbox TCP probing, durable PostgreSQL time-series backfill ingestion daemon, incident downtime event tracking, and 7-panel Grafana SLA KPI executive reporting.",
    "language": "Shell",
    "stars": 4,
    "forks": 1,
    "url": "https://github.com/RiprLutuk/db-port-monitoring",
    "updated_at": "2026-08-26T09:00:00Z",
    "category": "DBA & Data Platform",
    "is_fork": false,
    "is_featured": true,
    "demo_url": null
  },
  {
    "name": "PasPapan",
    "description": "Sistem HRIS & Operasional All-in-One Terlengkap! Absensi Face ID & GPS, One-Click Payroll, Reimburse, KPI & Appraisal, Shift Planning, CRM, Akuntansi, Kolaborasi Tim, Dashboard Admin Gahar (Multi-Cabang), hingga Dukungan Penuh Aplikasi Native iOS & Android.",
    "language": "PHP",
    "stars": 82,
    "forks": 38,
    "url": "https://github.com/RiprLutuk/PasPapan",
    "updated_at": "2026-08-12T02:01:40Z",
    "category": "Fullstack & Apps",
    "is_fork": false,
    "is_featured": true,
    "demo_url": "https://paspapan.pandanteknik.com"
  },
  {
    "name": "DDAG",
    "description": "Zero-Trust Multi-Dialect API Gateway \u2014 dynamically expose any SQL database as a secure, governed REST API.",
    "language": "Go",
    "stars": 4,
    "forks": 2,
    "url": "https://github.com/RiprLutuk/DDAG",
    "updated_at": "2026-08-05T17:07:11Z",
    "category": "DBA & Data Platform",
    "is_fork": false,
    "is_featured": true,
    "demo_url": null
  },
  {
    "name": "WargaHub",
    "description": "\ud83c\udfe1 Sistem Informasi, Transparansi Keuangan, Musyawarah Digital & Operasional Lingkungan Warga (RT/RW) | Fastify, Vue 3 PWA, PGlite WASM",
    "language": "TypeScript",
    "stars": 1,
    "forks": 2,
    "url": "https://github.com/RiprLutuk/WargaHub",
    "updated_at": "2026-07-29T04:01:33Z",
    "category": "Fullstack & Apps",
    "is_fork": false,
    "is_featured": true,
    "demo_url": null
  },
  {
    "name": "riprlutuk.github.io",
    "description": "Blog RiprLutuk",
    "language": "JavaScript",
    "stars": 0,
    "forks": 0,
    "url": "https://github.com/RiprLutuk/riprlutuk.github.io",
    "updated_at": "2026-07-21T13:54:34Z",
    "category": "Tools",
    "is_fork": false,
    "is_featured": false,
    "demo_url": "https://riprlutuk.github.io"
  },
  {
    "name": "ch-olap-pipeline",
    "description": "Universal OLTP to OLAP CDC pipeline with Debezium, Kafka, and ClickHouse. First-class adapters: PostgreSQL, MySQL, SQL Server.",
    "language": "Shell",
    "stars": 0,
    "forks": 0,
    "url": "https://github.com/RiprLutuk/ch-olap-pipeline",
    "updated_at": "2026-07-05T17:37:58Z",
    "category": "DBA & Data Platform",
    "is_fork": false,
    "is_featured": true,
    "demo_url": "https://riprlutuk.github.io/ch-olap-pipeline/"
  },
  {
    "name": "RiprLutuk",
    "description": "Config files for my GitHub profile.",
    "language": "Other",
    "stars": 0,
    "forks": 0,
    "url": "https://github.com/RiprLutuk/RiprLutuk",
    "updated_at": "2026-06-22T18:46:43Z",
    "category": "Tools",
    "is_fork": false,
    "is_featured": false,
    "demo_url": null
  },
  {
    "name": "webbengkeldealer",
    "description": "web untuk admin apk bengkeldealer, sebagai rest api untuk informasi sistem informasi geografis or pemetaan bengkel dan dealer di kabupaten pemalang",
    "language": "PHP",
    "stars": 1,
    "forks": 1,
    "url": "https://github.com/RiprLutuk/webbengkeldealer",
    "updated_at": "2026-04-30T04:45:18Z",
    "category": "Backend & APIs",
    "is_fork": false,
    "is_featured": false,
    "demo_url": null
  },
  {
    "name": "bengkeldealer",
    "description": "APK bengkel dealer untuk kabupaten pamalang",
    "language": "Java",
    "stars": 1,
    "forks": 0,
    "url": "https://github.com/RiprLutuk/bengkeldealer",
    "updated_at": "2026-04-30T04:45:17Z",
    "category": "Fullstack & Apps",
    "is_fork": false,
    "is_featured": false,
    "demo_url": null
  },
  {
    "name": "docker-php-81",
    "description": "Repository docker-php-81 by Heri Riski Anto",
    "language": "Dockerfile",
    "stars": 1,
    "forks": 0,
    "url": "https://github.com/RiprLutuk/docker-php-81",
    "updated_at": "2026-04-30T04:44:47Z",
    "category": "Backend & APIs",
    "is_fork": false,
    "is_featured": false,
    "demo_url": null
  },
  {
    "name": "copy-table-oracle-to-postgresql",
    "description": "Repository copy-table-oracle-to-postgresql by Heri Riski Anto",
    "language": "Python",
    "stars": 1,
    "forks": 0,
    "url": "https://github.com/RiprLutuk/copy-table-oracle-to-postgresql",
    "updated_at": "2026-04-30T04:44:41Z",
    "category": "DBA & Data Platform",
    "is_fork": false,
    "is_featured": true,
    "demo_url": null
  },
  {
    "name": "pg2ora_debezium_kafka",
    "description": "Repository pg2ora_debezium_kafka by Heri Riski Anto",
    "language": "Shell",
    "stars": 1,
    "forks": 0,
    "url": "https://github.com/RiprLutuk/pg2ora_debezium_kafka",
    "updated_at": "2026-04-30T04:44:34Z",
    "category": "DBA & Data Platform",
    "is_fork": false,
    "is_featured": true,
    "demo_url": null
  },
  {
    "name": "101-linux-commands-ebook",
    "description": "101 Linux commands Open-source eBook",
    "language": "Other",
    "stars": 0,
    "forks": 0,
    "url": "https://github.com/RiprLutuk/101-linux-commands-ebook",
    "updated_at": "2025-11-23T14:09:44Z",
    "category": "DevOps & Security",
    "is_fork": true,
    "is_featured": false,
    "demo_url": null
  },
  {
    "name": "wedding-invitation",
    "description": "undangan pernikahan ",
    "language": "Other",
    "stars": 0,
    "forks": 0,
    "url": "https://github.com/RiprLutuk/wedding-invitation",
    "updated_at": "2025-06-21T01:29:36Z",
    "category": "Fullstack & Apps",
    "is_fork": true,
    "is_featured": false,
    "demo_url": null
  },
  {
    "name": "nginx-tuning",
    "description": "NGINX tuning for best performance",
    "language": "Other",
    "stars": 0,
    "forks": 0,
    "url": "https://github.com/RiprLutuk/nginx-tuning",
    "updated_at": "2022-04-18T20:42:02Z",
    "category": "DevOps & Security",
    "is_fork": true,
    "is_featured": false,
    "demo_url": null
  },
  {
    "name": "Chat-Realtime",
    "description": "Public & Private message. MySQL & Firebase.",
    "language": "Other",
    "stars": 0,
    "forks": 0,
    "url": "https://github.com/RiprLutuk/Chat-Realtime",
    "updated_at": "2021-02-03T10:15:16Z",
    "category": "DBA & Data Platform",
    "is_fork": true,
    "is_featured": false,
    "demo_url": null
  },
  {
    "name": "telegram-whatsapp-webapp",
    "description": "telegram web app for brave browser",
    "language": "Shell",
    "stars": 0,
    "forks": 0,
    "url": "https://github.com/RiprLutuk/telegram-whatsapp-webapp",
    "updated_at": "2020-10-21T08:52:46Z",
    "category": "Tools",
    "is_fork": false,
    "is_featured": false,
    "demo_url": null
  }
];

class GitHubExplorer {
  constructor() {
    this.repos = [];
    this.filteredRepos = [];
    this.currentCategory = "all";
    this.searchQuery = "";
    
    this.container = document.getElementById("github-repos-grid");
    this.filterTabs = document.querySelectorAll(".repo-tab-btn, .github-tab");
    this.searchInput = document.getElementById("repo-search-input") || document.getElementById("github-search-input");
    this.countBadge = document.getElementById("repo-count-badge") || document.getElementById("total-repos-count");
    
    this.init();
  }

  init() {
    this.initControls();
    this.loadRepos();
  }

  initControls() {
    if (this.filterTabs) {
      this.filterTabs.forEach(btn => {
        btn.addEventListener("click", () => {
          if (window.soundFx && typeof window.soundFx.playClick === 'function') {
            window.soundFx.playClick();
          }
          this.filterTabs.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          this.currentCategory = btn.getAttribute("data-category") || "all";
          this.applyFilter();
        });
      });
    }

    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.applyFilter();
      });
    }
  }

  async loadRepos() {
    this.renderLoading();

    const isFileScheme = window.location.protocol === "file:";

    if (!isFileScheme) {
      // 1. Try Live GitHub API with strict non-fork filtering
      try {
        const res = await fetch("https://api.github.com/users/RiprLutuk/repos?per_page=100&sort=updated");
        if (res.ok) {
          const raw = await res.json();
          this.repos = raw
            .filter(r => !r.fork && !KNOWN_FORKS.has(r.name.toLowerCase()))
            .map(r => this.normalizeRepo(r));
          this.applyFilter();
          return;
        }
      } catch (e) {
        // Continue to local fallback
      }

      // 2. Try Local data/repos.json
      try {
        const res = await fetch("data/repos.json");
        if (res.ok) {
          const raw = await res.json();
          this.repos = raw.filter(r => !r.fork && !KNOWN_FORKS.has(r.name.toLowerCase()));
          this.applyFilter();
          return;
        }
      } catch (e) {
        // Continue to fallback memory
      }
    }

    // 3. Fallback Memory (Strictly original author repos)
    this.repos = FALLBACK_REPOS.filter(r => !r.fork && !KNOWN_FORKS.has(r.name.toLowerCase()));
    this.applyFilter();
  }

  normalizeRepo(r) {
    const desc = r.description || "Original engineering repository & infrastructure platform.";
    let category = "Fullstack & Apps";
    const nameLow = r.name.toLowerCase();
    const descLow = desc.toLowerCase();
    
    if (nameLow.includes("db") || nameLow.includes("sql") || nameLow.includes("olap") || nameLow.includes("cdc") || descLow.includes("database") || descLow.includes("clickhouse") || descLow.includes("oracle")) {
      category = "DBA & Data Platform";
    } else if (nameLow.includes("gateway") || nameLow.includes("api") || descLow.includes("api") || descLow.includes("gateway") || descLow.includes("backend")) {
      category = "Backend & APIs";
    } else if (nameLow.includes("linux") || nameLow.includes("docker") || nameLow.includes("monitor") || nameLow.includes("security") || descLow.includes("linux") || descLow.includes("devops")) {
      category = "DevOps & Security";
    }

    return {
      name: r.name,
      description: desc,
      html_url: r.html_url,
      homepage: r.homepage,
      language: r.language || "Other",
      stargazers_count: r.stargazers_count || 0,
      forks_count: r.forks_count || 0,
      updated_at: r.updated_at,
      category: category,
      is_featured: ["DDAG", "ch-olap-pipeline", "openorg", "WargaHub", "PasPapan", "pg2ora_debezium_kafka", "db-port-monitoring"].includes(r.name)
    };
  }

  applyFilter() {
    this.filteredRepos = this.repos.filter(r => {
      const isAll = !this.currentCategory || this.currentCategory.toLowerCase() === "all";
      const matchCat = isAll || (r.category && r.category.toLowerCase() === this.currentCategory.toLowerCase());
      const matchSearch = !this.searchQuery || 
        r.name.toLowerCase().includes(this.searchQuery) || 
        (r.description && r.description.toLowerCase().includes(this.searchQuery)) ||
        (r.language && r.language.toLowerCase().includes(this.searchQuery));
      return matchCat && matchSearch;
    });

    if (this.countBadge) {
      this.countBadge.textContent = `${this.filteredRepos.length} original repositories`;
    }

    this.render();
  }

  renderLoading() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted); font-family: var(--font-mono); width: 100%;">
        <div style="display: inline-block; animation: spin 1s infinite linear; font-size: 1.5rem; margin-bottom: 8px;">⏳</div>
        <div>Loading original repositories...</div>
      </div>
    `;
  }

  render() {
    if (!this.container) return;

    if (this.filteredRepos.length === 0) {
      this.container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: var(--text-muted); font-family: var(--font-mono); width: 100%;">
          <div style="font-size: 1.8rem; margin-bottom: 8px;">🔍</div>
          <div style="font-weight: 700; color: var(--text-secondary);">No repositories matching "${this.searchQuery}"</div>
          <div style="font-size: 0.8rem; margin-top: 4px;">Try searching for another keyword like "postgres", "go", or "api"</div>
        </div>
      `;
      if (window.reposCarousel) {
        window.reposCarousel.init();
      }
      return;
    }

    this.container.innerHTML = this.filteredRepos.map(r => {
      const langColor = LANG_COLORS[r.language] || LANG_COLORS.Other;
      const featuredBadge = r.is_featured ? `
        <span style="font-size:0.65rem; font-family:var(--font-mono); background:rgba(249, 115, 22, 0.15); color:var(--accent-primary); border:1px solid rgba(249, 115, 22, 0.3); padding:2px 8px; border-radius:4px; font-weight:700;">
          ⭐ FEATURED
        </span>
      ` : "";

      const demoLink = r.homepage ? `
        <a href="${r.homepage}" target="_blank" rel="noopener" class="repo-card-link" title="Live Demo">
          Demo ↗
        </a>
      ` : "";

      return `
        <article class="repo-card ${r.is_featured ? "featured-repo" : ""}">
          <div>
            <div class="repo-card-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <span class="repo-category-pill" style="font-size:0.7rem; font-family:var(--font-mono); color:var(--accent-cyan);">${r.category}</span>
              ${featuredBadge}
            </div>

            <h3 class="repo-name" style="font-size:1.05rem; font-weight:800; margin-bottom:6px;">
              <a href="${r.html_url}" target="_blank" rel="noopener" style="color:var(--text-primary);">${r.name}</a>
            </h3>

            <p class="repo-desc" style="font-size:0.82rem; color:var(--text-secondary); line-height:1.5; margin-bottom:14px;">${r.description}</p>
          </div>

          <div class="repo-card-footer" style="display:flex; justify-content:space-between; align-items:center; padding-top:12px; border-top:1px solid rgba(255,255,255,0.06); font-size:0.75rem; font-family:var(--font-mono);">
            <div class="repo-lang" style="display:flex; align-items:center; gap:6px;">
              <span class="repo-lang-dot" style="width:8px; height:8px; border-radius:50%; background-color: ${langColor}; display:inline-block;"></span>
              <span>${r.language}</span>
            </div>

            <div class="repo-links" style="display:flex; align-items:center; gap:8px;">
              ${demoLink}
              <a href="${r.html_url}" target="_blank" rel="noopener" class="repo-card-link" style="color:var(--accent-cyan); font-weight:700;">
                GitHub ↗
              </a>
            </div>
          </div>
        </article>
      `;
    }).join("");

    // Initialize or update Repos Carousel
    if (window.CyberCarousel) {
      if (!window.reposCarousel) {
        window.reposCarousel = new window.CyberCarousel(this.container, {
          prevBtn: document.getElementById('repos-prev-btn'),
          nextBtn: document.getElementById('repos-next-btn'),
          dotsWrap: document.getElementById('repos-carousel-dots'),
          counterEl: document.getElementById('repos-carousel-counter')
        });
      } else {
        window.reposCarousel.currentIndex = 0;
        window.reposCarousel.init();
      }
    }
  }
}

function initGH() {
  window.githubExplorer = new GitHubExplorer();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGH);
} else {
  initGH();
}
