---
layout: calculator
title: "Energy Conservation Calculator"
categories: [school]
permalink: /en/calculators/energy/
seo:
  title: "Energy Conservation Calculator Online"
  description: "Calculate potential energy (mgh), kinetic energy ((mv²)/2) and total mechanical energy of an object. Convenient online calculator for physics students."
  keywords:
    - energy calculator
    - conservation of energy
    - potential energy
    - kinetic energy
    - mechanical energy
    - physics calculator
    - school physics
    - energy formula
    - physics tools
  content: |
    <h2>Energy Conservation Calculator</h2>
    <p>Enter object mass (in kg), height (in meters) and velocity (in m/s) — the calculator will compute potential, kinetic and total mechanical energy.</p>
    
    <h3>Types of mechanical energy:</h3>
    <ul>
      <li><strong>Potential Energy (PE):</strong> Energy due to position in gravitational field. Formula: PE = mgh</li>
      <li><strong>Kinetic Energy (KE):</strong> Energy due to motion. Formula: KE = ½mv²</li>
      <li><strong>Total Mechanical Energy:</strong> Sum of potential and kinetic energy: E = PE + KE</li>
    </ul>
    
    <h3>Conservation of Energy Law:</h3>
    <p>In the absence of friction and air resistance, the total mechanical energy of an object remains constant. As an object falls, potential energy converts to kinetic energy, but their sum stays the same.</p>
    
    <h3>Examples:</h3>
    <ul>
      <li><strong>At maximum height:</strong> All energy is potential (v = 0)</li>
      <li><strong>At ground level:</strong> All energy is kinetic (h = 0)</li>
      <li><strong>In between:</strong> Mix of both potential and kinetic energy</li>
    </ul>
    
    <h3>Applications:</h3>
    <ul>
      <li>Pendulum motion analysis</li>
      <li>Projectile motion problems</li>
      <li>Roller coaster physics</li>
      <li>Free fall calculations</li>
    </ul>
scripts:
  - /en/js/energy.js
faq:
  - question: How to calculate total mechanical energy?
    answer: "Total mechanical energy is the sum of potential and kinetic energy: E = mgh + ½mv²."
  - question: What is potential energy?
    answer: "Energy that an object has due to its position in a gravitational field. Formula: PE = mgh."
  - question: What is kinetic energy?
    answer: "Energy of motion. Formula: KE = ½mv²."
  - question: What value is used for g?
    answer: "This calculator uses g = 9.81 m/s² — standard gravitational acceleration on Earth's surface."
  - question: When is mechanical energy conserved?
    answer: "When no non-conservative forces (like friction or air resistance) act on the system."
---

<form id="energy-form" autocomplete="off">
  <label>
    Mass (kg):
    <input type="number" id="energy-m" min="0" step="any" value="1" required>
  </label>
  <label>
    Height (m):
    <input type="number" id="energy-h" step="any" value="1" required>
  </label>
  <label>
    Velocity (m/s):
    <input type="number" id="energy-v" step="any" value="0" required>
  </label>
  <button type="submit">Calculate</button>
</form>
<div id="energy-result" class="result"></div>