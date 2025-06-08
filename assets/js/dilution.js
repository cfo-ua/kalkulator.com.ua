document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('dilution-form');
  const result = document.getElementById('dilution-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const c1 = parseFloat(document.getElementById('dil-c1').value);
      const v1 = parseFloat(document.getElementById('dil-v1').value);
      const c2 = parseFloat(document.getElementById('dil-c2').value);
      const v2 = parseFloat(document.getElementById('dil-v2').value);
      let filled = [!isNaN(c1), !isNaN(v1), !isNaN(c2), !isNaN(v2)].filter(Boolean).length;
      if (filled !== 3) {
        result.textContent = "Введіть рівно три параметри.";
        return;
      }
      if (isNaN(c1)) {
        result.innerHTML = `<b>C₁ =</b> ${(c2 * v2 / v1).toFixed(4)} моль/л`;
      } else if (isNaN(v1)) {
        result.innerHTML = `<b>V₁ =</b> ${(c2 * v2 / c1).toFixed(4)} л`;
      } else if (isNaN(c2)) {
        result.innerHTML = `<b>C₂ =</b> ${(c1 * v1 / v2).toFixed(4)} моль/л`;
      } else if (isNaN(v2)) {
        result.innerHTML = `<b>V₂ =</b> ${(c1 * v1 / c2).toFixed(4)} л`;
      }
    });
  }
});
