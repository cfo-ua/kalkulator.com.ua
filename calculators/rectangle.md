---
layout: calculator
title: "Калькулятор площі та периметру прямокутника"
categories: [school]
seo:
  title: "Калькулятор площі та периметру прямокутника | Шкільні калькулятори"
  description: "Обчисліть площу та периметр прямокутника онлайн. Формули, приклади, зручний калькулятор для школярів і дорослих."
  keywords:
    - площа прямокутника
    - периметр прямокутника
    - формула площі
    - математичний калькулятор
    - обчислення площі
    - онлайн калькулятор
    - прямокутник
    - школа
  content: |
    <h2>Калькулятор площі та периметру прямокутника</h2>
    <p>Введіть довжини сторін <strong>a</strong> і <strong>b</strong>, щоб дізнатися:</p>
    <ul>
      <li>Площа прямокутника: <code>S = a × b</code></li>
      <li>Периметр прямокутника: <code>P = 2 × (a + b)</code></li>
    </ul>
scripts:
  - /assets/js/rectangle.js
faq:
  - question: Як знайти площу прямокутника?
    answer: "Формула: S = a × b. Наприклад, якщо a = 5 м, b = 3 м, то площа: 5 × 3 = 15 м²."
  - question: Як знайти периметр прямокутника?
    answer: "Формула: P = 2 × (a + b). Наприклад, при a = 5, b = 3: P = 2 × (5 + 3) = 16 м."
  - question: У чому вимірюється площа і периметр?
    answer: "Площа — у квадратних одиницях (м², см²), периметр — у лінійних (м, см)."
---

<form id="rectangle-form" autocomplete="off">
  <label>
    Сторона a:
    <input type="number" id="rect-a" value="1" min="0" step="any" required>
  </label>
  <label>
    Сторона b:
    <input type="number" id="rect-b" value="1" min="0" step="any" required>
  </label>
  <button type="submit">Обчислити</button>
</form>
<div id="rectangle-result" class="result"></div>
