---
layout: calculator
title: "Калькулятор ламінату"
categories: [construction]
seo:
  title: "Калькулятор ламінату | Будівельні калькулятори"
  description: "Розрахуйте кількість упаковок ламінату для укладання підлоги."
  keywords:
    - ламінат
    - підлога
    - ремонт
    - будівництво
    - калькулятор
  content: |
    <h2>Калькулятор ламінату</h2>
    <p>Введіть площу кімнати, площу однієї упаковки ламінату та запас — калькулятор визначить кількість упаковок.</p>
scripts:
  - /assets/js/laminate.js
faq:
  - question: Який запас ламінату слід брати?
    answer: "Рекомендується брати 5-10% запасу."
---

<form id="laminate-form" autocomplete="off">
  <label>
    Площа кімнати (м²):
    <input type="number" id="laminate-area" min="0" step="any" required>
  </label>
  <label>
    Площа однієї упаковки (м²):
    <input type="number" id="laminate-pack" min="0" step="any" required>
  </label>
  <label>
    Запас (%):
    <input type="number" id="laminate-waste" min="0" step="any" value="7">
  </label>
  <button type="submit">Розрахувати</button>
</form>
<div id="laminate-result" class="result"></div>
