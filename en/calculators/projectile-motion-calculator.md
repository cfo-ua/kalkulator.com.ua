---
layout: calculator
title: "Projectile Motion Calculator - Trajectory Analysis"
categories: [school]
seo:
  title: "Projectile Motion Calculator Online - Trajectory, Range, Height | Physics"
  description: "Calculate projectile trajectory, maximum height, range, and flight time. Physics calculator for projectile motion problems."
  keywords:
    - projectile motion calculator
    - trajectory calculator
    - ballistic motion
    - projectile physics
    - range calculation
    - maximum height
    - physics calculator
    - mechanics
    - ballistics
    - projectile
  content: |
    <h2>🎯 Projectile Motion Calculator</h2>
    <p>Projectile motion is the motion of an object thrown or projected into the air, subject only to the acceleration of gravity. This calculator helps determine the key parameters of such motion.</p>
    
    <h3>📐 Key Formulas:</h3>
    <ul>
      <li><strong>Flight time:</strong> t = 2v₀sin(θ)/g</li>
      <li><strong>Maximum height:</strong> h = v₀²sin²(θ)/(2g)</li>
      <li><strong>Range:</strong> R = v₀²sin(2θ)/g</li>
      <li><strong>Position:</strong> x = v₀cos(θ)t, y = v₀sin(θ)t - ½gt²</li>
    </ul>
    
    <h3>🎯 Applications:</h3>
    <ul>
      <li>Sports ballistics (throwing ball, discus)</li>
      <li>Artillery calculations</li>
      <li>Rocket engineering</li>
      <li>Game physics (computer games)</li>
      <li>Physics exam preparation</li>
    </ul>
    
    <h3>💡 Interesting Facts:</h3>
    <ul>
      <li>Optimal angle for maximum range is 45°</li>
      <li>Trajectory is a parabola</li>
      <li>Time to reach maximum height equals time to fall back</li>
    </ul>
    
    <h3>📊 Variables explained:</h3>
    <ul>
      <li><strong>v₀</strong> - Initial velocity (m/s)</li>
      <li><strong>θ</strong> - Launch angle (degrees)</li>
      <li><strong>h₀</strong> - Initial height (m)</li>
      <li><strong>g</strong> - Gravitational acceleration (9.81 m/s²)</li>
    </ul>
scripts:
  - /en/js/projectile-motion-calculator.js
faq:
  - question: What is projectile motion?
    answer: "Projectile motion is the motion of an object thrown or projected into the air, subject only to the acceleration of gravity (ignoring air resistance)."
  - question: Why is 45° the optimal angle?
    answer: "At 45°, the sin(2θ) function reaches its maximum value, providing the greatest horizontal range."
  - question: Is air resistance considered?
    answer: "No, this calculator assumes ideal projectile motion without air resistance for simplicity."
  - question: What units should I use for the angle?
    answer: "Enter the angle in degrees (°). The calculator will automatically convert to radians for calculations."
  - question: Can I calculate for different planets?
    answer: "Yes! Just change the gravitational acceleration value. For example, use 3.71 m/s² for Mars or 1.62 m/s² for the Moon."
---

<form id="projectile-form" autocomplete="off">
  <div class="input-grid">
    <label>
      Initial velocity (v₀, m/s):
      <input type="number" id="v0" step="0.01" placeholder="20" value="20">
    </label>
    <label>
      Launch angle (θ, °):
      <input type="number" id="angle" step="0.1" placeholder="45" value="45" min="0" max="90">
    </label>
    <label>
      Initial height (h₀, m):
      <input type="number" id="h0" step="0.01" placeholder="0" value="0">
    </label>
    <label>
      Gravitational acceleration (g, m/s²):
      <input type="number" id="g" step="0.01" placeholder="9.81" value="9.81">
    </label>
  </div>
  <button type="submit">🚀 Calculate Trajectory</button>
</form>

<div id="projectile-result" class="result"></div>