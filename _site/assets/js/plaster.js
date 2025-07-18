document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('plaster-form');
  const result = document.getElementById('plaster-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const area = parseFloat(document.getElementById('plaster-area').value);
      const thickness = parseFloat(document.getElementById('plaster-thickness').value);
      if (area <= 0 || thickness <= 0) {
        result.textContent = "Введіть площу та товщину шару.";
        return;
      }
      // thickness in mm, area in m², result in m³
      const volume = area * (thickness / 1000);
      result.innerHTML = `<b>Потрібно штукатурки:</b> ${volume.toFixed(2)} м³`;
    });
  }
});
