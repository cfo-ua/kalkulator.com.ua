---
layout: calculator
title: "Sales Commission Calculator"
categories: [financial]
seo:
  title: "Sales Commission Calculator — Calculate Sales Rep Compensation"
  description: "Online calculator for sales commission calculations. Support for different commission models: fixed, progressive, tiered, and combined salary plus commission structures."
  keywords:
    - sales commission calculator
    - commission calculator
    - sales rep compensation
    - commission structure
    - sales commission calculation
    - sales percentage
    - sales manager salary
    - sales motivation
    - sales payment system
    - commission payout
  content: |
    <h2>Sales Commission Calculator Online</h2>
    <p>This calculator helps you calculate <strong>sales commission compensation</strong> for sales representatives and managers using different commission calculation schemes.</p>

    <h3>Types of commission schemes:</h3>
    <ul>
      <li><strong>Fixed commission</strong> — constant percentage of all sales</li>
      <li><strong>Progressive commission</strong> — percentage increases when targets are met</li>
      <li><strong>Tiered commission</strong> — different percentages for different sales levels</li>
      <li><strong>Combined scheme</strong> — base salary + commission</li>
    </ul>

    <h3>Benefits of commission systems:</h3>
    <ul>
      <li>Motivates employees to increase sales</li>
      <li>Links compensation to results</li>
      <li>Helps control salary costs</li>
      <li>Encourages achievement of target metrics</li>
    </ul>

    <p>The calculator accounts for base salary, commission percentage, sales volume, and additional bonuses for accurate total compensation calculation.</p>
scripts:
  - /en/js/sales-commission-calculator.js
faq:
  - question: "What is sales commission?"
    answer: "It's compensation paid to a salesperson as a percentage of deals closed or number of products/services sold."
  - question: "What types of commission schemes exist?"
    answer: "Fixed (constant percentage), progressive (increasing percentage), tiered (different percentages for different volumes), combined (salary + commission)."
  - question: "How to choose optimal commission percentage?"
    answer: "Depends on industry, product margins, sales complexity. Typical ranges: 1-3% for large deals, 5-15% for retail sales."
  - question: "Should there be a minimum salary?"
    answer: "It's recommended to combine fixed portion (50-70%) with commission for employee income stability."
  - question: "How to motivate plan achievement?"
    answer: "Use progressive scales — higher percentages for exceeding plans, bonuses for achieving key performance indicators."
  - question: "How is commission calculated on returns?"
    answer: "Usually commission is deducted from salary when products are returned or deals cancelled, especially if due to salesperson's fault."
---

<form id="commission-form">
  <label>Commission Scheme</label>
  <select id="commission-type" required>
    <option value="fixed">Fixed Commission</option>
    <option value="progressive">Progressive Commission</option>
    <option value="tiered">Tiered Commission</option>
    <option value="combined" selected>Salary + Commission</option>
  </select>

  <label>Sales Amount ($)</label>
  <input type="number" id="sales-amount" value="100000" min="0" required>

  <div id="fixed-commission" class="commission-section">
    <label>Commission Rate (%)</label>
    <input type="number" id="commission-rate" value="5" min="0" max="100" step="0.1">
  </div>

  <div id="combined-commission" class="commission-section">
    <label>Base Salary ($)</label>
    <input type="number" id="base-salary" value="50000" min="0">
    
    <label>Commission Rate (%)</label>
    <input type="number" id="commission-rate-combined" value="3" min="0" max="100" step="0.1">
  </div>

  <div id="progressive-commission" class="commission-section" style="display: none;">
    <label>Sales Target ($)</label>
    <input type="number" id="sales-target" value="80000" min="0">
    
    <label>Commission Below Target (%)</label>
    <input type="number" id="rate-below-target" value="2" min="0" max="100" step="0.1">
    
    <label>Commission Above Target (%)</label>
    <input type="number" id="rate-above-target" value="7" min="0" max="100" step="0.1">
  </div>

  <div id="tiered-commission" class="commission-section" style="display: none;">
    <label>Tier 1: Up to ($)</label>
    <input type="number" id="tier1-limit" value="50000" min="0">
    <label>Tier 1 Commission (%)</label>
    <input type="number" id="tier1-rate" value="2" min="0" max="100" step="0.1">
    
    <label>Tier 2: Up to ($)</label>
    <input type="number" id="tier2-limit" value="100000" min="0">
    <label>Tier 2 Commission (%)</label>
    <input type="number" id="tier2-rate" value="4" min="0" max="100" step="0.1">
    
    <label>Tier 3: Above ($)</label>
    <label>Tier 3 Commission (%)</label>
    <input type="number" id="tier3-rate" value="6" min="0" max="100" step="0.1">
  </div>

  <label>Additional Bonuses ($)</label>
  <input type="number" id="bonus" value="0" min="0">

  <button type="submit">Calculate</button>
</form>

<div id="commission-result"></div>

<script>
// Show/hide commission sections based on selected type
document.getElementById('commission-type').addEventListener('change', function() {
  const sections = document.querySelectorAll('.commission-section');
  sections.forEach(section => section.style.display = 'none');
  
  const selectedType = this.value;
  if (selectedType === 'fixed') {
    document.getElementById('fixed-commission').style.display = 'block';
  } else if (selectedType === 'combined') {
    document.getElementById('combined-commission').style.display = 'block';
  } else if (selectedType === 'progressive') {
    document.getElementById('progressive-commission').style.display = 'block';
  } else if (selectedType === 'tiered') {
    document.getElementById('tiered-commission').style.display = 'block';
  }
});
</script>