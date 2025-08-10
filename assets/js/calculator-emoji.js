document.addEventListener("DOMContentLoaded", function () {
  const emojiCollection = document.getElementById('emoji-collection');
  const searchInput = document.getElementById('emoji-search');
  const totalEmojisSpan = document.getElementById('total-emojis');
  const copiedCountSpan = document.getElementById('copied-count');
  
  let copiedCount = 0;
  
  // Emoji data organized by categories
  const emojiData = {
    calculators: {
      title: "🧮 Калькулятори та пристрої",
      emojis: [
        { emoji: "🧮", name: "Калькулятор", keywords: ["калькулятор", "обчислення", "рахунок"] },
        { emoji: "💻", name: "Ноутбук", keywords: ["ноутбук", "комп'ютер", "обчислення"] },
        { emoji: "🖥️", name: "Монітор", keywords: ["монітор", "комп'ютер", "екран"] },
        { emoji: "⌨️", name: "Клавіатура", keywords: ["клавіатура", "введення", "текст"] },
        { emoji: "🖱️", name: "Миша", keywords: ["миша", "клік", "курсор"] },
        { emoji: "📱", name: "Телефон", keywords: ["телефон", "мобільний", "калькулятор"] },
        { emoji: "⌚", name: "Годинник", keywords: ["годинник", "час", "розрахунок"] },
        { emoji: "📟", name: "Пейджер", keywords: ["пейджер", "пристрій", "цифри"] }
      ]
    },
    numbers: {
      title: "🔢 Цифри та числа",
      emojis: [
        { emoji: "0️⃣", name: "Нуль", keywords: ["0", "нуль", "число"] },
        { emoji: "1️⃣", name: "Один", keywords: ["1", "один", "число"] },
        { emoji: "2️⃣", name: "Два", keywords: ["2", "два", "число"] },
        { emoji: "3️⃣", name: "Три", keywords: ["3", "три", "число"] },
        { emoji: "4️⃣", name: "Чотири", keywords: ["4", "чотири", "число"] },
        { emoji: "5️⃣", name: "П'ять", keywords: ["5", "п'ять", "число"] },
        { emoji: "6️⃣", name: "Шість", keywords: ["6", "шість", "число"] },
        { emoji: "7️⃣", name: "Сім", keywords: ["7", "сім", "число"] },
        { emoji: "8️⃣", name: "Вісім", keywords: ["8", "вісім", "число"] },
        { emoji: "9️⃣", name: "Дев'ять", keywords: ["9", "дев'ять", "число"] },
        { emoji: "🔟", name: "Десять", keywords: ["10", "десять", "число"] },
        { emoji: "#️⃣", name: "Символ номера", keywords: ["номер", "хеш", "символ"] },
        { emoji: "*️⃣", name: "Зірочка", keywords: ["зірочка", "множення", "символ"] }
      ]
    },
    operations: {
      title: "➕ Математичні операції",
      emojis: [
        { emoji: "➕", name: "Плюс", keywords: ["плюс", "додавання", "сума"] },
        { emoji: "➖", name: "Мінус", keywords: ["мінус", "віднімання", "різниця"] },
        { emoji: "✖️", name: "Множення", keywords: ["множення", "помножити", "крестик"] },
        { emoji: "➗", name: "Ділення", keywords: ["ділення", "поділити", "частка"] },
        { emoji: "🟰", name: "Дорівнює", keywords: ["дорівнює", "рівно", "результат"] },
        { emoji: "💯", name: "Сто відсотків", keywords: ["100", "відсоток", "повністю"] },
        { emoji: "🔢", name: "Цифри", keywords: ["цифри", "числа", "математика"] },
        { emoji: "🔣", name: "Символи", keywords: ["символи", "знаки", "математика"] },
        { emoji: "〰️", name: "Хвиля", keywords: ["хвиля", "приблизно", "тильда"] },
        { emoji: "💱", name: "Обмін валют", keywords: ["валюта", "обмін", "курс"] }
      ]
    },
    charts: {
      title: "📊 Графіки та діаграми",
      emojis: [
        { emoji: "📊", name: "Стовпчаста діаграма", keywords: ["діаграма", "графік", "статистика"] },
        { emoji: "📈", name: "Зростаючий графік", keywords: ["графік", "зростання", "прибуток"] },
        { emoji: "📉", name: "Спадний графік", keywords: ["графік", "спад", "збиток"] },
        { emoji: "💹", name: "Біржовий графік", keywords: ["біржа", "акції", "торгівля"] },
        { emoji: "🗠", name: "Презентація", keywords: ["презентація", "слайд", "графік"] },
        { emoji: "📋", name: "Планшет", keywords: ["планшет", "список", "дані"] },
        { emoji: "🗃️", name: "Картотека", keywords: ["картотека", "файли", "дані"] },
        { emoji: "📑", name: "Сторінки", keywords: ["сторінки", "документи", "звіт"] }
      ]
    },
    geometry: {
      title: "📐 Геометрія та вимірювання",
      emojis: [
        { emoji: "📏", name: "Лінійка", keywords: ["лінійка", "вимірювання", "довжина"] },
        { emoji: "📐", name: "Трикутник", keywords: ["трикутник", "кутомір", "геометрія"] },
        { emoji: "🟫", name: "Коричневий квадрат", keywords: ["квадрат", "фігура", "геометрія"] },
        { emoji: "🔴", name: "Червоне коло", keywords: ["коло", "кругле", "фігура"] },
        { emoji: "🔵", name: "Синє коло", keywords: ["коло", "синє", "фігура"] },
        { emoji: "🔶", name: "Помаранчевий ромб", keywords: ["ромб", "діамант", "фігура"] },
        { emoji: "🔷", name: "Синій ромб", keywords: ["ромб", "синій", "фігура"] },
        { emoji: "🔸", name: "Малий ромб", keywords: ["ромб", "малий", "фігура"] }
      ]
    },
    special: {
      title: "🎯 Спеціальні символи",
      emojis: [
        { emoji: "∞", name: "Безкінечність", keywords: ["безкінечність", "нескінченність", "математика"] },
        { emoji: "√", name: "Квадратний корінь", keywords: ["корінь", "квадратний", "математика"] },
        { emoji: "π", name: "Пі", keywords: ["пі", "число", "геометрія"] },
        { emoji: "°", name: "Градус", keywords: ["градус", "температура", "кут"] },
        { emoji: "±", name: "Плюс-мінус", keywords: ["плюс", "мінус", "приблизно"] },
        { emoji: "≈", name: "Приблизно", keywords: ["приблизно", "близько", "майже"] },
        { emoji: "≠", name: "Не дорівнює", keywords: ["не", "дорівнює", "різне"] },
        { emoji: "≤", name: "Менше або дорівнює", keywords: ["менше", "дорівнює", "нерівність"] },
        { emoji: "≥", name: "Більше або дорівнює", keywords: ["більше", "дорівнює", "нерівність"] },
        { emoji: "∑", name: "Сума", keywords: ["сума", "сигма", "додавання"] },
        { emoji: "∏", name: "Добуток", keywords: ["добуток", "множення", "пі"] },
        { emoji: "∫", name: "Інтеграл", keywords: ["інтеграл", "калькулюс", "математика"] }
      ]
    }
  };
  
  // Calculate total emojis
  let totalEmojis = 0;
  Object.values(emojiData).forEach(category => {
    totalEmojis += category.emojis.length;
  });
  totalEmojisSpan.textContent = totalEmojis;
  
  // Copy function
  function copyEmoji(emoji) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(emoji).then(() => {
        showCopySuccess();
      }).catch(() => {
        fallbackCopy(emoji);
      });
    } else {
      fallbackCopy(emoji);
    }
  }
  
  function fallbackCopy(emoji) {
    const textArea = document.createElement('textarea');
    textArea.value = emoji;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      showCopySuccess();
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
    
    document.body.removeChild(textArea);
  }
  
  function showCopySuccess() {
    copiedCount++;
    copiedCountSpan.textContent = copiedCount;
    
    // Show temporary success message
    const notification = document.createElement('div');
    notification.textContent = '✅ Скопійовано!';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 2000);
  }
  
  // Render emojis
  function renderEmojis(filterText = '') {
    emojiCollection.innerHTML = '';
    
    Object.entries(emojiData).forEach(([categoryKey, category]) => {
      const filteredEmojis = category.emojis.filter(item => {
        if (!filterText) return true;
        const searchTerm = filterText.toLowerCase();
        return (
          item.name.toLowerCase().includes(searchTerm) ||
          item.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
          item.emoji.includes(searchTerm)
        );
      });
      
      if (filteredEmojis.length === 0) return;
      
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'emoji-category';
      categoryDiv.innerHTML = `
        <h3>${category.title}</h3>
        <div class="emoji-grid">
          ${filteredEmojis.map(item => `
            <div class="emoji-item">
              <div class="emoji-display">${item.emoji}</div>
              <div class="emoji-info">
                <div class="emoji-name">${item.name}</div>
                <button class="copy-btn" onclick="copyEmoji('${item.emoji}')" title="Копіювати ${item.name}">
                  📋 Копіювати
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      
      emojiCollection.appendChild(categoryDiv);
    });
    
    if (emojiCollection.innerHTML === '') {
      emojiCollection.innerHTML = '<p class="no-results">😔 Не знайдено емоджі за вашим запитом.</p>';
    }
  }
  
  // Make copyEmoji globally available
  window.copyEmoji = copyEmoji;
  
  // Search functionality
  searchInput.addEventListener('input', (e) => {
    renderEmojis(e.target.value);
  });
  
  // Initial render
  renderEmojis();
  
  // Add CSS for animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    .emoji-category {
      margin-bottom: 2rem;
    }
    
    .emoji-category h3 {
      color: var(--accent);
      margin-bottom: 1rem;
      border-bottom: 2px solid var(--border);
      padding-bottom: 0.5rem;
    }
    
    .emoji-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }
    
    .emoji-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--card-bg);
      border-radius: var(--radius);
      border: 1px solid var(--border);
      transition: all 0.3s ease;
    }
    
    .emoji-item:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow);
    }
    
    .emoji-display {
      font-size: 2rem;
      line-height: 1;
      min-width: 40px;
      text-align: center;
    }
    
    .emoji-info {
      flex: 1;
    }
    
    .emoji-name {
      font-weight: 600;
      color: var(--main-color);
      margin-bottom: 0.5rem;
    }
    
    .copy-btn {
      background: var(--accent);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background 0.3s ease;
    }
    
    .copy-btn:hover {
      background: var(--accent-hover);
    }
    
    .emoji-search {
      margin-bottom: 2rem;
    }
    
    .emoji-search input {
      width: 100%;
      max-width: 400px;
      padding: 1rem;
      border: 2px solid var(--border);
      border-radius: var(--radius);
      font-size: 1rem;
    }
    
    .emoji-stats {
      margin-top: 2rem;
      padding: 1rem;
      background: var(--card-bg);
      border-radius: var(--radius);
      text-align: center;
    }
    
    .no-results {
      text-align: center;
      color: #666;
      font-size: 1.2rem;
      margin: 2rem 0;
    }
  `;
  document.head.appendChild(style);
});