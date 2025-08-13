---
layout: calculator
title: "Генератор випадкових країн — Відкрийте нові культури світу"
categories: [entertainment]
seo:
  title: "Генератор випадкових країн — Відкрийте нові культури світу"
  description: "Генератор випадкових країн для вивчення географії та культур світу. Відкривайте нові нації, їх традиції та особливості одним кліком."
  keywords:
    - генератор країн
    - випадкова країна
    - генератор випадкових країн
    - країни світу
    - географічне навчання
    - вивчення країн
    - генератор націй
    - випадкові держави
    - географічний генератор
    - країни для вивчення
    - дослідження світу
    - вибір країни
    - генератор культур
    - відкриття країн
    - європейські країни
    - азійські країни
    - американські країни
    - африканські країни
    - країни Океанії
    - держави світу
    - суверенні країни
    - незалежні держави
    - національності світу
    - культурне різноманіття
    - світова географія
    - політична карта
    - міжнародні відносини
    - глобальне розуміння
    - культурна освіта
    - етнографія
    - країни та столиці
    - державні символи
    - національні традиції
    - світові культури
    - міжкультурне навчання
    - країни ООН
    - визнані держави
    - геополітика
    - регіональне вивчення
  content: |
    <h2>Подорожуйте світом через випадкові відкриття</h2>
    <p>Наш генератор випадкових країн допоможе вам дізнатися про різні нації, їхні культури та традиції. Ідеальний інструмент для географічного навчання та розширення кругозору.</p>
    
    <h3>Як використовувати генератор країн?</h3>
    <ul>
      <li><strong>Географічне навчання:</strong> Вивчайте країни та їх розташування на карті</li>
      <li><strong>Культурне дослідження:</strong> Дізнавайтеся про традиції різних народів</li>
      <li><strong>Планування подорожей:</strong> Отримайте ідеї для майбутніх поїздок</li>
      <li><strong>Освіта:</strong> Використовуйте для навчальних вікторин та проектів</li>
      <li><strong>Самоосвіта:</strong> Розширюйте знання про світ щодня</li>
      <li><strong>Ігри та розваги:</strong> Створюйте географічні челенджі</li>
    </ul>
    
    <h3>Переваги випадкового вивчення країн</h3>
    <ul>
      <li><strong>Широкий кругозір:</strong> Дізнавайтеся про малознайомі країни</li>
      <li><strong>Культурна толерантність:</strong> Розвивайте розуміння різних культур</li>
      <li><strong>Географічні знання:</strong> Покращуйте орієнтацію у світовій географії</li>
      <li><strong>Елемент відкриття:</strong> Кожна країна - нове захоплююче відкриття</li>
      <li><strong>Мотивація до навчання:</strong> Стимулює інтерес до пізнання світу</li>
      <li><strong>Глобальне мислення:</strong> Формує світогляд громадянина світу</li>
    </ul>
    
    <h3>Фільтри та інформація</h3>
    <p>Генератор включає всі визнані країни світу з можливістю фільтрації за континентами. Кожна країна супроводжується інформацією про столицю, континент та цікавими фактами.</p>
    
    <h3>Цікаві факти про країни світу</h3>
    <ul>
      <li>В ООН входить 193 держави-члени</li>
      <li>Ватикан - найменша країна світу (0.44 км²)</li>
      <li>Росія - найбільша країна за площею (17.1 млн км²)</li>
      <li>Китай - найбільша країна за населенням (1.4 млрд)</li>
      <li>У світі є країни без виходу до моря та острівні держави</li>
    </ul>
scripts:
  - /assets/js/random-country-generator.js
faq:
  - question: Скільки країн включено в генератор?
    answer: "Генератор містить всі 195 визнаних країн світу, включаючи 193 члени ООН та 2 країни-спостерігачі (Ватикан та Палестина)."
  - question: Чи можу я фільтрувати країни за континентами?
    answer: "Так, ви можете вибрати конкретний континент для генерації або залишити 'Весь світ' для повністю випадкового вибору."
  - question: Яка інформація надається про кожну країну?
    answer: "Для кожної країни вказується столиця, континент, приблизна площа та цікавий факт або особливість."
  - question: Чи оновлюється інформація про країни?
    answer: "Так, ми регулярно оновлюємо дані про країни, включаючи зміни столиць, політичного статусу та іншої актуальної інформації."
  - question: Чи можна використовувати для навчання?
    answer: "Абсолютно! Генератор ідеально підходить для навчальних цілей, географічних вікторин та розвитку загальної ерудиції."
  - question: Чи зберігається історія згенерованих країн?
    answer: "Так, генератор веде статистику ваших згенерованих країн у поточній сесії для відстеження прогресу вивчення."
---

<div class="country-generator-container">
  <div class="generator-controls">
    <div class="filter-section">
      <label for="continentFilter">Виберіть континент:</label>
      <select id="continentFilter">
        <option value="all">🌍 Весь світ</option>
        <option value="europe">🏰 Європа</option>
        <option value="asia">🏯 Азія</option>
        <option value="north-america">🗽 Північна Америка</option>
        <option value="south-america">🌴 Південна Америка</option>
        <option value="africa">🦁 Африка</option>
        <option value="oceania">🏄 Океанія</option>
      </select>
    </div>
    
    <button id="generateCountryBtn" class="generate-button">
      <span class="button-icon">🎲</span>
      <span class="button-text">Згенерувати країну</span>
    </button>
  </div>

  <div class="result-section" id="resultSection">
    <div class="country-card" id="countryCard">
      <div class="country-flag" id="countryFlag">🏳️</div>
      <div class="country-name" id="countryName">Натисніть кнопку для генерації</div>
      <div class="country-details" id="countryDetails">
        <div class="detail-item">
          <span class="detail-icon">🌍</span>
          <span class="detail-text" id="continentInfo">Виберіть континент та згенеруйте країну</span>
        </div>
      </div>
    </div>
  </div>
  
  <div class="statistics" id="statistics">
    <h3>📊 Статистика генерації</h3>
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-number" id="totalGenerated">0</div>
        <div class="stat-label">Згенеровано</div>
      </div>
      <div class="stat-item">
        <div class="stat-number" id="uniqueCountries">0</div>
        <div class="stat-label">Унікальних</div>
      </div>
      <div class="stat-item">
        <div class="stat-number" id="favoriteContinent">-</div>
        <div class="stat-label">Популярний континент</div>
      </div>
    </div>
    <button id="resetCountryStats" class="reset-button">
      <span class="reset-icon">🔄</span>
      <span>Скинути статистику</span>
    </button>
  </div>
  
  <div class="history-section" id="historySection">
    <h3>🗂️ Згенеровані країни</h3>
    <div class="history-list" id="historyList">
      <p class="no-history">Поки що країн не згенеровано</p>
    </div>
    <button id="clearHistory" class="clear-button" style="display: none;">
      <span class="clear-icon">🗑️</span>
      <span>Очистити історію</span>
    </button>
  </div>
  
  <div class="tips-section">
    <h3>💡 Поради щодо використання</h3>
    <div class="tips-grid">
      <div class="tip-item">
        <span class="tip-icon">📚</span>
        <div class="tip-content">
          <strong>Дослідження</strong>
          <p>Після генерації країни пошукайте додаткову інформацію про її історію та культуру</p>
        </div>
      </div>
      <div class="tip-item">
        <span class="tip-icon">🗺️</span>
        <div class="tip-content">
          <strong>На карті</strong>
          <p>Знайдіть згенеровану країну на карті світу для кращого розуміння її розташування</p>
        </div>
      </div>
      <div class="tip-item">
        <span class="tip-icon">🎯</span>
        <div class="tip-content">
          <strong>Цільове навчання</strong>
          <p>Використовуйте фільтри за континентами для вивчення конкретних регіонів</p>
        </div>
      </div>
      <div class="tip-item">
        <span class="tip-icon">📝</span>
        <div class="tip-content">
          <strong>Ведіть записи</strong>
          <p>Записуйте цікаві факти про країни для кращого запам'ятовування</p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
.country-generator-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.generator-controls {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: var(--radius);
  margin-bottom: 2rem;
  border: 2px solid var(--border);
  text-align: center;
}

.filter-section {
  margin-bottom: 1.5rem;
}

.filter-section label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--main-color);
  font-size: 1.1rem;
}

.filter-section select {
  padding: 0.75rem 1rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: border-color var(--transition);
  min-width: 200px;
}

.filter-section select:focus {
  outline: none;
  border-color: var(--accent);
}

.generate-button {
  background: linear-gradient(45deg, var(--accent), var(--accent-hover));
  color: white;
  border: none;
  padding: 1.2rem 2.5rem;
  border-radius: var(--radius);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: var(--shadow);
}

.generate-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(21, 122, 255, 0.3);
}

.result-section {
  margin: 2rem 0;
}

.country-card {
  background: var(--card-bg);
  padding: 2.5rem;
  border-radius: var(--radius);
  border: 2px solid var(--border);
  text-align: center;
  transition: all var(--transition);
}

.country-card.generated {
  border-color: var(--accent);
  box-shadow: 0 8px 32px rgba(21, 122, 255, 0.1);
}

.country-flag {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.country-name {
  font-size: 2rem;
  font-weight: bold;
  color: var(--main-color);
  margin-bottom: 1.5rem;
}

.country-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.1rem;
}

.detail-icon {
  font-size: 1.2rem;
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
  margin: 2rem 0;
}

.history-section h3 {
  margin-bottom: 1.5rem;
  color: var(--main-color);
  text-align: center;
}

.history-list {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid var(--border);
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: background var(--transition);
}

.history-item:hover {
  background: #f8f9fa;
}

.history-country {
  font-weight: 600;
  color: var(--main-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.history-details {
  color: #666;
  font-size: 0.9rem;
}

.no-history {
  text-align: center;
  color: #666;
  font-style: italic;
  margin: 2rem 0;
}

.tips-section {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: var(--radius);
  border: 2px solid var(--border);
  margin-top: 2rem;
}

.tips-section h3 {
  margin-bottom: 1.5rem;
  color: var(--main-color);
  text-align: center;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid var(--border);
}

.tip-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.tip-content strong {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--main-color);
}

.tip-content p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .country-generator-container {
    padding: 1rem;
  }
  
  .generator-controls {
    padding: 1.5rem;
  }
  
  .country-card {
    padding: 2rem;
  }
  
  .country-name {
    font-size: 1.5rem;
  }
  
  .country-flag {
    font-size: 3rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .tips-grid {
    grid-template-columns: 1fr;
  }
  
  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>