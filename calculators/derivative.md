---
layout: calculator
title: "Калькулятор похідної функції"
categories: [school]
seo:
  title: "Калькулятор похідної полінома | Знайти похідну онлайн | Шкільні калькулятори"
  description: "Знайдіть похідну поліноміальної функції (до x⁵) онлайн. Введіть коефіцієнти a₅...a₀ — отримайте похідну миттєво!"
  keywords:
    - похідна
    - знайти похідну
    - похідна полінома
    - похідна функції
    - алгебра
    - математика
    - онлайн калькулятор
    - шкільний калькулятор
  content: |
    <h2>Калькулятор похідної полінома</h2>
    <p>Введіть коефіцієнти для полінома вигляду <strong>a₅x⁵ + a₄x⁴ + a₃x³ + a₂x² + a₁x + a₀</strong>, і калькулятор знайде його похідну.</p>
scripts:
  - /assets/js/derivative.js
faq:
  - question: Що таке похідна?
    answer: "Похідна функції — це функція, яка показує, як швидко змінюється значення початкової функції при зміні аргументу."
  - question: Як обчислюється похідна полінома?
    answer: "Похідна кожного члена виду axⁿ дорівнює anxⁿ⁻¹. Наприклад, похідна 3x⁴ — це 12x³."
  - question: Для яких функцій працює калькулятор?
    answer: "Калькулятор знаходить похідну полінома до п’ятого степеня включно (x⁵)."
---

<form id="derivative-form" autocomplete="off">
  <label>
    a₅:
    <input type="number" id="d5" value="0" step="any" required>
  </label>
  <label>
    a₄:
    <input type="number" id="d4" value="0" step="any" required>
  </label>
  <label>
    a₃:
    <input type="number" id="d3" value="0" step="any" required>
  </label>
  <label>
    a₂:
    <input type="number" id="d2" value="0" step="any" required>
  </label>
  <label>
    a₁:
    <input type="number" id="d1" value="1" step="any" required>
  </label>
  <label>
    a₀:
    <input type="number" id="d0" value="0" step="any" required>
  </label>
  <button type="submit">Знайти похідну</button>
</form>
<div id="derivative-result" class="result"></div>
