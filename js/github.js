/**
 * GitHub Public Repositories Live Explorer
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
  Other: "#6E7681"
};

class GitHubExplorer {
  constructor() {
    this.repos = [];
    this.currentCategory = "All";
    this.searchQuery = "";
    this.gridElement = document.getElementById("github-repos-grid");
    this.searchInput = document.getElementById("github-search-input");
    this.filterTabs = document.querySelectorAll(".github-tab");
    this.totalReposCountEl = document.getElementById("total-repos-count");
    
    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadRepos();
  }

  bindEvents() {
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.render();
      });
    }

    this.filterTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        if (window.soundFx) window.soundFx.playClick();
        this.filterTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        this.currentCategory = tab.getAttribute("data-category") || "All";
        this.render();
      });
    });
  }

  async loadRepos() {
    // 1. First load from local bundle
    try {
      const res = await fetch("data/repos.json");
      if (res.ok) {
        this.repos = await res.json();
        this.render();
      }
    } catch (e) {
      console.warn("Failed loading data/repos.json", e);
    }

    // 2. Fetch live data in background from GitHub API
    try {
      const apiRes = await fetch("https://api.github.com/users/RiprLutuk/repos?per_page=100&sort=updated");
      if (apiRes.ok) {
        const liveData = await apiRes.json();
        if (Array.isArray(liveData) && liveData.length > 0) {
          // Merge live stats (stars, forks, updated_at)
          const liveMap = new Map(liveData.map(r => [r.name, r]));
          this.repos = this.repos.map(localRepo => {
            const live = liveMap.get(localRepo.name);
            if (live) {
              return {
                ...localRepo,
                stars: live.stargazers_count,
                forks: live.forks_count,
                updated_at: live.updated_at,
                description: live.description || localRepo.description
              };
            }
            return localRepo;
          });
          this.render();
        }
      }
    } catch (e) {
      console.log("GitHub live fetch fallback to local cache");
    }
  }

  filterRepos() {
    return this.repos.filter(repo => {
      // Category filter
      const matchesCategory = this.currentCategory === "All" || repo.category === this.currentCategory;
      
      // Search query filter
      const matchesSearch = !this.searchQuery || 
        repo.name.toLowerCase().includes(this.searchQuery) ||
        (repo.description && repo.description.toLowerCase().includes(this.searchQuery)) ||
        (repo.language && repo.language.toLowerCase().includes(this.searchQuery));

      return matchesCategory && matchesSearch;
    });
  }

  render() {
    if (!this.gridElement) return;

    const filtered = this.filterRepos();
    if (this.totalReposCountEl) {
      this.totalReposCountEl.textContent = `${filtered.length} Repositories`;
    }

    if (filtered.length === 0) {
      this.gridElement.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px 20px; color: var(--text-muted);">
          <div style="font-size: 2rem; margin-bottom: 8px;">🔍</div>
          <div>No repositories found matching "<strong>${this.searchQuery}</strong>" in ${this.currentCategory}.</div>
        </div>
      `;
      return;
    }

    let html = "";
    filtered.forEach(repo => {
      const langColor = LANG_COLORS[repo.language] || LANG_COLORS.Other;
      const formattedDate = repo.updated_at ? new Date(repo.updated_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "";
      
      const demoBtn = repo.demo_url ? `
        <a href="${repo.demo_url}" target="_blank" rel="noopener" class="bento-link-btn" style="padding: 2px 10px; font-size: 0.75rem;" title="Live Demo">
          Demo ↗
        </a>
      ` : "";

      const featuredBadge = repo.is_featured ? `
        <span style="font-size: 0.65rem; background: rgba(99, 102, 241, 0.2); color: var(--accent-primary); border: 1px solid var(--border-strong); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-weight: 700;">
          FEATURED
        </span>
      ` : "";

      html += `
        <article class="repo-card">
          <div class="repo-card-top">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 6px;">
              <a href="${repo.url}" target="_blank" rel="noopener" class="repo-name-link">
                <span>📁</span>
                <span>${repo.name}</span>
              </a>
              ${featuredBadge}
            </div>
            <p class="repo-desc-text">${repo.description || "No description provided."}</p>
          </div>

          <div class="repo-meta-row">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span class="repo-lang-dot">
                <span class="lang-color-circle" style="background-color: ${langColor};"></span>
                <span>${repo.language}</span>
              </span>
              <span title="Stars">⭐ ${repo.stars}</span>
              <span title="Forks">🍴 ${repo.forks}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              ${demoBtn}
              <a href="${repo.url}" target="_blank" rel="noopener" style="color: var(--text-primary); font-weight: 600;" title="View on GitHub">
                GitHub ↗
              </a>
            </div>
          </div>
        </article>
      `;
    });

    this.gridElement.innerHTML = html;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.githubExplorer = new GitHubExplorer();
});
