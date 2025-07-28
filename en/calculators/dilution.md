---
layout: calculator
title: "Solution Dilution Calculator"
categories: [school]
seo:
  title: "Solution Dilution Calculator Online  -  C₁V₁ = C₂V₂ Formula for Chemistry and Biology"
  description: "Online calculator for calculating concentration or volume of solution during dilution. Use C₁V₁ = C₂V₂ formula for chemistry, biology, medicine and laboratory practice."
  keywords:
    - solution dilution calculator
    - online solution calculator
    - C1V1 = C2V2 formula
    - concentration calculation
    - chemistry calculator
    - substance dilution
    - how to dilute solution
    - dilution problems
    - school chemistry calculator
    - solution concentration
  content: |
    <h2>Solution Dilution Calculator</h2>
    <p>Enter any three parameters out of four (C₁, V₁, C₂, V₂)  -  the calculator will find the fourth.</p>
    
    <h3>Dilution Formula:</h3>
    <p><strong>C₁V₁ = C₂V₂</strong></p>
    <ul>
      <li><strong>C₁</strong> = Initial concentration</li>
      <li><strong>V₁</strong> = Initial volume</li>
      <li><strong>C₂</strong> = Final concentration</li>
      <li><strong>V₂</strong> = Final volume</li>
    </ul>
    
    <h3>How dilution works:</h3>
    <p>When you dilute a solution, you add solvent (usually water) to decrease the concentration. The amount of solute remains constant, but it's distributed in a larger volume.</p>
    
    <h3>Units to use:</h3>
    <ul>
      <li><strong>Concentration:</strong> mol/L (molarity)</li>
      <li><strong>Volume:</strong> L (liters)</li>
      <li>Make sure all units are consistent for accurate results</li>
    </ul>
    
    <h3>Applications:</h3>
    <ul>
      <li>Laboratory solution preparation</li>
      <li>Chemistry homework problems</li>
      <li>Pharmaceutical calculations</li>
      <li>Biological sample preparation</li>
      <li>Quality control in manufacturing</li>
    </ul>
    
    <h3>Example:</h3>
    <p>If you have 0.5 L of 2 M solution and want 1 M final concentration, the calculator shows you need a final volume of 1 L (add 0.5 L of water).</p>
scripts:
  - /en/js/dilution.js
faq:
  - question: What is the dilution formula?
    answer: "C₁V₁ = C₂V₂  -  this basic formula for dilution calculations means the amount of substance before and after dilution remains unchanged."
  - question: How to properly use this calculator?
    answer: "Enter three of the four values: initial concentration (C₁), initial volume (V₁), final concentration (C₂), or final volume (V₂). The calculator will compute the fourth value."
  - question: What units should I use?
    answer: "Enter concentration in mol/L and volume in liters. All values must be in consistent units for correct results."
  - question: What problems is this calculator suitable for?
    answer: "Useful for students, laboratory technicians, and teachers when solving chemistry, biology, medicine, pharmacy problems, etc."
  - question: What if I enter wrong units?
    answer: "Wrong units can lead to incorrect results. For example, if volume is in mL instead of L, the result will be 1000 times larger or smaller."
  - question: Can this calculator be used for alcohol or medicine dilution?
    answer: "Yes, the formula applies to any solutions where the amount of active substance doesn't change  -  including ethanol, iodine, medications, etc."
---

<form id="dilution-form" autocomplete="off">
  <label>
    Initial concentration (C₁, mol/L):
    <input type="number" id="dil-c1">
  </label>
  <label>
    Initial volume (V₁, L):
    <input type="number" id="dil-v1">
  </label>
  <label>
    Final concentration (C₂, mol/L):
    <input type="number" id="dil-c2">
  </label>
  <label>
    Final volume (V₂, L):
    <input type="number" id="dil-v2">
  </label>
  <button type="submit">Calculate</button>
</form>
<div id="dilution-result" class="result"></div>