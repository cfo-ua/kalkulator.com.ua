---
layout: calculator
title: "Калькулятор похідної функції"
categories: [school]
seo:
  title: "Калькулятор похідної | Шкільні калькулятори"
  description: "Знайдіть похідну полінома (до x^5) онлайн — швидко та просто."
  keywords:
    - похідна
    - алгебра
    - математика
    - калькулятор
    - школа
  content: |
    <h2>Калькулятор похідної полінома</h2>
    <p>Введіть коефіцієнти для полінома вигляду <b>a₅x⁵ + a₄x⁴ + ... + a₁x + a₀</b> і дізнайтеся похідну.</p>
scripts:
  - /assets/js/derivative.js
faq:
  - question: Що таке похідна?
    answer: "Похідна функції показує швидкість зміни цієї функції."
  - question: Для яких функцій працює калькулятор?
    answer: "Для поліномів до x⁵ включно."
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
