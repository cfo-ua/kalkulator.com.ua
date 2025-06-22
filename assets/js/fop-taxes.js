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
     * Обчислює податки за обраний період.
     * - income: введений користувачем дохід (місячний, якщо period==='monthly'; 
     *   квартальний, якщо period==='quarterly')
     * - period: 'monthly' | 'quarterly'
     */
    function calculateTaxes(group, income, period) {
      let singleTax = 0;
      let esv = 0;
      let military = 0;

      if (period === 'monthly') {
        // ─────────── МІСЯЧНІ РОЗРАХУНКИ ───────────
        switch (group) {
          case '1':
            singleTax = 0.1 * LIVING_WAGE;
            esv       = 0.22 * MIN_SALARY;
            military  = 0.1 * MIN_SALARY;
            break;
          case '2':
            singleTax = 0.2 * MIN_SALARY;
            esv       = 0.22 * MIN_SALARY;
            military  = 0.1 * MIN_SALARY;
            break;
          case '3':
            singleTax = 0.05 * income;
            esv       = 0.22 * MIN_SALARY;
            military  = 0.01 * income;
            break;
          case '3-vat':
            singleTax = 0.03 * income;
            esv       = 0.22 * MIN_SALARY;
            military  = 0.01 * income;
            break;
        }

      } else {
        // ─────────── КВАРТАЛЬНІ РОЗРАХУНКИ ───────────
        switch (group) {
          case '1':
            singleTax = 0.1  * LIVING_WAGE * 3;
            esv       = 0.22 * MIN_SALARY  * 3;
            military  = 0.1  * MIN_SALARY  * 3;
            break;
          case '2':
            singleTax = 0.2  * MIN_SALARY  * 3;
            esv       = 0.22 * MIN_SALARY  * 3;
            military  = 0.1  * MIN_SALARY  * 3;
            break;
          case '3':
            // income тут — вже квартальний
            singleTax = 0.05 * income;
            esv       = 0.22 * MIN_SALARY * 3;
            military  = 0.01 * income;
            break;
          case '3-vat':
            singleTax = 0.03 * income;
            esv       = 0.22 * MIN_SALARY * 3;
            military  = 0.01 * income;
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

      const group  = document.getElementById('group').value;
      const income = parseFloat(document.getElementById('income').value);
      const period = periodSelect.value; // 'monthly' | 'quarterly'

      if (isNaN(income) || income < 0) {
        resultDiv.innerHTML = '<p style="color:red;">Будь ласка, введіть коректний дохід.</p>';
        return;
      }

      const { singleTax, esv, military, total } = calculateTaxes(group, income, period);
      const label = period === 'monthly' ? 'за місяць' : 'за квартал';

      resultDiv.innerHTML = `
        <p><strong>Єдиний податок ${label}:</strong> ${formatCurrency(singleTax)}</p>
        <p><strong>ЄСВ ${label}:</strong> ${formatCurrency(esv)}</p>
        <p><strong>Військовий збір ${label}:</strong> ${formatCurrency(military)}</p>
        <hr>
        <p><strong>Загалом ${label}:</strong> ${formatCurrency(total)}</p>
      `;
    });
  });
})();
