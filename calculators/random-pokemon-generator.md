---
layout: calculator
title: "Генератор випадкових покемонів — випадковий покемон онлайн"
categories: [entertainment]
seo:
  title: "Генератор випадкових покемонів — випадковий покемон онлайн"
  description: "Отримайте випадкового покемона з усіх поколінь. Генератор покемонів для ігор, творчості та розваг. Дізнайтеся типи, характеристики та цікаві факти."
  keywords:
    - генератор випадкових покемонів
    - випадковий покемон онлайн
    - генератор покемонів
    - рандомний покемон
    - покемон дня
    - генератор покемонів українською
    - випадковий покемон для гри
    - онлайн генератор покемонів
    - покемони всіх поколінь
    - типи покемонів
    - статистика покемонів
    - покемони Канто
    - покемони Джото
    - покемони Хоен
    - покемони Сіно
    - покемони Унова
    - покемони Калос
    - покемони Алола
    - покемони Галар
    - легендарні покемони
    - стартові покемони
    - еволюція покемонів
    - покемон база даних
    - покемон енциклопедія
    - покедекс генератор
    - покемон квіз
    - покемон фан
    - покемон ностальгія
    - покемон колекція
  content: |
    <h2>⚡ Відкрийте світ покемонів</h2>
    <p>Наш генератор випадкових покемонів допоможе вам дослідити всю різноманітність покемонів з усіх поколінь. Від класичних покемонів Канто до сучасних покемонів Галар.</p>
    
    <h3>🎯 Для чого використовувати генератор покемонів?</h3>
    <ul>
      <li><strong>Ігри та челенджі:</strong> Випадковий вибір для Nuzlocke-пробіжок</li>
      <li><strong>Створення команди:</strong> Натхнення для складання нових команд</li>
      <li><strong>Вивчення покемонів:</strong> Знайомство з незнайомими видами</li>
      <li><strong>Творчість:</strong> Ідеї для малювання та фанфіків</li>
      <li><strong>Квізи:</strong> Тестування знань про покемонів</li>
      <li><strong>Ностальгія:</strong> Спогади про улюблених покемонів</li>
    </ul>
    
    <h3>🌟 Покоління покемонів</h3>
    <ul>
      <li><strong>Покоління I (Канто):</strong> Оригінальні 151 покемон</li>
      <li><strong>Покоління II (Джото):</strong> Золоті та срібні спогади</li>
      <li><strong>Покоління III (Хоен):</strong> Рубін, сапфір та смарагд</li>
      <li><strong>Покоління IV (Сіно):</strong> Діамант, перла та платина</li>
      <li><strong>Покоління V (Унова):</strong> Чорний та білий</li>
      <li><strong>Покоління VI (Калос):</strong> X та Y з 3D графікою</li>
      <li><strong>Покоління VII (Алола):</strong> Сонце та місяць</li>
      <li><strong>Покоління VIII (Галар):</strong> Меч та щит</li>
    </ul>
    
    <h3>🔥 Типи покемонів</h3>
    <p>Дізнавайтеся про різні типи покемонів: Вогонь, Вода, Трава, Електро, Психо, Лід, Дракон, Темрява, Фея та багато інших. Кожен тип має свої унікальні характеристики та переваги.</p>
    
    <h3>⭐ Рідкісність та унікальність</h3>
    <ul>
      <li>Стартові покемони - ваші перші компаньйони</li>
      <li>Легендарні покемони - рідкісні та могутні</li>
      <li>Міфічні покемони - таємничі та особливі</li>
      <li>Звичайні покемони - основа будь-якої команди</li>
    </ul>
    
    <h3>🎮 Цікаві факти про покемонів</h3>
    <ul>
      <li>Перший покемон був створений у 1996 році</li>
      <li>Наразі існує понад 900 різних видів покемонів</li>
      <li>Пікачу - найвідоміший покемон у світі</li>
      <li>Деякі покемони можуть мати декілька форм та еволюцій</li>
    </ul>
scripts:
  - /assets/js/random-pokemon-generator.js
faq:
  - question: Скільки покемонів є в базі даних?
    answer: "Наша база містить понад 900 покемонів з усіх 8 поколінь, включаючи стартових, легендарних та міфічних покемонів."
  - question: Чи можна фільтрувати покемонів за поколіннями?
    answer: "Так, ви можете вибрати конкретне покоління або змішати покемонів з усіх поколінь для максимального різноманіття."
  - question: Чи включена інформація про типи та характеристики?
    answer: "Так, для кожного покемона ми показуємо його тип(и), базові характеристики, рідкісність та цікаві факти."
  - question: Чи зберігається історія згенерованих покемонів?
    answer: "Так, ми зберігаємо вашу історію локально, щоб ви могли переглянути раніше отримані результати та статистику."
  - question: Чи можна використовувати для навчання гри?
    answer: "Абсолютно! Генератор відмінно підходить для Nuzlocke-челенджів, створення команд та вивчення нових покемонів."
  - question: Чи включені новітні покемони?
    answer: "Так, ми регулярно оновлюємо базу, включаючи покемонів з найновіших ігор та поколінь."
---

<div class="pokemon-generator-container">
  <div class="generator-section">
    <div class="controls-group">
      <label for="pokemonGeneration">Оберіть покоління:</label>
      <select id="pokemonGeneration" class="generation-select">
        <option value="all">Всі покоління</option>
        <option value="1">Покоління I (Канто)</option>
        <option value="2">Покоління II (Джото)</option>
        <option value="3">Покоління III (Хоен)</option>
        <option value="4">Покоління IV (Сіно)</option>
        <option value="5">Покоління V (Унова)</option>
        <option value="6">Покоління VI (Калос)</option>
        <option value="7">Покоління VII (Алола)</option>
        <option value="8">Покоління VIII (Галар)</option>
      </select>
    </div>
    
    <div class="rarity-filter">
      <label>Фільтр за рідкісністю:</label>
      <div class="rarity-options">
        <label class="rarity-option">
          <input type="checkbox" value="common" checked>
          <span>Звичайні</span>
        </label>
        <label class="rarity-option">
          <input type="checkbox" value="starter" checked>
          <span>Стартові</span>
        </label>
        <label class="rarity-option">
          <input type="checkbox" value="legendary" checked>
          <span>Легендарні</span>
        </label>
        <label class="rarity-option">
          <input type="checkbox" value="mythical" checked>
          <span>Міфічні</span>
        </label>
      </div>
    </div>
    
    <button id="generateBtn" class="generate-button">
      <span class="button-icon">⚡</span>
      <span class="button-text">Згенерувати покемона</span>
    </button>
  </div>

  <div class="result-section" id="resultSection">
    <div class="pokemon-card" id="pokemonCard">
      <div class="pokemon-image" id="pokemonImage">🔮</div>
      <div class="pokemon-info">
        <h3 class="pokemon-name" id="pokemonName">Натисніть кнопку для генерації!</h3>
        <div class="pokemon-details" id="pokemonDetails">
          <p>Виберіть покоління та згенеруйте випадкового покемона</p>
        </div>
      </div>
    </div>
  </div>
  
  <div class="statistics" id="statistics">
    <h3>📊 Статистика генерацій</h3>
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-number" id="totalGenerated">0</div>
        <div class="stat-label">Всього</div>
      </div>
      <div class="stat-item">
        <div class="stat-number" id="uniquePokemon">0</div>
        <div class="stat-label">Унікальних</div>
      </div>
      <div class="stat-item">
        <div class="stat-number" id="favoriteGeneration">-</div>
        <div class="stat-label">Улюблене покоління</div>
      </div>
    </div>
    
    <div class="type-stats">
      <h4>🏷️ Статистика типів</h4>
      <div class="type-grid" id="typeGrid">
        <!-- Types will be populated by JS -->
      </div>
    </div>
    
    <button id="resetStats" class="reset-button">
      <span class="reset-icon">🔄</span>
      <span>Скинути статистику</span>
    </button>
  </div>
  
  <div class="history-section" id="historySection">
    <h3>📝 Історія генерацій</h3>
    <div class="history-list" id="historyList">
      <p>Історія порожня. Згенеруйте першого покемона!</p>
    </div>
    <button id="clearHistory" class="clear-button">
      <span class="clear-icon">🗑️</span>
      <span>Очистити історію</span>
    </button>
  </div>
</div>

<style>
.pokemon-generator-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.generator-section {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: var(--radius);
  margin-bottom: 2rem;
  border: 2px solid var(--border);
  text-align: center;
}

.controls-group {
  margin-bottom: 1.5rem;
}

.controls-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--main-color);
  font-size: 1.1rem;
}

.generation-select {
  width: 100%;
  max-width: 300px;
  padding: 0.75rem;
  border: 2px solid var(--border);
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  background: white;
  transition: border-color var(--transition);
}

.generation-select:focus {
  outline: none;
  border-color: var(--accent);
}

.rarity-filter {
  margin-bottom: 1.5rem;
}

.rarity-filter label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--main-color);
  font-size: 1.1rem;
}

.rarity-options {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.rarity-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 2px solid var(--border);
  cursor: pointer;
  transition: all var(--transition);
  font-size: 0.9rem !important;
  font-weight: 500 !important;
}

.rarity-option:hover {
  border-color: var(--accent);
}

.rarity-option input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.generate-button {
  background: linear-gradient(45deg, #ff6b35, #f7931e);
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
  margin: 0 auto;
  box-shadow: var(--shadow);
}

.generate-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(255, 107, 53, 0.3);
}

.generate-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.result-section {
  margin: 2rem 0;
}

.pokemon-card {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: var(--radius);
  border: 2px solid var(--border);
  text-align: center;
  transition: all var(--transition);
}

.pokemon-card.fire { border-color: #ff6b35; background: linear-gradient(45deg, #fff5f0, #ffe8e0); }
.pokemon-card.water { border-color: #4ecdc4; background: linear-gradient(45deg, #f0ffff, #e0f8f8); }
.pokemon-card.grass { border-color: #96ceb4; background: linear-gradient(45deg, #f5fff5, #e8f8e8); }
.pokemon-card.electric { border-color: #feca57; background: linear-gradient(45deg, #fffbf0, #fff6e0); }
.pokemon-card.psychic { border-color: #ff9ff3; background: linear-gradient(45deg, #fff5ff, #ffe8ff); }
.pokemon-card.ice { border-color: #74b9ff; background: linear-gradient(45deg, #f0f8ff, #e0f0ff); }
.pokemon-card.dragon { border-color: #6c5ce7; background: linear-gradient(45deg, #f8f5ff, #f0e8ff); }
.pokemon-card.dark { border-color: #2d3436; background: linear-gradient(45deg, #f8f8f8, #f0f0f0); }
.pokemon-card.fighting { border-color: #e17055; background: linear-gradient(45deg, #fff8f5, #fff0e8); }
.pokemon-card.poison { border-color: #a29bfe; background: linear-gradient(45deg, #faf8ff, #f5f0ff); }
.pokemon-card.ground { border-color: #d63031; background: linear-gradient(45deg, #fff5f5, #ffe8e8); }
.pokemon-card.flying { border-color: #74b9ff; background: linear-gradient(45deg, #f5f8ff, #e8f0ff); }
.pokemon-card.bug { border-color: #00b894; background: linear-gradient(45deg, #f0fff8, #e0fff0); }
.pokemon-card.rock { border-color: #636e72; background: linear-gradient(45deg, #f8f9fa, #f0f2f5); }
.pokemon-card.ghost { border-color: #6c5ce7; background: linear-gradient(45deg, #f8f5ff, #f0e8ff); }
.pokemon-card.steel { border-color: #636e72; background: linear-gradient(45deg, #f8f9fa, #f0f2f5); }
.pokemon-card.fairy { border-color: #fd79a8; background: linear-gradient(45deg, #fff8fc, #fff0f8); }

.pokemon-image {
  font-size: 5rem;
  margin-bottom: 1rem;
  display: block;
}

.pokemon-name {
  color: var(--main-color);
  margin-bottom: 1rem;
  font-size: 1.8rem;
}

.pokemon-details {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid var(--border);
  text-align: left;
  margin-top: 1rem;
}

.pokemon-details h4 {
  color: var(--accent);
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pokemon-details p {
  margin: 0.5rem 0;
  line-height: 1.6;
}

.type-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  margin: 0.25rem;
  color: white;
  text-transform: uppercase;
}

.type-fire { background-color: #ff6b35; }
.type-water { background-color: #4ecdc4; }
.type-grass { background-color: #96ceb4; }
.type-electric { background-color: #feca57; color: #333; }
.type-psychic { background-color: #ff9ff3; }
.type-ice { background-color: #74b9ff; }
.type-dragon { background-color: #6c5ce7; }
.type-dark { background-color: #2d3436; }
.type-fighting { background-color: #e17055; }
.type-poison { background-color: #a29bfe; }
.type-ground { background-color: #d63031; }
.type-flying { background-color: #74b9ff; }
.type-bug { background-color: #00b894; }
.type-rock { background-color: #636e72; }
.type-ghost { background-color: #6c5ce7; }
.type-steel { background-color: #636e72; }
.type-fairy { background-color: #fd79a8; }
.type-normal { background-color: #ddd; color: #333; }

.rarity-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  margin: 0.25rem;
}

.rarity-common { background-color: #74b9ff; color: white; }
.rarity-starter { background-color: #00b894; color: white; }
.rarity-legendary { background-color: #fdcb6e; color: #333; }
.rarity-mythical { background-color: #e17055; color: white; }

.statistics {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: var(--radius);
  border: 2px solid var(--border);
  margin: 2rem 0;
  text-align: center;
}

.statistics h3, .statistics h4 {
  margin-bottom: 1.5rem;
  color: var(--main-color);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
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

.type-stats {
  margin: 2rem 0;
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.type-stat {
  background: white;
  padding: 0.5rem;
  border-radius: 8px;
  border: 2px solid var(--border);
  text-align: center;
  font-size: 0.8rem;
}

.type-stat-count {
  font-weight: bold;
  color: var(--accent);
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
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  transition: background var(--transition);
}

.history-item:hover {
  background: #f8f9fa;
}

.history-item:last-child {
  border-bottom: none;
}

.history-image {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.history-details {
  flex: 1;
}

.history-name {
  font-weight: 600;
  color: var(--main-color);
  margin-bottom: 0.25rem;
}

.history-meta {
  font-size: 0.8rem;
  color: #666;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.history-time {
  font-size: 0.8rem;
  color: #999;
}

@media (max-width: 768px) {
  .pokemon-generator-container {
    padding: 1rem;
  }
  
  .generator-section {
    padding: 1.5rem;
  }
  
  .rarity-options {
    flex-direction: column;
    align-items: center;
  }
  
  .pokemon-image {
    font-size: 3.5rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .type-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>