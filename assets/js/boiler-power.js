document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('boiler-power-form');
  const result = document.getElementById('boiler-power-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const area = parseFloat(document.getElementById('boiler-area').value);
      const height = parseFloat(document.getElementById('boiler-height').value);
      const insulation = parseFloat(document.getElementById('boiler-insulation').value);
      const region = parseFloat(document.getElementById('boiler-region').value);
      if (area <= 0 || height <= 0) {
        result.textContent = "Введіть площу та висоту.";
        return;
      }
      // Базова потужність: 1 кВт на 10 м² при стелі 2.5-2.7 м, помножити на коефіцієнти
      let base = area / 10;
      let volumeCoef = height / 2.7;
      let power = base * volumeCoef * insulation * region;
      result.innerHTML = `<b>Необхідна потужність котла:</b> ${power.toFixed(2)} кВт`;
    });
  }
});
