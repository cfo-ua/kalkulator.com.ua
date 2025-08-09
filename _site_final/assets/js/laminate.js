document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('laminate-form');
  const result = document.getElementById('laminate-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const area = parseFloat(document.getElementById('laminate-area').value);
      const pack = parseFloat(document.getElementById('laminate-pack').value);
      const waste = parseFloat(document.getElementById('laminate-waste').value) || 0;
      if (area <= 0 || pack <= 0) {
        result.textContent = "Введіть площу кімнати та площу упаковки.";
        return;
      }
      const totalArea = area * (1 + waste / 100);
      const packs = Math.ceil(totalArea / pack);
      result.innerHTML = `<b>Потрібно упаковок ламінату:</b> ${packs} шт.`;
    });
  }
});
