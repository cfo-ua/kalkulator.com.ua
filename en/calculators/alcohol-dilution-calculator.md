---
layout: calculator
title: "Alcohol Dilution Calculator"
categories: [health]
seo:
  title: "Alcohol Dilution Calculator Online — Calculate Proportions to Reduce ABV"
  description: "Calculate how much water to add to alcohol to achieve desired ABV. Simple calculator for home brewing, distilling, and cocktail making."
  keywords:
    - alcohol dilution calculator
    - dilute alcohol with water
    - reduce alcohol strength
    - alcohol proportions
    - home brewing
    - distilling
    - cocktails
    - ethyl alcohol
    - alcohol by volume
    - ABV calculator
  content: |
    <h2>Online Alcohol Dilution Calculator</h2>
    <p>🍷 This calculator helps you accurately determine how much water to add to an alcoholic beverage to achieve the desired alcohol by volume (ABV). A useful tool for home brewing, making tinctures, liqueurs, and cocktails.</p>

    <h3>🔬 How does alcohol dilution work?</h3>
    <p>When mixing alcohol with water, the volume percentage of alcohol decreases. The calculator uses mass balance formulas for precise proportion calculations.</p>

    <h3>📋 Calculator applications:</h3>
    <ul>
      <li><strong>Home brewing:</strong> adjusting wine strength</li>
      <li><strong>Distilling:</strong> reducing distillate strength</li>
      <li><strong>Making tinctures:</strong> achieving optimal ABV</li>
      <li><strong>Cocktails:</strong> diluting strong spirits</li>
      <li><strong>Medical purposes:</strong> preparing alcohol solutions</li>
    </ul>

    <h3>⚠️ Important notes:</h3>
    <ul>
      <li>Use only drinking water or distilled water</li>
      <li>Add water to alcohol, not vice versa</li>
      <li>Dilution is an irreversible process</li>
      <li>Temperature affects measurement accuracy</li>
    </ul>

    <p>🎯 The calculator ensures high calculation accuracy for professional and home use.</p>
scripts:
  - /en/js/alcohol-dilution-calculator.js
faq:
  - question: How to properly dilute alcohol with water?
    answer: "Always add water to alcohol, not the other way around. This allows better process control and prevents rapid alcohol evaporation."
  - question: What water should I use for dilution?
    answer: "It's best to use distilled or soft drinking water without impurities. Hard water can worsen the taste of the beverage."
  - question: Does temperature affect dilution?
    answer: "Yes, temperature affects alcohol density. For accurate calculations, all components should have the same temperature, preferably 20°C (68°F)."
  - question: Can alcohol be diluted to any strength?
    answer: "Yes, theoretically you can reduce the strength to any desired level, but practically people stop at 10-15% ABV to preserve taste qualities."
  - question: How to check the strength after dilution?
    answer: "Use an alcoholometer or hydrometer to accurately measure the strength of the resulting beverage."
  - question: Does volume change when mixing?
    answer: "Yes, when mixing alcohol with water, the total volume slightly decreases due to liquid contraction. The calculator accounts for this effect."
---
<form id="alcohol-dilution-form" autocomplete="off">
  <div class="form-group">
    <label>
      🍶 Initial alcohol volume (ml):
      <input type="number" id="initial-volume" placeholder="500" value="500" step="0.1" min="0" required>
    </label>
  </div>
  
  <div class="form-group">
    <label>
      📊 Initial ABV (%):
      <input type="number" id="initial-alcohol" placeholder="70" value="70" step="0.1" min="0" max="100" required>
    </label>
  </div>
  
  <div class="form-group">
    <label>
      🎯 Target ABV (%):
      <input type="number" id="target-alcohol" placeholder="40" value="40" step="0.1" min="0" max="100" required>
    </label>
  </div>
  
  <button type="submit">🧮 Calculate</button>
</form>

<div id="alcohol-dilution-result" class="result"></div>