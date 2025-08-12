---
layout: calculator
title: "Stoichiometry Calculator for Chemical Reactions"
categories: [school]
seo:
  title: "Stoichiometry Calculator - Chemical Reaction Calculations | Chemistry Tool"
  description: "Calculate quantities of substances in chemical reactions using stoichiometric coefficients. Moles, masses, gas volumes at STP."
  keywords:
    - stoichiometry
    - chemical reactions
    - molar mass
    - moles
    - gas volume
    - chemical calculations
    - conservation of mass
    - reaction coefficients
    - chemistry
    - school calculator
  content: |
    <h2>⚗️ Stoichiometry Calculator</h2>
    <p>Powerful tool for calculating quantities of substances in chemical reactions. Calculate moles, masses, and volumes based on stoichiometric coefficients.</p>
    
    <h3>🎯 Calculator Features:</h3>
    <ul>
      <li>✅ Calculate based on moles</li>
      <li>✅ Convert between mass and moles</li>
      <li>✅ Calculate gas volumes at STP</li>
      <li>✅ Determine limiting reagent</li>
      <li>✅ Theoretical and practical yield</li>
    </ul>
scripts:
  - /en/js/stoichiometry.js
faq:
  - question: What is stoichiometry?
    answer: "Stoichiometry is the branch of chemistry that studies quantitative relationships between substances in chemical reactions based on the law of conservation of mass."
  - question: How to find molar mass?
    answer: "Molar mass equals the sum of atomic masses of all atoms in a molecule. For example, for H₂O: M = 2×1 + 16 = 18 g/mol."
  - question: What is a limiting reagent?
    answer: "The limiting reagent is the substance that is completely consumed first in a reaction and determines the maximum amount of product."
  - question: How to calculate gas volume at STP?
    answer: "At standard conditions (0°C, 1 atm), 1 mole of any gas occupies 22.4 L. V = n × 22.4 L/mol."
  - question: What is reaction yield?
    answer: "Reaction yield is the ratio of actually obtained product quantity to theoretically possible amount, expressed as a percentage."
---

<div class="calculator-container">
  <form id="stoichiometry-form">
    <div class="reaction-setup">
      <h3>⚖️ Reaction Setup</h3>
      
      <div class="input-group">
        <label for="st-equation">📝 Chemical equation:</label>
        <input type="text" id="st-equation" placeholder="e.g.: 2H2 + O2 → 2H2O">
        <small>Enter balanced equation or use a preset example</small>
      </div>
      
      <div class="preset-buttons">
        <button type="button" class="preset-btn" data-equation="2H2 + O2 → 2H2O">Water formation</button>
        <button type="button" class="preset-btn" data-equation="CH4 + 2O2 → CO2 + 2H2O">Methane combustion</button>
        <button type="button" class="preset-btn" data-equation="2Na + Cl2 → 2NaCl">Salt formation</button>
        <button type="button" class="preset-btn" data-equation="CaCO3 → CaO + CO2">Carbonate decomposition</button>
      </div>
    </div>

    <div class="calculation-setup">
      <h3>🧮 Calculations</h3>
      
      <div class="input-row">
        <div class="input-group">
          <label for="st-substance">🔬 Substance:</label>
          <select id="st-substance">
            <option value="">Select substance</option>
          </select>
        </div>
        
        <div class="input-group">
          <label for="st-amount-type">📊 Quantity type:</label>
          <select id="st-amount-type">
            <option value="moles">Amount of substance (mol)</option>
            <option value="mass">Mass (g)</option>
            <option value="volume">Gas volume at STP (L)</option>
          </select>
        </div>
      </div>
      
      <div class="input-row">
        <div class="input-group">
          <label for="st-amount">📏 Quantity:</label>
          <input type="number" id="st-amount" step="0.01" placeholder="Enter value">
        </div>
        
        <div class="input-group">
          <label for="st-molar-mass">⚛️ Molar mass (g/mol):</label>
          <input type="number" id="st-molar-mass" step="0.01" placeholder="Auto or enter">
        </div>
      </div>
    </div>
    
    <div class="button-group">
      <button type="button" id="st-calculate" class="btn-primary">🧪 Calculate</button>
      <button type="button" id="st-clear" class="btn-secondary">🗑️ Clear</button>
    </div>
  </form>
</div>

<!--CHART_SPLIT-->

<div id="stoichiometry-result" class="result-section"></div>

<div class="info-section">
  <h3>📚 Reference Information</h3>
  
  <div class="insight-cards">
    <div class="insight-card info">
      <h6>⚛️ Molar Masses</h6>
      <div class="small-text">
        H: 1 g/mol<br>
        C: 12 g/mol<br>
        N: 14 g/mol<br>
        O: 16 g/mol<br>
        Na: 23 g/mol<br>
        Cl: 35.5 g/mol
      </div>
    </div>
    
    <div class="insight-card success">
      <h6>📐 Formulas</h6>
      <div class="small-text">
        n = m / M<br>
        V = n × 22.4 L/mol<br>
        Yield = (actual/theoretical) × 100%<br>
        Coefficients = ratios
      </div>
    </div>
    
    <div class="insight-card warning">
      <h6>💡 Tips</h6>
      <div class="small-text">
        Always balance equations<br>
        Check units of measurement<br>
        Round to significant figures<br>
        Consider reaction conditions
      </div>
    </div>
  </div>
  
  <div class="examples-section">
    <h4>📖 Calculation Examples</h4>
    <div class="example-grid">
      <div class="example-item">
        <strong>Example 1:</strong><br>
        2H₂ + O₂ → 2H₂O<br>
        If 4 mol H₂ available:<br>
        Need 2 mol O₂<br>
        Will form 4 mol H₂O
      </div>
      <div class="example-item">
        <strong>Example 2:</strong><br>
        CH₄ + 2O₂ → CO₂ + 2H₂O<br>
        16 g CH₄ (1 mol):<br>
        Need 64 g O₂ (2 mol)<br>
        Will form 44 g CO₂
      </div>
    </div>
  </div>
</div>