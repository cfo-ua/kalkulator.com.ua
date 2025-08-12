---
layout: calculator
title: "Differential Equation Solver"
categories: [school]
seo:
  title: "Differential Equation Solver Online — dy/dx = f(x,y)"
  description: "Solve differential equations online with step-by-step solutions. Support for separable variables, linear and homogeneous equations."
  keywords:
    - differential equations
    - equation solver
    - differential equations online
    - solve equation
    - mathematics
    - mathematical analysis
    - school
    - student
    - higher mathematics
    - separable variables
    - linear equations
    - homogeneous equations
    - general solution
    - particular solution
    - initial conditions
  content: |
    <h2>Differential Equation Solver — Find Solution for dy/dx = f(x,y)</h2>
    <p>This <strong>online differential equation solver</strong> helps quickly find solutions to various types of differential equations with step-by-step explanations and graphical visualization.</p>
    
    <h3>What is a differential equation?</h3>
    <p>A differential equation is an equation containing a function and its derivatives. Basic form: dy/dx = f(x,y), where you need to find function y(x).</p>
    
    <h3>Types of differential equations</h3>
    <ul>
      <li><strong>Separable variables:</strong> dy/dx = g(x)h(y)</li>
      <li><strong>Linear equations:</strong> dy/dx + P(x)y = Q(x)</li>
      <li><strong>Homogeneous equations:</strong> dy/dx = f(y/x)</li>
      <li><strong>Bernoulli equations:</strong> dy/dx + P(x)y = Q(x)y^n</li>
    </ul>
    
    <h3>Applications of differential equations</h3>
    <ul>
      <li><strong>Physics:</strong> motion of bodies, oscillations, radioactive decay</li>
      <li><strong>Biology:</strong> population growth, epidemic spread</li>
      <li><strong>Economics:</strong> growth models, inflation</li>
      <li><strong>Engineering:</strong> electrical circuits, heat transfer</li>
      <li><strong>Chemistry:</strong> reaction rates, kinetics</li>
    </ul>
    
    <h3>How to use the solver?</h3>
    <ol>
      <li>Enter the differential equation in standard form</li>
      <li>Choose equation type (or automatic detection)</li>
      <li>Specify initial conditions if needed</li>
      <li>Click "Solve Equation"</li>
      <li>Get general and particular solutions</li>
    </ol>
    
    <p><strong>Examples:</strong> dy/dx = 2*x, dy/dx = y, dy/dx = x/y, dy/dx + y = x</p>
scripts:
  - https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.11.0/math.min.js
  - /en/js/differential-equation.js
faq:
  - question: "What is a differential equation?"
    answer: "A differential equation is a mathematical equation that relates a function with its derivatives. It describes how a function changes depending on its current value and variable."
  - question: "What's the difference between general and particular solutions?"
    answer: "General solution contains arbitrary constants and describes all possible solutions. Particular solution is obtained from general solution when initial conditions are given."
  - question: "What are initial conditions?"
    answer: "Initial conditions are values of the function and/or its derivatives at a certain point. For example, y(0) = 1 means that when x = 0, function y equals 1."
  - question: "What types of equations are supported?"
    answer: "Supported: separable variables equations, first-order linear equations, homogeneous equations, some types of Bernoulli equations and other basic forms."
  - question: "Can I plot the solution graph?"
    answer: "Yes! The calculator automatically plots the solution graph (if possible) and direction field for visual representation of the equation."
---

<div class="calculator-container">
  <form id="de-form" autocomplete="off">
    <div class="input-group">
      <label for="equation">Differential equation:</label>
      <input type="text" id="equation" placeholder="Example: dy/dx = 2*x or dy/dx + y = x" value="dy/dx = 2*x" required>
      <small>Format: dy/dx = expression or dy/dx + expression = expression</small>
    </div>
    
    <div class="input-group">
      <label for="equation-type">Equation type:</label>
      <select id="equation-type">
        <option value="auto">Automatic detection</option>
        <option value="separable">Separable variables</option>
        <option value="linear">First-order linear</option>
        <option value="homogeneous">Homogeneous</option>
        <option value="exact">Exact differential equation</option>
      </select>
    </div>
    
    <div class="initial-conditions">
      <h3>Initial conditions (optional)</h3>
      <div class="condition-group">
        <label for="x0">x₀:</label>
        <input type="number" id="x0" placeholder="0" step="any">
        <label for="y0">y₀:</label>
        <input type="number" id="y0" placeholder="1" step="any">
      </div>
    </div>
    
    <div class="advanced-options">
      <div class="checkbox-group">
        <input type="checkbox" id="show-solution-steps" checked>
        <label for="show-solution-steps">Show solution steps</label>
      </div>
      
      <div class="checkbox-group">
        <input type="checkbox" id="plot-solution" checked>
        <label for="plot-solution">Plot solution graph</label>
      </div>
      
      <div class="checkbox-group">
        <input type="checkbox" id="direction-field">
        <label for="direction-field">Show direction field</label>
      </div>
    </div>
    
    <button type="submit">🔬 Solve Equation</button>
  </form>
  
  <div id="de-result" class="result"></div>
  <div id="de-plot" class="plot-container"></div>
</div>