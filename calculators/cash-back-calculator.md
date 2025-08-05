---
layout: calculator
title: "Калькулятор кешбеку"
categories: [financial]
scripts:
  - /js/cash-back-calculator.js
seo:
  title: "Калькулятор кешбеку - Розрахунок винагороди з кредитних карт та програм лояльності"
  description: "Розрахуйте кешбек з кредитних карт, програм лояльності та покупок. Порівняйте різні пропозиції та максимізуйте свою винагороду від щоденних витрат."
  keywords:
    - калькулятор кешбеку
    - кешбек калькулятор
    - розрахунок cashback
    - кредитна карта кешбек
    - програми лояльності
    - винагорода за покупки
    - кешбек банки україна
    - повернення грошей
    - бонуси за покупки
    - монобанк кешбек
    - приватбанк кешбек
    - ощадбанк кешбек
    - розрахунок винагороди
    - максимізація кешбеку
    - фінансова оптимізація
  content: |
    <h2>Калькулятор кешбеку</h2>
    <p>Розрахуйте свою <strong>винагороду від кешбеку</strong> з кредитних карт, банківських програм та сервісів лояльності. Оптимізуйте свої витрати та максимізуйте повернення коштів від щоденних покупок.</p>

    <h3>Типи кешбеку:</h3>
    <ul>
      <li><strong>Кредитні карти</strong> - від 1% до 10% з різних категорій</li>
      <li><strong>Банківські програми</strong> - бонуси за користування картою</li>
      <li><strong>Інтернет-магазини</strong> - кешбек за онлайн покупки</li>
      <li><strong>Програми лояльності</strong> - накопичувальні системи</li>
    </ul>

    <h3>Популярні кешбек програми в Україні:</h3>
    <ul>
      <li>🏦 <strong>Монобанк</strong> - до 25% кешбеку з обраних категорій</li>
      <li>🏦 <strong>ПриватБанк</strong> - до 10% кешбеку з партнерів</li>
      <li>🏦 <strong>Ощадбанк</strong> - до 7% кешбеку за покупки</li>
      <li>🛒 <strong>Фокстрот, АТБ, Сільпо</strong> - програми лояльності</li>
    </ul>

    <h3>Переваги використання:</h3>
    <ul>
      <li>💰 <strong>Пасивний дохід</strong> - заробляйте на звичайних покупках</li>
      <li>📊 <strong>Порівняння пропозицій</strong> - оберіть найвигідніші умови</li>
      <li>🎯 <strong>Планування витрат</strong> - максимізуйте кешбек стратегічно</li>
      <li>📈 <strong>Річна економія</strong> - розрахуйте загальну вигоду</li>
    </ul>

    <h3>Категорії покупок:</h3>
    <ul>
      <li><strong>Продукти харчування</strong> - щоденні витрати</li>
      <li><strong>АЗС та транспорт</strong> - паливо та проїзд</li>
      <li><strong>Ресторани та кафе</strong> - харчування поза домом</li>
      <li><strong>Інтернет покупки</strong> - онлайн шопінг</li>
      <li><strong>Комунальні послуги</strong> - регулярні платежі</li>
    </ul>

faq:
  - question: "Що таке кешбек і як він працює?"
    answer: "Кешбек - це повернення частини витрачених коштів у вигляді грошей або бонусів. Банки та магазини пропонують кешбек як винагороду за використання їх послуг, зазвичай у відсотках від суми покупки."

  - question: "Чи оподатковується кешбек в Україні?"
    answer: "Згідно з українським законодавством, кешбек від банківських карт до 25% не оподатковується. Однак варто консультуватися з податковими консультантами для конкретних ситуацій."

  - question: "Як максимізувати кешбек?"
    answer: "Використовуйте спеціалізовані карти для різних категорій, слідкуйте за акціями та бонусними періодами, плануйте великі покупки під час подвійного кешбеку, активуйте категорії в мобільних додатках."

  - question: "Чи є ліміти на кешбек?"
    answer: "Так, більшість програм мають місячні або річні ліміти на максимальну суму кешбеку. Наприклад, 1000 грн на місяць для певної категорії або 10000 грн на рік загалом."

  - question: "Коли зараховується кешбек?"
    answer: "Зазвичай кешбек зараховується протягом 1-7 днів після покупки, але може затримуватися до 30-60 днів для онлайн покупок або спеціальних акцій."
---

<div class="calculator-container">
  <div class="calculator-inputs">
    <h3>💳 Розрахунок кешбеку</h3>
    
    <div class="input-group">
      <label for="monthlySpending">Місячні витрати (грн)</label>
      <input type="number" id="monthlySpending" step="100" value="15000" placeholder="Загальні витрати за місяць">
    </div>

    <div class="categories-section">
      <h4>📊 Розподіл витрат по категоріях</h4>
      
      <div class="category-input">
        <label>🛒 Продукти харчування</label>
        <div class="category-controls">
          <input type="number" id="groceryAmount" step="100" value="6000" placeholder="Сума">
          <input type="number" id="groceryCashback" step="0.1" value="2.0" placeholder="% кешбеку">
        </div>
      </div>

      <div class="category-input">
        <label>⛽ АЗС та транспорт</label>
        <div class="category-controls">
          <input type="number" id="fuelAmount" step="100" value="3000" placeholder="Сума">
          <input type="number" id="fuelCashback" step="0.1" value="5.0" placeholder="% кешбеку">
        </div>
      </div>

      <div class="category-input">
        <label>🍽️ Ресторани та кафе</label>
        <div class="category-controls">
          <input type="number" id="restaurantAmount" step="100" value="2000" placeholder="Сума">
          <input type="number" id="restaurantCashback" step="0.1" value="10.0" placeholder="% кешбеку">
        </div>
      </div>

      <div class="category-input">
        <label>🛍️ Онлайн покупки</label>
        <div class="category-controls">
          <input type="number" id="onlineAmount" step="100" value="2500" placeholder="Сума">
          <input type="number" id="onlineCashback" step="0.1" value="3.0" placeholder="% кешбеку">
        </div>
      </div>

      <div class="category-input">
        <label>🏠 Комунальні послуги</label>
        <div class="category-controls">
          <input type="number" id="utilitiesAmount" step="100" value="1500" placeholder="Сума">
          <input type="number" id="utilitiesCashback" step="0.1" value="1.0" placeholder="% кешбеку">
        </div>
      </div>
    </div>

    <div class="input-group">
      <label for="annualFee">Річна плата за картку (грн)</label>
      <input type="number" id="annualFee" step="50" value="0" placeholder="Вартість обслуговування">
    </div>

    <button onclick="calculateCashback()" class="calculate-btn">💰 Розрахувати кешбек</button>
  </div>

  <div id="results"></div>
</div>

<!--CHART_SPLIT-->

<div class="chart-container">
  <canvas id="cashbackChart" width="500" height="400"></canvas>
</div>