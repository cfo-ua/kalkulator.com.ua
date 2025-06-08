---
layout: calculator
title: "Калькулятор площі та обʼєму кулі"
categories: [school]
seo:
  title: "Калькулятор площі та обʼєму кулі | Шкільні калькулятори"
  description: "Обчисліть площу поверхні та обʼєм кулі за радіусом онлайн."
  keywords:
    - площа кулі
    - обʼєм кулі
    - геометрія
    - калькулятор
    - школа
  content: |
    <h2>Калькулятор площі та обʼєму кулі</h2>
    <p>Введіть радіус кулі, щоб знайти площу поверхні та обʼєм.</p>
scripts:
  - /assets/js/sphere.js
faq:
  - question: Як знайти площу кулі?
    answer: "Площа кулі: S = 4πR²"
  - question: Як знайти обʼєм кулі?
    answer: "Обʼєм кулі: V = (4/3)πR³"
---

<form id="sphere-form" autocomplete="off">
  <label>
    Радіус (R):
    <input type="number" id="sphere-r" min="0" step="any" value="1" required>
  </label>
  <button type="submit">Обчислити</button>
</form>
<div id="sphere-result" class="result"></div>
