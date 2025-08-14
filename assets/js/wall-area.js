document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('wall-area-form');
  const result = document.getElementById('wall-area-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const length = parseFloat(document.getElementById('wall-length').value);
      const width = parseFloat(document.getElementById('wall-width').value);
      const height = parseFloat(document.getElementById('wall-height').value);
      const doors = parseFloat(document.getElementById('wall-doors').value) || 0;
      if (length <= 0 || width <= 0 || height <= 0) {
        result.textContent = "Введіть довжину, ширину та висоту кімнати.";
        return;
      }
      // Периметр = 2*(довжина+ширина)
      let perimeter = 2 * (length + width);
      let area = perimeter * height - doors;
      if (area < 0) area = 0;
      result.innerHTML = `<b>Площа стін:</b> ${area.toFixed(2)} м²`;
    });
  }
});
