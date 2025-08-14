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
      
      // Calculate annual projections
      const annualMultiplier = period === 'monthly' ? 12 : 4;
      const annualTotal = total * annualMultiplier;
      const annualSingle = singleTax * annualMultiplier;
      const annualESV = esv * annualMultiplier;
      const annualMilitary = military * annualMultiplier;
      
      // Calculate percentages
      const singlePercent = ((singleTax / total) * 100).toFixed(1);
      const esvPercent = ((esv / total) * 100).toFixed(1);
      const militaryPercent = ((military / total) * 100).toFixed(1);

      resultDiv.innerHTML = `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #28a745; margin-top: 0;">Розрахунок податків ФОП</h3>
          
          <div style="background: white; padding: 20px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #28a745;">
            <h4 style="margin-top: 0;">Податки ${label}</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
              <div style="background: #e3f2fd; padding: 15px; border-radius: 6px; text-align: center;">
                <div style="font-size: 1.8em; font-weight: bold; color: #1976d2;">${formatCurrency(singleTax)}</div>
                <div style="color: #1976d2; font-weight: bold;">Єдиний податок</div>
                <div style="color: #666; font-size: 0.9em;">${singlePercent}% від загальної суми</div>
              </div>
              <div style="background: #fff3e0; padding: 15px; border-radius: 6px; text-align: center;">
                <div style="font-size: 1.8em; font-weight: bold; color: #f57c00;">${formatCurrency(esv)}</div>
                <div style="color: #f57c00; font-weight: bold;">ЄСВ</div>
                <div style="color: #666; font-size: 0.9em;">${esvPercent}% від загальної суми</div>
              </div>
              <div style="background: #fce4ec; padding: 15px; border-radius: 6px; text-align: center;">
                <div style="font-size: 1.8em; font-weight: bold; color: #c2185b;">${formatCurrency(military)}</div>
                <div style="color: #c2185b; font-weight: bold;">Військовий збір</div>
                <div style="color: #666; font-size: 0.9em;">${militaryPercent}% від загальної суми</div>
              </div>
            </div>
            <div style="background: #e8f5e8; padding: 20px; border-radius: 6px; margin-top: 15px; text-align: center;">
              <div style="font-size: 2.2em; font-weight: bold; color: #2e7d32;">${formatCurrency(total)}</div>
              <div style="color: #2e7d32; font-weight: bold; font-size: 1.1em;">Загалом ${label}</div>
            </div>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #007bff;">
            <h4 style="margin-top: 0;">Річна проекція</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
              <div style="text-align: center; padding: 10px;">
                <div style="font-weight: bold; color: #007bff;">Єдиний податок</div>
                <div style="font-size: 1.2em; margin: 5px 0;">${formatCurrency(annualSingle)}</div>
              </div>
              <div style="text-align: center; padding: 10px;">
                <div style="font-weight: bold; color: #007bff;">ЄСВ</div>
                <div style="font-size: 1.2em; margin: 5px 0;">${formatCurrency(annualESV)}</div>
              </div>
              <div style="text-align: center; padding: 10px;">
                <div style="font-weight: bold; color: #007bff;">Військовий збір</div>
                <div style="font-size: 1.2em; margin: 5px 0;">${formatCurrency(annualMilitary)}</div>
              </div>
              <div style="text-align: center; padding: 10px; background: #f8f9fa; border-radius: 4px;">
                <div style="font-weight: bold; color: #28a745;">Загалом за рік</div>
                <div style="font-size: 1.4em; margin: 5px 0; color: #28a745;">${formatCurrency(annualTotal)}</div>
              </div>
            </div>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin-top: 15px;">
            <h4 style="margin-top: 0; color: #856404;">Корисні поради</h4>
            <ul style="margin: 5px 0; color: #856404; font-size: 0.9em;">
              <li>Сплачуйте податки вчасно, щоб уникнути штрафів</li>
              <li>Ведіть облік доходів для правильного розрахунку</li>
              <li>Для ФОП 3 групи враховуйте ліміти обороту</li>
              <li>Розгляньте можливість переходу на групу з меншим податковим навантаженням</li>
            </ul>
          </div>
        </div>
      `;
    });
  });
})();
