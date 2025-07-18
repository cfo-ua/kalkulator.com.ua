---
layout: calculator
title: "Rectangle Area and Perimeter Calculator"
categories: [school]
permalink: /en/calculators/rectangle/
seo:
  title: "Rectangle Area and Perimeter Calculator | School Math Calculators"
  description: "Calculate the area and perimeter of a rectangle online. Formulas, examples, convenient calculator for students and adults."
  keywords:
    - rectangle area
    - rectangle perimeter
    - area formula
    - perimeter formula
    - math calculator
    - geometry calculator
    - area calculation
    - online calculator
    - rectangle
    - school geometry
  content: |
    <h2>Rectangle Area and Perimeter Calculator</h2>
    <p>Enter the lengths of sides <strong>a</strong> and <strong>b</strong> to find:</p>
    <ul>
      <li>Rectangle area: <code>A = a × b</code></li>
      <li>Rectangle perimeter: <code>P = 2 × (a + b)</code></li>
    </ul>
    
    <h3>What is a rectangle?</h3>
    <p>A rectangle is a quadrilateral with four right angles. Opposite sides are equal and parallel.</p>
    
    <h3>Rectangle formulas:</h3>
    <ul>
      <li><strong>Area:</strong> A = length × width</li>
      <li><strong>Perimeter:</strong> P = 2 × (length + width)</li>
      <li><strong>Diagonal:</strong> d = √(a² + b²)</li>
    </ul>
    
    <h3>Real-world applications:</h3>
    <ul>
      <li>Room area calculation</li>
      <li>Garden planning</li>
      <li>Material estimation</li>
      <li>Floor and wall measurements</li>
    </ul>
scripts:
  - /en/js/rectangle.js
faq:
  - question: How to find the area of a rectangle?
    answer: "Formula: A = a × b. For example, if a = 5 m, b = 3 m, then area: 5 × 3 = 15 m²."
  - question: How to find the perimeter of a rectangle?
    answer: "Formula: P = 2 × (a + b). For example, with a = 5, b = 3: P = 2 × (5 + 3) = 16 m."
  - question: What units are used for area and perimeter?
    answer: "Area is measured in square units (m², cm²), perimeter in linear units (m, cm)."
  - question: What's the difference between area and perimeter?
    answer: "Area measures the space inside the rectangle, perimeter measures the distance around its edges."
---

<form id="rectangle-form" autocomplete="off">
  <label>
    Side a:
    <input type="number" id="rect-a" value="1" min="0" step="any" required>
  </label>
  <label>
    Side b:
    <input type="number" id="rect-b" value="1" min="0" step="any" required>
  </label>
  <button type="submit">Calculate</button>
</form>
<div id="rectangle-result" class="result"></div>