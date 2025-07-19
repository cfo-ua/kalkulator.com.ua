document.addEventListener("DOMContentLoaded", function () {
  // 1. X% of Y
  document.getElementById('calc-percent-xy').onclick = function() {
    const x = parseFloat(document.getElementById('percent-x').value);
    const y = parseFloat(document.getElementById('percent-y').value);
    if (isNaN(x) || isNaN(y)) {
      document.getElementById('percent-xy-result').textContent = "Введіть числа.";
      return;
    }
    const res = y * x / 100;
    document.getElementById('percent-xy-result').innerHTML = `<b>Результат:</b> ${res.toFixed(4)}`;
  };
  // 2. What percent is A of B
  document.getElementById('calc-percent-ab').onclick = function() {
    const a = parseFloat(document.getElementById('percent-a').value);
    const b = parseFloat(document.getElementById('percent-b').value);
    if (isNaN(a) || isNaN(b) || b === 0) {
      document.getElementById('percent-ab-result').textContent = "Введіть числа (B ≠ 0).";
      return;
    }
    const res = a / b * 100;
    document.getElementById('percent-ab-result').innerHTML = `<b>Результат:</b> ${res.toFixed(2)}%`;
  };
});
