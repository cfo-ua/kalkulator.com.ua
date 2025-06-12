---
layout: calculator
title: "Калькулятор маржі та націнки"
categories: [business]
seo:
  title: "Калькулятор маржі та націнки | Бізнес калькулятори"
  description: "Розрахуйте маржу, націнку, прибуток, собівартість або ціну продажу, ввівши будь-які два параметри."
  keywords:
    - бізнес
    - маржа
    - націнка
    - калькулятор
    - ціна
    - собівартість
    - прибуток
  content: |
    <h2>Калькулятор маржі та націнки</h2>
    <p>Введіть будь-які <strong>2 з 4</strong> параметрів (собівартість, ціна продажу, маржа, націнка) — калькулятор обчислить решту автоматично.</p>
scripts:
  - /assets/js/markup-margin.js
faq:
  - question: Що таке маржа?
    answer: "Маржа — це відсоток прибутку від ціни продажу. Формула: (Ціна - Собівартість) / Ціна × 100%."
  - question: Що таке націнка?
    answer: "Націнка — це відсоток прибутку від собівартості. Формула: (Ціна - Собівартість) / Собівартість × 100%."
  - question: У чому різниця між маржею та націнкою?
    answer: "Маржа рахується від ціни, а націнка — від собівартості. Наприклад, маржа 20% відповідає націнці 25%."
---

<form id="markup-margin-form" autocomplete="off">
  <label>
    Собівартість (Cost):
    <input type="number" id="cost" step="any" min="0">
  </label>
  <label>
    Ціна продажу (Price):
    <input type="number" id="price" step="any" min="0">
  </label>
  <label>
    Маржа (%):
    <input type="number" id="margin" step="any" min="0" max="100">
  </label>
  <label>
    Націнка (%):
    <input type="number" id="markup" step="any" min="0">
  </label>
  <button type="submit">Розрахувати</button>
</form>

<div id="markup-margin-result" class="result"></div>
