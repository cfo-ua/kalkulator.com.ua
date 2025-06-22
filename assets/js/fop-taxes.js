(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('fop-form');
    const resultDiv = document.getElementById('fop-result');
    const periodSelect = document.getElementById('period');

    const MIN_SALARY = 8000;   // грн
    const LIVING_WAGE = 2920;  // грн

    function formatCurrency(value) {
      return value.toFixed(2) + ' грн';
    }

    /**
     * Обчислює податки залежно від групи та періоду.
     * @param {string} group — '1', '2', '3' або '3-vat'
     * @param {number} income — введений користувачем дохід (місячний або квартальний)
     * @param {string} period — 'monthly' або 'quarterly'
     */
    function calculateTaxes(group, income, period) {
      let singleTax = 0;
      let esv = 0;
      let military = 0;

      if (period === 'monthly') {
        // Розрахунок за місяць
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
      } else {
        // Розрахунок за квартал
        switch (group) {
          case '1':
            singleTax = 0.1 * LIVING_WAGE * 3;
            esv = 0.22 * MIN_SALARY * 3;
            military = 0.1 * MIN_SALARY * 3;
            break;
          case '2':
            singleTax = 0.2 * MIN_SALARY * 3;
            esv = 0.22 * MIN_SALARY * 3;
            military = 0.1 * MIN_SALARY * 3;
            break;
          case '3':
            singleTax = 0.05 * income;
            esv = 0.22 * MIN_SALARY * 3;
            military = 0.01 * income;
            break;
          case '3-vat':
            singleTax = 0.03 * income;
            esv = 0.22 * MIN_SALARY * 3;
            military = 0.01 * income;
            break;
        }
      }

      return {
        singleTax,
        esv,
        military,
        total: singleTax + esv + military
      };
    }

    form.addEventListener('submit', e => {
      e.preventDefault();

      const group = document.getElementById('group').value;
      const income = parseFloat(document.getElementById('income').value);
      const period = periodSelect.value; // 'monthly' або 'quarterly'

      if (isNaN(income) || income < 0) {
        resultDiv.innerHTML = '<p style="color:red;">Будь ласка, введіть коректний дохід.</p>';
        return;
      }

      const { singleTax, esv, military, total } = calculateTaxes(group, income, period);
      const periodLabel = period === 'monthly' ? 'за місяць' : 'за квартал';

      resultDiv.innerHTML = `
        <p><strong>Єдиний податок ${periodLabel}:</strong> ${formatCurrency(singleTax)}</p>
        <p><strong>ЄСВ ${periodLabel}:</strong> ${formatCurrency(esv)}</p>
        <p><strong>Військовий збір ${periodLabel}:</strong> ${formatCurrency(military)}</p>
        <hr>
        <p><strong>Загалом ${periodLabel}:</strong> ${formatCurrency(total)}</p>
      `;
    });
  });
})();
