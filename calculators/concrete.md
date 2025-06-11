---
layout: calculator
title: "Калькулятор бетону"
categories: [construction]
seo:
  title: "Калькулятор бетону | Будівельні калькулятори"
  description: "Розрахуйте об’єм бетону для фундаменту, стяжки чи заливки підлоги."
  keywords:
    - бетон
    - фундамент
    - ремонт
    - стяжка
    - будівництво
    - калькулятор
  content: |
    <h2>Калькулятор бетону</h2>
    <p>Введіть довжину, ширину та висоту конструкції — калькулятор миттєво обчислить об’єм бетону в кубічних метрах. Ідеально підходить для заливки підлоги, фундаменту, плит або доріжок.</p>
scripts:
  - /assets/js/concrete.js
faq:
  - question: Як визначити об’єм бетону?
    answer: "Для прямокутної форми: об’єм = довжина × ширина × висота. Результат у м³ (кубічних метрах)."
  - question: Чи потрібно робити запас?
    answer: "Так, зазвичай додають 5–10% до розрахованого об’єму на втрати при транспортуванні або нерівності форми."
  - question: Для яких типів конструкцій підходить цей калькулятор?
    answer: "Для фундаментів, підлог, доріжок, стяжок — усіх прямокутних форм."
---

<form id="concrete-form" autocomplete="off">
  <label>
    Довжина (м):
    <input type="number" id="concrete-length" min="0" step="any" required>
  </label>
  <label>
    Ширина (м):
    <input type="number" id="concrete-width" min="0" step="any" required>
  </label>
  <label>
    Висота (м):
    <input type="number" id="concrete-height" min="0" step="any" required>
  </label>
  <button type="submit">Обчислити</button>
</form>
<div id="concrete-result" class="result"></div>
