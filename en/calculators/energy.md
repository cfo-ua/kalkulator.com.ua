---
categories:
- environment
faq:
- answer: 'Total mechanical energy is the sum of potential and kinetic energy: E =
    mgh + ½mv².'
  question: How to calculate total mechanical energy?
- answer: 'Energy that an object has due to its position in a gravitational field.
    Formula: PE = mgh.'
  question: What is potential energy?
- answer: 'Energy of motion. Formula: KE = ½mv².'
  question: What is kinetic energy?
- answer: This calculator uses g = 9.81 m/s²  -  standard gravitational acceleration
    on Earth's surface.
  question: What value is used for g?
- answer: When no non-conservative forces (like friction or air resistance) act on
    the system.
  question: When is mechanical energy conserved?
layout: calculator
permalink: /en/calculators/energy/
scripts:
- /en/js/energy.js
seo:
  content: "<h2>Energy Conservation Calculator</h2>\n<p>Enter object mass (in kg),\
    \ height (in meters) and velocity (in m/s)  -  the calculator will compute potential,\
    \ kinetic and total mechanical energy.</p>\n\n<h3>Types of mechanical energy:</h3>\n\
    <ul>\n  <li><strong>Potential Energy (PE):</strong> Energy due to position in\
    \ gravitational field. Formula: PE = mgh</li>\n  <li><strong>Kinetic Energy (KE):</strong>\
    \ Energy due to motion. Formula: KE = ½mv²</li>\n  <li><strong>Total Mechanical\
    \ Energy:</strong> Sum of potential and kinetic energy: E = PE + KE</li>\n</ul>\n\
    \n<h3>Conservation of Energy Law:</h3>\n<p>In the absence of friction and air\
    \ resistance, the total mechanical energy of an object remains constant. As an\
    \ object falls, potential energy converts to kinetic energy, but their sum stays\
    \ the same.</p>\n\n<h3>Examples:</h3>\n<ul>\n  <li><strong>At maximum height:</strong>\
    \ All energy is potential (v = 0)</li>\n  <li><strong>At ground level:</strong>\
    \ All energy is kinetic (h = 0)</li>\n  <li><strong>In between:</strong> Mix of\
    \ both potential and kinetic energy</li>\n</ul>\n\n<h3>Applications:</h3>\n<ul>\n\
    \  <li>Pendulum motion analysis</li>\n  <li>Projectile motion problems</li>\n\
    \  <li>Roller coaster physics</li>\n  <li>Free fall calculations</li>\n</ul>\n"
  description: Calculate potential energy (mgh), kinetic energy ((mv²)/2) and total
    mechanical energy of an object. Convenient online calculator for physics students.
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
  title: Energy Conservation Calculator Online
title: Energy Conservation Calculator
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