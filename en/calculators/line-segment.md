---
layout: calculator
title: "Line Segment Calculator"
categories: [school]
seo:
  title: "Line Segment Calculator | Coordinate Geometry Calculator"
  description: "Calculate line segment length, midpoint, division point, and slope angle between two points on a plane. Complete analytical geometry calculator."
  keywords:
    - line segment
    - segment length
    - midpoint
    - division point
    - point coordinates
    - analytical geometry
    - coordinate plane
    - cartesian coordinates
    - distance formula
    - midpoint formula
  content: |
    <h2>Line Segment Calculator 📏</h2>
    <p>Calculate <strong>all parameters of a line segment</strong> between two points on the coordinate plane. Find length, midpoint, division point in given ratio, and slope angle.</p>
    
    <h3>📐 Essential Formulas</h3>
    <ul>
      <li><strong>Length:</strong> d = √[(x₂-x₁)² + (y₂-y₁)²]</li>
      <li><strong>Midpoint:</strong> M((x₁+x₂)/2, (y₁+y₂)/2)</li>
      <li><strong>Division in ratio m:n:</strong> P((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n))</li>
      <li><strong>Slope angle:</strong> α = arctan((y₂-y₁)/(x₂-x₁))</li>
    </ul>
    
    <h3>🎯 What you can calculate:</h3>
    <ul>
      <li>✅ <strong>Segment length</strong> from endpoint coordinates</li>
      <li>✅ <strong>Midpoint coordinates</strong> of the segment</li>
      <li>✅ <strong>Division point</strong> in a given ratio</li>
      <li>✅ <strong>Slope angle</strong> with respect to x-axis</li>
      <li>✅ <strong>Line equation</strong> passing through the points</li>
      <li>✅ <strong>Distance from point</strong> to the line</li>
    </ul>
    
    <h3>📚 Applications:</h3>
    <p>Used in coordinate geometry, computer graphics, GPS navigation, architectural design, and physics for motion analysis.</p>
scripts:
  - /en/js/line-segment.js
faq:
  - question: How to find the length of a line segment?
    answer: "Use the distance formula: d = √[(x₂-x₁)² + (y₂-y₁)²]. This comes from the Pythagorean theorem applied to the right triangle formed by the coordinates."
  - question: What is the midpoint of a segment?
    answer: "The midpoint is the point that divides the segment into two equal parts. Its coordinates are: M((x₁+x₂)/2, (y₁+y₂)/2)."
  - question: How to divide a segment in a given ratio?
    answer: "To divide segment AB in ratio m:n, the division point P has coordinates: P((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n))."
  - question: What does the slope angle mean?
    answer: "The slope angle is the angle between the line segment and the positive direction of the x-axis, measured from 0° to 180°."
  - question: How to find the equation of a line through two points?
    answer: "Use the point-slope form: y - y₁ = m(x - x₁), where m = (y₂-y₁)/(x₂-x₁) is the slope."
---

<form id="segment-form" autocomplete="off">
  <div class="input-group">
    <h4>📍 Coordinates of first point A</h4>
    <label>
      x₁:
      <input type="number" id="x1" value="0" step="0.1" required>
    </label>
    <label>
      y₁:
      <input type="number" id="y1" value="0" step="0.1" required>
    </label>
  </div>

  <div class="input-group">
    <h4>📍 Coordinates of second point B</h4>
    <label>
      x₂:
      <input type="number" id="x2" value="3" step="0.1" required>
    </label>
    <label>
      y₂:
      <input type="number" id="y2" value="4" step="0.1" required>
    </label>
  </div>

  <div class="input-group">
    <h4>🎯 Division ratio (optional)</h4>
    <label>
      m (part before division point):
      <input type="number" id="ratio-m" value="1" min="0" step="0.1">
    </label>
    <label>
      n (part after division point):
      <input type="number" id="ratio-n" value="1" min="0" step="0.1">
    </label>
  </div>

  <div class="input-group">
    <h4>📏 Additional point C (for distance to line)</h4>
    <label>
      x₃:
      <input type="number" id="x3" value="1" step="0.1">
    </label>
    <label>
      y₃:
      <input type="number" id="y3" value="1" step="0.1">
    </label>
  </div>

  <button type="submit">📊 Calculate Parameters</button>
</form>

<div id="segment-result" class="result"></div>