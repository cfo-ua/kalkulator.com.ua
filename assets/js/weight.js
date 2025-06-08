document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('weight-form');
  const result = document.getElementById('weight-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const m = parseFloat(document.getElementById('weight-m').value);
      if (m < 0) {
        result.textContent = "Маса не може бути відʼємною.";
        return;
      }
      const g = 9.81;
      const F = m * g;
      result.innerHTML = `<b>Сила тяжіння:</b> ${F.toFixed(3)} Н`;
    });
  }
});
