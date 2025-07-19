---
layout: calculator
title: "Electrical Load Calculator"
categories: [construction]
seo:
  title: "Electrical Load Calculator | Home Electrical Power Requirements"
  description: "Calculate total electrical load for your home or building. Professional electrical calculator determines power requirements, circuit needs, and electrical panel sizing."
  keywords:
    - electrical load calculator
    - electrical power calculator
    - home electrical calculator
    - electrical panel calculator
    - electrical service calculator
    - circuit load calculator
    - electrical capacity calculator
    - electrical demand calculator
    - residential electrical calculator
    - electrical planning calculator
    - power consumption calculator
    - electrical sizing calculator
    - electrical requirements calculator
    - building electrical calculator
  content: |
    <h2>Electrical Load Calculator</h2>
    <p>Calculate the total <strong>electrical load</strong> for your home, office, or building. This professional electrical calculator helps determine power requirements, electrical panel sizing, and circuit planning for safe electrical installations.</p>

    <h3>What This Calculator Includes:</h3>
    <ul>
      <li><strong>Appliance list:</strong> add multiple electrical devices</li>
      <li><strong>Power consumption:</strong> watts for each appliance</li>
      <li><strong>Diversity factor:</strong> not all appliances run simultaneously</li>
      <li><strong>Total load calculation:</strong> actual power demand</li>
    </ul>

    <h3>Common Appliance Power Ratings:</h3>
    <ul>
      <li><strong>HVAC system:</strong> 3,000-5,000 watts</li>
      <li><strong>Electric water heater:</strong> 3,000-4,500 watts</li>
      <li><strong>Electric range/oven:</strong> 2,500-5,000 watts</li>
      <li><strong>Clothes dryer:</strong> 2,000-4,000 watts</li>
      <li><strong>Dishwasher:</strong> 1,500-2,500 watts</li>
      <li><strong>Microwave:</strong> 700-1,200 watts</li>
      <li><strong>Refrigerator:</strong> 400-800 watts</li>
      <li><strong>Lighting (LED):</strong> 5-20 watts per bulb</li>
    </ul>

    <h3>Diversity Factor Guidelines:</h3>
    <ul>
      <li><strong>Residential homes:</strong> 0.6-0.8 (not all appliances run together)</li>
      <li><strong>Small offices:</strong> 0.7-0.9 (moderate simultaneous use)</li>
      <li><strong>Commercial kitchens:</strong> 0.8-1.0 (high simultaneous use)</li>
      <li><strong>Industrial facilities:</strong> 0.9-1.0 (equipment runs continuously)</li>
    </ul>

    <h3>Electrical Panel Sizing:</h3>
    <ul>
      <li><strong>100 amp service:</strong> up to 24,000 watts (small homes)</li>
      <li><strong>150 amp service:</strong> up to 36,000 watts (medium homes)</li>
      <li><strong>200 amp service:</strong> up to 48,000 watts (large homes)</li>
      <li><strong>400 amp service:</strong> up to 96,000 watts (very large homes)</li>
    </ul>

    <h3>Safety Considerations:</h3>
    <ul>
      <li><strong>NEC compliance:</strong> follow National Electrical Code</li>
      <li><strong>Circuit protection:</strong> proper breaker sizing</li>
      <li><strong>Wire sizing:</strong> adequate conductor capacity</li>
      <li><strong>Professional installation:</strong> licensed electrician required</li>
    </ul>

    <h3>Load Calculation Methods:</h3>
    <ul>
      <li><strong>Standard method:</strong> NEC Article 220, Part III</li>
      <li><strong>Optional method:</strong> NEC Article 220, Part IV</li>
      <li><strong>Demand factors:</strong> reduce total for realistic loading</li>
      <li><strong>Future growth:</strong> plan for additional circuits</li>
    </ul>

    <p><em>Note: This calculator provides estimates for planning purposes. Always consult a licensed electrician for actual electrical installations and code compliance.</em></p>
scripts:
  - /en/js/electric-load.js
faq:
  - question: How do I calculate electrical load for my home?
    answer: "Add up all appliance wattages, then multiply by diversity factor (0.6-0.8 for homes). For example: 30,000 watts × 0.7 = 21,000 watts actual demand."
  - question: What is a diversity factor in electrical calculations?
    answer: "Diversity factor accounts for the fact that not all electrical appliances operate simultaneously. Typical residential diversity is 60-80%."
  - question: How do I determine what size electrical panel I need?
    answer: "Calculate total electrical load, then size panel for 125% of that load per NEC requirements. Add extra space for future circuits."
  - question: What's the difference between connected load and demand load?
    answer: "Connected load is total watts if everything ran at once. Demand load applies diversity factor for realistic maximum usage."
  - question: How do I plan for future electrical needs?
    answer: "Add 20-25% extra capacity beyond current needs for future appliances, electric vehicles, or home additions."
  - question: When do I need a professional electrical calculation?
    answer: "For new construction, major renovations, or commercial buildings. Licensed electricians perform detailed load calculations per local codes."
---

<form id="electric-load-form" autocomplete="off">
  <div id="electric-load-list">
    <div class="electric-load-row">
      <input type="text" class="electric-appliance" placeholder="Appliance name" />
      <input type="number" class="electric-power" min="0" step="any" placeholder="Power (watts)" />
    </div>
  </div>
  <button type="button" id="add-appliance">Add Appliance</button>
  <label>
    Diversity Factor (0.5-1.0):
    <select id="electric-simultaneous">
      <option value="0.6">Residential home (60%)</option>
      <option value="0.7">Average home (70%)</option>
      <option value="0.8">Large home/small office (80%)</option>
      <option value="0.9">Commercial space (90%)</option>
      <option value="1.0">Industrial/All equipment runs (100%)</option>
    </select>
  </label>
  <button type="submit">Calculate Load</button>
</form>
<div id="electric-load-result" class="result"></div>