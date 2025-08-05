---
layout: calculator
title: "Tire Size Calculator"
categories: [travel]
seo:
  title: "Tire Size Calculator Online — Calculate Diameter & Specifications"
  description: "Calculate tire parameters online: diameter, width, sidewall height, circumference. Compare different tire sizes and learn about compatibility."
  keywords:
    - tire size calculator
    - tire diameter
    - tire specifications
    - tire profile
    - car tires
    - tire selection
    - tire marking
    - R13 R14 R15 R16 tires
    - tire replacement
    - wheel calculator
  content: |
    <h2>🚗 Online Tire Size Calculator</h2>
    <p>Quickly calculate all characteristics of car tires from their markings. Find out diameter, width, sidewall height and other important parameters for proper tire selection.</p>

    <h3>🎯 How to use the calculator?</h3>
    <ol>
      <li>Enter tire width (e.g., 205)</li>
      <li>Specify sidewall height as percentage (e.g., 55)</li>
      <li>Select rim diameter (e.g., 16)</li>
      <li>Get complete tire specifications</li>
    </ol>

    <h3>📏 What the calculator shows:</h3>
    <ul>
      <li><strong>Overall tire diameter</strong> — total wheel size</li>
      <li><strong>Sidewall height</strong> — thickness of tire sidewall</li>
      <li><strong>Circumference</strong> — wheel perimeter</li>
      <li><strong>Revolutions per kilometer</strong> — for speed calculations</li>
    </ul>

    <h3>🔍 Tire Markings:</h3>
    <p>Standard marking looks like <strong>205/55 R16</strong>, where:</p>
    <ul>
      <li><strong>205</strong> — tread width in millimeters</li>
      <li><strong>55</strong> — sidewall height as percentage of width</li>
      <li><strong>R</strong> — radial construction</li>
      <li><strong>16</strong> — rim diameter in inches</li>
    </ul>

    <h3>⚙️ Practical Applications:</h3>
    <ul>
      <li><strong>Tire selection:</strong> finding alternative sizes</li>
      <li><strong>Wheel replacement:</strong> checking size compatibility</li>
      <li><strong>Tuning:</strong> calculating impact on speed and consumption</li>
      <li><strong>Car purchase:</strong> planning tire expenses</li>
    </ul>
scripts:
  - /en/js/tire-size-calculator.js
faq:
  - question: What does 205/55 R16 marking mean?
    answer: "205 mm - tread width, 55% - sidewall height from width, R - radial construction, 16 inches - rim diameter."
  - question: Can I use different tire sizes?
    answer: "Yes, but wheel diameter shouldn't differ by more than 3%. The calculator helps check compatibility."
  - question: How does profile height affect driving?
    answer: "Low profile (30-50%) - better handling but harsh ride. High profile (60-80%) - comfort but less precise handling."
  - question: Why know tire circumference?
    answer: "For accurate speed and mileage calculations. Different circumference affects speedometer readings."
  - question: What are speed and load ratings?
    answer: "Speed rating (H, V, W) shows maximum speed. Load index shows maximum weight per tire."
  - question: How to choose the right tire size?
    answer: "Manufacturer recommended size is in car manual, on driver's door pillar, or fuel cap door."
---
<form id="tire-size-form" autocomplete="off">
  <div class="form-group">
    <label>
      📏 Tire Width (mm):
      <input type="number" id="tire-width" min="100" max="400" placeholder="205" value="205" required>
    </label>
  </div>
  
  <div class="form-group">
    <label>
      📐 Aspect Ratio (%):
      <input type="number" id="aspect-ratio" min="25" max="95" placeholder="55" value="55" required>
    </label>
  </div>

  <div class="form-group">
    <label>
      ⭕ Rim Diameter (inches):
      <select id="rim-diameter" required>
        <option value="">Select diameter</option>
        <option value="13">R13</option>
        <option value="14">R14</option>
        <option value="15">R15</option>
        <option value="16" selected>R16</option>
        <option value="17">R17</option>
        <option value="18">R18</option>
        <option value="19">R19</option>
        <option value="20">R20</option>
        <option value="21">R21</option>
        <option value="22">R22</option>
      </select>
    </label>
  </div>

  <button type="submit">Calculate Size</button>
</form>

<div id="tire-size-result" class="result"></div>
