document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('trig-form');
  const result = document.getElementById('trig-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const deg = parseFloat(document.getElementById('trig-angle').value);
      const rad = deg * Math.PI / 180;
      const sin = Math.sin(rad);
      const cos = Math.cos(rad);
      const tan = Math.tan(rad);
      let cot;
      if (Math.abs(tan) < 1e-12) cot = "∞";
      else cot = 1 / tan;
      result.innerHTML =
        `<b>sin:</b> ${sin.toFixed(6)}<br>` +
        `<b>cos:</b> ${cos.toFixed(6)}<br>` +
        `<b>tan:</b> ${Math.abs(cos) < 1e-12 ? '∞' : tan.toFixed(6)}<br>` +
        `<b>cot:</b> ${cot === "∞" ? "∞" : cot.toFixed(6)}`;
    });
  }
});
