document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("date-shift-form");
  const result = document.getElementById("date-shift-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const baseDate = new Date(document.getElementById("base-date").value);
    const offset = parseInt(document.getElementById("day-offset").value, 10);

    if (isNaN(baseDate) || isNaN(offset)) {
      result.textContent = "Please enter valid data.";
      return;
    }

    const newDate = new Date(baseDate);
    newDate.setDate(baseDate.getDate() + offset);

    // Format options for readable date
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formatted = newDate.toLocaleDateString("en-US", options);
    
    // Also provide ISO format
    const isoDate = newDate.toISOString().split('T')[0];

    // Handle singular/plural for days
    const dayText = Math.abs(offset) === 1 ? "day" : "days";
    
    let direction;
    if (offset > 0) {
      direction = `in ${offset} ${dayText}`;
    } else if (offset < 0) {
      direction = `${Math.abs(offset)} ${dayText} ago`;
    } else {
      direction = "today (no change)";
    }

    result.innerHTML = `
      <b>Result:</b><br>
      The date <b>${direction}</b> will be:<br>
      <b>${formatted}</b><br>
      <small>(${isoDate})</small>
    `;
  });
});