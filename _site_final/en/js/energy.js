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
        result.textContent = "Mass cannot be negative.";
        return;
      }
      const g = 9.81;
      const PE = m * g * h;
      const KE = 0.5 * m * v * v;
      const E = PE + KE;
      result.innerHTML =
        `<b>Potential Energy (PE):</b> ${PE.toFixed(3)} J<br>` +
        `<b>Kinetic Energy (KE):</b> ${KE.toFixed(3)} J<br>` +
        `<b>Total Mechanical Energy:</b> ${E.toFixed(3)} J`;
    });
  }
});