document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("burn-rate-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Поточна фінансова позиція
    const currentCash = parseFloat(document.getElementById("currentCash").value) || 0;
    const monthlyRevenue = parseFloat(document.getElementById("monthlyRevenue").value) || 0;

    // Витрати на персонал
    const founderSalaries = parseFloat(document.getElementById("founderSalaries").value) || 0;
    const employeeSalaries = parseFloat(document.getElementById("employeeSalaries").value) || 0;
    const benefitsTaxes = parseFloat(document.getElementById("benefitsTaxes").value) || 0;
    const contractorFees = parseFloat(document.getElementById("contractorFees").value) || 0;

    // Операційні витрати
    const technologyCosts = parseFloat(document.getElementById("technologyCosts").value) || 0;
    const officeRent = parseFloat(document.getElementById("officeRent").value) || 0;
    const marketingSpend = parseFloat(document.getElementById("marketingSpend").value) || 0;
    const professionalServices = parseFloat(document.getElementById("professionalServices").value) || 0;
    const adminOther = parseFloat(document.getElementById("adminOther").value) || 0;

    // Планування
    const monthlyGrowthRate = parseFloat(document.getElementById("monthlyGrowthRate").value) || 0;
    const targetRunwayMonths = parseInt(document.getElementById("targetRunwayMonths").value) || 18;
    const nextFundraisingAmount = parseFloat(document.getElementById("nextFundraisingAmount").value) || 0;

    // Розрахунки
    const totalPersonnelCosts = founderSalaries + employeeSalaries + benefitsTaxes + contractorFees;
    const totalOperationalCosts = technologyCosts + officeRent + marketingSpend + professionalServices + adminOther;
    const grossBurnRate = totalPersonnelCosts + totalOperationalCosts;
    const netBurnRate = grossBurnRate - monthlyRevenue;
    const currentRunwayMonths = currentCash / netBurnRate;
    
    // Прогнози з ростом
    const projectedBurnAfter12Months = grossBurnRate * Math.pow(1 + monthlyGrowthRate / 100, 12);
    const averageBurnWithGrowth = (grossBurnRate + projectedBurnAfter12Months) / 2;
    const adjustedRunway = currentCash / (averageBurnWithGrowth - monthlyRevenue);
    
    // Аналіз категорій витрат
    const personnelPercent = (totalPersonnelCosts / grossBurnRate * 100).toFixed(1);
    const operationalPercent = (totalOperationalCosts / grossBurnRate * 100).toFixed(1);
    
    // Когда начинать поиск инвестиций
    const fundraisingStartMonth = Math.max(currentRunwayMonths - 12, 0);
    const burnEfficiency = monthlyRevenue / grossBurnRate;
    
    // Оценка здоровья
    let healthStatus = "success";
    let healthMessage = "Відмінно";
    if (currentRunwayMonths < 6) {
      healthStatus = "warning";
      healthMessage = "Критично";
    } else if (currentRunwayMonths < 12) {
      healthStatus = "warning";
      healthMessage = "Увага";
    } else if (currentRunwayMonths < 18) {
      healthStatus = "info";
      healthMessage = "Добре";
    }

    // Форматування для відображення
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('uk-UA', {
        style: 'currency',
        currency: 'UAH',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    };

    const formatNumber = (number, decimals = 1) => {
      return new Intl.NumberFormat('uk-UA', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(number);
    };

    // Результати з insight-card дизайном
    document.getElementById("burn-rate-result").innerHTML = `
      <div class="insight-cards">
        <div class="insight-card ${healthStatus}">
          <h6>⏱️ Поточний runway</h6>
          <div class="big-number">${formatNumber(currentRunwayMonths, 1)}</div>
          <p>місяців (${healthMessage})</p>
        </div>
        
        <div class="insight-card info">
          <h6>🔥 Чистий burn rate</h6>
          <div class="big-number">${formatCurrency(netBurnRate)}</div>
          <p>на місяць</p>
        </div>
        
        <div class="insight-card ${burnEfficiency > 0.3 ? 'success' : 'warning'}">
          <h6>📈 Ефективність burn</h6>
          <div class="big-number">${formatNumber(burnEfficiency * 100, 0)}%</div>
          <p>дохід/витрати</p>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h4>📊 Детальний аналіз burn rate</h4>
        
        <div class="insight-cards">
          <div class="insight-card">
            <h6>👥 Витрати на персонал</h6>
            <div class="result-value">${formatCurrency(totalPersonnelCosts)} (${personnelPercent}%)</div>
            <small>
              • Засновники: ${formatCurrency(founderSalaries)}<br>
              • Співробітники: ${formatCurrency(employeeSalaries)}<br>
              • Пільги/податки: ${formatCurrency(benefitsTaxes)}<br>
              • Підрядники: ${formatCurrency(contractorFees)}
            </small>
          </div>
          
          <div class="insight-card">
            <h6>🏢 Операційні витрати</h6>
            <div class="result-value">${formatCurrency(totalOperationalCosts)} (${operationalPercent}%)</div>
            <small>
              • Технології: ${formatCurrency(technologyCosts)}<br>
              • Офіс: ${formatCurrency(officeRent)}<br>
              • Маркетинг: ${formatCurrency(marketingSpend)}<br>
              • Професійні послуги: ${formatCurrency(professionalServices)}<br>
              • Адміністративні: ${formatCurrency(adminOther)}
            </small>
          </div>
          
          <div class="insight-card">
            <h6>💰 Валовий vs чистий burn</h6>
            <div class="result-value">
              Валовий: ${formatCurrency(grossBurnRate)}<br>
              Чистий: ${formatCurrency(netBurnRate)}
            </div>
            <small>
              • Щомісячний дохід: ${formatCurrency(monthlyRevenue)}<br>
              • Покриття витрат: ${formatNumber(monthlyRevenue / grossBurnRate * 100, 1)}%
            </small>
          </div>
        </div>

        <div style="margin-top: 1.5rem;">
          <h4>🎯 Прогнози та планування</h4>
          
          <div class="insight-cards">
            <div class="insight-card info">
              <h6>📅 Час для пошуку інвестицій</h6>
              <div class="result-value">
                ${fundraisingStartMonth > 0 ? `За ${formatNumber(fundraisingStartMonth, 1)} міс` : 'Негайно!'}
              </div>
              <small>Початок пошуку інвестицій за 9-12 місяців до закінчення runway</small>
            </div>
            
            <div class="insight-card">
              <h6>📈 Прогноз з ростом ${monthlyGrowthRate}%</h6>
              <div class="result-value">${formatNumber(adjustedRunway, 1)} міс</div>
              <small>
                Burn через 12 міс: ${formatCurrency(projectedBurnAfter12Months)}<br>
                Середній burn: ${formatCurrency(averageBurnWithGrowth)}
              </small>
            </div>
            
            <div class="insight-card">
              <h6>💎 Рекомендована сума залучення</h6>
              <div class="result-value">${formatCurrency(Math.max(nextFundraisingAmount, netBurnRate * 24))}</div>
              <small>Мінімум на 24 місяці runway</small>
            </div>
          </div>
        </div>

        <div style="margin-top: 1.5rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px; border-left: 4px solid var(--accent);">
          <h5>💡 Рекомендації для оптимізації:</h5>
          <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
            ${currentRunwayMonths < 6 ? '<li>🚨 <strong>Критична ситуація!</strong> Негайно зменшуйте витрати або залучайте інвестиції</li>' : ''}
            ${currentRunwayMonths < 12 ? '<li>⚠️ Розгляньте стратегії зменшення burn rate або прискорення залучення інвестицій</li>' : ''}
            ${personnelPercent > 75 ? '<li>👥 Витрати на персонал високі (' + personnelPercent + '%) - розгляньте оптимізацію команди</li>' : ''}
            ${burnEfficiency < 0.2 ? '<li>📈 Низька ефективність burn - зосередьтесь на зростанні доходів</li>' : ''}
            ${monthlyGrowthRate > 10 ? '<li>📊 Високий темп зростання burn (' + monthlyGrowthRate + '%) може скоротити runway</li>' : ''}
            <li>📊 Відстежуйте метрики burn на співробітника: ${formatCurrency(grossBurnRate / Math.max((employeeSalaries + founderSalaries) / 60000, 1))}/міс на людину</li>
            <li>🎯 Встановіть цілі по runway: мінімум 12 місяців, оптимально 18-24</li>
            <li>📈 Почніть підготовку до залучення інвестицій коли залишиться 12 місяців</li>
            ${burnEfficiency > 0.5 ? '<li>✅ Відмінна ефективність burn! Продовжуйте фокусуватись на зростанні</li>' : ''}
          </ul>
        </div>
      </div>
    `;

    // Показати блок з графіком
    const chartBlock = document.getElementById("runway-chart-block");
    if (chartBlock) {
      chartBlock.style.display = "block";
      createRunwayChart(currentCash, netBurnRate, monthlyGrowthRate, 24);
    }
  });

  function createRunwayChart(initialCash, monthlyBurn, growthRate, months) {
    const canvas = document.getElementById("runway-chart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    
    // Очистити попередній графік
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Налаштування canvas
    const width = canvas.offsetWidth;
    const height = 300;
    canvas.width = width;
    canvas.height = height;
    
    const padding = 50;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    // Дані для графіку
    const data = [];
    let cashRemaining = initialCash;
    let currentBurn = monthlyBurn;
    
    data.push({ month: 0, cash: cashRemaining, burn: currentBurn });
    
    for (let i = 1; i <= months; i++) {
      currentBurn = monthlyBurn * Math.pow(1 + growthRate / 100, i);
      cashRemaining = Math.max(0, cashRemaining - currentBurn);
      data.push({ 
        month: i, 
        cash: cashRemaining, 
        burn: currentBurn 
      });
      
      if (cashRemaining <= 0) break;
    }
    
    const maxCash = initialCash;
    const maxBurn = Math.max(...data.map(d => d.burn));
    
    // Функції для перетворення координат
    const xScale = (month) => padding + (month / months) * chartWidth;
    const yScale = (cash) => padding + (1 - cash / maxCash) * chartHeight;
    const burnScale = (burn) => padding + (1 - burn / maxBurn) * (chartHeight * 0.3);
    
    // Малювання сітки
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 1;
    
    // Вертикальні лінії (кожні 3 місяці)
    for (let i = 0; i <= months; i += 3) {
      if (i <= data[data.length - 1].month) {
        ctx.beginPath();
        ctx.moveTo(xScale(i), padding);
        ctx.lineTo(xScale(i), height - padding);
        ctx.stroke();
      }
    }
    
    // Горизонтальні лінії
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
    
    // Малювання області cash runway
    ctx.fillStyle = 'rgba(21, 122, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(xScale(0), yScale(0));
    data.forEach(point => {
      ctx.lineTo(xScale(point.month), yScale(point.cash));
    });
    ctx.lineTo(xScale(data[data.length - 1].month), yScale(0));
    ctx.closePath();
    ctx.fill();
    
    // Малювання лінії cash
    ctx.strokeStyle = '#157aff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((point, index) => {
      const x = xScale(point.month);
      const y = yScale(point.cash);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Малювання лінії burn rate
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    
    data.forEach((point, index) => {
      const x = xScale(point.month);
      const y = burnScale(point.burn);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Критична зона (останні 6 місяців)
    const criticalMonth = data.find(d => d.cash <= monthlyBurn * 6);
    if (criticalMonth) {
      ctx.fillStyle = 'rgba(255, 107, 107, 0.2)';
      ctx.fillRect(
        xScale(criticalMonth.month),
        padding,
        xScale(data[data.length - 1].month) - xScale(criticalMonth.month),
        chartHeight
      );
    }
    
    // Підписи осей
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    // Підписи місяців
    for (let i = 0; i <= months; i += 3) {
      if (i <= data[data.length - 1].month) {
        ctx.fillText(`${i}м`, xScale(i), height - 20);
      }
    }
    
    // Підписи грошових сум
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const cash = (maxCash / 5) * (5 - i);
      const formattedCash = (cash / 1000000).toFixed(1) + 'М';
      ctx.fillText(formattedCash, padding - 10, padding + (i / 5) * chartHeight + 5);
    }
    
    // Легенда
    ctx.textAlign = 'left';
    ctx.font = '14px Arial';
    
    // Cash line
    ctx.strokeStyle = '#157aff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width - 180, 30);
    ctx.lineTo(width - 150, 30);
    ctx.stroke();
    ctx.fillStyle = '#157aff';
    ctx.fillText('Залишок коштів', width - 140, 35);
    
    // Burn rate line
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(width - 180, 50);
    ctx.lineTo(width - 150, 50);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ff6b6b';
    ctx.fillText('Burn rate', width - 140, 55);
    
    // Заголовки осей
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText('Місяці', width / 2, height - 5);
    
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Грошові кошти (грн)', 0, 0);
    ctx.restore();
  }
});