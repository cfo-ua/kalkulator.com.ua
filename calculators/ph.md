---
layout: calculator
title: "Калькулятор pH розчину"
categories: [school]
seo:
  title: "Калькулятор pH розчину | Шкільні калькулятори"
  description: "Розрахуйте pH розчину за концентрацією іонів H⁺ або OH⁻. Зручно для хімії."
  keywords:
    - pH
    - хімія
    - калькулятор
    - школа
  content: |
    <h2>Калькулятор pH розчину</h2>
    <p>Введіть концентрацію іонів H⁺ або OH⁻ (у моль/л) — калькулятор обчислить pH або pOH та визначить, чи розчин кислий, нейтральний чи лужний.</p>
scripts:
  - /assets/js/ph.js
faq:
  - question: Як розрахувати pH?
    answer: "pH = -log₁₀[H⁺], pOH = -log₁₀[OH⁻], pH + pOH = 14."
---

<form id="ph-form" autocomplete="off">
  <fieldset>
    <legend>Концентрація (моль/л):</legend>
    <label>
      [H⁺]:
      <input type="number" id="ph-h" step="any" min="0">
    </label>
    <label>
      [OH⁻]:
      <input type="number" id="ph-oh" step="any" min="0">
    </label>
  </fieldset>
  <button type="submit">Розрахувати</button>
</form>
<div id="ph-result" class="result"></div>
