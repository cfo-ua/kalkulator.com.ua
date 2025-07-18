---
layout: calculator
title: "Quadratic Equation Calculator"
categories: [school]
permalink: /en/calculators/quadratic/
seo:
  title: "Quadratic Equation Calculator | School Math Calculators"
  description: "Solve quadratic equations online and find roots using a simple calculator for students. Calculate discriminant and solutions for ax² + bx + c = 0."
  keywords:
    - quadratic equation
    - equation solver
    - quadratic formula
    - mathematics
    - calculator
    - school
    - algebra
    - discriminant
    - roots
    - polynomial
  content: |
    <h2>Quadratic Equation Calculator</h2>
    <p>Enter coefficients <b>a</b>, <b>b</b>, <b>c</b> for equation <b>ax² + bx + c = 0</b> and find the solutions.</p>
    
    <h3>What is a quadratic equation?</h3>
    <p>A quadratic equation is a polynomial equation of degree 2, written in the form ax² + bx + c = 0, where a ≠ 0.</p>
    
    <h3>How does it work?</h3>
    <p>The calculator uses the quadratic formula: x = (-b ± √D) / 2a, where D is the discriminant (b² - 4ac).</p>
    
    <h3>Types of solutions:</h3>
    <ul>
      <li><strong>D > 0:</strong> Two real solutions</li>
      <li><strong>D = 0:</strong> One real solution (repeated root)</li>
      <li><strong>D < 0:</strong> No real solutions (complex solutions)</li>
    </ul>
scripts:
  - /en/js/quadratic.js
faq:
  - question: How to find roots of quadratic equation?
    answer: "Use the discriminant formula: x = (-b ± √D) / 2a, where D = b² - 4ac."
  - question: What is discriminant?
    answer: "Discriminant is the expression b² - 4ac that determines the number of solutions to the equation."
  - question: What if discriminant is negative?
    answer: "If discriminant is negative, the equation has no real solutions, only complex ones."
  - question: Can coefficient 'a' be zero?
    answer: "No, if a = 0, the equation becomes linear (bx + c = 0), not quadratic."
---

<form id="quadratic-form" autocomplete="off">
  <label>
    a:
    <input type="number" id="quad-a" value="1" required>
  </label>
  <label>
    b:
    <input type="number" id="quad-b" value="0" required>
  </label>
  <label>
    c:
    <input type="number" id="quad-c" value="0" required>
  </label>
  <button type="submit">Solve</button>
</form>
<div id="quadratic-result" class="result"></div>