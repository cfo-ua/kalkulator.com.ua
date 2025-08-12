---
layout: calculator
title: "Розв'язувач диференціальних рівнянь"
categories: [school]
seo:
  title: "Розв'язувач диференціальних рівнянь онлайн — dy/dx = f(x,y)"
  description: "Розв'яжіть диференціальні рівняння онлайн з покроковим розв'язанням. Підтримка рівнянь з відокремлюваними змінними, лінійних та однорідних рівнянь."
  keywords:
    - диференціальні рівняння
    - розв'язувач рівнянь
    - диф рівняння онлайн
    - розв'язати рівняння
    - математика
    - математичний аналіз
    - школа
    - студент
    - вища математика
    - відокремлювані змінні
    - лінійні рівняння
    - однорідні рівняння
    - загальний розв'язок
    - частинний розв'язок
    - початкові умови
  content: |
    <h2>Розв'язувач диференціальних рівнянь — знайти розв'язок dy/dx = f(x,y)</h2>
    <p>Цей <strong>онлайн розв'язувач диференціальних рівнянь</strong> допомагає швидко знайти розв'язки різних типів диференціальних рівнянь з покроковими поясненнями та графічною візуалізацією.</p>
    
    <h3>Що таке диференціальне рівняння?</h3>
    <p>Диференціальне рівняння — це рівняння, що містить функцію та її похідні. Основна форма: dy/dx = f(x,y), де потрібно знайти функцію y(x).</p>
    
    <h3>Типи диференціальних рівнянь</h3>
    <ul>
      <li><strong>З відокремлюваними змінними:</strong> dy/dx = g(x)h(y)</li>
      <li><strong>Лінійні рівняння:</strong> dy/dx + P(x)y = Q(x)</li>
      <li><strong>Однорідні рівняння:</strong> dy/dx = f(y/x)</li>
      <li><strong>Рівняння Бернуллі:</strong> dy/dx + P(x)y = Q(x)y^n</li>
    </ul>
    
    <h3>Застосування диференціальних рівнянь</h3>
    <ul>
      <li><strong>Фізика:</strong> рух тіл, коливання, радіоактивний розпад</li>
      <li><strong>Біологія:</strong> зростання популяцій, поширення епідемій</li>
      <li><strong>Економіка:</strong> моделі зростання, інфляція</li>
      <li><strong>Інженерія:</strong> електричні кола, теплопередача</li>
      <li><strong>Хімія:</strong> швидкість реакцій, кінетика</li>
    </ul>
    
    <h3>Як користуватися розв'язувачем?</h3>
    <ol>
      <li>Введіть диференціальне рівняння в стандартній формі</li>
      <li>Оберіть тип рівняння (або автоматичне визначення)</li>
      <li>За потреби вкажіть початкові умови</li>
      <li>Натисніть "Розв'язати рівняння"</li>
      <li>Отримайте загальний та частинний розв'язки</li>
    </ol>
    
    <p><strong>Приклади:</strong> dy/dx = 2*x, dy/dx = y, dy/dx = x/y, dy/dx + y = x</p>
scripts:
  - https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.11.0/math.min.js
  - https://cdn.plot.ly/plotly-latest.min.js
  - /js/differential-equation.js
faq:
  - question: "Що таке диференціальне рівняння?"
    answer: "Диференціальне рівняння — це математичне рівняння, яке зв'язує функцію з її похідними. Воно описує, як змінюється функція залежно від її поточного значення та змінної."
  - question: "Яка різниця між загальним та частинним розв'язком?"
    answer: "Загальний розв'язок містить довільні константи і описує всі можливі розв'язки. Частинний розв'язок отримується із загального при заданих початкових умовах."
  - question: "Що таке початкові умови?"
    answer: "Початкові умови — це значення функції та/або її похідних в певній точці. Наприклад, y(0) = 1 означає, що при x = 0 функція y дорівнює 1."
  - question: "Які типи рівнянь підтримуються?"
    answer: "Підтримуються: рівняння з відокремлюваними змінними, лінійні рівняння першого порядку, однорідні рівняння, деякі типи рівнянь Бернуллі та інші базові форми."
  - question: "Чи можна побудувати графік розв'язку?"
    answer: "Так! Калькулятор автоматично будує графік розв'язку (якщо можливо) та поле напрямків для візуального представлення рівняння."
---

<div class="calculator-container">
  <form id="de-form" autocomplete="off">
    <div class="input-group">
      <label for="equation">Диференціальне рівняння:</label>
      <input type="text" id="equation" placeholder="Наприклад: dy/dx = 2*x або dy/dx + y = x" value="dy/dx = 2*x" required>
      <small>Формат: dy/dx = вираз або dy/dx + вираз = вираз</small>
    </div>
    
    <div class="input-group">
      <label for="equation-type">Тип рівняння:</label>
      <select id="equation-type">
        <option value="auto">Автоматичне визначення</option>
        <option value="separable">З відокремлюваними змінними</option>
        <option value="linear">Лінійне першого порядку</option>
        <option value="homogeneous">Однорідне</option>
        <option value="exact">Рівняння в повних диференціалах</option>
      </select>
    </div>
    
    <div class="initial-conditions">
      <h3>Початкові умови (опціонально)</h3>
      <div class="condition-group">
        <label for="x0">x₀:</label>
        <input type="number" id="x0" placeholder="0" step="any">
        <label for="y0">y₀:</label>
        <input type="number" id="y0" placeholder="1" step="any">
      </div>
    </div>
    
    <div class="advanced-options">
      <div class="checkbox-group">
        <input type="checkbox" id="show-solution-steps" checked>
        <label for="show-solution-steps">Показати кроки розв'язання</label>
      </div>
      
      <div class="checkbox-group">
        <input type="checkbox" id="plot-solution" checked>
        <label for="plot-solution">Побудувати графік розв'язку</label>
      </div>
      
      <div class="checkbox-group">
        <input type="checkbox" id="direction-field">
        <label for="direction-field">Показати поле напрямків</label>
      </div>
    </div>
    
    <button type="submit">🔬 Розв'язати рівняння</button>
  </form>
  
  <div id="de-result" class="result"></div>
  <div id="de-plot" class="plot-container"></div>
</div>