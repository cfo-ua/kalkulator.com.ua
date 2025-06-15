(() => {
  const form = document.getElementById('fop-form');
  const resultDiv = document.getElementById('fop-result');

  const MIN_SALARY = 8000; // грн
  const LIVING_WAGE = 2920; // грн

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

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const group = document.getElementById('group').value;
    const income = parseFloat(document.getElementById('income').value);

    const { singleTax, esv, military, total } = calculateTaxes(group, income);

    resultDiv.innerHTML = `
      <p><strong>Єдиний податок:</strong> ${formatCurrency(singleTax)}</p>
      <p><strong>ЄСВ:</strong> ${formatCurrency(esv)}</p>
      <p><strong>Військовий збір:</strong> ${formatCurrency(military)}</p>
      <hr>
      <p><strong>Загалом:</strong> ${formatCurrency(total)}</p>
    `;
  });
})();
