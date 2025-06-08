---
layout: calculator
title: "Калькулятор потужності кондиціонера"
categories: [construction]
seo:
  title: "Калькулятор потужності кондиціонера | Будівельні калькулятори"
  description: "Який кондиціонер вибрати? Розрахуйте потрібну потужність за площею кімнати."
  keywords:
    - кондиціонер
    - потужність
    - площа кімнати
    - будівництво
    - калькулятор
  content: |
    <h2>Калькулятор потужності кондиціонера</h2>
    <p>Введіть площу кімнати, кількість людей і вікон — калькулятор підбере потрібну потужність кондиціонера (кВт).</p>
scripts:
  - /assets/js/ac-power.js
faq:
  - question: Як розрахувати потужність кондиціонера?
    answer: "Базова формула: 0,1 кВт на 1 м² площі + додатково для людей/техніки."
---

<form id="ac-power-form" autocomplete="off">
  <label>
    Площа кімнати (м²):
    <input type="number" id="ac-area" min="0" step="any" required>
  </label>
  <label>
    Кількість людей (окрім постійного мешканця):
    <input type="number" id="ac-people" min="0" step="1" value="0" required>
  </label>
  <label>
    Кількість вікон:
    <input type="number" id="ac-windows" min="0" step="1" value="1" required>
  </label>
  <button type="submit">Розрахувати</button>
</form>
<div id="ac-power-result" class="result"></div>
