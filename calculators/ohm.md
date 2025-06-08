---
layout: calculator
title: "Калькулятор закону Ома"
categories: [school]
seo:
  title: "Калькулятор закону Ома | Шкільні калькулятори"
  description: "Обчисліть напругу, силу струму або опір за законом Ома (U = I × R)."
  keywords:
    - закон Ома
    - фізика
    - калькулятор
    - школа
  content: |
    <h2>Калькулятор закону Ома</h2>
    <p>Введіть будь-які два з трьох параметрів (U, I, R) — третій буде розраховано автоматично.</p>
scripts:
  - /assets/js/ohm.js
faq:
  - question: Яка формула закону Ома?
    answer: "U = I × R, де U — напруга (В), I — струм (А), R — опір (Ом)."
  - question: Що можна обчислити калькулятором?
    answer: "Будь-який з трьох параметрів, якщо відомі два інших."
---

<form id="ohm-form" autocomplete="off">
  <label>
    Напруга (U, В):
    <input type="number" id="ohm-u" step="any">
  </label>
  <label>
    Сила струму (I, А):
    <input type="number" id="ohm-i" step="any">
  </label>
  <label>
    Опір (R, Ом):
    <input type="number" id="ohm-r" step="any">
  </label>
  <button type="submit">Обчислити</button>
</form>
<div id="ohm-result" class="result"></div>
