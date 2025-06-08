---
layout: calculator
title: "Калькулятор вартості ремонту"
categories: [construction]
seo:
  title: "Калькулятор вартості ремонту | Будівельні калькулятори"
  description: "Приблизно розрахуйте повну вартість ремонту квартири або кімнати онлайн."
  keywords:
    - ремонт
    - вартість ремонту
    - будівництво
    - калькулятор
  content: |
    <h2>Калькулятор вартості ремонту</h2>
    <p>Введіть площу та середню ціну ремонту за м² — калькулятор розрахує загальну вартість робіт.</p>
scripts:
  - /assets/js/renovation-cost.js
faq:
  - question: Які витрати враховує калькулятор?
    answer: "Вартість робіт + матеріалів (середня ціна за м²)."
---

<form id="renovation-cost-form" autocomplete="off">
  <label>
    Площа приміщення (м²):
    <input type="number" id="renovation-area" min="0" step="any" required>
  </label>
  <label>
    Середня ціна ремонту за 1 м²:
    <input type="number" id="renovation-price" min="0" step="any" required>
  </label>
  <button type="submit">Розрахувати</button>
</form>
<div id="renovation-cost-result" class="result"></div>
