---
layout: calculator
title: "Калькулятор наукової нотації"
categories: [school]
seo:
  title: "Калькулятор наукової нотації онлайн — перевести в експоненціальну форму"
  description: "Перетворюйте числа в наукову нотацію та навпаки онлайн. Калькулятор підтримує експоненціальну форму, значущі цифри та математичні операції."
  keywords:
    - наукова нотація
    - експоненціальна форма
    - scientific notation
    - стандартний вигляд
    - степінь десяти
    - мантиса
    - експонента
    - великі числа
    - малі числа
    - наукові обчислення
    - фізика
    - астрономія
    - хімія
  content: |
    <h2>Калькулятор наукової нотації онлайн</h2>
    <p>Наукова нотація (експоненціальна форма) — це спосіб запису чисел у вигляді a × 10<sup>n</sup>, де 1 ≤ |a| < 10. Це зручно для роботи з дуже великими або дуже малими числами.</p>

    <h3>Структура наукової нотації:</h3>
    <ul>
      <li><strong>Мантиса (a):</strong> число від 1 до 10 (не включаючи 10)</li>
      <li><strong>Основа:</strong> завжди 10</li>
      <li><strong>Експонента (n):</strong> ціле число (степінь десяти)</li>
    </ul>

    <h3>Приклади наукової нотації:</h3>
    <ul>
      <li><strong>Великі числа:</strong> 300,000,000 = 3.0 × 10<sup>8</sup></li>
      <li><strong>Малі числа:</strong> 0.0000025 = 2.5 × 10<sup>-6</sup></li>
      <li><strong>Звичайні числа:</strong> 123.45 = 1.2345 × 10<sup>2</sup></li>
    </ul>

    <h3>Де використовується наукова нотація:</h3>
    <ul>
      <li><strong>Астрономія:</strong> відстані між планетами, розміри зірок</li>
      <li><strong>Фізика:</strong> швидкість світла, маса електрона</li>
      <li><strong>Хімія:</strong> кількість молекул, число Авогадро</li>
      <li><strong>Інженерія:</strong> розрахунки з екстремальними значеннями</li>
      <li><strong>Медицина:</strong> концентрації речовин, дозування</li>
    </ul>

    <h3>Переваги наукової нотації:</h3>
    <ul>
      <li>Компактний запис великих та малих чисел</li>
      <li>Легке порівняння порядків величин</li>
      <li>Спрощення обчислень з експонентами</li>
      <li>Точне представлення значущих цифр</li>
    </ul>

    <p>Інструмент незамінний для студентів, науковців, інженерів та всіх, хто працює з числами різних порядків величин.</p>
scripts:
  - /assets/js/scientific-notation-calculator.js
faq:
  - question: Що таке наукова нотація?
    answer: "Наукова нотація — це спосіб запису чисел у формі a × 10^n, де 1 ≤ |a| < 10. Вона спрощує роботу з дуже великими або малими числами."
  - question: Як перетворити звичайне число в наукову нотацію?
    answer: "Перемістіть кому так, щоб перед нею була одна ненульова цифра. Кількість позицій — це експонента. Вправо — додатна, вліво — від'ємна."
  - question: Чи можна множити числа в науковій нотації?
    answer: "Так! Множте мантиси і додавайте експоненти: (2×10³) × (3×10⁵) = 6×10⁸."
  - question: Як ділити числа в науковій нотації?
    answer: "Діліть мантиси і віднімайте експоненти: (6×10⁸) ÷ (2×10³) = 3×10⁵."
  - question: Що означає експонента в науковій нотації?
    answer: "Експонента показує, на скільки позицій і в який бік перемістити кому. Додатна — вправо (більше число), від'ємна — вліво (менше число)."
  - question: Чи є обмеження для мантиси?
    answer: "Так, мантиса має бути від 1 (включно) до 10 (не включаючи). Наприклад: 1.5, 9.99, але не 0.5 або 12.3."
---
<div class="calculator-modes">
  <button id="to-scientific" class="mode-btn active">До наукової нотації</button>
  <button id="from-scientific" class="mode-btn">З наукової нотації</button>
  <button id="operations" class="mode-btn">Операції</button>
</div>

<form id="scientific-form" autocomplete="off">
  <!-- Mode 1: Convert to scientific notation -->
  <div id="to-scientific-mode" class="mode-section">
    <div class="input-group">
      <label>
        Звичайне число:
        <input type="text" id="regular-number" placeholder="Наприклад: 123456789" required>
      </label>
    </div>
    <div class="input-group">
      <label>
        Кількість значущих цифр:
        <input type="number" id="sig-figs" placeholder="Наприклад: 3" min="1" max="15" value="6">
      </label>
    </div>
  </div>

  <!-- Mode 2: Convert from scientific notation -->
  <div id="from-scientific-mode" class="mode-section" style="display: none;">
    <div class="input-group">
      <label>
        Мантиса:
        <input type="number" id="mantissa" placeholder="1.23" min="1" max="9.999" step="any">
      </label>
    </div>
    <div class="input-group">
      <label>
        Експонента:
        <input type="number" id="exponent" placeholder="5" step="1">
      </label>
    </div>
  </div>

  <!-- Mode 3: Operations -->
  <div id="operations-mode" class="mode-section" style="display: none;">
    <div class="input-group">
      <label>
        Перше число (a × 10^n):
        <input type="text" id="num1" placeholder="2.5e3 або 2.5×10^3">
      </label>
    </div>
    <div class="input-group">
      <label>
        Операція:
        <select id="operation">
          <option value="multiply">Множення (×)</option>
          <option value="divide">Ділення (÷)</option>
          <option value="add">Додавання (+)</option>
          <option value="subtract">Віднімання (-)</option>
        </select>
      </label>
    </div>
    <div class="input-group">
      <label>
        Друге число (b × 10^m):
        <input type="text" id="num2" placeholder="1.2e-2 або 1.2×10^-2">
      </label>
    </div>
  </div>

  <button type="submit">Розрахувати</button>
</form>

<div id="scientific-result" class="result"></div>