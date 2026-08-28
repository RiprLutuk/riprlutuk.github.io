/**
 * Enterprise DBA & Cloud Cost Savings ROI Calculator
 * Calculates estimated infrastructure cost reduction, query speedup & provides actionable export summaries
 */

class ROICalculator {
  constructor() {
    this.dbSizeInput = document.getElementById("roi-db-size");
    this.spendInput = document.getElementById("roi-cloud-spend");
    this.latencyInput = document.getElementById("roi-query-latency");

    this.dbSizeVal = document.getElementById("roi-db-size-val");
    this.spendVal = document.getElementById("roi-cloud-spend-val");
    this.latencyVal = document.getElementById("roi-query-latency-val");

    this.savingsMonthEl = document.getElementById("roi-savings-month");
    this.savingsYearEl = document.getElementById("roi-savings-year");
    this.latencyOptimizedEl = document.getElementById("roi-latency-optimized");
    this.speedupRatioEl = document.getElementById("roi-speedup-ratio");
    this.telegramLinkEl = document.getElementById("roi-telegram-cta");
    this.emailLinkEl = document.getElementById("roi-email-cta");
    this.copyReportBtn = document.getElementById("roi-copy-report-btn");

    // Breakdown metrics
    this.computeCutEl = document.getElementById("roi-compute-cut");
    this.iopsCutEl = document.getElementById("roi-iops-cut");
    this.olapCutEl = document.getElementById("roi-olap-cut");

    this.currentData = null;

    this.init();
  }

  init() {
    if (!this.dbSizeInput || !this.spendInput || !this.latencyInput) return;

    const updateHandler = () => this.calculate();

    this.dbSizeInput.addEventListener("input", updateHandler);
    this.spendInput.addEventListener("input", updateHandler);
    this.latencyInput.addEventListener("input", updateHandler);

    // Bind 1-Click Client Preset Scenarios
    const presetBtns = document.querySelectorAll(".roi-preset-btn");
    presetBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const dbSize = btn.getAttribute("data-dbsize");
        const spend = btn.getAttribute("data-spend");
        const latency = btn.getAttribute("data-latency");

        if (this.dbSizeInput && dbSize) this.dbSizeInput.value = dbSize;
        if (this.spendInput && spend) this.spendInput.value = spend;
        if (this.latencyInput && latency) this.latencyInput.value = latency;

        presetBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        if (window.soundFx) window.soundFx.playSuccess();
        this.calculate();
        if (window.showToast) window.showToast(`Applied Preset: ${btn.textContent.trim()}`);
      });
    });

    if (this.copyReportBtn) {
      this.copyReportBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.copyAuditReport();
      });
    }

    this.calculate();
  }

  calculate() {
    const dbSize = parseFloat(this.dbSizeInput.value) || 2; // TB
    const spend = parseFloat(this.spendInput.value) || 3500; // USD/mo
    const latency = parseFloat(this.latencyInput.value) || 3.5; // Seconds

    // Update labels
    if (this.dbSizeVal) this.dbSizeVal.textContent = `${dbSize} TB`;
    if (this.spendVal) this.spendVal.textContent = `$${spend.toLocaleString()} / mo`;
    if (this.latencyVal) this.latencyVal.textContent = `${latency.toFixed(1)}s`;

    // Realistic DBA breakdown calculations
    // 1. Compute/RAM reduction: 48% of total savings (PgBouncer multiplexing + buffer pool tuning)
    // 2. IOPS/Storage reduction: 32% of total savings (Covering indexes + partitioning eliminates full table scans)
    // 3. OLAP offloading reduction: 20% of total savings (ClickHouse CDC streaming offloads heavy queries)
    const savingsPercent = 0.42; // Total ~42% average cloud reduction
    const monthlySavings = Math.round(spend * savingsPercent);
    const yearlySavings = monthlySavings * 12;

    const computeCut = Math.round(monthlySavings * 0.48);
    const iopsCut = Math.round(monthlySavings * 0.32);
    const olapCut = Math.round(monthlySavings * 0.20);

    const optimizedLatencyMs = Math.max(12, Math.round((latency * 1000) * 0.04));
    const speedupRatio = Math.round((latency * 1000) / optimizedLatencyMs);
    const pctDrop = Math.round((1 - (optimizedLatencyMs / (latency * 1000))) * 100);

    if (this.savingsMonthEl) this.savingsMonthEl.textContent = `$${monthlySavings.toLocaleString()}`;
    if (this.savingsYearEl) this.savingsYearEl.textContent = `$${yearlySavings.toLocaleString()} / year`;
    if (this.latencyOptimizedEl) this.latencyOptimizedEl.textContent = `${optimizedLatencyMs} ms`;
    if (this.speedupRatioEl) this.speedupRatioEl.textContent = `${speedupRatio}x Faster (${pctDrop}% Latency Drop)`;

    if (this.computeCutEl) this.computeCutEl.textContent = `-$${computeCut.toLocaleString()}/mo`;
    if (this.iopsCutEl) this.iopsCutEl.textContent = `-$${iopsCut.toLocaleString()}/mo`;
    if (this.olapCutEl) this.olapCutEl.textContent = `-$${olapCut.toLocaleString()}/mo`;

    this.currentData = {
      dbSize,
      spend,
      latency,
      monthlySavings,
      yearlySavings,
      computeCut,
      iopsCut,
      olapCut,
      optimizedLatencyMs,
      speedupRatio,
      pctDrop
    };

    if (this.telegramLinkEl) {
      const msg = encodeURIComponent(
        `Halo Mas Heri, saya telah mencoba ROI Calculator di website Anda dengan estimasi Database ${dbSize} TB dan Cloud Spend $${spend.toLocaleString()}/bulan. Estimasi Penghematan: $${monthlySavings.toLocaleString()}/bln ($${yearlySavings.toLocaleString()}/thn). Saya ingin mendiskusikan peluang audit arsitektur database / DBA consultation.`
      );
      this.telegramLinkEl.href = `https://t.me/riprlutuk?text=${msg}`;
    }

    if (this.emailLinkEl) {
      const subject = encodeURIComponent(`[DBA Audit Inquiry] Database Optimization for ${dbSize}TB Cluster`);
      const body = encodeURIComponent(
        `Hi Heri,\n\nI calculated our database metrics on your portfolio website:\n- Total Database Size: ${dbSize} TB\n- Monthly Cloud DB Spend: $${spend.toLocaleString()} / mo\n- Slow Query Latency: ${latency.toFixed(1)}s\n- Projected Savings: $${monthlySavings.toLocaleString()}/mo ($${yearlySavings.toLocaleString()}/yr)\n\nWe would like to explore a database architecture audit and query optimization engagement.\n\nBest regards,\n[Your Name / Company]`
      );
      this.emailLinkEl.href = `mailto:rizqy.pra85@gmail.com?subject=${subject}&body=${body}`;
    }
  }

  async copyAuditReport() {
    if (!this.currentData) return;
    const d = this.currentData;

    const report = `# 📊 Enterprise DBA & Cloud Cost Optimization Executive Estimate
Generated via Heri Riski Anto's Infrastructure Portfolio (https://riprlutuk.github.io)

## 1. Current Infrastructure Baseline
- **Database Storage**: ${d.dbSize} TB
- **Monthly Cloud DB Spend (AWS / GCP / Azure)**: $${d.spend.toLocaleString()} / month ($${(d.spend * 12).toLocaleString()} / year)
- **Average Heavy Reporting Query Latency**: ${d.latency.toFixed(1)}s

## 2. Projected Financial & Performance ROI
- **Estimated Monthly Savings**: $${d.monthlySavings.toLocaleString()} / month (-42% cost reduction)
- **Estimated Annual Savings**: $${d.yearlySavings.toLocaleString()} / year
- **Query Latency After Tuning**: ${d.optimizedLatencyMs} ms (${d.speedupRatio}x Faster, ${d.pctDrop}% latency drop)
- **Target High-Availability SLA**: 99.98% (Multi-AZ + PgBouncer zero-downtime failover)

## 3. Engineering Breakdown of Savings
1. **Compute & RAM Downsizing**: -$${d.computeCut.toLocaleString()}/mo
   - Downsize overprovisioned instances (e.g. db.r6g.4xlarge ➔ db.r6g.xlarge) using PgBouncer pool multiplexing and memory buffer tuning.
2. **Provisioned IOPS & Disk Read Slashing**: -$${d.iopsCut.toLocaleString()}/mo
   - Replace Full Table Scans with Composite Covering B-Tree Indexes & Partition Pruning, dropping disk IOPS by ~65%.
3. **OLAP Analytical Offloading**: -$${d.olapCut.toLocaleString()}/mo
   - Stream transactional mutations into ClickHouse columnar storage for real-time aggregation without locking OLTP CPU.

---
**Consultant**: Heri Riski Anto — Senior DBA, Infrastructure & Platform Architect
**Telegram**: @riprlutuk | **Email**: rizqy.pra85@gmail.com | **Portfolio**: https://riprlutuk.github.io`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(report);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = report;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      if (window.soundFx) window.soundFx.playSuccess();
      if (window.showToast) {
        window.showToast("📋 Executive ROI Audit Report Copied to Clipboard!");
      }
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
  }
}

function startROICalculator() {
  window.roiCalculator = new ROICalculator();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startROICalculator);
} else {
  startROICalculator();
}
