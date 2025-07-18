document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("conception-date-form");
  const result = document.getElementById("conception-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const birthDateInput = document.getElementById("birth-date").value;
    const correctionWeeks = parseInt(document.getElementById("correction").value, 10);

    if (!birthDateInput) {
      result.textContent = "Будь ласка, введіть дату народження дитини.";
      return;
    }

    const birthDate = new Date(birthDateInput);

    if (isNaN(birthDate)) {
      result.textContent = "Неправильний формат дати.";
      return;
    }

    // Від дати народження віднімаємо 38 тижнів (266 днів) мінус/плюс корекція
    const conceptionDate = new Date(birthDate);
    const daysToSubtract = 266 + correctionWeeks * 7;
    conceptionDate.setDate(conceptionDate.getDate() - daysToSubtract);

    // Форматування дати у YYYY-MM-DD
    const year = conceptionDate.getFullYear();
    const month = String(conceptionDate.getMonth() + 1).padStart(2, "0");
    const day = String(conceptionDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    result.innerHTML = `
      <b>Приблизна дата зачаття:</b> ${formattedDate}
    `;
  });
});
