---
layout: calculator
title: "Калькулятор розміру намету — Вибір ідеального намету для кемпінгу"
categories: [travel]
seo:
  title: "Калькулятор розміру намету — Вибір ідеального намету для кемпінгу"
  description: "Розрахуйте оптимальний розмір намету для вашої подорожі. Враховуємо кількість людей, тип кемпінгу та особисті потреби. Рекомендації щодо розмірів, місткості та типу намету."
  keywords:
    - калькулятор розміру намету
    - вибір намету для кемпінгу
    - розмір намету на кількість людей
    - намет для походу
    - туристичний намет розмір
    - кемпінговий намет калькулятор
    - скільки людей в намет
    - намет для родини
    - двомісний намет
    - тримісний намет
    - чотиримісний намет
    - розміри наметів
    - як вибрати намет
    - площа намету
    - намет для туризму
    - табірний намет
    - намет для фестивалю
    - намет для пляжу
    - легкий намет для походу
    - просторий намет для кемпінгу
    - намет з тамбуром
    - водонепроникний намет
    - всесезонний намет
    - намет для пар
    - сімейний намет
    - групповий намет
    - експедиційний намет
    - намет для мотоподорожей
    - намет для велоподорожей
    - намет для альпінізму
  content: |
    <h2>Як вибрати правильний розмір намету</h2>
    <p>Вибір правильного розміру намету — ключовий фактор для комфортного відпочинку на природі. Наш калькулятор допоможе підібрати ідеальний намет з урахуванням кількості людей, типу подорожі та особистих потреб.</p>
    
    <h3>Фактори для вибору розміру намету</h3>
    <ul>
      <li><strong>Кількість людей:</strong> Основний параметр для визначення мінімального розміру</li>
      <li><strong>Тип подорожі:</strong> Піший туризм, автокемпінг або стаціонарний табір</li>
      <li><strong>Сезон використання:</strong> Літній, всесезонний або зимовий намет</li>
      <li><strong>Особисті потреби:</strong> Потреба в додатковому просторі для речей</li>
      <li><strong>Комфорт сну:</strong> Розмір спальних місць та висота намету</li>
    </ul>
    
    <h3>Типи наметів за призначенням</h3>
    <ul>
      <li><strong>Туристичні намети:</strong> Легкі та компактні для пішого туризму</li>
      <li><strong>Кемпінгові намети:</strong> Просторі з додатковими зручностями</li>
      <li><strong>Експедиційні намети:</strong> Надійні для екстремальних умов</li>
      <li><strong>Сімейні намети:</strong> Великі з кількома кімнатами</li>
      <li><strong>Фестивальні намети:</strong> Швидке встановлення та демонтаж</li>
    </ul>
    
    <h3>Поради щодо вибору намету</h3>
    <ul>
      <li>Завжди вибирайте намет на одну людину більше для комфорту</li>
      <li>Враховуйте висоту намету для зручності пересування</li>
      <li>Обирайте намет з тамбуром для зберігання речей</li>
      <li>Перевіряйте водонепроникність та вентиляцію</li>
      <li>Зважайте на вагу намету при пішому туризмі</li>
    </ul>
    
    <h3>Стандартні розміри наметів</h3>
    <ul>
      <li><strong>1-місний:</strong> 210x90 см, площа 1.9 м²</li>
      <li><strong>2-місний:</strong> 210x130 см, площа 2.7 м²</li>
      <li><strong>3-місний:</strong> 210x180 см, площа 3.8 м²</li>
      <li><strong>4-місний:</strong> 240x210 см, площа 5.0 м²</li>
      <li><strong>6-місний:</strong> 300x240 см, площа 7.2 м²</li>
    </ul>
scripts:
  - /assets/js/tent-size.js
faq:
  - question: Як розрахувати мінімальний розмір намету?
    answer: "Мінімальний розмір розраховується як 60-70 см ширини на одну людину. Для комфорту рекомендується 80-90 см на людину плюс місце для речей."
  - question: Чи потрібен намет більшого розміру для зимового кемпінгу?
    answer: "Так, для зимового кемпінгу потрібен більший намет через об'ємну одежу, спальні мішки та необхідність зберігання речей всередині намету."
  - question: Як впливає вага намету на вибір розміру?
    answer: "При пішому туризмі вага критична. Легкі намети зазвичай менші, тому треба балансувати між комфортом та ваговими обмеженнями."
  - question: Що таке 'season rating' для наметів?
    answer: "1-сезонний: літо; 2-сезонний: весна/літо; 3-сезонний: весна/літо/осінь; 4-сезонний: всі сезони включно з зимою та екстремальними умовами."
  - question: Чи варто брати намет 'з запасом'?
    answer: "Рекомендується вибирати намет на 1 людину більше від планованої кількості для комфорту та зберігання речей."
  - question: Як врахувати ріст людей при виборі намету?
    answer: "Високим людям (190+ см) потрібні намети довжиною мінімум 220 см. Також важлива висота намету для можливості сидіти."
---

<div class="tent-calculator-container">
  <div class="input-section">
    <div class="input-group">
      <label for="numPeople">Кількість людей:</label>
      <input type="number" id="numPeople" min="1" max="20" value="2">
    </div>
    
    <div class="input-group">
      <label for="tripType">Тип подорожі:</label>
      <select id="tripType">
        <option value="backpacking">Піший туризм</option>
        <option value="car-camping">Автокемпінг</option>
        <option value="base-camp">Стаціонарний табір</option>
        <option value="expedition">Експедиція</option>
      </select>
    </div>
    
    <div class="input-group">
      <label for="season">Сезон використання:</label>
      <select id="season">
        <option value="summer">Літо (1-2 сезони)</option>
        <option value="three-season" selected>3 сезони (весна/літо/осінь)</option>
        <option value="winter">Зима (4 сезони)</option>
      </select>
    </div>
    
    <div class="input-group">
      <label for="comfort">Рівень комфорту:</label>
      <select id="comfort">
        <option value="minimal">Мінімальний</option>
        <option value="standard" selected>Стандартний</option>
        <option value="spacious">Просторий</option>
        <option value="luxury">Максимальний</option>
      </select>
    </div>
    
    <div class="input-group">
      <label for="gear">Об'єм спорядження:</label>
      <select id="gear">
        <option value="minimal">Мінімальний</option>
        <option value="moderate" selected>Помірний</option>
        <option value="extensive">Великий</option>
      </select>
    </div>
    
    <button id="calculateBtn" class="calculate-button">
      <span class="button-icon">🏕️</span>
      <span class="button-text">Розрахувати розмір намету</span>
    </button>
  </div>

  <div class="result-section" id="resultSection">
    <!-- Results will be displayed here -->
  </div>
</div>

<style>
.detailed-results {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: var(--radius);
  margin-top: 2rem;
  border: 2px solid var(--border);
}

.detailed-results h3 {
  color: var(--main-color);
  margin-bottom: 1.5rem;
  text-align: center;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.recommendation-item {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid var(--border);
}

.recommendation-item h4 {
  color: var(--accent);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.recommendation-item ul {
  margin: 0;
  padding-left: 1.2rem;
}

.recommendation-item li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.size-comparison {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid var(--border);
}

.size-comparison h4 {
  color: var(--accent);
  margin-bottom: 1rem;
  text-align: center;
}

.size-table {
  overflow-x: auto;
}

.size-table table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.size-table th,
.size-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.size-table th {
  background: var(--card-bg);
  font-weight: 600;
  color: var(--main-color);
}

.size-table tr.highlighted {
  background: linear-gradient(45deg, #f8fff9, #e8f8e8);
  border: 2px solid #28a745;
}

.size-table tr.highlighted td {
  font-weight: 600;
}

@media (max-width: 768px) {
  .recommendations-grid {
    grid-template-columns: 1fr;
  }
  
  .size-table {
    font-size: 0.9rem;
  }
  
  .size-table th,
  .size-table td {
    padding: 0.5rem;
  }
}
.tent-calculator-container {
  max-width: 800px;
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

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--main-color);
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
  margin: 2rem auto 0;
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

@media (max-width: 768px) {
  .tent-calculator-container {
    padding: 1rem;
  }
  
  .input-section {
    padding: 1.5rem;
  }
  
  .calculate-button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
}
</style>