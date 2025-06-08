---
layout: calculator
title: "Калькулятор тригонометричних функцій"
categories: [school]
seo:
  title: "Калькулятор тригонометрії | Шкільні калькулятори"
  description: "Обчисліть значення sin, cos, tan та cot для заданого кута в градусах."
  keywords:
    - тригонометрія
    - синус
    - косинус
    - тангенс
    - котангенс
    - школа
    - калькулятор
  content: |
    <h2>Калькулятор тригонометричних функцій</h2>
    <p>Введіть кут у градусах (0–360°) — дізнайтеся значення sin, cos, tan, cot.</p>
scripts:
  - /assets/js/trig.js
faq:
  - question: В якій системі вводити кут?
    answer: "У градусах (0–360°)."
  - question: Що таке cot?
    answer: "cot(x) = 1 / tan(x)"
---

<form id="trig-form" autocomplete="off">
  <label>
    Кут (°):
    <input type="number" id="trig-angle" min="0" max="360" value="30" step="any" required>
  </label>
  <button type="submit">Обчислити</button>
</form>
<div id="trig-result" class="result"></div>
