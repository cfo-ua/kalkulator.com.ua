document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("ovdp-form");
  const result = document.getElementById("ovdp-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const price = parseFloat(form.price.value);
    const nextDate = new Date(form.nextDate.value);
    const coupon = parseFloat(form.nextCoupon.value);
    const maturityDate = new Date(form.finalDate.value);
    const today = new Date();

    if (
      isNaN(price) || isNaN(coupon) ||
      !nextDate || !maturityDate || nextDate <= today || maturityDate <= today
    ) {
      result.innerHTML = "Будь ласка, перевірте введені дані.";
      return;
    }

    // Розрахунок кількості купонних виплат кожні 6 місяців
    const couponDates = [];
    let d = new Date(nextDate);
    while (d <= maturityDate) {
      couponDates.push(new Date(d));
      d.setMonth(d.getMonth() + 6);
    }

    const totalCoupons = couponDates.length * coupon;

    // Сума останньої виплати: купон + тіло 1000 грн
    const finalAmount = 1000;

    const income = totalCoupons + finalAmount - price;
    const roi = income / price;

    const daysToMaturity = (maturityDate - today) / (1000 * 60 * 60 * 24);
    const annualizedYield = Math.pow(1 + roi, 365 / daysToMaturity) - 1;

    const formatMoney = (x) =>
      x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    const formatPercent = (x) =>
      (x * 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " %";

    result.innerHTML = `
      <p><b>Розрахунок для 1 ОВДП з номіналом 1000 грн</b></p>
      <b>Кількість купонів:</b> ${couponDates.length}<br>
      <b>Загальний прибуток:</b> ${formatMoney(income)} грн<br>
      <b>Загальна дохідність:</b> ${formatPercent(roi)}<br>
      <b>Річна дохідність:</b> ${formatPercent(annualizedYield)}
    `;
  });
});
