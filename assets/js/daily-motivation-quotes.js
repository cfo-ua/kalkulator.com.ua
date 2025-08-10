document.addEventListener("DOMContentLoaded", function () {
  // Wrap everything in a namespace to avoid conflicts
  (function() {
    
    // Ukrainian motivational quotes database
    const ukrainianQuotes = {
      success: [
        { text: "Успіх — це здатність йти від невдачі до невдачі, не втрачаючи ентузіазму.", author: "Вінстон Черчілль" },
        { text: "Майбутнє належить тим, хто вірить у красу своїх мрій.", author: "Елеонора Рузвельт" },
        { text: "Успіх — це не ключ до щастя. Щастя — це ключ до успіху.", author: "Альберт Швейцер" },
        { text: "Єдиний неможливий шлях — це той, який ви не почали.", author: "Тоні Роббінс" },
        { text: "Не чекайте. Час ніколи не буде ідеальним.", author: "Наполеон Хілл" }
      ],
      motivation: [
        { text: "Те, що не вбиває нас, робить нас сильнішими.", author: "Фрідріх Ніцше" },
        { text: "Починайте там, де ви є. Використовуйте те, що маєте. Робіть те, що можете.", author: "Артур Еш" },
        { text: "Мотивація — це те, що змушує вас почати. Звичка — це те, що змушує продовжувати.", author: "Джим Рюн" },
        { text: "Падіння не є невдачею. Невдача — це залишатися там, де ви впали.", author: "Соічіро Хонда" },
        { text: "Єдиний спосіб робити чудову роботу — це любити те, що ви робите.", author: "Стів Джобс" }
      ],
      wisdom: [
        { text: "Мудрість приходить з досвідом, а досвід приходить з помилками.", author: "Народна мудрість" },
        { text: "Знання — це сила, але мудрість — це вміння використовувати цю силу.", author: "Лао Цзи" },
        { text: "Час — найцінніший ресурс. Ви не можете зберегти його, але можете витратити мудро.", author: "Джим Рон" },
        { text: "Справжня мудрість полягає в тому, щоб знати, що ти нічого не знаєш.", author: "Сократ" },
        { text: "Життя — це те, що з вами відбувається, поки ви будуєте інші плани.", author: "Джон Леннон" }
      ],
      development: [
        { text: "Інвестуйте в себе. Це найкраща інвестиція, яку ви коли-небудь зробите.", author: "Воррен Баффет" },
        { text: "Ви ніколи не зможете змінити своє життя, не змінивши щось, що робите щодня.", author: "Майк Мердок" },
        { text: "Особистісний розвиток — це процес, а не подія.", author: "Джон Максвелл" },
        { text: "Станьте кращою версією себе, а не копією когось іншого.", author: "Judy Garland" },
        { text: "Зміни болючі, але ніщо не болить так, як залишатися на місці.", author: "Тоні Роббінс" }
      ],
      happiness: [
        { text: "Щастя — це не готовий продукт. Воно походить від ваших власних дій.", author: "Далай-лама" },
        { text: "Найщасливіші люди не мають найкращого з усього, вони роблять найкраще з того, що мають.", author: "Народна мудрість" },
        { text: "Щастя знаходиться в подорожі, а не в пункті призначення.", author: "Бен Світленд" },
        { text: "Посміхайтеся, це безкоштовна терапія.", author: "Дуглас Хортон" },
        { text: "Щастя — це коли те, що ви думаєте, говорите і робите, знаходиться в гармонії.", author: "Махатма Ганді" }
      ],
      business: [
        { text: "Ваша робота займе велику частину життя, і єдиний спосіб бути справді задоволеним — робити те, що ви вважаєте чудовою роботою.", author: "Стів Джобс" },
        { text: "Інновації відрізняють лідера від послідовника.", author: "Стів Джобс" },
        { text: "Успіх у бізнесі залежить від людей, які готові зробити те, що інші не хочуть робити.", author: "Джон Максвелл" },
        { text: "Клієнт — це найважливіший відвідувач нашого офісу.", author: "Махатма Ганді" },
        { text: "Не шукайте провину. Шукайте рішення.", author: "Генрі Форд" }
      ],
      love: [
        { text: "Там, де панує любов, неможливі речі стають можливими.", author: "Народна мудрість" },
        { text: "Любов — це не те, що ви знаходите. Любов — це те, що знаходить вас.", author: "Лоретта Янг" },
        { text: "Найкраща любов — це та, що пробуджує душу і змушує тягнутися до більшого.", author: "Ніколас Спаркс" },
        { text: "Бути глибоко коханим дає вам силу, а глибоко любити дає вам мужність.", author: "Лао Цзи" },
        { text: "Любов — це єдина сила, здатна перетворити ворога на друга.", author: "Мартін Лютер Кінг молодший" }
      ],
      health: [
        { text: "Здоров'я — це не все, але без здоров'я все — ніщо.", author: "Артур Шопенгауер" },
        { text: "Турбуйтеся про своє тіло. Це єдине місце, де вам доведеться жити.", author: "Джим Рон" },
        { text: "Здорове тіло — це дім для здорової душі.", author: "Народна мудрість" },
        { text: "Ранні години ранку мають золото в роті.", author: "Бенджамін Франклін" },
        { text: "Фізичні вправи можуть замінити багато ліків, але жоден лік не може замінити фізичних вправ.", author: "Тіссо" }
      ]
    };

    // Application state
    let appState = {
      generatedCount: 0,
      savedQuotes: JSON.parse(localStorage.getItem('savedQuotes') || '[]'),
      favoriteCategory: localStorage.getItem('favoriteCategory') || 'all',
      categoryStats: JSON.parse(localStorage.getItem('categoryStats') || '{}')
    };

    // DOM elements
    const elements = {
      intro: document.getElementById('quotes-intro'),
      quoteDisplay: document.getElementById('quote-display'),
      categorySelect: document.getElementById('quote-category'),
      generateBtn: document.getElementById('generate-quote'),
      newQuoteBtn: document.getElementById('new-quote'),
      saveQuoteBtn: document.getElementById('save-quote'),
      shareQuoteBtn: document.getElementById('share-quote'),
      copyQuoteBtn: document.getElementById('copy-quote'),
      quoteText: document.getElementById('quote-text'),
      quoteAuthor: document.getElementById('quote-author'),
      quoteCategoryDisplay: document.getElementById('quote-category-display'),
      dailyQuote: document.getElementById('daily-quote-content'),
      savedQuotesSection: document.getElementById('saved-quotes'),
      savedQuotesList: document.getElementById('saved-quotes-list'),
      clearSavedBtn: document.getElementById('clear-saved'),
      generatedCount: document.getElementById('generated-count'),
      savedCount: document.getElementById('saved-count'),
      favoriteCategory: document.getElementById('favorite-category')
    };

    // Current displayed quote
    let currentQuote = null;

    // Event listeners
    elements.generateBtn.addEventListener('click', generateQuote);
    elements.newQuoteBtn.addEventListener('click', generateQuote);
    elements.saveQuoteBtn.addEventListener('click', saveQuote);
    elements.shareQuoteBtn.addEventListener('click', shareQuote);
    elements.copyQuoteBtn.addEventListener('click', copyQuote);
    elements.clearSavedBtn.addEventListener('click', clearSavedQuotes);

    // Initialize app
    function init() {
      generateDailyQuote();
      updateStats();
      loadSavedQuotes();
      
      // Show saved quotes section if there are saved quotes
      if (appState.savedQuotes.length > 0) {
        elements.savedQuotesSection.style.display = 'block';
      }
    }

    function generateQuote() {
      const category = elements.categorySelect.value;
      const quote = getRandomQuote(category);
      
      if (quote) {
        displayQuote(quote, category);
        updateGeneratedCount();
        updateCategoryStats(category);
        
        // Show quote display section
        elements.quoteDisplay.style.display = 'block';
        
        // Smooth scroll to quote
        elements.quoteDisplay.scrollIntoView({ behavior: 'smooth' });
      }
    }

    function getRandomQuote(category) {
      let quotesPool = [];
      
      if (category === 'all') {
        // Collect all quotes from all categories
        Object.values(ukrainianQuotes).forEach(categoryQuotes => {
          quotesPool = quotesPool.concat(categoryQuotes);
        });
      } else if (ukrainianQuotes[category]) {
        quotesPool = ukrainianQuotes[category];
      }
      
      if (quotesPool.length === 0) return null;
      
      const randomIndex = Math.floor(Math.random() * quotesPool.length);
      return quotesPool[randomIndex];
    }

    function displayQuote(quote, category) {
      currentQuote = { ...quote, category };
      
      elements.quoteText.textContent = quote.text;
      elements.quoteAuthor.textContent = `— ${quote.author}`;
      
      // Display category
      const categoryNames = {
        all: 'Загальні',
        success: 'Успіх',
        motivation: 'Мотивація',
        wisdom: 'Мудрість',
        development: 'Розвиток',
        happiness: 'Щастя',
        business: 'Бізнес',
        love: 'Любов',
        health: 'Здоров\'я'
      };
      
      elements.quoteCategoryDisplay.textContent = categoryNames[category] || 'Загальні';
      
      // Add animation
      elements.quoteDisplay.style.opacity = '0';
      setTimeout(() => {
        elements.quoteDisplay.style.opacity = '1';
      }, 100);
    }

    function saveQuote() {
      if (!currentQuote) return;
      
      // Check if quote is already saved
      const isAlreadySaved = appState.savedQuotes.some(saved => 
        saved.text === currentQuote.text && saved.author === currentQuote.author
      );
      
      if (isAlreadySaved) {
        showNotification('Цитата вже збережена!', 'warning');
        return;
      }
      
      // Add timestamp
      const savedQuote = {
        ...currentQuote,
        savedAt: new Date().toISOString()
      };
      
      appState.savedQuotes.push(savedQuote);
      localStorage.setItem('savedQuotes', JSON.stringify(appState.savedQuotes));
      
      updateStats();
      loadSavedQuotes();
      
      // Show saved quotes section
      elements.savedQuotesSection.style.display = 'block';
      
      showNotification('Цитата збережена!', 'success');
    }

    function shareQuote() {
      if (!currentQuote) return;
      
      const shareText = `"${currentQuote.text}" — ${currentQuote.author}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Мотиваційна цитата',
          text: shareText,
          url: window.location.href
        });
      } else {
        // Fallback: copy to clipboard
        copyToClipboard(shareText);
        showNotification('Цитата скопійована для поширення!', 'info');
      }
    }

    function copyQuote() {
      if (!currentQuote) return;
      
      const copyText = `"${currentQuote.text}" — ${currentQuote.author}`;
      copyToClipboard(copyText);
      showNotification('Цитата скопійована!', 'success');
    }

    function copyToClipboard(text) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    }

    function generateDailyQuote() {
      // Generate daily quote based on current date
      const today = new Date();
      const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
      
      // Use day of year as seed for consistent daily quote
      let allQuotes = [];
      Object.values(ukrainianQuotes).forEach(categoryQuotes => {
        allQuotes = allQuotes.concat(categoryQuotes);
      });
      
      const dailyIndex = dayOfYear % allQuotes.length;
      const dailyQuote = allQuotes[dailyIndex];
      
      if (dailyQuote) {
        elements.dailyQuote.innerHTML = `
          <blockquote class="daily-quote-text">"${dailyQuote.text}"</blockquote>
          <div class="daily-quote-author">— ${dailyQuote.author}</div>
        `;
      }
    }

    function loadSavedQuotes() {
      elements.savedQuotesList.innerHTML = '';
      
      if (appState.savedQuotes.length === 0) {
        elements.savedQuotesList.innerHTML = '<p class="no-saved-quotes">Немає збережених цитат</p>';
        return;
      }
      
      // Sort by saved date (newest first)
      const sortedQuotes = [...appState.savedQuotes].sort((a, b) => 
        new Date(b.savedAt) - new Date(a.savedAt)
      );
      
      sortedQuotes.forEach((quote, index) => {
        const quoteElement = document.createElement('div');
        quoteElement.className = 'saved-quote-item';
        quoteElement.innerHTML = `
          <div class="saved-quote-text">"${quote.text}"</div>
          <div class="saved-quote-author">— ${quote.author}</div>
          <div class="saved-quote-actions">
            <button onclick="copyQuoteText('${quote.text}', '${quote.author}')">📋 Копіювати</button>
            <button onclick="removeSavedQuote(${index})">🗑️ Видалити</button>
          </div>
        `;
        elements.savedQuotesList.appendChild(quoteElement);
      });
    }

    // Global functions for saved quotes
    window.copyQuoteText = function(text, author) {
      copyToClipboard(`"${text}" — ${author}`);
      showNotification('Цитата скопійована!', 'success');
    };

    window.removeSavedQuote = function(index) {
      appState.savedQuotes.splice(index, 1);
      localStorage.setItem('savedQuotes', JSON.stringify(appState.savedQuotes));
      updateStats();
      loadSavedQuotes();
      
      if (appState.savedQuotes.length === 0) {
        elements.savedQuotesSection.style.display = 'none';
      }
      
      showNotification('Цитата видалена!', 'info');
    };

    function clearSavedQuotes() {
      if (confirm('Ви впевнені, що хочете видалити всі збережені цитати?')) {
        appState.savedQuotes = [];
        localStorage.removeItem('savedQuotes');
        updateStats();
        loadSavedQuotes();
        elements.savedQuotesSection.style.display = 'none';
        showNotification('Всі збережені цитати видалені!', 'info');
      }
    }

    function updateGeneratedCount() {
      appState.generatedCount++;
      updateStats();
    }

    function updateCategoryStats(category) {
      if (!appState.categoryStats[category]) {
        appState.categoryStats[category] = 0;
      }
      appState.categoryStats[category]++;
      
      // Update favorite category
      const maxCategory = Object.keys(appState.categoryStats).reduce((a, b) => 
        appState.categoryStats[a] > appState.categoryStats[b] ? a : b
      );
      
      appState.favoriteCategory = maxCategory;
      localStorage.setItem('favoriteCategory', maxCategory);
      localStorage.setItem('categoryStats', JSON.stringify(appState.categoryStats));
    }

    function updateStats() {
      elements.generatedCount.textContent = appState.generatedCount;
      elements.savedCount.textContent = appState.savedQuotes.length;
      
      const categoryNames = {
        all: 'Всі категорії',
        success: 'Успіх',
        motivation: 'Мотивація',
        wisdom: 'Мудрість',
        development: 'Розвиток',
        happiness: 'Щастя',
        business: 'Бізнес',
        love: 'Любов',
        health: 'Здоров\'я'
      };
      
      elements.favoriteCategory.textContent = categoryNames[appState.favoriteCategory] || '-';
    }

    function showNotification(message, type = 'info') {
      const notification = document.createElement('div');
      notification.className = 'copy-notification';
      notification.textContent = message;
      
      // Set color based on type
      const colors = {
        success: '#28a745',
        warning: '#ffc107',
        info: '#17a2b8',
        danger: '#dc3545'
      };
      
      notification.style.backgroundColor = colors[type] || colors.info;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 2000);
    }

    // Initialize the application
    init();
    
  })();
});