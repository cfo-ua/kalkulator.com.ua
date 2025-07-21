---
layout: calculator
title: "Speed Converter Online"
categories: [conversion]
permalink: /en/calculators/speed-converter/
seo:
  title: "Speed Converter  -  km/h, m/s, mph, knots | Online Calculator"
  description: "Online calculator for speed conversion: kilometers per hour, meters per second, miles, knots, ft/s. Convenient for transport, aviation, sports and education."
  keywords:
    - speed converter
    - speed conversion
    - online speed calculator
    - km per hour to meters per second
    - miles to km
    - m/s to km/h
    - convert knots to km/h
    - speed in miles
    - speed in meters per second
    - speed calculator
  content: |
    <h2>Speed Converter Online</h2>
    <p>Convert speed from one unit to another in seconds. Support for the most common units: kilometers per hour, meters per second, miles per hour, knots, feet per second.</p>
    <ul>
      <li><b>Perfect for drivers, athletes, aviators, students and engineers.</b></li>
      <li>Clear interface, instant results.</li>
      <li>Works for free without registration.</li>
    </ul>
scripts:
  - /en/js/speed-converter.js
faq:
  - question: "What speed units are supported?"
    answer: "The calculator supports: km/h, m/s, miles per hour (mph), knots, feet per second (ft/s)."
  - question: "What might speed conversion be needed for?"
    answer: "For converting car speed, aircraft speed, running speed, swimming speed, physics formulas or GPS data."
  - question: "Are these accurate scientific coefficients?"
    answer: "Yes, the coefficients comply with international standards."
  - question: "Is the calculator available on mobile?"
    answer: "Yes, the interface is adapted for smartphones and tablets."
  - question: "Is this free?"
    answer: "Yes, this is a free online service with no limitations."
---

<form id="speed-converter-form" class="converter-form">
  <input type="number" id="speed-input" placeholder="Enter speed" required>
  <select id="speed-from">
    <option value="kmh" selected>km/h</option>
    <option value="ms">m/s</option>
    <option value="mph">mph</option>
    <option value="knot">knots</option>
    <option value="fts">ft/s</option>
  </select>
  <span>to</span>
  <select id="speed-to">
    <option value="kmh">km/h</option>
    <option value="ms">m/s</option>
    <option value="mph">mph</option>
    <option value="knot">knots</option>
    <option value="fts">ft/s</option>
  </select>
  <div id="speed-result" class="result"></div>
</form>