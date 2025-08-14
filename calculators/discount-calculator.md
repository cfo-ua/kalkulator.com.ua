---
layout: calculator
title: "Калькулятор знижок"
categories: [financial]
seo:
  title: "Калькулятор знижок онлайн - розрахунок ціни зі знижкою | kalkulator.com.ua"
  description: "Онлайн калькулятор знижок для швидкого розрахунку ціни зі знижкою, розміру знижки у відсотках та гривнях. Корисний для покупок, розпродажів та бізнесу."
  keywords:
    - калькулятор знижок
    - розрахунок знижки
    - ціна зі знижкою
    - відсоток знижки
    - розпродаж
    - економія коштів
    - покупки онлайн
    - фінансовий калькулятор
    - знижка у гривнях
    - комерційні розрахунки
  content: |
    <h2>💰 Калькулятор знижок онлайн</h2>
    <p>Універсальний інструмент для розрахунку знижок у покупках, бізнесі та повсякденному житті. Швидко визначайте фінальну ціну товару, розмір економії та відсоток знижки за кілька секунд.</p>
    
    <h3>🎯 Можливості калькулятора:</h3>
    <ul>
      <li>✅ Розрахунок ціни зі знижкою за відсотком</li>
      <li>✅ Визначення розміру знижки у гривнях</li>
      <li>✅ Обчислення відсотка знижки між двома цінами</li>
      <li>✅ Розрахунок кількох послідовних знижок</li>
      <li>✅ Порівняння економії між різними пропозиціями</li>
      <li>✅ Візуалізація результатів з графіками</li>
    </ul>

    <h3>🛍️ Коли використовувати:</h3>
    <ul>
      <li><strong>Покупки:</strong> Розрахунок економії під час розпродажів</li>
      <li><strong>Бізнес:</strong> Планування цінової політики та акцій</li>
      <li><strong>Порівняння:</strong> Вибір найвигіднішої пропозиції</li>
      <li><strong>Бюджетування:</strong> Планування витрат з урахуванням знижок</li>
    </ul>

    <h3>📊 Формули розрахунку:</h3>
    <ul>
      <li><strong>Ціна зі знижкою:</strong> Початкова ціна × (1 - Знижка%/100)</li>
      <li><strong>Розмір економії:</strong> Початкова ціна × (Знижка%/100)</li>
      <li><strong>Відсоток знижки:</strong> (Початкова ціна - Фінальна ціна) / Початкова ціна × 100%</li>
    </ul>
scripts:
  - /assets/js/discount-calculator.js
faq:
  - question: Як розрахувати ціну зі знижкою 30%?
    answer: "Помножте початкову ціну на 0,7 (або 70%). Наприклад: товар за 1000 грн зі знижкою 30% коштуватиме 1000 × 0,7 = 700 грн."
  - question: Як дізнатися відсоток знижки?
    answer: "Віднімьте фінальну ціну від початкової, поділіть на початкову ціну та помножте на 100%. Формула: (початкова - фінальна) / початкова × 100%"
  - question: Що таке послідовні знижки?
    answer: "Це кілька знижок, які застосовуються одна за одною. Наприклад, спочатку знижка 20%, потім ще 10% від вже зниженої ціни."
  - question: Як порівняти різні знижки?
    answer: "Розрахуйте фінальну ціну для кожної пропозиції та порівняйте результати. Найнижча фінальна ціна - найвигідніша пропозиція."
---

<div class="calculator-container">
  <div class="calc-tabs">
    <button type="button" class="tab-button active" data-tab="basic">Базові розрахунки</button>
    <button type="button" class="tab-button" data-tab="multiple">Кілька знижок</button>
    <button type="button" class="tab-button" data-tab="compare">Порівняння</button>
  </div>

  <!-- Basic Discount Tab -->
  <div id="basic-tab" class="tab-content active">
    <h3>🏷️ Базові розрахунки знижок</h3>
    <form id="basic-discount-form">
      <div class="input-group">
        <label for="original-price">💵 Початкова ціна (грн):</label>
        <input type="number" id="original-price" step="0.01" min="0" value="1000" placeholder="Введіть початкову ціну">
      </div>
      
      <div class="input-group">
        <label for="discount-percent">🏷️ Знижка (%):</label>
        <input type="number" id="discount-percent" step="0.01" min="0" max="100" value="25" placeholder="Введіть відсоток знижки">
      </div>
      
      <div class="input-group">
        <label for="tax-percent">📋 ПДВ (%) - опціонально:</label>
        <input type="number" id="tax-percent" step="0.01" min="0" max="100" value="20" placeholder="Введіть ставку ПДВ">
      </div>
      
      <button type="submit" class="calculate-btn">Розрахувати знижку</button>
      <button type="button" id="reverse-calc" class="calculate-btn secondary">Знайти % знижки</button>
    </form>

    <div class="reverse-calc-inputs" style="display: none;">
      <div class="input-group">
        <label for="final-price">💰 Фінальна ціна (грн):</label>
        <input type="number" id="final-price" step="0.01" min="0" placeholder="Введіть фінальну ціну">
      </div>
    </div>
  </div>

  <!-- Multiple Discounts Tab -->
  <div id="multiple-tab" class="tab-content">
    <h3>🔢 Кілька послідовних знижок</h3>
    <form id="multiple-discount-form">
      <div class="input-group">
        <label for="multi-price">💵 Початкова ціна (грн):</label>
        <input type="number" id="multi-price" step="0.01" min="0" value="2000" placeholder="Введіть початкову ціну">
      </div>
      
      <div id="discount-inputs">
        <div class="input-group">
          <label for="discount1">🏷️ Перша знижка (%):</label>
          <input type="number" class="discount-input" id="discount1" step="0.01" min="0" max="100" value="20" placeholder="Перша знижка">
        </div>
        
        <div class="input-group">
          <label for="discount2">🏷️ Druga знижка (%):</label>
          <input type="number" class="discount-input" id="discount2" step="0.01" min="0" max="100" value="15" placeholder="Друга знижка">
        </div>
      </div>
      
      <button type="button" id="add-discount">➕ Додати знижку</button>
      <button type="submit" class="calculate-btn">Розрахувати всі знижки</button>
    </form>
  </div>

  <!-- Compare Discounts Tab -->
  <div id="compare-tab" class="tab-content">
    <h3>⚖️ Порівняння знижок</h3>
    <form id="compare-form">
      <div class="comparison-group">
        <h4>🅰️ Пропозиція A</h4>
        <div class="input-group">
          <label for="price-a">💵 Ціна (грн):</label>
          <input type="number" id="price-a" step="0.01" min="0" value="1500" placeholder="Ціна пропозиції A">
        </div>
        <div class="input-group">
          <label for="discount-a">🏷️ Знижка (%):</label>
          <input type="number" id="discount-a" step="0.01" min="0" max="100" value="30" placeholder="Знижка A">
        </div>
      </div>

      <div class="comparison-group">
        <h4>🅱️ Пропозиція B</h4>
        <div class="input-group">
          <label for="price-b">💵 Ціна (грн):</label>
          <input type="number" id="price-b" step="0.01" min="0" value="1200" placeholder="Ціна пропозиції B">
        </div>
        <div class="input-group">
          <label for="discount-b">🏷️ Знижка (%):</label>
          <input type="number" id="discount-b" step="0.01" min="0" max="100" value="15" placeholder="Знижка B">
        </div>
      </div>
      
      <button type="submit" class="calculate-btn">Порівняти пропозиції</button>
    </form>
  </div>

  <div id="discount-result"></div>
</div>