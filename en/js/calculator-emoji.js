document.addEventListener("DOMContentLoaded", function () {
  const emojiCollection = document.getElementById('emoji-collection');
  const searchInput = document.getElementById('emoji-search');
  const totalEmojisSpan = document.getElementById('total-emojis');
  const copiedCountSpan = document.getElementById('copied-count');
  
  let copiedCount = 0;
  
  // Emoji data organized by categories
  const emojiData = {
    calculators: {
      title: "🧮 Calculators & Devices",
      emojis: [
        { emoji: "🧮", name: "Calculator", keywords: ["calculator", "computation", "math"] },
        { emoji: "💻", name: "Laptop", keywords: ["laptop", "computer", "calculation"] },
        { emoji: "🖥️", name: "Desktop", keywords: ["desktop", "computer", "monitor"] },
        { emoji: "⌨️", name: "Keyboard", keywords: ["keyboard", "input", "typing"] },
        { emoji: "🖱️", name: "Mouse", keywords: ["mouse", "click", "cursor"] },
        { emoji: "📱", name: "Phone", keywords: ["phone", "mobile", "calculator"] },
        { emoji: "⌚", name: "Watch", keywords: ["watch", "time", "calculation"] },
        { emoji: "📟", name: "Pager", keywords: ["pager", "device", "numbers"] }
      ]
    },
    numbers: {
      title: "🔢 Numbers & Digits",
      emojis: [
        { emoji: "0️⃣", name: "Zero", keywords: ["0", "zero", "number"] },
        { emoji: "1️⃣", name: "One", keywords: ["1", "one", "number"] },
        { emoji: "2️⃣", name: "Two", keywords: ["2", "two", "number"] },
        { emoji: "3️⃣", name: "Three", keywords: ["3", "three", "number"] },
        { emoji: "4️⃣", name: "Four", keywords: ["4", "four", "number"] },
        { emoji: "5️⃣", name: "Five", keywords: ["5", "five", "number"] },
        { emoji: "6️⃣", name: "Six", keywords: ["6", "six", "number"] },
        { emoji: "7️⃣", name: "Seven", keywords: ["7", "seven", "number"] },
        { emoji: "8️⃣", name: "Eight", keywords: ["8", "eight", "number"] },
        { emoji: "9️⃣", name: "Nine", keywords: ["9", "nine", "number"] },
        { emoji: "🔟", name: "Ten", keywords: ["10", "ten", "number"] },
        { emoji: "#️⃣", name: "Number Sign", keywords: ["number", "hash", "symbol"] },
        { emoji: "*️⃣", name: "Asterisk", keywords: ["asterisk", "multiply", "symbol"] }
      ]
    },
    operations: {
      title: "➕ Mathematical Operations",
      emojis: [
        { emoji: "➕", name: "Plus", keywords: ["plus", "addition", "add"] },
        { emoji: "➖", name: "Minus", keywords: ["minus", "subtraction", "subtract"] },
        { emoji: "✖️", name: "Multiply", keywords: ["multiply", "times", "cross"] },
        { emoji: "➗", name: "Divide", keywords: ["divide", "division", "split"] },
        { emoji: "🟰", name: "Equals", keywords: ["equals", "result", "same"] },
        { emoji: "💯", name: "Hundred", keywords: ["100", "percent", "complete"] },
        { emoji: "🔢", name: "Numbers", keywords: ["numbers", "digits", "math"] },
        { emoji: "🔣", name: "Symbols", keywords: ["symbols", "signs", "math"] },
        { emoji: "〰️", name: "Wave", keywords: ["wave", "approximately", "tilde"] },
        { emoji: "💱", name: "Currency", keywords: ["currency", "exchange", "money"] }
      ]
    },
    charts: {
      title: "📊 Charts & Graphs",
      emojis: [
        { emoji: "📊", name: "Bar Chart", keywords: ["chart", "graph", "statistics"] },
        { emoji: "📈", name: "Trending Up", keywords: ["graph", "growth", "profit"] },
        { emoji: "📉", name: "Trending Down", keywords: ["graph", "decline", "loss"] },
        { emoji: "💹", name: "Stock Chart", keywords: ["stock", "trading", "market"] },
        { emoji: "🗠", name: "Presentation", keywords: ["presentation", "slide", "chart"] },
        { emoji: "📋", name: "Clipboard", keywords: ["clipboard", "list", "data"] },
        { emoji: "🗃️", name: "File Cabinet", keywords: ["cabinet", "files", "data"] },
        { emoji: "📑", name: "Pages", keywords: ["pages", "documents", "report"] }
      ]
    },
    geometry: {
      title: "📐 Geometry & Measurement",
      emojis: [
        { emoji: "📏", name: "Ruler", keywords: ["ruler", "measurement", "length"] },
        { emoji: "📐", name: "Triangle", keywords: ["triangle", "protractor", "geometry"] },
        { emoji: "🟫", name: "Brown Square", keywords: ["square", "shape", "geometry"] },
        { emoji: "🔴", name: "Red Circle", keywords: ["circle", "round", "shape"] },
        { emoji: "🔵", name: "Blue Circle", keywords: ["circle", "blue", "shape"] },
        { emoji: "🔶", name: "Orange Diamond", keywords: ["diamond", "orange", "shape"] },
        { emoji: "🔷", name: "Blue Diamond", keywords: ["diamond", "blue", "shape"] },
        { emoji: "🔸", name: "Small Diamond", keywords: ["diamond", "small", "shape"] }
      ]
    },
    special: {
      title: "🎯 Special Symbols",
      emojis: [
        { emoji: "∞", name: "Infinity", keywords: ["infinity", "endless", "math"] },
        { emoji: "√", name: "Square Root", keywords: ["root", "square", "math"] },
        { emoji: "π", name: "Pi", keywords: ["pi", "number", "geometry"] },
        { emoji: "°", name: "Degree", keywords: ["degree", "temperature", "angle"] },
        { emoji: "±", name: "Plus Minus", keywords: ["plus", "minus", "approximately"] },
        { emoji: "≈", name: "Approximately", keywords: ["approximately", "about", "close"] },
        { emoji: "≠", name: "Not Equal", keywords: ["not", "equal", "different"] },
        { emoji: "≤", name: "Less Equal", keywords: ["less", "equal", "inequality"] },
        { emoji: "≥", name: "Greater Equal", keywords: ["greater", "equal", "inequality"] },
        { emoji: "∑", name: "Sum", keywords: ["sum", "sigma", "addition"] },
        { emoji: "∏", name: "Product", keywords: ["product", "multiplication", "pi"] },
        { emoji: "∫", name: "Integral", keywords: ["integral", "calculus", "math"] }
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
    notification.textContent = '✅ Copied!';
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
                <button class="copy-btn" onclick="copyEmoji('${item.emoji}')" title="Copy ${item.name}">
                  📋 Copy
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      
      emojiCollection.appendChild(categoryDiv);
    });
    
    if (emojiCollection.innerHTML === '') {
      emojiCollection.innerHTML = '<p class="no-results">😔 No emojis found for your search.</p>';
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