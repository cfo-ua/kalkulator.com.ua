---
layout: calculator
title: "Law of Sines Calculator"
categories: [school]
seo:
  title: "Law of Sines Calculator | Triangle Solver | Trigonometry"
  description: "Solve any triangle using the law of sines online. Find unknown sides and angles of triangles with known parameters. Complete triangle calculator."
  keywords:
    - law of sines
    - sine rule
    - triangle solver
    - triangle sides
    - triangle angles
    - geometry
    - trigonometry
    - planimetry
    - mathematics
    - triangle calculator
  content: |
    <h2>Law of Sines Calculator 📐</h2>
    <p>Solve <strong>any triangle</strong> using the law of sines. Find unknown sides and angles when you know at least 3 parameters (including at least one side).</p>
    
    <h3>📏 Law of Sines Formula</h3>
    <p><strong>a/sin(A) = b/sin(B) = c/sin(C) = 2R</strong></p>
    <p>where a, b, c are the sides of the triangle, A, B, C are the opposite angles, and R is the radius of the circumscribed circle.</p>
    
    <h3>🎯 What you can find:</h3>
    <ul>
      <li>✅ <strong>Unknown sides</strong> from known angles and one side</li>
      <li>✅ <strong>Unknown angles</strong> from known sides</li>
      <li>✅ <strong>Circumradius</strong> of the triangle</li>
      <li>✅ <strong>Area</strong> of the triangle</li>
    </ul>
    
    <h3>📋 Requirements:</h3>
    <p>You need to know at least <strong>3 parameters</strong>, with at least one being a side. Examples: side + two angles, or two sides + one angle.</p>
    
    <h3>🔍 Applications:</h3>
    <p>Used in surveying, navigation, astronomy, and solving practical geometry problems in engineering and physics.</p>
scripts:
  - /en/js/law-of-sines.js
faq:
  - question: What is the law of sines?
    answer: "The law of sines establishes the relationship between the sides of a triangle and the sines of their opposite angles. All these ratios are equal and equal to twice the radius of the circumscribed circle."
  - question: When to use the law of sines?
    answer: "Used for solving triangles in cases like AAS (angle-angle-side), ASA (angle-side-angle), and SSA (side-side-angle) when you have sufficient known parameters."
  - question: Can you solve a triangle knowing only the angles?
    answer: "No, knowing only angles determines the shape but not the size. You need at least one side to fully solve the triangle."
  - question: What is the ambiguous case?
    answer: "This occurs in SSA scenarios when the given side is shorter than the height. There might be two possible triangles, and the calculator will show both solutions."
  - question: What if the angles don't add up to 180°?
    answer: "This indicates an error in input values, as the sum of angles in any triangle must equal 180 degrees."
---

<div class="form-section">
  <h3>🔢 Enter known triangle parameters</h3>
  <p>💡 <em>Fill in at least 3 fields, with at least one being a side</em></p>
</div>

<form id="sines-form" autocomplete="off">
  <div class="input-group">
    <h4>📏 Triangle Sides</h4>
    <label>
      Side a:
      <input type="number" id="side-a" step="0.1" min="0" placeholder="Enter side a">
    </label>
    <label>
      Side b:
      <input type="number" id="side-b" step="0.1" min="0" placeholder="Enter side b">
    </label>
    <label>
      Side c:
      <input type="number" id="side-c" step="0.1" min="0" placeholder="Enter side c">
    </label>
  </div>

  <div class="input-group">
    <h4>📐 Triangle Angles (in degrees)</h4>
    <label>
      Angle A (opposite side a):
      <input type="number" id="angle-a" step="0.1" min="0" max="180" placeholder="Enter angle A">
    </label>
    <label>
      Angle B (opposite side b):
      <input type="number" id="angle-b" step="0.1" min="0" max="180" placeholder="Enter angle B">
    </label>
    <label>
      Angle C (opposite side c):
      <input type="number" id="angle-c" step="0.1" min="0" max="180" placeholder="Enter angle C">
    </label>
  </div>

  <button type="submit">🔍 Solve Triangle</button>
</form>

<div id="sines-result" class="result"></div>