(() => {
  const form = document.getElementById('fop-form');
  const resultDiv = document.getElementById('fop-result');

  const MIN_SALARY = 8000;
  const LIVING_WAGE = 2920;

  const incomeHint = document.getElementById('income-hint');
  const periodSelect = document.getElementById('period');

  function formatCurrency(value) {
    return value.toFixed(2) + ' грн';
  }

  function calculateTaxes(group, income) {
    let singleTax = 0;
    let esv = 0;
    let military = 0;

    switch (group) {
      case '1':
        singleTax = 0.1 * LIVING_WAGE;
        esv = 0.22 * MIN_SALARY;
        military = 0.1 * MIN_SALARY;
        break;
      case '2':
        singleTax = 0.2 * MIN_SALARY;
        esv = 0.22 * MIN_SALARY;
        military = 0.1 * MIN_SALARY;
        break;
      case '3':
        singleTax = 0.05 * income;
        esv = 0.22 * MIN_SALARY;
        military = 0.01 * income;
        break;
      case '3-vat':
        singleTax = 0.03 * income;
        esv = 0.22 * MIN_SALARY;
        military = 0.01 * income;
        break;
    }

    return {
      singleTax,
      esv,
      military,
      total: singleTax + esv + military,
    };
  }

  // Змінюємо підказку під полем доходу
  periodSelect.addEventListener('change', () => {
    incomeHint.textContent =
      periodSelect.value === 'monthly'
        ? 'Вкажіть дохід за місяць'
        : 'Вкажіть дохід за квартал';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const group = document.getElementById('group').value;
    const income = parseFloat(document.getElementById('income').value);
    const period = periodSelect.value;

    if (isNaN(income) || income < 0) {
      resultDiv.innerHTML = '<p style="color:red;">Будь ласка, введіть коректний дохід.</p>';
      return;
    }

    // Для групи 3/3-vat завжди хочемо мати доходи "місячні", бо розрахунок на місяць
    const monthlyIncome =
      (group === '3' || group === '3-vat') && period === 'quarterly'
        ? income / 3
        : income;

    const { singleTax, esv, military, total } = calculateTaxes(group, monthlyIncome);

    // Показуємо підсумки за обраний період
    const multiplier = period === 'quarterly' ? 3 : 1;
    const periodLabel = period === 'monthly' ? 'за місяць' : 'за квартал';

    resultDiv.innerHTML = `
      <p><strong>Єдиний податок ${periodLabel}:</strong> ${formatCurrency(singleTax * multiplier)}</p>
      <p><strong>ЄСВ ${periodLabel}:</strong> ${formatCurrency(esv * multiplier)}</p>
      <p><strong>Військовий збір ${periodLabel}:</strong> ${formatCurrency(military * multiplier)}</p>
      <hr>
      <p><strong>Загалом ${periodLabel}:</strong> ${formatCurrency(total * multiplier)}</p>
    `;
  });
})();
