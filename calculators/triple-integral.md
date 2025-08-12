---
layout: calculator
title: "Калькулятор потрійного інтеграла"
categories: [school]
seo:
  title: "Калькулятор потрійного інтеграла онлайн — обчислити ∫∫∫ f(x,y,z) dxdydz"
  description: "Обчисліть потрійний інтеграл онлайн з заданими межами інтегрування. Підтримка складних функцій, автоматичне обчислення об'ємів тіл та інтегралів по областях."
  keywords:
    - потрійний інтеграл
    - калькулятор інтеграла
    - обчислити інтеграл
    - інтеграл онлайн
    - об'єм тіла
    - межі інтегрування
    - математика
    - математичний аналіз
    - інтегральне числення
    - школа
    - студент
    - вища математика
    - аналітична геометрія
    - функція трьох змінних
    - кратний інтеграл
  content: |
    <h2>Калькулятор потрійного інтеграла — швидке обчислення ∫∫∫ f(x,y,z) dxdydz</h2>
    <p>Цей <strong>онлайн калькулятор потрійного інтеграла</strong> дозволяє швидко та точно обчислити потрійні інтеграли з заданими межами інтегрування. Підтримує складні функції та автоматично обчислює результат.</p>
    
    <h3>Що таке потрійний інтеграл?</h3>
    <p>Потрійний інтеграл ∫∫∫ f(x,y,z) dxdydz — це інтеграл функції трьох змінних по тривимірній області. Використовується для обчислення об'ємів тіл, мас, центрів мас та інших фізичних величин.</p>
    
    <h3>Застосування потрійних інтегралів</h3>
    <ul>
      <li><strong>Обчислення об'ємів</strong> складних геометричних тіл</li>
      <li><strong>Знаходження маси</strong> тіла зі змінною щільністю</li>
      <li><strong>Центр мас</strong> та моменти інерції</li>
      <li><strong>Фізичні задачі</strong> — електричне поле, гравітація</li>
      <li><strong>Інженерні розрахунки</strong> в механіці та термодинаміці</li>
    </ul>
    
    <h3>Як користуватися калькулятором?</h3>
    <ol>
      <li>Введіть функцію f(x,y,z) для інтегрування</li>
      <li>Вкажіть межі інтегрування для кожної змінної</li>
      <li>Натисніть "Обчислити інтеграл"</li>
      <li>Отримайте результат з поясненнями</li>
    </ol>
    
    <p><strong>Приклади функцій:</strong> x*y*z, x^2 + y^2 + z^2, sin(x)*cos(y)*z, sqrt(x^2 + y^2)</p>
scripts:
  - https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.11.0/math.min.js
  - /js/triple-integral.js
faq:
  - question: "Що таке потрійний інтеграл?"
    answer: "Потрійний інтеграл — це інтеграл функції трьох змінних f(x,y,z) по тривимірній області. Записується як ∫∫∫ f(x,y,z) dxdydz і використовується для обчислення об'ємів, мас та інших характеристик тривимірних об'єктів."
  - question: "Як задавати межі інтегрування?"
    answer: "Межі інтегрування задаються для кожної змінної окремо. Можуть бути константами (наприклад, від 0 до 1) або функціями від інших змінних (наприклад, від 0 до x для y)."
  - question: "Які функції підтримуються?"
    answer: "Підтримуються: поліноми (x^2, y^3), тригонометричні функції (sin, cos, tan), експоненти (e^x), логарифми (ln, log), квадратні корені (sqrt), комбінації функцій."
  - question: "Для чого використовуються потрійні інтеграли?"
    answer: "Основні застосування: обчислення об'ємів складних тіл, знаходження маси тіла зі змінною щільністю, центр мас, моменти інерції, електричні та магнітні поля, теплопровідність."
  - question: "Чи можна обчислити об'єм за допомогою потрійного інтеграла?"
    answer: "Так! Об'єм тіла V обчислюється як ∫∫∫ 1 dxdydz по області, яку займає тіло. Просто введіть функцію 1 та задайте межі області."
---

<div class="calculator-container">
  <form id="triple-integral-form" autocomplete="off">
    <div class="input-group">
      <label for="function">Функція f(x,y,z):</label>
      <input type="text" id="function" placeholder="Наприклад: x*y*z або x^2 + y^2 + z^2" value="x*y*z" required>
    </div>
    
    <div class="bounds-section">
      <h3>Межі інтегрування</h3>
      <div class="bounds-grid">
        <div class="bound-group">
          <label>Змінна x:</label>
          <input type="text" id="x-lower" placeholder="Нижня межа" value="0" required>
          <span>до</span>
          <input type="text" id="x-upper" placeholder="Верхня межа" value="1" required>
        </div>
        
        <div class="bound-group">
          <label>Змінна y:</label>
          <input type="text" id="y-lower" placeholder="Нижня межа" value="0" required>
          <span>до</span>
          <input type="text" id="y-upper" placeholder="Верхня межа" value="1" required>
        </div>
        
        <div class="bound-group">
          <label>Змінна z:</label>
          <input type="text" id="z-lower" placeholder="Нижня межа" value="0" required>
          <span>до</span>
          <input type="text" id="z-upper" placeholder="Верхня межа" value="1" required>
        </div>
      </div>
    </div>
    
    <div class="advanced-options">
      <label for="precision">Точність обчислення:</label>
      <select id="precision">
        <option value="10">Низька (швидко)</option>
        <option value="20" selected>Середня</option>
        <option value="50">Висока (повільно)</option>
      </select>
    </div>
    
    <button type="submit">🧮 Обчислити потрійний інтеграл</button>
  </form>
  
  <div id="triple-integral-result" class="result"></div>
</div>