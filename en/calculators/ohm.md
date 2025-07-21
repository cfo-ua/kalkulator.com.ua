---
layout: calculator
title: "Ohm's Law Calculator"
categories: [school]
permalink: /en/calculators/ohm/
seo:
  title: "Ohm's Law Calculator | School Physics Calculators"
  description: "Online calculator for calculating voltage, current or resistance using Ohm's law formula (U = I × R). Perfect for students and electrical calculations."
  keywords:
    - ohm's law
    - ohm law calculator
    - physics
    - voltage calculator
    - current calculator
    - resistance calculator
    - electrical calculator
    - school physics
    - electricity
    - circuit analysis
  content: |
    <h2>Ohm's Law Calculator</h2>
    <p>Enter any two of the three parameters (U, I, R)  -  the third will be calculated automatically.</p>
    
    <h3>What is Ohm's Law?</h3>
    <p>Ohm's Law states that the current through a conductor is directly proportional to the voltage across it and inversely proportional to its resistance.</p>
    
    <h3>Ohm's Law Formula:</h3>
    <p><strong>U = I × R</strong></p>
    <ul>
      <li><strong>U</strong> = Voltage (Volts)</li>
      <li><strong>I</strong> = Current (Amperes)</li>
      <li><strong>R</strong> = Resistance (Ohms)</li>
    </ul>
    
    <h3>Applications:</h3>
    <ul>
      <li>Circuit design and analysis</li>
      <li>Electrical troubleshooting</li>
      <li>Power calculations</li>
      <li>Component selection</li>
    </ul>
scripts:
  - /en/js/ohm.js
faq:
  - question: What is Ohm's law formula?
    answer: "U = I × R, where U is voltage (V), I is current (A), R is resistance (Ω)."
  - question: What can be calculated with this calculator?
    answer: "Any of the three parameters if the other two are known."
  - question: What units should I use for input values?
    answer: "U in volts (V), I in amperes (A), R in ohms (Ω)."
  - question: Can I calculate power using Ohm's law?
    answer: "Yes, power P = U × I = I²R = U²/R. You can derive power from any two known values."
---

<form id="ohm-form" autocomplete="off">
  <label>
    Voltage (U, V):
    <input type="number" id="ohm-u" step="any">
  </label>
  <label>
    Current (I, A):
    <input type="number" id="ohm-i" step="any">
  </label>
  <label>
    Resistance (R, Ω):
    <input type="number" id="ohm-r" step="any">
  </label>
  <button type="submit">Calculate</button>
</form>
<div id="ohm-result" class="result"></div>