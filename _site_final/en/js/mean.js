document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('mean-form');
  const result = document.getElementById('mean-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = document.getElementById('mean-input').value;
      const numbers = input.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
      if (numbers.length === 0) {
        result.textContent = "Please enter at least one number separated by commas.";
        return;
      }
      const sum = numbers.reduce((s, n) => s + n, 0);
      const mean = sum / numbers.length;
      result.innerHTML = `<b>Arithmetic Mean:</b> ${mean.toFixed(4)}`;
    });
  }
});