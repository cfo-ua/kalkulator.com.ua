---
layout: calculator
title: "Калькулятор розміру штор — Розрахунок довжини та ширини штор для вікна"
categories: [construction]
seo:
  title: "Калькулятор розміру штор — Розрахунок довжини та ширини штор для вікна"
  description: "Розрахуйте точні розміри штор для вашого вікна. Калькулятор враховує тип штор, коефіцієнт складок, підгін та стиль кріплення."
  keywords:
    - калькулятор штор
    - розмір штор калькулятор
    - розрахунок штор
    - довжина штор
    - ширина штор
    - скільки тканини на штори
    - пошиття штор розрахунок
    - як розрахувати штори
    - розміри штор для вікна
    - штори на замовлення
    - штори під стелю
    - штори до підлоги
    - римські штори розміри
    - японські штори розрахунок
    - класичні штори розміри
    - тюль розрахунок
    - портьєри розміри
    - ламбрекен розрахунок
    - штори для спальні
    - штори для кухні
    - штори для вітальні
    - дизайн штор
    - оформлення вікон
    - текстиль для дому
    - декор інтер'єру
    - пошиття штор
    - кріплення штор
    - карниз для штор
  content: |
    <h2>Розрахуйте ідеальні розміри штор для вашого вікна</h2>
    <p>Точний розрахунок розмірів штор з урахуванням типу тканини, стилю оформлення, коефіцієнта складок та особливостей кріплення до карниза.</p>
    
    <h3>Що враховує калькулятор?</h3>
    <ul>
      <li><strong>Розміри вікна:</strong> ширина та висота віконного прорізу</li>
      <li><strong>Тип штор:</strong> класичні, римські, японські, рулонні</li>
      <li><strong>Коефіцієнт складок:</strong> від 1.5 до 3 залежно від стилю</li>
      <li><strong>Довжина штор:</strong> до підвіконня, нижче підвіконня, до підлоги</li>
      <li><strong>Кріплення:</strong> люверси, петлі, кулиска, підхоплення</li>
    </ul>
    
    <h3>Типи штор та їх особливості</h3>
    <ul>
      <li><strong>Класичні штори:</strong> традиційний стиль з складками, коефіцієнт 2-2.5</li>
      <li><strong>Римські штори:</strong> рівні полотна без складок, коефіцієнт 1.1</li>
      <li><strong>Японські штори:</strong> прямі панелі без складок, коефіцієнт 1.0</li>
      <li><strong>Австрійські штори:</strong> пишні складки по низу, коефіцієнт 2.5-3</li>
      <li><strong>Французькі штори:</strong> рівномірні складки по всій висоті, коефіцієнт 2.5</li>
    </ul>
    
    <h3>Поради з вибору розмірів</h3>
    <ul>
      <li><strong>Ширина карниза:</strong> на 20-40 см ширше вікна для кращого вигляду</li>
      <li><strong>Висота кріплення:</strong> 10-20 см над віконним прорізом</li>
      <li><strong>Довжина штор:</strong> до підлоги мінус 1-2 см або "з шлейфом" плюс 5-15 см</li>
      <li><strong>Запас на обробку:</strong> 10-15 см на підгін, 5-10 см на бокові шви</li>
    </ul>
scripts:
  - /assets/js/curtain-size.js
faq:
  - question: Як розрахувати ширину штор?
    answer: "Ширина штор = ширина карниза × коефіцієнт складок. Для класичних штор коефіцієнт 2-2.5, для римських 1.1, для японських 1.0."
  - question: Який коефіцієнт складок вибрати?
    answer: "Залежить від стилю: мінімалістичний - 1.5-2, класичний - 2-2.5, розкішний - 2.5-3. Чим більше складок, тим пишніше виглядають штори."
  - question: Скільки потрібно тканини на штори?
    answer: "Розрахуйте ширину з коефіцієнтом складок + 20 см на обробку боків. Висота = довжина штор + 25-30 см на підгін зверху і знизу."
  - question: Як правильно виміряти вікно для штор?
    answer: "Вимірюйте ширину карниза (не вікна!), висоту від карниза до потрібної довжини. Враховуйте тип кріплення штор."
  - question: Чи потрібно додавати запас до розмірів?
    answer: "Так, обов'язково! 10-15 см зверху та знизу на підгін, 5-10 см з боків на обробку швів, плюс коефіцієнт складок."
  - question: Як розрахувати штори нестандартної форми?
    answer: "Для арочних, трикутних вікон розбийте форму на прості геометричні фігури і розрахуйте кожну частину окремо."
---

<div class="curtain-calculator-container">
  <div class="input-section">
    <div class="input-row">
      <div class="input-group">
        <label for="windowWidth">Ширина карниза:</label>
        <div class="unit-input">
          <input type="number" id="windowWidth" min="50" max="800" value="200" step="1">
          <span class="unit">см</span>
        </div>
      </div>
      
      <div class="input-group">
        <label for="windowHeight">Висота від карниза:</label>
        <div class="unit-input">
          <input type="number" id="windowHeight" min="50" max="400" value="250" step="1">
          <span class="unit">см</span>
        </div>
      </div>
    </div>
    
    <div class="input-row">
      <div class="input-group">
        <label for="curtainType">Тип штор:</label>
        <select id="curtainType">
          <option value="classic" selected>Класичні штори</option>
          <option value="roman">Римські штори</option>
          <option value="japanese">Японські панелі</option>
          <option value="austrian">Австрійські штори</option>
          <option value="french">Французькі штори</option>
          <option value="cafe">Кафе штори</option>
        </select>
      </div>
      
      <div class="input-group">
        <label for="curtainLength">Довжина штор:</label>
        <select id="curtainLength">
          <option value="sill">До підвіконня (-15 см)</option>
          <option value="below-sill">Нижче підвіконня (+20 см)</option>
          <option value="floor" selected>До підлоги (-2 см)</option>
          <option value="puddle">З шлейфом (+10 см)</option>
          <option value="custom">Індивідуальна</option>
        </select>
      </div>
    </div>
    
    <div class="input-row" id="customLengthRow" style="display: none;">
      <div class="input-group">
        <label for="customLength">Індивідуальна довжина:</label>
        <div class="unit-input">
          <input type="number" id="customLength" min="50" max="400" value="250" step="1">
          <span class="unit">см</span>
        </div>
      </div>
    </div>
    
    <div class="input-row">
      <div class="input-group">
        <label for="fullnessCoeff">Коефіцієнт складок:</label>
        <select id="fullnessCoeff">
          <option value="1.0">1.0 (без складок)</option>
          <option value="1.5">1.5 (мінімальні складки)</option>
          <option value="2.0" selected>2.0 (помірні складки)</option>
          <option value="2.5">2.5 (пишні складки)</option>
          <option value="3.0">3.0 (дуже пишні складки)</option>
          <option value="custom">Індивідуальний</option>
        </select>
      </div>
      
      <div class="input-group">
        <label for="fabricWidth">Ширина тканини:</label>
        <select id="fabricWidth">
          <option value="150" selected>150 см (стандарт)</option>
          <option value="140">140 см</option>
          <option value="280">280 см (подвійна)</option>
          <option value="300">300 см (широка)</option>
          <option value="custom">Інша ширина</option>
        </select>
      </div>
    </div>
    
    <div class="input-row" id="customCoeffRow" style="display: none;">
      <div class="input-group">
        <label for="customCoeff">Індивідуальний коефіцієнт:</label>
        <div class="unit-input">
          <input type="number" id="customCoeff" min="1.0" max="4.0" value="2.0" step="0.1">
          <span class="unit">x</span>
        </div>
      </div>
    </div>
    
    <div class="input-row" id="customFabricRow" style="display: none;">
      <div class="input-group">
        <label for="customFabricWidth">Ширина тканини:</label>
        <div class="unit-input">
          <input type="number" id="customFabricWidth" min="100" max="500" value="150" step="1">
          <span class="unit">см</span>
        </div>
      </div>
    </div>
    
    <button id="calculateBtn" class="calculate-button">
      <span class="button-icon">📏</span>
      <span class="button-text">Розрахувати розміри штор</span>
    </button>
  </div>

  <div class="result-section" id="resultSection">
    <!-- Results will be displayed here -->
  </div>
</div>

<style>
.curtain-calculator-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.input-section {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: var(--radius);
  margin-bottom: 2rem;
  border: 2px solid var(--border);
}

.input-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.input-row:last-of-type {
  margin-bottom: 2rem;
}

.input-group {
  flex: 1;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--main-color);
  font-size: 0.9rem;
}

.unit-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.unit-input input {
  flex: 1;
}

.unit-input .unit {
  background: var(--border);
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--main-color);
  min-width: 40px;
  text-align: center;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color var(--transition);
}

.input-group input:focus,
.input-group select:focus {
  outline: none;
  border-color: var(--accent);
}

.calculate-button {
  background: linear-gradient(45deg, var(--accent), var(--accent-hover));
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: var(--radius);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
  box-shadow: var(--shadow);
}

.calculate-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(21, 122, 255, 0.3);
}

.result-section {
  display: none;
}

.result-section.show {
  display: block;
}

.curtain-overview {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: var(--radius);
  margin-bottom: 2rem;
  border: 2px solid var(--border);
  text-align: center;
}

.curtain-overview h3 {
  color: var(--main-color);
  margin-bottom: 1rem;
}

.curtain-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.info-item {
  text-align: center;
}

.info-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--accent);
  display: block;
}

.info-label {
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
}

.measurements-section {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: var(--radius);
  margin-bottom: 2rem;
  border: 2px solid var(--border);
}

.measurements-section h3 {
  color: var(--main-color);
  margin-bottom: 1.5rem;
  text-align: center;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.tip-item {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid var(--border);
}

.tip-item h4 {
  color: var(--accent);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.tip-item ul {
  margin: 0;
  padding-left: 1.2rem;
}

.tip-item li {
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .curtain-calculator-container {
    padding: 1rem;
  }
  
  .input-section {
    padding: 1.5rem;
  }
  
  .input-row {
    grid-template-columns: 1fr;
  }
  
  .calculate-button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
  
  .curtain-info {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .tips-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<script>
// Show/hide custom inputs
document.getElementById('curtainLength').addEventListener('change', function() {
  const customRow = document.getElementById('customLengthRow');
  customRow.style.display = this.value === 'custom' ? 'block' : 'none';
});

document.getElementById('fullnessCoeff').addEventListener('change', function() {
  const customRow = document.getElementById('customCoeffRow');
  customRow.style.display = this.value === 'custom' ? 'block' : 'none';
});

document.getElementById('fabricWidth').addEventListener('change', function() {
  const customRow = document.getElementById('customFabricRow');
  customRow.style.display = this.value === 'custom' ? 'block' : 'none';
});

// Auto-update coefficient based on curtain type
document.getElementById('curtainType').addEventListener('change', function() {
  const coeffSelect = document.getElementById('fullnessCoeff');
  const coefficients = {
    'classic': '2.0',
    'roman': '1.0', 
    'japanese': '1.0',
    'austrian': '2.5',
    'french': '2.5',
    'cafe': '1.5'
  };
  
  if (coefficients[this.value]) {
    coeffSelect.value = coefficients[this.value];
  }
});
</script>