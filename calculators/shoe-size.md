---
layout: calculator
title: "Калькулятор розміру взуття"
categories: [clothing]
seo:
  title: "Калькулятор розміру взуття — конвертер UA, EU, UK, US"
  description: "Онлайн калькулятор розміру взуття допоможе перевести довжину стопи (мм or см) у розміри UA/EU/UK/US. Виміряйте стопу та знайдіть правильний розмір."
  keywords:
    - калькулятор розміру взуття
    - розмір взуття UA EU UK US
    - Mondopoint калькулятор
    - довжина стопи в мм
    - конвертер розміру взуття
    - як обрати розмір взуття
    - shoe size converter
    - mondopoint розмір взуття
  content: |
    <h2>Калькулятор розміру взуття</h2>
    <p>Введіть довжину стопи в міліметрах або одному з розмірів (UA/EU/UK/US), щоб дізнатись відповідність у інших системах.</p>
    <ul>
      <li>Конвертація за ISO‑19407 (Mondopoint)</li>
      <li>Ширина стопи враховується опційно — рекомендуємо +0.5 розмір</li>
      <li>Підходить для чоловіків, жінок і дітей</li>
    </ul>
scripts:
  - /assets/js/shoe-size.js
faq:
  - question: "Як виміряти довжину стопи?"
    answer: "Встаньте п’ятою до стіни на папір, позначте найвіддаленішу точку пальців, виміряйте відстань до підлоги в мм — це Mondopoint."
  - question: "Що таке Mondopoint?"
    answer: "Mondopoint — це довжина стопи у міліметрах і стандарт для міжнародного визначення розміру згідно ISO‑19407."  
  - question: "Як переводити UA в EU або US?"
    answer: "Калькулятор автоматично конвертує ваш розмір за таблицею відповідності між системами."
  - question: "Чоловічі, жіночі і дитячі розміри однакові?"
    answer: "EU розміри унісекс, а US/UK мають окремі шкали для чоловічих і жіночих."
  - question: "Чи врахована ширина стопи?"
    answer: "Ні, калькулятор не враховує ширину стопи — лише довжину. При широкій стопі радимо брати +0.5 розмір."
---

<form id="shoe-size-form">
  <label for="mondo">Довжина стопи (мм)</label>
  <input type="number" id="mondo" min="100">

  <label for="sizeEU">Розмір EU</label>
  <input type="number" id="sizeEU" step="0.5">

  <label for="sizeUK">Розмір UK (чол/жіно)</label>
  <input type="number" id="sizeUK" step="0.5">

  <label for="sizeUS_M">Розмір US (чоловічий)</label>
  <input type="number" id="sizeUS_M" step="0.5">

  <label for="sizeUS_F">Розмір US (жіночий)</label>
  <input type="number" id="sizeUS_F" step="0.5">

  <button type="submit">Розрахувати</button>
</form>

<div id="shoe-size-result" class="result" style="margin-top: 1em; font-weight: bold;"></div>
