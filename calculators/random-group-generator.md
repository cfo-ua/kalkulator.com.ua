---
layout: calculator
title: "Генератор випадкових груп — розподіл на команди онлайн"
categories: [entertainment]
seo:
  title: "Генератор випадкових груп — розподіл на команди онлайн"
  description: "Розподіліть учасників на випадкові групи та команди. Генератор груп для класу, команди, заходів. Справедливий розподіл людей по групах."
  keywords:
    - генератор випадкових груп
    - розподіл на команди
    - генератор команд
    - випадкові групи онлайн
    - розподіл учасників
    - генератор груп для класу
    - команди для гри
    - розподіл на групи
    - випадковий розподіл
    - генератор команд українською
    - онлайн розподіл груп
    - генератор для вчителів
    - розподіл студентів
    - випадкові команди
    - групи для проекту
    - розподіл працівників
    - команди для змагань
    - справедливий розподіл
    - генератор груп школа
    - розподіл дітей на команди
    - випадкові пари
    - групи для навчання
    - розподіл по командах
    - генератор команд спорт
    - розподіл на пари
    - випадкові групи учнів
    - команди для активностей
    - розподіл учасників заходу
    - генератор груп безкоштовно
  content: |
    <h2>👥 Справедливий розподіл на групи</h2>
    <p>Наш генератор випадкових груп допоможе швидко та справедливо розподілити будь-яку кількість учасників на команди чи групи. Ідеально підходить для навчання, ігор, проектів та заходів.</p>
    
    <h3>🎯 Для чого використовувати генератор груп?</h3>
    <ul>
      <li><strong>Освіта:</strong> Розподіл учнів на групи для проектів та вправ</li>
      <li><strong>Спорт:</strong> Формування команд для змагань та ігор</li>
      <li><strong>Робота:</strong> Створення проектних груп та робочих команд</li>
      <li><strong>Заходи:</strong> Організація активностей та конкурсів</li>
      <li><strong>Ігри:</strong> Розподіл гравців на команди</li>
      <li><strong>Тренінги:</strong> Формування груп для групових вправ</li>
    </ul>
    
    <h3>⚡ Переваги випадкового розподілу</h3>
    <ul>
      <li><strong>Справедливість:</strong> Усуває упередження та фаворитизм</li>
      <li><strong>Економія часу:</strong> Миттєвий розподіл замість тривалого вибору</li>
      <li><strong>Нові знайомства:</strong> Учасники працюють з різними людьми</li>
      <li><strong>Рівні умови:</strong> Збалансовані групи без домовленостей</li>
      <li><strong>Мотивація:</strong> Елемент несподіванки підвищує інтерес</li>
    </ul>
    
    <h3>🛠️ Налаштування генератора</h3>
    <ul>
      <li>Додайте список учасників (по одному в рядку)</li>
      <li>Оберіть кількість груп або розмір кожної групи</li>
      <li>Натисніть кнопку для генерації</li>
      <li>Отримайте справедливий розподіл</li>
      <li>Перегенеруйте за потреби</li>
    </ul>
    
    <h3>📚 Застосування в освіті</h3>
    <p>Вчителі та викладачі використовують генератор для створення різноманітних навчальних груп, що покращує взаємодію між учнями та розвиває навички роботи в команді.</p>
    
    <h3>🏆 Спортивне використання</h3>
    <p>Тренери та організатори змагань можуть швидко сформувати збалансовані команди для турнірів, естафет та командних ігор.</p>
    
    <h3>🎲 Цікаві факти</h3>
    <ul>
      <li>Випадковий розподіл покращує соціальні навички</li>
      <li>Змішані групи показують кращі результати в творчих завданнях</li>
      <li>Справедливий розподіл підвищує довіру до процесу</li>
      <li>Випадковість допомагає уникнути конфліктів при виборі</li>
    </ul>
scripts:
  - /assets/js/random-group-generator.js
faq:
  - question: Чи можна налаштувати розмір груп?
    answer: "Так, ви можете вказати кількість груп або розмір кожної групи. Генератор автоматично розподілить учасників відповідно."
  - question: Що відбувається, якщо учасників не ділиться порівну?
    answer: "Генератор автоматично розподіляє залишкових учасників по групах так, щоб різниця в розмірах була мінімальною."
  - question: Чи зберігаються створені групи?
    answer: "Так, історія генерацій зберігається локально в браузері, тому ви можете переглянути попередні розподіли."
  - question: Чи можна виключити певних учасників з розподілу?
    answer: "Просто видаліть їх зі списку перед генерацією. Ви також можете редагувати список після створення груп."
  - question: Скільки учасників можна додати максимум?
    answer: "Немає жорстких обмежень, але для зручності рекомендуємо до 200 учасників в одній генерації."
  - question: Чи справедливий алгоритм розподілу?
    answer: "Так, ми використовуємо алгоритм випадкового перемішування, що забезпечує рівні шанси для всіх учасників."
---

<div class="group-generator-container">
  <div class="input-section">
    <div class="participants-group">
      <label for="participantsList">Список учасників (по одному в рядку):</label>
      <textarea id="participantsList" placeholder="Введіть імена учасників...&#10;Наприклад:&#10;Анна Петренко&#10;Олег Іваненко&#10;Марія Коваленко&#10;Віктор Сидоренко" rows="8"></textarea>
      <div class="participants-count">
        <span id="participantsCount">0</span> учасників
      </div>
    </div>
    
    <div class="settings-group">
      <div class="setting-option">
        <input type="radio" id="byGroups" name="splitType" value="groups" checked>
        <label for="byGroups">Кількість груп:</label>
        <input type="number" id="numGroups" min="2" max="20" value="2" class="number-input">
      </div>
      
      <div class="setting-option">
        <input type="radio" id="bySize" name="splitType" value="size">
        <label for="bySize">Розмір групи:</label>
        <input type="number" id="groupSize" min="2" max="50" value="3" class="number-input">
      </div>
    </div>
    
    <button id="generateBtn" class="generate-button">
      <span class="button-icon">🎲</span>
      <span class="button-text">Розподілити на групи</span>
    </button>
    
    <button id="shuffleBtn" class="shuffle-button" style="display: none;">
      <span class="shuffle-icon">🔄</span>
      <span>Перемішати знову</span>
    </button>
  </div>

  <div class="result-section" id="resultSection" style="display: none;">
    <h3>📋 Результат розподілу</h3>
    <div class="groups-container" id="groupsContainer"></div>
    
    <div class="result-actions">
      <button id="copyResult" class="action-button">
        <span class="action-icon">📋</span>
        <span>Копіювати результат</span>
      </button>
      <button id="printResult" class="action-button">
        <span class="action-icon">🖨️</span>
        <span>Роздрукувати</span>
      </button>
    </div>
  </div>
  
  <div class="statistics" id="statistics">
    <h3>📊 Статистика генерацій</h3>
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-number" id="totalGenerations">0</div>
        <div class="stat-label">Всього генерацій</div>
      </div>
      <div class="stat-item">
        <div class="stat-number" id="totalParticipants">0</div>
        <div class="stat-label">Учасників оброблено</div>
      </div>
      <div class="stat-item">
        <div class="stat-number" id="avgGroupSize">0</div>
        <div class="stat-label">Середній розмір групи</div>
      </div>
    </div>
    <button id="resetStats" class="reset-button">
      <span class="reset-icon">🔄</span>
      <span>Скинути статистику</span>
    </button>
  </div>
  
  <div class="history-section" id="historySection">
    <h3>📝 Історія розподілів</h3>
    <div class="history-list" id="historyList">
      <p>Історія порожня. Створіть перший розподіл!</p>
    </div>
    <button id="clearHistory" class="clear-button">
      <span class="clear-icon">🗑️</span>
      <span>Очистити історію</span>
    </button>
  </div>
</div>

<style>
.group-generator-container {
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

.participants-group {
  margin-bottom: 2rem;
}

.participants-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--main-color);
  font-size: 1.1rem;
}

.participants-group textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--border);
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 150px;
  transition: border-color var(--transition);
}

.participants-group textarea:focus {
  outline: none;
  border-color: var(--accent);
}

.participants-count {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
}

.settings-group {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.setting-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid var(--border);
  flex: 1;
  min-width: 200px;
}

.setting-option input[type="radio"] {
  width: 18px;
  height: 18px;
}

.setting-option label {
  font-weight: 600;
  color: var(--main-color);
  min-width: 120px;
}

.number-input {
  width: 80px;
  padding: 0.5rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  text-align: center;
}

.number-input:focus {
  outline: none;
  border-color: var(--accent);
}

.generate-button, .shuffle-button {
  background: linear-gradient(45deg, #28a745, #20c997);
  color: white;
  border: none;
  padding: 1.2rem 2.5rem;
  border-radius: var(--radius);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0.5rem 0.5rem 0;
  box-shadow: var(--shadow);
}

.shuffle-button {
  background: linear-gradient(45deg, #17a2b8, #6f42c1);
}

.generate-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(40, 167, 69, 0.3);
}

.shuffle-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(23, 162, 184, 0.3);
}

.generate-button:disabled, .shuffle-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.result-section {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: var(--radius);
  border: 2px solid var(--border);
  margin: 2rem 0;
}

.result-section h3 {
  margin-bottom: 1.5rem;
  color: var(--main-color);
  text-align: center;
}

.groups-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.group-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid var(--border);
  transition: all var(--transition);
}

.group-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.group-card.group-1 { border-color: #ff6b35; }
.group-card.group-2 { border-color: #4ecdc4; }
.group-card.group-3 { border-color: #45b7d1; }
.group-card.group-4 { border-color: #96ceb4; }
.group-card.group-5 { border-color: #feca57; }
.group-card.group-6 { border-color: #ff9ff3; }
.group-card.group-7 { border-color: #54a0ff; }
.group-card.group-8 { border-color: #5f27cd; }

.group-title {
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--main-color);
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.group-members {
  list-style: none;
  padding: 0;
}

.group-members li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.group-members li:last-child {
  border-bottom: none;
}

.member-icon {
  font-size: 0.8rem;
}

.result-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-button {
  background: var(--accent);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-button:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

.statistics {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: var(--radius);
  border: 2px solid var(--border);
  margin: 2rem 0;
  text-align: center;
}

.statistics h3 {
  margin-bottom: 1.5rem;
  color: var(--main-color);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: var(--accent);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.reset-button, .clear-button {
  background: #ff4757;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem;
}

.reset-button:hover, .clear-button:hover {
  background: #ff3742;
  transform: translateY(-1px);
}

.history-section {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: var(--radius);
  border: 2px solid var(--border);
  margin-top: 2rem;
}

.history-section h3 {
  margin-bottom: 1.5rem;
  color: var(--main-color);
  text-align: center;
}

.history-list {
  max-height: 400px;
  overflow-y: auto;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid var(--border);
  margin-bottom: 1rem;
}

.history-item {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  transition: background var(--transition);
}

.history-item:hover {
  background: #f8f9fa;
}

.history-item:last-child {
  border-bottom: none;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.history-title {
  font-weight: 600;
  color: var(--main-color);
}

.history-time {
  font-size: 0.8rem;
  color: #999;
}

.history-summary {
  font-size: 0.9rem;
  color: #666;
}

@media (max-width: 768px) {
  .group-generator-container {
    padding: 1rem;
  }
  
  .input-section {
    padding: 1.5rem;
  }
  
  .settings-group {
    flex-direction: column;
    gap: 1rem;
  }
  
  .setting-option {
    min-width: auto;
  }
  
  .groups-container {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .result-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>