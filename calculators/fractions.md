---
layout: calculator
title: "Калькулятор дробів"
categories: [school]
seo:
  title: "Калькулятор дробів онлайн — додавання, віднімання, множення, ділення дробів"
  description: "Безкоштовний онлайн калькулятор дробів для додавання, віднімання, множення і ділення звичайних дробів. Спрощення дробів, перетворення у мішані числа."
  keywords:
    - калькулятор дробів
    - дроби онлайн
    - додавання дробів
    - віднімання дробів
    - множення дробів
    - ділення дробів
    - спрощення дробів
    - мішані числа
    - звичайні дроби
    - шкільна математика
    - дроби 5 клас
    - дроби 6 клас
    - математика онлайн
    - розв'язування дробів
  content: |
    <h2>Калькулятор дробів онлайн</h2>
    <p>Дроби — це один з найважливіших розділів математики, який вивчається з 5-го класу. Наш калькулятор допоможе вам легко виконувати всі основні операції з дробами: додавання, віднімання, множення та ділення. 🔢</p>

    <h3>Що можна робити з дробами за допомогою калькулятора?</h3>
    <ul>
      <li><strong>➕ Додавання дробів</strong> — з однаковими та різними знаменниками</li>
      <li><strong>➖ Віднімання дробів</strong> — знаходження різниці між дробами</li>
      <li><strong>✖️ Множення дробів</strong> — перемноження чисельника на чисельник</li>
      <li><strong>➗ Ділення дробів</strong> — ділення на дріб (множення на обернений)</li>
      <li><strong>🔄 Спрощення дробів</strong> — автоматичне скорочення на НСД</li>
      <li><strong>🔢 Робота з мішаними числами</strong> — перетворення туди і назад</li>
    </ul>

    <h3>Основні правила роботи з дробами:</h3>
    <ol>
      <li><strong>Додавання і віднімання:</strong> Зводимо до спільного знаменника</li>
      <li><strong>Множення:</strong> Множимо чисельники між собою, знаменники між собою</li>
      <li><strong>Ділення:</strong> Множимо на обернений дріб</li>
      <li><strong>Спрощення:</strong> Ділимо чисельник і знаменник на їх НСД</li>
    </ol>

    <h3>Приклади використання:</h3>
    <ul>
      <li><strong>Кулінарія:</strong> Розрахунок інгредієнтів за рецептами</li>
      <li><strong>Будівництво:</strong> Виміри довжин та площ у дюймах</li>
      <li><strong>Шкільні задачі:</strong> Домашні завдання з математики</li>
      <li><strong>Повсякденне життя:</strong> Розподіл частин, час, відстані</li>
    </ul>

    <p>Калькулятор автоматично спрощує результати та показує покрокові розв'язання. Ідеально підходить для учнів 5-9 класів і всіх, хто працює з дробами! 📚</p>
scripts:
  - /assets/js/fractions.js
faq:
  - question: Як додавати дроби з різними знаменниками?
    answer: "Щоб додати дроби з різними знаменниками, спочатку потрібно звести їх до спільного знаменника. Знаходимо НСК (найменше спільне кратне) знаменників, приводимо обидва дроби до цього знаменника, а потім додаємо чисельники."
  - question: Як помножити дріб на дріб?
    answer: "Щоб помножити дроби, множимо чисельник першого дробу на чисельник другого, а знаменник першого на знаменник другого. Формула: (a/b) × (c/d) = (a×c)/(b×d)."
  - question: Як поділити один дріб на інший?
    answer: "Щоб поділити дроби, множимо перший дріб на обернений до другого. Формула: (a/b) ÷ (c/d) = (a/b) × (d/c) = (a×d)/(b×c)."
  - question: Що таке мішане число?
    answer: "Мішане число — це запис дробу у вигляді цілої частини та правильного дробу. Наприклад, 2¾ = 2 + 3/4. Неправильний дріб 11/4 можна записати як мішане число 2¾."
  - question: Як спростити дріб?
    answer: "Щоб спростити дріб, потрібно поділити чисельник і знаменник на їх найбільший спільний дільник (НСД). Наприклад, 8/12 = (8÷4)/(12÷4) = 2/3."
  - question: Коли дріб вважається правильним?
    answer: "Дріб називається правильним, якщо чисельник менший за знаменник (наприклад, 3/5). Якщо чисельник більший або дорівнює знаменнику, дріб називається неправильним (наприклад, 7/4)."
  - question: Чи можна виконувати операції з мішаними числами?
    answer: "Так, але зазвичай мішані числа спочатку перетворюють у неправильні дроби, виконують операції, а потім результат знову записують як мішане число, якщо потрібно."
---

<div class="calculator-form">
  <h3>🔢 Оберіть операцію з дробами</h3>
  
  <div class="operation-selector">
    <label class="operation-option">
      <input type="radio" name="operation" value="add" checked>
      <span class="operation-label">➕ Додавання</span>
    </label>
    <label class="operation-option">
      <input type="radio" name="operation" value="subtract">
      <span class="operation-label">➖ Віднімання</span>
    </label>
    <label class="operation-option">
      <input type="radio" name="operation" value="multiply">
      <span class="operation-label">✖️ Множення</span>
    </label>
    <label class="operation-option">
      <input type="radio" name="operation" value="divide">
      <span class="operation-label">➗ Ділення</span>
    </label>
  </div>

  <div class="fractions-input">
    <div class="fraction-group">
      <h4>Перший дріб</h4>
      <div class="fraction-input">
        <input type="number" id="num1" placeholder="Чисельник" value="1">
        <span class="fraction-line">/</span>
        <input type="number" id="den1" placeholder="Знаменник" value="2" min="1">
      </div>
    </div>

    <div class="operation-display" id="operation-symbol">+</div>

    <div class="fraction-group">
      <h4>Другий дріб</h4>
      <div class="fraction-input">
        <input type="number" id="num2" placeholder="Чисельник" value="1">
        <span class="fraction-line">/</span>
        <input type="number" id="den2" placeholder="Знаменник" value="3" min="1">
      </div>
    </div>
  </div>

  <button type="button" id="calculate-btn" class="calculate-button">
    Розрахувати 🧮
  </button>
</div>

<!--CHART_SPLIT-->

<div id="result-section" class="result-section" style="display: none;">
  <div class="insight-card success">
    <h6>📊 Результат обчислення</h6>
    <div class="big-number" id="result-display">—</div>
    <div class="result-breakdown" id="result-breakdown"></div>
  </div>

  <div class="calculation-steps" id="calculation-steps" style="display: none;">
    <h4>📝 Покрокове розв'язання</h4>
    <div class="steps-content" id="steps-content"></div>
  </div>

  <div class="additional-info">
    <div class="insight-card info">
      <h6>🔄 Спрощений результат</h6>
      <div class="result-value" id="simplified-result">—</div>
    </div>
    
    <div class="insight-card warning">
      <h6>🔢 Десятковий еквівалент</h6>
      <div class="result-value" id="decimal-result">—</div>
    </div>
  </div>
</div>

<style>
.calculator-form {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: var(--radius);
  margin-bottom: 2rem;
}

.operation-selector {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.operation-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  transition: all var(--transition);
  background: white;
}

.operation-option:hover {
  border-color: var(--accent);
  background: var(--accent);
  color: white;
}

.operation-option input[type="radio"] {
  margin: 0;
}

.operation-option input[type="radio"]:checked + .operation-label {
  font-weight: 600;
}

.operation-option:has(input[type="radio"]:checked) {
  border-color: var(--accent);
  background: var(--accent);
  color: white;
}

.fractions-input {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.fraction-group {
  text-align: center;
}

.fraction-group h4 {
  margin: 0 0 1rem 0;
  color: var(--main-color);
  font-size: 1rem;
}

.fraction-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.fraction-input input {
  width: 80px;
  padding: 0.75rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;
}

.fraction-line {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--main-color);
}

.operation-display {
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent);
  padding: 1rem;
  background: white;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--accent);
}

.calculate-button {
  background: var(--accent);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: var(--radius);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition);
  width: 100%;
}

.calculate-button:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.result-section {
  margin-top: 2rem;
}

.additional-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.calculation-steps {
  background: white;
  padding: 1.5rem;
  border-radius: var(--radius);
  border: 2px solid var(--border);
  margin-top: 1.5rem;
}

.calculation-steps h4 {
  margin: 0 0 1rem 0;
  color: var(--main-color);
}

.steps-content {
  line-height: 1.6;
}

.step {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: var(--card-bg);
  border-radius: 8px;
}

.result-breakdown {
  margin-top: 1rem;
  font-size: 1rem;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .fractions-input {
    flex-direction: column;
    gap: 1rem;
  }
  
  .operation-selector {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>