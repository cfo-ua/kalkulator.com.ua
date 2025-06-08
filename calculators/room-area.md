---
layout: calculator
title: "Калькулятор площі кімнати"
categories: [construction]
seo:
  title: "Калькулятор площі кімнати | Будівельні калькулятори"
  description: "Розрахуйте площу кімнати для ремонту чи укладання підлоги. Прямокутна форма."
  keywords:
    - площа кімнати
    - ремонт
    - підлога
    - будівництво
    - калькулятор
  content: |
    <h2>Калькулятор площі кімнати</h2>
    <p>Введіть довжину та ширину кімнати, щоб швидко дізнатися площу для підлоги чи ремонту.</p>
scripts:
  - /assets/js/room-area.js
faq:
  - question: Як обчислити площу кімнати?
    answer: "Для прямокутної кімнати: площа = довжина × ширина."
---

<form id="room-area-form" autocomplete="off">
  <label>
    Довжина (м):
    <input type="number" id="room-length" min="0" step="any" required>
  </label>
  <label>
    Ширина (м):
    <input type="number" id="room-width" min="0" step="any" required>
  </label>
  <button type="submit">Обчислити</button>
</form>
<div id="room-area-result" class="result"></div>
