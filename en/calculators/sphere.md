---
layout: calculator
title: "Sphere Surface Area and Volume Calculator"
categories: [school]
permalink: /en/calculators/sphere/
seo:
  title: "Sphere Surface Area and Volume Calculator | School Math Calculators"
  description: "Online calculator for computing sphere surface area and volume given radius. Formulas and quick calculations for school geometry."
  keywords:
    - sphere area
    - sphere volume
    - sphere radius
    - geometry calculator
    - mathematics
    - sphere formulas
    - surface area calculator
    - volume calculator
    - school geometry
    - 3d shapes
  content: |
    <h2>Sphere Surface Area and Volume Calculator</h2>
    <p>Enter the radius of a sphere to find its surface area and volume.</p>
    
    <h3>What is a sphere?</h3>
    <p>A sphere is a perfectly round 3D shape where every point on the surface is equidistant from the center.</p>
    
    <h3>Sphere formulas:</h3>
    <ul>
      <li><strong>Surface Area:</strong> A = 4πr²</li>
      <li><strong>Volume:</strong> V = (4/3)πr³</li>
      <li><strong>Diameter:</strong> d = 2r</li>
      <li><strong>Circumference:</strong> C = 2πr</li>
    </ul>
    
    <h3>Real-world examples:</h3>
    <ul>
      <li>Balls and spherical objects</li>
      <li>Planets and celestial bodies</li>
      <li>Bubbles and droplets</li>
      <li>Architectural domes</li>
    </ul>
scripts:
  - /en/js/sphere.js
faq:
  - question: How to find sphere surface area?
    answer: "Surface area of sphere: A = 4πr², where r is the radius."
  - question: How to find sphere volume?
    answer: "Volume of sphere: V = (4/3)πr³, where r is the radius."
  - question: What units should I use for radius?
    answer: "Enter radius in meters, centimeters, or any unit  -  results will be in corresponding square and cubic units."
  - question: What's the relationship between diameter and radius?
    answer: "Diameter is twice the radius: d = 2r. So if you have diameter, divide by 2 to get radius."
---

<form id="sphere-form" autocomplete="off">
  <label>
    Radius (r):
    <input type="number" id="sphere-r" min="0" step="any" value="1" required>
  </label>
  <button type="submit">Calculate</button>
</form>
<div id="sphere-result" class="result"></div>