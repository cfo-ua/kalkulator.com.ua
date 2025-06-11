document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('bricks-form');
  const result = document.getElementById('bricks-result');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const area = parseFloat(document.getElementById('bricks-area').value);
      const length = parseFloat(document.getElementById('bricks-length').value);
      const height = parseFloat(document.getElementById('bricks-height').value);
      const width = parseFloat(document.getElementById('bricks-width').value);
      const joint = parseFloat(document.getElementById('bricks-joint').value) || 0;

      if (area <= 0 || length <= 0 || height <= 0 || width <= 0) {
        result.textContent = "Введіть всі розміри цегли та площу стіни.";
        return;
      }

      // Площа кладки: задана користувачем (м²)
      // Обʼєм однієї цегли з урахуванням швів
      const brickLength = (length + joint) / 1000; // у метрах
      const brickHeight = (height + joint) / 1000;
      const brickWidth = (width + joint) / 1000;

      const brickFaceArea = brickLength * brickHeight; // м² (передня площа цегли)
      const brickVolume = brickLength * brickHeight * brickWidth; // м³

      // Об'єм кладки: площа × ширина стіни
      const wallVolume = area * brickWidth;

      const bricks = wallVolume / brickVolume;

      result.innerHTML = `<b>Потрібно цегли:</b> ${Math.ceil(bricks)} шт.`;
    });
  }
});
