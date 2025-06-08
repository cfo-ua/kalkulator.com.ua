---
layout: calculator
title: "Калькулятор закону збереження енергії"
categories: [school]
seo:
  title: "Калькулятор закону збереження енергії | Шкільні калькулятори"
  description: "Обчисліть потенційну, кінетичну або механічну енергію тіла онлайн."
  keywords:
    - енергія
    - фізика
    - калькулятор
    - школа
    - механіка
  content: |
    <h2>Калькулятор закону збереження енергії</h2>
    <p>Введіть масу тіла, висоту та швидкість — калькулятор обчислить потенційну, кінетичну та повну механічну енергію.</p>
scripts:
  - /assets/js/energy.js
faq:
  - question: Як розрахувати механічну енергію?
    answer: "Повна механічна енергія = потенціальна + кінетична (E = mgh + (mv²)/2)."
---

<form id="energy-form" autocomplete="off">
  <label>
    Маса (кг):
    <input type="number" id="energy-m" min="0" step="any" value="1" required>
  </label>
  <label>
    Висота (м):
    <input type="number" id="energy-h" step="any" value="1" required>
  </label>
  <label>
    Швидкість (м/с):
    <input type="number" id="energy-v" step="any" value="0" required>
  </label>
  <button type="submit">Обчислити</button>
</form>
<div id="energy-result" class="result"></div>
