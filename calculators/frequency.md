---
layout: calculator
title: "Калькулятор періоду та частоти коливання"
categories: [school]
seo:
  title: "Калькулятор періоду та частоти | Шкільні калькулятори"
  description: "Обчисліть період або частоту коливань для фізики чи електроніки (формула T = 1/f)."
  keywords:
    - частота
    - період
    - фізика
    - інженерія
    - школа
  content: |
    <h2>Калькулятор періоду та частоти коливання</h2>
    <p>Введіть період (T, с) або частоту (f, Гц) — калькулятор знайде інше значення.</p>
scripts:
  - /assets/js/frequency.js
faq:
  - question: Як повʼязані період і частота?
    answer: "T = 1/f, f = 1/T."
---

<form id="frequency-form" autocomplete="off">
  <label>
    Період (T, с):
    <input type="number" id="freq-t" min="0" step="any">
  </label>
  <label>
    Частота (f, Гц):
    <input type="number" id="freq-f" min="0" step="any">
  </label>
  <button type="submit">Обчислити</button>
</form>
<div id="frequency-result" class="result"></div>
