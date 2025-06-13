document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("ovdp-form");
  const result = document.getElementById("ovdp-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const price = parseFloat(form.price.value);
    const nextDate = new Date(form.nextDate.value);
    const nextCoupon = parseFloat(form.nextCoupon.value);
    const finalDate = new Date(form.finalDate.value);
    const today = new Date();

    if (
      isNaN(price) || isNaN(nextCoupon) ||
      !nextDate || !finalDate || nextDate <= today || finalDate <= today
    ) {
      result.innerHTML = "Будь ласка, перевірте введені дані.";
      return;
    }

    // Генерація купонів кожні 6 місяців, включно з датою погашення
    const coupons = [];
    const couponInterval = 6; // місяців
    const currentCouponDate = new Date(nextDate);

    while (currentCouponDate < finalDate) {
      coupons.push({
        date: new Date(currentCouponDate),
        amount: nextCoupon,
      });
      currentCouponDate.setMonth(currentCouponDate.getMonth() + couponInterval);
    }

    // Додаємо останній купон у дату погашення
    coupons.push({
      date: new Date(finalDate),
      amount: nextCoupon,
    });

    const totalCoupons = coupons.length;
    const totalCouponValue = totalCoupons * nextCoupon;
    const finalPayout = 1000; // номінал
    const totalIncome = totalCouponValue + finalPayout - price;
    const roi = totalIncome / price;

    // Дні до дати погашення
    const days = (finalDate - today) / (1000 * 60 * 60 * 24);

    // Проста річна дохідність (без реінвестування)
    const annualizedYieldSimple = roi / (days / 365);

    const formatMoney = (x) =>
      x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    const formatPercent = (x) =>
      (x * 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " %";

    result.innerHTML = `
      <b>Кількість купонів:</b> ${totalCoupons}<br>
      <b>Загальний прибуток:</b> ${formatMoney(totalIncome)} грн<br>
      <b>Загальна дохідність:</b> ${formatPercent(roi)}<br>
      <b>Річна дохідність:</b> ${formatPercent(annualizedYieldSimple)}
    `;
  });
});
