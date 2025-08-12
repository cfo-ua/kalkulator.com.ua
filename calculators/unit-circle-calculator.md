---
layout: calculator
title: "Калькулятор і квіз одиничного кола (кути, координати, тригонометричні значення)"
categories: [school]
seo:
  title: "Калькулятор одиничного кола - кути, координати, тригонометрія | Шкільні калькулятори"
  description: "Вивчайте одиничне коло з інтерактивним калькулятором та квізом. Знаходьте кути, координати та тригонометричні значення. Ідеально для навчання тригонометрії."
  keywords:
    - одиничне коло
    - тригонометричне коло
    - калькулятор тригонометрії
    - квіз одиничного кола
    - координати на колі
    - тригонометричні функції
    - навчання тригонометрії
    - шкільна математика
  content: |
    <h2>⭕ Калькулятор і квіз одиничного кола</h2>
    <p>Інтерактивний інструмент для вивчення одиничного кола. Знаходьте координати точок, обчислюйте тригонометричні функції та перевіряйте свої знання за допомогою квізу. Ідеальний помічник для освоєння тригонометрії.</p>
    
    <h3>🔍 Функції калькулятора:</h3>
    <ul>
      <li><strong>Калькулятор</strong> - знаходження координат та тригонометричних значень</li>
      <li><strong>Квіз</strong> - перевірка знань одиничного кола</li>
      <li><strong>Візуалізація</strong> - інтерактивне одиничне коло</li>
      <li><strong>Навчання</strong> - покрокові пояснення</li>
    </ul>
    
    <h3>📝 Що таке одиничне коло:</h3>
    <div class="concept-explanation">
      <p>Одиничне коло - це коло з радіусом 1, центром в початку координат. На ньому:</p>
      <ul>
        <li>x-координата точки = cos(θ)</li>
        <li>y-координата точки = sin(θ)</li>
        <li>Повний оберт = 360° = 2π радіан</li>
        <li>Перший квадрант: 0° - 90°</li>
        <li>Другий квадрант: 90° - 180°</li>
        <li>Третій квадрант: 180° - 270°</li>
        <li>Четвертий квадрант: 270° - 360°</li>
      </ul>
    </div>
scripts:
  - /assets/js/unit-circle-calculator.js
faq:
  - question: Що таке одиничне коло?
    answer: "Одиничне коло - це коло з радіусом 1 та центром в початку координат (0,0). Воно використовується для визначення тригонометричних функцій."
  - question: Як зв'язані координати точки на одиничному колі з тригонометричними функціями?
    answer: "Для кута θ: x-координата точки на одиничному колі дорівнює cos(θ), а y-координата дорівнює sin(θ)."
  - question: Чому важливо знати одиничне коло?
    answer: "Одиничне коло допомагає візуально зрозуміти тригонометричні функції, їх періодичність та взаємозв'язки між різними кутами."
  - question: Які основні точки потрібно запам'ятати на одиничному колі?
    answer: "Основні точки: 0°, 30°, 45°, 60°, 90°, 120°, 135°, 150°, 180°, 210°, 225°, 240°, 270°, 300°, 315°, 330°, 360°."
---

<div class="unit-circle-app">
  <div class="app-modes">
    <h3>🎯 Режим роботи:</h3>
    <div class="mode-buttons">
      <button class="mode-btn active" data-mode="calculator">🧮 Калькулятор</button>
      <button class="mode-btn" data-mode="quiz">❓ Квіз</button>
      <button class="mode-btn" data-mode="practice">📚 Навчання</button>
    </div>
  </div>

  <!-- Calculator Mode -->
  <div id="calculator-mode" class="mode-section active">
    <div class="calculator-section">
      <h4>🧮 Калькулятор одиничного кола</h4>
      <div class="input-methods">
        <div class="angle-input-method">
          <h5>Введіть кут:</h5>
          <div class="angle-inputs">
            <label>
              Градуси:
              <input type="number" id="calc-degrees" value="45" step="1" min="0" max="360">
              <span>°</span>
            </label>
            <span class="or">або</span>
            <label>
              Радіани:
              <input type="number" id="calc-radians" value="" step="0.1">
              <span>рад</span>
            </label>
          </div>
        </div>
        
        <div class="coordinate-input-method">
          <h5>Або введіть координати:</h5>
          <div class="coord-inputs">
            <label>
              x (cos):
              <input type="number" id="calc-x" step="0.01" min="-1" max="1">
            </label>
            <label>
              y (sin):
              <input type="number" id="calc-y" step="0.01" min="-1" max="1">
            </label>
            <button id="find-angle-btn">🔍 Знайти кут</button>
          </div>
        </div>
      </div>
    </div>
    
    <div id="calculator-result" class="result insight-card"></div>
  </div>

  <!-- Quiz Mode -->
  <div id="quiz-mode" class="mode-section">
    <div class="quiz-section">
      <h4>❓ Квіз одиничного кола</h4>
      <div class="quiz-settings">
        <label>
          Тип питань:
          <select id="quiz-type">
            <option value="coordinates">Координати для кута</option>
            <option value="angle">Кут для координат</option>
            <option value="trig">Тригонометричні значення</option>
            <option value="mixed">Змішані питання</option>
          </select>
        </label>
        <label>
          Складність:
          <select id="quiz-difficulty">
            <option value="easy">Легка (основні кути)</option>
            <option value="medium">Середня (всі квадранти)</option>
            <option value="hard">Важка (довільні кути)</option>
          </select>
        </label>
        <button id="start-quiz-btn">🚀 Почати квіз</button>
      </div>
      
      <div id="quiz-content" class="quiz-content" style="display: none;">
        <div class="quiz-header">
          <span id="quiz-score">Рахунок: 0/0</span>
          <span id="quiz-timer">Час: 0с</span>
        </div>
        <div id="quiz-question" class="quiz-question"></div>
        <div id="quiz-options" class="quiz-options"></div>
        <button id="next-question-btn" style="display: none;">➡️ Наступне питання</button>
        <button id="finish-quiz-btn" style="display: none;">🏁 Завершити квіз</button>
      </div>
      
      <div id="quiz-results" class="quiz-results" style="display: none;"></div>
    </div>
  </div>

  <!-- Practice Mode -->
  <div id="practice-mode" class="mode-section">
    <div class="practice-section">
      <h4>📚 Режим навчання</h4>
      <div class="practice-topics">
        <button class="topic-btn" data-topic="quadrants">🏠 Квадранти</button>
        <button class="topic-btn" data-topic="special-angles">⭐ Особливі кути</button>
        <button class="topic-btn" data-topic="signs">➕➖ Знаки функцій</button>
        <button class="topic-btn" data-topic="symmetry">🔄 Симетрія</button>
      </div>
      <div id="practice-content" class="practice-content"></div>
    </div>
  </div>

  <!-- Interactive Unit Circle -->
  <div class="interactive-circle">
    <h4>⭕ Інтерактивне одиничне коло</h4>
    <canvas id="unit-circle-main" width="400" height="400"></canvas>
    <div class="circle-controls">
      <button id="show-angles-btn">📐 Показати кути</button>
      <button id="show-coordinates-btn">📍 Показати координати</button>
      <button id="animate-btn">▶️ Анімація</button>
    </div>
  </div>
</div>