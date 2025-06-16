---
layout: calculator
title: "Калькулятор розміру взуття"
categories: [clothing]
seo:
  title: "Калькулятор розміру взуття — конвертер EU, UK, US, Mondopoint"
  description: "Легко дізнайтеся свій розмір взуття: введіть довжину стопи (мм) або обраний розмір EU/UK/US, і калькулятор покаже відповідність у всіх системах."
  keywords:
    - калькулятор розміру взуття
    - розмір взуття EU UK US
    - конвертер розміру взуття
    - mondopoint калькулятор
    - довжина стопи в мм
    - розмір взуття чоловічий жіночий
    - shoe size calculator
    - розмір взуття онлайн
  content: |
    <h2>Калькулятор розміру взуття</h2>
    <p>Виберіть, яке значення ви знаєте (довжина стопи в мм або розмір у міжнародній системі), введіть його — і калькулятор покаже вам розмір у EU, UK та US.</p>
scripts:
  - /assets/js/shoe-size.js
faq:
  - question: "Як правильно виміряти довжину стопи?"
    answer: "Поставте п'яту вплотну до стіни, помітте найвіддаленішу точку стопи на папері і виміряйте в мм — це Mondopoint."
  - question: "Що таке Mondopoint?"
    answer: "Це система визначення розміру взуття за довжиною стопи (у мм) за стандартом ISO‑19407."
  - question: "Чим відрізняються чоловічі і жіночі US розміри?"
    answer: "US‑розміри мають окремі шкали для чоловічих та жіночих — калькулятор враховує обидві."
  - question: "Чи врахована ширина стопи?"
    answer: "Ні — тільки довжина. Якщо стопа широка, рекомендуємо обрати розмір +0.5."
---

<form id="shoe-size-form">
  <label>
    Яке значення ви знаєте?
    <select id="unit">
      <option value="mondopoint">Довжина стопи (мм)</option>
      <option value="eu">Розмір EU</option>
      <option value="uk">Розмір UK</option>
      <option value="us_m">US (чоловіки)</option>
      <option value="us_w">US (жінки)</option>
    </select>
  </label>

  <label>
    Введіть значення:
    <input type="number" id="value" step="any" required>
  </label>

  <button type="submit">Розрахувати</button>
</form>

<div id="shoe-size-result" class="result"></div>
