---
layout: calculator
title: "Конвертер градусів і радіанів з точними тригонометричними значеннями"
categories: [school]
seo:
  title: "Конвертер градусів і радіанів з тригонометричними значеннями | Шкільні калькулятори"
  description: "Конвертуйте градуси в радіани та навпаки. Отримайте точні значення sin, cos, tan для відомих кутів. Онлайн калькулятор для тригонометрії."
  keywords:
    - градуси в радіани
    - радіани в градуси
    - конвертер кутів
    - тригонометричні функції
    - синус косинус тангенс
    - точні значення тригонометрії
    - шкільна математика
    - одиничне коло
  content: |
    <h2>🔄 Конвертер градусів і радіанів з тригонометричними значеннями</h2>
    <p>Швидко конвертуйте кути між градусами та радіанами. Отримайте точні значення тригонометричних функцій для стандартних кутів. Ідеально для вивчення тригонометрії та розв'язання задач.</p>
    
    <h3>🔍 Можливості калькулятора:</h3>
    <ul>
      <li><strong>Конвертація кутів</strong> - градуси ↔ радіани</li>
      <li><strong>Тригонометричні функції</strong> - sin, cos, tan, cot, sec, csc</li>
      <li><strong>Точні значення</strong> - для стандартних кутів (0°, 30°, 45°, 60°, 90° тощо)</li>
      <li><strong>Візуалізація</strong> - положення кута на одиничному колі</li>
    </ul>
    
    <h3>📝 Формули конвертації:</h3>
    <div class="formulas-section">
      <h4>Градуси в радіани:</h4>
      <p>радіани = градуси × π/180</p>
      
      <h4>Радіани в градуси:</h4>
      <p>градуси = радіани × 180/π</p>
      
      <h4>Основні співвідношення:</h4>
      <p>360° = 2π радіан</p>
      <p>180° = π радіан</p>
      <p>90° = π/2 радіан</p>
    </div>
scripts:
  - /assets/js/degrees-radians-converter.js
faq:
  - question: Чому використовують радіани?
    answer: "Радіани - це природна міра кута в математиці. Довжина дуги дорівнює радіусу, помноженому на кут у радіанах, що спрощує багато формул."
  - question: Скільки радіанів у повному колі?
    answer: "Повне коло містить 2π радіанів, що дорівнює 360 градусам."
  - question: Які точні значення sin і cos для основних кутів?
    answer: "0°: sin=0, cos=1; 30°: sin=1/2, cos=√3/2; 45°: sin=√2/2, cos=√2/2; 60°: sin=√3/2, cos=1/2; 90°: sin=1, cos=0"
  - question: Що таке котангенс, секанс і косеканс?
    answer: "cot = cos/sin (котангенс), sec = 1/cos (секанс), csc = 1/sin (косеканс) - це зворотні тригонометричні функції."
---

<div class="degrees-radians-converter">
  <div class="converter-section">
    <h3>🔄 Конвертер кутів</h3>
    <div class="conversion-grid">
      <div class="angle-input">
        <label>
          Градуси (°):
          <input type="number" id="degrees" value="45" step="0.01">
        </label>
      </div>
      <div class="conversion-arrow">⟷</div>
      <div class="angle-input">
        <label>
          Радіани:
          <input type="number" id="radians" value="" step="0.001">
        </label>
      </div>
    </div>
    
    <div class="standard-angles">
      <h4>📐 Стандартні кути:</h4>
      <div class="angle-buttons">
        <button class="angle-btn" data-deg="0">0°</button>
        <button class="angle-btn" data-deg="30">30°</button>
        <button class="angle-btn" data-deg="45">45°</button>
        <button class="angle-btn" data-deg="60">60°</button>
        <button class="angle-btn" data-deg="90">90°</button>
        <button class="angle-btn" data-deg="120">120°</button>
        <button class="angle-btn" data-deg="135">135°</button>
        <button class="angle-btn" data-deg="150">150°</button>
        <button class="angle-btn" data-deg="180">180°</button>
        <button class="angle-btn" data-deg="270">270°</button>
        <button class="angle-btn" data-deg="360">360°</button>
      </div>
    </div>
  </div>

  <div id="trig-result" class="result insight-card"></div>
  
  <div class="visual-section">
    <h4>🎯 Візуалізація на одиничному колі:</h4>
    <canvas id="unit-circle-canvas" width="300" height="300"></canvas>
  </div>
  
  <div class="trig-table">
    <h4>📊 Таблиця точних значень:</h4>
    <div class="table-container">
      <table id="exact-values-table">
        <thead>
          <tr>
            <th>Кут</th>
            <th>Градуси</th>
            <th>Радіани</th>
            <th>sin</th>
            <th>cos</th>
            <th>tan</th>
          </tr>
        </thead>
        <tbody>
          <!-- Filled by JavaScript -->
        </tbody>
      </table>
    </div>
  </div>
</div>