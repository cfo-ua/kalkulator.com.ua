---
layout: calculator
title: "Slope Calculator"
categories: [school]
seo:
  title: "Slope Calculator Online — Calculate Line Slope Between Two Points"
  description: "Online calculator to find the slope between two points. Calculate slope coefficient, angle of inclination, and line equation using formula slope = (y2-y1)/(x2-x1)."
  keywords:
    - slope calculator
    - line slope
    - gradient calculator
    - slope coefficient
    - line equation
    - coordinate geometry
    - mathematics
    - geometry
    - analytical geometry
    - school math
  content: |
    <h2>Online Slope Calculator</h2>
    <p>The slope of a line shows how steep the line rises or falls. It's calculated using the formula: <strong>slope = (y₂ - y₁) / (x₂ - x₁)</strong></p>

    <h3>How to use the calculator?</h3>
    <p>Enter the coordinates of two points (x₁, y₁) and (x₂, y₂) and click "Calculate". The calculator will show:</p>
    <ul>
      <li>Slope coefficient</li>
      <li>Angle of inclination in degrees</li>
      <li>Line equation</li>
      <li>Distance between points</li>
    </ul>

    <h3>Interpreting results:</h3>
    <ul>
      <li><strong>Slope > 0:</strong> line rises from left to right</li>
      <li><strong>Slope < 0:</strong> line falls from left to right</li>
      <li><strong>Slope = 0:</strong> horizontal line</li>
      <li><strong>Slope = ∞:</strong> vertical line (undefined)</li>
    </ul>

    <h3>Formulas:</h3>
    <ul>
      <li><strong>m = (y₂ - y₁) / (x₂ - x₁)</strong> — slope coefficient</li>
      <li><strong>θ = arctan(m)</strong> — angle of inclination</li>
      <li><strong>y = mx + b</strong> — line equation</li>
      <li><strong>d = √[(x₂-x₁)² + (y₂-y₁)²]</strong> — distance between points</li>
    </ul>

    <h3>Where it's used:</h3>
    <ul>
      <li><strong>Construction:</strong> roof slopes, road grades, ramps</li>
      <li><strong>Surveying:</strong> terrain elevation mapping</li>
      <li><strong>Mathematics:</strong> analytical geometry, functions</li>
      <li><strong>Physics:</strong> motion graphs, velocity</li>
    </ul>

    <p>Useful tool for students, engineers, and anyone working with coordinate geometry.</p>
scripts:
  - /en/js/slope.js
faq:
  - question: What is the slope of a line?
    answer: "Slope (gradient) shows how fast y changes when x changes. It's the ratio of vertical change to horizontal change."
  - question: How to calculate slope between two points?
    answer: "Use the formula: slope = (y₂ - y₁) / (x₂ - x₁). Subtract the y-coordinates and x-coordinates respectively, then divide."
  - question: What does negative slope mean?
    answer: "Negative slope means the line falls from left to right. The more negative the value, the steeper the decline."
  - question: When is the slope equal to zero?
    answer: "Slope equals zero for horizontal lines, when y₁ = y₂ (all points have the same y-coordinate)."
  - question: What if x₁ = x₂?
    answer: "When x₁ = x₂, the line is vertical and slope is undefined (division by zero). This is written as ∞."
  - question: How to find line equation from slope?
    answer: "Use the form y = mx + b, where m is the slope. Find b by substituting coordinates of any point on the line."
---
<form id="slope-form" autocomplete="off">
  <div class="input-group">
    <div class="point-group">
      <h4>Point 1 (x₁, y₁):</h4>
      <label>
        x₁:
        <input type="number" id="x1-input" placeholder="Example: 1" step="any" value="1" required>
      </label>
      <label>
        y₁:
        <input type="number" id="y1-input" placeholder="Example: 2" step="any" value="2" required>
      </label>
    </div>
    <div class="point-group">
      <h4>Point 2 (x₂, y₂):</h4>
      <label>
        x₂:
        <input type="number" id="x2-input" placeholder="Example: 4" step="any" value="4" required>
      </label>
      <label>
        y₂:
        <input type="number" id="y2-input" placeholder="Example: 8" step="any" value="8" required>
      </label>
    </div>
  </div>
  <button type="submit">Calculate</button>
</form>
<div id="slope-result" class="result"></div>