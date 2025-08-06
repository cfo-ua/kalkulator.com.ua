---
layout: calculator
title: "Significant Figures Calculator"
categories: [school]
seo:
  title: "Significant Figures Calculator Online — Count Significant Digits"
  description: "Determine the number of significant figures in a number online. Calculator shows significant digits, counting rules, and examples for scientific calculations."
  keywords:
    - significant figures calculator
    - sig fig calculator
    - significant digits
    - scientific calculations
    - measurement precision
    - number rounding
    - physics
    - chemistry
    - laboratory work
    - significant places
    - counting rules
    - result precision
  content: |
    <h2>Online Significant Figures Calculator</h2>
    <p>Significant figures (significant digits) are the digits in a number that carry meaningful information about its precision. Proper counting of significant figures is critically important in scientific calculations.</p>

    <h3>Rules for counting significant figures:</h3>
    <ul>
      <li><strong>Non-zero digits:</strong> always significant (123 has 3 significant figures)</li>
      <li><strong>Zeros between non-zero digits:</strong> significant (1005 has 4 significant figures)</li>
      <li><strong>Leading zeros:</strong> not significant (0.0025 has 2 significant figures)</li>
      <li><strong>Trailing zeros with decimal point:</strong> significant (12.0 has 3 significant figures)</li>
      <li><strong>Trailing zeros without decimal point:</strong> ambiguous (120 may have 2 or 3)</li>
    </ul>

    <h3>Where significant figures are used:</h3>
    <ul>
      <li><strong>Physics experiments:</strong> measurement precision</li>
      <li><strong>Chemical calculations:</strong> concentrations, molarity</li>
      <li><strong>Engineering calculations:</strong> tolerances, precision</li>
      <li><strong>Medicine:</strong> laboratory analyses</li>
      <li><strong>Scientific publications:</strong> result presentation</li>
    </ul>

    <h3>Operations with significant figures:</h3>
    <ul>
      <li><strong>Addition/Subtraction:</strong> result has as many decimal places as the least precise number</li>
      <li><strong>Multiplication/Division:</strong> result has as many significant figures as the least precise number</li>
      <li><strong>Rounding:</strong> "banker's rounding" rule is used</li>
    </ul>

    <p>This tool is essential for students of natural sciences, laboratory technicians, engineers, and scientists.</p>
scripts:
  - /en/js/significant-figures-calculator.js
faq:
  - question: What are significant figures?
    answer: "Significant figures are digits in a number that determine its precision. They show how accurately a number is known."
  - question: Is zero a significant figure?
    answer: "It depends on the position of zero. Zeros between digits and trailing zeros after decimal point are significant. Leading zeros are not."
  - question: How to round to significant figures correctly?
    answer: "Use the rule: if the digit is 5 or more — round up, if less than 5 — round down. When exactly 5, round to the nearest even number."
  - question: How many significant figures are in 0.00450?
    answer: "3 significant figures: 4, 5, 0. Leading zeros (0.00) are not significant, but the trailing zero after decimal point is significant."
  - question: How to determine significant figures in scientific notation?
    answer: "In scientific notation, all digits in the mantissa are significant. For example, 1.230 × 10³ has 4 significant figures."
  - question: Why are significant figures important in science?
    answer: "They show measurement precision and prevent overestimating the accuracy of calculation results beyond the precision of input data."
---
<form id="sigfig-form" autocomplete="off">
  <div class="input-group">
    <label>
      Enter number:
      <input type="text" id="sigfig-number" placeholder="Example: 0.00450" required>
    </label>
  </div>

  <div class="input-group">
    <label>
      Round to number of significant figures (optional):
      <input type="number" id="round-to" placeholder="Example: 3" min="1" max="15">
    </label>
  </div>

  <button type="submit">Analyze Number</button>
</form>

<div id="sigfig-result" class="result"></div>