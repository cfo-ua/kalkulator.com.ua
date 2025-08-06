---
layout: calculator
title: "Logarithm Calculator"
categories: [school]
seo:
  title: "Logarithm Calculator Online — Calculate Natural, Common Logarithms"
  description: "Calculate logarithms online: natural (ln), common (log), binary (log₂), and custom base. Calculator supports real numbers and shows step-by-step solutions."
  keywords:
    - logarithm calculator
    - log calculator online
    - natural logarithm
    - common logarithm
    - ln calculator
    - log10 calculator
    - logarithm with base
    - mathematics
    - school math
    - algebra
    - calculate logarithm
    - logarithmic functions
  content: |
    <h2>Online Logarithm Calculator</h2>
    <p>A logarithm is the power to which a base must be raised to produce a given number. Our calculator allows you to compute different types of logarithms quickly and accurately.</p>

    <h3>Types of Logarithms:</h3>
    <ul>
      <li><strong>Natural logarithm (ln):</strong> base e ≈ 2.718</li>
      <li><strong>Common logarithm (log or log₁₀):</strong> base 10</li>
      <li><strong>Binary logarithm (log₂):</strong> base 2</li>
      <li><strong>Custom base logarithm:</strong> any number > 0 and ≠ 1</li>
    </ul>

    <h3>Where logarithms are used:</h3>
    <ul>
      <li><strong>Mathematics:</strong> solving equations, inequalities</li>
      <li><strong>Physics:</strong> decibels, pH, earthquake magnitude</li>
      <li><strong>Economics:</strong> compound interest, growth models</li>
      <li><strong>Computer Science:</strong> algorithm complexity</li>
      <li><strong>Chemistry:</strong> solution acidity (pH)</li>
    </ul>

    <h3>Logarithm Properties:</h3>
    <ul>
      <li>log<sub>a</sub>(xy) = log<sub>a</sub>(x) + log<sub>a</sub>(y)</li>
      <li>log<sub>a</sub>(x/y) = log<sub>a</sub>(x) - log<sub>a</sub>(y)</li>
      <li>log<sub>a</sub>(x<sup>n</sup>) = n × log<sub>a</sub>(x)</li>
      <li>log<sub>a</sub>(a) = 1</li>
      <li>log<sub>a</sub>(1) = 0</li>
    </ul>

    <p>This calculator is useful for students, engineers, scientists, and anyone working with exponential functions.</p>
scripts:
  - /en/js/logarithm-calculator.js
faq:
  - question: What is a natural logarithm?
    answer: "Natural logarithm (ln) is a logarithm with base e ≈ 2.718281828. It's widely used in mathematics and natural sciences."
  - question: What's the difference between log and ln?
    answer: "log (or log₁₀) is the common logarithm with base 10, ln is the natural logarithm with base e. log(100) = 2, ln(e) = 1."
  - question: Can you calculate the logarithm of a negative number?
    answer: "In real numbers, the logarithm of a negative number is undefined. Logarithms exist only for positive numbers."
  - question: What does log₂(8) = 3 mean?
    answer: "This means that 2³ = 8. The logarithm shows what power the base (2) must be raised to get the number (8)."
  - question: How to convert logarithm from one base to another?
    answer: "Use the change of base formula: log<sub>a</sub>(x) = ln(x) / ln(a) or log<sub>a</sub>(x) = log₁₀(x) / log₁₀(a)."
  - question: Why are logarithms needed in real life?
    answer: "Logarithms are used to measure sound intensity (decibels), acidity (pH), earthquake magnitude, in financial calculations and IT."
---
<form id="logarithm-form" autocomplete="off">
  <div class="input-group">
    <label>
      Logarithm type:
      <select id="log-type" required>
        <option value="natural">Natural (ln)</option>
        <option value="decimal">Common (log)</option>
        <option value="binary">Binary (log₂)</option>
        <option value="custom">Custom base</option>
      </select>
    </label>
  </div>

  <div id="base-group" class="input-group" style="display: none;">
    <label>
      Logarithm base:
      <input type="number" id="log-base" placeholder="Example: 5" min="0.001" step="any">
    </label>
  </div>

  <div class="input-group">
    <label>
      Number (argument):
      <input type="number" id="log-number" placeholder="Example: 100" min="0.001" step="any" required>
    </label>
  </div>

  <button type="submit">Calculate Logarithm</button>
</form>

<div id="logarithm-result" class="result"></div>