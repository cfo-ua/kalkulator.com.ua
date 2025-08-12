---
layout: calculator
title: "Калькулятор стехіометрії хімічних реакцій"
categories: [school]
seo:
  title: "Калькулятор стехіометрії – розрахунок хімічних реакцій | kalkulator.com.ua"
  description: "Обчисліть кількості речовин у хімічних реакціях за стехіометричними коефіцієнтами. Молі, маси, обʼєми газів при н.у."
  keywords:
    - стехіометрія
    - хімічні реакції
    - молярна маса
    - моль
    - обʼєм газу
    - хімічні розрахунки
    - закон збереження маси
    - коефіцієнти реакції
    - хімія
    - шкільний калькулятор
  content: |
    <h2>⚗️ Калькулятор стехіометрії</h2>
    <p>Потужний інструмент для розрахунку кількостей речовин у хімічних реакціях. Обчисліть молі, маси та обʼєми на основі стехіометричних коефіцієнтів реакції.</p>
    
    <h3>🎯 Можливості калькулятора:</h3>
    <ul>
      <li>✅ Розрахунок за кількістю молів</li>
      <li>✅ Конверсія між масою та молями</li>
      <li>✅ Обчислення обʼємів газів при н.у.</li>
      <li>✅ Визначення лімітуючого реагенту</li>
      <li>✅ Теоретичний та практичний вихід</li>
    </ul>
scripts:
  - /assets/js/stoichiometry.js
faq:
  - question: Що таке стехіометрія?
    answer: "Стехіометрія — це розділ хімії, що вивчає кількісні співвідношення між речовинами в хімічних реакціях на основі закону збереження маси."
  - question: Як знайти молярну масу?
    answer: "Молярна маса дорівнює сумі атомних мас всіх атомів у молекулі. Наприклад, для H₂O: M = 2×1 + 16 = 18 г/моль."
  - question: Що таке лімітуючий реагент?
    answer: "Лімітуючий реагент — це речовина, яка повністю витрачається першою в реакції і визначає максимальну кількість продукту."
  - question: Як обчислити обʼєм газу при н.у.?
    answer: "При нормальних умовах (0°C, 1 атм) 1 моль будь-якого газу займає 22,4 л. V = n × 22,4 л/моль."
  - question: Що таке вихід реакції?
    answer: "Вихід реакції — це відношення фактично отриманої кількості продукту до теоретично можливої, виражене у відсотках."
---

<div class="calculator-container">
  <form id="stoichiometry-form">
    <div class="reaction-setup">
      <h3>⚖️ Налаштування реакції</h3>
      
      <div class="input-group">
        <label for="st-equation">📝 Хімічне рівняння:</label>
        <input type="text" id="st-equation" placeholder="Наприклад: 2H2 + O2 → 2H2O">
        <small>Введіть збалансоване рівняння або використайте готовий приклад</small>
      </div>
      
      <div class="preset-buttons">
        <button type="button" class="preset-btn" data-equation="2H2 + O2 → 2H2O">Утворення води</button>
        <button type="button" class="preset-btn" data-equation="CH4 + 2O2 → CO2 + 2H2O">Горіння метану</button>
        <button type="button" class="preset-btn" data-equation="2Na + Cl2 → 2NaCl">Утворення солі</button>
        <button type="button" class="preset-btn" data-equation="CaCO3 → CaO + CO2">Розклад карбонату</button>
      </div>
    </div>

    <div class="calculation-setup">
      <h3>🧮 Розрахунки</h3>
      
      <div class="input-row">
        <div class="input-group">
          <label for="st-substance">🔬 Речовина:</label>
          <select id="st-substance">
            <option value="">Оберіть речовину</option>
          </select>
        </div>
        
        <div class="input-group">
          <label for="st-amount-type">📊 Тип кількості:</label>
          <select id="st-amount-type">
            <option value="moles">Кількість речовини (моль)</option>
            <option value="mass">Маса (г)</option>
            <option value="volume">Обʼєм газу при н.у. (л)</option>
          </select>
        </div>
      </div>
      
      <div class="input-row">
        <div class="input-group">
          <label for="st-amount">📏 Кількість:</label>
          <input type="number" id="st-amount" step="0.01" placeholder="Введіть значення">
        </div>
        
        <div class="input-group">
          <label for="st-molar-mass">⚛️ Молярна маса (г/моль):</label>
          <input type="number" id="st-molar-mass" step="0.01" placeholder="Авто або введіть">
        </div>
      </div>
    </div>
    
    <div class="button-group">
      <button type="button" id="st-calculate" class="btn-primary">🧪 Розрахувати</button>
      <button type="button" id="st-clear" class="btn-secondary">🗑️ Очистити</button>
    </div>
  </form>
</div>

<!--CHART_SPLIT-->

<div id="stoichiometry-result" class="result-section"></div>

<div class="info-section">
  <h3>📚 Довідкова інформація</h3>
  
  <div class="insight-cards">
    <div class="insight-card info">
      <h6>⚛️ Молярні маси</h6>
      <div class="small-text">
        H: 1 г/моль<br>
        C: 12 г/моль<br>
        N: 14 г/моль<br>
        O: 16 г/моль<br>
        Na: 23 г/моль<br>
        Cl: 35.5 г/моль
      </div>
    </div>
    
    <div class="insight-card success">
      <h6>📐 Формули</h6>
      <div class="small-text">
        n = m / M<br>
        V = n × 22.4 л/моль<br>
        Вихід = (практ./теор.) × 100%<br>
        Коефіцієнти = пропорції
      </div>
    </div>
    
    <div class="insight-card warning">
      <h6>💡 Поради</h6>
      <div class="small-text">
        Завжди збалансуйте рівняння<br>
        Перевіряйте одиниці вимірювання<br>
        Округлюйте до значущих цифр<br>
        Враховуйте умови реакції
      </div>
    </div>
  </div>
  
  <div class="examples-section">
    <h4>📖 Приклади розрахунків</h4>
    <div class="example-grid">
      <div class="example-item">
        <strong>Приклад 1:</strong><br>
        2H₂ + O₂ → 2H₂O<br>
        Якщо є 4 моль H₂:<br>
        Потрібно 2 моль O₂<br>
        Утвориться 4 моль H₂O
      </div>
      <div class="example-item">
        <strong>Приклад 2:</strong><br>
        CH₄ + 2O₂ → CO₂ + 2H₂O<br>
        16 г CH₄ (1 моль):<br>
        Потрібно 64 г O₂ (2 моль)<br>
        Утвориться 44 г CO₂
      </div>
    </div>
  </div>
</div>