---
layout: calculator
title: "Pythagorean Theorem Calculator"
categories: [school]
seo:
  title: "Pythagorean Theorem Calculator Online — Find Hypotenuse and Legs"
  description: "Online Pythagorean theorem calculator: enter two sides of a right triangle, find the third using formula a² + b² = c². Calculate hypotenuse and legs."
  keywords:
    - pythagorean theorem
    - pythagorean calculator
    - right triangle
    - hypotenuse
    - cathetus
    - legs
    - pythagorean triples
    - geometry
    - trigonometry
    - school math
  content: |
    <h2>Online Pythagorean Theorem Calculator</h2>
    <p>The Pythagorean theorem is a fundamental law of geometry: <strong>a² + b² = c²</strong>, where a and b are legs, c is the hypotenuse of a right triangle.</p>

    <h3>How to use the calculator?</h3>
    <p>Enter the lengths of two known sides of a right triangle and click "Calculate". The calculator will find:</p>
    <ul>
      <li>The unknown side of the triangle</li>
      <li>Triangle area</li>
      <li>Triangle perimeter</li>
      <li>Triangle angles</li>
    </ul>

    <h3>Types of calculations:</h3>
    <ul>
      <li><strong>Find hypotenuse:</strong> c = √(a² + b²)</li>
      <li><strong>Find leg a:</strong> a = √(c² - b²)</li>
      <li><strong>Find leg b:</strong> b = √(c² - a²)</li>
    </ul>

    <h3>Right triangle properties:</h3>
    <ul>
      <li><strong>Hypotenuse</strong> — longest side, opposite the right angle</li>
      <li><strong>Legs</strong> — two shorter sides that form the right angle</li>
      <li><strong>Sum of angles</strong> — always 180°, one angle equals 90°</li>
      <li><strong>Area:</strong> A = (a × b) / 2</li>
    </ul>

    <h3>Where it's used:</h3>
    <ul>
      <li><strong>Construction:</strong> calculating distances, checking right angles</li>
      <li><strong>Navigation:</strong> finding shortest path</li>
      <li><strong>Design:</strong> object design, layout</li>
      <li><strong>Physics:</strong> vector calculations, mechanics</li>
    </ul>

    <h3>Famous Pythagorean triples:</h3>
    <p>(3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25), (20, 21, 29)</p>

    <p>Useful tool for students, builders, engineers, and anyone working with right triangles.</p>
scripts:
  - /en/js/pythagorean-theorem.js
faq:
  - question: What is the Pythagorean theorem?
    answer: "The Pythagorean theorem states: in a right triangle, the square of the hypotenuse equals the sum of squares of the legs (a² + b² = c²)."
  - question: How to find the hypotenuse?
    answer: "The hypotenuse is calculated using the formula c = √(a² + b²), where a and b are the legs of the right triangle."
  - question: How to find a leg knowing the hypotenuse?
    answer: "A leg is calculated using the formula a = √(c² - b²), where c is the hypotenuse and b is the other leg."
  - question: What are Pythagorean triples?
    answer: "Pythagorean triples are sets of three integers (a, b, c) that satisfy the Pythagorean theorem. The most famous: (3, 4, 5)."
  - question: Can the theorem be used for any triangle?
    answer: "No, the Pythagorean theorem only works for right triangles (with one 90° angle)."
  - question: How to check if a triangle is right-angled?
    answer: "Measure all three sides. If a² + b² = c² (where c is the longest side), then the triangle is right-angled."
---
<form id="pythagorean-form" autocomplete="off">
  <div class="input-group">
    <label>
      Leg a:
      <input type="number" id="side-a-input" placeholder="Example: 3" step="any" value="3" min="0">
    </label>
    <label>
      Leg b:
      <input type="number" id="side-b-input" placeholder="Example: 4" step="any" value="4" min="0">
    </label>
    <label>
      Hypotenuse c:
      <input type="number" id="side-c-input" placeholder="Leave empty to calculate" step="any" min="0">
    </label>
  </div>
  <p><em>💡 Enter two of the three values. The third will be calculated automatically.</em></p>
  <button type="submit">Calculate</button>
</form>
<div id="pythagorean-result" class="result"></div>