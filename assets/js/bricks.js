document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('bricks-form');
  const result = document.getElementById('bricks-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const area = parseFloat(document.getElementById('bricks-area').value);
      const length = parseFloat(document.getElementById('bricks-length').value);
      const height = parseFloat(document.getElementById('bricks-height').value);
      const joint = parseFloat(document.getElementById('bricks-joint').value) || 0;
      if (area <= 0 || length <= 0 || height <= 0) {
        result.textContent = "Введіть площу стіни та розміри цегли.";
        return;
      }
      // Include mortar joint
      const brickArea = ((length + joint) / 1000) * ((height + joint) / 1000);
      const bricks = area / brickArea;
      result.innerHTML = `<b>Потрібно цегли:</b> ${Math.ceil(bricks)} шт.`;
    });
  }
});
