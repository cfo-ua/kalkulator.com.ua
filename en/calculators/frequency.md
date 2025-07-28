---
layout: calculator
title: "Period and Frequency Calculator"
categories: [school]
seo:
  title: "Period and Frequency Calculator Online"
  description: "Quickly calculate period (T) or frequency (f) using the formula T = 1/f. Convenient online calculator for physics and engineering students."
  keywords:
    - frequency calculator
    - period calculator
    - physics calculator
    - oscillation frequency
    - wave frequency
    - school physics
    - frequency formula
    - hertz calculator
  content: |
    <h2>Period and Frequency Calculator</h2>
    <p>Enter either period (T, seconds) or frequency (f, hertz)  -  the calculator will automatically compute the other value.</p>
    
    <h3>Relationship between period and frequency:</h3>
    <p>Period and frequency are inversely related:</p>
    <ul>
      <li><strong>Frequency formula:</strong> f = 1/T</li>
      <li><strong>Period formula:</strong> T = 1/f</li>
    </ul>
    
    <h3>Definitions:</h3>
    <ul>
      <li><strong>Period (T):</strong> Time for one complete cycle, measured in seconds (s)</li>
      <li><strong>Frequency (f):</strong> Number of cycles per second, measured in hertz (Hz)</li>
    </ul>
    
    <h3>Examples:</h3>
    <ul>
      <li><strong>60 Hz AC power:</strong> T = 1/60 = 0.0167 seconds</li>
      <li><strong>Pendulum with T = 2s:</strong> f = 1/2 = 0.5 Hz</li>
      <li><strong>Radio wave 100 MHz:</strong> T = 1/(100×10⁶) = 10 nanoseconds</li>
    </ul>
    
    <h3>Applications:</h3>
    <ul>
      <li>Sound and audio engineering</li>
      <li>Radio and telecommunications</li>
      <li>Mechanical vibrations</li>
      <li>Electrical circuits (AC analysis)</li>
      <li>Wave physics</li>
    </ul>
scripts:
  - /en/js/frequency.js
faq:
  - question: How are period and frequency related?
    answer: "Period (T) and frequency (f) are related by: T = 1/f, f = 1/T. This calculator helps quickly convert between values."
  - question: How to calculate frequency if period is known?
    answer: "Frequency is calculated using f = 1/T, where T is the period in seconds."
  - question: What is this period and frequency calculator used for?
    answer: "This calculator helps quickly and accurately compute period or frequency, important in physics, electronics, and engineering."
  - question: What units are used for period and frequency?
    answer: "Period is measured in seconds (s), and frequency in hertz (Hz), which corresponds to cycles per second."
  - question: Can I enter both period and frequency simultaneously?
    answer: "No, enter only one value. The calculator will compute the other automatically."
---

<form id="frequency-form" autocomplete="off">
  <label>
    Period (T, s):
    <input type="number" id="freq-t" min="0">
  </label>
  <label>
    Frequency (f, Hz):
    <input type="number" id="freq-f" min="0">
  </label>
  <button type="submit">Calculate</button>
</form>
<div id="frequency-result" class="result"></div>