---
layout: calculator
title: "pH Calculator"
categories: [school]
seo:
  title: "pH Calculator  -  Calculate Acidity or Alkalinity of Solution Online"
  description: "Determine pH or pOH of a solution from H⁺ or OH⁻ ion concentration. Online calculator for chemistry students and teachers. Identify acidic, basic, or neutral solutions."
  keywords:
    - pH calculator
    - pOH calculator
    - acidity calculator
    - H+ concentration
    - OH- concentration
    - alkalinity
    - acidity
    - pH scale
    - hydrogen ion
    - pH formula
    - chemistry calculator
    - acid base calculator
  content: |
    <h2>pH Calculator</h2>
    <p>This online calculator allows you to <strong>calculate pH or pOH</strong> of a solution based on the concentration of <strong>H⁺</strong> or <strong>OH⁻</strong> ions. You'll get not only the numerical value but also the solution type: <strong>acidic, neutral, or basic</strong>.</p>

    <h3>What is pH?</h3>
    <p><strong>pH</strong> is a measure of the acidity of an aqueous solution, defined as the negative decimal logarithm of hydrogen ion concentration:</p>
    <pre>pH = -log₁₀[H⁺]</pre>
    <p>The pH scale ranges from 0 (very acidic) to 14 (very basic). A solution with pH = 7 is considered <strong>neutral</strong> (e.g., pure water).</p>

    <h3>What if you only have OH⁻?</h3>
    <p>You can enter only the hydroxide ion concentration <strong>[OH⁻]</strong>. The calculator will first compute pOH:</p>
    <pre>pOH = -log₁₀[OH⁻]</pre>
    <p>Then use the relationship:</p>
    <pre>pH + pOH = 14</pre>

    <h3>Why is this useful?</h3>
    <ul>
      <li>Chemical analysis of water, solutions, acids, and bases acidity</li>
      <li>Laboratory calculations in school, college, university</li>
      <li>Working with biological or medical samples</li>
      <li>Agriculture and hydroponics  -  checking soil or water pH</li>
    </ul>

    <h3>Examples:</h3>
    <ul>
      <li>[H⁺] = 1 × 10⁻³ mol/L → pH = 3 → acidic solution</li>
      <li>[OH⁻] = 1 × 10⁻⁴ mol/L → pOH = 4 → pH = 10 → basic solution</li>
      <li>[H⁺] = 1 × 10⁻⁷ mol/L → pH = 7 → neutral solution</li>
    </ul>
scripts:
  - /en/js/ph.js
faq:
  - question: How to calculate pH?
    answer: "Formula: pH = -log₁₀[H⁺], where [H⁺] is hydrogen ion concentration in mol/L. Example: if [H⁺] = 0.01, then pH = 2."
  - question: How to calculate pOH?
    answer: "Formula: pOH = -log₁₀[OH⁻]. Then you can find pH using: pH = 14 - pOH."
  - question: What is the pH scale?
    answer: "It's a logarithmic scale from 0 to 14 showing acidity or alkalinity of aqueous solutions. pH < 7 = acidic, pH = 7 = neutral, pH > 7 = basic."
  - question: How to determine solution type?
    answer: "Based on pH value: less than 7 = acidic, greater than 7 = basic, exactly 7 = neutral (like pure water)."
  - question: What affects solution pH?
    answer: "Concentration of acids or bases, temperature, presence of buffers, type of dissolved substance. For example, weak acid has higher pH than strong acid at same concentration."
  - question: Where is pH needed in real life?
    answer: "Medicine (urine, blood analysis), skincare, plant growing, swimming pools, food industry, water quality control."
  - question: Should I enter both H⁺ and OH⁻ simultaneously?
    answer: "No, enter just one parameter. If you enter both, the calculator will prioritize [H⁺]."
---

<form id="ph-form" autocomplete="off">
  <fieldset>
    <legend>Concentration (mol/L):</legend>
    <label>
      [H⁺]:
      <input type="number" id="ph-h" min="0">
    </label>
    <label>
      [OH⁻]:
      <input type="number" id="ph-oh" min="0">
    </label>
  </fieldset>
  <button type="submit">Calculate</button>
</form>
<div id="ph-result" class="result"></div>