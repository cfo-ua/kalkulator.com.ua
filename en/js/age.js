document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("age-form");
  const result = document.getElementById("age-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const birthInput = document.getElementById("birthdate").value;
    const birthDate = new Date(birthInput);
    const today = new Date();

    if (!birthInput || birthDate > today) {
      result.textContent = "Please enter a valid birth date (in the past).";
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

    // Handle singular/plural forms for better UX
    const yearText = years === 1 ? "year" : "years";
    const monthText = months === 1 ? "month" : "months";
    const dayText = days === 1 ? "day" : "days";

    result.innerHTML = `
      <b>Your age:</b><br>
      ${years} ${yearText}, ${months} ${monthText}, ${days} ${dayText}
    `;
  });
});