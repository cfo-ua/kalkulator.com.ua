---
layout: calculator
title: "Money Weight Calculator"
categories: [financial]
seo:
  title: "Money Weight Calculator — How Much Does a Million Dollars Weigh"
  description: "Find out how much money weighs in different denominations and currencies. Calculator for dollars, euros, pounds sterling weight. How much does a million dollars weigh?"
  keywords:
    - money weight
    - how much does dollar weigh
    - million dollars weight
    - banknote weight
    - currency weight
    - euro weight
    - money weight calculator
    - banknote mass
    - money facts
    - cash weight
  content: |
    <h2>Money and Currency Weight Calculator</h2>
    <p>Curious to know how much a million dollars weighs or your salary in banknotes? Our calculator will calculate the weight of any amount in different currencies and denominations.</p>

    <h3>Interesting facts about money weight:</h3>
    <ul>
      <li><strong>US Dollar:</strong> all banknotes weigh the same — 1 gram</li>
      <li><strong>Million dollars:</strong> in $100 bills weighs ~22 lbs (10 kg)</li>
      <li><strong>Euro:</strong> weight depends on denomination — from 0.63g to 1.02g</li>
      <li><strong>British Pound:</strong> modern banknotes weigh from 0.73g to 0.94g</li>
    </ul>

    <h3>Where this can be useful:</h3>
    <p><strong>Film industry:</strong> accurate calculations for money scenes</p>
    <p><strong>Cash transport:</strong> planning logistics for cash transportation</p>
    <p><strong>Curiosity:</strong> learn interesting facts about your savings</p>
    <p><strong>Education:</strong> visually demonstrate the value and weight of money</p>

    <h3>Supported currencies:</h3>
    <p>US Dollar, Euro, British Pound, Canadian Dollar and other popular currencies with current banknote weight data.</p>
scripts:
  - /en/js/money-weight.js
faq:
  - question: How much does a million dollars weigh in $100 bills?
    answer: "A million dollars in $100 bills (10,000 banknotes) weighs approximately 22 pounds (10 kilograms)."
  - question: Do all dollar bills weigh the same?
    answer: "Yes, all US dollar banknotes regardless of denomination weigh approximately 1 gram."
  - question: What's the heaviest banknote in the world?
    answer: "Euro banknotes vary in weight: €500 weighs 1.02g, while €5 weighs only 0.63g."
  - question: How much does a million British pounds weigh?
    answer: "A million pounds in £50 notes (20,000 banknotes) weighs approximately 18.8 kg."
  - question: Does banknote condition affect weight?
    answer: "Yes, worn banknotes can be 10-20% lighter due to material loss."
  - question: How much money can a person carry?
    answer: "A person can carry ~44 lbs (20kg), equivalent to ~$2 million in $100 bills."
---
<form id="money-weight-form" autocomplete="off">
  <div class="input-group">
    <label>
      Amount:
      <input type="number" id="amount" min="1" step="1" value="1000000" required>
    </label>
  </div>
  
  <div class="input-group">
    <label>
      Currency:
      <select id="currency" required>
        <option value="USD">US Dollar (USD)</option>
        <option value="EUR">Euro (EUR)</option>
        <option value="GBP">British Pound (GBP)</option>
        <option value="CAD">Canadian Dollar (CAD)</option>
        <option value="AUD">Australian Dollar (AUD)</option>
        <option value="CHF">Swiss Franc (CHF)</option>
        <option value="JPY">Japanese Yen (JPY)</option>
        <option value="UAH">Ukrainian Hryvnia (UAH)</option>
      </select>
    </label>
  </div>
  
  <div class="input-group">
    <label>
      Banknote denomination:
      <select id="denomination" required>
        <option value="auto">Optimal (fewest banknotes)</option>
        <!-- Options will be populated by JavaScript based on currency -->
      </select>
    </label>
  </div>
  
  <div class="input-group">
    <label>
      Banknote condition:
      <select id="condition">
        <option value="new">New (100%)</option>
        <option value="good">Good condition (90%)</option>
        <option value="used">Used (80%)</option>
        <option value="poor">Very worn (70%)</option>
      </select>
    </label>
  </div>
  
  <button type="submit">⚖️ Calculate Money Weight</button>
</form>

<div id="money-weight-result" class="result"></div>