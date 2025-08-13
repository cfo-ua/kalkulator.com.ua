---
layout: calculator
title: "Калькулятор розміру односпального матраца — Вибір ідеального матраца twin"
categories: [other]
seo:
  title: "Калькулятор розміру односпального матраца — Вибір ідеального матраца twin"
  description: "Підберіть ідеальний розмір односпального матраца (twin) залежно від зросту, віку та особливостей сну. Порівняння twin, twin XL та інших розмірів."
  keywords:
    - калькулятор розміру матраца
    - односпальний матрац розмір
    - twin матрац розміри
    - twin XL матрац
    - розмір матраца для дитини
    - розмір матраца для підлітка
    - як вибрати розмір матраца
    - стандартні розміри матраців
    - розміри матраців україна
    - матрац для односпального ліжка
    - розміри спального місця
    - матрац 90х200
    - матрац 80х190
    - дитячий матрац розміри
    - матрац для кімнати підлітка
    - економія простору спальня
    - вибір матраца за зростом
    - розміри постільної білизни
    - ліжко односпальне розміри
    - гуртожиток матрац
    - студентське ліжко
    - гостьова кімната матрац
    - матрац для дачі
    - компактне спальне місце
    - ортопедичний матрац розмір
    - пружинний матрац twin
    - піна матрац розміри
  content: |
    <h2>Підберіть ідеальний розмір односпального матраца</h2>
    <p>Професійний калькулятор для вибору розміру односпального матраца (twin) з урахуванням зросту, віку, положення сну та особливостей кімнати. Порівняння усіх стандартних розмірів.</p>
    
    <h3>Стандартні розміри односпальних матраців</h3>
    <ul>
      <li><strong>Twin (США):</strong> 99×191 см — стандартний односпальний</li>
      <li><strong>Twin XL (США):</strong> 99×203 см — подовжений для високих людей</li>
      <li><strong>Single (Європа):</strong> 90×190 см — європейський стандарт</li>
      <li><strong>Single Long:</strong> 90×200 см — подовжений європейський</li>
      <li><strong>Дитячий:</strong> 80×160-180 см — для дітей до 12 років</li>
    </ul>
    
    <h3>Для кого підходять односпальні матраци?</h3>
    <ul>
      <li><strong>Діти та підлітки:</strong> від 3 до 16 років</li>
      <li><strong>Студенти:</strong> гуртожитки та малогабаритні кімнати</li>
      <li><strong>Дорослі:</strong> гостьові кімнати, дачі, економія простору</li>
      <li><strong>Літні люди:</strong> зручність та безпека</li>
      <li><strong>Поодинокі особи:</strong> студії та малометражки</li>
    </ul>
    
    <h3>Критерії вибору розміру</h3>
    <ul>
      <li><strong>Зріст:</strong> довжина матраца має бути на 15-20 см більше зросту</li>
      <li><strong>Ширина:</strong> мінімум 80 см для комфортного сну</li>
      <li><strong>Вік:</strong> діти ростуть, варто взяти розмір "на виріст"</li>
      <li><strong>Стиль сну:</strong> активні сплячі потребують більше місця</li>
      <li><strong>Розмір кімнати:</strong> залишити простір для меблів та проходів</li>
    </ul>
    
    <h3>Переваги різних розмірів</h3>
    <ul>
      <li><strong>Twin:</strong> економія простору, доступна ціна, підходить дітям</li>
      <li><strong>Twin XL:</strong> для високих підлітків та студентів</li>
      <li><strong>Single:</strong> європейські стандарти постільної білизни</li>
      <li><strong>Дитячий:</strong> безпека, правильний розвиток хребта</li>
    </ul>
scripts:
  - /assets/js/twin-mattress-size.js
faq:
  - question: Яка різниця між Twin та Twin XL матрацом?
    answer: "Twin: 99×191 см, Twin XL: 99×203 см. XL на 12 см довший, підходить для людей зростом вище 175 см."
  - question: Який розмір матраца підходить для дитини 10 років?
    answer: "Для дитини 10 років підійде Twin (99×191 см) або Single (90×190 см). Це дасть простір для росту на кілька років."
  - question: До якого віку можна спати на односпальному матраці?
    answer: "Односпальний матрац підходить до 16-18 років або дорослим, які цінують компактність та економію простору."
  - question: Скільки місця потрібно для односпального ліжка в кімнаті?
    answer: "Мінімум 200×260 см для ліжка 90×200 см, враховуючи прохід та меблі. Оптимально — 250×300 см."
  - question: Чи можна використовувати Twin матрац для дорослого?
    answer: "Так, якщо зріст до 175 см та людина спить одна. Для більш високих краще Twin XL або подвійний розмір."
  - question: Як вибрати матрац для гуртожитку?
    answer: "Twin XL (99×203 см) — стандарт для гуртожитків в США. В Україні часто 90×200 см. Уточніть розміри ліжка."
---

<div class="mattress-calculator-container">
  <div class="input-section">
    <div class="input-row">
      <div class="input-group">
        <label for="userHeight">Зріст користувача:</label>
        <div class="unit-input">
          <input type="number" id="userHeight" min="60" max="220" value="170" step="1">
          <span class="unit">см</span>
        </div>
      </div>
      
      <div class="input-group">
        <label for="userAge">Вік користувача:</label>
        <select id="userAge">
          <option value="child">3-8 років (дитина)</option>
          <option value="preteen">9-12 років (підліток)</option>
          <option value="teen" selected>13-17 років (тінейджер)</option>
          <option value="adult">18+ років (дорослий)</option>
        </select>
      </div>
    </div>
    
    <div class="input-row">
      <div class="input-group">
        <label for="sleepStyle">Стиль сну:</label>
        <select id="sleepStyle">
          <option value="calm" selected>Спокійний (мало рухаюсь)</option>
          <option value="active">Активний (часто повертаюсь)</option>
          <option value="spread">Розкинутий (займаю багато місця)</option>
        </select>
      </div>
      
      <div class="input-group">
        <label for="roomSize">Розмір кімнати:</label>
        <select id="roomSize">
          <option value="small">Мала (менше 10 м²)</option>
          <option value="medium" selected>Середня (10-15 м²)</option>
          <option value="large">Велика (більше 15 м²)</option>
        </select>
      </div>
    </div>
    
    <div class="input-row">
      <div class="input-group">
        <label for="usage">Призначення:</label>
        <select id="usage">
          <option value="main" selected>Основне ліжко</option>
          <option value="guest">Гостьове ліжко</option>
          <option value="dorm">Гуртожиток</option>
          <option value="child">Дитяча кімната</option>
          <option value="vacation">Дача/відпочинок</option>
        </select>
      </div>
      
      <div class="input-group">
        <label for="budget">Бюджет:</label>
        <select id="budget">
          <option value="economy">Економ (до 5000 грн)</option>
          <option value="standard" selected>Стандарт (5000-10000 грн)</option>
          <option value="premium">Преміум (10000+ грн)</option>
        </select>
      </div>
    </div>
    
    <button id="calculateBtn" class="calculate-button">
      <span class="button-icon">🛏️</span>
      <span class="button-text">Підібрати розмір матраца</span>
    </button>
  </div>

  <div class="result-section" id="resultSection">
    <!-- Results will be displayed here -->
  </div>
</div>

<style>
.mattress-calculator-container {
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

.mattress-overview {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: var(--radius);
  margin-bottom: 2rem;
  border: 2px solid var(--border);
  text-align: center;
}

.mattress-overview h3 {
  color: var(--main-color);
  margin-bottom: 1rem;
}

.mattress-info {
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

.recommendations-section {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: var(--radius);
  margin-bottom: 2rem;
  border: 2px solid var(--border);
}

.recommendations-section h3 {
  color: var(--main-color);
  margin-bottom: 1.5rem;
  text-align: center;
}

.size-comparison {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.size-option {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid var(--border);
  text-align: center;
  transition: all var(--transition);
}

.size-option.recommended {
  border-color: var(--accent);
  background: linear-gradient(135deg, #f8fdff 0%, #e8f8fc 100%);
  transform: scale(1.02);
}

.size-option.not-recommended {
  opacity: 0.6;
}

.size-option h4 {
  color: var(--accent);
  margin-bottom: 1rem;
  font-size: 1.1rem;
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
  .mattress-calculator-container {
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
  
  .mattress-info {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .size-comparison {
    grid-template-columns: 1fr;
  }
  
  .tips-grid {
    grid-template-columns: 1fr;
  }
}
</style>