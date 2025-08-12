---
layout: calculator
title: "Калькулятор об'єму та площі поверхні (призма, циліндр, конус, піраміда)"
categories: [school]
seo:
  title: "Калькулятор об'єму та площі поверхні - призма, циліндр, конус, піраміда | Шкільні калькулятори"
  description: "Обчисліть об'єм та площу поверхні різних геометричних фігур: призма, циліндр, конус, піраміда. Онлайн калькулятор для геометрії з формулами та поясненнями."
  keywords:
    - об'єм геометричних фігур
    - площа поверхні
    - призма об'єм
    - циліндр об'єм
    - конус об'єм
    - піраміда об'єм
    - геометрія калькулятор
    - шкільна математика
    - стереометрія
  content: |
    <h2>📐 Калькулятор об'єму та площі поверхні геометричних фігур</h2>
    <p>Розрахуйте об'єм та площу поверхні основних просторових фігур: прямокутної призми, циліндра, конуса та піраміди. Введіть необхідні параметри та отримайте точні результати з детальними формулами.</p>
    
    <h3>🔍 Підтримувані фігури:</h3>
    <ul>
      <li><strong>Прямокутна призма</strong> - довжина, ширина, висота</li>
      <li><strong>Циліндр</strong> - радіус основи, висота</li>
      <li><strong>Конус</strong> - радіус основи, висота</li>
      <li><strong>Піраміда</strong> - площа основи, висота</li>
    </ul>
    
    <h3>📝 Формули для розрахунків:</h3>
    <div class="formulas-section">
      <h4>Прямокутна призма:</h4>
      <p>• Об'єм: V = a × b × h</p>
      <p>• Площа поверхні: S = 2(ab + ah + bh)</p>
      
      <h4>Циліндр:</h4>
      <p>• Об'єм: V = π × r² × h</p>
      <p>• Площа поверхні: S = 2πr(r + h)</p>
      
      <h4>Конус:</h4>
      <p>• Об'єм: V = (1/3) × π × r² × h</p>
      <p>• Площа поверхні: S = πr(r + l), де l = √(r² + h²)</p>
      
      <h4>Піраміда:</h4>
      <p>• Об'єм: V = (1/3) × Sосн × h</p>
      <p>• Площа поверхні: S = Sосн + Sбіч</p>
    </div>
    
    <h3>💡 Застосування:</h3>
    <ul>
      <li>Архітектурне та будівельне планування</li>
      <li>Інженерні розрахунки</li>
      <li>Оцінка матеріалів для проектів</li>
      <li>Шкільні задачі з геометрії</li>
      <li>3D моделювання та дизайн</li>
    </ul>
scripts:
  - /assets/js/geometry-shapes-calculator.js
faq:
  - question: Які одиниці вимірювання використовувати?
    answer: "Усі лінійні розміри повинні бути в одних одиницях (см, м, дм тощо). Результати об'єму будуть в кубічних одиницях, площі - в квадратних."
  - question: Що таке твірна конуса?
    answer: "Твірна конуса (l) - це відстань від вершини конуса до будь-якої точки на колі основи. Розраховується за формулою l = √(r² + h²)."
  - question: Як розрахувати площу основи піраміди?
    answer: "Площа основи залежить від форми: квадрат - a², прямокутник - a×b, трикутник - (1/2)×a×h, коло - π×r²."
  - question: Чому об'єм конуса та піраміди ділиться на 3?
    answer: "Це математичний факт: об'єм конуса чи піраміди завжди становить 1/3 від об'єму циліндра чи призми з такими ж основою та висотою."
---

<div class="geometry-calculator">
  <div class="shape-selector">
    <h3>🎯 Оберіть геометричну фігуру:</h3>
    <div class="shape-buttons">
      <button class="shape-btn active" data-shape="prism">📦 Призма</button>
      <button class="shape-btn" data-shape="cylinder">🥤 Циліндр</button>
      <button class="shape-btn" data-shape="cone">🏔️ Конус</button>
      <button class="shape-btn" data-shape="pyramid">🔺 Піраміда</button>
    </div>
  </div>

  <!-- Прямокутна призма -->
  <div id="prism-form" class="shape-form active">
    <h4>📦 Прямокутна призма</h4>
    <form autocomplete="off">
      <label>
        Довжина (a):
        <input type="number" id="prism-length" value="5" step="0.01" min="0.01">
        <span class="unit">см</span>
      </label>
      <label>
        Ширина (b):
        <input type="number" id="prism-width" value="3" step="0.01" min="0.01">
        <span class="unit">см</span>
      </label>
      <label>
        Висота (h):
        <input type="number" id="prism-height" value="4" step="0.01" min="0.01">
        <span class="unit">см</span>
      </label>
      <button type="submit">🧮 Розрахувати</button>
    </form>
  </div>

  <!-- Циліндр -->
  <div id="cylinder-form" class="shape-form">
    <h4>🥤 Циліндр</h4>
    <form autocomplete="off">
      <label>
        Радіус основи (r):
        <input type="number" id="cylinder-radius" value="3" step="0.01" min="0.01">
        <span class="unit">см</span>
      </label>
      <label>
        Висота (h):
        <input type="number" id="cylinder-height" value="6" step="0.01" min="0.01">
        <span class="unit">см</span>
      </label>
      <button type="submit">🧮 Розрахувати</button>
    </form>
  </div>

  <!-- Конус -->
  <div id="cone-form" class="shape-form">
    <h4>🏔️ Конус</h4>
    <form autocomplete="off">
      <label>
        Радіус основи (r):
        <input type="number" id="cone-radius" value="4" step="0.01" min="0.01">
        <span class="unit">см</span>
      </label>
      <label>
        Висота (h):
        <input type="number" id="cone-height" value="8" step="0.01" min="0.01">
        <span class="unit">см</span>
      </label>
      <button type="submit">🧮 Розрахувати</button>
    </form>
  </div>

  <!-- Піраміда -->
  <div id="pyramid-form" class="shape-form">
    <h4>🔺 Піраміда</h4>
    <form autocomplete="off">
      <label>
        Площа основи (S):
        <input type="number" id="pyramid-base" value="16" step="0.01" min="0.01">
        <span class="unit">см²</span>
      </label>
      <label>
        Висота (h):
        <input type="number" id="pyramid-height" value="6" step="0.01" min="0.01">
        <span class="unit">см</span>
      </label>
      <button type="submit">🧮 Розрахувати</button>
    </form>
  </div>

  <div id="geometry-result" class="result insight-card"></div>
</div>