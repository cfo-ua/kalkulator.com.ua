---
layout: calculator
title: "Конвертер систем числення (2, 8, 10, 16)"
categories: [school]
seo:
  title: "Конвертер систем числення – двійкова, вісімкова, десяткова, шістнадцяткова | kalkulator.com.ua"
  description: "Швидко конвертуйте числа між двійковою, вісімковою, десятковою та шістнадцятковою системами числення. Підтримка знакових чисел і доповнення до двох."
  keywords:
    - конвертер систем числення
    - двійкова система
    - вісімкова система
    - десяткова система
    - шістнадцяткова система
    - доповнення до двох
    - знакові числа
    - програмування
    - інформатика
    - шкільний калькулятор
  content: |
    <h2>🔢 Конвертер систем числення</h2>
    <p>Потужний інструмент для швидкого перетворення чисел між різними системами числення. Підтримує двійкову (BIN), вісімкову (OCT), десяткову (DEC) та шістнадцяткову (HEX) системи з можливістю роботи зі знаковими числами.</p>
    
    <h3>🎯 Особливості калькулятора:</h3>
    <ul>
      <li>✅ Миттєве перетворення між 4 системами числення</li>
      <li>✅ Підтримка знакових і беззнакових чисел</li>
      <li>✅ Режим доповнення до двох (Two's complement)</li>
      <li>✅ Автоматична валідація введених значень</li>
      <li>✅ Детальні пояснення результатів</li>
    </ul>
scripts:
  - /assets/js/base-converter.js
faq:
  - question: Що таке система числення?
    answer: "Система числення — це спосіб запису чисел за допомогою певного набору символів. Найпоширеніші: двійкова (0,1), вісімкова (0-7), десяткова (0-9), шістнадцяткова (0-9, A-F)."
  - question: Де використовується двійкова система?
    answer: "Двійкова система є основою всіх комп'ютерних обчислень. Кожен біт може мати значення 0 або 1, що відповідає станам 'вимкнено' або 'увімкнено' в електронних схемах."
  - question: Що таке доповнення до двох?
    answer: "Доповнення до двох — це метод представлення від'ємних чисел у двійковій системі. Воно дозволяє використовувати одні й ті ж операції для додавання і віднімання."
  - question: Як працює шістнадцяткова система?
    answer: "Шістнадцяткова система використовує 16 символів: цифри 0-9 та літери A-F (A=10, B=11, C=12, D=13, E=14, F=15). Часто використовується в програмуванні для коротшого запису двійкових чисел."
  - question: Чому вісімкова система була популярною?
    answer: "Вісімкова система зручна тим, що кожна вісімкова цифра точно відповідає трьом двійковим бітам, що робило її зручною для роботи з ранніми комп'ютерами."
---

<div class="calculator-container">
  <form id="base-converter-form">
    <div class="input-group">
      <label for="bc-decimal">🔟 Десяткова (DEC):</label>
      <input type="text" id="bc-decimal" placeholder="Введіть число, наприклад: 255">
    </div>
    
    <div class="input-group">
      <label for="bc-binary">💻 Двійкова (BIN):</label>
      <input type="text" id="bc-binary" placeholder="Введіть двійкове число, наприклад: 11111111">
    </div>
    
    <div class="input-group">
      <label for="bc-octal">🔢 Вісімкова (OCT):</label>
      <input type="text" id="bc-octal" placeholder="Введіть вісімкове число, наприклад: 377">
    </div>
    
    <div class="input-group">
      <label for="bc-hex">🔠 Шістнадцяткова (HEX):</label>
      <input type="text" id="bc-hex" placeholder="Введіть HEX число, наприклад: FF">
    </div>
    
    <div class="options-group">
      <div class="option-item">
        <label>
          <input type="checkbox" id="bc-signed"> 
          ➕➖ Знакові числа
        </label>
      </div>
      
      <div class="option-item">
        <label>
          <input type="checkbox" id="bc-twos-complement"> 
          🔄 Доповнення до двох
        </label>
      </div>
      
      <div class="option-item">
        <label for="bc-bit-width">📏 Розрядність:</label>
        <select id="bc-bit-width">
          <option value="8">8 біт</option>
          <option value="16">16 біт</option>
          <option value="32" selected>32 біти</option>
          <option value="64">64 біти</option>
        </select>
      </div>
    </div>
    
    <button type="button" id="bc-convert" class="btn-primary">🔄 Конвертувати</button>
    <button type="button" id="bc-clear" class="btn-secondary">🗑️ Очистити</button>
  </form>
</div>

<!--CHART_SPLIT-->

<div id="base-converter-result" class="result-section"></div>

<div class="info-section">
  <h3>📚 Корисна інформація</h3>
  
  <div class="insight-cards">
    <div class="insight-card info">
      <h6>💡 Швидкі степені 2</h6>
      <div class="small-text">
        2¹ = 2, 2² = 4, 2³ = 8<br>
        2⁴ = 16, 2⁵ = 32, 2⁶ = 64<br>
        2⁷ = 128, 2⁸ = 256, 2⁹ = 512<br>
        2¹⁰ = 1024 (1K)
      </div>
    </div>
    
    <div class="insight-card success">
      <h6>🎯 HEX літери</h6>
      <div class="small-text">
        A = 10, B = 11, C = 12<br>
        D = 13, E = 14, F = 15<br>
        Завжди використовуйте<br>
        великі літери A-F
      </div>
    </div>
    
    <div class="insight-card warning">
      <h6>⚠️ Межі значень</h6>
      <div class="small-text">
        8-біт: 0 до 255<br>
        16-біт: 0 до 65,535<br>
        32-біт: 0 до 4,294,967,295<br>
        Знакові: половина для від'ємних
      </div>
    </div>
  </div>
  
  <div class="conversion-examples">
    <h4>🔄 Приклади конверсії</h4>
    <div class="example-grid">
      <div class="example-item">
        <strong>Число 42:</strong><br>
        DEC: 42<br>
        BIN: 101010<br>
        OCT: 52<br>
        HEX: 2A
      </div>
      <div class="example-item">
        <strong>Число 255:</strong><br>
        DEC: 255<br>
        BIN: 11111111<br>
        OCT: 377<br>
        HEX: FF
      </div>
    </div>
  </div>
</div>