document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('wall-area-form');
  const result = document.getElementById('wall-area-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const perimeter = parseFloat(document.getElementById('wall-perimeter').value);
      const height = parseFloat(document.getElementById('wall-height').value);
      const doors = parseFloat(document.getElementById('wall-doors').value) || 0;
      if (perimeter <= 0 || height <= 0) {
        result.textContent = "Введіть периметр та висоту стін.";
        return;
      }
      let area = perimeter * height - doors;
      if (area < 0) area = 0;
      result.innerHTML = `<b>Площа стін:</b> ${area.toFixed(2)} м²`;
    });
  }
});
