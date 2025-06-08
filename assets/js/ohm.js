document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('ohm-form');
  const result = document.getElementById('ohm-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const U = parseFloat(document.getElementById('ohm-u').value);
      const I = parseFloat(document.getElementById('ohm-i').value);
      const R = parseFloat(document.getElementById('ohm-r').value);
      let filled = [!isNaN(U), !isNaN(I), !isNaN(R)].filter(Boolean).length;
      if (filled !== 2) {
        result.textContent = "Введіть рівно два параметри.";
        return;
      }
      if (isNaN(U)) {
        result.innerHTML = `<b>Напруга (U):</b> ${(I * R).toFixed(4)} В`;
      } else if (isNaN(I)) {
        if (R === 0) {
          result.textContent = "Опір не може бути нулем при обчисленні струму.";
          return;
        }
        result.innerHTML = `<b>Сила струму (I):</b> ${(U / R).toFixed(4)} А`;
      } else if (isNaN(R)) {
        if (I === 0) {
          result.textContent = "Струм не може бути нулем при обчисленні опору.";
          return;
        }
        result.innerHTML = `<b>Опір (R):</b> ${(U / I).toFixed(4)} Ом`;
      }
    });
  }
});
