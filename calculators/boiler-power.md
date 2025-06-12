---
layout: calculator
title: "Калькулятор потужності котла"
categories: [construction]
seo:
  title: "Калькулятор потужності котла | Будівельні калькулятори"
  description: "Розрахуйте необхідну потужність газового або електричного котла для ефективного обігріву вашого будинку чи квартири в Україні."
  keywords:
    - котел
    - обігрів
    - газовий котел
    - електричний котел
    - потужність
    - калькулятор
    - розрахунок котла
    - тепловтрати
  content: |
    <h2>Калькулятор потужності котла</h2>
    <p>Введіть площу приміщення, висоту стелі, ступінь утеплення та регіон — калькулятор визначить необхідну потужність котла.</p>
scripts:
  - /assets/js/boiler-power.js
faq:
  - question: Яка формула для розрахунку потужності котла?
    answer: "Стандартно: 1 кВт на 10 м² для хорошої теплоізоляції. Коригується залежно від висоти стелі та регіону."
  - question: Який котел обрати — газовий чи електричний?
    answer: "Газовий котел дешевший в експлуатації, але потребує підключення до газу. Електричний — простіший у встановленні, але витрати вищі."
  - question: Як утеплення впливає на розрахунок потужності котла?
    answer: "Гірше утеплене приміщення потребує більш потужного котла. Калькулятор враховує це автоматично."
---

<form id="boiler-power-form" autocomplete="off">
  <label>
    Площа приміщення (м²):
    <input type="number" id="boiler-area" min="0" step="any" required>
  </label>
  <label>
    Висота стелі (м):
    <input type="number" id="boiler-height" min="2" step="any" value="2.7" required>
  </label>
  <label>
    Ступінь утеплення:
    <select id="boiler-insulation">
      <option value="1">Добре утеплене (сучасне)</option>
      <option value="1.2">Середнє</option>
      <option value="1.5">Погане (старий будинок)</option>
    </select>
  </label>
  <label>
    Регіон:
    <select id="boiler-region">
      <option value="1">Південь (тепліше)</option>
      <option value="1.1">Центр</option>
      <option value="1.2">Північ/Схід (холодніше)</option>
    </select>
  </label>
  <button type="submit">Розрахувати</button>
</form>
<div id="boiler-power-result" class="result"></div>
