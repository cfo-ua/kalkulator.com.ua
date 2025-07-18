document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('renovation-cost-form');
  const result = document.getElementById('renovation-cost-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const area = parseFloat(document.getElementById('renovation-area').value);
      const price = parseFloat(document.getElementById('renovation-price').value);
      if (area <= 0 || price <= 0) {
        result.textContent = "Введіть площу та ціну.";
        return;
      }
      const total = area * price;
      result.innerHTML = `<b>Орієнтовна вартість ремонту:</b> ${total.toLocaleString('uk-UA', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    });
  }
});
