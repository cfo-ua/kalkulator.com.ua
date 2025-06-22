(() => {
  const form = document.getElementById('fop-form');
  const resultDiv = document.getElementById('fop-result');
  const periodSelect = document.getElementById('period');
  const incomeHint = document.getElementById('income-hint');

  const MIN_SALARY = 8000;    // для обчислення ЄСВ і військового збору
  const LIVING_WAGE = 2920;   // для обчислення ЄП 1-ї групи

  function formatCurrency(value) {
    return value.toFixed(2) + ' грн';
  }

  /**
   * Вираховує податки для обраної групи і періоду.
   * - income: введений користувачем (місяць або квартал, залежить від period)
   * - period: 'monthly' | 'quarterly'
   */
  function calculateTaxes(group, income, period) {
    // Перетворюємо квартальний дохід в місячний тільки для групи 3
    let incomePerMonth = income;
    if ((group === '3' || group === '3-vat') && period === 'quarterly') {
      incomePerMonth = income / 3;
    }

    // Обчислюємо податки за місяць
    let singleTax, esv, military;
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
        singleTax = 0.05 * incomePerMonth;
        esv = 0.22 * MIN_SALARY;
        military = 0.01 * incomePerMonth;
        break;
      case '3-vat':
        singleTax = 0.03 * incomePerMonth;
        esv = 0.22 * MIN_SALARY;
        military = 0.01 * incomePerMonth;
        break;
      default:
        singleTax = esv = military = 0;
    }

    // Якщо квартал — множимо місячні суми на 3
    const multiplier = period === 'quarterly' ? 3 : 1;
    singleTax *= multiplier;
    esv *= multiplier;
    military *= multiplier;

    return {
      singleTax,
      esv,
      military,
      total: singleTax + esv + military
    };
  }

  // Динамічна підказка під полем доходу
  periodSelect.addEventListener('change', () => {
    incomeHint.textContent = periodSelect.value === 'monthly'
      ? 'Вкажіть дохід за місяць'
      : 'Вкажіть дохід за квартал';
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const group = document.getElementById('group').value;
    const incomeInput = parseFloat(document.getElementById('income').value);
    const period = periodSelect.value;

    if (isNaN(incomeInput) || incomeInput < 0) {
      resultDiv.innerHTML = '<p style="color:red;">Будь ласка, введіть коректний дохід.</p>';
      return;
    }

    const { singleTax, esv, military, total } = calculateTaxes(group, incomeInput, period);
    const periodLabel = period === 'monthly' ? 'за місяць' : 'за квартал';

    resultDiv.innerHTML = `
      <p><strong>Єдиний податок ${periodLabel}:</strong> ${formatCurrency(singleTax)}</p>
      <p><strong>ЄСВ ${periodLabel}:</strong> ${formatCurrency(esv)}</p>
      <p><strong>Військовий збір ${periodLabel}:</strong> ${formatCurrency(military)}</p>
      <hr>
      <p><strong>Загалом ${periodLabel}:</strong> ${formatCurrency(total)}</p>
    `;
  });
})();
