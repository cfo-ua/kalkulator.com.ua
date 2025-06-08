---
layout: calculator
title: "Калькулятор молярної маси речовини"
categories: [school]
seo:
  title: "Калькулятор молярної маси | Шкільні калькулятори"
  description: "Обчисліть молярну масу речовини за хімічною формулою."
  keywords:
    - молярна маса
    - хімія
    - калькулятор
    - школа
    - формула
  content: |
    <h2>Калькулятор молярної маси речовини</h2>
    <p>Введіть хімічну формулу (наприклад, H2O, CO2) для обчислення молярної маси.</p>
scripts:
  - /assets/js/molar-mass.js
faq:
  - question: Що таке молярна маса?
    answer: "Молярна маса — це маса 1 моля речовини, обчислюється у г/моль."
  - question: Як користуватися калькулятором?
    answer: "Введіть хімічну формулу, наприклад NaCl, H2SO4."
---

<form id="molar-mass-form" autocomplete="off">
  <label>
    Формула:
    <input type="text" id="molar-input" placeholder="Наприклад: H2O" required>
  </label>
  <button type="submit">Обчислити</button>
</form>
<div id="molar-mass-result" class="result"></div>
