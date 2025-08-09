document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('concrete-form');
  const result = document.getElementById('concrete-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const length = parseFloat(document.getElementById('concrete-length').value);
      const width = parseFloat(document.getElementById('concrete-width').value);
      const height = parseFloat(document.getElementById('concrete-height').value);
      if (length <= 0 || width <= 0 || height <= 0) {
        result.textContent = "Введіть всі параметри.";
        return;
      }
      const volume = length * width * height;
      result.innerHTML = `<b>Обʼєм бетону:</b> ${volume.toFixed(2)} м³`;
    });
  }
});
