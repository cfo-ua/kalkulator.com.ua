---
layout: calculator
title: "Volume and Surface Area Calculator (Prism, Cylinder, Cone, Pyramid)"
categories: [school]
seo:
  title: "Volume and Surface Area Calculator - Prism, Cylinder, Cone, Pyramid | School Calculators"
  description: "Calculate volume and surface area of geometric shapes: prism, cylinder, cone, pyramid. Online geometry calculator with formulas and step-by-step explanations."
  keywords:
    - volume geometric shapes
    - surface area calculator
    - prism volume
    - cylinder volume
    - cone volume
    - pyramid volume
    - geometry calculator
    - school mathematics
    - stereometry
    - 3D shapes calculator
  content: |
    <h2>📐 Volume and Surface Area Calculator for Geometric Shapes</h2>
    <p>Calculate volume and surface area of fundamental 3D shapes: rectangular prism, cylinder, cone, and pyramid. Enter the required parameters and get accurate results with detailed formulas.</p>
    
    <h3>🔍 Supported Shapes:</h3>
    <ul>
      <li><strong>Rectangular Prism</strong> - length, width, height</li>
      <li><strong>Cylinder</strong> - base radius, height</li>
      <li><strong>Cone</strong> - base radius, height</li>
      <li><strong>Pyramid</strong> - base area, height</li>
    </ul>
    
    <h3>📝 Calculation Formulas:</h3>
    <div class="formulas-section">
      <h4>Rectangular Prism:</h4>
      <p>• Volume: V = a × b × h</p>
      <p>• Surface Area: S = 2(ab + ah + bh)</p>
      
      <h4>Cylinder:</h4>
      <p>• Volume: V = π × r² × h</p>
      <p>• Surface Area: S = 2πr(r + h)</p>
      
      <h4>Cone:</h4>
      <p>• Volume: V = (1/3) × π × r² × h</p>
      <p>• Surface Area: S = πr(r + l), where l = √(r² + h²)</p>
      
      <h4>Pyramid:</h4>
      <p>• Volume: V = (1/3) × A_base × h</p>
      <p>• Surface Area: S = A_base + A_lateral</p>
    </div>
    
    <h3>💡 Applications:</h3>
    <ul>
      <li>Architecture and construction planning</li>
      <li>Engineering calculations</li>
      <li>Material estimation for projects</li>
      <li>School geometry problems</li>
      <li>3D modeling and design</li>
    </ul>
scripts:
  - /en/js/geometry-shapes-calculator.js
faq:
  - question: What units of measurement should I use?
    answer: "All linear dimensions should be in the same units (cm, m, ft, etc.). Volume results will be in cubic units, surface area in square units."
  - question: What is the slant height of a cone?
    answer: "The slant height (l) is the distance from the apex of the cone to any point on the base circle. It's calculated using l = √(r² + h²)."
  - question: How do I calculate the base area of a pyramid?
    answer: "Base area depends on the shape: square - a², rectangle - a×b, triangle - (1/2)×a×h, circle - π×r²."
  - question: Why is the volume of cone and pyramid divided by 3?
    answer: "This is a mathematical fact: the volume of a cone or pyramid is always 1/3 of the volume of a cylinder or prism with the same base and height."
  - question: Can I use different units for different measurements?
    answer: "No, all measurements must be in the same units. Convert all values to the same unit system before calculating."
---

<div class="geometry-calculator">
  <div class="shape-selector">
    <h3>🎯 Select Geometric Shape:</h3>
    <div class="shape-buttons">
      <button class="shape-btn active" data-shape="prism">📦 Prism</button>
      <button class="shape-btn" data-shape="cylinder">🥤 Cylinder</button>
      <button class="shape-btn" data-shape="cone">🏔️ Cone</button>
      <button class="shape-btn" data-shape="pyramid">🔺 Pyramid</button>
    </div>
  </div>

  <!-- Rectangular Prism -->
  <div id="prism-form" class="shape-form active">
    <h4>📦 Rectangular Prism</h4>
    <form autocomplete="off">
      <label>
        Length (a):
        <input type="number" id="prism-length" value="5" step="0.01" min="0.01">
        <span class="unit">cm</span>
      </label>
      <label>
        Width (b):
        <input type="number" id="prism-width" value="3" step="0.01" min="0.01">
        <span class="unit">cm</span>
      </label>
      <label>
        Height (h):
        <input type="number" id="prism-height" value="4" step="0.01" min="0.01">
        <span class="unit">cm</span>
      </label>
      <button type="submit">🧮 Calculate</button>
    </form>
  </div>

  <!-- Cylinder -->
  <div id="cylinder-form" class="shape-form">
    <h4>🥤 Cylinder</h4>
    <form autocomplete="off">
      <label>
        Base Radius (r):
        <input type="number" id="cylinder-radius" value="3" step="0.01" min="0.01">
        <span class="unit">cm</span>
      </label>
      <label>
        Height (h):
        <input type="number" id="cylinder-height" value="6" step="0.01" min="0.01">
        <span class="unit">cm</span>
      </label>
      <button type="submit">🧮 Calculate</button>
    </form>
  </div>

  <!-- Cone -->
  <div id="cone-form" class="shape-form">
    <h4>🏔️ Cone</h4>
    <form autocomplete="off">
      <label>
        Base Radius (r):
        <input type="number" id="cone-radius" value="4" step="0.01" min="0.01">
        <span class="unit">cm</span>
      </label>
      <label>
        Height (h):
        <input type="number" id="cone-height" value="8" step="0.01" min="0.01">
        <span class="unit">cm</span>
      </label>
      <button type="submit">🧮 Calculate</button>
    </form>
  </div>

  <!-- Pyramid -->
  <div id="pyramid-form" class="shape-form">
    <h4>🔺 Pyramid</h4>
    <form autocomplete="off">
      <label>
        Base Area (A):
        <input type="number" id="pyramid-base" value="16" step="0.01" min="0.01">
        <span class="unit">cm²</span>
      </label>
      <label>
        Height (h):
        <input type="number" id="pyramid-height" value="6" step="0.01" min="0.01">
        <span class="unit">cm</span>
      </label>
      <button type="submit">🧮 Calculate</button>
    </form>
  </div>

  <div id="geometry-result" class="result insight-card"></div>
</div>