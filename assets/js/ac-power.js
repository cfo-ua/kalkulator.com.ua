document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('ac-power-form');
  const result = document.getElementById('ac-power-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const area = parseFloat(document.getElementById('ac-area').value);
      const people = parseInt(document.getElementById('ac-people').value, 10) || 0;
      const windows = parseInt(document.getElementById('ac-windows').value, 10) || 0;
      if (area <= 0) {
        result.textContent = "Введіть площу кімнати.";
        return;
      }
      // Base: 0.1 kW per m²
      let power = area * 0.1;
      // Add 0.1 kW per extra person (except 1st)
      if (people > 0) power += people * 0.1;
      // Add 0.1 kW per window (sunlight)
      if (windows > 0) power += windows * 0.1;
      // Round up to nearest standard split (e.g. 2.0, 2.5, 3.5, 5.0)
      let standard = [2.0, 2.5, 3.5, 5.0, 7.0];
      let suggestion = standard.find(s => power <= s) || power.toFixed(1);
      result.innerHTML =
        `<b>Рекомендована потужність:</b> ${power.toFixed(2)} кВт<br>` +
        `<b>Типовий кондиціонер:</b> ${suggestion} кВт`;
    });
  }
});
