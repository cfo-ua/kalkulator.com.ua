document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('frequency-form');
  const result = document.getElementById('frequency-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const T = parseFloat(document.getElementById('freq-t').value);
      const f = parseFloat(document.getElementById('freq-f').value);
      if (!isNaN(T) && T > 0 && (isNaN(f) || f === 0)) {
        result.innerHTML = `<b>Frequency (f):</b> ${(1 / T).toFixed(4)} Hz`;
      } else if (!isNaN(f) && f > 0 && (isNaN(T) || T === 0)) {
        result.innerHTML = `<b>Period (T):</b> ${(1 / f).toFixed(4)} s`;
      } else {
        result.textContent = "Enter either period or frequency (only one value)!";
      }
    });
  }
});