document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('salary-converter-form');
  const resultDiv = document.getElementById('salary-converter-result');

  const multipliers = {
    year: 1,
    month: 1 / 12,
    week: 1 / 52,
    day: 1 / 365
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('amount').value);
    const period = document.getElementById('period').value;

    if (isNaN(amount) || amount <= 0) {
      resultDiv.innerHTML = '<p>Будь ласка, введіть коректну суму.</p>';
      return;
    }

    // Normalize to yearly
    let annual = 0;
    switch (period) {
      case 'year': annual = amount; break;
      case 'month': annual = amount * 12; break;
      case 'week': annual = amount * 52; break;
      case 'day': annual = amount * 365; break;
    }

    const monthly = annual / 12;
    const weekly = annual / 52;
    const daily = annual / 365;

    resultDiv.innerHTML = `
      <p><strong>Еквівалентна зарплата:</strong></p>
      <ul>
        <li>На рік: <strong>${annual.toFixed(2)} грн</strong></li>
        <li>На місяць: <strong>${monthly.toFixed(2)} грн</strong></li>
        <li>На тиждень: <strong>${weekly.toFixed(2)} грн</strong></li>
        <li>На день: <strong>${daily.toFixed(2)} грн</strong></li>
      </ul>
    `;
  });
});
