---
layout: calculator
title: "Калькулятор розведення розчину"
categories: [school]
seo:
  title: "Калькулятор розведення розчину | Шкільні калькулятори"
  description: "Розрахуйте обʼєм або концентрацію при розведенні розчину (формула C₁V₁ = C₂V₂)."
  keywords:
    - розведення
    - хімія
    - біологія
    - калькулятор
    - школа
  content: |
    <h2>Калькулятор розведення розчину</h2>
    <p>Введіть будь-які три параметри з чотирьох (C₁, V₁, C₂, V₂) — калькулятор знайде четвертий.</p>
scripts:
  - /assets/js/dilution.js
faq:
  - question: Яка формула розведення?
    answer: "C₁V₁ = C₂V₂ — концентрація × обʼєм до і після розведення."
---

<form id="dilution-form" autocomplete="off">
  <label>
    Початкова концентрація (C₁, моль/л):
    <input type="number" id="dil-c1" step="any">
  </label>
  <label>
    Початковий обʼєм (V₁, л):
    <input type="number" id="dil-v1" step="any">
  </label>
  <label>
    Кінцева концентрація (C₂, моль/л):
    <input type="number" id="dil-c2" step="any">
  </label>
  <label>
    Кінцевий обʼєм (V₂, л):
    <input type="number" id="dil-v2" step="any">
  </label>
  <button type="submit">Обчислити</button>
</form>
<div id="dilution-result" class="result"></div>
