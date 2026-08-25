/**
 * Interactive System Topology & Architecture Visualizer
 */

const ARCHITECTURE_DATA = {
  afpi: {
    title: "AFPI National Fintech Data Center (FDC) — ISO/IEC 27001:2022 & UU PDP",
    badge: "ISO 27001:2022 & POJK 10/2022 Compliant",
    description: "National data hub connecting 100+ licensed P2P fintech lenders with ISO 27001:2022 security controls, UU PDP data masking, tamper-resistant audit logs (5-yr retention), and secondary DRC site.",
    nodes: [
      {
        id: "fintech-nodes",
        badge: "SOURCE",
        title: "100+ P2P Fintech Nodes",
        desc: "POJK 10/2022 regulated credit inquiries & deduplication",
        details: "Transmits encrypted borrower records and credit inquiries via mutual TLS (mTLS) with token-based authorization and rate limiters."
      },
      {
        id: "vpn-edge",
        badge: "SECURITY EDGE",
        title: "FortiGate + IPsec VPN",
        desc: "AES-256 StrongSwan & Fortinet Firewall (A.8.24)",
        details: "Encrypted site-to-site IPsec tunnels with strict ingress/egress filtering, IP whitelisting per licensed member, and DDoS protection."
      },
      {
        id: "ingest-backend",
        badge: "COMPUTE",
        title: "Ingestion & Data Masking",
        desc: "Go & Python ETL + UU PDP PII Masking (A.8.11)",
        details: "Executes dynamic data masking on NIK KTP, phone numbers, and financial ledgers, ensuring compliance with UU No. 27/2022 (UU PDP)."
      },
      {
        id: "db-ha",
        badge: "STORAGE",
        title: "Postgres & MySQL HA + DRC",
        desc: "Primary-Standby Replication & DRC Site (POJK 10/2022)",
        details: "Encrypted tablespaces (AES-256) with continuous streaming replication to secondary DRC site in Indonesia (RPO < 15m, RTO < 1h, 99.9% SLA)."
      },
      {
        id: "audit-logs",
        badge: "AUDIT LOGS",
        title: "Audit Trail & Telemetry",
        desc: "pgAudit + 5-Year Log Retention & Grafana (A.8.15)",
        details: "Tamper-resistant centralized audit logging recording all DDL/DML, RBAC matrix reviews, and real-time Prometheus/Grafana SLA telemetry."
      }
    ]
  },
  cdc: {
    title: "Universal OLTP-to-OLAP Real-Time CDC Pipeline",
    badge: "Sub-Second Analytical Latency",
    description: "Zero-impact Change Data Capture pipeline streaming transaction mutations from multiple RDBMS into ClickHouse for fast analytics.",
    nodes: [
      {
        id: "oltp-sources",
        badge: "OLTP SYSTEMS",
        title: "Multi-RDBMS Sources",
        desc: "PostgreSQL, MySQL & SQL Server",
        details: "Captures row-level INSERT, UPDATE, DELETE changes without impacting production read/write workloads."
      },
      {
        id: "debezium",
        badge: "CDC CONNECTOR",
        title: "Debezium Engine",
        desc: "WAL & Binlog stream parser",
        details: "Converts database transaction logs into serialized Kafka event records with full before/after snapshots."
      },
      {
        id: "kafka",
        badge: "MESSAGE BROKER",
        title: "Apache Kafka Cluster",
        desc: "Distributed partitioned event topics",
        details: "Guarantees at-least-once message delivery, backpressure handling, and horizontal stream scalability."
      },
      {
        id: "clickhouse",
        badge: "OLAP ENGINE",
        title: "ClickHouse Database",
        desc: "Columnar storage with ReplacingMergeTree",
        details: "Executes analytical aggregations across 100M+ rows in under 20 milliseconds."
      },
      {
        id: "bi-dashboards",
        badge: "CONSUMERS",
        title: "Real-Time BI & APIs",
        desc: "Grafana, Metabase & REST APIs",
        details: "Live operational dashboards providing instant business intelligence with zero lag."
      }
    ]
  },
  ddag: {
    title: "DDAG (Zero-Trust Multi-Dialect API Gateway)",
    badge: "High-Throughput Go Engine",
    description: "Dynamically exposes SQL databases as secure REST APIs with granular RBAC, connection pooling, and parameter sanitization.",
    nodes: [
      {
        id: "clients",
        badge: "CLIENTS",
        title: "Consumers & Services",
        desc: "Web, mobile apps & third-party webhooks",
        details: "Sends standard REST HTTP requests with Bearer JWT tokens."
      },
      {
        id: "ddag-core",
        badge: "API GATEWAY",
        title: "DDAG Core (Go)",
        desc: "Routing, Token Auth & Query Parser",
        details: "Zero-trust parameter sanitization preventing SQL injections and validating route-level ACL permissions."
      },
      {
        id: "pooler",
        badge: "CONNECTION POOL",
        title: "Smart Connection Pool",
        desc: "PgBouncer & Dialect Connection Multiplexer",
        details: "Reuses database connections efficiently to sustain thousands of concurrent queries without exhaustion."
      },
      {
        id: "target-db",
        badge: "RDBMS",
        title: "Target Relational DBs",
        desc: "Postgres, Oracle, MSSQL, MySQL",
        details: "Dynamic schema reflection allows seamless query execution across heterogeneous database engines."
      },
      {
        id: "audit-trace",
        badge: "AUDIT LOGS",
        title: "Audit & Telemetry",
        desc: "Structured JSON access logs & tracing",
        details: "Records full audit trails for compliance with security policies and performance debugging."
      }
    ]
  }
};

class TopologyVisualizer {
  constructor() {
    this.currentKey = "afpi";
    this.activeNodeIndex = 0;
    this.container = document.getElementById("topology-canvas-wrap");
    this.detailContainer = document.getElementById("topology-detail-panel");
    this.tabButtons = document.querySelectorAll(".topology-tab-btn");
    
    this.init();
  }

  init() {
    this.tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        if (window.soundFx) window.soundFx.playClick();
        const key = btn.getAttribute("data-topology");
        this.switchTopology(key);
      });
    });

    this.render();
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

  render() {
    const data = ARCHITECTURE_DATA[this.currentKey];
    if (!data || !this.container) return;

    let html = "<div class=\"arch-diagram-flow\">";

    data.nodes.forEach((node, index) => {
      const isActive = index === this.activeNodeIndex ? "active" : "";
      const icons = {
        "SOURCE": "⚡",
        "SECURITY EDGE": "🛡️",
        "COMPUTE": "⚙️",
        "STORAGE": "💾",
        "OBSERVABILITY": "📊",
        "OLTP SYSTEMS": "🗄️",
        "CDC CONNECTOR": "🔄",
        "MESSAGE BROKER": "📨",
        "OLAP ENGINE": "🚀",
        "CONSUMERS": "📈",
        "CLIENTS": "🌐",
        "API GATEWAY": "⚡",
        "CONNECTION POOL": "🏊",
        "RDBMS": "💾",
        "AUDIT LOGS": "📋"
      };
      const icon = icons[node.badge] || "🔷";

      html += `
        <div class="arch-node ${isActive}" data-index="${index}">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span class="arch-node-badge">${node.badge}</span>
            <span style="font-size:1.1rem;">${icon}</span>
          </div>
          <div class="arch-node-title">${node.title}</div>
          <div class="arch-node-desc">${node.desc}</div>
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
    this.container.innerHTML = html;

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

    this.detailContainer.innerHTML = `
      <div>
        <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--accent-cyan); font-family: var(--font-mono); font-weight: 600;">
          Component Details: <strong>${node.title}</strong> (${node.badge})
        </div>
        <div style="color: var(--text-primary); font-weight: 500; margin-top: 4px;">
          ${node.details}
        </div>
      </div>
      <div style="font-size: 0.8rem; font-family: var(--font-mono); color: var(--text-muted);">
        System: <span style="color: var(--accent-primary); font-weight: 600;">${data.title}</span>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.topologyVisualizer = new TopologyVisualizer();
});
