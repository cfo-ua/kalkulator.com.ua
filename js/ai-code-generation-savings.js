document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('ai-savings-form');
  const result = document.getElementById('savings-result');

  // Tool pricing data (USD per month per developer)
  const toolPricing = {
    copilot: 10,
    tabnine: 12,
    codewhisperer: 19,
    custom: 0
  };

  // Productivity boost ranges
  const productivityRanges = {
    conservative: { min: 20, max: 25 },
    moderate: { min: 30, max: 40 },
    optimistic: { min: 45, max: 55 },
    custom: { min: 0, max: 100 }
  };

  function formatCurrency(amount) {
    return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function formatPercent(percent) {
    return percent.toFixed(1) + '%';
  }

  // Show/hide custom fields based on selection
  document.querySelectorAll('input[name="ai-tool"]').forEach(radio => {
    radio.addEventListener('change', function() {
      const customPrice = document.getElementById('custom-price');
      customPrice.style.display = this.value === 'custom' ? 'block' : 'none';
    });
  });

  document.querySelectorAll('input[name="productivity-boost"]').forEach(radio => {
    radio.addEventListener('change', function() {
      const customProductivity = document.getElementById('custom-productivity');
      customProductivity.style.display = this.value === 'custom' ? 'block' : 'none';
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const developersCount = parseInt(document.getElementById('developers-count').value);
    const developerSalary = parseFloat(document.getElementById('developer-salary').value);
    const workHours = parseInt(document.getElementById('work-hours').value);
    const codingPercentage = parseInt(document.getElementById('coding-percentage').value);
    const selectedTool = document.querySelector('input[name="ai-tool"]:checked').value;
    const productivityBoost = document.querySelector('input[name="productivity-boost"]:checked').value;
    const calculationPeriod = parseInt(document.getElementById('calculation-period').value);

    // Additional factors
    const includeTraining = document.getElementById('include-training').checked;
    const includeSetup = document.getElementById('include-setup').checked;
    const reducedBugs = document.getElementById('reduced-bugs').checked;

    // Calculate base metrics
    const hoursPerMonth = (workHours * 52) / 12; // Average hours per month
    const codingHoursPerMonth = hoursPerMonth * (codingPercentage / 100);
    const hourlyRate = developerSalary / hoursPerMonth;

    // Get tool cost
    let toolCostPerDeveloper = toolPricing[selectedTool];
    if (selectedTool === 'custom') {
      toolCostPerDeveloper = parseFloat(document.getElementById('custom-tool-price').value) || 0;
    }

    // Get productivity improvement
    let productivityIncrease;
    if (productivityBoost === 'custom') {
      productivityIncrease = parseFloat(document.getElementById('custom-productivity-value').value) || 0;
    } else {
      const range = productivityRanges[productivityBoost];
      productivityIncrease = (range.min + range.max) / 2; // Use average of range
    }

    // Calculate savings
    const totalToolCost = toolCostPerDeveloper * developersCount * calculationPeriod;
    const savedHoursPerDeveloperPerMonth = codingHoursPerMonth * (productivityIncrease / 100);
    const totalSavedHours = savedHoursPerDeveloperPerMonth * developersCount * calculationPeriod;
    const savedAmount = totalSavedHours * hourlyRate;

    // Additional costs
    let additionalCosts = 0;
    if (includeTraining) {
      additionalCosts += 500 * developersCount;
    }
    if (includeSetup) {
      additionalCosts += 200;
    }

    // Bug reduction savings (estimate 2 hours per bug, 1 bug per developer per month)
    let bugSavings = 0;
    if (reducedBugs) {
      const bugsPerMonth = developersCount * 1;
      const bugFixTime = 2; // hours
      const savedBugHours = bugsPerMonth * bugFixTime * 0.15 * calculationPeriod; // 15% reduction
      bugSavings = savedBugHours * hourlyRate;
    }

    const totalCosts = totalToolCost + additionalCosts;
    const totalSavings = savedAmount + bugSavings;
    const netSavings = totalSavings - totalCosts;
    const roi = totalCosts > 0 ? ((totalSavings - totalCosts) / totalCosts) * 100 : 0;

    // Generate detailed breakdown
    const toolNames = {
      copilot: 'GitHub Copilot',
      tabnine: 'TabNine Pro',
      codewhisperer: 'Amazon CodeWhisperer',
      custom: 'Власний інструмент'
    };

    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>💰 Чиста економія</h6>
          <div style="font-size: 2em; font-weight: bold; color: #28a745;">
            ${formatCurrency(netSavings)}
          </div>
          <small>за ${calculationPeriod} міс.</small>
        </div>
        
        <div class="insight-card info">
          <h6>📈 ROI</h6>
          <div style="font-size: 2em; font-weight: bold; color: var(--accent);">
            ${formatPercent(roi)}
          </div>
          <small>повернення інвестицій</small>
        </div>
        
        <div class="insight-card">
          <h6>⏱️ Заощаджений час</h6>
          <div style="font-size: 1.5em; font-weight: bold;">
            ${totalSavedHours.toLocaleString()} годин
          </div>
          <small>${(totalSavedHours / developersCount / calculationPeriod).toFixed(1)} год/розроб/міс</small>
        </div>
        
        <div class="insight-card warning">
          <h6>💸 Загальні витрати</h6>
          <div style="font-size: 1.5em; font-weight: bold;">
            ${formatCurrency(totalCosts)}
          </div>
          <small>інструменти + впровадження</small>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h3>📊 Детальний розрахунок</h3>
        
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>💡 Параметри розрахунку</h4>
          <ul style="margin: 0.5rem 0;">
            <li><strong>Інструмент:</strong> ${toolNames[selectedTool]} (${formatCurrency(toolCostPerDeveloper)}/міс на розробника)</li>
            <li><strong>Команда:</strong> ${developersCount} розробників</li>
            <li><strong>Підвищення продуктивності:</strong> ${formatPercent(productivityIncrease)}</li>
            <li><strong>Час на кодинг:</strong> ${codingHoursPerMonth.toFixed(1)} год/міс на розробника</li>
            <li><strong>Ставка:</strong> ${formatCurrency(hourlyRate)}/година</li>
          </ul>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>💰 Структура витрат</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;"><strong>Вартість інструментів</strong></td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(totalToolCost)}</td>
            </tr>
            ${includeTraining ? `
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">Навчання команди</td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(500 * developersCount)}</td>
            </tr>` : ''}
            ${includeSetup ? `
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">Налаштування</td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(200)}</td>
            </tr>` : ''}
            <tr style="border-bottom: 2px solid var(--border); font-weight: bold;">
              <td style="padding: 0.5rem;"><strong>Загальні витрати</strong></td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(totalCosts)}</td>
            </tr>
          </table>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>💚 Структура економії</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;"><strong>Економія від продуктивності</strong></td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(savedAmount)}</td>
            </tr>
            ${reducedBugs ? `
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">Економія від зменшення багів</td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(bugSavings)}</td>
            </tr>` : ''}
            <tr style="border-bottom: 2px solid var(--border); font-weight: bold;">
              <td style="padding: 0.5rem;"><strong>Загальна економія</strong></td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(totalSavings)}</td>
            </tr>
          </table>
        </div>

        <div style="background: ${netSavings > 0 ? '#f8fff9' : '#fff8f8'}; padding: 1.5rem; border-radius: 12px; margin: 1rem 0; border: 2px solid ${netSavings > 0 ? '#28a745' : '#dc3545'};">
          <h4 style="color: ${netSavings > 0 ? '#28a745' : '#dc3545'};">
            ${netSavings > 0 ? '✅' : '❌'} Підсумок за ${calculationPeriod} місяців
          </h4>
          <p style="font-size: 1.2em; margin: 0.5rem 0;">
            <strong>Чиста економія: ${formatCurrency(netSavings)}</strong>
          </p>
          <p style="margin: 0.5rem 0;">
            Повернення інвестицій: <strong>${formatPercent(roi)}</strong>
          </p>
          ${netSavings > 0 ? 
            `<p style="margin: 0.5rem 0; color: #28a745;">💡 Інвестиція окупиться за ${(totalCosts / (totalSavings / calculationPeriod)).toFixed(1)} місяців</p>` :
            `<p style="margin: 0.5rem 0; color: #dc3545;">⚠️ При поточних параметрах інвестиція не окупається</p>`
          }
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>📈 Щомісячні показники</h4>
          <ul style="margin: 0.5rem 0;">
            <li><strong>Економія на місяць:</strong> ${formatCurrency(totalSavings / calculationPeriod)}</li>
            <li><strong>Витрати на місяць:</strong> ${formatCurrency(totalToolCost / calculationPeriod)}</li>
            <li><strong>Чистий прибуток на місяць:</strong> ${formatCurrency((totalSavings - totalToolCost) / calculationPeriod)}</li>
            <li><strong>Заощаджений час на місяць:</strong> ${(totalSavedHours / calculationPeriod).toFixed(0)} годин</li>
          </ul>
        </div>
      </div>
    `;
  });
});