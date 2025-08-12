---
layout: calculator
title: "Error Propagation Calculator"
categories: [school]
seo:
  title: "Error Propagation Calculator Online | Measurement Uncertainty | Scientific Calculator"
  description: "Calculate error propagation in scientific measurements online. Support for linear combinations, products, quotients, and complex functions with automatic uncertainty calculation."
  keywords:
    - error propagation
    - measurement uncertainty
    - scientific calculations
    - statistics
    - measurement error
    - experimental physics
    - laboratory work
    - uncertainty analysis
    - propagation of errors
    - scientific method
    - metrology
    - data analysis
  content: |
    <h2>Error Propagation Calculator</h2>
    <p>Calculate the uncertainty of a result when there are errors in the input data. The calculator automatically applies error propagation rules for different mathematical operations.</p>
    
    <h3>What is Error Propagation?</h3>
    <p>Error propagation is a method for calculating the uncertainty of a result based on the uncertainties of input quantities. It's a key tool in scientific measurements and experiments.</p>
    
    <h3>Supported Operations:</h3>
    <ul>
      <li><strong>Addition/Subtraction:</strong> δ(A±B) = √(δA² + δB²)</li>
      <li><strong>Multiplication/Division:</strong> δ(A×B)/|A×B| = √((δA/A)² + (δB/B)²)</li>
      <li><strong>Power Function:</strong> δ(A^n)/|A^n| = |n| × δA/|A|</li>
      <li><strong>Square Root:</strong> δ(√A) = δA/(2√A)</li>
      <li><strong>Logarithm:</strong> δ(ln A) = δA/A</li>
      <li><strong>Exponential:</strong> δ(e^A) = |e^A| × δA</li>
    </ul>
    
    <h3>Applications:</h3>
    <ul>
      <li>Physics experiments</li>
      <li>Chemical analysis</li>
      <li>Engineering calculations</li>
      <li>Scientific research</li>
      <li>Laboratory measurements</li>
      <li>Quality control</li>
      <li>Calibration procedures</li>
    </ul>
    
    <h3>How to Use:</h3>
    <ol>
      <li>Select the type of operation (basic, functions, or linear combination)</li>
      <li>Enter the values and their uncertainties</li>
      <li>Click "Calculate Error" to get the result</li>
      <li>Review the detailed breakdown and relative error</li>
    </ol>
    
    <h3>Understanding Results:</h3>
    <p>Results are presented in the format: <strong>value ± uncertainty</strong>. The calculator also provides relative error as a percentage and shows the step-by-step calculation process.</p>
scripts:
  - /en/js/error-propagation-calculator.js
faq:
  - question: What is measurement uncertainty?
    answer: "Uncertainty is a parameter that characterizes the range of values within which the true value of a measured quantity may lie."
  - question: How should I report a result with error?
    answer: "Results should be written as: value ± error, for example: 9.81 ± 0.02 m/s². The error is usually rounded to 1-2 significant figures."
  - question: What is relative error?
    answer: "Relative error is the ratio of absolute error to the value, expressed as a percentage: (δA/A) × 100%."
  - question: When should I use linear error propagation?
    answer: "Linear propagation is used for complex functions through partial derivatives. For simple operations, there are specific formulas."
  - question: How do I handle correlated errors?
    answer: "This calculator assumes uncorrelated errors. For correlated errors, additional covariance terms must be considered in the propagation formula."
  - question: What's the difference between precision and accuracy?
    answer: "Precision refers to the reproducibility of measurements (random error), while accuracy refers to how close measurements are to the true value (systematic error)."
---

<div class="calculator-tabs">
  <button class="tab-button active" data-tab="basic">Basic Operations</button>
  <button class="tab-button" data-tab="functions">Functions</button>
  <button class="tab-button" data-tab="linear">Linear Combination</button>
</div>

<form id="error-propagation-form" autocomplete="off">
  <div id="basic-operations" class="tab-content active">
    <h4>🔢 Basic Arithmetic Operations</h4>
    <div class="operation-group">
      <label>
        Operation:
        <select id="basic-operation" required>
          <option value="add">Addition (A + B)</option>
          <option value="subtract">Subtraction (A - B)</option>
          <option value="multiply">Multiplication (A × B)</option>
          <option value="divide">Division (A ÷ B)</option>
          <option value="power">Power (A^n)</option>
        </select>
      </label>
    </div>
    
    <div class="input-row">
      <label>
        Value A:
        <input type="number" id="value-a" step="any" value="10" required>
      </label>
      <label>
        Error δA:
        <input type="number" id="error-a" step="any" value="0.1" min="0" required>
      </label>
    </div>
    
    <div id="second-value-group">
      <div class="input-row">
        <label>
          Value B:
          <input type="number" id="value-b" step="any" value="5">
        </label>
        <label>
          Error δB:
          <input type="number" id="error-b" step="any" value="0.05" min="0">
        </label>
      </div>
    </div>
    
    <div id="power-group" style="display: none;">
      <label>
        Power n:
        <input type="number" id="power-n" step="any" value="2">
      </label>
    </div>
  </div>
  
  <div id="function-operations" class="tab-content">
    <h4>📐 Mathematical Functions</h4>
    <div class="operation-group">
      <label>
        Function:
        <select id="function-operation" required>
          <option value="sqrt">Square Root √A</option>
          <option value="ln">Natural Logarithm ln(A)</option>
          <option value="log10">Common Logarithm log₁₀(A)</option>
          <option value="exp">Exponential e^A</option>
          <option value="sin">Sine sin(A)</option>
          <option value="cos">Cosine cos(A)</option>
          <option value="tan">Tangent tan(A)</option>
        </select>
      </label>
    </div>
    
    <div class="input-row">
      <label>
        Value A:
        <input type="number" id="func-value-a" step="any" value="4" required>
      </label>
      <label>
        Error δA:
        <input type="number" id="func-error-a" step="any" value="0.1" min="0" required>
      </label>
    </div>
  </div>
  
  <div id="linear-combination" class="tab-content">
    <h4>📊 Linear Combination: z = c₁x₁ + c₂x₂ + c₃x₃</h4>
    <div id="linear-terms">
      <div class="linear-term">
        <div class="input-row">
          <label>
            Coefficient c₁:
            <input type="number" id="coeff-1" step="any" value="1" required>
          </label>
          <label>
            Value x₁:
            <input type="number" id="linear-value-1" step="any" value="10" required>
          </label>
          <label>
            Error δx₁:
            <input type="number" id="linear-error-1" step="any" value="0.1" min="0" required>
          </label>
        </div>
      </div>
      
      <div class="linear-term">
        <div class="input-row">
          <label>
            Coefficient c₂:
            <input type="number" id="coeff-2" step="any" value="2">
          </label>
          <label>
            Value x₂:
            <input type="number" id="linear-value-2" step="any" value="5">
          </label>
          <label>
            Error δx₂:
            <input type="number" id="linear-error-2" step="any" value="0.05" min="0">
          </label>
        </div>
      </div>
      
      <div class="linear-term">
        <div class="input-row">
          <label>
            Coefficient c₃:
            <input type="number" id="coeff-3" step="any" value="0">
          </label>
          <label>
            Value x₃:
            <input type="number" id="linear-value-3" step="any" value="0">
          </label>
          <label>
            Error δx₃:
            <input type="number" id="linear-error-3" step="any" value="0" min="0">
          </label>
        </div>
      </div>
    </div>
  </div>
  
  <button type="submit">Calculate Error</button>
</form>

<div id="error-propagation-result" class="result"></div>