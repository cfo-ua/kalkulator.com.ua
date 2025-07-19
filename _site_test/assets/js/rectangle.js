document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('rectangle-form');
  const result = document.getElementById('rectangle-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const a = parseFloat(document.getElementById('rect-a').value);
      const b = parseFloat(document.getElementById('rect-b').value);
      if (a <= 0 || b <= 0) {
        result.textContent = "Введіть додатні значення сторін.";
        return;
      }
      const area = a * b;
      const perimeter = 2 * (a + b);
      result.innerHTML =
        `<b>Площа:</b> ${area.toFixed(4)}<br><b>Периметр:</b> ${perimeter.toFixed(4)}`;
    });
  }
});
