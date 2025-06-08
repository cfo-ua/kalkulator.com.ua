---
layout: calculator
title: "Калькулятор шпалер"
categories: [construction]
seo:
  title: "Калькулятор шпалер | Будівельні калькулятори"
  description: "Розрахуйте скільки рулонів шпалер потрібно для обклеювання кімнати."
  keywords:
    - шпалери
    - ремонт
    - кімната
    - будівництво
    - калькулятор
  content: |
    <h2>Калькулятор шпалер</h2>
    <p>Вкажіть периметр кімнати, висоту стін, розмір рулону — калькулятор знайде кількість рулонів.</p>
scripts:
  - /assets/js/wallpaper.js
faq:
  - question: Як визначити потрібну кількість рулонів шпалер?
    answer: "Площа стін / площу одного рулону = кількість рулонів."
---

<form id="wallpaper-form" autocomplete="off">
  <label>
    Периметр кімнати (м):
    <input type="number" id="wallpaper-perimeter" min="0" step="any" required>
  </label>
  <label>
    Висота стін (м):
    <input type="number" id="wallpaper-height" min="0" step="any" required>
  </label>
  <label>
    Довжина рулону (м):
    <input type="number" id="wallpaper-roll-length" min="0" step="any" required>
  </label>
  <label>
    Ширина рулону (м):
    <input type="number" id="wallpaper-roll-width" min="0" step="any" required>
  </label>
  <button type="submit">Розрахувати</button>
</form>
<div id="wallpaper-result" class="result"></div>
