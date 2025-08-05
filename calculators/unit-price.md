---
layout: calculator
title: "Калькулятор ціни за одиницю"
categories: [financial]
seo:
  title: "Калькулятор ціни за одиницю — порівняння вартості товарів"
  description: "Обчисліть ціну за одиницю товару для розумного шопінгу. Порівнюйте різні упаковки та економте на покупках. Калькулятор для грамів, кілограмів, літрів."
  keywords:
    - ціна за одиницю
    - калькулятор ціни
    - вартість за грам
    - вартість за кілограм
    - вартість за літр
    - порівняння цін
    - економний шопінг
    - розумний шопінг
    - ціна за штуку
    - вигідна покупка
  content: |
    <h2>Калькулятор ціни за одиницю товару</h2>
    <p>Хочете економити на покупках і завжди обирати найвигідніші пропозиції? Наш калькулятор допомагає порівнювати ціни різних товарів та упаковок.</p>

    <h3>Чому важливо знати ціну за одиницю:</h3>
    <ul>
      <li><strong>Економія коштів:</strong> виявляйте найвигідніші пропозиції</li>
      <li><strong>Розумний вибір:</strong> порівнюйте різні бренди та розміри</li>
      <li><strong>Контроль бюджету:</strong> плануйте витрати точніше</li>
      <li><strong>Уникнення маркетингових пасток:</strong> великі упаковки не завжди вигідніші</li>
    </ul>

    <h3>Приклади використання:</h3>
    <p><strong>Продукти:</strong> крупи, макарони, олія, молочні продукти</p>
    <p><strong>Побутова хімія:</strong> порошки, шампуні, засоби для прибирання</p>
    <p><strong>Канцтовари:</strong> папір, ручки, зошити</p>
    <p><strong>Будматеріали:</strong> цвяхи, фарба, плитка</p>

    <h3>Одиниці вимірювання:</h3>
    <p>Калькулятор підтримує різні одиниці: грами, кілограми, літри, штуки, метри та інші.</p>
scripts:
  - /assets/js/unit-price.js
faq:
  - question: Як порівняти ціни товарів у різних упаковках?
    answer: "Введіть ціну та кількість для кожного товару. Калькулятор покаже ціну за одиницю, і ви зможете порівняти."
  - question: Чи завжди великі упаковки вигідніші?
    answer: "Ні, не завжди. Часто виробники встановлюють вищу ціну за одиницю для великих упаковок, розраховуючи на психологію покупця."
  - question: Які товари найчастіше порівнюють за ціною за одиницю?
    answer: "Продукти харчування, побутова хімія, канцтовари, будматеріали — все, що продається в різних об'ємах."
  - question: Як врахувати термін придатності при виборі?
    answer: "Якщо великої упаковки ви не використаєте до закінчення терміну, краще взяти меншу, навіть якщо ціна за одиницю вища."
  - question: Чи можна порівнювати товари різних брендів?
    answer: "Так, але враховуйте якість. Іноді дорожчий бренд виправдовує вищу ціну кращою якістю."
  - question: Як економити за допомогою цього калькулятора?
    answer: "Перед покупкою порахуйте ціну за одиницю для всіх варіантів. Це допоможе заощадити 10-30% на покупках."
---
<div class="calculator-section">
  <h3>🔍 Порівняння цін</h3>
  <p>Введіть дані для до 4 товарів і порівняйте ціни за одиницю:</p>
  
  <form id="unit-price-form" autocomplete="off">
    <div id="products-container">
      <div class="product-row" data-product="1">
        <h4>Товар 1</h4>
        <div class="input-row">
          <label>
            Назва товару:
            <input type="text" class="product-name" placeholder="Наприклад: Гречка" value="Товар 1">
          </label>
        </div>
        <div class="input-row">
          <label>
            Ціна:
            <input type="number" class="product-price" step="0.01" min="0" placeholder="100" required>
            <span class="currency">грн</span>
          </label>
          <label>
            Кількість:
            <input type="number" class="product-quantity" step="0.001" min="0" placeholder="1" required>
          </label>
          <label>
            Одиниця:
            <select class="product-unit">
              <option value="кг">кг</option>
              <option value="г">г</option>
              <option value="л">л</option>
              <option value="мл">мл</option>
              <option value="шт">шт</option>
              <option value="м">м</option>
              <option value="см">см</option>
              <option value="м²">м²</option>
            </select>
          </label>
        </div>
      </div>
      
      <div class="product-row" data-product="2">
        <h4>Товар 2</h4>
        <div class="input-row">
          <label>
            Назва товару:
            <input type="text" class="product-name" placeholder="Наприклад: Гречка" value="Товар 2">
          </label>
        </div>
        <div class="input-row">
          <label>
            Ціна:
            <input type="number" class="product-price" step="0.01" min="0" placeholder="180">
            <span class="currency">грн</span>
          </label>
          <label>
            Кількість:
            <input type="number" class="product-quantity" step="0.001" min="0" placeholder="2">
          </label>
          <label>
            Одиниця:
            <select class="product-unit">
              <option value="кг">кг</option>
              <option value="г">г</option>
              <option value="л">л</option>
              <option value="мл">мл</option>
              <option value="шт">шт</option>
              <option value="м">м</option>
              <option value="см">см</option>
              <option value="м²">м²</option>
            </select>
          </label>
        </div>
      </div>
    </div>
    
    <div class="button-group">
      <button type="button" id="add-product">➕ Додати товар</button>
      <button type="submit">💰 Порівняти ціни</button>
    </div>
  </form>
</div>

<div id="unit-price-result" class="result"></div>