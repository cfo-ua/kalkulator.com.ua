---
layout: calculator
title: "Калькулятор цегли"
categories: [construction]
seo:
  title: "Калькулятор цегли | Будівельні калькулятори"
  description: "Розрахуйте кількість цегли для зведення стіни або перегородки."
  keywords:
    - цегла
    - кладка
    - стіна
    - будівництво
    - калькулятор
  content: |
    <h2>Калькулятор цегли</h2>
    <p>Введіть площу стіни, розміри цегли та товщину шва — калькулятор визначить кількість цегли.</p>
scripts:
  - /assets/js/bricks.js
faq:
  - question: Які розміри стандартної цегли?
    answer: "Одинарна (250×120×65 мм), потовщена (250×120×88 мм), подвійна (250×120×140 мм)."
---

<form id="bricks-form" autocomplete="off">
  <label>
    Площа стіни (м²):
    <input type="number" id="bricks-area" min="0" step="any" required>
  </label>
  <label>
    Довжина цегли (мм):
    <input type="number" id="bricks-length" min="1" step="any" placeholder="250" required>
  </label>
  <label>
    Висота цегли (мм):
    <input type="number" id="bricks-height" min="1" step="any" placeholder="65" required>
  </label>
  <label>
    Товщина шва (мм):
    <input type="number" id="bricks-joint" min="0" step="any" value="10" required>
  </label>
  <button type="submit">Розрахувати</button>
</form>
<div id="bricks-result" class="result"></div>
