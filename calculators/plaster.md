---
layout: calculator
title: "Калькулятор штукатурки"
categories: [construction]
seo:
  title: "Калькулятор штукатурки | Будівельні калькулятори"
  description: "Розрахуйте кількість штукатурки для оздоблення стін."
  keywords:
    - штукатурка
    - ремонт
    - оздоблення
    - будівництво
    - калькулятор
  content: |
    <h2>Калькулятор штукатурки</h2>
    <p>Введіть площу стін та середню товщину шару — калькулятор визначить об'єм штукатурки.</p>
scripts:
  - /assets/js/plaster.js
faq:
  - question: Як визначити скільки треба штукатурки?
    answer: "Об'єм штукатурки = площа стін × товщина шару."
---

<form id="plaster-form" autocomplete="off">
  <label>
    Площа стін (м²):
    <input type="number" id="plaster-area" min="0" step="any" required>
  </label>
  <label>
    Товщина шару (мм):
    <input type="number" id="plaster-thickness" min="1" step="any" required>
  </label>
  <button type="submit">Розрахувати</button>
</form>
<div id="plaster-result" class="result"></div>
