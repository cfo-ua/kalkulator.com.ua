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
