/**
 * Cybernetic System Topology & Architecture Visualizer
 * Includes Live Particle Canvas Streamer, Telemetry Simulator & Failover Drills
 */

const ARCHITECTURE_DATA = {
  afpi: {
    title: "AFPI National Fintech Data Center (FDC) — ISO/IEC 27001:2022 & UU PDP",
    badge: "ISO 27001:2022 & POJK 10/2022",
    description: "National credit federator connecting 100+ licensed P2P lenders with dynamic PII data masking, tamper-resistant audit trails (5-yr retention), and secondary DRC site.",
    nodes: [
      {
        id: "fintech-nodes",
        badge: "SOURCE",
        icon: "🏢",
        title: "100+ Fintech Nodes",
        desc: "P2P lenders credit score & deduplication inquiries",
        telemetryNormal: "3,850 req/s • 1.2ms",
        telemetrySpike: "12,400 req/s • 2.8ms",
        tags: ["mTLS", "POJK 10/2022", "Token Auth"],
        details: "Secure API endpoints accepting encrypted JSON credit inquiries and borrower deduplication requests across 100+ member platforms under OJK oversight."
      },
      {
        id: "vpn-edge",
        badge: "SECURITY EDGE",
        icon: "🛡️",
        title: "FortiGate + IPsec VPN",
        desc: "AES-256 StrongSwan & Fortinet Firewall (A.8.24)",
        telemetryNormal: "0 Dropped • 0.4ms",
        telemetrySpike: "DDoS Filter Active • 0.9ms",
        tags: ["AES-256-GCM", "IPsec Tunnel", "Egress Filtering"],
        details: "Hardware-accelerated site-to-site IPsec VPN tunnels with strict ingress firewall policies, IP whitelisting per member, and anti-DDoS perimeter protection."
      },
      {
        id: "ingest-backend",
        badge: "COMPUTE",
        icon: "⚙️",
        title: "Ingestion & PII Masking",
        desc: "Go & Python ETL + UU PDP Data Masking (A.8.11)",
        telemetryNormal: "4,200 evt/s • 0.9ms",
        telemetrySpike: "14,000 evt/s • 2.1ms",
        tags: ["UU No. 27/2022", "Dynamic Masking", "Go Gateway"],
        details: "High-throughput microservices performing dynamic masking on NIK KTP, phone numbers, and bank accounts before analytical processing to guarantee UU PDP compliance."
      },
      {
        id: "db-ha",
        badge: "STORAGE",
        icon: "💾",
        title: "Postgres & MySQL HA + DRC",
        desc: "Streaming Replication & DRC Site (POJK 10/2022)",
        telemetryNormal: "99.98% SLA • RPO <15m",
        telemetrySpike: "Sync Active • RTO <1h",
        tags: ["Primary-Standby", "TDE AES-256", "DRC Site"],
        details: "Enterprise database cluster with encrypted tablespaces, WAL archiving, and real-time replication to a secondary Disaster Recovery Center in Indonesia."
      },
      {
        id: "audit-telemetry",
        badge: "AUDIT LOGS",
        icon: "📊",
        title: "Audit Trail & Telemetry",
        desc: "pgAudit + 5-Yr Logs & Blackbox Exporter (A.8.15)",
        telemetryNormal: "100% Integrity • WORM",
        telemetrySpike: "Real-Time Telemetry Active",
        tags: ["5-Year Retention", "Prometheus", "Grafana SLA"],
        details: "Tamper-resistant centralized audit logging (pgAudit) combined with Prometheus Blackbox Exporter performing 24/7 synthetic HTTP/TCP probes, SSL expiry tracking, and Grafana SLA uptime telemetry."
      }
    ]
  },
  cdc: {
    title: "Universal OLTP-to-OLAP Real-Time CDC Pipeline (ch-olap-pipeline)",
    badge: "Sub-Second Analytical Latency",
    description: "Zero-impact Change Data Capture pipeline streaming transaction mutations from multiple RDBMS into ClickHouse for fast analytics.",
    nodes: [
      {
        id: "oltp-sources",
        badge: "OLTP SOURCES",
        icon: "🗄️",
        title: "Multi-RDBMS Sources",
        desc: "PostgreSQL, MySQL & MS SQL Server",
        telemetryNormal: "5,200 tx/s • WAL Stream",
        telemetrySpike: "18,500 tx/s • 0 Impact",
        tags: ["Postgres WAL", "MySQL Binlog", "MSSQL CDC"],
        details: "Captures row-level INSERT, UPDATE, DELETE transaction logs without impacting production OLTP read/write operations."
      },
      {
        id: "debezium",
        badge: "CDC CONNECTOR",
        icon: "🔄",
        title: "Debezium Engine",
        desc: "Transaction log stream parser",
        telemetryNormal: "0 Lag • 1.1ms",
        telemetrySpike: "Batch Ingest • 2.4ms",
        tags: ["Kafka Connect", "Schema Evolution", "Avro/JSON"],
        details: "Converts raw database transaction logs into structured event records with full before-and-after change snapshots."
      },
      {
        id: "kafka",
        badge: "MESSAGE BROKER",
        icon: "📨",
        title: "Apache Kafka Cluster",
        desc: "Distributed partitioned event topics",
        telemetryNormal: "3x Replicas • 0 Loss",
        telemetrySpike: "Backpressure Managed",
        tags: ["Distributed Topics", "At-Least-Once", "High-Throughput"],
        details: "Horizontally scalable event streaming broker providing partitioned topic ordering, consumer group balancing, and reliable backpressure handling."
      },
      {
        id: "clickhouse",
        badge: "OLAP ENGINE",
        icon: "🚀",
        title: "ClickHouse Columnar",
        desc: "ReplacingMergeTree storage engine",
        telemetryNormal: "18ms Query • 10M rows",
        telemetrySpike: "34ms Query • 50M rows",
        tags: ["Columnar DB", "Vector Execution", "Compression 80%"],
        details: "High-performance analytical columnar database executing complex aggregations across tens of millions of rows in sub-50 milliseconds."
      },
      {
        id: "bi-dashboards",
        badge: "CONSUMERS",
        icon: "📈",
        title: "Real-Time BI & APIs",
        desc: "Grafana, Metabase & REST Endpoints",
        telemetryNormal: "Live Refresh • 1s Poll",
        telemetrySpike: "Instant Aggregations",
        tags: ["Grafana", "Metabase", "Executive BI"],
        details: "Live executive and operational dashboards providing continuous real-time business visibility with zero batch latency."
      }
    ]
  },
  ddag: {
    title: "DDAG (Zero-Trust Multi-Dialect API Gateway in Go)",
    badge: "High-Throughput Go Engine",
    description: "Dynamically reflects SQL schemas and exposes databases as secure REST APIs with granular RBAC, connection pooling, and parameter sanitization.",
    nodes: [
      {
        id: "clients",
        badge: "CLIENTS",
        icon: "🌐",
        title: "Consumers & Apps",
        desc: "Web apps, mobile clients & microservices",
        telemetryNormal: "2,400 req/s • HTTP/2",
        telemetrySpike: "9,600 req/s • Rate Limit Active",
        tags: ["REST", "Bearer JWT", "JSON"],
        details: "Client applications consuming standard REST HTTP endpoints with Bearer token authentication."
      },
      {
        id: "ddag-core",
        badge: "API GATEWAY",
        icon: "⚡",
        title: "DDAG Core (Go)",
        desc: "Routing, Token Auth & Sanitization",
        telemetryNormal: "1.4ms Overhead • Zero-Trust",
        telemetrySpike: "3.2ms Overhead • 0 Leak",
        tags: ["Golang", "SQL Injection Sanitizer", "RBAC"],
        details: "High-speed Go gateway validating route-level ACLs, token signatures, and parameter sanitization to eliminate SQL injection vulnerabilities."
      },
      {
        id: "pooler",
        badge: "CONNECTION POOL",
        icon: "🏊",
        title: "Smart Connection Pool",
        desc: "PgBouncer & Multiplexer",
        telemetryNormal: "98% Pool Efficiency",
        telemetrySpike: "1,500 Conns Multiplexed",
        tags: ["PgBouncer", "Dialect Multiplexer", "Zero Exhaustion"],
        details: "Multiplexes thousands of client requests across a pre-warmed pool of persistent database connections, preventing connection exhaustion."
      },
      {
        id: "target-db",
        badge: "RDBMS",
        icon: "💾",
        title: "Target SQL Databases",
        desc: "Postgres, MSSQL, Oracle, MySQL",
        telemetryNormal: "Dynamic Reflection Active",
        telemetrySpike: "Multi-Engine Queries Synced",
        tags: ["PostgreSQL", "MS SQL Server", "Oracle 19c", "MySQL"],
        details: "Executes parameterized dynamic SQL queries across heterogeneous RDBMS engines with schema caching."
      },
      {
        id: "audit-trace",
        badge: "AUDIT LOGS",
        icon: "📋",
        title: "Audit & Tracing",
        desc: "Structured JSON Access Trails",
        telemetryNormal: "100% Request Traced",
        telemetrySpike: "Alert Rules Monitored",
        tags: ["Audit Trail", "OpenTelemetry", "Zero-Trust"],
        details: "Records complete cryptographic access logs and latency traces for security audit compliance and performance troubleshooting."
      }
    ]
  },
  dbmon: {
    title: "Multi-Database Port & Availability Sentinel (db-port-monitoring)",
    badge: "Zero-Credential TCP Sentinel • SLA 99.99%",
    description: "Enterprise multi-engine database availability & port socket prober. Automated 5-minute scrape cycles, zero-credential security, persistent PostgreSQL time-series state writer, and instant Grafana executive KPI analytics.",
    nodes: [
      {
        id: "target-clusters",
        badge: "TARGET DB CLUSTERS",
        icon: "🗄️",
        title: "Multi-RDBMS Targets",
        desc: "PostgreSQL, MySQL, Oracle 19c, MSSQL, ClickHouse",
        telemetryNormal: "64 DB Targets • 0 Auth",
        telemetrySpike: "128 DB Targets • 0.3ms Socket",
        tags: ["Zero-Credential", "Multi-Engine", "Non-Intrusive TCP"],
        details: "Heterogeneous enterprise database instances monitored strictly via non-intrusive TCP socket handshakes without storing or requiring database credentials, passwords, or elevated permissions."
      },
      {
        id: "blackbox-prober",
        badge: "PROBE ENGINE",
        icon: "📡",
        title: "Prometheus + Blackbox Exporter",
        desc: "Automated TCP probe & dynamic discovery daemon",
        telemetryNormal: "5m Cadence • 0.8ms Socket RTT",
        telemetrySpike: "Fast Probe Active • 1.1ms RTT",
        tags: ["Blackbox TCP", "Dynamic File SD", "Prometheus 9090"],
        details: "Prometheus file-based service discovery continuously reloading db-targets.yml every 60 seconds with Blackbox Exporter executing microsecond-level TCP connection syn/ack probes."
      },
      {
        id: "pg-writer",
        badge: "INGESTION DAEMON",
        icon: "⚙️",
        title: "blackbox-pg-writer",
        desc: "Durable state writer & historical backfill engine",
        telemetryNormal: "0 Backlog • Overlap Synced",
        telemetrySpike: "Auto-Backfill Chunk Active",
        tags: ["Durable State Cursor", "Deduplication", "Chunk Backfill"],
        details: "Resilient containerized daemon querying Prometheus raw samples across overlapping time windows, preventing duplicate records with unique key constraints (checked_at, target_name) and auto-resuming from checkpoint state."
      },
      {
        id: "pg-storage",
        badge: "TIME-SERIES STORAGE",
        icon: "💾",
        title: "PostgreSQL KPI & Event Hub",
        desc: "Daily KPI aggregates & Downtime incident audit log",
        telemetryNormal: "100% Data Integrity • WORM",
        telemetrySpike: "Partition Pruning Active",
        tags: ["Daily KPI", "Incident Event Log", "Audit History"],
        details: "Consolidates raw probes into db_port_blackbox_daily_kpi and db_port_blackbox_downtime_events for continuous SLA reporting and multi-year compliance audit tracking."
      },
      {
        id: "grafana-alerting",
        badge: "EXECUTIVE OPS",
        icon: "📊",
        title: "Grafana KPI & Alertmanager",
        desc: "Executive 7-panel dashboard & Telegram alert gateway",
        telemetryNormal: "SLA: 99.99% • 0 Alert",
        telemetrySpike: "Instant Alert Triggered (<30s)",
        tags: ["Executive SQL Panels", "Alertmanager", "Telegram Bot"],
        details: "Real-time executive uptime dashboard visualizing port UP/DOWN status, SLA compliance percentage, lowest-availability targets, and automated Telegram bot incident alerting."
      }
    ]
  }
};

class TopologyVisualizer {
  constructor() {
    this.currentKey = "afpi";
    this.activeNodeIndex = 0;
    this.isSpikeMode = false;
    
    this.container = document.getElementById("topology-canvas-wrap");
    this.detailContainer = document.getElementById("topology-detail-panel");
    this.tabButtons = document.querySelectorAll(".topology-tab-btn");
    
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animationFrameId = null;

    this.init();
  }

  init() {
    this.initControls();
    this.render();
  }

  initControls() {
    this.tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        if (window.soundFx) window.soundFx.playClick();
        const key = btn.getAttribute("data-topology");
        this.switchTopology(key);
      });
    });

    // Traffic Spike Simulation Button
    const spikeBtn = document.getElementById("topo-spike-btn");
    if (spikeBtn) {
      spikeBtn.addEventListener("click", () => {
        this.isSpikeMode = !this.isSpikeMode;
        spikeBtn.classList.toggle("active", this.isSpikeMode);
        spikeBtn.innerHTML = this.isSpikeMode ? "<span>⚡ Traffic: PEAK SPIKE (14K req/s)</span>" : "<span>⚡ Traffic: Normal (3.8K req/s)</span>";
        if (window.soundFx) window.soundFx.playSuccess();
        if (window.showToast) window.showToast(this.isSpikeMode ? "Traffic Spike Simulated: 14,000 req/s!" : "Traffic returned to normal load.");
        this.updateTelemetryValues();
      });
    }

    // Failover Simulation Button
    const failoverBtn = document.getElementById("topo-failover-btn");
    if (failoverBtn) {
      failoverBtn.addEventListener("click", () => {
        if (window.soundFx) window.soundFx.playSuccess();
        if (window.showToast) window.showToast("🛡️ Failover Drill Executed: Primary → Standby Sync verified in <1.2s!");
        this.triggerFailoverAnimation();
      });
    }
  }

  initCanvas() {
    let canvasEl = document.getElementById("topology-flow-canvas");
    if (!canvasEl && this.container) {
      canvasEl = document.createElement("canvas");
      canvasEl.id = "topology-flow-canvas";
      this.container.insertBefore(canvasEl, this.container.firstChild);
    }

    if (canvasEl) {
      this.canvas = canvasEl;
      this.ctx = canvasEl.getContext("2d");
      this.resizeCanvas();
      window.addEventListener("resize", () => this.resizeCanvas());
      this.startParticleAnimation();
    }
  }

  resizeCanvas() {
    if (!this.canvas || !this.container) return;
    this.canvas.width = this.container.clientWidth || 1000;
    this.canvas.height = this.container.clientHeight || 450;
  }

  switchTopology(key) {
    if (!ARCHITECTURE_DATA[key]) return;
    this.currentKey = key;
    this.activeNodeIndex = 0;
    
    this.tabButtons.forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-topology") === key);
    });

    this.render();
  }

  selectNode(index) {
    if (window.soundFx) window.soundFx.playClick();
    this.activeNodeIndex = index;
    this.renderDetails();
    
    const nodeElements = this.container.querySelectorAll(".arch-node");
    nodeElements.forEach((el, idx) => {
      el.classList.toggle("active", idx === index);
    });
  }

  updateTelemetryValues() {
    const data = ARCHITECTURE_DATA[this.currentKey];
    if (!data || !this.container) return;

    data.nodes.forEach((node, idx) => {
      const telEl = this.container.querySelector(`.arch-node[data-index="${idx}"] .arch-node-telemetry span:last-child`);
      if (telEl) {
        telEl.textContent = this.isSpikeMode ? node.telemetrySpike : node.telemetryNormal;
        telEl.style.color = this.isSpikeMode ? "#f97316" : "#10b981";
      }
    });
  }

  triggerFailoverAnimation() {
    const dbNode = this.container.querySelector('.arch-node[data-index="3"]');
    if (dbNode) {
      dbNode.style.boxShadow = "0 0 50px #10b981";
      dbNode.style.borderColor = "#10b981";
      setTimeout(() => {
        dbNode.style.boxShadow = "";
        dbNode.style.borderColor = "";
      }, 1500);
    }
  }

  render() {
    const data = ARCHITECTURE_DATA[this.currentKey];
    if (!data || !this.container) return;

    let html = '<div class="arch-diagram-flow">';

    data.nodes.forEach((node, index) => {
      const isActive = index === this.activeNodeIndex ? "active" : "";
      const telemetry = this.isSpikeMode ? node.telemetrySpike : node.telemetryNormal;

      html += `
        <div class="arch-node ${isActive}" data-index="${index}">
          <div class="arch-node-top">
            <span class="arch-node-badge">${node.badge}</span>
            <div class="arch-node-icon">${node.icon}</div>
          </div>
          <div class="arch-node-title">${node.title}</div>
          <div class="arch-node-desc">${node.desc}</div>
          <div class="arch-node-telemetry">
            <span>● LIVE</span>
            <span style="color: ${this.isSpikeMode ? "#f97316" : "#10b981"}; font-weight:700;">${telemetry}</span>
          </div>
        </div>
      `;

      if (index < data.nodes.length - 1) {
        html += `
          <div class="arch-connector">
            <div class="arch-connector-line"></div>
          </div>
        `;
      }
    });

    html += "</div>";
    
    // Canvas container insertion
    const canvasHtml = '<canvas id="topology-flow-canvas"></canvas>';
    this.container.innerHTML = canvasHtml + html;

    this.initCanvas();

    this.container.querySelectorAll(".arch-node").forEach(el => {
      el.addEventListener("click", () => {
        const idx = parseInt(el.getAttribute("data-index"), 10);
        this.selectNode(idx);
      });
    });

    this.renderDetails();
  }

  renderDetails() {
    const data = ARCHITECTURE_DATA[this.currentKey];
    const node = data.nodes[this.activeNodeIndex];
    if (!this.detailContainer || !node) return;

    const tagsHtml = (node.tags || []).map(t => `
      <span style="font-size:0.72rem; font-family:var(--font-mono); background:rgba(249, 115, 22, 0.15); color:var(--accent-primary); border:1px solid rgba(249, 115, 22, 0.3); padding:2px 8px; border-radius:4px; font-weight:600;">
        ${t}
      </span>
    `).join(" ");

    this.detailContainer.innerHTML = `
      <div style="flex: 1; min-width: 300px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px; flex-wrap:wrap;">
          <span style="font-size: 1.1rem;">${node.icon}</span>
          <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--accent-primary); font-family: var(--font-mono); font-weight: 700;">
            ${node.title} (${node.badge})
          </span>
          <div style="display:flex; gap:6px; margin-left:auto;">
            ${tagsHtml}
          </div>
        </div>
        <div style="color: var(--text-primary); font-size: 0.88rem; line-height: 1.5; margin-top: 6px;">
          ${node.details}
        </div>
      </div>
      <div style="font-size: 0.8rem; font-family: var(--font-mono); color: var(--text-muted); text-align: right;">
        Active System:<br>
        <span style="color: var(--accent-emerald); font-weight: 700;">${data.badge}</span>
      </div>
    `;
  }

  startParticleAnimation() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

    const spawnParticle = () => {
      const nodes = this.container.querySelectorAll(".arch-node");
      if (nodes.length < 2) return;

      const rate = this.isSpikeMode ? 3 : 1;
      for (let r = 0; r < rate; r++) {
        const startNodeIdx = Math.floor(Math.random() * (nodes.length - 1));
        const n1 = nodes[startNodeIdx].getBoundingClientRect();
        const n2 = nodes[startNodeIdx + 1].getBoundingClientRect();
        const parent = this.container.getBoundingClientRect();

        const x1 = n1.right - parent.left;
        const y1 = n1.top + n1.height / 2 - parent.top;
        const x2 = n2.left - parent.left;
        const y2 = n2.top + n2.height / 2 - parent.top;

        this.particles.push({
          x: x1,
          y: y1,
          targetX: x2,
          targetY: y2,
          progress: 0,
          speed: this.isSpikeMode ? (0.025 + Math.random() * 0.02) : (0.012 + Math.random() * 0.008),
          size: Math.random() * 2.5 + 2,
          color: Math.random() > 0.4 ? "#f97316" : "#10b981"
        });
      }
    };

    let tick = 0;
    const animate = () => {
      if (!this.ctx || !this.canvas) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      tick++;
      if (tick % (this.isSpikeMode ? 4 : 10) === 0) {
        spawnParticle();
      }

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.progress += p.speed;

        const currentX = p.x + (p.targetX - p.x) * p.progress;
        const currentY = p.y + (p.targetY - p.y) * p.progress;

        this.ctx.beginPath();
        this.ctx.arc(currentX, currentY, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.shadowColor = p.color;
        this.ctx.shadowBlur = 8;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        if (p.progress >= 1) {
          this.particles.splice(i, 1);
        }
      }

      this.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  }
}

function initTopology() {
  window.topologyVisualizer = new TopologyVisualizer();
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTopology);
} else {
  initTopology();
}
