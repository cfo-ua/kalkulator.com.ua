document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("date-diff-form");
  const result = document.getElementById("date-diff-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const start = new Date(document.getElementById("start-date").value);
    const end = new Date(document.getElementById("end-date").value);

    if (isNaN(start) || isNaN(end)) {
      result.textContent = "Будь ласка, введіть коректні дати.";
      return;
    }

    let diffTime = end - start;
    const isPast = diffTime < 0;
    diffTime = Math.abs(diffTime);

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const startY = start.getFullYear(), startM = start.getMonth(), startD = start.getDate();
    const endY = end.getFullYear(), endM = end.getMonth(), endD = end.getDate();

    let yearDiff = endY - startY;
    let monthDiff = endM - startM;
    let dayDiff = endD - startD;

    if (dayDiff < 0) {
      monthDiff -= 1;
      const prevMonth = new Date(endY, endM, 0).getDate();
      dayDiff += prevMonth;
    }

    if (monthDiff < 0) {
      yearDiff -= 1;
      monthDiff += 12;
    }

    result.innerHTML = `
      <b>Різниця між датами:</b><br>
      <ul>
        <li>Кількість днів: <b>${diffDays}</b></li>
        <li>У роках, місяцях, днях: <b>${yearDiff} років, ${monthDiff} місяців, ${dayDiff} днів</b></li>
        <li>Напрямок: <b>${isPast ? "у минулому" : "у майбутньому"}</b></li>
      </ul>
    `;
  });
});
