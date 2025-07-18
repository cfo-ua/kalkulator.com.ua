document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('ph-form');
  const result = document.getElementById('ph-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const h = parseFloat(document.getElementById('ph-h').value);
      const oh = parseFloat(document.getElementById('ph-oh').value);
      let pH, pOH;
      if (!isNaN(h) && h > 0) {
        pH = -Math.log10(h);
        pOH = 14 - pH;
      } else if (!isNaN(oh) && oh > 0) {
        pOH = -Math.log10(oh);
        pH = 14 - pOH;
      } else {
        result.textContent = "Введіть концентрацію H⁺ або OH⁻ (моль/л).";
        return;
      }
      let type = pH < 7 ? "Кислий" : (pH > 7 ? "Лужний" : "Нейтральний");
      result.innerHTML =
        `<b>pH:</b> ${pH.toFixed(3)}<br>` +
        `<b>pOH:</b> ${pOH.toFixed(3)}<br>` +
        `<b>Тип розчину:</b> ${type}`;
    });
  }
});
