/**
 * Interactive DBA Diagnostic Lab & Incident Room Simulator
 * Demonstrates deep technical mastery in SQL query optimization, execution plans, and SRE resilience
 */

const DBA_LAB_SCENARIOS = {
  seqscan: {
    title: "10M Row Ledger Table: Sequential Scan vs B-Tree Composite Index",
    engine: "PostgreSQL 16",
    problem: "A monthly financial aggregation query on a 10,000,000 row transaction table takes 4,280ms, triggering CPU spikes and locking connection threads.",
    queryBefore: `SELECT tenant_id, DATE_TRUNC('month', created_at) AS tx_month, 
       SUM(amount) AS total_volume, COUNT(*) AS tx_count
FROM financial_transactions
WHERE tenant_id = 'afpi_node_99' 
  AND created_at >= '2025-01-01' 
  AND status = 'COMPLETED'
GROUP BY 1, 2;`,
    planBefore: `Seq Scan on financial_transactions (cost=0.00..428,940.10 rows=14,200 width=48) (actual time=42.10..4280.45 rows=14,198 loops=1)
  Filter: ((created_at >= '2025-01-01'::date) AND (status = 'COMPLETED'::text) AND (tenant_id = 'afpi_node_99'::text))
  Rows Removed by Filter: 9,985,802
  Buffers: shared hit=8,201 read=342,100
Planning Time: 0.852 ms
Execution Time: 4280.950 ms`,
    timeBefore: "4,280 ms",
    costBefore: "428,940",
    buffersBefore: "342,100 read (Disk I/O Heavy)",
    
    solution: "Created a composite covering B-Tree index with table partitioning by RANGE (created_at). Query now executes an Index-Only Scan with zero table heap lookups.",
    queryAfter: `CREATE INDEX CONCURRENTLY idx_fin_tx_covering 
ON financial_transactions (tenant_id, created_at, status) 
INCLUDE (amount);`,
    planAfter: `Index Only Scan using idx_fin_tx_covering on financial_transactions (cost=0.56..128.40 rows=14,200 width=48) (actual time=0.045..12.310 rows=14,198 loops=1)
  Index Cond: ((tenant_id = 'afpi_node_99'::text) AND (created_at >= '2025-01-01'::date) AND (status = 'COMPLETED'::text))
  Heap Fetches: 0
  Buffers: shared hit=412 read=0
Planning Time: 0.140 ms
Execution Time: 12.450 ms`,
    timeAfter: "12.4 ms",
    costAfter: "128",
    buffersAfter: "412 hit (100% In-Memory Buffer Cache)",
    speedup: "345x Faster (99.7% Latency Drop)"
  },

  deadlock: {
    title: "High-Concurrency Crowdfunding Escrow: Deadlock & Race Condition Elimination",
    engine: "PostgreSQL / Laravel 11",
    problem: "Concurrent investment pledges during rapid campaign oversubscription caused deadlock exceptions (SQLSTATE 40P01) and balance discrepancies in wallet ledgers.",
    queryBefore: `-- Unsafe concurrent updates without deterministic ordering:
BEGIN;
UPDATE campaign_vaults SET current_raised = current_raised + 50000000 WHERE id = 42;
UPDATE user_wallets SET balance = balance - 50000000 WHERE user_id = 9182;
COMMIT;`,
    planBefore: `ERROR: deadlock detected (SQLSTATE 40P01)
Detail: Process 18402 waits for ShareLock on transaction 89102; blocked by process 18409.
Process 18409 waits for ExclusiveLock on tuple (42, 1) of relation "campaign_vaults"; blocked by process 18402.
HINT: See server log for query details.`,
    timeBefore: "Failed (Deadlock Exception)",
    costBefore: "Transaction Rollback",
    buffersBefore: "Connection Blocked",

    solution: "Enforced deterministic resource lock ordering, PostgreSQL Advisory Locks (pg_advisory_xact_lock), and Serializable transaction isolation with automated exponential backoff retry.",
    queryAfter: `BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
-- Acquire deterministic advisory lock for campaign ID:
SELECT pg_advisory_xact_lock(hashtext('campaign_' || 42));

SELECT current_raised, target_cap FROM campaign_vaults WHERE id = 42 FOR UPDATE;
-- Validate balance & execute ledger mutations:
INSERT INTO escrow_ledger_entries (campaign_id, user_id, amount, created_at) VALUES (...);
UPDATE user_wallets SET balance = balance - 50000000 WHERE user_id = 9182;
UPDATE campaign_vaults SET current_raised = current_raised + 50000000 WHERE id = 42;
COMMIT;`,
    planAfter: `Query OK, 3 rows affected (actual time=2.15ms)
Advisory Lock: Granted instantly (Deterministic Hash Key)
Isolation: Serializable (Zero Double-Spending, Zero Rollbacks)
Execution Time: 2.180 ms`,
    timeAfter: "2.18 ms",
    costAfter: "Deterministic",
    buffersAfter: "Zero Race Conditions",
    speedup: "100% Integrity Guaranteed"
  },

  olap: {
    title: "Real-Time BI Analytics: Postgres Aggregation vs ClickHouse Columnar Engine",
    engine: "ClickHouse 24.x + Debezium CDC",
    problem: "Calculating complex multi-dimensional aggregations (retention, cohort analysis, fraud score distributions) over 50M records overwhelmed transactional PostgreSQL instances.",
    queryBefore: `SELECT lender_id, borrower_grade, 
       AVG(credit_score) AS avg_score, 
       COUNT(DISTINCT borrower_nik_hash) AS unique_borrowers
FROM fdc_credit_records
GROUP BY lender_id, borrower_grade
ORDER BY avg_score DESC;`,
    planBefore: `Finalize GroupAggregate (cost=1,829,400.12..1,845,210.40 rows=25,000 width=64) (actual time=6820.10..8410.20 rows=24,890 loops=1)
  -> Gather Merge (cost=1,829,400.12..1,842,100.10 rows=50,000 width=64)
  Workers Planned: 4
  Buffers: shared hit=42,100 read=1,890,200
Execution Time: 8412.500 ms`,
    timeBefore: "8,412 ms",
    costBefore: "1,845,210",
    buffersBefore: "Heavy Disk Swapping",

    solution: "Streamed transaction mutations via Kafka + Debezium into ClickHouse ReplacingMergeTree engine with vectorized SIMD aggregations.",
    queryAfter: `SELECT lender_id, borrower_grade, 
       avg(credit_score) AS avg_score, 
       uniqExact(borrower_nik_hash) AS unique_borrowers
FROM fdc_credit_records_ch
GROUP BY lender_id, borrower_grade
ORDER BY avg_score DESC;`,
    planAfter: `ClickHouse Vector Execution (50,000,000 rows read)
Processed 50.00 million rows, 800.00 MB (2.08 billion rows/s., 33.33 GB/s.)
Peak Memory: 42.10 MiB
Execution Time: 0.024 sec (24.0 ms)`,
    timeAfter: "24.0 ms",
    costAfter: "Vectorized SIMD",
    buffersAfter: "80% Compression Ratio",
    speedup: "350x Faster Execution"
  },

  pgbouncer: {
    title: "Connection Pool Starvation: Raw Connections vs PgBouncer Transaction Multiplexing",
    engine: "PgBouncer + PostgreSQL 16",
    problem: "A burst of 15,000 microservice worker connections exhausted PostgreSQL max_connections (500), causing backend 503 errors and memory thrashing.",
    queryBefore: `-- Direct connection per worker thread:
max_connections = 500;
-- 15,000 microservice clients attempting concurrent connections:
FATAL: remaining connection slots are reserved for non-replication superuser connections
Server RAM consumed: 98% (Process-per-connection fork overhead)`,
    planBefore: `Connection Latency: 140ms (TCP handshake + process fork)
Postgres Worker PIDs: 500/500 (Max Capacity Reached)
Connection Starvation Rate: 78% of incoming requests dropped`,
    timeBefore: "140ms / Connection",
    costBefore: "500 Max Conns Limit",
    buffersBefore: "RAM 98% Exhausted",

    solution: "Deployed PgBouncer in transaction pooling mode with dynamic client connection multiplexing, pre-warmed backend pools, and SO_REUSEPORT.",
    queryAfter: `[databases]
* = host=127.0.0.1 port=5432 auth_user=pgbouncer

[pgbouncer]
pool_mode = transaction
max_client_conn = 25000
default_pool_size = 50
reserve_pool_size = 10
query_wait_timeout = 5`,
    planAfter: `Active Client Connections: 15,000 concurrent
Backend Postgres Connections: 50 persistent connections
Server RAM consumed: 14% (Zero process fork overhead)
Throughput: 28,500 req/sec multiplexed seamlessly`,
    timeAfter: "0.8ms Overhead",
    costAfter: "25,000 Max Client Conns",
    buffersAfter: "RAM 14% Stable",
    speedup: "175x Connection Throughput"
  }
};

class DBALab {
  constructor() {
    this.currentKey = "seqscan";
    this.isOptimized = false;
    this.isExecuting = false;

    this.container = document.getElementById("dba-lab-container");
    this.scenarioSelect = document.getElementById("dba-scenario-select");
    this.runBtn = document.getElementById("dba-run-btn");
    this.toggleOptimizeBtn = document.getElementById("dba-toggle-optimize-btn");

    this.init();
  }

  init() {
    if (!this.container) return;

    if (this.scenarioSelect) {
      this.scenarioSelect.addEventListener("change", (e) => {
        this.currentKey = e.target.value;
        this.isOptimized = false;
        if (window.soundFx) window.soundFx.playClick();
        this.render();
      });
    }

    if (this.runBtn) {
      this.runBtn.addEventListener("click", () => this.runSimulation());
    }

    if (this.toggleOptimizeBtn) {
      this.toggleOptimizeBtn.addEventListener("click", () => {
        this.isOptimized = !this.isOptimized;
        if (window.soundFx) window.soundFx.playSuccess();
        this.render();
      });
    }

    this.render();
  }

  runSimulation() {
    if (this.isExecuting) return;
    this.isExecuting = true;

    if (window.soundFx) window.soundFx.playClick();
    const btnText = this.runBtn.querySelector("span");
    if (btnText) btnText.textContent = "⚡ Running EXPLAIN ANALYZE...";
    this.runBtn.disabled = true;

    const meterEl = document.getElementById("dba-gauge-fill");
    if (meterEl) {
      meterEl.style.width = "10%";
      meterEl.style.transition = "width 0.4s ease";
      setTimeout(() => { meterEl.style.width = "75%"; }, 300);
    }

    setTimeout(() => {
      this.isExecuting = false;
      this.runBtn.disabled = false;
      if (btnText) btnText.textContent = "🚀 Re-run Benchmark";
      if (window.soundFx) window.soundFx.playSuccess();
      if (window.showToast) {
        const data = DBA_LAB_SCENARIOS[this.currentKey];
        window.showToast(this.isOptimized ? `Benchmark Completed: ${data.timeAfter} (${data.speedup})` : `Unoptimized Query Finished: ${data.timeBefore}`);
      }
      this.render();
    }, 900);
  }

  render() {
    const data = DBA_LAB_SCENARIOS[this.currentKey];
    if (!data) return;

    // Elements
    const titleEl = document.getElementById("dba-scenario-title");
    const engineEl = document.getElementById("dba-engine-badge");
    const problemEl = document.getElementById("dba-problem-desc");
    const queryCodeEl = document.getElementById("dba-query-code");
    const planOutputEl = document.getElementById("dba-plan-output");
    const latencyMetricEl = document.getElementById("dba-metric-latency");
    const costMetricEl = document.getElementById("dba-metric-cost");
    const bufferMetricEl = document.getElementById("dba-metric-buffers");
    const speedupBadgeEl = document.getElementById("dba-speedup-badge");
    const solutionDescEl = document.getElementById("dba-solution-desc");

    if (titleEl) titleEl.textContent = data.title;
    if (engineEl) engineEl.textContent = data.engine;
    if (problemEl) problemEl.textContent = data.problem;

    if (queryCodeEl) {
      queryCodeEl.textContent = this.isOptimized ? data.queryAfter : data.queryBefore;
    }

    if (planOutputEl) {
      planOutputEl.textContent = this.isOptimized ? data.planAfter : data.planBefore;
    }

    if (latencyMetricEl) {
      latencyMetricEl.textContent = this.isOptimized ? data.timeAfter : data.timeBefore;
      latencyMetricEl.style.color = this.isOptimized ? "var(--accent-emerald)" : "#f43f5e";
    }

    if (costMetricEl) {
      costMetricEl.textContent = this.isOptimized ? data.costAfter : data.costBefore;
    }

    if (bufferMetricEl) {
      bufferMetricEl.textContent = this.isOptimized ? data.buffersAfter : data.buffersBefore;
    }

    if (speedupBadgeEl) {
      speedupBadgeEl.textContent = this.isOptimized ? `⚡ ${data.speedup}` : "⚠️ UNOPTIMIZED WORKLOAD";
      speedupBadgeEl.style.background = this.isOptimized ? "rgba(16, 185, 129, 0.15)" : "rgba(244, 63, 94, 0.15)";
      speedupBadgeEl.style.color = this.isOptimized ? "var(--accent-emerald)" : "var(--accent-rose)";
      speedupBadgeEl.style.borderColor = this.isOptimized ? "rgba(16, 185, 129, 0.3)" : "rgba(244, 63, 94, 0.3)";
    }

    if (solutionDescEl) {
      solutionDescEl.innerHTML = this.isOptimized ? `<strong>Heri's Optimization:</strong> ${data.solution}` : `<strong>Bottleneck Diagnosis:</strong> Click <em>"Apply Optimization"</em> to see Heri's index tuning and architecture refactor.`;
    }

    if (this.toggleOptimizeBtn) {
      const toggleSpan = this.toggleOptimizeBtn.querySelector("span");
      if (toggleSpan) {
        toggleSpan.textContent = this.isOptimized ? "↩ View Unoptimized Raw Query" : "⚡ Apply Heri's DB Optimization";
      }
      this.toggleOptimizeBtn.classList.toggle("btn-primary", !this.isOptimized);
      this.toggleOptimizeBtn.classList.toggle("btn-secondary", this.isOptimized);
    }
  }
}

// ----------------------------------------------------
// Production SRE Incident Room Simulator
// ----------------------------------------------------
class SREIncidentRoom {
  constructor() {
    this.currentStep = 0;
    this.isRunning = false;
    this.init();
  }

  init() {
    const triggerBtn = document.getElementById("sre-drill-trigger-btn");
    if (triggerBtn) {
      triggerBtn.addEventListener("click", () => this.runDrill());
    }
  }

  runDrill() {
    if (this.isRunning) return;
    this.isRunning = true;

    if (window.soundFx) window.soundFx.playClick();
    const btn = document.getElementById("sre-drill-trigger-btn");
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = "<span>⚡ Executing Automated Playbook...</span>";
    }

    const steps = [
      { step: 1, title: "🛡️ Perimeter Firewall: Rate Limiting & FortiGate ACL Filter Activated", delay: 800 },
      { step: 2, title: "🏊 Connection Pool Guard: PgBouncer Isolates High-Volume Threads", delay: 1600 },
      { step: 3, title: "🔒 UU PDP Privacy Shield: Dynamic PII Masking Enforced on Telemetry", delay: 2400 },
      { step: 4, title: "💾 High Availability Sync: DRC Node Synchronized (0 Data Loss, RPO <15s)", delay: 3200 },
      { step: 5, title: "✅ 100% HEALTH RESTORED: All 100+ Fintech Nodes Operating at <1.2ms SLA", delay: 4000 }
    ];

    const logsContainer = document.getElementById("sre-live-logs");
    if (logsContainer) {
      logsContainer.innerHTML = `<div style="color: var(--accent-primary); font-family: var(--font-mono); font-size: 0.78rem;">[${new Date().toLocaleTimeString()}] INITIATING SRE RESILIENCE DRILL...</div>`;
    }

    steps.forEach(({ title, delay }, idx) => {
      setTimeout(() => {
        if (logsContainer) {
          const logItem = document.createElement("div");
          logItem.style.fontFamily = "var(--font-mono)";
          logItem.style.fontSize = "0.78rem";
          logItem.style.marginTop = "4px";
          logItem.style.color = idx === steps.length - 1 ? "var(--accent-emerald)" : "var(--text-primary)";
          logItem.textContent = `[${new Date().toLocaleTimeString()}] ${title}`;
          logsContainer.appendChild(logItem);
          logsContainer.scrollTop = logsContainer.scrollHeight;
        }

        if (window.soundFx) window.soundFx.playSuccess();

        if (idx === steps.length - 1) {
          this.isRunning = false;
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = "<span>🔄 Re-Simulate SRE Resilience Drill</span>";
          }
          if (window.showToast) window.showToast("Incident Resolution Playbook Executed Successfully!");
        }
      }, delay);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.dbaLab = new DBALab();
  window.sreIncidentRoom = new SREIncidentRoom();
});
