---
layout: calculator
title: "Wave Calculator - Frequency, Wavelength, Velocity"
categories: [school]
seo:
  title: "Wave Calculator Online - Frequency, Wavelength, Wave Speed | Physics"
  description: "Calculate wave parameters: frequency, wavelength, propagation speed, period. Calculator for wave physics and acoustics problems."
  keywords:
    - wave calculator
    - wave frequency
    - wavelength
    - wave speed
    - wave period
    - wave physics
    - sound waves
    - electromagnetic waves
    - resonance
    - acoustics
  content: |
    <h2>🌊 Wave Phenomena Calculator</h2>
    <p>Waves are oscillations that propagate through space and time. This calculator helps determine the fundamental parameters of various types of waves.</p>
    
    <h3>📐 Key Formulas:</h3>
    <ul>
      <li><strong>Wave speed:</strong> v = fλ = λ/T</li>
      <li><strong>Frequency-period relation:</strong> f = 1/T</li>
      <li><strong>Wavelength:</strong> λ = v/f = vT</li>
      <li><strong>Frequency:</strong> f = v/λ = 1/T</li>
    </ul>
    
    <h3>🔊 Types of Waves:</h3>
    <ul>
      <li><strong>Sound waves:</strong> v ≈ 343 m/s (in air at 20°C)</li>
      <li><strong>Light waves:</strong> c = 3×10⁸ m/s (in vacuum)</li>
      <li><strong>Radio waves:</strong> v ≈ c (electromagnetic waves)</li>
      <li><strong>Water waves:</strong> depends on depth and other factors</li>
    </ul>
    
    <h3>🎯 Applications:</h3>
    <ul>
      <li>Acoustics and musical instruments</li>
      <li>Radio and telecommunications</li>
      <li>Medical diagnostics (ultrasound)</li>
      <li>Seismology and geophysics</li>
      <li>Optics and spectroscopy</li>
    </ul>
    
    <h3>🎵 Frequency Ranges:</h3>
    <ul>
      <li><strong>Infrasound:</strong> < 20 Hz</li>
      <li><strong>Audible sound:</strong> 20 Hz - 20 kHz</li>
      <li><strong>Ultrasound:</strong> > 20 kHz</li>
      <li><strong>Radio waves:</strong> 3 kHz - 300 GHz</li>
    </ul>
    
    <h3>📊 Variables explained:</h3>
    <ul>
      <li><strong>f</strong> - Frequency (Hz) - oscillations per second</li>
      <li><strong>λ</strong> - Wavelength (m) - distance between wave peaks</li>
      <li><strong>v</strong> - Wave speed (m/s) - propagation velocity</li>
      <li><strong>T</strong> - Period (s) - time for one complete oscillation</li>
    </ul>
scripts:
  - /en/js/wave-calculator.js
faq:
  - question: What is wavelength?
    answer: "Wavelength (λ) is the distance between two adjacent points on a wave that oscillate in the same phase. It's measured in meters."
  - question: How do frequency and period relate?
    answer: "Frequency (f) shows the number of oscillations per second (Hz), while period (T) is the time for one complete oscillation (s). They are inversely proportional: f = 1/T."
  - question: What affects the speed of sound?
    answer: "Sound speed depends on the medium, temperature, pressure, and humidity. In air at 20°C, it's approximately 343 m/s."
  - question: What is resonance?
    answer: "Resonance occurs when the frequency of an external force matches the natural frequency of an oscillating system, leading to a significant increase in amplitude."
  - question: How many parameters do I need to calculate the rest?
    answer: "You need to provide at least 2 of the 4 wave parameters (frequency, wavelength, velocity, period) to calculate the remaining values."
---

<form id="wave-form" autocomplete="off">
  <div class="input-grid">
    <label>
      Frequency (f, Hz):
      <input type="number" id="frequency" step="0.01" placeholder="440">
    </label>
    <label>
      Wavelength (λ, m):
      <input type="number" id="wavelength" step="0.001" placeholder="0.78">
    </label>
    <label>
      Velocity (v, m/s):
      <input type="number" id="velocity" step="0.1" placeholder="343">
    </label>
    <label>
      Period (T, s):
      <input type="number" id="period" step="0.0001">
    </label>
  </div>
  
  <div style="margin: 1rem 0;">
    <label style="display: block; margin-bottom: 0.5rem;">Wave type:</label>
    <label>
      <input type="radio" name="wave-type" value="sound" checked> Sound wave (v = 343 m/s)
    </label>
    <label style="margin-left: 1rem;">
      <input type="radio" name="wave-type" value="light"> Light wave (c = 3×10⁸ m/s)
    </label>
    <label style="margin-left: 1rem;">
      <input type="radio" name="wave-type" value="custom"> Other wave
    </label>
  </div>
  
  <button type="submit">🌊 Calculate Wave Parameters</button>
</form>

<div id="wave-result" class="result"></div>