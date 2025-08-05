---
layout: calculator
title: "Dividend Yield Calculator"
categories: [financial]
seo:
  title: "Dividend Yield Calculator — Calculate Stock Dividend Returns"
  description: "Online calculator for dividend yield calculations. Determine annual returns, projected dividend income, and investment efficiency from dividend-paying stocks."
  keywords:
    - dividend yield calculator
    - dividend calculator
    - stock dividend yield
    - investment yield
    - dividend calculation
    - stock returns
    - dividend stocks
    - passive income
    - stock market
    - investment portfolio
  content: |
    <h2>Dividend Yield Calculator Online</h2>
    <p>This calculator helps you calculate <strong>dividend yield from stocks</strong> and evaluate the effectiveness of dividend investments for creating passive income.</p>

    <h3>What is dividend yield?</h3>
    <p>Dividend yield is a financial metric that shows the annual return from dividends relative to the stock price. It's calculated using the formula:</p>
    <p><code>Dividend Yield = (Dividend per Share / Stock Price) × 100%</code></p>

    <h3>Benefits of dividend investing:</h3>
    <ul>
      <li>Regular passive income</li>
      <li>Inflation protection with growing dividends</li>
      <li>Stability compared to speculative investments</li>
      <li>Reinvestment opportunities for compound growth</li>
    </ul>

    <h3>Typical dividend yield levels:</h3>
    <ul>
      <li><strong>2-4%</strong> — large stable companies (blue-chip)</li>
      <li><strong>4-6%</strong> — medium companies with steady dividends</li>
      <li><strong>6-10%</strong> — high-yield dividend stocks (with higher risk)</li>
      <li><strong>10%+</strong> — possible company issues or special dividends</li>
    </ul>

    <p>The calculator also shows projected investment income and the effect of dividend reinvestment.</p>
scripts:
  - /en/js/dividend-yield-calculator.js
faq:
  - question: "What is dividend yield?"
    answer: "It's the annual return from dividends expressed as a percentage of the current stock price. Shows how much annual income you'll receive from dividends."
  - question: "How to calculate dividend yield?"
    answer: "Divide annual dividends per share by current stock price and multiply by 100%. Example: $2 dividend / $50 price × 100% = 4% yield."
  - question: "What's a good dividend yield?"
    answer: "Depends on market conditions and industry. Generally 3-6% is acceptable for stable companies. Very high yields (10%+) may signal risks."
  - question: "Should I reinvest dividends?"
    answer: "Reinvesting dividends creates compounding effect, significantly increasing long-term returns. Especially effective for young investors."
  - question: "How often are dividends paid?"
    answer: "Frequency depends on the company: quarterly (most common), semi-annually, or annually. Some companies may pay monthly."
  - question: "Are dividends guaranteed?"
    answer: "No, dividends are not guaranteed. Companies can reduce or eliminate dividends if financial conditions deteriorate."
---

<form id="dividend-form">
  <label>Stock Price ($)</label>
  <input type="number" id="stock-price" value="100" min="0" step="0.01" required>

  <label>Annual Dividend per Share ($)</label>
  <input type="number" id="annual-dividend" value="4" min="0" step="0.01" required>

  <label>Number of Shares</label>
  <input type="number" id="shares-count" value="100" min="1" required>

  <label>Investment Amount ($)</label>
  <input type="number" id="investment-amount" value="10000" min="0" readonly>

  <label>Expected Annual Dividend Growth (%)</label>
  <input type="number" id="dividend-growth" value="5" min="0" max="50" step="0.1">

  <label>Dividend Reinvestment</label>
  <select id="reinvestment">
    <option value="true" selected>Yes, reinvest</option>
    <option value="false">No, receive cash</option>
  </select>

  <label>Forecast Period (years)</label>
  <input type="number" id="forecast-years" value="10" min="1" max="50">

  <button type="submit">Calculate</button>
</form>

<div id="dividend-result"></div>

<!--CHART_SPLIT-->

<div id="dividend-chart-block" class="chart-card" style="margin:2.3em auto 0 auto; display:none;">
  <h3 style="margin-bottom:0.9em; text-align:center;">Dividend Income Projection</h3>
  <div class="chart-canvas-wrap">
    <canvas id="dividend-chart"></canvas>
  </div>
</div>

<script>
// Auto-calculate investment amount
document.getElementById('stock-price').addEventListener('input', updateInvestment);
document.getElementById('shares-count').addEventListener('input', updateInvestment);

function updateInvestment() {
  const price = parseFloat(document.getElementById('stock-price').value) || 0;
  const shares = parseFloat(document.getElementById('shares-count').value) || 0;
  document.getElementById('investment-amount').value = (price * shares).toFixed(2);
}

// Initialize
updateInvestment();
</script>