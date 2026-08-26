/**
 * Cybernetic System Topology & Architecture Visualizer
 * Includes Live Particle Canvas Streamer, Telemetry Simulator & Failover Drills
 */

const ARCHITECTURE_DATA = {
  afpi: {
    title: "AFPI National Fintech Data Center (FDC) — ISO/IEC 27001:2022 & UU PDP",
    badge: "Dual Ingress (SFTP & API) • Fail2ban Shield • .NET EOD @ 03:00 (siktemp) • Dedicated Audit DB • Periodic Reporting (PHP/Shell)",
    description: "National credit federator connecting 100+ licensed P2P lenders over AES-256 IPsec VPN. Dual-ingress architecture: Fail2ban-shielded SFTP zip CSV batch ingestion validated by .NET into staging table `siktemp` for nightly 03:00 EOD ETL & dynamic PII masking, alongside real-time Inquiry API with a dedicated isolated hit-audit database and separate periodic reporting server running daily, weekly, and monthly regulatory jobs via PHP, Shell, and PostgreSQL.",
    nodes: [
      {
        id: "fintech-vpn",
        badge: "TIER 1 // PERIMETER",
        icon: "🛡️",
        title: "100+ Fintech & FortiGate IPsec",
        desc: "Dual-Tunnel AES-256-GCM & Ingress Whitelisting (A.8.24)",
        telemetryNormal: "100+ Platforms • 0 Dropped",
        telemetrySpike: "DDoS Mitigation Active • <0.5ms Jitter",
        tags: ["FortiGate UTM", "StrongSwan IPsec", "AES-256-GCM", "ISO 27001 A.8.24"],
        details: "Hardware-accelerated Fortinet FortiGate cluster & StrongSwan IPsec VPN terminating encrypted site-to-site tunnels across 100+ licensed P2P lenders. Enforces strict IP source whitelisting per member, egress firewall rules, mutual authentication (mTLS), and anti-DDoS perimeter flood protections."
      },
      {
        id: "dual-ingress",
        badge: "TIER 2 // DUAL INGRESS",
        icon: "⚡",
        title: "SFTP & API Servers + Fail2ban",
        desc: "Isolated Ingress Nodes & Anomaly Jail Shield",
        telemetryNormal: "3,850 req/s • Fail2ban Clean",
        telemetrySpike: "Fail2ban Banned 48 IPs (Brute-Force Blocked)",
        tags: ["Chrooted SFTP", "Query API Gateway", "Fail2ban Jail", "UU PDP Protection"],
        details: "Physically and logically segregated ingress server pool protected by Fail2ban dynamic jail filters to auto-block suspicious IP anomalies, port probes, and brute-force attempts. Houses chrooted SFTP servers for raw compressed zip batch ingestion alongside real-time query API gateways under strict tenant rate limits."
      },
      {
        id: "dedicated-audit-db",
        badge: "TIER 3 // AUDIT ISOLATION",
        icon: "📋",
        title: "Dedicated API Hit-Audit Database",
        desc: "100% Request Hash, Token & PII Audit Log",
        telemetryNormal: "100% Inquiries Logged • WORM Trace",
        telemetrySpike: "High-Speed Append • 0 Latency on API",
        tags: ["pgAudit Engine", "Dedicated DB", "5-Year Retention", "UU No. 27/2022"],
        details: "Independent dedicated PostgreSQL database instance decoupled from production OLTP, recording 100% of API query hits, requester tokens, client IPs, timestamp hashes, and PII access trails. Guarantees tamper resistance and 5-year immutable audit retention for OJK and ISO/IEC 27001:2022 (A.8.15) compliance."
      },
      {
        id: "dotnet-eod",
        badge: "TIER 4 // BATCH & ETL CORE",
        icon: "⚙️",
        title: ".NET Ingest ➔ siktemp ➔ EOD @ 03:00",
        desc: "ZIP CSV Validate, Staging & Nightly PII Masking",
        telemetryNormal: "ZIP Validated • siktemp Ingested",
        telemetrySpike: "EOD Batch Run @ 03:00 WIB (Cleansing Active)",
        tags: [".NET Core Daemon", "siktemp Staging Table", "EOD Batch @ 03:00", "Dynamic PII Masking"],
        details: "Automated .NET backend daemon listening on incoming SFTP drops, executing integrity validations, checksum evaluations, and decompression of raw CSV archives directly into staging tables (`siktemp`). At 03:00 AM daily, the scheduled End-of-Day (EOD) batch engine triggers heavy data cleansing, cross-platform borrower deduplication, dynamic PII masking (NIK KTP/Phone hashing under UU PDP), and credit scoring transformations."
      },
      {
        id: "db-cluster",
        badge: "TIER 5 // CORE STORAGE & DRC",
        icon: "💾",
        title: "PostgreSQL HA Master & DRC Site",
        desc: "Streaming Replication, Encrypted TDE & PITR",
        telemetryNormal: "99.98% SLA • RPO <15m",
        telemetrySpike: "DRC Streaming Active • RTO <1h",
        tags: ["Postgres Primary-Standby", "TDE AES-256", "DRC Site (Indonesia)", "POJK 10/2022"],
        details: "Enterprise High-Availability PostgreSQL cluster with primary-standby streaming replication and automated failover drills. Houses consolidated borrower ledgers and historical credit performance with table partitioning. Synchronizes continuous WAL archives to a geographically separated Disaster Recovery Center (DRC) in Indonesia to ensure RPO < 15 mins and RTO < 1 hour in compliance with POJK No. 10/POJK.05/2022."
      },
      {
        id: "reporting-server",
        badge: "TIER 6 // REPORTING SERVER",
        icon: "📊",
        title: "Dedicated Periodic Reporting Server",
        desc: "PHP CLI + Shell Scripts + PL/pgSQL Stored Procedures",
        telemetryNormal: "Cron Schedulers Active • 0 OLTP Contention",
        telemetrySpike: "Monthly OJK Compliance Digest Compiled",
        tags: ["PHP Batch Engine", "Shell Automation", "PL/pgSQL Procedures", "OJK Regulatory Reports"],
        details: "Completely isolated dedicated reporting server running automated cron schedules: Daily (disbursement & default reconciliation), Weekly (cross-platform borrower exposure matrix), and Monthly (OJK regulatory compliance digests and national AFPI industry health indicators). Engineered with PHP CLI scripts, optimized Shell automations, and PostgreSQL analytical stored procedures."
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
  },
  paspapan: {
    title: "PasPapan (Enterprise HRIS, Anti-Mock GPS & 1-Click Payroll Engine)",
    badge: "Capacitor + Laravel 13 & Reverb • PostgreSQL HA",
    description: "High-concurrency enterprise workforce operations platform with Anti-Mock GPS radar, Face ID biometric recognition, real-time Laravel Reverb WebSockets, automated 1-click multi-branch payroll calculation, and high-availability database replication.",
    nodes: [
      {
        id: "mobile-nodes",
        badge: "MOBILE / CLIENT",
        icon: "📱",
        title: "Capacitor Mobile & Livewire PWA",
        desc: "Native Android/iOS wrapper & Livewire 4 interface",
        telemetryNormal: "12,500 Check-ins/m • <400ms",
        telemetrySpike: "45,000 Rush Ingest • 0 Drop",
        tags: ["Capacitor APK", "Livewire 4", "Dynamic QR"],
        details: "High-frequency attendance check-in streams supporting Face ID, photo verification, dynamic QR codes, and static barcodes with offline caching resilience."
      },
      {
        id: "edge-validator",
        badge: "RISK SCORING",
        icon: "🛡️",
        title: "Attendance Risk Scoring & Geofence",
        desc: "Mock Location Provider Detection & Boundary Check",
        telemetryNormal: "0 Spoof Passed • 0.3ms Overhead",
        telemetrySpike: "Strict Geo-Filter Active • 0 Leak",
        tags: ["Anti-Mock GPS", "Geofence Radius", "Device Context"],
        details: "Multi-layered risk scoring evaluating mock location provider flags, geofenced office radiuses, device contexts, and out-of-shift time anomalies."
      },
      {
        id: "payroll-engine",
        badge: "PROCESSING CORE",
        icon: "⚙️",
        title: "Laravel Queue & Reverb WebSockets",
        desc: "Async Horizon Workers & Reusable Approval Matrix",
        telemetryNormal: "1,800 Batches/s • 0 Lag",
        telemetrySpike: "Async Horizon Queue • 100% Synced",
        tags: ["Laravel 13", "Laravel Reverb", "1-Click Payroll"],
        details: "Asynchronous queue workers executing multi-tier tax formulas (PPh 21, BPJS), attendance deductions, overtime calculations, instant payslips, and real-time Reverb WebSocket broadcasts."
      },
      {
        id: "clustered-db",
        badge: "STORAGE & CACHE",
        icon: "💾",
        title: "PostgreSQL HA / MySQL + Redis",
        desc: "Read-Write Splitting & In-Memory Redis Cache",
        telemetryNormal: "99.98% Uptime • 1.2ms Query",
        telemetrySpike: "Read Replica Balanced",
        tags: ["Postgres-First", "Redis Sentinel", "ACID Compliance"],
        details: "Enterprise relational database cluster utilizing read-write connection splitting and Redis Sentinel caching to sustain peak morning attendance rushes without I/O contention."
      },
      {
        id: "bi-hub",
        badge: "OPERATIONAL HUB",
        icon: "📊",
        title: "Health & Multi-Branch Dashboard",
        desc: "Real-Time System Health, HR Tasks & Ledger",
        telemetryNormal: "Health: Optimal • 0 Discrepancy",
        telemetrySpike: "Instant Export (<1.5s)",
        tags: ["Health Monitor", "HR Checklists", "Financial Ledger"],
        details: "Centralized operational health dashboard tracking queue workers, schedulers, backups, and disk metrics alongside multi-branch HR onboarding and payroll disbursement ledgers."
      }
    ]
  },
  wargahub: {
    title: "WargaHub (Civic Governance & Embedded WASM Ledger System)",
    badge: "Vue 3 PWA + Fastify 5 • Embedded PGlite WASM",
    description: "Modern civic information and transparent financial management platform for RT/RW neighborhoods, combining Fastify Node.js backends with offline-first client-side PostgreSQL (PGlite WASM) for zero-discrepancy public bookkeepings.",
    nodes: [
      {
        id: "warga-clients",
        badge: "OFFLINE-FIRST PWA",
        icon: "📱",
        title: "Vue 3 PWA & Pinia Client",
        desc: "Bun Monorepo with ServiceWorker & IndexedDB",
        telemetryNormal: "Offline First • 0ms UI Latency",
        telemetrySpike: "Instant PWA Load • ServiceWorker",
        tags: ["Vue 3", "Vite PWA", "Bun Monorepo"],
        details: "Progressive Web Application allowing residents and community leaders to browse public information, submit digital letters, and record dues even without active internet connectivity."
      },
      {
        id: "pglite-wasm",
        badge: "CLIENT DATABASE",
        icon: "⚡",
        title: "Embedded PGlite (WASM Database)",
        desc: "Client-side in-browser PostgreSQL execution",
        telemetryNormal: "0.4ms Local Query • 0 Roundtrip",
        telemetrySpike: "Sub-millisecond WASM SQL",
        tags: ["PGlite WASM", "IndexedDB", "In-Browser SQL"],
        details: "Full PostgreSQL database running inside client browser WebAssembly, executing local relational queries and maintaining cryptographic financial hashes without server roundtrips."
      },
      {
        id: "fastify-gateway",
        badge: "API GATEWAY",
        icon: "⚙️",
        title: "Fastify 5 REST API & Zod Contracts",
        desc: "High-throughput asynchronous synchronizer",
        telemetryNormal: "3,200 req/s • 0.8ms Overhead",
        telemetrySpike: "11,000 req/s • Conflict-Free Sync",
        tags: ["Fastify 5", "Zod Validation", "OpenAPI"],
        details: "Ultra-fast asynchronous REST API handling bi-directional data synchronizations, role-based authorization for neighborhood administrators, and public announcement broadcasts."
      },
      {
        id: "master-pg",
        badge: "MASTER STORAGE",
        icon: "💾",
        title: "PostgreSQL Master (Append-Only)",
        desc: "ACID Transparent Ledger & Row-Level Security",
        telemetryNormal: "100% Integrity • RPO 0",
        telemetrySpike: "Replication Synced",
        tags: ["PostgreSQL", "Row-Level Security", "Reversals"],
        details: "Central relational database enforcing Row-Level Security (RLS) per RT/RW tenant, append-only cashbook mutations, transaction reversals, and immutable receipt audit trails."
      },
      {
        id: "public-ledger",
        badge: "TRANSPARENT HUB",
        icon: "📋",
        title: "Public Transparency & Citizen Desk",
        desc: "Real-Time Budget Transparency & Digital Musyawarah",
        telemetryNormal: "100% Transparan • 0 Selisih",
        telemetrySpike: "Live Consensus Verified",
        tags: ["Public Cashbook", "Digital Letters", "WhatsApp Notify"],
        details: "Publicly accessible real-time transparency dashboard allowing community members to audit neighborhood budget inflows/outflows, CCTV streams, and digital musyawarah voting."
      }
    ]
  },
  openorg: {
    title: "OpenOrg (Organization Governance Platform & Headless CMS)",
    badge: "Next.js 16 + Fastify 5 & Caddy v2 • PostgreSQL 17",
    description: "Single-tenant enterprise organization management platform with digital membership IDs (KTA), accredited SKP academy credentialing, multi-tier governance hierarchy, and SHA-256 verifiable certificates.",
    nodes: [
      {
        id: "portal-clients",
        badge: "PORTAL CLIENTS",
        icon: "🌐",
        title: "Next.js 16 Web & React CMS Studio",
        desc: "App Router public portal & Vite/React CMS Studio",
        telemetryNormal: "4,600 req/s • Global CDN",
        telemetrySpike: "16,000 req/s • 0 Degradation",
        tags: ["Next.js 16", "React 19", "OKLCH Engine"],
        details: "Public-facing and member web portals accepting instant QR code credential verifications, academy enrollment requests, and real-time database-persisted OKLCH theme customization."
      },
      {
        id: "rbac-shield",
        badge: "SECURITY EDGE",
        icon: "🛡️",
        title: "Caddy v2 Proxy & GovernOS Shield",
        desc: "Automated Let's Encrypt TLS & Multi-Tier RBAC",
        telemetryNormal: "Route ACL Checked • 0.2ms",
        telemetrySpike: "Role-Level Strict Isolation",
        tags: ["Caddy v2 TLS", "Argon2id Auth", "Multi-Tier RBAC"],
        details: "Automated HTTPS reverse proxy enforcing Argon2id password hashing, opaque sessions, and hierarchical organizational trees (DPP, DPD, DPC, Korwil, Ethics Committee)."
      },
      {
        id: "skp-engine",
        badge: "CREDENTIAL CORE",
        icon: "⚙️",
        title: "Fastify 5 API & ComplyFlow Engine",
        desc: "Drizzle ORM, Zod & Automated SKP Credit Scoring",
        telemetryNormal: "SHA-256 Signed • <150ms",
        telemetrySpike: "Batch Cert Generation Active",
        tags: ["Fastify 5", "Drizzle ORM", "ComplyFlow"],
        details: "Core business logic service managing BNSP certifications, computing CPD/SKP training credits, issuing digital KTA cards, and minting tamper-resistant PDF certificates."
      },
      {
        id: "doc-storage",
        badge: "ENTERPRISE STORAGE",
        icon: "💾",
        title: "PostgreSQL 17 Master Database",
        desc: "Drizzle ORM Schemas, Dynamic Themes & Audit Ledger",
        telemetryNormal: "100% Data Integrity • WORM",
        telemetrySpike: "Indexing Optimized • 8ms Query",
        tags: ["PostgreSQL 17", "Drizzle Schema", "JSONB Models"],
        details: "High-availability PostgreSQL 17 cluster storing dynamic headless CMS content models, verified technician directories, public complaint tickets, and cryptographic certificate hashes."
      },
      {
        id: "hash-verifier",
        badge: "VERIFICATION HUB",
        icon: "🔍",
        title: "ComplyFlow QR Verifier & Public Hub",
        desc: "Instant Public QR Validation & Anti-Forgery Check",
        telemetryNormal: "Hash Validated • 0 Fake Pass",
        telemetrySpike: "Anti-Tamper Signature Confirmed",
        tags: ["Public /verify", "QR Validation", "Anti-Forgery"],
        details: "Public verification portal (`/verify`) validating cryptographic QR tokens against immutable database hashes, accompanied by public technicians directories and ethics desks."
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
    const nodes = this.container.querySelectorAll('.arch-node');
    let dbNode = null;
    nodes.forEach(node => {
      const badge = node.querySelector('.arch-node-badge');
      if (badge && (badge.textContent.includes('STORAGE') || badge.textContent.includes('DB') || badge.textContent.includes('CORE'))) {
        dbNode = node;
      }
    });
    if (!dbNode && nodes.length > 3) dbNode = nodes[3];
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
