document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('deposit-form');
  const result = document.getElementById('deposit-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const S = Number(document.getElementById('deposit-amount').value);
      const n = Number(document.getElementById('deposit-months').value);
      const r = Number(document.getElementById('deposit-rate').value) / 100;

      if (S <= 0 || n <= 0 || r < 0) {
        result.textContent = "Будь ласка, введіть коректні дані.";
        return;
      }

      // Simple interest calculation (no capitalization)
      const gross = S * r * n / 12;
      const tax = gross * 0.195; // 18% + 1.5%
      const net = gross - tax;

      // Format numbers for Ukrainian locale
      const grossFormatted = gross.toLocaleString('uk-UA', {minimumFractionDigits: 2, maximumFractionDigits: 2});
      const taxFormatted = tax.toLocaleString('uk-UA', {minimumFractionDigits: 2, maximumFractionDigits: 2});
      const netFormatted = net.toLocaleString('uk-UA', {minimumFractionDigits: 2, maximumFractionDigits: 2});

      result.innerHTML = `
        <b>Доход до оподаткування:</b> ${grossFormatted} ₴<br>
        <b>Податок (18% ПДФО + 1,5% військовий збір):</b> ${taxFormatted} ₴<br>
        <b>Чистий прибуток:</b> ${netFormatted} ₴
      `;
    });
  }
});
