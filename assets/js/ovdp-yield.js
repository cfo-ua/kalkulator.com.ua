document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("ovdp-form");
  const result = document.getElementById("ovdp-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const price = parseFloat(form.price.value);
    const nextDate = new Date(form.nextDate.value);
    const nextCoupon = parseFloat(form.nextCoupon.value);
    const finalDate = new Date(form.finalDate.value);
    const finalAmount = parseFloat(form.finalAmount.value);
    const today = new Date();

    if (
      isNaN(price) || isNaN(nextCoupon) || isNaN(finalAmount) ||
      !nextDate || !finalDate || nextDate <= today || finalDate <= today
    ) {
      result.innerHTML = "Будь ласка, перевірте введені дані.";
      return;
    }

    // Total income
    const income = nextCoupon + finalAmount - price;
    const roi = income / price;

    // Annualized yield
    const days = (finalDate - today) / (1000 * 60 * 60 * 24);
    const annualizedYield = Math.pow(1 + roi, 365 / days) - 1;

    const formatMoney = (x) =>
      x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    const formatPercent = (x) =>
      (x * 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " %";

    result.innerHTML = `
      <b>Загальний прибуток:</b> ${formatMoney(income)} грн<br>
      <b>Загальна дохідність:</b> ${formatPercent(roi)}<br>
      <b>Річна дохідність:</b> ${formatPercent(annualizedYield)}
    `;
  });
});
