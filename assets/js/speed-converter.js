document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('salary-period-form');
  const amountInput = document.getElementById('amount');
  const periodSelect = document.getElementById('period');
  const resultDiv = document.getElementById('salary-period-result');

  const conversionRates = {
    year: 1,
    month: 12,
    week: 52,
    day: 365,
    hour: 2080 // 40 hours/week * 52 weeks
  };

  function formatNumber(num) {
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const amount = parseFloat(amountInput.value.replace(',', '.'));
    const fromPeriod = periodSelect.value;

    if (isNaN(amount) || amount <= 0) {
      resultDiv.textContent = 'Будь ласка, введіть коректну суму.';
      return;
    }

    const annual = amount * (conversionRates.year / conversionRates[fromPeriod]);

    const results = {
      рік: formatNumber(annual),
      місяць: formatNumber(annual / conversionRates.month),
      тиждень: formatNumber(annual / conversionRates.week),
      день: formatNumber(annual / conversionRates.day),
      година: formatNumber(annual / conversionRates.hour),
    };

    resultDiv.innerHTML = `
      <strong>Еквіваленти для ${formatNumber(amount)} грн / ${fromPeriod}:</strong><br>
      Рік: ${results['рік']} грн<br>
      Місяць: ${results['місяць']} грн<br>
      Тиждень: ${results['тиждень']} грн<br>
      День: ${results['день']} грн<br>
      Година: ${results['година']} грн
    `;
  });
});
