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
      const layerMultiplier = parseFloat(document.getElementById('bricks-layer').value); // 1, 2, 3, 4

      if (area <= 0 || length <= 0 || height <= 0 || width <= 0 || layerMultiplier <= 0) {
        result.textContent = "Введіть всі розміри цегли, площу стіни та тип кладки.";
        return;
      }

      const brickLength = (length + joint) / 1000; // м
      const brickHeight = (height + joint) / 1000; // м
      const brickWidth = (width + joint) / 1000;   // м

      const brickVolume = brickLength * brickHeight * brickWidth; // м³

      const wallThickness = brickWidth * layerMultiplier; // м
      const wallVolume = area * wallThickness; // м² × м = м³

      const bricks = wallVolume / brickVolume;

      result.innerHTML = `<b>Потрібно цегли:</b> ${Math.ceil(bricks)} шт.`;
    });
  }
});
