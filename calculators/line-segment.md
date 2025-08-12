---
layout: calculator
title: "Калькулятор відрізка прямої"
categories: [school]
seo:
  title: "Калькулятор відрізка прямої | Аналітична геометрія"
  description: "Розрахуйте довжину відрізка, середину, точку поділу та кут нахилу між двома точками на площині. Калькулятор для координатної геометрії."
  keywords:
    - відрізок прямої
    - довжина відрізка
    - середина відрізка
    - точка поділу
    - координати точок
    - аналітична геометрія
    - координатна площина
    - декартові координати
  content: |
    <h2>Калькулятор відрізка прямої 📏</h2>
    <p>Обчисліть <strong>всі параметри відрізка</strong> між двома точками на координатній площині. Знайдіть довжину, середину, точку поділу у заданому відношенні та кут нахилу.</p>
    
    <h3>📐 Основні формули</h3>
    <ul>
      <li><strong>Довжина:</strong> d = √[(x₂-x₁)² + (y₂-y₁)²]</li>
      <li><strong>Середина:</strong> M((x₁+x₂)/2, (y₁+y₂)/2)</li>
      <li><strong>Поділ у відношенні m:n:</strong> P((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n))</li>
      <li><strong>Кут нахилу:</strong> α = arctan((y₂-y₁)/(x₂-x₁))</li>
    </ul>
    
    <h3>🎯 Що можна розрахувати:</h3>
    <ul>
      <li>✅ <strong>Довжину відрізка</strong> за координатами кінців</li>
      <li>✅ <strong>Координати середини</strong> відрізка</li>
      <li>✅ <strong>Точку поділу</strong> у заданому відношенні</li>
      <li>✅ <strong>Кут нахилу</strong> відрізка до осі OX</li>
      <li>✅ <strong>Рівняння прямої</strong>, що проходить через точки</li>
      <li>✅ <strong>Відстань від точки</strong> до прямої</li>
    </ul>
scripts:
  - /assets/js/line-segment.js
faq:
  - question: Як знайти довжину відрізка за координатами?
    answer: "Використовуйте формулу відстані: d = √[(x₂-x₁)² + (y₂-y₁)²]. Це випливає з теореми Піфагора для прямокутного трикутника."
  - question: Що таке середина відрізка?
    answer: "Середина відрізка — це точка, що ділить відрізок навпіл. Її координати: M((x₁+x₂)/2, (y₁+y₂)/2)."
  - question: Як поділити відрізок у заданому відношенні?
    answer: "Для поділу відрізка AB у відношенні m:n точка P має координати: P((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n))."
  - question: Що означає кут нахилу відрізка?
    answer: "Кут нахилу — це кут між відрізком та додатним напрямком осі OX. Вимірюється від 0° до 180°."
---

<form id="segment-form" autocomplete="off">
  <div class="input-group">
    <h4>📍 Координати першої точки A</h4>
    <label>
      x₁:
      <input type="number" id="x1" value="0" step="0.1" required>
    </label>
    <label>
      y₁:
      <input type="number" id="y1" value="0" step="0.1" required>
    </label>
  </div>

  <div class="input-group">
    <h4>📍 Координати другої точки B</h4>
    <label>
      x₂:
      <input type="number" id="x2" value="3" step="0.1" required>
    </label>
    <label>
      y₂:
      <input type="number" id="y2" value="4" step="0.1" required>
    </label>
  </div>

  <div class="input-group">
    <h4>🎯 Поділ у відношенні (опціонально)</h4>
    <label>
      m (частина до точки поділу):
      <input type="number" id="ratio-m" value="1" min="0" step="0.1">
    </label>
    <label>
      n (частина після точки поділу):
      <input type="number" id="ratio-n" value="1" min="0" step="0.1">
    </label>
  </div>

  <div class="input-group">
    <h4>📏 Додаткова точка C (для відстані до прямої)</h4>
    <label>
      x₃:
      <input type="number" id="x3" value="1" step="0.1">
    </label>
    <label>
      y₃:
      <input type="number" id="y3" value="1" step="0.1">
    </label>
  </div>

  <button type="submit">📊 Розрахувати параметри</button>
</form>

<div id="segment-result" class="result"></div>