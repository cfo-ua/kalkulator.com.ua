document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("business-days-form");
  const result = document.getElementById("business-days-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const start = new Date(document.getElementById("start-date").value);
    const end = new Date(document.getElementById("end-date").value);

    if (!start || !end || start > end) {
      result.textContent = "Please enter valid dates (start date must be before or equal to end date).";
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

    // Handle singular/plural forms
    const totalText = totalDays === 1 ? "day" : "days";
    const businessText = businessDays === 1 ? "day" : "days";
    const weekendText = weekendDays === 1 ? "day" : "days";

    result.innerHTML = `
      <b>Total calendar days:</b> ${totalDays} ${totalText}<br>
      <b>Business days:</b> ${businessDays} ${businessText}<br>
      <b>Weekend days (Saturday & Sunday):</b> ${weekendDays} ${weekendText}
    `;
  });
});