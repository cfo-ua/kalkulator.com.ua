---
layout: calculator
title: "Калькулятор тригонометричних функцій"
categories: [school]
seo:
  title: "Калькулятор тригонометрії | Шкільні калькулятори"
  description: "Розрахуйте значення sin, cos, tan і cot для будь-якого кута в градусах. Онлайн калькулятор для учнів та студентів."
  keywords:
    - тригонометрія
    - синус
    - косинус
    - тангенс
    - котангенс
    - тригонометричні функції
    - калькулятор sin cos tan
    - school math
    - кут у градусах
    - онлайн калькулятор
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
  - question: Які основні тригонометричні формули?
    answer: "sin²(x) + cos²(x) = 1, tan(x) = sin(x) / cos(x), cot(x) = cos(x) / sin(x)."
  - question: Для чого використовують тригонометрію?
    answer: "Тригонометрія використовується в геометрії, фізиці, будівництві, навігації та інженерії."
---

<form id="trig-form" autocomplete="off">
  <label>
    Кут (°):
    <input type="number" id="trig-angle" min="0" max="360" value="30" step="any" required>
  </label>
  <button type="submit">Обчислити</button>
</form>
<div id="trig-result" class="result"></div>
