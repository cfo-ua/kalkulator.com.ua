document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('energy-form');
  const result = document.getElementById('energy-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const m = parseFloat(document.getElementById('energy-m').value);
      const h = parseFloat(document.getElementById('energy-h').value);
      const v = parseFloat(document.getElementById('energy-v').value);
      if (m < 0) {
        result.textContent = "Маса не може бути відʼємною.";
        return;
      }
      const g = 9.81;
      const PE = m * g * h;
      const KE = 0.5 * m * v * v;
      const E = PE + KE;
      result.innerHTML =
        `<b>Потенціальна енергія (Eₚ):</b> ${PE.toFixed(3)} Дж<br>` +
        `<b>Кінетична енергія (Eₖ):</b> ${KE.toFixed(3)} Дж<br>` +
        `<b>Повна механічна енергія:</b> ${E.toFixed(3)} Дж`;
    });
  }
});
