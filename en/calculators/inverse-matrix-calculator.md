---
layout: calculator
title: "Inverse Matrix Calculator"
categories: [school]
seo:
  title: "Inverse Matrix Calculator | 2x2, 3x3 Matrix Inverse Calculator"
  description: "Calculate matrix inverse online for 2x2 and 3x3 matrices. Fast and accurate calculations with detailed steps and explanations."
  keywords:
    - inverse matrix
    - matrix calculator
    - linear algebra
    - determinant
    - matrix operations
    - mathematics
    - calculator
    - school
    - algebra
    - adjugate matrix
  content: |
    <h2>Inverse Matrix Calculator</h2>
    <p>Calculate the inverse matrix for square matrices of size 2×2 and 3×3. The calculator automatically checks if the inverse matrix exists.</p>
    
    <h3>What is an Inverse Matrix?</h3>
    <p>An inverse matrix A⁻¹ is a matrix such that A × A⁻¹ = I (identity matrix). An inverse matrix exists only for non-singular matrices (det(A) ≠ 0).</p>
    
    <h3>Calculation Formulas:</h3>
    <ul>
      <li><strong>2×2 Matrix:</strong> A⁻¹ = (1/det(A)) × adj(A)</li>
      <li><strong>3×3 Matrix:</strong> A⁻¹ = (1/det(A)) × adj(A)</li>
      <li><strong>2×2 Determinant:</strong> det(A) = ad - bc</li>
      <li><strong>3×3 Determinant:</strong> det(A) = a₁₁(a₂₂a₃₃ - a₂₃a₃₂) - a₁₂(a₂₁a₃₃ - a₂₃a₃₁) + a₁₃(a₂₁a₃₂ - a₂₂a₃₁)</li>
    </ul>
    
    <h3>Applications:</h3>
    <ul>
      <li>Solving systems of linear equations</li>
      <li>Computer graphics transformations</li>
      <li>Cryptography and encoding</li>
      <li>Engineering and physics calculations</li>
      <li>Statistical analysis and regression</li>
    </ul>
    
    <h3>How to Use:</h3>
    <p>Select matrix size, enter the elements, and click calculate. The calculator will show the determinant and inverse matrix if it exists.</p>
scripts:
  - /en/js/inverse-matrix-calculator.js
faq:
  - question: When does a matrix have an inverse?
    answer: "A matrix has an inverse only when its determinant is not equal to zero. Such matrices are called non-singular or invertible."
  - question: What is a matrix determinant?
    answer: "The determinant is a scalar value that characterizes a matrix. For a 2×2 matrix: det = ad - bc."
  - question: Why do we need inverse matrices?
    answer: "Inverse matrices are used to solve systems of linear equations, in cryptography, computer graphics, and many other areas of mathematics and engineering."
  - question: What is an identity matrix?
    answer: "An identity matrix is a square matrix with ones on the main diagonal and zeros elsewhere. Multiplying by it leaves a matrix unchanged."
  - question: What happens if determinant is zero?
    answer: "If the determinant is zero, the matrix is singular and has no inverse. The system of equations may have no solution or infinitely many solutions."
---

<div class="calculator-inputs">
  <div class="matrix-size-selector">
    <label>
      <input type="radio" name="matrix-size" value="2" checked> 2×2 Matrix
    </label>
    <label>
      <input type="radio" name="matrix-size" value="3"> 3×3 Matrix
    </label>
  </div>

  <div class="matrix-input-container">
    <h4>📊 Enter Matrix Elements:</h4>
    <div id="matrix-inputs" class="matrix-grid">
      <!-- Matrix inputs will be generated here -->
    </div>
  </div>
</div>

<div class="matrix-buttons">
  <button type="button" id="calculate-inverse">🔄 Calculate Inverse Matrix</button>
  <button type="button" id="reset-matrix">🔄 Reset to Identity Matrix</button>
</div>

<div id="matrix-result" class="result"></div>