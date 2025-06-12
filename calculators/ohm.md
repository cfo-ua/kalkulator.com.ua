---
layout: calculator
title: "Калькулятор закону Ома"
categories: [school]
seo:
  title: "Калькулятор закону Ома | Шкільні калькулятори"
  description: "Онлайн калькулятор для розрахунку напруги, сили струму або опору за формулою закону Ома (U = I × R). Зручно для учнів і студентів."
  keywords:
    - закон Ома
    - калькулятор закону Ома
    - фізика
    - напруга
    - струм
    - опір
    - формула Ома
    - школа
    - електрика
  content: |
    <h2>Калькулятор закону Ома</h2>
    <p>Введіть будь-які два з трьох параметрів (U, I, R) — третій буде розраховано автоматично.</p>
scripts:
  - /assets/js/ohm.js
faq:
  - question: Яка формула закону Ома?
    answer: "U = I × R, де U — напруга (В), I — сила струму (А), R — опір (Ом)."
  - question: Що можна обчислити калькулятором?
    answer: "Будь-який з трьох параметрів, якщо відомі два інших."
  - question: У яких одиницях потрібно вводити значення?
    answer: "U — у вольтах (В), I — у амперах (А), R — в омах (Ом)."
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
