---
layout: calculator
title: "Калькулятор розміру взуття"
categories: [clothing]
seo:
  title: "Калькулятор розміру взуття — EU, UK, US, Mondopoint"
  description: "Конвертер розміру взуття для чоловіків і жінок: EU, UK, US, Mondopoint. Порівняйте міжнародні розміри та знайдіть відповідність для своєї ноги."
  keywords:
    - калькулятор розміру взуття
    - розмір взуття EU UK US
    - конвертер взуття
    - як дізнатися розмір ноги
    - довжина стопи в міліметрах
    - mondopoint розмір
    - таблиця розмірів взуття
    - розмір взуття чоловічий жіночий
  content: |
    <h2>Калькулятор розміру взуття</h2>
    <p>Цей онлайн калькулятор допоможе вам конвертувати розмір взуття між системами: <strong>EU</strong>, <strong>UK</strong>, <strong>US (чоловічий/жіночий)</strong> та <strong>Mondopoint</strong> (довжина стопи в мм).</p>   
scripts:
  - /assets/js/shoe-size.js
faq:
  - question: "Як користуватись калькулятором розміру взуття?"
    answer: "Оберіть, яку одиницю ви знаєте (наприклад, EU розмір або довжину стопи в мм), введіть значення — і калькулятор автоматично покаже відповідні значення в інших системах."
  - question: "Що таке Mondopoint?"
    answer: "Mondopoint — це міжнародна система вимірювання розміру взуття, що базується на довжині стопи в міліметрах. Наприклад, довжина стопи 270 мм відповідає EU розміру близько 41."
  - question: "Чи підходить цей калькулятор для дитячого взуття?"
    answer: "Наразі калькулятор орієнтований на доросле взуття. Підтримка дитячих розмірів може бути додана пізніше."
---
 <form id="shoe-size-form">
      <label for="unit">Що ви знаєте?</label>
      <select id="unit" required>
        <option value="eu">Розмір EU</option>
        <option value="mondopoint">Довжина стопи (мм)</option>
        <option value="uk">Розмір UK</option>
        <option value="us_m">Розмір US (чоловічий)</option>
        <option value="us_w">Розмір US (жіночий)</option>
      </select>
      <label for="value">Введіть значення</label>
      <input type="number" id="value" step="any" required>
      <button type="submit">Розрахувати</button>
    </form>
    <div id="shoe-size-result" class="result"></div>
