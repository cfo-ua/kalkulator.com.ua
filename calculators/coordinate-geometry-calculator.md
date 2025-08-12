---
layout: calculator
title: "Калькулятор координатної геометрії (відстань, середина, нахил)"
categories: [school]
seo:
  title: "Калькулятор координатної геометрії - відстань, середина, нахил | Шкільні калькулятори"
  description: "Обчисліть відстань між точками, середину відрізка та нахил прямої. Онлайн калькулятор для аналітичної геометрії з формулами та поясненнями."
  keywords:
    - відстань між точками
    - середина відрізка
    - нахил прямої
    - координатна геометрія
    - аналітична геометрія
    - формула відстані
    - калькулятор геометрії
    - шкільна математика
  content: |
    <h2>📍 Калькулятор координатної геометрії</h2>
    <p>Швидко обчисліть основні параметри координатної геометрії: відстань між двома точками, координати середини відрізка та нахил прямої. Ідеально підходить для розв'язання задач з аналітичної геометрії.</p>
    
    <h3>🔍 Доступні розрахунки:</h3>
    <ul>
      <li><strong>Відстань між точками</strong> - за формулою Евкліда</li>
      <li><strong>Середина відрізка</strong> - координати центральної точки</li>
      <li><strong>Нахил прямої</strong> - кутовий коефіцієнт та кут нахилу</li>
    </ul>
    
    <h3>📝 Формули:</h3>
    <div class="formulas-section">
      <h4>Відстань між точками:</h4>
      <p>d = √[(x₂ - x₁)² + (y₂ - y₁)²]</p>
      
      <h4>Середина відрізка:</h4>
      <p>M = ((x₁ + x₂)/2, (y₁ + y₂)/2)</p>
      
      <h4>Нахил прямої:</h4>
      <p>m = (y₂ - y₁)/(x₂ - x₁)</p>
      <p>θ = arctg(m) × 180°/π</p>
    </div>
    
    <h3>💡 Застосування:</h3>
    <ul>
      <li>Розв'язання геометричних задач</li>
      <li>Побудова графіків функцій</li>
      <li>Навігація та картографія</li>
      <li>Комп'ютерна графіка</li>
      <li>Інженерні розрахунки</li>
    </ul>
scripts:
  - /assets/js/coordinate-geometry-calculator.js
faq:
  - question: Що таке формула відстані?
    answer: "Формула відстані d = √[(x₂-x₁)² + (y₂-y₁)²] - це застосування теореми Піфагора для знаходження відстані між двома точками на координатній площині."
  - question: Як знайти середину відрізка?
    answer: "Координати середини відрізка обчислюються як середнє арифметичне відповідних координат кінцевих точок: M((x₁+x₂)/2, (y₁+y₂)/2)."
  - question: Що показує нахил прямої?
    answer: "Нахил (кутовий коефіцієнт) показує, на скільки одиниць змінюється y при зміні x на 1 одиницю. Позитивний нахил - пряма йде вгору, негативний - вниз."
  - question: Коли нахил прямої не визначений?
    answer: "Нахил не визначений, коли пряма вертикальна (x₁ = x₂), оскільки відбувається ділення на нуль."
---

<div class="coordinate-calculator">
  <div class="calculation-selector">
    <h3>🎯 Оберіть тип розрахунку:</h3>
    <div class="calc-buttons">
      <button class="calc-btn active" data-calc="distance">📏 Відстань</button>
      <button class="calc-btn" data-calc="midpoint">📍 Середина</button>
      <button class="calc-btn" data-calc="slope">📐 Нахил</button>
    </div>
  </div>

  <div class="points-input">
    <h4>📊 Введіть координати точок:</h4>
    <div class="points-grid">
      <div class="point-group">
        <h5>Точка A (x₁, y₁):</h5>
        <div class="coordinate-inputs">
          <label>
            x₁:
            <input type="number" id="x1" value="1" step="0.1">
          </label>
          <label>
            y₁:
            <input type="number" id="y1" value="2" step="0.1">
          </label>
        </div>
      </div>
      
      <div class="point-group">
        <h5>Точка B (x₂, y₂):</h5>
        <div class="coordinate-inputs">
          <label>
            x₂:
            <input type="number" id="x2" value="4" step="0.1">
          </label>
          <label>
            y₂:
            <input type="number" id="y2" value="6" step="0.1">
          </label>
        </div>
      </div>
    </div>
    
    <button class="calculate-btn" onclick="calculateCoordinateGeometry()">🧮 Розрахувати всі параметри</button>
  </div>

  <div id="coordinate-result" class="result insight-card"></div>
  
  <div class="visual-representation">
    <h4>📊 Графічне представлення:</h4>
    <canvas id="coordinate-canvas" width="400" height="400"></canvas>
  </div>
</div>