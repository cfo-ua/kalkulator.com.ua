---
layout: calculator
title: "Калькулятор площі стін"
categories: [construction]
seo:
  title: "Калькулятор площі стін | Будівельні калькулятори"
  description: "Швидко порахуйте площу стін кімнати для ремонту, шпалер чи плитки."
  keywords:
    - площа стін
    - ремонт
    - шпалери
    - плитка
    - будівництво
    - калькулятор
  content: |
    <h2>Калькулятор площі стін</h2>
    <p>Введіть довжину, ширину та висоту кімнати, щоб отримати площу стін для розрахунку матеріалів. За бажанням можна відняти площу дверей і вікон.</p>
scripts:
  - /assets/js/wall-area.js
faq:
  - question: Як знайти площу стін кімнати?
    answer: "Для прямокутної кімнати: площа стін = 2 × (довжина + ширина) × висота. Можна відняти площу дверей/вікон для точності."
---

<form id="wall-area-form" autocomplete="off">
  <label>
    Довжина кімнати (м):
    <input type="number" id="wall-length" min="0" step="any" required>
  </label>
  <label>
    Ширина кімнати (м):
    <input type="number" id="wall-width" min="0" step="any" required>
  </label>
  <label>
    Висота стін (м):
    <input type="number" id="wall-height" min="0" step="any" required>
  </label>
  <label>
    Загальна площа дверей/вікон (м², опціонально):
    <input type="number" id="wall-doors" min="0" step="any" value="0">
  </label>
  <button type="submit">Обчислити</button>
</form>
<div id="wall-area-result" class="result"></div>
