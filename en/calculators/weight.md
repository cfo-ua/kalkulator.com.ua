---
layout: calculator
title: "Gravitational Force Calculator"
categories: [school]
seo:
  title: "Gravitational Force Calculator | Calculate F = m × g Online"
  description: "Enter object mass and find gravitational force (weight) in Newtons. Formula F = m × g. Online calculator for physics lessons."
  keywords:
    - gravitational force
    - weight calculator
    - mass calculator
    - gravitational acceleration
    - physics calculator
    - F=mg formula
    - newtons
    - school physics
    - gravity calculator
    - force calculation
  content: |
    <h2>Gravitational Force Calculator</h2>
    <p>This online calculator helps you compute the <strong>gravitational force</strong> acting on an object with a certain mass on Earth's surface.</p>
    
    <h3>Formula:</h3>
    <p><strong>F = m × g</strong></p>
    <ul>
      <li><b>F</b>  -  gravitational force (N)</li>
      <li><b>m</b>  -  mass of object (kg)</li>
      <li><b>g</b>  -  gravitational acceleration ≈ 9.81 m/s²</li>
    </ul>
    
    <h3>What is gravitational force?</h3>
    <p>Gravitational force is the force with which Earth attracts objects toward its center. It's what we commonly call "weight" in everyday language, though scientifically weight and mass are different concepts.</p>
    
    <h3>Weight vs Mass:</h3>
    <ul>
      <li><strong>Mass:</strong> Amount of matter in an object (kg) - constant everywhere</li>
      <li><strong>Weight:</strong> Gravitational force on that mass (N) - varies with gravity</li>
    </ul>
    
    <h3>Applications:</h3>
    <ul>
      <li>Engineering calculations</li>
      <li>Physics problems</li>
      <li>Space science (different gravity values)</li>
      <li>Material handling and safety</li>
    </ul>
    
    <h3>Examples:</h3>
    <ul>
      <li>1 kg object: F = 1 × 9.81 = 9.81 N</li>
      <li>70 kg person: F = 70 × 9.81 = 686.7 N</li>
      <li>On Moon (g ≈ 1.6 m/s²): 70 kg person weighs only 112 N</li>
    </ul>
scripts:
  - /en/js/weight.js
faq:
  - question: What is gravitational force?
    answer: "Gravitational force is the force with which Earth attracts objects toward itself. It's calculated using F = m × g."
  - question: What units is gravitational force measured in?
    answer: "In Newtons (N), where 1 N = 1 kg × m/s²."
  - question: What value of g is used on Earth?
    answer: "Standard value: 9.81 m/s². It can vary slightly depending on latitude and altitude above sea level."
  - question: What's the difference between mass and weight?
    answer: "Mass is the amount of matter (kg), weight is the gravitational force on that mass (N). Mass stays constant, weight changes with gravity."
  - question: How would weight change on other planets?
    answer: "Weight depends on gravitational acceleration. On Mars (g ≈ 3.7 m/s²), you'd weigh about 38% of your Earth weight."
---

<form id="weight-form" autocomplete="off">
  <label>
    Mass of object (kg):
    <input type="number" id="weight-m" min="0" step="any" value="1" required>
  </label>
  <button type="submit">Calculate</button>
</form>
<div id="weight-result" class="result"></div>