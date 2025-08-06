---
layout: calculator
title: "Circumference Calculator"
categories: [school]
seo:
  title: "Circumference Calculator Online — Calculate Circle Circumference"
  description: "Online calculator for calculating circle circumference by radius or diameter. Fast and accurate calculations with formula C = 2πr or C = πd."
  keywords:
    - circumference calculator
    - circle circumference
    - radius calculator
    - diameter calculator
    - circle formula
    - geometry
    - pi number
    - school math
    - calculate circle
    - perimeter circle
  content: |
    <h2>Online Circumference Calculator</h2>
    <p>The circumference of a circle is the distance around the edge of the circle. It's calculated using formulas: <strong>C = 2πr</strong> or <strong>C = πd</strong>, where π ≈ 3.14159.</p>

    <h3>How to use the calculator?</h3>
    <p>Enter the radius or diameter of the circle and click "Calculate". The calculator will automatically compute:</p>
    <ul>
      <li>Circle circumference</li>
      <li>Circle area</li>
      <li>Radius (if diameter entered)</li>
      <li>Diameter (if radius entered)</li>
    </ul>

    <h3>Basic concepts:</h3>
    <ul>
      <li><strong>Radius (r)</strong> — distance from center to edge of circle</li>
      <li><strong>Diameter (d)</strong> — largest distance through center of circle (d = 2r)</li>
      <li><strong>Circumference (C)</strong> — perimeter of the circle</li>
      <li><strong>Pi (π)</strong> — mathematical constant ≈ 3.14159</li>
    </ul>

    <h3>Circle formulas:</h3>
    <ul>
      <li><strong>C = 2πr</strong> — circumference through radius</li>
      <li><strong>C = πd</strong> — circumference through diameter</li>
      <li><strong>A = πr²</strong> — circle area</li>
      <li><strong>d = 2r</strong> — relationship between diameter and radius</li>
    </ul>

    <h3>Where it's used:</h3>
    <ul>
      <li><strong>Construction:</strong> calculating materials for round structures</li>
      <li><strong>Engineering:</strong> wheels, pipes, cylinders</li>
      <li><strong>Design:</strong> circular elements, decoration</li>
      <li><strong>Sports:</strong> running tracks, fields</li>
    </ul>

    <p>Useful tool for students, engineers, architects, and anyone working with geometric calculations.</p>
scripts:
  - /en/js/circumference.js
faq:
  - question: What is the circumference of a circle?
    answer: "Circumference is the perimeter of a circle, the distance around its edge. It's calculated using the formula C = 2πr."
  - question: What's the difference between radius and diameter?
    answer: "Radius is the distance from center to edge. Diameter is the largest distance through the center, equal to twice the radius (d = 2r)."
  - question: What is the number π (pi)?
    answer: "π is a mathematical constant, approximately 3.14159. It's the ratio of a circle's circumference to its diameter."
  - question: How to find radius knowing circumference?
    answer: "Use the formula r = C/(2π). Divide the circumference by 2π."
  - question: Can you calculate circle area from circumference?
    answer: "Yes. First find the radius: r = C/(2π), then the area: A = πr²."
  - question: Why do we need to know the circumference?
    answer: "For calculating materials, construction planning, measuring distances around circles, designing circular objects."
---
<form id="circumference-form" autocomplete="off">
  <div class="input-group">
    <label>
      Radius (r):
      <input type="number" id="radius-input" placeholder="Example: 5" step="any" value="5" min="0">
    </label>
    <div class="divider">OR</div>
    <label>
      Diameter (d):
      <input type="number" id="diameter-input" placeholder="Example: 10" step="any" min="0">
    </label>
  </div>
  <button type="submit">Calculate</button>
</form>
<div id="circumference-result" class="result"></div>