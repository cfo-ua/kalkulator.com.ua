document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("date-diff-form");
  const result = document.getElementById("date-diff-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const start = new Date(document.getElementById("start-date").value);
    const end = new Date(document.getElementById("end-date").value);

    if (isNaN(start) || isNaN(end)) {
      result.textContent = "Please enter valid dates.";
      return;
    }

    let diffTime = end - start;
    const isPast = diffTime < 0;
    diffTime = Math.abs(diffTime);

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const startY = start.getFullYear(), startM = start.getMonth(), startD = start.getDate();
    const endY = end.getFullYear(), endM = end.getMonth(), endD = end.getDate();

    let yearDiff = Math.abs(endY - startY);
    let monthDiff = Math.abs(endM - startM);
    let dayDiff = Math.abs(endD - startD);

    // Adjust for negative day difference
    if (endD < startD) {
      monthDiff -= 1;
      const prevMonth = new Date(endY, endM, 0).getDate();
      dayDiff = prevMonth - startD + endD;
    }

    // Adjust for negative month difference
    if (endM < startM) {
      yearDiff -= 1;
      monthDiff = 12 - startM + endM;
    }

    // Handle singular/plural forms
    const dayText = diffDays === 1 ? "day" : "days";
    const yearText = yearDiff === 1 ? "year" : "years";
    const monthText = monthDiff === 1 ? "month" : "months";
    const dayDiffText = dayDiff === 1 ? "day" : "days";

    result.innerHTML = `
      <b>Date difference:</b><br>
      <ul>
        <li>Total days: <b>${diffDays} ${dayText}</b></li>
        <li>Breakdown: <b>${yearDiff} ${yearText}, ${monthDiff} ${monthText}, ${dayDiff} ${dayDiffText}</b></li>
        <li>Direction: <b>${isPast ? "in the past" : "in the future"}</b></li>
      </ul>
    `;
  });
});