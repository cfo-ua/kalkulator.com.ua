---
layout: calculator
title: "Калькулятор відсотків"
categories: [school]
seo:
  title: "Калькулятор відсотків | Шкільні калькулятори"
  description: "Обчисліть, скільки становить відсоток від числа, або скільки відсотків одне число становить від іншого. Онлайн калькулятор для школи і життя."
  keywords:
    - відсотки
    - знайти відсоток
    - частка від числа
    - математика
    - онлайн калькулятор
    - скільки % від числа
    - скільки % одне число від іншого
    - формула відсотків
    - шкільні обчислення
  content: |
    <h2>Калькулятор відсотків</h2>
    <p>Знайдіть:</p>
    <ol>
      <li><strong>X% від числа Y</strong> (формула: <code>Y × X / 100</code>)</li>
      <li><strong>Скільки % число A становить від числа B</strong> (формула: <code>A / B × 100</code>)</li>
    </ol>
scripts:
  - /assets/js/percent.js
faq:
  - question: Як знайти X% від числа Y?
    answer: "Формула: (X × Y) / 100. Наприклад: 20% від 50 = (20 × 50) / 100 = 10."
  - question: Як дізнатись, скільки % одне число становить від іншого?
    answer: "Формула: (A / B) × 100. Наприклад: 15 від 60 — це (15 / 60) × 100 = 25%."
  - question: Де використовуються відсотки?
    answer: "У математиці, фінансах, статистиці, знижках, податках, банківських розрахунках."
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
