---
layout: calculator
title: "Генератор випадкових дат — Рандомні дати онлайн"
categories: [entertainment]
seo:
  title: "Генератор випадкових дат — Рандомні дати онлайн"
  description: "Генеруйте випадкові дати в різних форматах для тестування, розробки та інших потреб. Налаштування діапазону років та форматів дат."
  keywords:
    - генератор випадкових дат
    - рандомні дати
    - випадкові дати онлайн
    - генератор дат
    - тестові дати
    - рандом дат
    - генератор часу
    - випадкові роки
    - дати для тестування
    - генератор дня народження
    - рандомні дні
    - випадкові місяці
    - генератор календарних дат
    - тестування дат
    - фейкові дати
    - генератор періодів
    - випадковий час
    - дати розробки
    - генератор років
    - рандомні події
  content: |
    <h2>Генератор випадкових дат для будь-яких завдань</h2>
    <p>Створюйте випадкові дати в різних форматах та діапазонах для тестування програмного забезпечення, заповнення форм та навчальних проектів.</p>
    
    <h3>📅 Підтримувані формати дат</h3>
    <ul>
      <li><strong>Український:</strong> ДД.ММ.РРРР (25.12.2023)</li>
      <li><strong>Європейський:</strong> ДД/ММ/РРРР (25/12/2023)</li>
      <li><strong>Американський:</strong> ММ/ДД/РРРР (12/25/2023)</li>
      <li><strong>ISO 8601:</strong> РРРР-ММ-ДД (2023-12-25)</li>
      <li><strong>Повний текст:</strong> 25 грудня 2023 року</li>
      <li><strong>З часом:</strong> 25.12.2023 14:30:15</li>
    </ul>
    
    <h3>🎯 Коли використовувати генератор дат?</h3>
    <ul>
      <li><strong>Тестування ПЗ:</strong> Заповнення полів дат у формах</li>
      <li><strong>Розробка:</strong> Тестові дані для баз даних</li>
      <li><strong>Історичні дослідження:</strong> Випадкові дати з минулого</li>
      <li><strong>Планування:</strong> Генерація майбутніх дат</li>
      <li><strong>Освіта:</strong> Приклади для навчальних завдань</li>
      <li><strong>Аналітика:</strong> Тестування часових рядів</li>
    </ul>

    <h3>⚡ Переваги генератора</h3>
    <ul>
      <li><strong>Гнучкість:</strong> Налаштування діапазону років</li>
      <li><strong>Формати:</strong> Різні стилі відображення дат</li>
      <li><strong>Валідність:</strong> Лише реальні дати (враховує високосні роки)</li>
      <li><strong>Зручність:</strong> Копіювання одним кліком</li>
      <li><strong>Історія:</strong> Збереження згенерованих дат</li>
      <li><strong>Множинна генерація:</strong> Створення декількох дат одразу</li>
    </ul>

    <h3>📊 Спеціальні налаштування</h3>
    <ul>
      <li><strong>Діапазон років:</strong> Від 1900 до 2100 року</li>
      <li><strong>Робочі дні:</strong> Тільки будні (понеділок-п'ятниця)</li>
      <li><strong>Вихідні:</strong> Тільки субота та неділя</li>
      <li><strong>Історичні дати:</strong> Тільки минулі дати</li>
      <li><strong>Майбутні дати:</strong> Тільки прийдешні дати</li>
    </ul>
scripts:
  - /js/random-date-generator.js
faq:
  - question: Чи враховує генератор високосні роки?
    answer: "Так, генератор автоматично враховує високосні роки та генерує лише валідні дати, включаючи 29 лютого у високосних роках."
  - question: Які діапазони років підтримуються?
    answer: "Ви можете генерувати дати від 1900 до 2100 року або обрати власний діапазон у цих межах."
  - question: Чи можна генерувати тільки робочі дні?
    answer: "Так, є опція генерації тільки робочих днів (понеділок-п'ятниця) або тільки вихідних (субота-неділя)."
  - question: Скільки дат можна згенерувати одразу?
    answer: "Ви можете згенерувати від 1 до 100 дат одночасно."
  - question: Чи зберігається історія згенерованих дат?
    answer: "Так, останні 50 генерацій зберігаються в локальній історії браузера."
  - question: Чи можна генерувати дати з конкретного періоду?
    answer: "Так, ви можете встановити початкову та кінцеву дати для генерації в межах обраного періоду."
---

<div class="calculator-container">
  <div class="calculator-form">
    <h4>⚙️ Налаштування генератора</h4>
    
    <div class="input-row">
      <div class="input-group">
        <label for="dateFormat">📅 Формат дати:</label>
        <select id="dateFormat">
          <option value="dd.mm.yyyy">Український (ДД.ММ.РРРР)</option>
          <option value="dd/mm/yyyy">Європейський (ДД/ММ/РРРР)</option>
          <option value="mm/dd/yyyy">Американський (ММ/ДД/РРРР)</option>
          <option value="yyyy-mm-dd">ISO 8601 (РРРР-ММ-ДД)</option>
          <option value="full-text">Повний текст</option>
          <option value="with-time">З часом</option>
        </select>
      </div>
      
      <div class="input-group">
        <label for="dateCount">🔢 Кількість дат:</label>
        <input type="number" id="dateCount" value="1" min="1" max="100">
      </div>
    </div>
    
    <div class="input-row">
      <div class="input-group">
        <label for="startYear">📈 Початковий рік:</label>
        <input type="number" id="startYear" value="1990" min="1900" max="2100">
      </div>
      
      <div class="input-group">
        <label for="endYear">📉 Кінцевий рік:</label>
        <input type="number" id="endYear" value="2024" min="1900" max="2100">
      </div>
    </div>
    
    <div class="input-row">
      <div class="input-group">
        <label for="dateFilter">🗓️ Фільтр днів:</label>
        <select id="dateFilter">
          <option value="all">Всі дні</option>
          <option value="weekdays">Тільки робочі дні</option>
          <option value="weekends">Тільки вихідні</option>
          <option value="past">Тільки минулі дати</option>
          <option value="future">Тільки майбутні дати</option>
        </select>
      </div>
      
      <div class="input-group">
        <label for="includeTime">
          <input type="checkbox" id="includeTime"> 
          🕒 Включати час
        </label>
      </div>
    </div>
    
    <div class="convert-buttons">
      <button id="generateDates" class="primary-btn">📅 Генерувати дати</button>
      <button id="copyAllDates" class="secondary-btn">📋 Копіювати всі</button>
      <button id="clearDateHistory" class="danger-btn">🗑️ Очистити історію</button>
    </div>
  </div>

  <div id="dateResult" class="result-section" style="display: none;">
    <h4>📅 Згенеровані дати</h4>
    <div id="generatedDates" class="generated-codes"></div>
    <div id="dateGenerationInfo" class="generation-info"></div>
  </div>

  <div id="dateHistorySection" class="history-section" style="display: none;">
    <h4>📝 Історія генерації</h4>
    <div id="dateHistoryList" class="history-list"></div>
  </div>
</div>