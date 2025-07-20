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
