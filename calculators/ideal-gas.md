---
layout: calculator
title: "Калькулятор ідеального газу (PV=nRT)"
categories: [school]
seo:
  title: "Калькулятор ідеального газу | Шкільні калькулятори"
  description: "Обчисліть тиск, обʼєм, кількість речовини або температуру за формулою PV=nRT."
  keywords:
    - ідеальний газ
    - PV=nRT
    - хімія
    - фізика
    - калькулятор
    - школа
  content: |
    <h2>Калькулятор ідеального газу (PV=nRT)</h2>
    <p>Введіть будь-які три параметри (P, V, n, T) — калькулятор знайде четвертий (R = 0.0821 л·атм/(моль·К)).</p>
scripts:
  - /assets/js/ideal-gas.js
faq:
  - question: Яка універсальна газова стала?
    answer: "R = 0.0821 л·атм/(моль·К)"
  - question: Які одиниці потрібно використовувати?
    answer: "P — атмосфери, V — літри, n — моль, T — Кельвіни."
---

<form id="ideal-gas-form" autocomplete="off">
  <label>
    Тиск (P, атм):
    <input type="number" id="ig-p" step="any">
  </label>
  <label>
    Обʼєм (V, л):
    <input type="number" id="ig-v" step="any">
  </label>
  <label>
    Кількість речовини (n, моль):
    <input type="number" id="ig-n" step="any">
  </label>
  <label>
    Температура (T, K):
    <input type="number" id="ig-t" step="any">
  </label>
  <button type="submit">Обчислити</button>
</form>
<div id="ideal-gas-result" class="result"></div>
