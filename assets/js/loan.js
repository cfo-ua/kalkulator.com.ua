document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('loan-form');
  const result = document.getElementById('loan-result');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const S = Number(document.getElementById('amount').value);
    const n = Number(document.getElementById('months').value);
    const r = Number(document.getElementById('rate').value) / 12 / 100;
    if (S <= 0 || n <= 0 || r < 0) {
      result.textContent = "Будь ласка, введіть коректні дані.";
      return;
    }
    // Annuity formula
    const payment = (S * r) / (1 - Math.pow(1 + r, -n));
    const total = payment * n;
    result.innerHTML = `
      <b>Щомісячний платіж:</b> ${payment.toFixed(2)} ₴<br>
      <b>Загальна сума виплат:</b> ${total.toFixed(2)} ₴
    `;
  });
});
