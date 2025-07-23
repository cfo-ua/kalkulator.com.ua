---
layout: calculator
title: "Test New Calculator - Verify Search Functionality"
categories: [other]
seo:
  title: "Test New Calculator - Verify Search Functionality Works"
  description: "This is a test calculator to verify that newly added calculators automatically appear in search results without manual updates."
  keywords:
    - test calculator
    - search functionality
    - automatic inclusion
    - calculator search
  content: |
    <h2>Test New Calculator</h2>
    <p>This is a test calculator created to verify that our dynamic search data generation works correctly.</p>
    <p>If you can find this calculator in the search results, then the fix is working!</p>
---

<div class="calculator-block">
  <h3>Test Calculator</h3>
  <p>This calculator demonstrates that newly added calculators now automatically appear in search results.</p>
  
  <form id="test-form">
    <label>
      Enter a test value:
      <input type="number" id="test-input" placeholder="Enter any number" required>
    </label>
    <button type="submit">Calculate</button>
  </form>
  
  <div id="test-result" class="result"></div>
</div>

<script>
document.getElementById('test-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const input = document.getElementById('test-input').value;
  const result = document.getElementById('test-result');
  result.innerHTML = `<p>Test result: ${input} × 2 = ${input * 2}</p><p>✅ This calculator was automatically included in search data!</p>`;
});
</script>