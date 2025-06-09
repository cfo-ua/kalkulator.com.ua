---
layout: calculator
title: "Калькулятор довжини плінтуса"
categories: [construction]
seo:
  title: "Калькулятор плінтуса | Будівельні калькулятори"
  description: "Розрахуйте необхідну довжину плінтуса для кімнати."
  keywords:
    - плінтус
    - підлога
    - ремонт
    - будівництво
    - калькулятор
  content: |
    <h2>Калькулятор довжини плінтуса</h2>
    <p>Введіть довжину і ширину кімнати, а також довжину дверей — калькулятор визначить потрібну довжину плінтуса.</p>
scripts:
  - /assets/js/baseboard.js
faq:
  - question: Як розрахувати довжину плінтуса?
    answer: "Від периметра кімнати віднімають довжину дверей/проходів."
---

<form id="baseboard-form" autocomplete="off">
  <label>
    Довжина кімнати (м):
    <input type="number" id="baseboard-length" min="0" step="any" required>
  </label>
  <label>
    Ширина кімнати (м):
    <input type="number" id="baseboard-width" min="0" step="any" required>
  </label>
  <label>
    Загальна довжина дверей/проходів (м, опціонально):
    <input type="number" id="baseboard-doors" min="0" step="any" value="0">
  </label>
  <button type="submit">Розрахувати</button>
</form>
<div id="baseboard-result" class="result"></div>
