---
layout: calculator
title: "Калькулятор балансування хімічних рівнянь"
categories: [school]
seo:
  title: "Калькулятор балансування хімічних рівнянь – автоматичне збалансування | kalkulator.com.ua"
  description: "Автоматично збалансуйте хімічні рівняння онлайн. Знайдіть правильні стехіометричні коефіцієнти для будь-якої хімічної реакції."
  keywords:
    - балансування хімічних рівнянь
    - стехіометричні коефіцієнти
    - хімічні реакції
    - закон збереження маси
    - хімічні калькулятори
    - збалансовані рівняння
    - хімія онлайн
    - шкільна хімія
    - навчальні інструменти
  content: |
    <h2>⚖️ Калькулятор балансування хімічних рівнянь</h2>
    <p>Автоматично знайдіть правильні стехіометричні коефіцієнти для хімічних реакцій. Просто введіть незбалансоване рівняння, і калькулятор миттєво збалансує його відповідно до закону збереження маси.</p>
    
    <h3>🎯 Особливості калькулятора:</h3>
    <ul>
      <li>✅ Автоматичне балансування складних рівнянь</li>
      <li>✅ Перевірка закону збереження маси</li>
      <li>✅ Крок за кроком пояснення процесу</li>
      <li>✅ Підтримка іонних рівнянь</li>
      <li>✅ База готових прикладів</li>
    </ul>
scripts:
  - /assets/js/chemical-equation-balancer.js
faq:
  - question: Що означає збалансувати хімічне рівняння?
    answer: "Збалансувати рівняння означає знайти такі коефіцієнти перед формулами речовин, щоб кількість атомів кожного елемента була однаковою в лівій та правій частинах рівняння."
  - question: Чому важливо балансувати хімічні рівняння?
    answer: "Балансування рівнянь відображає закон збереження маси — маса речовин до реакції дорівнює масі речовин після реакції. Це основа всіх хімічних розрахунків."
  - question: Як калькулятор знаходить коефіцієнти?
    answer: "Калькулятор використовує математичні методи для розвʼязання системи лінійних рівнянь, що представляють баланс кожного елемента в реакції."
  - question: Чи можна збалансувати будь-яке рівняння?
    answer: "Більшість хімічних рівнянь можна збалансувати, але деякі реакції можуть потребувати додаткової інформації про умови або механізм реакції."
  - question: Що робити, якщо рівняння не балансується?
    answer: "Перевірте правильність написання формул речовин, переконайтеся, що реакція хімічно можлива, або спробуйте розділити складну реакцію на кілька простих."
---

<div class="calculator-container">
  <form id="equation-balancer-form">
    <div class="input-section">
      <h3>📝 Введення рівняння</h3>
      
      <div class="input-group">
        <label for="eb-equation">⚗️ Незбалансоване рівняння:</label>
        <input type="text" id="eb-equation" placeholder="Наприклад: Al + O2 → Al2O3">
        <small>Використовуйте + для розділення речовин, → або = для реакції</small>
      </div>
      
      <div class="preset-section">
        <h4>🔗 Готові приклади:</h4>
        <div class="preset-buttons">
          <button type="button" class="preset-btn" data-equation="Al + O2 → Al2O3">Окислення алюмінію</button>
          <button type="button" class="preset-btn" data-equation="C2H6 + O2 → CO2 + H2O">Горіння етану</button>
          <button type="button" class="preset-btn" data-equation="Fe + HCl → FeCl3 + H2">Залізо з соляною кислотою</button>
          <button type="button" class="preset-btn" data-equation="Ca(OH)2 + H3PO4 → Ca3(PO4)2 + H2O">Нейтралізація</button>
          <button type="button" class="preset-btn" data-equation="KMnO4 + HCl → KCl + MnCl2 + Cl2 + H2O">Окислення перманганату</button>
        </div>
      </div>
    </div>
    
    <div class="options-section">
      <div class="option-item">
        <label>
          <input type="checkbox" id="eb-show-steps"> 
          📋 Показати крок за кроком
        </label>
      </div>
      
      <div class="option-item">
        <label>
          <input type="checkbox" id="eb-verify-balance"> 
          ✅ Перевірити баланс
        </label>
      </div>
    </div>
    
    <div class="button-group">
      <button type="button" id="eb-balance" class="btn-primary">⚖️ Збалансувати</button>
      <button type="button" id="eb-clear" class="btn-secondary">🗑️ Очистити</button>
    </div>
  </form>
</div>

<!--CHART_SPLIT-->

<div id="equation-balancer-result" class="result-section"></div>

<div class="info-section">
  <h3>📚 Довідкова інформація</h3>
  
  <div class="insight-cards">
    <div class="insight-card info">
      <h6>📝 Правила запису</h6>
      <div class="small-text">
        Використовуйте правильні формули<br>
        H2O, CO2, NaCl, Ca(OH)2<br>
        Групи в дужках: Ca(OH)2<br>
        Заряди для іонів: H+ або OH-
      </div>
    </div>
    
    <div class="insight-card success">
      <h6>⚖️ Закон збереження</h6>
      <div class="small-text">
        Кількість атомів кожного<br>
        елемента до реакції =<br>
        кількості після реакції<br>
        Маса не створюється і не зникає
      </div>
    </div>
    
    <div class="insight-card warning">
      <h6>⚠️ Поради</h6>
      <div class="small-text">
        Спочатку баланс металів<br>
        Потім неметали<br>
        Водень та кисень — наприкінці<br>
        Перевіряйте загальний заряд
      </div>
    </div>
  </div>
  
  <div class="examples-section">
    <h4>📖 Приклади балансування</h4>
    <div class="example-grid">
      <div class="example-item">
        <strong>Просте окислення:</strong><br>
        Незбалансоване: Al + O2 → Al2O3<br>
        Збалансоване: 4Al + 3O2 → 2Al2O3<br>
        <em>Алюміній: 4 = 4, Кисень: 6 = 6</em>
      </div>
      <div class="example-item">
        <strong>Органічна реакція:</strong><br>
        Незбалансоване: C2H6 + O2 → CO2 + H2O<br>
        Збалансоване: 2C2H6 + 7O2 → 4CO2 + 6H2O<br>
        <em>C: 4=4, H: 12=12, O: 14=14</em>
      </div>
    </div>
  </div>
  
  <div class="tips-section">
    <h4>💡 Методи балансування</h4>
    <ol>
      <li><strong>Метод підбору:</strong> Послідовний підбір коефіцієнтів</li>
      <li><strong>Алгебричний метод:</strong> Складання системи рівнянь</li>
      <li><strong>Метод електронного балансу:</strong> Для окисно-відновних реакцій</li>
      <li><strong>Метод півреакцій:</strong> Для складних іонних рівнянь</li>
    </ol>
  </div>
</div>