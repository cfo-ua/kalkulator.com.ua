---
layout: calculator
title: "Калькулятор квадратного рівняння"
categories: [school]
seo:
  title: "Калькулятор квадратного рівняння | Шкільні калькулятори"
  description: "Розвʼязуйте квадратне рівняння онлайн та знаходьте корені за допомогою простого калькулятора для школярів."
  keywords:
    - квадратне рівняння
    - розвʼязання рівнянь
    - математика
    - калькулятор
    - школа
  content: |
    <h2>Калькулятор квадратного рівняння</h2>
    <p>Введіть коефіцієнти <b>a</b>, <b>b</b>, <b>c</b> для рівняння <b>ax² + bx + c = 0</b> і дізнайтеся розвʼязки.</p>
scripts:
  - /assets/js/quadratic.js
faq:
  - question: Як знайти корені квадратного рівняння?
    answer: "Використовуйте формулу дискримінанта: x = (-b ± √D) / 2a, де D = b² - 4ac."
  - question: Що таке дискримінант?
    answer: "Дискримінант — це вираз b² - 4ac, який визначає кількість розвʼязків рівняння."
---

<form id="quadratic-form" autocomplete="off">
  <label>
    a:
    <input type="number" id="quad-a" value="1" required>
  </label>
  <label>
    b:
    <input type="number" id="quad-b" value="0" required>
  </label>
  <label>
    c:
    <input type="number" id="quad-c" value="0" required>
  </label>
  <button type="submit">Розвʼязати</button>
</form>
<div id="quadratic-result" class="result"></div>
