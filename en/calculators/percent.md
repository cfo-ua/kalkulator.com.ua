---
layout: calculator
title: "Percentage Calculator"
categories: [school]
permalink: /en/calculators/percent/
seo:
  title: "Percentage Calculator — Calculate Percentages, Discounts, Tips"
  description: "Calculate percentages, percentage changes, discounts, tips and more. Simple and fast percentage calculator with examples."
  keywords:
    - percentage calculator
    - percent calculator
    - discount calculator
    - tip calculator
    - percentage change
  content: |
    <h2>Percentage Calculator</h2>
    <p>Online percentage calculator helps you calculate percentages, percentage changes, discounts, tips and other percentage-based calculations. Enter your values and get instant results.</p>
scripts:
  - /en/js/percent.js
faq:
  - question: How to calculate percentage of a number?
    answer: "To calculate percentage of a number, multiply the number by the percentage and divide by 100. For example, 20% of 150 = (150 × 20) ÷ 100 = 30."
  - question: How to calculate percentage change?
    answer: "Percentage change = ((New Value - Old Value) ÷ Old Value) × 100. If the result is positive, it's an increase; if negative, it's a decrease."
  - question: How to calculate discount amount?
    answer: "Discount amount = Original Price × (Discount Percentage ÷ 100). Final price = Original Price - Discount Amount."
---

<form id="percent-calculator" autocomplete="off">
  <div class="calc-section">
    <h3>What is X% of Y?</h3>
    <div class="input-group">
      <label for="percent1">Percentage (%):</label>
      <input type="number" id="percent1" step="0.01" placeholder="Enter percentage">
    </div>
    <div class="input-group">
      <label for="number1">Number:</label>
      <input type="number" id="number1" step="0.01" placeholder="Enter number">
    </div>
    <button type="button" id="calc-percent-of">Calculate</button>
    <div class="result" id="result1"></div>
  </div>

  <div class="calc-section">
    <h3>X is what % of Y?</h3>
    <div class="input-group">
      <label for="part">Part (X):</label>
      <input type="number" id="part" step="0.01" placeholder="Enter part">
    </div>
    <div class="input-group">
      <label for="whole">Whole (Y):</label>
      <input type="number" id="whole" step="0.01" placeholder="Enter whole">
    </div>
    <button type="button" id="calc-what-percent">Calculate</button>
    <div class="result" id="result2"></div>
  </div>

  <div class="calc-section">
    <h3>Percentage Change</h3>
    <div class="input-group">
      <label for="oldValue">Old Value:</label>
      <input type="number" id="oldValue" step="0.01" placeholder="Enter old value">
    </div>
    <div class="input-group">
      <label for="newValue">New Value:</label>
      <input type="number" id="newValue" step="0.01" placeholder="Enter new value">
    </div>
    <button type="button" id="calc-percent-change">Calculate</button>
    <div class="result" id="result3"></div>
  </div>
</form>