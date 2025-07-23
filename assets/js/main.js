// Responsive navigation for mobile (Apple-like animation)
document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.querySelector(".menu-btn");
  const navLinks = document.querySelector(".nav-links");
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", function () {
      navLinks.classList.toggle("open");
    });
    // Optional: close menu when clicking outside or on a link (mobile UX)
    document.body.addEventListener("click", function(e) {
      if (
        navLinks.classList.contains("open") &&
        !navLinks.contains(e.target) &&
        !menuBtn.contains(e.target)
      ) {
        navLinks.classList.remove("open");
      }
    });
    navLinks.querySelectorAll("a").forEach(link =>
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
      })
    );
  }
});

// Global error handler to suppress DataCloneError from external scripts
window.addEventListener('error', function(event) {
  // Suppress DataCloneError from external analytics/ad scripts
  if (event.error && event.error.name === 'DataCloneError' && 
      event.error.message && event.error.message.includes('postMessage')) {
    console.warn('Suppressed DataCloneError from external script:', event.error.message);
    event.preventDefault();
    return false;
  }
});

// Also handle unhandled promise rejections that might contain DataCloneError
window.addEventListener('unhandledrejection', function(event) {
  if (event.reason && event.reason.name === 'DataCloneError' && 
      event.reason.message && event.reason.message.includes('postMessage')) {
    console.warn('Suppressed DataCloneError promise rejection from external script:', event.reason.message);
    event.preventDefault();
  }
});

// Calculator Search Functionality
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById('calculatorSearch');
  const searchResults = document.getElementById('searchResults');
  
  if (!searchInput || !searchResults) return;
  
  // Determine language based on URL
  const isEnglish = window.location.pathname.includes('/en/');
  const lang = isEnglish ? 'en' : 'uk';
  
  // Get calculator data with validation
  const calculators = window.calculatorSearchData && window.calculatorSearchData[lang] ? window.calculatorSearchData[lang] : [];
  
  // Debug information
  console.log('Search initialized:', {
    language: lang,
    calculatorCount: calculators.length,
    sampleCalculators: calculators.slice(0, 3).map(c => ({ title: c.title, url: c.url }))
  });
  
  // Validate calculator data
  const invalidCalculators = calculators.filter(calc => !calc.url || !calc.title);
  if (invalidCalculators.length > 0) {
    console.warn('Found calculators with invalid data:', invalidCalculators);
  }
  
  function searchCalculators(query) {
    if (!query || query.length < 1) {
      return [];
    }
    
    // Search within all words - case insensitive
    const searchTerm = query.toLowerCase();
    return calculators.filter(calc => 
      calc.title.toLowerCase().includes(searchTerm)
    );
  }
  
  // Enhanced error handling and user feedback for navigation issues
  function handleNavigationError(url, title) {
    console.error('Navigation failed for:', title, 'URL:', url);
    
    // Show user-friendly error message with suggestions
    const errorMsg = isEnglish 
      ? `The calculator "${title}" might be temporarily unavailable. Please try:\n• Refreshing the page\n• Using the category menu to browse calculators\n• Checking your internet connection`
      : `Калькулятор "${title}" може бути тимчасово недоступний. Спробуйте:\n• Оновити сторінку\n• Скористатися меню категорій\n• Перевірити з'єднання з інтернетом`;
    
    alert(errorMsg);
    
    // Optionally redirect to home page or categories after a delay
    setTimeout(() => {
      const homeUrl = isEnglish ? '/en/' : '/';
      if (confirm(isEnglish ? 'Go to home page?' : 'Перейти на головну сторінку?')) {
        window.location.href = homeUrl;
      }
    }, 1000);
  }

  // Handle link clicks with robust URL fallback for Jekyll sites
  function handleLinkClick(url, title) {
    console.log('Navigating to:', title, 'URL:', url);
    
    // Add some basic validation
    if (!url || !url.startsWith('/')) {
      console.error('Invalid URL:', url);
      handleNavigationError(url, title);
      return;
    }
    
    // For Jekyll sites, there can be URL format inconsistencies
    // The URLs in search data should be correct based on Jekyll collection permalinks
    try {
      window.location.href = url;
    } catch (error) {
      console.error('Navigation error:', error);
      handleNavigationError(url, title);
    }
  }
  
  function displayResults(results) {
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
      const noResults = document.createElement('div');
      noResults.className = 'search-no-results';
      noResults.textContent = isEnglish ? 'No calculators found' : 'Калькулятори не знайдено';
      searchResults.appendChild(noResults);
      searchResults.classList.add('show');
      return;
    }
    
    results.forEach(calc => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      
      const link = document.createElement('a');
      link.href = calc.url;
      link.textContent = calc.title;
      
      // Add click event listener for debugging and handling
      link.addEventListener('click', function(e) {
        e.preventDefault();
        handleLinkClick(calc.url, calc.title);
      });
      
      item.appendChild(link);
      searchResults.appendChild(item);
    });
    
    searchResults.classList.add('show');
  }
  
  function hideResults() {
    searchResults.classList.remove('show');
  }
  
  // Search input event listener
  searchInput.addEventListener('input', function(e) {
    const query = e.target.value.trim();
    
    if (query.length === 0) {
      hideResults();
      return;
    }
    
    const results = searchCalculators(query);
    displayResults(results);
  });
  
  // Hide results when clicking outside
  document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      hideResults();
    }
  });
  
  // Handle keyboard navigation
  searchInput.addEventListener('keydown', function(e) {
    const items = searchResults.querySelectorAll('.search-result-item');
    const activeItem = searchResults.querySelector('.search-result-item.active');
    
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      
      if (items.length === 0) return;
      
      // Remove current active state
      if (activeItem) {
        activeItem.classList.remove('active');
      }
      
      let nextIndex = 0;
      if (activeItem) {
        const currentIndex = Array.from(items).indexOf(activeItem);
        if (e.key === 'ArrowDown') {
          nextIndex = (currentIndex + 1) % items.length;
        } else {
          nextIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
        }
      }
      
      items[nextIndex].classList.add('active');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const activeItem = searchResults.querySelector('.search-result-item.active');
      if (activeItem) {
        const link = activeItem.querySelector('a');
        if (link) {
          // Find the calculator data for this link
          const calculatorTitle = link.textContent;
          const calculatorUrl = link.href;
          handleLinkClick(calculatorUrl, calculatorTitle);
        }
      }
    } else if (e.key === 'Escape') {
      hideResults();
      searchInput.blur();
    }
  });
  
  // Add active state styles
  const style = document.createElement('style');
  style.textContent = `
    .search-result-item.active {
      background: var(--card-bg);
      border-left: 3px solid var(--accent);
    }
  `;
  document.head.appendChild(style);
});
