document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('quadratic-form');
  const result = document.getElementById('quadratic-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const a = Number(document.getElementById('quad-a').value);
      const b = Number(document.getElementById('quad-b').value);
      const c = Number(document.getElementById('quad-c').value);
      if (a === 0) {
        result.textContent = "Coefficient 'a' cannot be zero.";
        return;
      }
      const d = b * b - 4 * a * c;
      if (d > 0) {
        const x1 = (-b + Math.sqrt(d)) / (2 * a);
        const x2 = (-b - Math.sqrt(d)) / (2 * a);
        result.innerHTML =
          `<b>Two solutions:</b><br>x₁ = ${x1.toFixed(4)}<br>x₂ = ${x2.toFixed(4)}`;
      } else if (d === 0) {
        const x = -b / (2 * a);
        result.innerHTML = `<b>One solution:</b><br>x = ${x.toFixed(4)}`;
      } else {
        result.innerHTML = "No real solutions (D &lt; 0)";
      }
    });
  }
});