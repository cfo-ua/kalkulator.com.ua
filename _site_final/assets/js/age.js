document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("age-form");
  const result = document.getElementById("age-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const birthInput = document.getElementById("birthdate").value;
    const birthDate = new Date(birthInput);
    const today = new Date();

    if (!birthInput || birthDate > today) {
      result.textContent = "Будь ласка, введіть коректну дату народження (у минулому).";
      return;
    }

    // Calculate difference in years, months, days
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    result.innerHTML = `
      <b>Ваш вік:</b><br>
      ${years} років, ${months} місяців, ${days} днів
    `;
  });
});
