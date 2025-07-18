document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('sphere-form');
  const result = document.getElementById('sphere-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const R = parseFloat(document.getElementById('sphere-r').value);
      if (R <= 0) {
        result.textContent = "Please enter a positive radius.";
        return;
      }
      const S = 4 * Math.PI * R * R;
      const V = (4 / 3) * Math.PI * R * R * R;
      result.innerHTML =
        `<b>Surface Area:</b> ${S.toFixed(4)}<br><b>Volume:</b> ${V.toFixed(4)}`;
    });
  }
});