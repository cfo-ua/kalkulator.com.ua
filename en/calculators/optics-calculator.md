---
layout: calculator
title: "Optics Calculator - Lenses and Mirrors"
categories: [school]
seo:
  title: "Optics Calculator Online - Focal Length, Magnification, Lenses | Physics"
  description: "Calculate lens and mirror parameters: focal length, magnification, image position. Calculator for geometrical optics problems."
  keywords:
    - optics calculator
    - focal length
    - lens calculator
    - magnification
    - lens equation
    - geometrical optics
    - thin lens
    - optics physics
    - mirror
    - image formation
  content: |
    <h2>🔍 Geometrical Optics Calculator</h2>
    <p>Geometrical optics studies the propagation of light as rays. This calculator helps determine the parameters of thin lenses and spherical mirrors.</p>
    
    <h3>📐 Key Formulas:</h3>
    <ul>
      <li><strong>Thin lens equation:</strong> 1/f = 1/d₀ + 1/dᵢ</li>
      <li><strong>Linear magnification:</strong> m = -dᵢ/d₀ = hᵢ/h₀</li>
      <li><strong>Optical power:</strong> D = 1/f (in diopters)</li>
      <li><strong>Mirror focal length:</strong> f = R/2 (R = radius of curvature)</li>
    </ul>
    
    <h3>🔬 Types of Optical Elements:</h3>
    <ul>
      <li><strong>Converging lens:</strong> f > 0 (focuses light rays)</li>
      <li><strong>Diverging lens:</strong> f < 0 (spreads light rays)</li>
      <li><strong>Concave mirror:</strong> f > 0 (focuses light rays)</li>
      <li><strong>Convex mirror:</strong> f < 0 (spreads light rays)</li>
    </ul>
    
    <h3>🎯 Applications:</h3>
    <ul>
      <li>Eyeglasses and contact lenses design</li>
      <li>Optical instrument engineering</li>
      <li>Microscopy and telescopy</li>
      <li>Photography and videography</li>
      <li>Laser systems</li>
    </ul>
    
    <h3>📊 Sign Conventions:</h3>
    <ul>
      <li><strong>Positive distances:</strong> real objects/images (left to right)</li>
      <li><strong>Negative distances:</strong> virtual objects/images</li>
      <li><strong>Positive magnification:</strong> upright image</li>
      <li><strong>Negative magnification:</strong> inverted image</li>
    </ul>
scripts:
  - /en/js/optics-calculator.js
faq:
  - question: What does negative focal length mean?
    answer: "Negative focal length is characteristic of diverging lenses and convex mirrors. They cause light rays to spread out."
  - question: How to interpret negative magnification?
    answer: "Negative magnification means the image is inverted (upside down) relative to the object."
  - question: What is a diopter?
    answer: "A diopter is a unit of optical power of a lens. 1 diopter = 1/meter. Higher optical power means stronger light bending."
  - question: What's the difference between real and virtual images?
    answer: "Real images (dᵢ > 0) can be projected on a screen. Virtual images (dᵢ < 0) can only be seen through the optical device."
  - question: What information do I need to provide?
    answer: "Provide at least 2 of the 3 main parameters (focal length, object distance, image distance) to calculate the missing values."
---

<form id="optics-form" autocomplete="off">
  <div class="input-grid">
    <label>
      Focal length (f, cm):
      <input type="number" id="focal-length" step="0.1" placeholder="10">
    </label>
    <label>
      Object distance (d₀, cm):
      <input type="number" id="object-distance" step="0.1" placeholder="15">
    </label>
    <label>
      Image distance (dᵢ, cm):
      <input type="number" id="image-distance" step="0.1">
    </label>
    <label>
      Object height (h₀, cm):
      <input type="number" id="object-height" step="0.1" placeholder="2">
    </label>
    <label>
      Image height (hᵢ, cm):
      <input type="number" id="image-height" step="0.1">
    </label>
  </div>
  
  <div style="margin: 1rem 0;">
    <label>
      <input type="radio" name="optics-type" value="lens" checked> Lens
    </label>
    <label style="margin-left: 1rem;">
      <input type="radio" name="optics-type" value="mirror"> Mirror
    </label>
  </div>
  
  <button type="submit">🔍 Calculate Optical Parameters</button>
</form>

<div id="optics-result" class="result"></div>