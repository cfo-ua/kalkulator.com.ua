document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("freelancer-rate-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const annualLivingExpenses = parseFloat(document.getElementById("annualLivingExpenses").value);
    const businessExpenses = parseFloat(document.getElementById("businessExpenses").value);
    const desiredProfit = parseFloat(document.getElementById("desiredProfit").value) / 100;
    const billableHours = parseFloat(document.getElementById("billableHours").value);
    const vacationWeeks = parseFloat(document.getElementById("vacationWeeks").value);
    const taxRate = parseFloat(document.getElementById("taxRate").value) / 100;

    // Розрахунок робочих тижнів та загальних білінгових годин
    const workingWeeks = 52 - vacationWeeks;
    const totalBillableHours = billableHours * workingWeeks;

    // Розрахунок загальних річних потреб
    const totalExpenses = annualLivingExpenses + businessExpenses;
    const grossIncomeNeeded = totalExpenses / (1 - taxRate);
    const grossWithProfit = grossIncomeNeeded * (1 + desiredProfit);

    // Розрахунок ставок
    const minimumRate = Math.ceil(grossIncomeNeeded / totalBillableHours);
    const sustainableRate = Math.ceil(grossWithProfit / totalBillableHours);
    const premiumRate = Math.ceil(sustainableRate * 1.5);

    // Розрахунок річних прогнозів
    const minAnnualIncome = minimumRate * totalBillableHours;
    const sustainableAnnualIncome = sustainableRate * totalBillableHours;
    const premiumAnnualIncome = premiumRate * totalBillableHours;

    // Розрахунок доходу на руки після податків
    const minTakeHome = minAnnualIncome * (1 - taxRate);
    const sustainableTakeHome = sustainableAnnualIncome * (1 - taxRate);
    const premiumTakeHome = premiumAnnualIncome * (1 - taxRate);

    // Форматування валюти для української гривні
    const formatCurrency = (amount) => {
      return amount.toLocaleString('uk-UA', {
        style: 'currency',
        currency: 'UAH',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
    };

    // Відображення результатів з використанням дизайну insight-card
    const resultBlock = document.getElementById("freelancer-rate-result");
    resultBlock.innerHTML = `
      <h3>💰 Ваш аналіз погодинної ставки фрілансера</h3>
      
      <div class="insight-cards">
        <div class="insight-card warning">
          <h6>⚠️ Мінімальна життєздатна ставка</h6>
          <div class="big-number">${minimumRate} грн/год</div>
          <p>Покриває лише базові витрати<br>
          Річний дохід: ${formatCurrency(minAnnualIncome)}<br>
          На руки: ${formatCurrency(minTakeHome)}</p>
        </div>
        
        <div class="insight-card success">
          <h6>✅ Стійка ставка (Рекомендовано)</h6>
          <div class="big-number">${sustainableRate} грн/год</div>
          <p>Включає ${(desiredProfit * 100)}% маржу прибутку<br>
          Річний дохід: ${formatCurrency(sustainableAnnualIncome)}<br>
          На руки: ${formatCurrency(sustainableTakeHome)}</p>
        </div>
        
        <div class="insight-card info">
          <h6>🚀 Преміальна ставка</h6>
          <div class="big-number">${premiumRate} грн/год</div>
          <p>Позиціонування високої цінності<br>
          Річний дохід: ${formatCurrency(premiumAnnualIncome)}<br>
          На руки: ${formatCurrency(premiumTakeHome)}</p>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px;">
        <h4>📊 Детальний аналіз ставки</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
          <div>
            <strong>💼 Графік роботи:</strong><br>
            ${billableHours} годин/тиждень × ${workingWeeks} тижнів<br>
            = ${totalBillableHours} білінгових годин/рік
          </div>
          <div>
            <strong>💸 Річні витрати:</strong><br>
            Особисті: ${formatCurrency(annualLivingExpenses)}<br>
            Бізнес: ${formatCurrency(businessExpenses)}<br>
            Загалом: ${formatCurrency(totalExpenses)}
          </div>
        </div>
        <div style="margin-top: 1rem;">
          <strong>🎯 Рекомендації стратегії ставок:</strong><br>
          • Починайте з <strong>${sustainableRate} грн/год</strong> для більшості клієнтів<br>
          • Використовуйте ${minimumRate} грн/год як абсолютний мінімум<br>
          • Виставляйте ${premiumRate} грн/год для преміальних клієнтів або термінових робіт<br>
          • Переглядайте та коригуйте ставки кожні 6-12 місяців
        </div>
        
        <div style="margin-top: 1rem; padding: 1rem; background: #e8f5e8; border-radius: 8px;">
          <strong>🇺🇦 Особливості для України:</strong><br>
          • При роботі з іноземними клієнтами врахуйте курс валют<br>
          • Для ФОП 3 група: 5% єдиного податку<br>
          • Резервуйте кошти на відпустку та лікарняні<br>
          • Розгляньте додаткове страхування здоров'я
        </div>
      </div>
    `;
  });
});