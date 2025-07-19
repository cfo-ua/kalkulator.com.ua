document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("date-shift-form");
  const result = document.getElementById("date-shift-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const baseDate = new Date(document.getElementById("base-date").value);
    const offset = parseInt(document.getElementById("day-offset").value, 10);

    if (isNaN(baseDate) || isNaN(offset)) {
      result.textContent = "Будь ласка, введіть коректні дані.";
      return;
    }

    const newDate = new Date(baseDate);
    newDate.setDate(baseDate.getDate() + offset);

    const options = { year: "numeric", month: "long", day: "numeric" };
    const formatted = newDate.toLocaleDateString("uk-UA", options);

    result.innerHTML = `
      <b>Результат:</b> <br>
      Дата <b>${offset >= 0 ? `через ${offset} днів` : `${Math.abs(offset)} днів тому`}</b> буде: <b>${formatted}</b>
    `;
  });
});
