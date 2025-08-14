---
layout: calculator
title: "Discount Calculator"
categories: [financial]
seo:
  title: "Online Discount Calculator - Calculate Sale Prices & Savings | Free Tool"
  description: "Free online discount calculator to calculate discounted prices, savings amount, and discount percentage. Perfect for shopping, sales, and business calculations."
  keywords:
    - discount calculator
    - calculate discount
    - sale price calculator
    - discount percentage
    - savings calculator
    - shopping calculator
    - price reduction
    - financial calculator
    - percent off calculator
    - commercial calculations
  content: |
    <h2>💰 Online Discount Calculator</h2>
    <p>Universal tool for calculating discounts in shopping, business, and daily life. Quickly determine final prices, savings amounts, and discount percentages in seconds.</p>
    
    <h3>🎯 Calculator Features:</h3>
    <ul>
      <li>✅ Calculate discounted price by percentage</li>
      <li>✅ Determine discount amount in currency</li>
      <li>✅ Calculate discount percentage between two prices</li>
      <li>✅ Calculate multiple successive discounts</li>
      <li>✅ Compare savings between different offers</li>
      <li>✅ Visualize results with charts</li>
    </ul>

    <h3>🛍️ When to Use:</h3>
    <ul>
      <li><strong>Shopping:</strong> Calculate savings during sales</li>
      <li><strong>Business:</strong> Plan pricing policies and promotions</li>
      <li><strong>Comparison:</strong> Choose the best deal</li>
      <li><strong>Budgeting:</strong> Plan expenses considering discounts</li>
    </ul>

    <h3>📊 Calculation Formulas:</h3>
    <ul>
      <li><strong>Discounted Price:</strong> Original Price × (1 - Discount%/100)</li>
      <li><strong>Savings Amount:</strong> Original Price × (Discount%/100)</li>
      <li><strong>Discount Percentage:</strong> (Original Price - Final Price) / Original Price × 100%</li>
    </ul>
scripts:
  - /assets/js/discount-calculator.js
faq:
  - question: How to calculate a 30% discount price?
    answer: "Multiply the original price by 0.7 (or 70%). Example: item costs $1000 with 30% discount = $1000 × 0.7 = $700."
  - question: How to find the discount percentage?
    answer: "Subtract final price from original price, divide by original price, and multiply by 100%. Formula: (original - final) / original × 100%"
  - question: What are successive discounts?
    answer: "Multiple discounts applied one after another. For example, first 20% off, then another 10% off the already reduced price."
  - question: How to compare different discount offers?
    answer: "Calculate the final price for each offer and compare the results. The lowest final price is the best deal."
---

<div class="calculator-container">
  <div class="calc-tabs">
    <button type="button" class="tab-button active" data-tab="basic">Basic Calculations</button>
    <button type="button" class="tab-button" data-tab="multiple">Multiple Discounts</button>
    <button type="button" class="tab-button" data-tab="compare">Compare Offers</button>
  </div>

  <!-- Basic Discount Tab -->
  <div id="basic-tab" class="tab-content active">
    <h3>🏷️ Basic Discount Calculations</h3>
    <form id="basic-discount-form">
      <div class="input-group">
        <label for="original-price">💵 Original Price ($):</label>
        <input type="number" id="original-price" step="0.01" min="0" value="1000" placeholder="Enter original price">
      </div>
      
      <div class="input-group">
        <label for="discount-percent">🏷️ Discount (%):</label>
        <input type="number" id="discount-percent" step="0.01" min="0" max="100" value="25" placeholder="Enter discount percentage">
      </div>
      
      <div class="input-group">
        <label for="tax-percent">📋 Tax (%) - optional:</label>
        <input type="number" id="tax-percent" step="0.01" min="0" max="100" value="8.5" placeholder="Enter tax rate">
      </div>
      
      <button type="submit" class="calculate-btn">Calculate Discount</button>
      <button type="button" id="reverse-calc" class="calculate-btn secondary">Find Discount %</button>
    </form>

    <div class="reverse-calc-inputs" style="display: none;">
      <div class="input-group">
        <label for="final-price">💰 Final Price ($):</label>
        <input type="number" id="final-price" step="0.01" min="0" placeholder="Enter final price">
      </div>
    </div>
  </div>

  <!-- Multiple Discounts Tab -->
  <div id="multiple-tab" class="tab-content">
    <h3>🔢 Multiple Successive Discounts</h3>
    <form id="multiple-discount-form">
      <div class="input-group">
        <label for="multi-price">💵 Original Price ($):</label>
        <input type="number" id="multi-price" step="0.01" min="0" value="2000" placeholder="Enter original price">
      </div>
      
      <div id="discount-inputs">
        <div class="input-group">
          <label for="discount1">🏷️ First Discount (%):</label>
          <input type="number" class="discount-input" id="discount1" step="0.01" min="0" max="100" value="20" placeholder="First discount">
        </div>
        
        <div class="input-group">
          <label for="discount2">🏷️ Second Discount (%):</label>
          <input type="number" class="discount-input" id="discount2" step="0.01" min="0" max="100" value="15" placeholder="Second discount">
        </div>
      </div>
      
      <button type="button" id="add-discount">➕ Add Discount</button>
      <button type="submit" class="calculate-btn">Calculate All Discounts</button>
    </form>
  </div>

  <!-- Compare Discounts Tab -->
  <div id="compare-tab" class="tab-content">
    <h3>⚖️ Compare Discount Offers</h3>
    <form id="compare-form">
      <div class="comparison-group">
        <h4>🅰️ Offer A</h4>
        <div class="input-group">
          <label for="price-a">💵 Price ($):</label>
          <input type="number" id="price-a" step="0.01" min="0" value="1500" placeholder="Price of offer A">
        </div>
        <div class="input-group">
          <label for="discount-a">🏷️ Discount (%):</label>
          <input type="number" id="discount-a" step="0.01" min="0" max="100" value="30" placeholder="Discount A">
        </div>
      </div>

      <div class="comparison-group">
        <h4>🅱️ Offer B</h4>
        <div class="input-group">
          <label for="price-b">💵 Price ($):</label>
          <input type="number" id="price-b" step="0.01" min="0" value="1200" placeholder="Price of offer B">
        </div>
        <div class="input-group">
          <label for="discount-b">🏷️ Discount (%):</label>
          <input type="number" id="discount-b" step="0.01" min="0" max="100" value="15" placeholder="Discount B">
        </div>
      </div>
      
      <button type="submit" class="calculate-btn">Compare Offers</button>
    </form>
  </div>

  <div id="discount-result"></div>
</div>