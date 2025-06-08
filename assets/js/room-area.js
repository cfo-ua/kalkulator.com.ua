document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('room-area-form');
  const result = document.getElementById('room-area-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const length = parseFloat(document.getElementById('room-length').value);
      const width = parseFloat(document.getElementById('room-width').value);
      if (length <= 0 || width <= 0) {
        result.textContent = "Введіть додатні значення довжини та ширини.";
        return;
      }
      const area = length * width;
      result.innerHTML = `<b>Площа кімнати:</b> ${area.toFixed(2)} м²`;
    });
  }
});
