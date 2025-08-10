document.addEventListener("DOMContentLoaded", function () {
  // Wrap everything in a namespace to avoid conflicts
  (function() {
    
    // English motivational quotes database
    const englishQuotes = {
      success: [
        { text: "Success is the ability to go from one failure to another with no loss of enthusiasm.", author: "Winston Churchill" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
        { text: "Success is not the key to happiness. Happiness is the key to success.", author: "Albert Schweitzer" },
        { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
        { text: "Don't wait. The time will never be just right.", author: "Napoleon Hill" }
      ],
      motivation: [
        { text: "What doesn't kill you makes you stronger.", author: "Friedrich Nietzsche" },
        { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
        { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
        { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" }
      ],
      wisdom: [
        { text: "Wisdom comes from experience, and experience comes from mistakes.", author: "Folk Wisdom" },
        { text: "Knowledge is power, but wisdom is knowing how to use that power.", author: "Lao Tzu" },
        { text: "Time is the most valuable resource. You can't save it, but you can spend it wisely.", author: "Jim Rohn" },
        { text: "True wisdom is knowing that you know nothing.", author: "Socrates" },
        { text: "Life is what happens while you're making other plans.", author: "John Lennon" }
      ],
      development: [
        { text: "Invest in yourself. It's the best investment you'll ever make.", author: "Warren Buffett" },
        { text: "You'll never change your life until you change something you do daily.", author: "Mike Murdock" },
        { text: "Personal development is a process, not an event.", author: "John Maxwell" },
        { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
        { text: "Change is painful, but nothing is as painful as staying stuck somewhere you don't belong.", author: "Tony Robbins" }
      ],
      happiness: [
        { text: "Happiness is not a ready-made product. It comes from your own actions.", author: "Dalai Lama" },
        { text: "The happiest people don't have the best of everything, they make the best of everything.", author: "Folk Wisdom" },
        { text: "Happiness is found in the journey, not the destination.", author: "Ben Sweetland" },
        { text: "Smile, it's free therapy.", author: "Douglas Horton" },
        { text: "Happiness is when what you think, what you say, and what you do are in harmony.", author: "Mahatma Gandhi" }
      ],
      business: [
        { text: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.", author: "Steve Jobs" },
        { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
        { text: "Success in business requires training and discipline and hard work.", author: "David Rockefeller" },
        { text: "A customer is the most important visitor on our premises.", author: "Mahatma Gandhi" },
        { text: "Don't find fault, find a remedy.", author: "Henry Ford" }
      ],
      love: [
        { text: "Where there is love, there is life.", author: "Mahatma Gandhi" },
        { text: "Love is not something you find. Love is something that finds you.", author: "Loretta Young" },
        { text: "The best love is the kind that awakens the soul and makes us reach for more.", author: "Nicholas Sparks" },
        { text: "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.", author: "Lao Tzu" },
        { text: "Love is the only force capable of transforming an enemy into a friend.", author: "Martin Luther King Jr." }
      ],
      health: [
        { text: "Health is not everything, but without health, everything is nothing.", author: "Arthur Schopenhauer" },
        { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
        { text: "A healthy body is a guest chamber for the soul.", author: "Francis Bacon" },
        { text: "Early to bed and early to rise makes a man healthy, wealthy, and wise.", author: "Benjamin Franklin" },
        { text: "Exercise can replace many medicines, but no medicine can replace exercise.", author: "Tissot" }
      ]
    };

    // Application state
    let appState = {
      generatedCount: 0,
      savedQuotes: JSON.parse(localStorage.getItem('savedQuotesEn') || '[]'),
      favoriteCategory: localStorage.getItem('favoriteCategoryEn') || 'all',
      categoryStats: JSON.parse(localStorage.getItem('categoryStatsEn') || '{}')
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
        Object.values(englishQuotes).forEach(categoryQuotes => {
          quotesPool = quotesPool.concat(categoryQuotes);
        });
      } else if (englishQuotes[category]) {
        quotesPool = englishQuotes[category];
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
        all: 'General',
        success: 'Success',
        motivation: 'Motivation',
        wisdom: 'Wisdom',
        development: 'Development',
        happiness: 'Happiness',
        business: 'Business',
        love: 'Love',
        health: 'Health'
      };
      
      elements.quoteCategoryDisplay.textContent = categoryNames[category] || 'General';
      
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
        showNotification('Quote already saved!', 'warning');
        return;
      }
      
      // Add timestamp
      const savedQuote = {
        ...currentQuote,
        savedAt: new Date().toISOString()
      };
      
      appState.savedQuotes.push(savedQuote);
      localStorage.setItem('savedQuotesEn', JSON.stringify(appState.savedQuotes));
      
      updateStats();
      loadSavedQuotes();
      
      // Show saved quotes section
      elements.savedQuotesSection.style.display = 'block';
      
      showNotification('Quote saved!', 'success');
    }

    function shareQuote() {
      if (!currentQuote) return;
      
      const shareText = `"${currentQuote.text}" — ${currentQuote.author}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Motivational Quote',
          text: shareText,
          url: window.location.href
        });
      } else {
        // Fallback: copy to clipboard
        copyToClipboard(shareText);
        showNotification('Quote copied for sharing!', 'info');
      }
    }

    function copyQuote() {
      if (!currentQuote) return;
      
      const copyText = `"${currentQuote.text}" — ${currentQuote.author}`;
      copyToClipboard(copyText);
      showNotification('Quote copied!', 'success');
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
      Object.values(englishQuotes).forEach(categoryQuotes => {
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
        elements.savedQuotesList.innerHTML = '<p class="no-saved-quotes">No saved quotes</p>';
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
            <button onclick="copyQuoteText('${quote.text.replace(/'/g, "\\'")}', '${quote.author.replace(/'/g, "\\'")}')">📋 Copy</button>
            <button onclick="removeSavedQuote(${index})">🗑️ Delete</button>
          </div>
        `;
        elements.savedQuotesList.appendChild(quoteElement);
      });
    }

    // Global functions for saved quotes
    window.copyQuoteText = function(text, author) {
      copyToClipboard(`"${text}" — ${author}`);
      showNotification('Quote copied!', 'success');
    };

    window.removeSavedQuote = function(index) {
      appState.savedQuotes.splice(index, 1);
      localStorage.setItem('savedQuotesEn', JSON.stringify(appState.savedQuotes));
      updateStats();
      loadSavedQuotes();
      
      if (appState.savedQuotes.length === 0) {
        elements.savedQuotesSection.style.display = 'none';
      }
      
      showNotification('Quote deleted!', 'info');
    };

    function clearSavedQuotes() {
      if (confirm('Are you sure you want to delete all saved quotes?')) {
        appState.savedQuotes = [];
        localStorage.removeItem('savedQuotesEn');
        updateStats();
        loadSavedQuotes();
        elements.savedQuotesSection.style.display = 'none';
        showNotification('All saved quotes deleted!', 'info');
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
      localStorage.setItem('favoriteCategoryEn', maxCategory);
      localStorage.setItem('categoryStatsEn', JSON.stringify(appState.categoryStats));
    }

    function updateStats() {
      elements.generatedCount.textContent = appState.generatedCount;
      elements.savedCount.textContent = appState.savedQuotes.length;
      
      const categoryNames = {
        all: 'All categories',
        success: 'Success',
        motivation: 'Motivation',
        wisdom: 'Wisdom',
        development: 'Development',
        happiness: 'Happiness',
        business: 'Business',
        love: 'Love',
        health: 'Health'
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