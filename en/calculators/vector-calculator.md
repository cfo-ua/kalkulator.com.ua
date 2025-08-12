---
layout: calculator
title: "Vector Calculator"
categories: [school]
seo:
  title: "Vector Calculator | Addition, Subtraction, Dot Product, Cross Product"
  description: "Perform vector operations online: addition, subtraction, dot product, cross product, magnitude calculation, and unit vector computation."
  keywords:
    - vector calculator
    - vector operations
    - dot product
    - cross product
    - vector magnitude
    - unit vector
    - mathematics
    - geometry
    - calculator
    - school
    - linear algebra
    - 3d vectors
  content: |
    <h2>Vector Calculator</h2>
    <p>Perform all essential vector operations: addition, subtraction, dot product, cross product, magnitude calculation, and unit vector computation.</p>
    
    <h3>Basic Vector Operations:</h3>
    <ul>
      <li><strong>Vector Addition:</strong> (a₁, a₂, a₃) + (b₁, b₂, b₃) = (a₁+b₁, a₂+b₂, a₃+b₃)</li>
      <li><strong>Vector Subtraction:</strong> (a₁, a₂, a₃) - (b₁, b₂, b₃) = (a₁-b₁, a₂-b₂, a₃-b₃)</li>
      <li><strong>Dot Product:</strong> a⃗ · b⃗ = a₁b₁ + a₂b₂ + a₃b₃</li>
      <li><strong>Cross Product:</strong> a⃗ × b⃗ = (a₂b₃-a₃b₂, a₃b₁-a₁b₃, a₁b₂-a₂b₁)</li>
      <li><strong>Vector Magnitude:</strong> |a⃗| = √(a₁² + a₂² + a₃²)</li>
    </ul>
    
    <h3>Applications:</h3>
    <ul>
      <li>Physics: Force, velocity, acceleration calculations</li>
      <li>Engineering: Structural analysis, mechanics</li>
      <li>Computer Graphics: 3D transformations, lighting</li>
      <li>Navigation: Direction and distance calculations</li>
    </ul>
    
    <h3>How to Use:</h3>
    <p>Enter the coordinates of vectors A and B, select an operation, and get detailed results with step-by-step calculations.</p>
scripts:
  - /en/js/vector-calculator.js
faq:
  - question: What is a dot product of vectors?
    answer: "The dot product is a scalar value equal to the sum of products of corresponding coordinates. It measures how much vectors point in the same direction."
  - question: How is cross product different from dot product?
    answer: "Dot product gives a scalar (number), while cross product gives a vector perpendicular to both original vectors."
  - question: How to find a unit vector?
    answer: "A unit vector is obtained by dividing a vector by its magnitude: û = a⃗/|a⃗|. It has the same direction but length 1."
  - question: What does vector magnitude represent?
    answer: "Vector magnitude (or length) is the distance from origin to the vector's endpoint, calculated using the Pythagorean theorem."
  - question: When is the cross product zero?
    answer: "Cross product is zero when vectors are parallel (pointing in the same or opposite directions)."
---

<div class="calculator-inputs">
  <div class="vector-inputs">
    <div class="vector-group">
      <h4>🎯 Vector A</h4>
      <div class="vector-coords">
        <label>x: <input type="number" id="vector-a-x" value="1" step="any"></label>
        <label>y: <input type="number" id="vector-a-y" value="2" step="any"></label>
        <label>z: <input type="number" id="vector-a-z" value="3" step="any"></label>
      </div>
    </div>
    
    <div class="vector-group">
      <h4>🎯 Vector B</h4>
      <div class="vector-coords">
        <label>x: <input type="number" id="vector-b-x" value="4" step="any"></label>
        <label>y: <input type="number" id="vector-b-y" value="5" step="any"></label>
        <label>z: <input type="number" id="vector-b-z" value="6" step="any"></label>
      </div>
    </div>
  </div>
</div>

<div class="operation-buttons">
  <button type="button" id="vector-add">➕ A + B</button>
  <button type="button" id="vector-subtract">➖ A - B</button>
  <button type="button" id="vector-dot-product">⚫ A · B (dot product)</button>
  <button type="button" id="vector-cross-product">❌ A × B (cross product)</button>
  <button type="button" id="vector-magnitude">📏 |A|, |B| (magnitude)</button>
  <button type="button" id="vector-unit">🎯 Unit vectors</button>
</div>

<div id="vector-result" class="result"></div>