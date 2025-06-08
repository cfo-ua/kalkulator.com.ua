---
layout: calculator
title: "Калькулятор середнього арифметичного"
categories: [school]
seo:
  title: "Калькулятор середнього арифметичного | Шкільні калькулятори"
  description: "Обчисліть середнє арифметичне для будь-якого набору чисел онлайн."
  keywords:
    - середнє арифметичне
    - математика
    - калькулятор
    - школа
    - mean calculator
  content: |
    <h2>Калькулятор середнього арифметичного</h2>
    <p>Введіть числа через кому та дізнайтеся їх середнє арифметичне.</p>
scripts:
  - /assets/js/mean.js
faq:
  - question: Як обчислити середнє арифметичне?
    answer: "Складіть всі числа та поділіть на їх кількість."
---

<form id="mean-form" autocomplete="off">
  <label>
    Числа (через кому):
    <input type="text" id="mean-input" placeholder="Приклад: 3, 5, 7" required>
  </label>
  <button type="submit">Обчислити</button>
</form>
<div id="mean-result" class="result"></div>
