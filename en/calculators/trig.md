---
layout: calculator
title: "Trigonometric Functions Calculator"
categories: [school]
permalink: /en/calculators/trig/
seo:
  title: "Trigonometry Calculator | School Math Calculators"
  description: "Calculate values of sin, cos, tan, and cot for any angle in degrees. Online trigonometry calculator for students and math learners."
  keywords:
    - trigonometry
    - sine calculator
    - cosine calculator
    - tangent calculator
    - cotangent calculator
    - trigonometric functions
    - sin cos tan calculator
    - school math
    - angle calculator
    - degrees calculator
  content: |
    <h2>Trigonometric Functions Calculator</h2>
    <p>Enter an angle in degrees (0 - 360°) to find the values of sin, cos, tan, and cot.</p>
    
    <h3>What are trigonometric functions?</h3>
    <p>Trigonometric functions relate the angles of a triangle to the lengths of its sides. They are fundamental in mathematics, physics, and engineering.</p>
    
    <h3>Basic trigonometric functions:</h3>
    <ul>
      <li><strong>sin(θ)</strong> = opposite / hypotenuse</li>
      <li><strong>cos(θ)</strong> = adjacent / hypotenuse</li>
      <li><strong>tan(θ)</strong> = opposite / adjacent = sin(θ) / cos(θ)</li>
      <li><strong>cot(θ)</strong> = adjacent / opposite = cos(θ) / sin(θ) = 1 / tan(θ)</li>
    </ul>
    
    <h3>Common angle values:</h3>
    <ul>
      <li><strong>0°:</strong> sin = 0, cos = 1, tan = 0</li>
      <li><strong>30°:</strong> sin = 0.5, cos = 0.866, tan = 0.577</li>
      <li><strong>45°:</strong> sin = 0.707, cos = 0.707, tan = 1</li>
      <li><strong>60°:</strong> sin = 0.866, cos = 0.5, tan = 1.732</li>
      <li><strong>90°:</strong> sin = 1, cos = 0, tan = ∞</li>
    </ul>
scripts:
  - /en/js/trig.js
faq:
  - question: What unit system should I use for angles?
    answer: "Enter angles in degrees (0 - 360°)."
  - question: What is cot?
    answer: "cot(x) = 1 / tan(x), which is the cotangent function."
  - question: What are the main trigonometric identities?
    answer: "sin²(x) + cos²(x) = 1, tan(x) = sin(x) / cos(x), cot(x) = cos(x) / sin(x)."
  - question: What is trigonometry used for?
    answer: "Trigonometry is used in geometry, physics, construction, navigation, and engineering applications."
  - question: Why do some functions show infinity (∞)?
    answer: "When cos(x) = 0, tan(x) becomes infinite. When sin(x) = 0, cot(x) becomes infinite."
---

<form id="trig-form" autocomplete="off">
  <label>
    Angle (°):
    <input type="number" id="trig-angle" min="0" max="360" value="30" step="any" required>
  </label>
  <button type="submit">Calculate</button>
</form>
<div id="trig-result" class="result"></div>