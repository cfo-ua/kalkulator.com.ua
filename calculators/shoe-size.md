---
layout: calculator
title: "Калькулятор розміру взуття"
categories: [clothing]
seo:
  title: "Калькулятор розміру взуття — конвертер UA, EU, UK, US"
  description: "Переведіть довжину стопи в міліметрах або виберіть ваш розмір у системах EU, UK чи US, щоб дізнатись відповідність у всіх розмірах. Зручно і просто!"
scripts:
  - /assets/js/shoe-size.js
faq:
  - question: "Який розмір взуття мені підходить?"
    answer: "Виміряйте стопу або введіть знайомий вам розмір, і калькулятор підкаже відповідність у інших системах."
  - question: "Що точніше — довжина стопи чи EU/UK/US?"
    answer: "Найточніше — довжина стопи у мм (Mondopoint)."
  - question: "Чи враховується ширина стопи?"
    answer: "Ні, ширина не враховується. При широкій стопі рекомендуємо додавати +0.5 розміру."
---

<form id="shoe-size-form">
  <label for="inputType">Що ви знаєте?</label>
  <select id="inputType">
    <option value="">— Оберіть —</option>
    <option value="mondo">Довжина стопи (мм)</option>
    <option value="EU">Розмір EU</option>
    <option value="UK">Розмір UK</option>
    <option value="USM">Розмір US (чоловічий)</option>
    <option value="USF">Розмір US (жіночий)</option>
  </select>

  <div id="inputField" style="margin-top: 1em;"></div>

  <button type="submit" style="margin-top:1em;">Розрахувати</button>
</form>

<div id="shoe-size-result" class="result" style="margin-top: 1em;"></div>
