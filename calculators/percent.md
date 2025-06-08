---
layout: calculator
title: "Калькулятор відсотків"
categories: [school]
seo:
  title: "Калькулятор відсотків | Шкільні калькулятори"
  description: "Обчисліть відсоток від числа, а також скільки відсотків одне число становить від іншого."
  keywords:
    - відсотки
    - математика
    - калькулятор
    - школа
  content: |
    <h2>Калькулятор відсотків</h2>
    <p>Знайдіть: 1) скільки становить X% від Y; 2) скільки % одне число становить від іншого.</p>
scripts:
  - /assets/js/percent.js
faq:
  - question: Як знайти X% від числа Y?
    answer: "Помножте Y на X та поділіть на 100."
  - question: Як знайти, скільки % одне число становить від іншого?
    answer: "Поділіть перше число на друге та помножте на 100."
---

<form id="percent-form" autocomplete="off">
  <fieldset>
    <legend>1. Знайти X% від Y</legend>
    <label>
      X (%):
      <input type="number" id="percent-x" value="20" step="any" required>
    </label>
    <label>
      Y:
      <input type="number" id="percent-y" value="50" step="any" required>
    </label>
    <button type="button" id="calc-percent-xy">Розрахувати</button>
    <div id="percent-xy-result"></div>
  </fieldset>
  <fieldset>
    <legend>2. Скільки % A від B</legend>
    <label>
      A:
      <input type="number" id="percent-a" value="15" step="any" required>
    </label>
    <label>
      B:
      <input type="number" id="percent-b" value="60" step="any" required>
    </label>
    <button type="button" id="calc-percent-ab">Розрахувати</button>
    <div id="percent-ab-result"></div>
  </fieldset>
</form>
