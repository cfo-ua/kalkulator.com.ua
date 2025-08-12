---
layout: calculator
title: "Base Converter (Binary, Octal, Decimal, Hexadecimal)"
categories: [school]
seo:
  title: "Base Converter - Binary, Octal, Decimal, Hexadecimal | Number System Calculator"
  description: "Convert numbers between binary, octal, decimal, and hexadecimal number systems. Supports signed numbers and two's complement representation."
  keywords:
    - base converter
    - number system converter
    - binary converter
    - octal converter
    - decimal converter
    - hexadecimal converter
    - two's complement
    - signed numbers
    - programming
    - computer science
    - school calculator
  content: |
    <h2>🔢 Number System Converter</h2>
    <p>Powerful tool for quick conversion between different number systems. Supports binary (BIN), octal (OCT), decimal (DEC), and hexadecimal (HEX) systems with signed number support.</p>
    
    <h3>🎯 Calculator Features:</h3>
    <ul>
      <li>✅ Instant conversion between 4 number systems</li>
      <li>✅ Support for signed and unsigned numbers</li>
      <li>✅ Two's complement mode</li>
      <li>✅ Automatic input validation</li>
      <li>✅ Detailed result explanations</li>
    </ul>
scripts:
  - /en/js/base-converter.js
faq:
  - question: What is a number system?
    answer: "A number system is a way to represent numbers using a specific set of symbols. Most common are: binary (0,1), octal (0-7), decimal (0-9), hexadecimal (0-9, A-F)."
  - question: Where is binary system used?
    answer: "Binary system is the foundation of all computer calculations. Each bit can have a value of 0 or 1, corresponding to 'off' or 'on' states in electronic circuits."
  - question: What is two's complement?
    answer: "Two's complement is a method for representing negative numbers in binary system. It allows using the same operations for both addition and subtraction."
  - question: How does hexadecimal system work?
    answer: "Hexadecimal system uses 16 symbols: digits 0-9 and letters A-F (A=10, B=11, C=12, D=13, E=14, F=15). Often used in programming for shorter binary number representation."
  - question: Why was octal system popular?
    answer: "Octal system is convenient because each octal digit exactly corresponds to three binary bits, making it convenient for working with early computers."
---

<div class="calculator-container">
  <form id="base-converter-form">
    <div class="input-group">
      <label for="bc-decimal">🔟 Decimal (DEC):</label>
      <input type="text" id="bc-decimal" placeholder="Enter number, e.g.: 255">
    </div>
    
    <div class="input-group">
      <label for="bc-binary">💻 Binary (BIN):</label>
      <input type="text" id="bc-binary" placeholder="Enter binary number, e.g.: 11111111">
    </div>
    
    <div class="input-group">
      <label for="bc-octal">🔢 Octal (OCT):</label>
      <input type="text" id="bc-octal" placeholder="Enter octal number, e.g.: 377">
    </div>
    
    <div class="input-group">
      <label for="bc-hex">🔠 Hexadecimal (HEX):</label>
      <input type="text" id="bc-hex" placeholder="Enter hex number, e.g.: FF">
    </div>
    
    <div class="options-group">
      <div class="option-item">
        <label>
          <input type="checkbox" id="bc-signed"> 
          ➕➖ Signed numbers
        </label>
      </div>
      
      <div class="option-item">
        <label>
          <input type="checkbox" id="bc-twos-complement"> 
          🔄 Two's complement
        </label>
      </div>
      
      <div class="option-item">
        <label for="bc-bit-width">📏 Bit width:</label>
        <select id="bc-bit-width">
          <option value="8">8 bits</option>
          <option value="16">16 bits</option>
          <option value="32" selected>32 bits</option>
          <option value="64">64 bits</option>
        </select>
      </div>
    </div>
    
    <button type="button" id="bc-convert" class="btn-primary">🔄 Convert</button>
    <button type="button" id="bc-clear" class="btn-secondary">🗑️ Clear</button>
  </form>
</div>

<!--CHART_SPLIT-->

<div id="base-converter-result" class="result-section"></div>

<div class="info-section">
  <h3>📚 Useful Information</h3>
  
  <div class="insight-cards">
    <div class="insight-card info">
      <h6>💡 Quick Powers of 2</h6>
      <div class="small-text">
        2¹ = 2, 2² = 4, 2³ = 8<br>
        2⁴ = 16, 2⁵ = 32, 2⁶ = 64<br>
        2⁷ = 128, 2⁸ = 256, 2⁹ = 512<br>
        2¹⁰ = 1024 (1K)
      </div>
    </div>
    
    <div class="insight-card success">
      <h6>🎯 HEX Letters</h6>
      <div class="small-text">
        A = 10, B = 11, C = 12<br>
        D = 13, E = 14, F = 15<br>
        Always use uppercase<br>
        letters A-F
      </div>
    </div>
    
    <div class="insight-card warning">
      <h6>⚠️ Value Ranges</h6>
      <div class="small-text">
        8-bit: 0 to 255<br>
        16-bit: 0 to 65,535<br>
        32-bit: 0 to 4,294,967,295<br>
        Signed: half range for negatives
      </div>
    </div>
  </div>
  
  <div class="conversion-examples">
    <h4>🔄 Conversion Examples</h4>
    <div class="example-grid">
      <div class="example-item">
        <strong>Number 42:</strong><br>
        DEC: 42<br>
        BIN: 101010<br>
        OCT: 52<br>
        HEX: 2A
      </div>
      <div class="example-item">
        <strong>Number 255:</strong><br>
        DEC: 255<br>
        BIN: 11111111<br>
        OCT: 377<br>
        HEX: FF
      </div>
    </div>
  </div>
</div>