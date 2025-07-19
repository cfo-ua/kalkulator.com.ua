document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('baseboard-form');
  const result = document.getElementById('baseboard-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const length = parseFloat(document.getElementById('baseboard-length').value);
      const width = parseFloat(document.getElementById('baseboard-width').value);
      const doors = parseFloat(document.getElementById('baseboard-doors').value) || 0;
      if (length <= 0 || width <= 0) {
        result.textContent = "Введіть довжину та ширину кімнати.";
        return;
      }
      const perimeter = 2 * (length + width);
      let baseboard = perimeter - doors;
      if (baseboard < 0) baseboard = 0;
      result.innerHTML = `<b>Потрібно плінтуса:</b> ${baseboard.toFixed(2)} м`;
    });
  }
});
