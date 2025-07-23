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
  
  // Get calculator data
  const calculators = window.calculatorSearchData && window.calculatorSearchData[lang] ? window.calculatorSearchData[lang] : [];
  
  function searchCalculators(query) {
    if (!query || query.length < 1) {
      return [];
    }
    
    // Search by first letter(s) - case insensitive
    const searchTerm = query.toLowerCase();
    return calculators.filter(calc => 
      calc.title.toLowerCase().startsWith(searchTerm)
    );
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
          window.location.href = link.href;
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
