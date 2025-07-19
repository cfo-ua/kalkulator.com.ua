---
layout: calculator
title: "Brick Calculator"
categories: [construction]
seo:
  title: "Brick Calculator | Estimate Bricks Needed for Walls & Construction Projects"
  description: "Calculate the number of bricks needed for your masonry project. Professional brick calculator for walls, chimneys, and construction with mortar joint consideration."
  keywords:
    - brick calculator
    - masonry calculator
    - brick wall calculator
    - brick quantity calculator
    - how many bricks needed
    - brick estimation calculator
    - brickwork calculator
    - construction brick calculator
    - wall brick calculator
    - brick counting calculator
    - masonry estimator
    - brick veneer calculator
    - brick construction calculator
    - standard brick calculator
  content: |
    <h2>Brick Calculator</h2>
    <p>Calculate the exact number of <strong>bricks needed</strong> for your masonry project. Perfect for walls, chimneys, garden walls, and other brickwork construction.</p>

    <h3>What This Calculator Includes:</h3>
    <ul>
      <li><strong>Wall area</strong> in square feet</li>
      <li><strong>Brick dimensions:</strong> length, width, height (inches)</li>
      <li><strong>Mortar joint thickness</strong> between bricks (inches)</li>
      <li><strong>Wall thickness:</strong> single wythe, double wythe, cavity wall</li>
    </ul>

    <h3>Standard Brick Sizes (US):</h3>
    <ul>
      <li><strong>Standard/Common brick:</strong> 7.625" × 3.625" × 2.25"</li>
      <li><strong>Modular brick:</strong> 7.625" × 3.625" × 2.25"</li>
      <li><strong>King size brick:</strong> 9.625" × 3.125" × 2.75"</li>
      <li><strong>Queen size brick:</strong> 9.625" × 3.125" × 2.75"</li>
    </ul>

    <h3>Professional Masonry Tips:</h3>
    <ul>
      <li><strong>Add 5-10% extra</strong> for breakage, cuts, and repairs</li>
      <li><strong>Standard mortar joint:</strong> 3/8" (0.375") is most common</li>
      <li><strong>Wall patterns:</strong> running bond is most economical</li>
      <li><strong>Weather considerations:</strong> protect bricks from freezing when wet</li>
    </ul>

    <h3>Common Brick Applications:</h3>
    <ul>
      <li><strong>Exterior walls:</strong> load-bearing and veneer construction</li>
      <li><strong>Interior walls:</strong> fireplaces, accent walls, partitions</li>
      <li><strong>Outdoor projects:</strong> garden walls, planters, fire pits</li>
      <li><strong>Commercial work:</strong> warehouses, retail buildings</li>
    </ul>

    <p>This calculator provides accurate brick quantities for rectangular wall areas. For complex shapes, calculate each section separately and add totals together.</p>
scripts:
  - /en/js/bricks.js
faq:
  - question: How many bricks do I need per square foot?
    answer: "For standard bricks with 3/8\" mortar joints, you need approximately 6.5-7 bricks per square foot for a single wythe wall."
  - question: What is a wythe in brick construction?
    answer: "A wythe is one layer of brick thickness. Single wythe = ~4\" thick, double wythe = ~8\" thick with air space or mortar between."
  - question: Should I include mortar joints in calculations?
    answer: "Yes! Mortar joints significantly affect brick count. This calculator includes mortar joint thickness for accurate estimates."
  - question: How much extra should I order?
    answer: "Order 5-10% extra bricks for breakage, cuts, and future repairs. Complex projects may need up to 15% additional bricks."
  - question: Can I use this for different brick sizes?
    answer: "Yes! Enter your specific brick dimensions and mortar joint thickness for accurate calculations with any brick size."
  - question: What about brick waste and breakage?
    answer: "The calculator shows exact quantity needed. Always add 5-10% for waste, and more for complex layouts or inexperienced masons."
---

<form id="bricks-form" autocomplete="off">
  <label>
    Wall Area (sq ft):
    <input type="number" id="bricks-area" min="0" step="any" required>
  </label>
  <label>
    Brick Length (inches):
    <input type="number" id="bricks-length" min="1" step="any" placeholder="7.625" required>
  </label>
  <label>
    Brick Height (inches):
    <input type="number" id="bricks-height" min="1" step="any" placeholder="2.25" required>
  </label>
  <label>
    Brick Width (inches):
    <input type="number" id="bricks-width" min="1" step="any" placeholder="3.625" required>
  </label>
  <label>
    Mortar Joint Thickness (inches):
    <input type="number" id="bricks-joint" min="0" step="any" value="0.375" required>
  </label>
  <label>
    Wall Type:
    <select id="bricks-layer">
      <option value="1">Single Wythe (~4 inches)</option>
      <option value="2">Double Wythe (~8 inches)</option>
      <option value="1.5">Cavity Wall (~6 inches)</option>
    </select>
  </label>
  <button type="submit">Calculate Bricks</button>
</form>

<div id="bricks-result" class="result"></div>