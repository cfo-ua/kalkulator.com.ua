---
layout: calculator
title: "Currency Converter"
categories: [conversion]
permalink: /en/calculators/currency/
seo:
  title: "Currency Converter — Exchange Rates USD, EUR, UAH"
  description: "Convert between different currencies with current exchange rates. Support for USD, EUR, UAH and other major currencies."
  keywords:
    - currency converter
    - exchange rates
    - USD to EUR
    - currency calculator
    - money converter
  content: |
    <h2>Currency Converter</h2>
    <p>Convert between different currencies using current exchange rates. Our currency converter supports major world currencies including USD, EUR, UAH, GBP, and more.</p>
scripts:
  - /assets/js/currency.js
faq:
  - question: How often are exchange rates updated?
    answer: "Exchange rates are updated daily based on data from the National Bank of Ukraine and other reliable sources."
  - question: Which currencies are supported?
    answer: "We support major world currencies including USD, EUR, UAH, GBP, JPY, CHF, CAD, AUD and others."
  - question: Are the rates real-time?
    answer: "The rates are updated daily and reflect the official exchange rates, but may not be real-time trading rates."
---

<form id="currency-converter" autocomplete="off">
  <div class="calc-section">
    <h3>Convert Currency</h3>
    <div class="input-group">
      <label for="amount">Amount:</label>
      <input type="number" id="amount" step="0.01" min="0" placeholder="Enter amount">
    </div>
    <div class="input-row">
      <div class="input-group">
        <label for="fromCurrency">From:</label>
        <select id="fromCurrency">
          <option value="USD">USD - US Dollar</option>
          <option value="EUR">EUR - Euro</option>
          <option value="UAH" selected>UAH - Ukrainian Hryvnia</option>
          <option value="GBP">GBP - British Pound</option>
          <option value="JPY">JPY - Japanese Yen</option>
          <option value="CHF">CHF - Swiss Franc</option>
          <option value="CAD">CAD - Canadian Dollar</option>
          <option value="AUD">AUD - Australian Dollar</option>
        </select>
      </div>
      <div class="input-group">
        <label for="toCurrency">To:</label>
        <select id="toCurrency">
          <option value="USD" selected>USD - US Dollar</option>
          <option value="EUR">EUR - Euro</option>
          <option value="UAH">UAH - Ukrainian Hryvnia</option>
          <option value="GBP">GBP - British Pound</option>
          <option value="JPY">JPY - Japanese Yen</option>
          <option value="CHF">CHF - Swiss Franc</option>
          <option value="CAD">CAD - Canadian Dollar</option>
          <option value="AUD">AUD - Australian Dollar</option>
        </select>
      </div>
    </div>
    <button type="button" id="convertBtn" class="btn-primary">Convert</button>
    <div class="result" id="currencyResult"></div>
  </div>
</form>