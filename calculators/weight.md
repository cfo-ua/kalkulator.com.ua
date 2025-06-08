---
layout: calculator
title: "Калькулятор сили тяжіння"
categories: [school]
seo:
  title: "Калькулятор сили тяжіння | Шкільні калькулятори"
  description: "Обчисліть силу тяжіння тіла на Землі (F = m × g) для задач з фізики."
  keywords:
    - сила тяжіння
    - фізика
    - калькулятор
    - школа
    - вага
  content: |
    <h2>Калькулятор сили тяжіння</h2>
    <p>Введіть масу тіла (у кг) — калькулятор обчислить силу тяжіння (F = m × g, g ≈ 9.81 м/с²).</p>
scripts:
  - /assets/js/weight.js
faq:
  - question: Що таке сила тяжіння?
    answer: "Сила тяжіння — це сила, з якою Земля притягує тіло до себе. F = m × g."
---

<form id="weight-form" autocomplete="off">
  <label>
    Маса (кг):
    <input type="number" id="weight-m" min="0" step="any" value="1" required>
  </label>
  <button type="submit">Обчислити</button>
</form>
<div id="weight-result" class="result"></div>
