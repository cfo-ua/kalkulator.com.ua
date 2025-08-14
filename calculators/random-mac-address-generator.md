---
layout: calculator
title: "Генератор випадкових MAC адрес — Створення мережевих ідентифікаторів"
categories: [technology]
seo:
  title: "Генератор випадкових MAC адрес — Створення мережевих ідентифікаторів"
  description: "Генеруйте випадкові MAC адреси для тестування мережі, віртуалізації та розробки. Підтримка різних форматів та валідних вендорів."
  keywords:
    - генератор MAC адрес
    - випадкові MAC адреси
    - MAC address generator
    - генератор мережевих адрес
    - віртуальна MAC адреса
    - тестування мережі
    - генератор Ethernet адрес
    - симуляція MAC
    - випадковий network ID
    - генератор hardware адрес
    - MAC для тестування
    - мережевий ідентифікатор
    - генератор NIC адрес
    - фізична адреса генератор
    - MAC для віртуалізації
    - випадкова Ethernet адреса
    - генератор LAN адрес
    - мережева карта адреса
    - генератор IEEE 802
    - unicast MAC генератор
    - локальна MAC адреса
    - тестова MAC адреса
    - симуляція пристроїв
    - генератор OUI
    - випадковий vendor ID
    - network interface генератор
    - MAC для VM
    - тестування мережевого обладнання
  content: |
    <h2>Професійний генератор MAC адрес для мережевих завдань</h2>
    <p>Створюйте випадкові MAC адреси для тестування мереж, віртуалізації, розробки та навчання. Підтримка різних форматів та реальних вендорів.</p>
    
    <h3>🎯 Коли використовувати генератор MAC адрес?</h3>
    <ul>
      <li><strong>Віртуалізація:</strong> Налаштування віртуальних машин та контейнерів</li>
      <li><strong>Тестування мережі:</strong> Симуляція різних пристроїв</li>
      <li><strong>Розробка ПЗ:</strong> Тестування мережевих додатків</li>
      <li><strong>Освіта:</strong> Вивчення мережевих протоколів</li>
      <li><strong>Налагодження:</strong> Ізоляція мережевих проблем</li>
      <li><strong>Безпека:</strong> Тестування MAC фільтрації</li>
    </ul>

    <h3>⚡ Підтримувані формати</h3>
    <ul>
      <li><strong>IEEE Standard:</strong> 01:23:45:67:89:AB (двокрапка)</li>
      <li><strong>Unix/Linux:</strong> 01-23-45-67-89-AB (дефіс)</li>
      <li><strong>Windows:</strong> 01-23-45-67-89-AB (дефіс)</li>
      <li><strong>Cisco:</strong> 0123.4567.89AB (крапки)</li>
      <li><strong>Bare:</strong> 0123456789AB (без роздільників)</li>
      <li><strong>C Array:</strong> {0x01, 0x23, 0x45, 0x67, 0x89, 0xAB}</li>
    </ul>
    
    <h3>🔧 Можливості генератора</h3>
    <ul>
      <li><strong>Валідні адреси:</strong> Дотримання стандартів IEEE 802</li>
      <li><strong>Вендори:</strong> Реальні OUI від відомих виробників</li>
      <li><strong>Типи адрес:</strong> Unicast, multicast, локальні</li>
      <li><strong>Множинна генерація:</strong> До 100 адрес одночасно</li>
      <li><strong>Експорт:</strong> Різні формати файлів</li>
      <li><strong>Валідація:</strong> Перевірка коректності адрес</li>
    </ul>

    <h3>🌐 Популярні вендори</h3>
    <ul>
      <li><strong>Cisco:</strong> 00:1B:0D, 00:26:CA, 24:B6:57</li>
      <li><strong>Intel:</strong> 00:15:17, 00:1E:67, AC:2B:6E</li>
      <li><strong>Apple:</strong> 00:1F:F3, 00:25:BC, 28:CF:E9</li>
      <li><strong>Dell:</strong> 00:14:22, B8:2A:72, B4:B5:2F</li>
      <li><strong>HP:</strong> 00:1A:4B, 00:26:55, 70:10:6F</li>
    </ul>

    <h3>🔒 Стандарти та сумісність</h3>
    <p>Всі згенеровані адреси відповідають стандартам IEEE 802 та можуть використовуватися в реальних мережевих середовищах для тестування.</p>
    
    <h3>💡 Поради з використання</h3>
    <ul>
      <li>Використовуйте локальні адреси для тестування</li>
      <li>Уникайте multicast адрес для інтерфейсів</li>
      <li>Перевіряйте унікальність у вашій мережі</li>
      <li>Документуйте згенеровані адреси</li>
      <li>Враховуйте політики безпеки</li>
    </ul>
scripts:
  - /js/random-mac-address-generator.js
faq:
  - question: Чи можна використовувати ці MAC адреси в реальних мережах?
    answer: "Так, але з обережністю. Генератор створює валідні адреси, але в продакшн мережах рекомендується використовувати тільки локально адміністровані адреси."
  - question: Що таке OUI та як він працює?
    answer: "OUI (Organizationally Unique Identifier) — це перші 3 байти MAC адреси, що ідентифікують виробника. Ми використовуємо реальні OUI для автентичності."
  - question: Яка різниця між unicast та multicast адресами?
    answer: "Unicast адреси використовуються для окремих пристроїв, multicast — для групової адресації. Генератор може створювати обидва типи."
  - question: Чи зберігається історія згенерованих адрес?
    answer: "Так, останні 50 результатів зберігаються в браузері. Також можете експортувати адреси для збереження."
  - question: Як перевірити унікальність MAC адреси?
    answer: "Генератор створює псевдо-випадкові адреси, але в мережі слід додатково перевіряти унікальність за допомогою команди 'arp' або мережевих сканерів."
  - question: Чи підходить для віртуальних машин?
    answer: "Абсолютно! Генератор ідеально підходить для налаштування віртуальних машин та контейнерів. Рекомендуємо використовувати локально адміністровані адреси."
---

<div class="calculator-container">
  <div class="calculator-form">
    <h4>⚙️ Налаштування генератора</h4>
    
    <div class="input-row">
      <div class="input-group">
        <label for="macFormat">📝 Формат виводу:</label>
        <select id="macFormat">
          <option value="colon">01:23:45:67:89:AB (двокрапка)</option>
          <option value="dash">01-23-45-67-89-AB (дефіс)</option>
          <option value="dot">0123.4567.89AB (крапки Cisco)</option>
          <option value="bare">0123456789AB (без роздільників)</option>
          <option value="array">{0x01, 0x23, 0x45} (C array)</option>
        </select>
      </div>
      
      <div class="input-group">
        <label for="macCount">🔢 Кількість адрес:</label>
        <input type="number" id="macCount" value="1" min="1" max="100">
      </div>
    </div>
    
    <div class="input-row">
      <div class="input-group">
        <label for="addressType">🎯 Тип адреси:</label>
        <select id="addressType">
          <option value="unicast">Unicast (звичайні пристрої)</option>
          <option value="multicast">Multicast (групова адресація)</option>
          <option value="local">Локально адмініструвана</option>
          <option value="any">Будь-який тип</option>
        </select>
      </div>
      
      <div class="input-group">
        <label for="vendorSelect">🏢 Вендор (OUI):</label>
        <select id="vendorSelect">
          <option value="random">🎲 Випадковий OUI</option>
          <option value="cisco">Cisco Systems</option>
          <option value="intel">Intel Corporation</option>
          <option value="apple">Apple Inc.</option>
          <option value="dell">Dell Inc.</option>
          <option value="hp">Hewlett Packard</option>
          <option value="microsoft">Microsoft</option>
          <option value="samsung">Samsung</option>
          <option value="vmware">VMware</option>
          <option value="local">Локальний OUI</option>
        </select>
      </div>
    </div>
    
    <div class="input-row">
      <div class="input-group">
        <label for="caseFormat">🔤 Регістр:</label>
        <select id="caseFormat">
          <option value="uppercase">Верхній регістр (A-F)</option>
          <option value="lowercase">Нижній регістр (a-f)</option>
          <option value="mixed">Змішаний регістр</option>
        </select>
      </div>
      
      <div class="input-group">
        <label for="includeInfo">
          <input type="checkbox" id="includeInfo" checked> 
          📊 Показувати інформацію про вендора
        </label>
      </div>
    </div>
    
    <div class="convert-buttons">
      <button id="generateMACs" class="primary-btn">🎲 Генерувати MAC адреси</button>
      <button id="quickGenerate" class="secondary-btn">⚡ Швидка генерація</button>
      <button id="exportMACs" class="info-btn" style="display: none;">📤 Експорт</button>
      <button id="clearHistory" class="danger-btn">🗑️ Очистити історію</button>
    </div>
  </div>

  <div id="result" class="result-section" style="display: none;">
    <div class="insight-cards">
      <div class="insight-card success">
        <h6>🎯 Згенеровані MAC адреси</h6>
        <div id="generatedMACs"></div>
        <p id="generationInfo"></p>
      </div>
    </div>
  </div>

  <div id="validationSection" class="additional-info" style="display: none;">
    <h6>✅ Валідація адрес</h6>
    <div id="validationResults"></div>
  </div>

  <div id="vendorSection" class="additional-info" style="display: none;">
    <h6>🏢 Інформація про вендорів</h6>
    <div id="vendorInfo"></div>
  </div>

  <div id="historySection" class="additional-info" style="display: none;">
    <h6>📚 Історія генерації</h6>
    <div id="historyList"></div>
  </div>
</div>

<style>
.mac-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 12px;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  position: relative;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.mac-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  border-color: #fff;
}

.mac-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  opacity: 0.8;
}

.mac-value {
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0.75rem 0;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border: 1px dashed rgba(255, 255, 255, 0.3);
  text-align: center;
  letter-spacing: 1px;
}

.mac-details {
  font-size: 0.85rem;
  opacity: 0.9;
  margin: 0.5rem 0;
}

.mac-actions {
  margin-top: 0.75rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.mac-btn {
  padding: 0.4rem 0.8rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.mac-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.vendor-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
}

.address-type-badge {
  display: inline-block;
  padding: 0.2rem 0.4rem;
  background: rgba(0, 255, 0, 0.2);
  border-radius: 8px;
  font-size: 0.7rem;
  margin-left: 0.5rem;
}

.address-type-multicast {
  background: rgba(255, 165, 0, 0.2);
}

.address-type-local {
  background: rgba(255, 255, 0, 0.2);
}

.vendor-info-card {
  background: #f8f9fa;
  border-left: 4px solid #007bff;
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 0 8px 8px 0;
}

.oui-breakdown {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem;
  border-radius: 6px;
  margin: 0.5rem 0;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.copy-notification {
  position: absolute;
  top: -2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #10b981;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1000;
}

.copy-notification.show {
  opacity: 1;
}
</style>