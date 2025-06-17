document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('salary-converter-form');
  const resultDiv = document.getElementById('salary-converter-result');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('amount').value);
    const period = document.getElementById('period').value;

    if (isNaN(amount) || amount <= 0) {
      resultDiv.innerHTML = '<p>Будь ласка, введіть коректну суму.</p>';
      return;
    }

    // Normalize everything to yearly income
    let annual = 0;
    switch (period) {
      case 'year': annual = amount; break;
      case 'month': annual = amount * 12; break;
      case 'week': annual = amount * 52; break;
      case 'day': annual = amount * 365; break;
      case 'hour': annual = amount * 2080; break; // 40h/week * 52 weeks
    }

    const monthly = annual / 12;
    const weekly = annual / 52;
    const daily = annual / 365;
    const hourly = annual / 2080;

    const format = (n) => n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    resultDiv.innerHTML = `
      <p><strong>Еквівалентна зарплата:</strong></p>
      <ul>
        <li>Рік: <strong>${format(annual)} грн</strong></li>
        <li>Місяць: <strong>${format(monthly)} грн</strong></li>
        <li>Тиждень: <strong>${format(weekly)} грн</strong></li>
        <li>День: <strong>${format(daily)} грн</strong></li>
        <li>Година: <strong>${format(hourly)} грн</strong></li>
      </ul>
    `;
  });
});
