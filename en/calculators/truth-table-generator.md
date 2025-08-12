---
layout: calculator
title: "Truth Table Generator"
categories: [school]
seo:
  title: "Truth Table Generator Online | Logic Operations | School Calculator"
  description: "Generate truth tables for logical expressions online. Support for AND, OR, NOT, XOR, NAND, NOR operations with automatic generation of all combinations."
  keywords:
    - truth table
    - logic operations
    - boolean algebra
    - logical expressions
    - AND OR NOT
    - XOR NAND NOR
    - discrete mathematics
    - computer science
    - school
    - logic gates
    - propositional logic
  content: |
    <h2>Truth Table Generator</h2>
    <p>Enter a logical expression using variables A, B, C, D and logical operations. The generator will automatically create a complete truth table with all possible combinations.</p>
    
    <h3>Supported Operations:</h3>
    <ul>
      <li><strong>AND (&, *):</strong> Logical "AND" - returns true if both operands are true</li>
      <li><strong>OR (|, +):</strong> Logical "OR" - returns true if at least one operand is true</li>
      <li><strong>NOT (!,~):</strong> Logical "NOT" - inverts the operand value</li>
      <li><strong>XOR (^):</strong> Exclusive "OR" - returns true if operands are different</li>
      <li><strong>NAND:</strong> "NOT-AND" - inversion of AND operation</li>
      <li><strong>NOR:</strong> "NOT-OR" - inversion of OR operation</li>
    </ul>
    
    <h3>Expression Examples:</h3>
    <ul>
      <li>A & B (A and B)</li>
      <li>A | B (A or B)</li>
      <li>!A (not A)</li>
      <li>A ^ B (A XOR B)</li>
      <li>(A & B) | C</li>
      <li>!(A & B)</li>
    </ul>
    
    <h3>How it works:</h3>
    <p>The truth table generator evaluates your logical expression for all possible combinations of input values. For n variables, there are 2^n rows in the truth table.</p>
    
    <h3>Applications:</h3>
    <ul>
      <li>Digital circuit design</li>
      <li>Computer science logic courses</li>
      <li>Boolean algebra verification</li>
      <li>Logic gate analysis</li>
      <li>Programming conditional statements</li>
    </ul>
scripts:
  - /en/js/truth-table-generator.js
faq:
  - question: What is a truth table?
    answer: "A truth table is a mathematical table that shows the result of a logical operation for all possible combinations of input values."
  - question: Which logical operations are supported?
    answer: "Basic logical operations are supported: AND (&), OR (|), NOT (!), XOR (^), NAND and NOR. You can also use parentheses for grouping."
  - question: How many variables can I use?
    answer: "You can use up to 4 variables (A, B, C, D). For more variables, the table becomes too large to display effectively."
  - question: How do I enter complex expressions?
    answer: "Use parentheses for grouping operations, for example: (A & B) | (C & D). Operation precedence: parentheses, NOT, AND, XOR, OR."
  - question: What's the difference between NAND and NOR?
    answer: "NAND is NOT-AND (outputs false only when both inputs are true), NOR is NOT-OR (outputs true only when both inputs are false)."
---

<form id="truth-table-form" autocomplete="off">
  <label>
    Logical Expression:
    <input type="text" id="logic-expression" placeholder="Example: A & B | C" value="A & B" required>
    <small>Use variables A, B, C, D and operations &, |, !, ^, (), NAND, NOR</small>
  </label>
  <button type="submit">Generate Table</button>
</form>

<div id="truth-table-result" class="result"></div>