---
layout: calculator
title: "Fractions Calculator"
categories: [school]
seo:
  title: "Fractions Calculator - Add, Subtract, Multiply, Divide Fractions Online"
  description: "Free online fractions calculator for adding, subtracting, multiplying and dividing fractions. Simplify fractions, convert to mixed numbers with step-by-step solutions."
  keywords:
    - fractions calculator
    - add fractions
    - subtract fractions
    - multiply fractions
    - divide fractions
    - simplify fractions
    - mixed numbers
    - common fractions
    - proper fractions
    - improper fractions
    - fraction operations
    - math calculator
    - elementary math
    - fraction solver
  content: |
    <h2>Fractions Calculator Online</h2>
    <p>Fractions are fundamental in mathematics, taught from elementary grades through advanced studies. Our calculator helps you easily perform all basic fraction operations: addition, subtraction, multiplication, and division with step-by-step solutions. 🔢</p>

    <h3>What can you do with this fractions calculator?</h3>
    <ul>
      <li><strong>➕ Add fractions</strong> — with same or different denominators</li>
      <li><strong>➖ Subtract fractions</strong> — find the difference between fractions</li>
      <li><strong>✖️ Multiply fractions</strong> — multiply numerators and denominators</li>
      <li><strong>➗ Divide fractions</strong> — divide by multiplying by reciprocal</li>
      <li><strong>🔄 Simplify fractions</strong> — automatic reduction using GCD</li>
      <li><strong>🔢 Work with mixed numbers</strong> — convert to and from improper fractions</li>
    </ul>

    <h3>Basic fraction operation rules:</h3>
    <ol>
      <li><strong>Addition & Subtraction:</strong> Find common denominator first</li>
      <li><strong>Multiplication:</strong> Multiply numerators together, denominators together</li>
      <li><strong>Division:</strong> Multiply by the reciprocal of the second fraction</li>
      <li><strong>Simplification:</strong> Divide both numerator and denominator by their GCD</li>
    </ol>

    <h3>Common use cases:</h3>
    <ul>
      <li><strong>Cooking:</strong> Recipe ingredient calculations and scaling</li>
      <li><strong>Construction:</strong> Measurements in inches and feet</li>
      <li><strong>School homework:</strong> Math assignments and problem solving</li>
      <li><strong>Daily life:</strong> Time calculations, distances, and portions</li>
    </ul>

    <p>The calculator automatically simplifies results and shows step-by-step solutions. Perfect for students from elementary through high school and anyone working with fractions! 📚</p>
scripts:
  - /en/js/fractions.js
faq:
  - question: How do you add fractions with different denominators?
    answer: "To add fractions with different denominators, first find a common denominator (usually the LCM of both denominators), convert both fractions to equivalent fractions with this common denominator, then add the numerators."
  - question: How do you multiply fractions?
    answer: "To multiply fractions, multiply the numerators together and multiply the denominators together. Formula: (a/b) × (c/d) = (a×c)/(b×d). Then simplify if possible."
  - question: How do you divide fractions?
    answer: "To divide fractions, multiply the first fraction by the reciprocal (flip) of the second fraction. Formula: (a/b) ÷ (c/d) = (a/b) × (d/c) = (a×d)/(b×c)."
  - question: What is a mixed number?
    answer: "A mixed number is a whole number combined with a proper fraction, like 2¾. It represents the same value as an improper fraction (like 11/4) but in a more readable form for everyday use."
  - question: How do you simplify fractions?
    answer: "To simplify a fraction, divide both the numerator and denominator by their greatest common divisor (GCD). For example, 8/12 simplified is 2/3 because both 8 and 12 can be divided by 4."
  - question: What's the difference between proper and improper fractions?
    answer: "A proper fraction has a numerator smaller than the denominator (like 3/5). An improper fraction has a numerator greater than or equal to the denominator (like 7/4 or 5/5)."
  - question: Can I use this calculator for mixed numbers?
    answer: "Yes! The calculator handles mixed numbers by converting them to improper fractions for calculations, then converts the result back to a mixed number when appropriate."
---

<div class="calculator-form">
  <h3>🔢 Choose Fraction Operation</h3>
  
  <div class="operation-selector">
    <label class="operation-option">
      <input type="radio" name="operation" value="add" checked>
      <span class="operation-label">➕ Addition</span>
    </label>
    <label class="operation-option">
      <input type="radio" name="operation" value="subtract">
      <span class="operation-label">➖ Subtraction</span>
    </label>
    <label class="operation-option">
      <input type="radio" name="operation" value="multiply">
      <span class="operation-label">✖️ Multiplication</span>
    </label>
    <label class="operation-option">
      <input type="radio" name="operation" value="divide">
      <span class="operation-label">➗ Division</span>
    </label>
  </div>

  <div class="fractions-input">
    <div class="fraction-group">
      <h4>First Fraction</h4>
      <div class="fraction-input">
        <input type="number" id="num1" placeholder="Numerator" value="1">
        <span class="fraction-line">/</span>
        <input type="number" id="den1" placeholder="Denominator" value="2" min="1">
      </div>
    </div>

    <div class="operation-display" id="operation-symbol">+</div>

    <div class="fraction-group">
      <h4>Second Fraction</h4>
      <div class="fraction-input">
        <input type="number" id="num2" placeholder="Numerator" value="1">
        <span class="fraction-line">/</span>
        <input type="number" id="den2" placeholder="Denominator" value="3" min="1">
      </div>
    </div>
  </div>

  <button type="button" id="calculate-btn" class="calculate-button">
    Calculate 🧮
  </button>
</div>

<!--CHART_SPLIT-->

<div id="result-section" class="result-section" style="display: none;">
  <div class="insight-card success">
    <h6>📊 Calculation Result</h6>
    <div class="big-number" id="result-display">—</div>
    <div class="result-breakdown" id="result-breakdown"></div>
  </div>

  <div class="calculation-steps" id="calculation-steps" style="display: none;">
    <h4>📝 Step-by-Step Solution</h4>
    <div class="steps-content" id="steps-content"></div>
  </div>

  <div class="additional-info">
    <div class="insight-card info">
      <h6>🔄 Simplified Result</h6>
      <div class="result-value" id="simplified-result">—</div>
    </div>
    
    <div class="insight-card warning">
      <h6>🔢 Decimal Equivalent</h6>
      <div class="result-value" id="decimal-result">—</div>
    </div>
  </div>
</div>

<style>
.calculator-form {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: var(--radius);
  margin-bottom: 2rem;
}

.operation-selector {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.operation-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  transition: all var(--transition);
  background: white;
}

.operation-option:hover {
  border-color: var(--accent);
  background: var(--accent);
  color: white;
}

.operation-option input[type="radio"] {
  margin: 0;
}

.operation-option input[type="radio"]:checked + .operation-label {
  font-weight: 600;
}

.operation-option:has(input[type="radio"]:checked) {
  border-color: var(--accent);
  background: var(--accent);
  color: white;
}

.fractions-input {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.fraction-group {
  text-align: center;
}

.fraction-group h4 {
  margin: 0 0 1rem 0;
  color: var(--main-color);
  font-size: 1rem;
}

.fraction-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.fraction-input input {
  width: 80px;
  padding: 0.75rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;
}

.fraction-line {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--main-color);
}

.operation-display {
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent);
  padding: 1rem;
  background: white;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--accent);
}

.calculate-button {
  background: var(--accent);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: var(--radius);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition);
  width: 100%;
}

.calculate-button:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.result-section {
  margin-top: 2rem;
}

.additional-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.calculation-steps {
  background: white;
  padding: 1.5rem;
  border-radius: var(--radius);
  border: 2px solid var(--border);
  margin-top: 1.5rem;
}

.calculation-steps h4 {
  margin: 0 0 1rem 0;
  color: var(--main-color);
}

.steps-content {
  line-height: 1.6;
}

.step {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: var(--card-bg);
  border-radius: 8px;
}

.result-breakdown {
  margin-top: 1rem;
  font-size: 1rem;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .fractions-input {
    flex-direction: column;
    gap: 1rem;
  }
  
  .operation-selector {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>