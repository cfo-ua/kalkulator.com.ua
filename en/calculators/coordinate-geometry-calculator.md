---
layout: calculator
title: "Coordinate Geometry Calculator (Distance, Midpoint, Slope)"
categories: [school]
seo:
  title: "Coordinate Geometry Calculator - Distance, Midpoint, Slope | School Calculators"
  description: "Calculate distance between points, midpoint of line segment, and slope of line. Online analytical geometry calculator with formulas and explanations."
  keywords:
    - distance between points
    - midpoint calculator
    - slope calculator
    - coordinate geometry
    - analytical geometry
    - distance formula
    - geometry calculator
    - school mathematics
    - Euclidean distance
  content: |
    <h2>📍 Coordinate Geometry Calculator</h2>
    <p>Quickly calculate essential coordinate geometry parameters: distance between two points, midpoint coordinates of a line segment, and slope of a line. Perfect for solving analytical geometry problems.</p>
    
    <h3>🔍 Available Calculations:</h3>
    <ul>
      <li><strong>Distance between points</strong> - using Euclidean formula</li>
      <li><strong>Midpoint of segment</strong> - coordinates of the center point</li>
      <li><strong>Line slope</strong> - slope coefficient and angle of inclination</li>
    </ul>
    
    <h3>📝 Formulas:</h3>
    <div class="formulas-section">
      <h4>Distance between points:</h4>
      <p>d = √[(x₂ - x₁)² + (y₂ - y₁)²]</p>
      
      <h4>Midpoint of segment:</h4>
      <p>M = ((x₁ + x₂)/2, (y₁ + y₂)/2)</p>
      
      <h4>Slope of line:</h4>
      <p>m = (y₂ - y₁)/(x₂ - x₁)</p>
      <p>θ = arctan(m) × 180°/π</p>
    </div>
    
    <h3>💡 Applications:</h3>
    <ul>
      <li>Solving geometric problems</li>
      <li>Graphing functions</li>
      <li>Navigation and cartography</li>
      <li>Computer graphics</li>
      <li>Engineering calculations</li>
      <li>Physics motion problems</li>
    </ul>
scripts:
  - /en/js/coordinate-geometry-calculator.js
faq:
  - question: What is the distance formula?
    answer: "The distance formula d = √[(x₂-x₁)² + (y₂-y₁)²] is an application of the Pythagorean theorem to find the distance between two points on a coordinate plane."
  - question: How do I find the midpoint of a segment?
    answer: "Midpoint coordinates are calculated as the arithmetic mean of corresponding coordinates of the endpoints: M((x₁+x₂)/2, (y₁+y₂)/2)."
  - question: What does the slope of a line represent?
    answer: "Slope (gradient) shows how much y changes when x changes by 1 unit. Positive slope means the line goes up, negative slope means it goes down."
  - question: When is the slope of a line undefined?
    answer: "Slope is undefined when the line is vertical (x₁ = x₂), because this results in division by zero."
  - question: What is the relationship between slope and angle?
    answer: "The angle of inclination θ is related to slope m by θ = arctan(m). A slope of 1 corresponds to a 45° angle."
---

<div class="coordinate-calculator">
  <div class="calculation-selector">
    <h3>🎯 Select Calculation Type:</h3>
    <div class="calc-buttons">
      <button class="calc-btn active" data-calc="distance">📏 Distance</button>
      <button class="calc-btn" data-calc="midpoint">📍 Midpoint</button>
      <button class="calc-btn" data-calc="slope">📐 Slope</button>
    </div>
  </div>

  <div class="points-input">
    <h4>📊 Enter Point Coordinates:</h4>
    <div class="points-grid">
      <div class="point-group">
        <h5>Point A (x₁, y₁):</h5>
        <div class="coordinate-inputs">
          <label>
            x₁:
            <input type="number" id="x1" value="1" step="0.1">
          </label>
          <label>
            y₁:
            <input type="number" id="y1" value="2" step="0.1">
          </label>
        </div>
      </div>
      
      <div class="point-group">
        <h5>Point B (x₂, y₂):</h5>
        <div class="coordinate-inputs">
          <label>
            x₂:
            <input type="number" id="x2" value="4" step="0.1">
          </label>
          <label>
            y₂:
            <input type="number" id="y2" value="6" step="0.1">
          </label>
        </div>
      </div>
    </div>
    
    <button class="calculate-btn" onclick="calculateCoordinateGeometry()">🧮 Calculate</button>
  </div>

  <div id="coordinate-result" class="result insight-card"></div>
  
  <div class="visual-representation">
    <h4>📊 Visual Representation:</h4>
    <canvas id="coordinate-canvas" width="400" height="400"></canvas>
  </div>
</div>