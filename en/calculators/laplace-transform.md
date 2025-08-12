---
layout: calculator
title: "Laplace Transform Calculator"
categories: [school]
seo:
  title: "Laplace Transform Calculator | Mathematical Calculators"
  description: "Calculate Laplace transforms of elementary functions online. Find images of basic functions using the standard Laplace transform table."
  keywords:
    - laplace transform
    - function image
    - mathematical analysis
    - differential equations
    - laplace calculator
    - operational calculus
    - higher mathematics
    - engineering mathematics
    - transform table
    - inverse laplace
  content: |
    <h2>Laplace Transform Calculator 📊</h2>
    <p>Find the <strong>Laplace transform</strong> of elementary functions using our online calculator. Uses standard transform tables for quick and accurate calculations.</p>
    
    <h3>🔍 What is Laplace Transform?</h3>
    <p>The Laplace transform is an integral transform that converts a function of time f(t) into a function of complex variable F(s). It's widely used for solving differential equations and analyzing dynamic systems.</p>
    
    <h3>📐 Basic Formula</h3>
    <p><strong>L{f(t)} = F(s) = ∫[0→∞] f(t)·e^(-st) dt</strong></p>
    
    <h3>⚡ Supported Functions:</h3>
    <ul>
      <li><strong>Constant:</strong> L{c} = c/s</li>
      <li><strong>Power:</strong> L{t^n} = n!/s^(n+1)</li>
      <li><strong>Exponential:</strong> L{e^(at)} = 1/(s-a)</li>
      <li><strong>Sine:</strong> L{sin(at)} = a/(s²+a²)</li>
      <li><strong>Cosine:</strong> L{cos(at)} = s/(s²+a²)</li>
      <li><strong>Hyperbolic functions</strong></li>
      <li><strong>Products with t</strong></li>
    </ul>
    
    <h3>🎯 Applications:</h3>
    <p>Laplace transforms are essential in electrical engineering, control systems, signal processing, and solving linear differential equations with constant coefficients.</p>
scripts:
  - /en/js/laplace-transform.js
faq:
  - question: What is the Laplace transform?
    answer: "It's an integral transform that converts a time-domain function into a complex frequency-domain function. It simplifies solving differential equations by converting them to algebraic equations."
  - question: Why use Laplace transforms?
    answer: "Main applications include solving linear differential equations, analyzing electrical circuits, control systems design, and signal processing in engineering."
  - question: How to find the original function from its transform?
    answer: "Use the inverse Laplace transform or lookup tables that match transforms to their original functions."
  - question: What does parameter 's' represent?
    answer: "s is a complex variable s = σ + jω, where σ is the real part and ω is the imaginary part (frequency)."
  - question: What's the region of convergence?
    answer: "It's the set of values of s for which the Laplace transform integral converges. For most elementary functions, it's Re(s) > some real number."
---

<div class="form-section">
  <label for="function-type">🎯 Select function type:</label>
  <select id="function-type">
    <option value="constant">Constant: c</option>
    <option value="power">Power: t^n</option>
    <option value="exponential">Exponential: e^(at)</option>
    <option value="sin">Sine: sin(at)</option>
    <option value="cos">Cosine: cos(at)</option>
    <option value="sinh">Hyperbolic sine: sinh(at)</option>
    <option value="cosh">Hyperbolic cosine: cosh(at)</option>
    <option value="t_exp">t·e^(at)</option>
    <option value="t_sin">t·sin(at)</option>
    <option value="t_cos">t·cos(at)</option>
  </select>
</div>

<form id="laplace-form" autocomplete="off">
  <div id="parameter-inputs">
    <label>
      📊 Parameter:
      <input type="number" id="param-a" value="1" step="0.1" required>
    </label>
  </div>
  <button type="submit">🔄 Calculate Transform</button>
</form>

<div id="laplace-result" class="result"></div>