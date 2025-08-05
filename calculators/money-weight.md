---
layout: calculator
title: "Калькулятор ваги грошей"
categories: [financial]
seo:
  title: "Калькулятор ваги грошей — скільки важить мільйон доларів"
  description: "Дізнайтеся скільки важать гроші різних номіналів та валют. Калькулятор ваги доларів, євро, гривень, фунтів стерлінгів. Скільки важить мільйон доларів?"
  keywords:
    - вага грошей
    - скільки важить долар
    - вага мільйона доларів
    - вага банкнот
    - вага валюти
    - вага євро
    - вага гривні
    - калькулятор ваги грошей
    - маса банкнот
    - цікавості про гроші
  content: |
    <h2>Калькулятор ваги грошей та валют</h2>
    <p>Цікаво дізнатися, скільки важить мільйон доларів або ваша зарплата у банкнотах? Наш калькулятор розрахує вагу будь-якої суми у різних валютах та номіналах.</p>

    <h3>Цікаві факти про вагу грошей:</h3>
    <ul>
      <li><strong>Долар США:</strong> всі банкноти важать однаково — 1 грам</li>
      <li><strong>Мільйон доларів:</strong> у банкнотах $100 важить ~10 кг</li>
      <li><strong>Євро:</strong> вага залежить від номіналу — від 0.63г до 1.02г</li>
      <li><strong>Гривня:</strong> сучасні банкноти важать від 0.73г до 1.05г</li>
    </ul>

    <h3>Де це може стати в пригоді:</h3>
    <p><strong>Кіноіндустрія:</strong> точні розрахунки для сцен з грошима</p>
    <p><strong>Інкасація:</strong> планування логістики перевезення готівки</p>
    <p><strong>Цікавість:</strong> дізнатися цікаві факти про власні заощадження</p>
    <p><strong>Освіта:</strong> наочно показати вартість та вагу грошей</p>

    <h3>Підтримувані валюти:</h3>
    <p>Долар США, Євро, Українська гривня, Фунт стерлінгів та інші популярні валюти з актуальними даними про вагу банкнот.</p>
scripts:
  - /assets/js/money-weight.js
faq:
  - question: Скільки важить мільйон доларів у банкнотах $100?
    answer: "Мільйон доларів у банкнотах по $100 (10,000 банкнот) важить приблизно 10 кілограмів."
  - question: Чи всі банкноти доларів важать однаково?
    answer: "Так, всі банкноти доларів США незалежно від номіналу важать приблизно 1 грам."
  - question: Яка найважча банкнота у світі?
    answer: "Банкноти євро різняться за вагою: €500 важить 1.02г, а €5 — лише 0.63г."
  - question: Скільки важить мільйон гривень?
    answer: "Мільйон гривень у банкнотах 1000 грн (1000 банкнот) важить приблизно 1 кілограм."
  - question: Чи впливає стан банкноти на вагу?
    answer: "Так, зношені банкноти можуть бути на 10-20% легшими через втрату матеріалу."
  - question: Скільки може винести людина в грошах?
    answer: "Людина може понести ~20кг, що еквівалентно ~2 мільйонам доларів у банкнотах $100."
---
<form id="money-weight-form" autocomplete="off">
  <div class="input-group">
    <label>
      Сума:
      <input type="number" id="amount" min="1" step="1" value="1000000" required>
    </label>
  </div>
  
  <div class="input-group">
    <label>
      Валюта:
      <select id="currency" required>
        <option value="USD">Долар США (USD)</option>
        <option value="EUR">Євро (EUR)</option>
        <option value="UAH">Українська гривня (UAH)</option>
        <option value="GBP">Фунт стерлінгів (GBP)</option>
        <option value="CAD">Канадський долар (CAD)</option>
        <option value="AUD">Австралійський долар (AUD)</option>
        <option value="CHF">Швейцарський франк (CHF)</option>
        <option value="JPY">Японська єна (JPY)</option>
      </select>
    </label>
  </div>
  
  <div class="input-group">
    <label>
      Номінал банкноти:
      <select id="denomination" required>
        <option value="auto">Оптимальний (найменше банкнот)</option>
        <!-- Options will be populated by JavaScript based on currency -->
      </select>
    </label>
  </div>
  
  <div class="input-group">
    <label>
      Стан банкнот:
      <select id="condition">
        <option value="new">Нові (100%)</option>
        <option value="good">Хороший стан (90%)</option>
        <option value="used">Зношені (80%)</option>
        <option value="poor">Дуже зношені (70%)</option>
      </select>
    </label>
  </div>
  
  <button type="submit">⚖️ Розрахувати вагу грошей</button>
</form>

<div id="money-weight-result" class="result"></div>