document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('tile-form');
  const result = document.getElementById('tile-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const area = parseFloat(document.getElementById('tile-area').value);
      const length = parseFloat(document.getElementById('tile-length').value);
      const width = parseFloat(document.getElementById('tile-width').value);
      const waste = parseFloat(document.getElementById('tile-waste').value);
      if (area <= 0 || length <= 0 || width <= 0) {
        result.textContent = "Введіть всі параметри.";
        return;
      }
      const tileArea = (length / 100) * (width / 100); // см² -> м²
      let tiles = area / tileArea;
      tiles *= 1 + (waste / 100);
      result.innerHTML = `<b>Потрібно плитки:</b> ${Math.ceil(tiles)} шт.`;
    });
  }
});
