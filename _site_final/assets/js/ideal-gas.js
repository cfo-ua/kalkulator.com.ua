document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('ideal-gas-form');
  const result = document.getElementById('ideal-gas-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const P = parseFloat(document.getElementById('ig-p').value);
      const V = parseFloat(document.getElementById('ig-v').value);
      const n = parseFloat(document.getElementById('ig-n').value);
      const T = parseFloat(document.getElementById('ig-t').value);
      const R = 0.0821;
      let filled = [!isNaN(P), !isNaN(V), !isNaN(n), !isNaN(T)].filter(Boolean).length;
      if (filled !== 3) {
        result.textContent = "Введіть рівно три параметри.";
        return;
      }
      if (isNaN(P)) {
        result.innerHTML = `<b>P =</b> ${(n * R * T / V).toFixed(4)} атм`;
      } else if (isNaN(V)) {
        result.innerHTML = `<b>V =</b> ${(n * R * T / P).toFixed(4)} л`;
      } else if (isNaN(n)) {
        result.innerHTML = `<b>n =</b> ${(P * V / (R * T)).toFixed(4)} моль`;
      } else if (isNaN(T)) {
        result.innerHTML = `<b>T =</b> ${(P * V / (n * R)).toFixed(4)} К`;
      }
    });
  }
});
