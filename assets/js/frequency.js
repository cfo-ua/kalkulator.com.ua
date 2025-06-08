document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('frequency-form');
  const result = document.getElementById('frequency-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const T = parseFloat(document.getElementById('freq-t').value);
      const f = parseFloat(document.getElementById('freq-f').value);
      if (!isNaN(T) && T > 0 && (isNaN(f) || f === 0)) {
        result.innerHTML = `<b>Частота (f):</b> ${(1 / T).toFixed(4)} Гц`;
      } else if (!isNaN(f) && f > 0 && (isNaN(T) || T === 0)) {
        result.innerHTML = `<b>Період (T):</b> ${(1 / f).toFixed(4)} с`;
      } else {
        result.textContent = "Введіть або період, або частоту (лише одне значення)!";
      }
    });
  }
});
