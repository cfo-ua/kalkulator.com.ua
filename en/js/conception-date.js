document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("conception-date-form");
  const result = document.getElementById("conception-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const birthDateInput = document.getElementById("birth-date").value;
    const correctionWeeks = parseInt(document.getElementById("correction").value, 10);

    if (!birthDateInput) {
      result.textContent = "Please enter the baby's birth date.";
      return;
    }

    const birthDate = new Date(birthDateInput);

    if (isNaN(birthDate)) {
      result.textContent = "Invalid date format.";
      return;
    }

    // Subtract 38 weeks (266 days) from birth date, plus/minus correction
    const conceptionDate = new Date(birthDate);
    const daysToSubtract = 266 + correctionWeeks * 7;
    conceptionDate.setDate(conceptionDate.getDate() - daysToSubtract);

    // Format date as YYYY-MM-DD
    const year = conceptionDate.getFullYear();
    const month = String(conceptionDate.getMonth() + 1).padStart(2, "0");
    const day = String(conceptionDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    // Also provide a more readable format
    const options = { year: "numeric", month: "long", day: "numeric" };
    const readableDate = conceptionDate.toLocaleDateString("en-US", options);

    let adjustmentText = "";
    if (correctionWeeks !== 0) {
      adjustmentText = ` (adjusted by ${correctionWeeks > 0 ? '+' : ''}${correctionWeeks} week${Math.abs(correctionWeeks) === 1 ? '' : 's'})`;
    }

    result.innerHTML = `
      <b>Estimated conception date:</b><br>
      ${readableDate}<br>
      <small>(${formattedDate}${adjustmentText})</small><br><br>
      <em>Note: This is an estimate based on a standard 38-week gestation period from conception to birth. Actual conception timing can vary.</em>
    `;
  });
});