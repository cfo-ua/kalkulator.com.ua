---
layout: calculator
title: "Molar Mass Calculator"
categories: [school]
seo:
  title: "Molar Mass Calculator | School Chemistry Calculators"
  description: "Calculate molar mass of chemical compounds online by chemical formula. Perfect for students, teachers, and scientists."
  keywords:
    - molar mass calculator
    - chemistry calculator
    - molecular weight
    - chemical formula
    - school chemistry
    - calculate molar mass
    - H2O
    - NaCl
    - chemistry tools
    - atomic mass
  content: |
    <h2>Molar Mass Calculator</h2>
    <p>Enter a chemical formula (e.g., H2O, CO2) to calculate its molar mass.</p>
    
    <h3>What is molar mass?</h3>
    <p>Molar mass is the mass of one mole of a substance, expressed in grams per mole (g/mol). It equals the sum of atomic masses of all atoms in the molecule.</p>
    
    <h3>How to use the calculator?</h3>
    <p>Enter the chemical formula using proper notation:</p>
    <ul>
      <li>Element symbols: H, O, C, Na, Cl, etc.</li>
      <li>Numbers after elements: H2O, CO2, CaCl2</li>
      <li>Parentheses for complex compounds: Ca(OH)2, Al2(SO4)3</li>
    </ul>
    
    <h3>Examples:</h3>
    <ul>
      <li><strong>H2O</strong> (water) = 18.016 g/mol</li>
      <li><strong>NaCl</strong> (salt) = 58.44 g/mol</li>
      <li><strong>CO2</strong> (carbon dioxide) = 44.01 g/mol</li>
      <li><strong>CaCO3</strong> (calcium carbonate) = 100.09 g/mol</li>
    </ul>
    
    <h3>Applications:</h3>
    <ul>
      <li>Stoichiometric calculations</li>
      <li>Solution preparation</li>
      <li>Laboratory work</li>
      <li>Chemical analysis</li>
    </ul>
scripts:
  - /en/js/molar-mass.js
faq:
  - question: What is molar mass?
    answer: "Molar mass is the mass of 1 mole of a substance, calculated in g/mol."
  - question: How to use the calculator?
    answer: "Enter the chemical formula, for example NaCl, H2SO4."
  - question: What symbols can be used in the formula?
    answer: "Use capital and lowercase Latin letters, for example Fe2O3 or Ca(OH)2. Parentheses and subscripts are supported."
  - question: Does the calculator handle complex formulas?
    answer: "Yes, the calculator supports complex chemical formulas with multiple elements, parentheses, and coefficients."
  - question: What if I enter an unknown element?
    answer: "The calculator will show an error message if the formula contains elements not in the database."
---

<form id="molar-mass-form" autocomplete="off">
  <label>
    Formula:
    <input type="text" id="molar-input" placeholder="Example: H2O" required>
  </label>
  <button type="submit">Calculate</button>
</form>
<div id="molar-mass-result" class="result"></div>