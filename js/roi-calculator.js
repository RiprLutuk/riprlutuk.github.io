/**
 * Enterprise DBA & Cloud Cost Savings ROI Calculator
 * Calculates estimated infrastructure cost reduction, query speedup & compliance scores
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

    this.init();
  }

  init() {
    if (!this.dbSizeInput || !this.spendInput || !this.latencyInput) return;

    const updateHandler = () => this.calculate();

    this.dbSizeInput.addEventListener("input", updateHandler);
    this.spendInput.addEventListener("input", updateHandler);
    this.latencyInput.addEventListener("input", updateHandler);

    this.calculate();
  }

  calculate() {
    const dbSize = parseFloat(this.dbSizeInput.value) || 2; // TB
    const spend = parseFloat(this.spendInput.value) || 3500; // USD/mo
    const latency = parseFloat(this.latencyInput.value) || 4.2; // Seconds

    // Update labels
    if (this.dbSizeVal) this.dbSizeVal.textContent = `${dbSize} TB`;
    if (this.spendVal) this.spendVal.textContent = `$${spend.toLocaleString()} / mo`;
    if (this.latencyVal) this.latencyVal.textContent = `${latency.toFixed(1)}s`;

    const savingsPercent = 0.42; 
    const monthlySavings = Math.round(spend * savingsPercent);
    const yearlySavings = monthlySavings * 12;

    const optimizedLatencyMs = Math.max(12, Math.round((latency * 1000) * 0.04));
    const speedupRatio = Math.round((latency * 1000) / optimizedLatencyMs);

    if (this.savingsMonthEl) this.savingsMonthEl.textContent = `$${monthlySavings.toLocaleString()}`;
    if (this.savingsYearEl) this.savingsYearEl.textContent = `$${yearlySavings.toLocaleString()} / year`;
    if (this.latencyOptimizedEl) this.latencyOptimizedEl.textContent = `${optimizedLatencyMs} ms`;
    if (this.speedupRatioEl) this.speedupRatioEl.textContent = `${speedupRatio}x Faster (96% Latency Drop)`;

    if (this.telegramLinkEl) {
      const msg = encodeURIComponent(
        `Halo Mas Heri, saya telah mencoba ROI Calculator di website Anda dengan estimasi Database ${dbSize} TB dan Cloud Spend $${spend}/bulan. Saya ingin mendiskusikan peluang audit arsitektur database / DBA consultation.`
      );
      this.telegramLinkEl.href = `https://t.me/riprlutuk?text=${msg}`;
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
