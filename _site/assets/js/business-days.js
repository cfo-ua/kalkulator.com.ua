document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("business-days-form");
  const result = document.getElementById("business-days-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const start = new Date(document.getElementById("start-date").value);
    const end = new Date(document.getElementById("end-date").value);

    if (!start || !end || start > end) {
      result.textContent = "Будь ласка, введіть коректні дати (початкова дата має бути до кінцевої).";
      return;
    }

    let totalDays = 0;
    let businessDays = 0;
    let weekendDays = 0;

    const current = new Date(start);
    while (current <= end) {
      const day = current.getDay();
      if (day === 0 || day === 6) {
        weekendDays++;
      } else {
        businessDays++;
      }
      totalDays++;
      current.setDate(current.getDate() + 1);
    }

    result.innerHTML = `
      <b>Календарних днів:</b> ${totalDays}<br>
      <b>Робочих днів:</b> ${businessDays}<br>
      <b>Вихідних (субота і неділя):</b> ${weekendDays}
    `;
  });
});
