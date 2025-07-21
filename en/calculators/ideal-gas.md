---
layout: calculator
title: "Ideal Gas Law Calculator (PV=nRT)"
categories: [school]
permalink: /en/calculators/ideal-gas/
seo:
  title: "Ideal Gas Law Calculator  -  PV=nRT Formula | School Calculators"
  description: "Calculate pressure, volume, amount of substance, or temperature using PV=nRT formula. Convenient online calculator for chemistry and physics."
  keywords:
    - ideal gas law
    - PV=nRT formula
    - gas law calculator
    - universal gas constant
    - physics calculator
    - chemistry calculator
    - school calculator
    - gas equation
    - thermodynamics
  content: |
    <h2>Ideal Gas Law Calculator (PV = nRT)</h2>
    <p>Enter any three of the four parameters (pressure, volume, amount of substance, temperature)  -  the calculator will automatically find the fourth. Gas constant R = 0.0821 L·atm/(mol·K).</p>
    
    <h3>Ideal Gas Law Formula:</h3>
    <p><strong>PV = nRT</strong></p>
    <ul>
      <li><strong>P</strong> = Pressure (atm)</li>
      <li><strong>V</strong> = Volume (L)</li>
      <li><strong>n</strong> = Amount of substance (mol)</li>
      <li><strong>R</strong> = Universal gas constant (0.0821 L·atm/(mol·K))</li>
      <li><strong>T</strong> = Temperature (K)</li>
    </ul>
    
    <h3>What is an ideal gas?</h3>
    <p>An ideal gas is a theoretical model where gas molecules have no volume and no intermolecular forces. Real gases approximate ideal behavior under certain conditions (high temperature, low pressure).</p>
    
    <h3>Units to use:</h3>
    <ul>
      <li><strong>Pressure:</strong> atmospheres (atm)</li>
      <li><strong>Volume:</strong> liters (L)</li>
      <li><strong>Amount:</strong> moles (mol)</li>
      <li><strong>Temperature:</strong> Kelvin (K) - remember: K = °C + 273.15</li>
    </ul>
    
    <h3>Applications:</h3>
    <ul>
      <li>Chemical reaction calculations</li>
      <li>Gas storage and transport</li>
      <li>Thermodynamics problems</li>
      <li>Engineering calculations</li>
      <li>Laboratory gas analysis</li>
    </ul>
scripts:
  - /en/js/ideal-gas.js
faq:
  - question: What is the universal gas constant?
    answer: "This calculator uses R = 0.0821 L·atm/(mol·K)  -  the standard value for calculations in the specified units."
  - question: What units should I use?
    answer: "Pressure in atmospheres (atm), volume in liters (L), amount in moles (mol), temperature in Kelvin (K)."
  - question: What is an ideal gas?
    answer: "An ideal gas is a model that describes gas behavior under conditions of no intermolecular interactions, perfectly obeying PV = nRT."
  - question: Where is the PV=nRT formula used?
    answer: "This formula is widely used in chemistry, physics, thermodynamics, and engineering for gas state calculations."
  - question: How to convert Celsius to Kelvin?
    answer: "Use the formula: K = °C + 273.15. For example, 25°C = 25 + 273.15 = 298.15 K."
---

<form id="ideal-gas-form" autocomplete="off">
  <label>
    Pressure (P, atm):
    <input type="number" id="ig-p" step="any">
  </label>
  <label>
    Volume (V, L):
    <input type="number" id="ig-v" step="any">
  </label>
  <label>
    Amount (n, mol):
    <input type="number" id="ig-n" step="any">
  </label>
  <label>
    Temperature (T, K):
    <input type="number" id="ig-t" step="any">
  </label>
  <button type="submit">Calculate</button>
</form>
<div id="ideal-gas-result" class="result"></div>