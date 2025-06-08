---
layout: calculator
title: "Калькулятор площі та периметру прямокутника"
categories: [school]
seo:
  title: "Калькулятор площі та периметру прямокутника | Шкільні калькулятори"
  description: "Обчисліть площу та периметр прямокутника онлайн для задач з математики."
  keywords:
    - площа прямокутника
    - периметр
    - математика
    - калькулятор
    - школа
  content: |
    <h2>Калькулятор площі та периметру прямокутника</h2>
    <p>Введіть сторони прямокутника <b>a</b> і <b>b</b>, щоб знайти площу та периметр.</p>
scripts:
  - /assets/js/rectangle.js
faq:
  - question: Як знайти площу прямокутника?
    answer: "Площа = a × b, де a і b — сторони прямокутника."
  - question: Як знайти периметр прямокутника?
    answer: "Периметр = 2 × (a + b)."
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
