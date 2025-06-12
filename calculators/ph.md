---
layout: calculator
title: "Калькулятор pH розчину"
categories: [school]
seo:
  title: "Калькулятор pH розчину | Шкільні калькулятори"
  description: "Онлайн калькулятор для розрахунку pH або pOH розчину на основі концентрації іонів H⁺ або OH⁻. Швидко, зручно, точно. Підходить для хімії у школі чи університеті."
  keywords:
    - pH
    - pOH
    - іон H⁺
    - іон OH⁻
    - хімія
    - pH шкала
    - кислотність
    - лужність
    - кислота
    - луг
    - калькулятор
    - школа
  content: |
    <h2>Калькулятор pH розчину</h2>
    <p>Введіть концентрацію іонів H⁺ або OH⁻ (у моль/л), щоб обчислити pH, pOH та визначити характер середовища: кислий, нейтральний чи лужний.</p>
scripts:
  - /assets/js/ph.js
faq:
  - question: Як розрахувати pH?
    answer: "pH = -log₁₀[H⁺], де [H⁺] — концентрація іонів водню в моль/л."
  - question: Як обчислити pOH?
    answer: "pOH = -log₁₀[OH⁻], де [OH⁻] — концентрація гідроксид-іонів."
  - question: Що таке pH-шкала?
    answer: "Шкала pH — це числова шкала від 0 до 14, що показує кислотність або лужність розчину. 7 — нейтральне середовище, менше 7 — кисле, більше 7 — лужне."
  - question: Як дізнатися характер розчину?
    answer: "Якщо pH &lt; 7 — розчин кислий, якщо pH = 7 — нейтральний, якщо pH &gt; 7 — лужний."
  - question: Можна приклад?
    answer: "Так! Якщо [H⁺] = 0.001 моль/л, то pH = -log₁₀(0.001) = 3 — розчин кислий."
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
